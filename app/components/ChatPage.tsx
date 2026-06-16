"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import {
  Scale, Send, Loader2, ChevronRight, AlertCircle,
  Phone, Copy, Check, Plus, MessageSquare, X, Menu, Globe,
  Briefcase, MapPin, Star, ExternalLink, UserPlus,
} from "lucide-react";
import { suggestLawyers, type Lawyer } from "@/app/data/lawyers";

type Role = "user" | "assistant";
interface Message { role: Role; content: string }
type Language = "English" | "Filipino" | "Bisaya" | "Ilocano";

const LANGUAGE_OPTIONS: { value: Language; flag: string; label: string }[] = [
  { value: "English",  flag: "🇺🇸", label: "English" },
  { value: "Filipino", flag: "🇵🇭", label: "Filipino" },
  { value: "Bisaya",   flag: "🇵🇭", label: "Bisaya" },
  { value: "Ilocano",  flag: "🇵🇭", label: "Ilocano" },
];

const CATEGORIES = [
  { emoji: "👨‍👩‍👧", label: "Family Law",            prompt: "What are my rights under the Family Code of the Philippines?" },
  { emoji: "💼",     label: "Labor Law",             prompt: "What are my rights as an employee in the Philippines?" },
  { emoji: "🔒",     label: "Criminal Law",           prompt: "What are my rights when arrested by the police?" },
  { emoji: "🏠",     label: "Property Law",           prompt: "How do I transfer or get a land title in the Philippines?" },
  { emoji: "📜",     label: "Constitutional Rights",  prompt: "What are my constitutional rights under the 1987 Philippine Constitution?" },
  { emoji: "⚖️",    label: "Civil Law",              prompt: "How do I file a small claims case in court?" },
  { emoji: "✈️",    label: "OFW Rights",             prompt: "What are the rights of OFWs under Philippine law?" },
  { emoji: "🤝",     label: "Barangay Justice",       prompt: "How does the Katarungang Pambarangay system work?" },
];

const SUGGESTED = [
  "How do I file for annulment in the Philippines?",
  "What are my rights when arrested by the police?",
  "How do I file an illegal dismissal complaint?",
  "How do I get a free lawyer from PAO?",
  "How do I file a VAWC complaint?",
  "What is small claims court and how do I use it?",
];

/* ── Markdown parser ── */
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

