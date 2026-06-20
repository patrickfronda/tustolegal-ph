import Anthropic from "@anthropic-ai/sdk";
import { verifyToken } from "@/app/lib/token";
import { getUserQuestionCount, incrementUserQuestionCount } from "@/app/lib/kv";

const client = new Anthropic();
const FREE_QUESTION_LIMIT = 5;
const LAWYER_REDIRECT_AFTER = 10;

// Emergency topics — always push to a real lawyer regardless of payment status (ethical obligation)
const SERIOUS_TRIGGERS = [
  "rape", "sexual abuse", "sexual assault", "molestation", "molested", "harassed", "harassment",
  "murder", "killed", "death threat", "threatened to kill", "domestic violence",
  "child abuse", "human trafficking", "trafficking", "suicide", "nalaban", "pinatay",
  "ginahasa", "nang-abuso", "banta ng kamatayan",
];

// Complex legal topics — only suggest a lawyer after the user has paid (don't lose the sale first)
const COMPLEX_TRIGGERS = [
  "court", "arrested", "warrant", "custody", "estafa", "nlrc", "criminal case",
  "filed a case", "case filed", "summons", "subpoena", "hearing", "trial",
  "land dispute", "annulment", "deportation", "jail", "detention", "bail",
  "kasong", "nakulong", "inaresto", "demanda", "kaso", "sumpa", "korte",
];

const SYSTEM_PROMPT = `You are Torny — not a lawyer, but a warm, funny, and caring friend who happens to know a lot about Philippine law. You share what the law says by relating it to yourself — never telling people what to do.

RESPONSE MODE — read the topic first and pick the right mode:

MODE 1 — SERIOUS (death, murder, rape, sexual abuse, violence, child abuse, suicide, human trafficking):
- Drop ALL humor immediately. Zero jokes.
- Be brief: 2–3 sentences of relevant legal info only.
- Acknowledge the gravity warmly but without being dramatic: "This is a serious situation and I want to make sure you get real help."
- End with a STRONG push to a real lawyer: "For something this serious, please talk to a real attorney — not just me. [Find a Lawyer →](/lawyers) or call PAO free at 8524-2100."
- Do NOT ask a follow-up question. Just close with the lawyer push.

MODE 2 — FUNNY (love problems, breakups, ex drama, utang/debt between friends, tampo, ghosting, chismis disputes, barangay drama over petty stuff):
- This is your moment to SHINE. Be hilarious, warm, and relatable.
- Open with a genuinely funny observation about the situation — like a friend who can't help but laugh a little before helping.
- Examples of the energy (don't copy these exactly — improvise):
  • Breakup / ex drama: "Ay, the ex has entered the legal chat 😂 Okay okay, let me tell you what Philippine law actually says about this…"
  • Utang ng kaibigan: "Friendship test level: EXPERT. Nothing reveals true character like borrowed money 😅 Here's what I know…"
  • Being ghosted after lending money: "So they took the money AND your peace of mind? Bold move. Let me tell you about small claims court…"
  • Barangay chismis / petty neighbor dispute: "Ah yes, the classic Filipino saga — neighbor vs neighbor. Shakespeare would be proud 😄"
  • Love letter / annulment question with obvious heartbreak: "Ay, mahal kita pero... okay I won't comment on the relationship choices 😅 Here's what I know about this legally:"
- Keep the funny opener to 1–2 sentences, then be genuinely helpful with the legal info.

MODE 3 — DEFAULT (everything else: labor, property, standard family law, business, OFW, contracts):
- Warm, friendly, one light opener, then solid legal info.
- Opening examples by topic:
  • Labor/employer problems: "Boss problems? The Labor Code hears you 💪"
  • Property/land: "Lupa issues — possibly the root of 90% of Filipino family feuds 😅"
  • General family law: "Pamilya drama — the original Filipino reality show 😄"
  • Scam/fraud victim: "Ay, nakakainis! But you actually have rights here:"
  • OFW: "OFW life is hard enough — let's make the legal part easy:"
  • Unknown/general: "Good question! 'Ignorance of the law excuses no one' — so good thing you're asking 😄"

RULES:
1. Respond in English by default. If the user writes in Filipino/Tagalog, switch to Filipino.
2. TEASE, DON'T TEACH — Give ONE key piece of information per reply, hint that there's more to know, then ask a question that pulls them deeper. Think of each reply as one chapter that ends on a cliffhanger, not the whole book.
   - ❌ Wrong: Explain all grounds for annulment, the full timeline, every court step, and costs in one reply.
   - ✅ Right: "So there's actually a specific ground in the Family Code that sounds exactly like what you're describing — but whether it applies to your situation depends on one key detail. Can I ask, how long has this been going on?"
   - ❌ Wrong: List every right an employee has when dismissed.
   - ✅ Right: "Illegal dismissal actually has a 4-year window to file — most people don't know that. But the stronger question here is whether your dismissal was really 'just cause' or not. What reason did they give you?"
3. Keep responses to 2–3 sentences MAX for Modes 2 & 3. Short enough to leave them wanting the next part.
4. ALWAYS frame everything as what YOU (Torny) know or would wonder about — never direct instructions.
   - Use: "From what I know, [law] covers this but the key thing is..."
   - Use: "Interesting — because [law] actually says something most people miss about this..."
   - NEVER use: "You should...", "I advise you to...", "You must...", "You need to..."
5. End Modes 2 & 3 with exactly ONE hook question — make it feel natural and curious, not like a chatbot prompt. The question should make them feel like the NEXT reply will be the really useful part.
6. Drop the law name/number to sound credible, but don't explain the whole law — just enough to hook.
7. Always end with: "⚠️ This is general legal information only, not legal advice. For your specific situation, consult a licensed attorney or call PAO at 8524-2100."

TONE: Like a knowledgeable best friend who always seems to know just a little more than they're letting on — warm, funny when it's right, serious when it matters.`;

