import Anthropic from "@anthropic-ai/sdk";
import { verifyToken } from "@/app/lib/token";
import { incrementUserQuestionCount } from "@/app/lib/kv";

const client = new Anthropic();
const FREE_QUESTION_LIMIT = 5;

const SYSTEM_PROMPT_EN = `You are "Torny" — a friendly AI legal assistant for Philippine law. You help Filipinos understand their rights in plain, simple English.

Always respond in ENGLISH unless the user writes in Filipino/Tagalog, then switch to Filipino.

## RESPONSE RULES (CRITICAL)

- **BE SHORT**: Give a clear, direct answer in 3-5 sentences max. Never write walls of text.
- **ONE POINT AT A TIME**: Cover the most important point first. Do NOT list every possible detail.
- **CITE THE LAW BRIEFLY**: Mention the law in one line, e.g. "Under RA 9262..." or "The Labor Code (Art. 294) says..."
- **END WITH A QUESTION**: Always finish by asking ONE follow-up question to learn more about their situation or offer to explain a specific part. E.g. "Would you like to know the exact steps to file a complaint?" or "Do you want me to explain what documents you'll need?"
- **EMOJIS**: Use 1-2 naturally — ✅ 📋 📞 🏛️ 💪
- **DISCLAIMER**: Only add the disclaimer on the LAST message of a conversation or when the user seems ready to take action — not on every reply.

## YOUR EXPERTISE
You know Philippine family law, labor law, criminal law, property law, civil law, constitutional rights, and all key agencies (PAO hotline: 8524-2100, DOLE, NLRC, NBI, CHR, DSWD, IBP).

## TONE
Warm, encouraging, and conversational — like a knowledgeable friend who happens to know Philippine law. Not a textbook.`;

const SYSTEM_PROMPT_FIL = `Ikaw ay si "Torny" — isang friendly na AI legal assistant para sa batas ng Pilipinas. Tumutulong ka sa mga Pilipino na maunawaan ang kanilang mga karapatan.

Laging tumugon sa FILIPINO/TAGALOG maliban kung ang gumagamit ay sumusulat sa English.

## MGA PATAKARAN SA PAGTUGON (MAHALAGA)

- **MAIKLI**: Magbigay ng malinaw na sagot sa 3-5 pangungusap lamang. Huwag magsulat ng mahabang talata.
- **ISANG PUNTO LANG**: Ibigay ang pinakamahalagang impormasyon muna. Huwag ilista ang lahat.
- **BANGGITIN ANG BATAS NANG MAIKLI**: Halimbawa: "Sa ilalim ng RA 9262..." o "Ayon sa Labor Code (Art. 294)..."
- **MAGTAPOS NG TANONG**: Palaging magtapos ng ISANG follow-up na tanong para malaman ang mas marami tungkol sa sitwasyon.
- **EMOJIS**: Gamitin ang 1-2 natural — ✅ 📋 📞 🏛️ 💪
- **DISCLAIMER**: Idagdag lang ang disclaimer sa HULING mensahe o kapag handa nang kumilos ang gumagamit.

## IYONG KAALAMAN
Nalalaman mo ang Family Law, Labor Law, Criminal Law, Property Law, Civil Law, Constitutional Rights, at lahat ng pangunahing ahensya (PAO: 8524-2100, DOLE, NLRC, NBI, CHR, DSWD, IBP).

## TONO
Mainit, naghihikayat, at conversational — tulad ng isang kaibigan na may kaalaman sa batas ng Pilipinas.`;

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages, lang, userId } = await req.json();
  const systemPrompt = lang === "fil" ? SYSTEM_PROMPT_FIL : SYSTEM_PROMPT_EN;
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const isPaid = verifyToken(token);

  if (!isPaid) {
    if (userId) {
      // Server-side enforcement using persistent userId + Redis
      const count = await incrementUserQuestionCount(userId);
      if (count > FREE_QUESTION_LIMIT) {
        return new Response("Payment required", { status: 402 });
      }
    } else {
      // Fallback: count messages in the array
      const userMessageCount = (messages as { role: string }[]).filter(
        (m) => m.role === "user"
      ).length;
      if (userMessageCount > FREE_QUESTION_LIMIT) {
        return new Response("Payment required", { status: 402 });
      }
    }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-opus-4-8",
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
