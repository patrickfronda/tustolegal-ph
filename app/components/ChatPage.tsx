"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import {
  Send, Loader2, ChevronRight, AlertCircle,
  Phone, Copy, Check, Plus, MessageSquare, X, Menu, CreditCard, Home, Download,
} from "lucide-react";
import { TORNY_SRC, TORNY_STYLE } from "@/app/lib/torny-src";

const FREE_LIMIT = 5;
const ACCESS_TOKEN_KEY = "tustolegal_access";
const USER_ID_KEY = "torny_uid";
const SESSION_KEY = "torny_qs";
const DISCLAIMER_KEY = "torny_disclaimer_accepted";
const MESSAGES_KEY = "torny_messages";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getPlanFromToken(token: string | null): "basic" | "plus" | null {
  if (!token) return null;
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(b64);
    const parts = decoded.split(":");
    if (parts.length !== 4) return null;
    const p = parts[2];
    return p === "basic" || p === "plus" ? p : null;
  } catch { return null; }
}

const NAME_PARTS = {
  adjectives: ["Happy", "Sunny", "Brave", "Clever", "Jolly", "Mighty", "Cozy", "Lucky", "Speedy", "Gentle"],
  fruits:     ["Mango", "Lemon", "Berry", "Melon", "Peach", "Guava", "Apple", "Grape", "Papaya", "Kiwi"],
  animals:    ["Bunny", "Panda", "Otter", "Puppy", "Koala", "Duckling", "Hamster", "Penguin", "Fox", "Lamb"],
};

function randomAdviserName() {
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const style = Math.floor(Math.random() * 3);
  if (style === 0) return `${pick(NAME_PARTS.adjectives)} ${pick(NAME_PARTS.animals)}`;
  if (style === 1) return `${pick(NAME_PARTS.fruits)} ${pick(NAME_PARTS.animals)}`;
  return `${pick(NAME_PARTS.adjectives)} ${pick(NAME_PARTS.fruits)}`;
}

type Role = "user" | "assistant";
interface Message { role: Role; content: string }

const CATEGORIES = [
  { emoji: "👨‍👩‍👧", label: "Batas sa Pamilya",        prompt: "What are my rights under the Family Code of the Philippines?" },
  { emoji: "💼", label: "Batas sa Paggawa",        prompt: "What are my rights as an employee in the Philippines?" },
  { emoji: "🔒", label: "Batas Kriminal",           prompt: "What are my rights when arrested by the police?" },
  { emoji: "🏠", label: "Batas sa Ari-arian",       prompt: "How do I get or transfer a land title in the Philippines?" },
  { emoji: "📜", label: "Konstitusyonal na Karapatan", prompt: "What are my constitutional rights under the 1987 Constitution?" },
  { emoji: "⚖️", label: "Batas Sibil",              prompt: "How do I file a small claims case in court?" },
  { emoji: "✈️", label: "Karapatan ng OFW",         prompt: "What are the rights of OFWs under Philippine law?" },
  { emoji: "🤝", label: "Katarungang Pambarangay",  prompt: "How does the Katarungang Pambarangay system work?" },
];

const SUGGESTED_EN = [
  "How do I file for annulment in the Philippines?",
  "What are my rights when arrested by the police?",
  "How do I file an illegal dismissal complaint?",
  "How can I get a free lawyer from PAO?",
  "How do I file a VAWC complaint?",
  "What is small claims court and how do I use it?",
];

const SUGGESTED_FIL = [
  "Paano mag-file ng annulment sa Pilipinas?",
  "Ano ang aking mga karapatan kapag inaresto ng pulis?",
  "Paano mag-reklamo ng illegal dismissal?",
  "Paano makakakuha ng abogado sa PAO?",
  "Paano mag-file ng VAWC complaint?",
  "Ano ang small claims court at paano ito gamitin?",
];

function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="bg-blue-50 text-[#1e3a7b] px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch)
      return <Link key={i} href={linkMatch[2]} className="text-[#1e3a7b] underline font-semibold hover:text-blue-800">{linkMatch[1]}</Link>;
    return part;
  });
}

