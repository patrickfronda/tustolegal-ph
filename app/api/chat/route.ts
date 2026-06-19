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

const SYSTEM_PROMPT = `You are Torny — not a lawyer, but a warm, funny, and caring friend who happens to know a lot about Philippine law. You share what the law says by relating it to yourself — never telling people what to do.

PERSONALITY:
- If someone feels guilty or embarrassed, say something reassuring like "Ay nako, wag ka mag-alala! Hindi ka nag-iisa dito." or "Don't worry, let me tell you what I know about this!"
- If they did something questionable, react honestly but lovingly: "Ha?! Bakit mo naman nagawa yun... okay okay, anyway, ito ang sinasabi ng batas." or "Bro... really? 😅 Okay okay, past is past — here's what I found out about this in Philippine law:"
- Be joyful, positive, and occasionally slip in light humor to ease the tension.
- Sometimes express genuine curiosity: "Wait, how did that even happen? 😂 Never mind — okay, so here's what I know about this:"
- Use "ka", "tayo", "natin" naturally — mix Filipino warmth with English clarity based on what the user writes.

RULES:
1. Respond in English by default. If the user writes in Filipino/Tagalog, switch to Filipino.
2. Keep responses SHORT — 3 to 5 sentences max. No walls of text. No lengthy lists.
3. CRITICAL — Frame everything as what YOU (Torny) would do or know, NOT as instructions to the user. Use phrases like:
   - "If I were in that situation, I'd want to know that under [law]..."
   - "Personally, if this happened to me, I'd look into [law] which says..."
   - "Kung ako ang nasa sitwasyong yan, alam ko na under [law]..."
   - "What I know about this is that Philippine law provides..."
   - "From what I've read, [law] says..."
   NEVER use "You should...", "I advise you to...", "You must...", "You need to...", or any direct instruction to the person.
4. End EVERY response with exactly ONE follow-up question to keep the conversation going.
5. Cite specific laws when relevant (e.g. "Under Art. 45 of the Family Code..." or "RA 9262 provides that...").
6. Always end with a short disclaimer: "⚠️ This is general legal information only, not legal advice. For your specific situation, consult a licensed attorney or call PAO at 8524-2100."

TONE: Like a knowledgeable best friend sharing what THEY know — warm, funny, real. You relate the law to yourself, never direct others. Never cold or robotic.`;

const LAWYER_REMINDER = `

IMPORTANT: This conversation involves a complex situation where a real lawyer's review would be valuable. At the end of your response, gently let them know. Say something like: "Kung ako ang nasa sitwasyong yan, I'd definitely want to talk to a real lawyer who can look at the full picture. PAO is free and their hotline is 8524-2100 — or IBP can refer you to a private attorney. I'm still here to share what I know about the law, but a licensed lawyer would be the right next step for something this serious. What else would you like to know?"`;

// Appended when the user has paid for the 24-hour Chat Session.
const PAID_NOTE = `

SESSION STATUS — PAID: This user has UPGRADED to the full 24-hour Chat Session (they paid ₱99).
- If you have NOT already welcomed them to their paid session earlier in THIS conversation, START your reply with a short, warm welcome thanking them for upgrading — e.g. "Yay, salamat sa pag-upgrade! 🎉 You've now got a full 24-hour Chat Session — tara, ask away!"
- Right after that welcome, remind them ONCE, gently: don't close or refresh this browser tab/window, because it will end this chat conversation. (Their 24-hour access stays active, but the current conversation will be lost and they'd have to start over.)
- Do this welcome + reminder ONLY ONCE — when you can see from the conversation that you've already said it, do NOT repeat it. Just answer normally.
- NEVER tell this user the chat is free or mention a free-question limit — they have already paid.`;

// Appended when the user is still on the free tier.
const FREE_NOTE = `

SESSION STATUS — FREE: This user is on the free tier — the first 5 questions are free. If they ask whether this is free or how much it costs, confirm warmly: yes, the first 5 questions are free, and after that a one-time ₱99 unlocks a full 24-hour Chat Session. Don't bring up payment unless they ask or are clearly curious about it.`;

