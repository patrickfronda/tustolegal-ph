"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import {
  Scale, Send, Loader2, ChevronRight, AlertCircle,
  Phone, Copy, Check, Plus, MessageSquare, X, Menu, CreditCard,
} from "lucide-react";

const FREE_LIMIT = 5;
const ACCESS_TOKEN_KEY = "tustolegal_access";

type Role = "user" | "assistant";
interface Message { role: Role; content: string }

const CATEGORIES = [
  { emoji: "👨‍👩‍👧", label: "Batas sa Pamilya",        prompt: "Ano ang aking mga karapatan sa ilalim ng Family Code ng Pilipinas?" },
  { emoji: "💼", label: "Batas sa Paggawa",        prompt: "Ano ang aking mga karapatan bilang empleyado sa Pilipinas?" },
  { emoji: "🔒", label: "Batas Kriminal",           prompt: "Ano ang aking mga karapatan kapag inaresto ng pulis?" },
  { emoji: "🏠", label: "Batas sa Ari-arian",       prompt: "Paano makuha o mapalit ang land title sa Pilipinas?" },
  { emoji: "📜", label: "Konstitusyonal na Karapatan", prompt: "Ano ang aking mga karapatang konstitusyonal sa ilalim ng 1987 Constitution?" },
  { emoji: "⚖️", label: "Batas Sibil",              prompt: "Paano mag-file ng small claims case sa korte?" },
  { emoji: "✈️", label: "Karapatan ng OFW",         prompt: "Ano ang mga karapatan ng OFW sa ilalim ng batas ng Pilipinas?" },
  { emoji: "🤝", label: "Katarungang Pambarangay",  prompt: "Paano gumagana ang Katarungang Pambarangay system?" },
];

const SUGGESTED = [
  "Paano mag-file ng annulment sa Pilipinas?",
  "Ano ang aking mga karapatan kapag inaresto ng pulis?",
  "Paano mag-reklamo ng illegal dismissal?",
  "Paano makakakuha ng libreng abogado sa PAO?",
  "Paano mag-file ng VAWC complaint?",
  "Ano ang small claims court at paano ito gamitin?",
];

/* ── Inline markdown parser (no dangerouslySetInnerHTML) ── */
function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="bg-blue-50 text-[#1e3a7b] px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
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
      nodes.push(
        <p key={i} className={`font-bold text-[#1e3a7b] ${level === 3 ? "text-sm mt-3 mb-1" : "text-xs mt-2"}`}>
          {parseInline(content)}
        </p>
      );
      i++; continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s/, "")); i++; }
      nodes.push(
        <ol key={i} className="list-decimal list-outside ml-4 space-y-1 my-1.5">
          {items.map((it, j) => <li key={j} className="text-sm leading-relaxed">{parseInline(it)}</li>)}
        </ol>
      );
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("• ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("• "))) {
        items.push(lines[i].slice(2)); i++;
      }
      nodes.push(
        <ul key={i} className="list-disc list-outside ml-4 space-y-1 my-1.5">
          {items.map((it, j) => <li key={j} className="text-sm leading-relaxed">{parseInline(it)}</li>)}
        </ul>
      );
      continue;
    }

    if (line.startsWith("⚠️")) {
      nodes.push(
        <div key={i} className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3 text-xs text-amber-800 leading-relaxed">
          <span className="flex-shrink-0">⚠️</span>
          <span>{parseInline(line.slice(2).trim())}</span>
        </div>
      );
      i++; continue;
    }

    nodes.push(<p key={i} className="text-sm leading-relaxed">{parseInline(line)}</p>);
    i++;
  }
  return <>{nodes}</>;
}

