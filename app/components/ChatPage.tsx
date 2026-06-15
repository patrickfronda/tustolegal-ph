"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import { Scale, Send, Loader2, ChevronRight, AlertCircle } from "lucide-react";

type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Paano mag-file ng annulment sa Pilipinas?",
  "Ano ang aking mga karapatan kapag inaresto ng pulis?",
  "Paano mag-reklamo ng illegal dismissal?",
  "Paano makakakuha ng libreng abogado sa PAO?",
  "Paano mag-file ng VAWC complaint?",
  "Ano ang small claims court at paano ito gamitin?",
  "Paano mag-file ng labor complaint sa DOLE?",
  "Ano ang mga karapatan ng OFW sa ilalim ng batas?",
];

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1">
      <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a7b]/40 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a7b]/40 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a7b]/40 animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1e3a7b] flex items-center justify-center mt-1">
          <Scale className="w-4 h-4 text-[#fcd116]" />
        </div>
      )}
      <div
        className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-[#1e3a7b] text-white rounded-tr-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsStreaming(true);

    const placeholder: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, placeholder]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error("No response body");

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
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1));
      setError("May problema sa koneksyon. Subukan ulit.");
    } finally {
      setIsStreaming(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0e1f44] text-white px-4 py-3 flex items-center gap-3 shadow-md flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#fcd116] flex items-center justify-center">
          <Scale className="w-5 h-5 text-[#1e3a7b]" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base leading-tight">
            TustoLegal <span className="text-[#fcd116]">PH</span>
          </h1>
          <p className="text-blue-300 text-xs truncate">
            AI Abogado — Eksperto sa Batas ng Pilipinas
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs text-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          Online
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* Welcome screen */
          <div className="max-w-2xl mx-auto px-4 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1e3a7b] flex items-center justify-center mx-auto mb-5">
              <Scale className="w-8 h-8 text-[#fcd116]" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Kamusta! Ako si Abogado AI.
            </h2>
            <p className="text-gray-500 mb-2 leading-relaxed">
              Espesyalista ako sa batas ng Pilipinas. Tanungin mo ako tungkol sa iyong legal na sitwasyon —
              mula sa Family Law, Labor, Criminal, hanggang Property at Civil Law.
            </p>
            <p className="text-xs text-gray-400 mb-8">
              Libre · Kumpidensyal · Nakabatay sa mga batas ng Pilipinas
            </p>

            <div className="h-1 w-24 bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126] rounded-full mx-auto mb-8" />

            <p className="text-sm font-semibold text-gray-700 mb-4 text-left">
              Mga madalas na tanong:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="flex items-start gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:border-[#1e3a7b] hover:bg-[#1e3a7b]/5 transition text-left group"
                >
                  <ChevronRight className="w-4 h-4 text-[#1e3a7b] flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                  {q}
                </button>
              ))}
            </div>

            <p className="mt-8 text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
              <strong>Disclaimer:</strong> Ang impormasyong ibibigay ay para sa pangkalahatang kaalaman lamang
              at hindi kapalit ng opisyal na legal na representasyon. Para sa libreng abogado, tawagan ang PAO:
              <strong className="text-gray-600"> 8524-2100</strong>.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "assistant" && msg.content === "" && isStreaming ? (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1e3a7b] flex items-center justify-center mt-1">
                      <Scale className="w-4 h-4 text-[#fcd116]" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <TypingDots />
                    </div>
                  </div>
                ) : (
                  <MessageBubble msg={msg} />
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 mb-2 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2.5 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex items-end gap-2"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Itanong ang iyong legal na katanungan..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/20 focus:border-[#1e3a7b] disabled:opacity-60 overflow-hidden"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="flex-shrink-0 w-11 h-11 bg-[#1e3a7b] text-white rounded-full flex items-center justify-center hover:bg-[#162d60] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-2 max-w-3xl mx-auto">
          Pindutin ang <kbd className="bg-gray-100 px-1 rounded text-gray-500">Enter</kbd> para ipadala ·{" "}
          <kbd className="bg-gray-100 px-1 rounded text-gray-500">Shift + Enter</kbd> para sa bagong linya
        </p>
      </div>
    </div>
  );
}