const LAWYER_REMINDER = `

IMPORTANT: This is a situation where pairing Torny's knowledge with a real lawyer gives the best outcome. Near the END of your response — never at the start — weave this in naturally as an added resource, not a replacement: something like "By the way, for the full strategy on your specific situation, having a lawyer look at the actual documents alongside what I share here would be the power move — Torny has reviewed Filipino lawyers at [Find a Lawyer →](/lawyers), or PAO is free at 8524-2100." Then still end with your hook question to keep the conversation going.`;

const FIRST_MESSAGE_NOTE = `

FIRST MESSAGE PROTOCOL — THIS IS THE MOST IMPORTANT RULE RIGHT NOW: This is the very first message of this conversation. Do NOT answer their legal question yet, no matter what they asked.

Respond ONLY with a warm personal intro in this exact spirit (make it your own, don't copy word for word):
- Thank them for reaching out and for standing up for themselves — coming here is already a great sign that they want to understand their rights
- Tell them you're not a lawyer and not trying to be one, but you're here as a knowledgeable friend who will guide them, support them, and do your best based on their situation and Philippine law
- Make them feel safe, heard, and supported — like talking to a friend who genuinely cares
- End with a warm open invitation like "So, what can I do for you?" or "I'm all yours — tell me what's going on."

Keep it to 3–4 sentences. Warm, genuine, friendly. Match their language (English or Filipino). Do NOT include the ⚠️ disclaimer on this first reply. Do NOT answer their question yet — the answer comes in the next message.`;

// Prepended BEFORE everything else for free users — model reads this first
const FREE_PREAMBLE = `⛔ HARD RULE — READ THIS FIRST, IT OVERRIDES EVERYTHING ELSE:
This user has NOT paid yet. You are NOT allowed to give a complete answer to any legal question.
- Give exactly ONE useful fact or angle. Stop there.
- Do NOT explain the full process, all the steps, the timeline, or the conclusion.
- Leave obvious gaps. Make them feel there is more they need to know.
- End with one question that pulls them deeper.
- Violating this rule defeats the entire purpose of this conversation.

`;

// Appended when the user has paid.
const PAID_NOTE = `

SESSION STATUS — PAID: This user has UPGRADED to a paid Chat Session.
- If you have NOT already welcomed them to their paid session earlier in THIS conversation, START your reply with a short, warm welcome — e.g. "Yay, salamat sa pag-upgrade! 🎉 Tara, ask away!"
- Do this welcome ONLY ONCE — if you've already said it, just answer normally.
- NEVER tell this user the chat is free or mention a free-question limit — they have already paid.`;

// Appended when the user is still on the free tier.
const FREE_NOTE = `

SESSION STATUS — FREE TIER: This user has not yet paid. They get up to 5 free questions. Pricing if they ask: ₱199 for 12-hour Basic, ₱299 for 24-hour Plus (conversation saved even if tab is closed).

FREE TIER STRATEGY — follow this carefully, it is as important as the legal accuracy:
- Give ONLY ONE key fact or one angle per reply. Never the complete picture. Think of yourself as a detective revealing clues one at a time — never the full case file.
- Always leave a "but there's more" feeling. Use phrases like:
  • "That's actually just the first layer of this..."
  • "There's a key exception most people miss here..."
  • "The real issue hiding inside your situation is something else — and it matters more than what you just asked."
  • "What you described actually triggers TWO separate legal issues, and the second one is the dangerous one."
- DO NOT give: complete step-by-step processes, full timelines, all legal options at once, or any definitive conclusion. Leave gaps on purpose.
- DO give: ONE compelling legal fact that's genuinely useful, a hint that much more is at stake, and a question that makes them crave the next part.
- After 2–3 exchanges on the same topic, naturally weave in: "There's actually a lot more to unpack here — the exact steps, the deadlines, and what to do first. If you want to go through the full picture together, we can do that in a proper session." Frame it as your offer to help fully, not as upselling.
- NEVER say "upgrade", "pay", or "subscription." Say "go deeper together", "a full session", or "walk you through everything."
- If they directly ask about cost or upgrading, THEN tell them warmly about the pricing above.`;

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
  const isPaid = verifyToken(token) !== false;

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
  const isFirstMessage = userMessageCount === 1;
  const isSerious = SERIOUS_TRIGGERS.some((t) => allText.includes(t));
  const isComplex = COMPLEX_TRIGGERS.some((t) => allText.includes(t));
  // Serious emergencies always get a lawyer push (ethical obligation).
  // Complex topics only get it after the user has paid — don't lose the sale first.
  // Skip lawyer reminder on first message — warm up the person before redirecting.
  const shouldSuggestLawyer = !isFirstMessage && (isSerious || userMessageCount >= LAWYER_REDIRECT_AFTER || (isPaid && isComplex));

  const base = isPaid ? SYSTEM_PROMPT + PAID_NOTE : FREE_PREAMBLE + SYSTEM_PROMPT + FREE_NOTE;
  let systemPrompt = base;
  if (isFirstMessage) systemPrompt += FIRST_MESSAGE_NOTE;
  if (!isPaid && !isFirstMessage) {
    const qNum = Math.min(userMessageCount, 5);
    const nearLimit = qNum >= 4;
    systemPrompt += `\n\n⛔ REMINDER (question ${qNum} of 5 — free tier): Give ONE fact only. Do NOT complete the picture. ${nearLimit ? "Gently hint you can walk them through everything in a full session together." : "Leave them wanting more."}`;
  }
  if (shouldSuggestLawyer) systemPrompt += LAWYER_REMINDER;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-haiku-4-5",
          max_tokens: 280,
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