/* ── Copy button ── */
function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }}
      className="p-1 rounded hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors"
      title="Kopyahin"
    >
      {ok ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

/* ── Typing indicator ── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="w-2 h-2 rounded-full bg-[#1e3a7b]/30 animate-bounce"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </div>
  );
}

/* ── Payment modal ── */
function PaymentModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handlePay() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/payment/create", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErr("Hindi ma-create ang payment. Subukan ulit.");
        setLoading(false);
      }
    } catch {
      setErr("May problema sa koneksyon. Subukan ulit.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#fcd116]/20 flex items-center justify-center">
            <Scale className="w-8 h-8 text-[#1e3a7b]" />
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-center text-[#1e3a7b] mb-1">
          Naabot mo na ang 5 libreng tanong
        </h2>
        <p className="text-center text-gray-500 text-sm mb-5">
          Mag-bayad ng isang beses para sa walang limitasyong tanong sa loob ng <strong>24 na oras</strong>.
        </p>

        <div className="bg-[#1e3a7b]/5 border border-[#1e3a7b]/15 rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-700">TustoLegal Pro Session</span>
            <span className="text-xl font-extrabold text-[#1e3a7b]">₱99</span>
          </div>
          <div className="space-y-1.5 text-sm text-gray-600">
            <p>✅ Walang limitasyong tanong (24 hrs)</p>
            <p>✅ Mabilis na AI legal na tugon</p>
            <p>✅ Nakabatay sa batas ng Pilipinas</p>
          </div>
        </div>

        {err && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-xs mb-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{err}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#00a8e0] text-white font-bold py-3.5 rounded-2xl hover:bg-[#0090c0] transition-colors text-sm disabled:opacity-60 mb-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4" />
          )}
          {loading ? "Inihahanda..." : "Bayad gamit ang GCash — ₱99"}
        </button>

        <button
          onClick={onClose}
          className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors"
        >
          Bumalik at gamitin ang 5 libreng tanong
        </button>
      </div>
    </div>
  );
}