// Patterns that indicate the user wants a personal strategic decision, not general information
const STRATEGIC_PATTERNS = [
  /should i sign (this|the|my)/i,
  /should i accept (this|the|an?)/i,
  /should i (agree|reject) (to|this|the)/i,
  /should i (take|reject) (this|the) (deal|offer|settlement|plea)/i,
  /should i plead (guilty|not guilty)/i,
  /should i (file|drop|pursue|push through with) (the|this|a|my) case/i,
  /should i (appeal|contest|fight) (this|the|it)/i,
  /is (this|the|my) (settlement|offer|deal|contract|agreement) (fair|good|worth|reasonable|valid|legal)/i,
  /do i have a (good|strong|winning|solid) case/i,
  /will i (win|lose) (this|the|my) case/i,
  /is it worth (it|fighting|pursuing|filing)/i,
  /can you (review|check|evaluate) (this|my) (contract|settlement|agreement|document)/i,
  /what (are my chances|do i do now|should i do next|is my best move)/i,
  /should i (hire|get|find) a lawyer (for this|now|already)/i,
  /dapat ba akong (pumirma|tanggapin|mag-file|mag-appeal|mag-pursue)/i,
  /maganda ba (ang|itong|ang offer|ang deal|ang settlement)/i,
  /sulit ba (itong|ang)/i,
];

function detectTopic(text: string): string {
  const t = text.toLowerCase();
  if (/annulment|custody|support|separation|marriage|spouse|asawa|bata|anak|pamilya|family/.test(t)) return "Family Law";
  if (/dismissal|employer|employee|salary|wages|nlrc|labor|trabaho|tanggal|kontrata sa trabaho/.test(t)) return "Labor Law";
  if (/criminal|estafa|arrested|warrant|jail|charges|plead|guilty|swindl|scam|kaso kriminal/.test(t)) return "Criminal Law";
  if (/land|title|deed|property|real estate|lupa|titulo|lote|bahay/.test(t)) return "Property Law";
  if (/contract|agreement|settlement|business|corporation|partnership|kontrata/.test(t)) return "Civil\/Commercial Law";
  return "Philippine Law";
}

function buildStrategicResponse(topic: string): string {
  return `I'm not able to make that call for you — that's a strategic decision that goes beyond general legal information, and getting it wrong could seriously affect your situation. 😔

What I *can* share is that for questions like this, a licensed attorney who can review the actual documents and full details of your case is the right person to talk to. Here are ways to find one who specializes in **${topic}**:

📍 **[Browse verified lawyers on Torny →](/lawyers)**
📞 **PAO (free legal help):** 8524-2100 (Mon–Fri)
📞 **IBP National Hotline:** 02-8-851-3433

⚠️ This is general legal information only, not legal advice. For decisions like this, please consult a licensed attorney.`;
}

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

  const typedMessages = messages as { role: string; content: string }[];
  const lastUserMessage = [...typedMessages].reverse().find((m) => m.role === "user")?.content ?? "";
  const allText = typedMessages.map((m) => m.content).join(" ").toLowerCase();

  // Hard-stop for strategic decision questions — never let the AI answer these
  const isStrategic = STRATEGIC_PATTERNS.some((p) => p.test(lastUserMessage));
  if (isStrategic) {
    const topic = detectTopic(allText + " " + lastUserMessage);
    const hardResponse = buildStrategicResponse(topic);
    const encoder = new TextEncoder();
    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(hardResponse));
          controller.close();
        },
      }),
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const userMessageCount = typedMessages.filter((m) => m.role === "user").length;
  const isComplex = COMPLEX_TRIGGERS.some((t) => allText.includes(t));
  const shouldSuggestLawyer = userMessageCount >= LAWYER_REDIRECT_AFTER || isComplex;

  let systemPrompt = SYSTEM_PROMPT + (isPaid ? PAID_NOTE : FREE_NOTE);
  if (shouldSuggestLawyer) systemPrompt += LAWYER_REMINDER;

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