function MarkdownBody({ text }: { text: string }) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { nodes.push(<div key={i} className="h-2" />); i++; continue; }
    if (line.startsWith("## ") || line.startsWith("### ")) {
      const level = line.startsWith("### ") ? 4 : 3;
      const content = line.replace(/^#{2,3}\s/, "");
      nodes.push(<p key={i} className={`font-bold text-[#1e3a7b] ${level === 3 ? "text-sm mt-3 mb-1" : "text-xs mt-2"}`}>{parseInline(content)}</p>);
      i++; continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s/, "")); i++; }
      nodes.push(<ol key={i} className="list-decimal list-outside ml-4 space-y-1 my-1.5">{items.map((it, j) => <li key={j} className="text-sm leading-relaxed">{parseInline(it)}</li>)}</ol>);
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("• ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("• "))) { items.push(lines[i].slice(2)); i++; }
      nodes.push(<ul key={i} className="list-disc list-outside ml-4 space-y-1 my-1.5">{items.map((it, j) => <li key={j} className="text-sm leading-relaxed">{parseInline(it)}</li>)}</ul>);
      continue;
    }
    if (line.startsWith("⚠️")) {
      nodes.push(<div key={i} className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3 text-xs text-amber-800 leading-relaxed"><span className="flex-shrink-0">⚠️</span><span>{parseInline(line.slice(2).trim())}</span></div>);
      i++; continue;
    }
    nodes.push(<p key={i} className="text-sm leading-relaxed">{parseInline(line)}</p>);
    i++;
  }
  return <>{nodes}</>;
}

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }} className="p-1 rounded hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors" title="Copy">
      {ok ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 150, 300].map((d) => (<span key={d} className="w-2 h-2 rounded-full bg-[#1e3a7b]/30 animate-bounce" style={{ animationDelay: `${d}ms` }} />))}
    </div>
  );
}

const THINKING_PHRASES = [
  "Hmm, let me think on this... 🤔",
  "Checking Philippine law... 📚",
  "One sec, I've got this!",
  "Almost ready for you!",
  "Reading the fine print... 🔍",
];

function ThinkingBubble() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhraseIdx((i) => (i + 1) % THINKING_PHRASES.length), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-[#1e3a7b] mt-1 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={TORNY_SRC} alt="Torny" className="w-full h-full object-cover" style={TORNY_STYLE} />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <TypingDots />
        <p className="text-[11px] text-gray-400 italic mt-1">{THINKING_PHRASES[phraseIdx]}</p>
      </div>
    </div>
  );
}