/* ── Sidebar ── */
function Sidebar({ onSelect, onClose }: { onSelect: (q: string) => void; onClose?: () => void }) {
  return (
    <aside className="flex flex-col h-full bg-[#0e1f44] text-white w-64 flex-shrink-0">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Mga Paksa</span>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.label}
            onClick={() => { onSelect(c.prompt); onClose?.(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors group"
          >
            <span className="text-base">{c.emoji}</span>
            <span className="flex-1 leading-tight">{c.label}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Phone className="w-3.5 h-3.5 text-[#fcd116]" />
            <span className="text-xs font-bold text-white">PAO Hotline</span>
          </div>
          <p className="text-lg font-bold text-[#fcd116] tracking-wide">8524-2100</p>
          <p className="text-xs text-blue-300 mt-0.5">Libreng abogado · Lun–Biy</p>
        </div>
      </div>
    </aside>
  );
}

/* ── Main component ── */
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showPayModal, setShowPayModal] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load stored payment token on mount
  useEffect(() => {
    const stored = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (stored) setAccessToken(stored);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    // Gate at free limit — show payment modal if no valid token
    if (newCount > FREE_LIMIT && !accessToken) {
      setShowPayModal(true);
      return;
    }

    setQuestionCount(newCount);
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ messages: newMessages }),
      });
      if (res.status === 402) {
        // Token expired or invalid — clear it and show payment modal
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setAccessToken(null);
        setMessages((prev) => prev.slice(0, -1));
        setShowPayModal(true);
        setIsStreaming(false);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error("No body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: accumulated };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => prev.slice(0, -1));
      setError("May problema sa koneksyon. Subukan ulit.");
    } finally {
      setIsStreaming(false);
    }
  }

  function handleSubmit(e: FormEvent) { e.preventDefault(); sendMessage(input); }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {showPayModal && <PaymentModal onClose={() => setShowPayModal(false)} />}
      {/* ── Header ── */}
      <header className="bg-[#0e1f44] text-white px-4 py-3 flex items-center gap-3 shadow-lg flex-shrink-0 z-10">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#fcd116] flex items-center justify-center flex-shrink-0">
          <Scale className="w-5 h-5 text-[#1e3a7b]" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base leading-tight">
            TustoLegal <span className="text-[#fcd116]">PH</span>
          </h1>
          <p className="text-blue-300 text-xs">AI Abogado · Eksperto sa Batas ng Pilipinas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs text-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Online
          </div>
          {accessToken ? (
            <div className="hidden sm:flex items-center gap-1.5 bg-[#fcd116]/20 rounded-full px-3 py-1 text-xs text-[#fcd116] font-semibold">
              ✓ Pro
            </div>
          ) : questionCount > 0 && (
            <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-full px-3 py-1 text-xs text-blue-200">
              {questionCount}/{FREE_LIMIT} libre
            </div>
          )}
          {!isEmpty && (
            <button
              onClick={() => setMessages([])}
              title="Bagong usapan"
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bago</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-30 lg:z-auto
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex-shrink-0
        `}>
          <Sidebar onSelect={sendMessage} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Chat area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {isEmpty ? (
              /* Welcome screen */
              <div className="max-w-2xl mx-auto px-4 py-10 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-full bg-[#1e3a7b] flex items-center justify-center shadow-lg">
                    <Scale className="w-10 h-10 text-[#fcd116]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                  Kamusta! Ako si <span className="text-[#1e3a7b]">Abogado AI</span>.
                </h2>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-1 max-w-lg mx-auto">
                  Espesyalista ako sa batas ng Pilipinas. Tanungin mo ako tungkol sa iyong legal na
                  sitwasyon — agad, libre, at kumpidensyal.
                </p>

                <div className="flex justify-center gap-3 my-5 text-xs text-gray-400">
                  {["⚡ Instant", "🔒 Kumpidensyal", "📚 Nakabatay sa PH Law", "💬 Sa Filipino"].map((f) => (
                    <span key={f} className="bg-gray-100 rounded-full px-3 py-1">{f}</span>
                  ))}
                </div>

                {/* Hero chat input */}
                <form onSubmit={handleSubmit} className="flex items-end gap-2 mb-6">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => { setInput(e.target.value); autoResize(); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Itanong ang iyong legal na katanungan..."
                    rows={1}
                    disabled={isStreaming}
                    className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/20 focus:border-[#1e3a7b] disabled:opacity-60 overflow-hidden bg-white placeholder:text-gray-400 shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={isStreaming || !input.trim()}
                    className="flex-shrink-0 w-11 h-11 bg-[#1e3a7b] text-white rounded-full flex items-center justify-center hover:bg-[#162d60] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>

                <div className="h-1 w-24 bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126] rounded-full mx-auto mb-8" />

                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-left">
                  Mga madalas na tanong
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left mb-8">
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="flex items-start gap-2.5 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 hover:border-[#1e3a7b] hover:shadow-md hover:bg-[#1e3a7b]/5 transition-all text-left group"
                    >
                      <MessageSquare className="w-4 h-4 text-[#1e3a7b] flex-shrink-0 mt-0.5" />
                      <span className="flex-1 leading-snug">{q}</span>
                    </button>
                  ))}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <strong className="text-gray-600">Disclaimer:</strong> Para sa pangkalahatang kaalaman lamang,
                  hindi kapalit ng opisyal na legal na representasyon. Para sa libreng abogado,
                  tawagan ang <strong className="text-gray-600">PAO: 8524-2100</strong>.
                </p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className="msg-enter">
                    {msg.role === "assistant" && msg.content === "" && isStreaming ? (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1e3a7b] flex items-center justify-center mt-1 shadow-sm">
                          <Scale className="w-4 h-4 text-[#fcd116]" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                          <TypingDots />
                        </div>
                      </div>
                    ) : msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="max-w-[80%] sm:max-w-[70%] bg-[#1e3a7b] text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1e3a7b] flex items-center justify-center mt-1 shadow-sm">
                          <Scale className="w-4 h-4 text-[#fcd116]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 ml-1">
                            <span className="text-xs font-bold text-[#1e3a7b]">Abogado AI</span>
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

          {/* Error */}
          {error && (
            <div className="mx-4 mb-2 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2.5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Input bar — only shown during active conversation */}
          {!isEmpty && (
            <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); autoResize(); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Itanong ang iyong legal na katanungan sa Filipino o English..."
                  rows={1}
                  disabled={isStreaming}
                  className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/20 focus:border-[#1e3a7b] disabled:opacity-60 overflow-hidden bg-gray-50 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="flex-shrink-0 w-11 h-11 bg-[#1e3a7b] text-white rounded-full flex items-center justify-center hover:bg-[#162d60] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-2 max-w-3xl mx-auto">
                <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 text-[10px]">Enter</kbd> ipadala ·{" "}
                <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 text-[10px]">Shift+Enter</kbd> bagong linya
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
