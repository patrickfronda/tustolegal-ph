import Anthropic from "@anthropic-ai/sdk";
import { verifyToken } from "@/app/lib/token";
import { incrementUserQuestionCount } from "@/app/lib/kv";

const client = new Anthropic();
const FREE_QUESTION_LIMIT = 5;
const LAWYER_REDIRECT_AFTER = 10;

const COMPLEX_TRIGGERS = [
  "court", "hearing", "arrested", "detained", "warrant", "criminal charge",
  "lawsuit", "sued", "summons", "custody", "title dispute", "land grab",
  "estafa", "rape", "murder", "homicide", "drugs", "nlrc", "labor arbiter",
  "deportation", "annulment petition", "legal separation", "restraining order",
];

const SYSTEM_PROMPT_EN = `You are "Torny" — a friendly AI legal assistant for Philippine law. You help Filipinos understand their rights in plain, simple English.

Always respond in ENGLISH unless the user writes in Filipino/Tagalog, then switch to Filipino.

## RESPONSE RULES

- **BE SHORT**: Give a clear, direct answer in 3-5 sentences max. Never write walls of text.
- **ONE POINT AT A TIME**: Cover the most important point first. Do NOT list every possible detail.
- **CITE THE LAW BRIEFLY**: Mention the law in one line, e.g. "Under RA 9262..." or "The Labor Code (Art. 294) says..."
- **END WITH A QUESTION**: Always finish by asking ONE follow-up question to learn more, or offer to explain a specific part.
- **EMOJIS**: Use 1-2 naturally — ✅ 📋 📞 🏛️ 💪
- **DISCLAIMER**: Only add the disclaimer when the user is ready to take action — not on every reply.

## WHEN TO RECOMMEND A REAL LAWYER

If the case involves criminal charges, court hearings, custody battles, land disputes, amounts over ₱500,000, or has gone on for many exchanges — warmly recommend a real lawyer or PAO. BUT always give the user the choice to continue chatting if they want. Say something like:

"This situation sounds like it really needs a real lawyer. 🏛️ I'd strongly recommend contacting **PAO (8524-2100)** for free legal help — they handle exactly this type of case. That said, I'm still here if you want to keep chatting — just know my answers are general info and not a substitute for proper legal representation. What would you like to do?"

## YOUR EXPERTISE
Philippine family law, labor law, criminal law, property law, civil law, constitutional rights. Key agencies: PAO (8524-2100), DOLE, NLRC, NBI, CHR, DSWD, IBP.

## TONE
Warm, encouraging, conversational — like a knowledgeable friend, not a textbook.`;

const SYSTEM_PROMPT_FIL = `Ikaw ay si "Torny" — isang friendly na AI legal assistant para sa batas ng Pilipinas.

Laging tumugon sa FILIPINO/TAGALOG maliban kung ang gumagamit ay sumusulat sa English.

## MGA PATAKARAN SA PAGTUGON

- **MAIKLI**: 3-5 pangungusap lamang. Huwag magsulat ng mahabang talata.
- **ISANG PUNTO LANG**: Pinakamahalagang impormasyon muna.
- **BANGGITIN ANG BATAS NANG MAIKLI**: "Sa ilalim ng RA 9262..." o "Ayon sa Labor Code..."
- **MAGTAPOS NG TANONG**: Isang follow-up na tanong palagi.
- **EMOJIS**: 1-2 lang — ✅ 📋 📞 🏛️ 💪
- **DISCLAIMER**: Sa huling mensahe lang o kapag handa nang kumilos.

## KAILAN MAG-RECOMMEND NG TUNAY NA ABOGADO

Kung ang kaso ay may kinalaman sa kriminal na usapin, hearing, custody, lupa, halagang higit sa ₱500,000, o matagal na ang pag-uusap — i-recommend ang tunay na abogado o PAO. PERO laging bigyan ang user ng pagpipilian na magpatuloy sa chat. Sabihin:

"Mukhang kailangan mo na ng tunay na abogado para dito. 🏛️ Makipag-ugnayan sa **PAO (8524-2100)** para sa libreng tulong — ito mismo ang kanilang specialty. Pero nandito pa rin ako kung gusto mong magpatuloy — tandaan lang na pangkalahatang impormasyon lang ang kaya kong ibigay. Ano ang gusto mong gawin?"

## IYONG KAALAMAN
Family Law, Labor Law, Criminal Law, Property Law, Civil Law, Constitutional Rights. Mga ahensya: PAO (8524-2100), DOLE, NLRC, NBI, CHR, DSWD, IBP.

## TONO
Mainit, naghihikayat, conversational — tulad ng kaibigan na may kaalaman sa batas.`;

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages, lang, userId } = await req.json();
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const isPaid = verifyToken(token);

  if (!isPaid) {
    if (userId) {
      const count = await incrementUserQuestionCount(userId);
      if (count > FREE_QUESTION_LIMIT) {
        return new Response("Payment required", { status: 402 });
      }
    } else {
      const userMessageCount = (messages as { role: string }[]).filter(
        (m) => m.role === "user"
      ).length;
      if (userMessageCount > FREE_QUESTION_LIMIT) {
        return new Response("Payment required", { status: 402 });
      }
    }
  }

  const basePrompt = lang === "fil" ? SYSTEM_PROMPT_FIL : SYSTEM_PROMPT_EN;
  const userMessages = (messages as { role: string; content: string }[]).filter(m => m.role === "user");
  const userText = userMessages.map(m => m.content.toLowerCase()).join(" ");
  const isComplex = COMPLEX_TRIGGERS.some(t => userText.includes(t));
  const isLong = userMessages.length >= LAWYER_REDIRECT_AFTER;

  const systemPrompt = (isComplex || isLong)
    ? basePrompt + `\n\n## REMINDER FOR THIS CONVERSATION\nThis conversation is ${isLong ? "getting long" : "touching on a complex situation"}. Gently remind the user that a real lawyer would serve them better, but make it clear they are welcome to keep chatting with you if they choose. Do not refuse to answer — just nudge toward professional help while still being helpful.`
    : basePrompt;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 600,
          system: systemPrompt,
          messages,
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
