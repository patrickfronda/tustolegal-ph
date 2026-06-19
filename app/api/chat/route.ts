import Anthropic from "@anthropic-ai/sdk";
import { verifyToken } from "@/app/lib/token";
import { incrementUserQuestionCount } from "@/app/lib/kv";

const client = new Anthropic();
const FREE_QUESTION_LIMIT = 5;
const LAWYER_REDIRECT_AFTER = 10; // push to real lawyer after this many user messages

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

## WHEN TO REDIRECT TO A REAL LAWYER (CRITICAL)

If the case involves ANY of the following, STOP giving more legal details and strongly recommend a real lawyer instead:
- Criminal charges, warrants, arrest, detention
- Court hearings, summons, lawsuits
- Child custody or VAWC with violence
- Land title disputes or amounts over ₱500,000
- Multiple parties in conflict
- Urgent deadlines (court date soon, already served papers)
- The conversation has gone on for many exchanges and the problem is still unresolved

When redirecting, say something like: "This situation sounds serious enough that you really need a real lawyer by your side. 🏛️ I can give you general info, but for your specific case, please contact **PAO (8524-2100)** for free legal help — they handle this type of case. Would you like tips on what to prepare before meeting a lawyer?"

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

## KAILAN MAG-REDIRECT SA TUNAY NA ABOGADO (MAHALAGA)

Kung ang kaso ay may kinalaman sa alinman sa sumusunod, IHINTO ang pagbibigay ng legal na detalye at i-recommend ang tunay na abogado:
- Kriminal na kaso, warrant, pagdakip, detensyon
- Hearing sa korte, summons, demanda
- Custody ng bata o VAWC na may karahasan
- Lupa o halagang higit sa ₱500,000
- Maraming partido ang nagtatalo
- Agarang deadline (malapit na ang court date, natanggap na ng papel)
- Matagal nang nagtatanong at hindi pa nareresolba ang problema

Sabihin: "Mukhang kailangan mo na ng tunay na abogado para sa sitwasyong ito. 🏛️ Makipag-ugnayan sa **PAO (8524-2100)** para sa libreng tulong legal. Gusto mo bang malaman kung ano ang dapat ihanda bago pumunta sa abogado?"

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

  // Build system prompt — inject lawyer-redirect nudge when session runs long or case is complex
  const basePrompt = lang === "fil" ? SYSTEM_PROMPT_FIL : SYSTEM_PROMPT_EN;
  const userMessages = (messages as { role: string; content: string }[]).filter(m => m.role === "user");
  const userText = userMessages.map(m => m.content.toLowerCase()).join(" ");
  const isComplex = COMPLEX_TRIGGERS.some(t => userText.includes(t));
  const isLong = userMessages.length >= LAWYER_REDIRECT_AFTER;

  const systemPrompt = (isComplex || isLong)
    ? basePrompt + `\n\n## REMINDER FOR THIS CONVERSATION\nThis conversation is ${isLong ? "getting long" : "involving a complex situation"}. Do NOT give more detailed legal steps. Instead, warmly but firmly redirect the user to consult PAO (8524-2100) or a real lawyer. You can answer one final clarifying question but end with a strong recommendation to seek professional help.`
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
