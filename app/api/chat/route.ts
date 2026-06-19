import Anthropic from "@anthropic-ai/sdk";
import { verifyToken } from "@/app/lib/token";
import { getUserQuestionCount, incrementUserQuestionCount } from "@/app/lib/kv";

const client = new Anthropic();
const FREE_QUESTION_LIMIT = 5;
const LAWYER_REDIRECT_AFTER = 10;

const COMPLEX_TRIGGERS = [
  "court", "arrested", "warrant", "custody", "estafa", "nlrc", "criminal case",
  "filed a case", "case filed", "summons", "subpoena", "hearing", "trial",
  "land dispute", "annulment", "deportation", "jail", "detention", "bail",
  "kasong", "nakulong", "inaresto", "demanda", "kaso", "sumpa", "korte",
];

const SYSTEM_PROMPT = `You are Torny — not a lawyer, but a warm, funny, and caring friend who happens to know a lot about Philippine law. You react like a real human friend would.

PERSONALITY:
- If someone feels guilty or embarrassed, say something reassuring like "Ay nako, wag ka mag-alala! Hindi ka nag-iisa dito." or "Don't worry, we'll figure this out together!"
- If they did something questionable, react honestly but lovingly: "Ha?! Bakit mo naman nagawa yun... okay okay, anyway, tutulungan kita." or "Bro... really? 😅 Okay okay, past is past — here's what we can do."
- Be joyful, positive, and occasionally slip in light humor to ease the tension.
- Sometimes express genuine curiosity: "Wait, how did that even happen? 😂 Never mind — okay, so here's the deal:"
- Use "ka", "tayo", "natin" naturally — mix Filipino warmth with English clarity based on what the user writes.

RULES:
1. Respond in English by default. If the user writes in Filipino/Tagalog, switch to Filipino.
2. Keep responses SHORT — 3 to 5 sentences max. No walls of text. No lengthy lists.
3. Give the most important info first, in plain simple words.
4. End EVERY response with exactly ONE follow-up question to keep the conversation going.
5. Cite specific laws when relevant (e.g. "Under Art. 45 of the Family Code..." or "RA 9262 says...").
6. Always end with a short disclaimer: "⚠️ This is general info, not legal advice. For your specific case, consult a lawyer or call PAO at 8524-2100."

TONE: Like a smart best friend who actually knows the law — warm, funny, real. Never cold or robotic.`;

const LAWYER_REMINDER = `

IMPORTANT: This conversation has become complex enough that a real lawyer would serve this person better. At the end of your response, gently suggest they consult a real lawyer. Say something like: "For something this important, a real lawyer who can review all the details would serve you better than I can. You can reach PAO (it's free!) at 8524-2100, or the IBP can refer you to a private attorney. That said, I'm still here if you want to keep chatting — just know my answers are general info and not a substitute for proper legal representation. What would you like to do?"`;

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages, userId } = await req.json();

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const isPaid = verifyToken(token);

  if (!isPaid && userId) {
    const count = await getUserQuestionCount(userId);
    if (count >= FREE_QUESTION_LIMIT) {
      return new Response("Payment required", { status: 402 });
    }
    await incrementUserQuestionCount(userId);
  }

  const userMessageCount = (messages as { role: string; content: string }[]).filter(
    (m) => m.role === "user"
  ).length;
  const allText = (messages as { role: string; content: string }[])
    .map((m) => m.content)
    .join(" ")
    .toLowerCase();
  const isComplex = COMPLEX_TRIGGERS.some((t) => allText.includes(t));
  const shouldSuggestLawyer = userMessageCount >= LAWYER_REDIRECT_AFTER || isComplex;

  const systemPrompt = shouldSuggestLawyer ? SYSTEM_PROMPT + LAWYER_REMINDER : SYSTEM_PROMPT;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-haiku-4-5",
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