/* ── Copy button ── */
function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }} className="p-1 rounded hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors" title="Copy">
      {ok ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

/* ── Typing dots ── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 150, 300].map((d) => <span key={d} className="w-2 h-2 rounded-full bg-[#1e3a7b]/30 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
    </div>
  );
}

/* ── Language selector ── */
function LanguageSelector({ language, onChange }: { language: Language; onChange: (l: Language) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function outside(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);
  const current = LANGUAGE_OPTIONS.find((o) => o.value === language)!;
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-full px-3 py-1.5 text-xs font-medium transition-colors">
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{current.flag} {current.label}</span>
        <span className="sm:hidden">{current.flag}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {LANGUAGE_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${opt.value === language ? "bg-[#1e3a7b] text-white font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
              <span>{opt.flag}</span><span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Lawyer card ── */
function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md hover:border-[#1e3a7b]/30 transition-all">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full ${lawyer.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
          {lawyer.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">{lawyer.name}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {lawyer.specialty.slice(0, 2).map((s) => (
              <span key={s} className="text-[10px] bg-[#1e3a7b]/10 text-[#1e3a7b] px-2 py-0.5 rounded-full font-medium">{s}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lawyer.location}</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" />{lawyer.experience} yrs</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{lawyer.bio}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs font-bold text-[#1e3a7b]">{lawyer.fee}</span>
        <a href={`tel:${lawyer.phone}`} className="flex items-center gap-1.5 bg-[#1e3a7b] text-white text-xs px-3 py-1.5 rounded-full hover:bg-[#162d60] transition-colors">
          <Phone className="w-3 h-3" /> Contact
        </a>
      </div>
    </div>
  );
}

/* ── Lawyer suggestions panel ── */
function LawyerSuggestions({ messages }: { messages: Message[] }) {
  const allText = messages.map((m) => m.content).join(" ");
  const lawyers = suggestLawyers(allText, 2);
  if (lawyers.length === 0) return null;
  return (
    <div className="mt-4 msg-enter">
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className="w-4 h-4 text-[#1e3a7b]" />
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Suggested Lawyers for Your Case</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {lawyers.map((l) => <LawyerCard key={l.id} lawyer={l} />)}
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Need help in court?{" "}
        <a href="#" className="text-[#1e3a7b] font-semibold hover:underline">View all lawyers →</a>
      </p>
    </div>
  );
}

/* ── Sidebar ── */
function Sidebar({ onSelect, onClose }: { onSelect: (q: string) => void; onClose?: () => void }) {
  const [showLawyers, setShowLawyers] = useState(false);
  return (
    <aside className="flex flex-col h-full bg-[#0e1f44] text-white w-64 flex-shrink-0 overflow-y-auto">
      <div className="h-1 bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126] flex-shrink-0" />
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-[#162d60] to-[#0e1f44]">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Legal Topics</span>
        {onClose && <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-white/10"><X className="w-4 h-4" /></button>}
      </div>
      <nav className="p-3 space-y-1">
        {CATEGORIES.map((c) => (
          <button key={c.label} onClick={() => { onSelect(c.prompt); onClose?.(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors group">
            <span className="text-base">{c.emoji}</span>
            <span className="flex-1 leading-tight">{c.label}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </nav>

      {/* Find a Lawyer section */}
      <div className="border-t border-white/10 p-3">
        <button onClick={() => setShowLawyers((v) => !v)}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors">
          <Briefcase className="w-4 h-4 text-[#fcd116]" />
          <span className="flex-1 font-semibold">Find a Lawyer</span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showLawyers ? "rotate-90" : ""}`} />
        </button>
        {showLawyers && (
          <div className="mt-2 space-y-2 px-1">
            {["Family Law", "Labor Law", "Criminal Law", "Property Law", "OFW Rights"].map((s) => (
              <button key={s} onClick={() => { onSelect(`I need to find a ${s} lawyer in the Philippines. What should I look for?`); onClose?.(); }}
                className="w-full text-left text-xs text-blue-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                → {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* List your services CTA */}
      <div className="border-t border-white/10 p-3">
        <div className="bg-[#fcd116]/10 border border-[#fcd116]/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <UserPlus className="w-4 h-4 text-[#fcd116]" />
            <span className="text-xs font-bold text-white">Are you a lawyer?</span>
          </div>
          <p className="text-xs text-blue-300 mb-2">List your services and get referred to clients.</p>
          <a href="mailto:lawyers@torny.ai" className="block text-center bg-[#fcd116] text-[#1e3a7b] text-xs font-bold px-3 py-2 rounded-lg hover:bg-yellow-300 transition-colors">
            List Your Services
          </a>
        </div>
      </div>

      {/* PAO card */}
      <div className="border-t border-white/10 p-4 mt-auto">
        <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-[#fcd116]/20 flex items-center justify-center">
              <Phone className="w-3.5 h-3.5 text-[#fcd116]" />
            </div>
            <span className="text-xs font-bold text-white">PAO Free Lawyer</span>
          </div>
          <p className="text-xl font-bold text-[#fcd116] tracking-wide">8524-2100</p>
          <p className="text-xs text-blue-300 mt-0.5">Free legal aid · Mon–Fri</p>
        </div>
      </div>
    </aside>
  );
}

/* ── Main ── */
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("English");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, language }),
      });
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
      setError("Connection error. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  }

  function handleSubmit(e: FormEvent) { e.preventDefault(); sendMessage(input); }
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  const isEmpty = messages.length === 0;
  const lastIsAssistant = messages.length > 0 && messages[messages.length - 1].role === "assistant";

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Flag stripe */}
      <div className="h-[3px] bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126] flex-shrink-0" />

      {/* Header */}
      <header className="bg-[#0e1f44] text-white px-4 py-3 flex items-center gap-3 shadow-lg flex-shrink-0 z-10">
        <button onClick={() => setSidebarOpen((v) => !v)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#fcd116] flex items-center justify-center flex-shrink-0 shadow-md">
          <Scale className="w-5 h-5 text-[#1e3a7b]" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base leading-tight">Torny<span className="text-[#fcd116]">.ai</span></h1>
          <p className="text-blue-300 text-xs">Free Legal Advice · Philippine Law Expert</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs text-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />Online
          </div>
          <LanguageSelector language={language} onChange={setLanguage} />
          {!isEmpty && (
            <button onClick={() => setMessages([])} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-full px-3 py-1.5 text-xs font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" /><span className="hidden sm:inline">New</span>
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <div className={`fixed lg:static inset-y-0 left-0 z-30 lg:z-auto transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex-shrink-0`}>
          <Sidebar onSelect={sendMessage} onClose={() => setSidebarOpen(false)} />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {isEmpty ? (
              <div className="flex flex-col min-h-full">
                {/* Hero */}
                <div className="bg-gradient-to-br from-[#0e1f44] via-[#1e3a7b] to-[#0e1f44] flex flex-col items-center justify-center py-12 px-6 text-center" style={{ minHeight: "45vh" }}>
                  <div className="relative mb-5">
                    <div className="absolute inset-0 rounded-full bg-[#fcd116]/20 blur-xl scale-150" />
                    <div className="relative w-20 h-20 rounded-full bg-[#fcd116]/10 border border-[#fcd116]/30 flex items-center justify-center shadow-2xl">
                      <Scale className="w-10 h-10 text-[#fcd116] drop-shadow-lg" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-400 border-2 border-[#0e1f44] flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">AI</span>
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                    Your Free <span className="text-[#fcd116]">Legal Advice</span>
                  </h2>
                  <p className="text-blue-200 text-sm sm:text-base leading-relaxed mb-6 max-w-md mx-auto">
                    Get instant AI-powered legal guidance based on Philippine law. Ask anything — free, confidential, and available 24/7.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    {[{ icon: "⚡", label: "Instant" }, { icon: "🔒", label: "Confidential" }, { icon: "📚", label: "PH Law" }, { icon: "👨‍⚖️", label: "Lawyer Referrals" }].map((b) => (
                      <span key={b.label} className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white font-medium backdrop-blur-sm">
                        <span>{b.icon}</span><span>{b.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-[3px] bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126] flex-shrink-0" />

                <div className="bg-white flex-1 px-4 py-8">
                  <div className="max-w-2xl mx-auto">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Common Legal Questions</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {SUGGESTED.map((q) => (
                        <button key={q} onClick={() => sendMessage(q)}
                          className="flex items-start gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-700 hover:border-[#1e3a7b] hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#1e3a7b]/5 transition-all text-left group">
                          <MessageSquare className="w-4 h-4 text-[#1e3a7b] flex-shrink-0 mt-0.5 opacity-70 group-hover:opacity-100" />
                          <span className="flex-1 leading-snug">{q}</span>
                        </button>
                      ))}
                    </div>

                    {/* Lawyer CTA on welcome */}
                    <div className="bg-[#1e3a7b]/5 border border-[#1e3a7b]/20 rounded-2xl p-5 mb-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#1e3a7b] flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-[#fcd116]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#1e3a7b] text-sm">Need a Real Lawyer?</p>
                        <p className="text-xs text-gray-500 mt-0.5">Get AI advice first, then we'll connect you with verified Philippine lawyers by specialty.</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#1e3a7b] flex-shrink-0" />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
                      <strong className="text-amber-900">⚠️ Disclaimer:</strong>{" "}
                      For general information only, not a substitute for official legal representation. For a free lawyer, call <strong className="text-amber-900">PAO: 8524-2100</strong>.
                    </div>
                  </div>
                </div>
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
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"><TypingDots /></div>
                      </div>
                    ) : msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="max-w-[80%] sm:max-w-[70%] bg-gradient-to-br from-[#1e3a7b] to-[#162d60] text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
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
                            <span className="text-xs font-bold text-[#1e3a7b]">Legal AI</span>
                            <CopyBtn text={msg.content} />
                          </div>
                          <div className="bg-white border border-gray-200 border-l-2 border-l-[#fcd116] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm space-y-1">
                            <MarkdownBody text={msg.content} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {/* Show lawyer suggestions after the last AI response when not streaming */}
                {lastIsAssistant && !isStreaming && messages[messages.length - 1].content.length > 50 && (
                  <LawyerSuggestions messages={messages} />
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {error && (
            <div className="mx-4 mb-2 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2.5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                onKeyDown={handleKeyDown}
                placeholder="Ask your legal question in English or Filipino..."
                rows={1}
                disabled={isStreaming}
                className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/20 focus:border-[#1e3a7b] disabled:opacity-60 overflow-hidden bg-gray-50 placeholder:text-gray-400 transition-colors"
              />
              <button type="submit" disabled={isStreaming || !input.trim()}
                className="flex-shrink-0 w-11 h-11 bg-[#1e3a7b] text-white rounded-full flex items-center justify-center hover:bg-[#162d60] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
                {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-2 max-w-3xl mx-auto">
              <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 text-[10px]">Enter</kbd> to send ·{" "}
              <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 text-[10px]">Shift+Enter</kbd> new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