function DisclaimerModal({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#1e3a7b]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TORNY_SRC} alt="Torny" className="w-full h-full object-cover" style={TORNY_STYLE} />
          </div>
        </div>
        <h2 className="text-xl font-extrabold text-center text-[#1e3a7b] mb-1">Before we start 👋</h2>
        <p className="text-center text-gray-500 text-sm mb-4">Please read this carefully.</p>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 space-y-2 text-sm text-gray-700">
          <p>⚖️ <strong>Torny AI is not a lawyer</strong> and cannot give legal advice.</p>
          <p>📚 Everything I share is <strong>general legal information</strong> based on Philippine law — not a substitute for professional legal counsel.</p>
          <p>🔒 For serious cases (criminal, custody, land disputes), please consult a licensed attorney or call <strong>PAO at 8524-2100</strong> for free legal help.</p>
          <p>✅ By continuing, you confirm you understand these limitations.</p>
        </div>
        <label className="flex items-start gap-2.5 mb-5 cursor-pointer">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-gray-300 flex-shrink-0 accent-[#1e3a7b]" />
          <span className="text-xs text-gray-600">I understand that Torny AI provides general legal information only, not legal advice, and is not a substitute for a licensed attorney. I have read the <a href="/terms" target="_blank" className="text-[#1e3a7b] underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-[#1e3a7b] underline">Privacy Policy</a>.</span>
        </label>
        <button onClick={onAccept} disabled={!checked} className="w-full bg-[#1e3a7b] text-white font-bold py-3.5 rounded-2xl hover:bg-[#162d60] transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed">
          I Understand — Let&apos;s Chat! 🤝
        </button>
      </div>
    </div>
  );
}

function PaymentModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (token: string) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "plus" | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  function startPolling(intentId: string, plan: "basic" | "plus") {
    setWaiting(true);
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const r = await fetch(`/api/payment/verify?id=${intentId}&plan=${plan}`);
        const d = await r.json();
        if (d.token) {
          if (pollRef.current) clearInterval(pollRef.current);
          onSuccess(d.token);
          return;
        }
      } catch { /* keep waiting */ }
      if (attempts >= 100) {
        if (pollRef.current) clearInterval(pollRef.current);
        setWaiting(false);
        setErr("Hindi pa natanggap ang bayad. Kung nakabayad ka na, sandaling maghintay. Kung hindi, subukan ulit.");
      }
    }, 3000);
  }

  async function handlePay() {
    if (!selectedPlan) return;
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await res.json();
      if (data.qr && data.intentId) {
        setQr(data.qr);
        setLoading(false);
        startPolling(data.intentId, selectedPlan);
      } else {
        setErr("Could not create payment. Please try again."); setLoading(false);
      }
    } catch { setErr("Connection error. Please try again."); setLoading(false); }
  }

  const price = selectedPlan === "plus" ? "₱299" : selectedPlan === "basic" ? "₱199" : "";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
        <div className="flex justify-center mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#1e3a7b]"><img src={TORNY_SRC} alt="Torny" className="w-full h-full object-cover" style={TORNY_STYLE} /></div>
        </div>

        {qr ? (
          <>
            <h2 className="text-xl font-extrabold text-center text-[#1e3a7b] mb-1">Scan to Pay — {price}</h2>
            <p className="text-center text-gray-500 text-sm mb-3">
              I-scan ang QR gamit ang <strong>GCash, Maya,</strong> o ang app ng iyong bangko.<br />
              <span className="text-xs text-gray-400">Or i-download at i-upload sa GCash / e-wallet app.</span>
            </p>
            <div className="flex justify-center mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="QR Ph payment code" className="w-56 h-56 rounded-2xl border border-gray-200" />
            </div>
            <a href={qr} download="torny-payment-qr.png" className="w-full flex items-center justify-center gap-2 border border-[#1e3a7b] text-[#1e3a7b] font-semibold py-2.5 rounded-2xl hover:bg-[#1e3a7b]/5 transition-colors text-sm mb-3">
              <Download className="w-4 h-4" /> I-download ang QR Code
            </a>
            <div className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-[#1e3a7b] rounded-xl px-3 py-2.5 text-sm mb-3">
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              <span>Hinihintay ang bayad…</span>
            </div>
            {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-xs mb-3"><AlertCircle className="w-4 h-4 flex-shrink-0" />{err}</div>}
            <button onClick={onClose} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors">Cancel</button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-extrabold text-center text-[#1e3a7b] mb-1">You&apos;ve used your 5 free questions</h2>
            <p className="text-center text-gray-500 text-sm mb-4">Choose a plan to keep chatting with Torny.</p>

            <div className="space-y-3 mb-4">
              {/* Basic plan */}
              <button
                onClick={() => setSelectedPlan("basic")}
                className={`w-full text-left border-2 rounded-2xl p-4 transition-colors ${selectedPlan === "basic" ? "border-[#1e3a7b] bg-[#1e3a7b]/5" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#0e1f44]">Basic</span>
                  <span className="text-lg font-extrabold text-[#1e3a7b]">₱199</span>
                </div>
                <p className="text-xs text-gray-500">12-hour session · Conversation resets if you close the tab</p>
              </button>

              {/* Plus plan */}
              <button
                onClick={() => setSelectedPlan("plus")}
                className={`w-full text-left border-2 rounded-2xl p-4 transition-colors relative ${selectedPlan === "plus" ? "border-[#fcd116] bg-amber-50" : "border-gray-200 hover:border-amber-200"}`}
              >
                <div className="absolute -top-2.5 right-4 bg-[#fcd116] text-[#0e1f44] text-xs font-bold px-2.5 py-0.5 rounded-full">Best Value</div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#0e1f44]">Plus</span>
                  <span className="text-lg font-extrabold text-[#1e3a7b]">₱299</span>
                </div>
                <p className="text-xs text-gray-500">24-hour session · Conversation saved — continue even after closing the tab</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ 24 hrs</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ History saved</span>
                </div>
              </button>
            </div>

            {selectedPlan === "basic" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800">
                <p className="font-semibold mb-1">⚠️ Keep this tab open after paying</p>
                <p>Closing this tab will lose your conversation. Your 12-hour access stays active, but you&apos;ll need to start a new chat.</p>
              </div>
            )}

            <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-gray-300 flex-shrink-0 accent-[#1e3a7b]" />
              <span className="text-xs text-gray-600">I understand the session terms for my selected plan.</span>
            </label>

            {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-xs mb-3"><AlertCircle className="w-4 h-4 flex-shrink-0" />{err}</div>}
            <button onClick={handlePay} disabled={loading || !agreed || waiting || !selectedPlan} className="w-full flex items-center justify-center gap-2 bg-[#00a8e0] text-white font-bold py-3.5 rounded-2xl hover:bg-[#0090c0] transition-colors text-sm disabled:opacity-60 mb-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              {loading ? "Processing..." : selectedPlan ? `Pay with QR Ph — ${price}` : "Select a plan above"}
            </button>
            <button onClick={onClose} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors">Back to chat</button>
          </>
        )}
      </div>
    </div>
  );
}

function Sidebar({ onSelect, onClose, isFil }: { onSelect: (q: string) => void; onClose?: () => void; isFil: boolean }) {
  return (
    <aside className="flex flex-col h-full bg-[#0e1f44] text-white w-64 flex-shrink-0">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-300">{isFil ? "Mga Paksa" : "Topics"}</span>
        {onClose && <button onClick={onClose} className="p-1 rounded hover:bg-white/10"><X className="w-4 h-4" /></button>}
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {CATEGORIES.map((c) => (
          <button key={c.label} onClick={() => { onSelect(c.prompt); onClose?.(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors group">
            <span className="text-base">{c.emoji}</span>
            <span className="flex-1 leading-tight">{c.label}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1.5"><Phone className="w-3.5 h-3.5 text-[#fcd116]" /><span className="text-xs font-bold text-white">PAO Hotline</span></div>
          <p className="text-lg font-bold text-[#fcd116] tracking-wide">8524-2100</p>
          <p className="text-xs text-blue-300 mt-0.5">Mon–Fri</p>
        </div>
      </div>
    </aside>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [sessionTs, setSessionTs] = useState<number>(0);
  const [plan, setPlan] = useState<"basic" | "plus" | null>(null);
  const [senderName] = useState(randomAdviserName);
  const [lang, setLang] = useState<"en" | "fil">("en");
  const isFil = lang === "fil";
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (stored) {
      setAccessToken(stored);
      const p = getPlanFromToken(stored);
      setPlan(p);
      // Restore saved messages for Plus plan users
      if (p === "plus") {
        try {
          const savedMsgs = localStorage.getItem(MESSAGES_KEY);
          if (savedMsgs) {
            const parsed = JSON.parse(savedMsgs) as { role: string; content: string }[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMessages(parsed as Message[]);
            }
          }
        } catch { localStorage.removeItem(MESSAGES_KEY); }
      }
    }

    // Show disclaimer on first visit
    if (!localStorage.getItem(DISCLAIMER_KEY)) {
      setShowDisclaimer(true);
    }

    // Get or create persistent user ID
    let uid = localStorage.getItem(USER_ID_KEY);
    if (!uid) {
      uid = `u_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(USER_ID_KEY, uid);
    }
    setUserId(uid);

    // Restore question count with 24h expiry
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const { count, ts } = JSON.parse(raw) as { count: number; ts: number };
        if (Date.now() - ts < SESSION_TTL_MS) {
          setQuestionCount(count);
          setSessionTs(ts);
          if (count >= FREE_LIMIT && !stored) setShowPayModal(true);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }

    let sid = sessionStorage.getItem("torny_session_id");
    if (!sid) {
      sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("torny_session_id", sid);
    }
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "visit", sessionId: uid }),
    }).catch(() => {});
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Persist conversation for Plus plan
  useEffect(() => {
    if (plan === "plus" && messages.length > 0) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
  }, [messages, plan]);

  function handleDisclaimerAccept() {
    localStorage.setItem(DISCLAIMER_KEY, "1");
    setShowDisclaimer(false);
  }

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;
    setError(null);
    setSidebarOpen(false);
    const newCount = questionCount + 1;
    if (newCount > FREE_LIMIT && !accessToken) { setShowPayModal(true); return; }
    setQuestionCount(newCount);

    // Persist count to localStorage with 24h window timestamp
    const ts = sessionTs || Date.now();
    if (!sessionTs) setSessionTs(ts);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ count: newCount, ts }));

    const sid = sessionStorage.getItem("torny_session_id") ?? "";
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "question", sessionId: userId }),
    }).catch(() => {});

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsStreaming(true);
    setIsThinking(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    // Thinking delay — long enough to feel like real consideration
    await new Promise((resolve) => setTimeout(resolve, 1800 + Math.random() * 1200));

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    try {
      const res = await fetch("/api/chat", { method: "POST", headers, body: JSON.stringify({ messages: newMessages, lang, userId }) });
      if (res.status === 402) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setAccessToken(null);
        setMessages((prev) => prev.slice(0, -1));
        setShowPayModal(true);
        setIsStreaming(false);
        setIsThinking(false);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error("No body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let firstChunk = true;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (firstChunk) { setIsThinking(false); firstChunk = false; }
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => { const updated = [...prev]; updated[updated.length - 1] = { role: "assistant", content: accumulated }; return updated; });
      }
    } catch {
      setMessages((prev) => prev.slice(0, -1));
      setError(isFil ? "May problema sa koneksyon. Subukan ulit." : "Connection error. Please try again.");
    } finally {
      setIsThinking(false);
      setIsStreaming(false);
    }
  }

  function handleSubmit(e: FormEvent) { e.preventDefault(); sendMessage(input); }
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }

  const isEmpty = messages.length === 0;

  return (
    <div className={`flex flex-col h-screen ${isEmpty ? "bg-[#0e1f44]" : "bg-gray-50"} overflow-hidden`}>
      {showDisclaimer && <DisclaimerModal onAccept={handleDisclaimerAccept} />}
      {showPayModal && (
        <PaymentModal
          onClose={() => setShowPayModal(false)}
          onSuccess={(token) => {
            localStorage.setItem(ACCESS_TOKEN_KEY, token);
            setAccessToken(token);
            setPlan(getPlanFromToken(token));
            setShowPayModal(false);
          }}
        />
      )}
      {accessToken && plan === "basic" && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 text-center flex-shrink-0 z-10">
          ⚠️ Keep this tab open — closing it will lose your conversation. Your 12-hour access stays active but you&apos;ll need to start a new chat.
        </div>
      )}
      {accessToken && plan === "plus" && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2 text-xs text-green-800 text-center flex-shrink-0 z-10">
          ✅ Plus plan — your conversation is saved. You can close and reopen this tab anytime within 24 hours.
        </div>
      )}
      <header className="bg-[#0e1f44] text-white px-4 py-3 flex items-center gap-3 shadow-lg flex-shrink-0 z-10">
        <button onClick={() => setSidebarOpen((v) => !v)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"><Menu className="w-5 h-5" /></button>
        <Link href="/home" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-blue-300 hover:text-white" title="Home"><Home className="w-5 h-5" /></Link>
        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#fcd116] flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={TORNY_SRC} alt="Torny" className="w-full h-full object-cover" style={TORNY_STYLE} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base leading-tight">Torny <span className="text-[#fcd116]">AI</span></h1>
          <p className="text-blue-300 text-xs">Your 24/7 Legal Info Guide · Philippine Law</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang((l) => l === "en" ? "fil" : "en")} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 text-xs font-bold transition-colors">
            <span className={isFil ? "text-white" : "text-blue-400"}>FIL</span>
            <span className="text-blue-400/50 mx-0.5">|</span>
            <span className={!isFil ? "text-white" : "text-blue-400"}>EN</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs text-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />Online
          </div>
          {accessToken ? (
            <div className="hidden sm:flex items-center gap-1.5 bg-[#fcd116]/20 rounded-full px-3 py-1 text-xs text-[#fcd116] font-semibold">✓ Pro</div>
          ) : questionCount > 0 && (
            <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-full px-3 py-1 text-xs text-blue-200">{questionCount}/{FREE_LIMIT}</div>
          )}
          {!isEmpty && (
            <button onClick={() => { setMessages([]); localStorage.removeItem(MESSAGES_KEY); }} title={isFil ? "Bagong usapan" : "New chat"} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-full px-3 py-1.5 text-xs font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" /><span className="hidden sm:inline">{isFil ? "Bago" : "New"}</span>
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20" onClick={() => setSidebarOpen(false)} />}
        <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} flex-shrink-0`}>
          <Sidebar onSelect={sendMessage} onClose={() => setSidebarOpen(false)} isFil={isFil} />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {isEmpty ? (
              <div className="max-w-2xl mx-auto px-4 py-10 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-[#1e3a7b] shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={TORNY_SRC} alt="Torny" className="w-full h-full object-cover" style={TORNY_STYLE} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  {isFil ? <>Kamusta! Ako si <span className="text-[#fcd116]">Torny AI</span>.</> : <>Hi! I&apos;m <span className="text-[#fcd116]">Torny AI</span>.</>}
                </h2>
                <p className="text-blue-200 text-sm sm:text-base leading-relaxed mb-1 max-w-lg mx-auto">
                  {isFil ? "Your 24/7 legal info guide — nagbibigay ng pangkalahatang impormasyon tungkol sa batas ng Pilipinas. Hindi abogado si Torny, pero lagi siyang nandito para tumulong." : "Your 24/7 guide to Philippine legal information. I'm not a lawyer, but I'll help you understand your rights and options — fast, confidential, always available."}
                </p>
                <div className="flex flex-wrap justify-center gap-2 my-5 text-xs">
                  {["⚡ 24/7 Available", "🔒 Confidential", "📚 Philippine Law", isFil ? "💬 Sa Filipino" : "💬 In English"].map((f) => (
                    <span key={f} className="bg-white/10 text-blue-100 rounded-full px-3 py-1">{f}</span>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="flex items-end gap-2 mb-6">
                  <textarea ref={textareaRef} value={input} onChange={(e) => { setInput(e.target.value); autoResize(); }} onKeyDown={handleKeyDown} placeholder={isFil ? "Itanong ang iyong legal na katanungan..." : "Ask your legal question..."} rows={1} disabled={isStreaming} className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/20 focus:border-[#1e3a7b] disabled:opacity-60 overflow-hidden bg-white placeholder:text-gray-400 shadow-sm" />
                  <button type="submit" disabled={isStreaming || !input.trim()} className="flex-shrink-0 w-11 h-11 bg-[#1e3a7b] text-white rounded-full flex items-center justify-center hover:bg-[#162d60] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
                    {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
                <div className="h-1 w-24 bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126] rounded-full mx-auto mb-8" />
                <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3 text-left">{isFil ? "Mga madalas na tanong" : "Frequently asked questions"}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left mb-8">
                  {(isFil ? SUGGESTED_FIL : SUGGESTED_EN).map((q) => (
                    <button key={q} onClick={() => sendMessage(q)} className="flex items-start gap-2.5 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white hover:border-[#fcd116] hover:shadow-md hover:bg-white/20 transition-all text-left group">
                      <MessageSquare className="w-4 h-4 text-[#fcd116] flex-shrink-0 mt-0.5" />
                      <span className="flex-1 leading-snug">{q}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-blue-200 leading-relaxed max-w-md mx-auto bg-white/10 rounded-xl p-3 border border-white/20">
                  <strong className="text-white">Disclaimer:</strong> For general information only, not a substitute for official legal representation. For personal legal assistance, call <strong className="text-white">PAO: 8524-2100</strong>.
                </p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {messages.map((msg, i) => (
                  <div key={i}>
                    {msg.role === "assistant" && msg.content === "" && isStreaming ? (
                      <ThinkingBubble />
                    ) : msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-semibold text-gray-400 mr-1">{senderName}</span>
                          <div className="max-w-[80%] sm:max-w-[70%] bg-[#1e3a7b] text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-[#1e3a7b] mt-1 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={TORNY_SRC} alt="Torny" className="w-full h-full object-cover" style={TORNY_STYLE} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 ml-1">
                            <span className="text-xs font-bold text-[#1e3a7b]">Torny</span>
                            <CopyBtn text={msg.content} />
                          </div>
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm space-y-1">
                            <MarkdownBody text={msg.content} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {error && (
            <div className="mx-4 mb-2 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2.5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {!isEmpty && (
            <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-end gap-2">
                <textarea ref={textareaRef} value={input} onChange={(e) => { setInput(e.target.value); autoResize(); }} onKeyDown={handleKeyDown} placeholder={isFil ? "Itanong ang iyong legal na katanungan sa Filipino o English..." : "Ask your legal question in English or Filipino..."} rows={1} disabled={isStreaming} className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/20 focus:border-[#1e3a7b] disabled:opacity-60 overflow-hidden bg-gray-50 placeholder:text-gray-400" />
                <button type="submit" disabled={isStreaming || !input.trim()} className="flex-shrink-0 w-11 h-11 bg-[#1e3a7b] text-white rounded-full flex items-center justify-center hover:bg-[#162d60] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
                  {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-2 max-w-3xl mx-auto">
                <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 text-[10px]">Enter</kbd> {isFil ? "ipadala" : "send"} ·{" "}
                <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 text-[10px]">Shift+Enter</kbd> {isFil ? "bagong linya" : "new line"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
