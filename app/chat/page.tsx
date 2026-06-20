'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const INTERESTS = [
  'Technology', 'Sports', 'Music', 'Art', 'Gaming',
  'Travel', 'Food', 'Books', 'Movies', 'Fitness',
  'Science', 'Fashion', 'Photography', 'Cooking', 'Nature',
]

const PERSONALITIES = [
  { value: 'introvert', label: 'Introvert', desc: 'Deep conversations over small talk' },
  { value: 'extrovert', label: 'Extrovert', desc: 'Love meeting and talking to everyone' },
  { value: 'ambivert', label: 'Ambivert', desc: 'Somewhere in between' },
]

interface Message {
  id: string
  senderId: string
  senderNickname: string
  content: string
  timestamp: number
}

interface ChatSession {
  id: string
  users: Array<{ id: string; nickname: string }>
  matchedInterests: string[]
}

type Phase = 'setup' | 'waiting' | 'chatting' | 'disconnected'

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const [userId] = useState<string>(() => crypto.randomUUID())
  const [nickname, setNickname] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [personality, setPersonality] = useState('')
  const [phase, setPhase] = useState<Phase>('setup')
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [waitSeconds, setWaitSeconds] = useState(0)
  const lastMessageTime = useRef(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const waitTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    if (waitTimerRef.current) {
      clearInterval(waitTimerRef.current)
      waitTimerRef.current = null
    }
  }, [])

  const startWaitingPoll = useCallback(() => {
    setWaitSeconds(0)
    waitTimerRef.current = setInterval(() => {
      setWaitSeconds((s) => s + 1)
    }, 1000)

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/status?userId=${userId}`)
        const data = await res.json()
        if (data.status === 'matched' && data.session) {
          stopPolling()
          setSession(data.session)
          setMessages(data.session.messages ?? [])
          lastMessageTime.current = Date.now()
          setPhase('chatting')
        }
      } catch {
        // network hiccup, keep polling
      }
    }, 2000)
  }, [userId, stopPolling])

  const startChatPoll = useCallback(
    (sess: ChatSession) => {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(
            `/api/chat/messages?userId=${userId}&since=${lastMessageTime.current}`
          )
          const data = await res.json()
          if (!data.sessionActive) {
            stopPolling()
            setPhase('disconnected')
            return
          }
          if (data.messages?.length) {
            lastMessageTime.current = Math.max(
              ...data.messages.map((m: Message) => m.timestamp)
            )
            setMessages((prev) => {
              const existing = new Set(prev.map((m) => m.id))
              const fresh = data.messages.filter((m: Message) => !existing.has(m.id))
              return [...prev, ...fresh]
            })
          }
        } catch {
          // network hiccup, keep polling
        }
      }, 2000)
    },
    [userId, stopPolling]
  )

  useEffect(() => {
    if (phase === 'chatting' && session) {
      stopPolling()
      startChatPoll(session)
    }
  }, [phase, session, startChatPoll, stopPolling])

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const handleJoin = async () => {
    if (!nickname.trim() || interests.length === 0 || !personality) return

    setPhase('waiting')
    startWaitingPoll()

    try {
      const res = await fetch('/api/chat/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, nickname: nickname.trim(), interests, personality }),
      })
      const data = await res.json()

      if (data.status === 'matched' && data.session) {
        stopPolling()
        setSession(data.session)
        setMessages(data.session.messages ?? [])
        lastMessageTime.current = Date.now()
        setPhase('chatting')
      }
      // else: waiting, polling already started
    } catch {
      setPhase('setup')
      stopPolling()
    }
  }

  const handleCancel = async () => {
    stopPolling()
    setPhase('setup')
    await fetch('/api/chat/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }).catch(() => {})
  }

  const handleSend = async () => {
    if (!input.trim() || sending) return
    const content = input.trim()
    setInput('')
    setSending(true)

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content }),
      })
      const data = await res.json()
      if (data.message) {
        lastMessageTime.current = Math.max(lastMessageTime.current, data.message.timestamp)
        setMessages((prev) => {
          if (prev.find((m) => m.id === data.message.id)) return prev
          return [...prev, data.message]
        })
      }
    } catch {
      setInput(content)
    } finally {
      setSending(false)
    }
  }

  const handleLeave = async () => {
    stopPolling()
    setPhase('disconnected')
    await fetch('/api/chat/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }).catch(() => {})
  }

  const handleReset = () => {
    setPhase('setup')
    setSession(null)
    setMessages([])
    setInput('')
    lastMessageTime.current = 0
  }

  const partner = session?.users.find((u) => u.id !== userId)
  const canStart = nickname.trim().length > 0 && interests.length > 0 && personality !== ''

  // ── Setup screen ──────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">💬</div>
            <h1 className="text-3xl font-bold text-white">Match & Chat</h1>
            <p className="text-white/50 mt-2 text-sm leading-relaxed">
              Chat with a random stranger who shares your interests.<br />
              You'll only be matched with someone compatible.
            </p>
          </div>

          {/* Nickname */}
          <div className="mb-6">
            <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">
              Your nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="How should we call you?"
              maxLength={24}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Interests */}
          <div className="mb-6">
            <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">
              Your interests <span className="text-white/40 normal-case font-normal">(pick at least 1)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    interests.includes(interest)
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Personality */}
          <div className="mb-8">
            <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">
              Your personality
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PERSONALITIES.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPersonality(p.value)}
                  className={`rounded-xl p-3 text-left transition-all ${
                    personality === p.value
                      ? 'bg-indigo-500/30 border border-indigo-400 text-white'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-sm">{p.label}</div>
                  <div className="text-xs mt-0.5 opacity-70 leading-tight">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={!canStart}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              canStart
                ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-400/40 active:scale-95'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            Find My Match
          </button>
        </div>
      </div>
    )
  }

  // ── Waiting screen ────────────────────────────────────────────────────────
  if (phase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          {/* Pulsing rings */}
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
            <div className="absolute inset-4 rounded-full bg-indigo-500/30 animate-ping [animation-delay:0.3s]" />
            <div className="absolute inset-8 rounded-full bg-indigo-500 flex items-center justify-center text-3xl">
              🔍
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Looking for your match…</h2>
          <p className="text-white/50 mb-1 text-sm">
            Searching for someone who shares your vibe
          </p>
          <p className="text-white/30 text-xs mb-8">
            {waitSeconds < 60
              ? `${waitSeconds}s elapsed`
              : `${Math.floor(waitSeconds / 60)}m ${waitSeconds % 60}s — broadening search…`}
          </p>

          {/* Your interests tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-sm mx-auto">
            {interests.map((i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm border border-indigo-500/30">
                {i}
              </span>
            ))}
          </div>

          <button
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // ── Disconnected screen ───────────────────────────────────────────────────
  if (phase === 'disconnected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">👋</div>
          <h2 className="text-2xl font-bold text-white mb-2">Chat ended</h2>
          <p className="text-white/50 mb-8 text-sm">
            Your chat partner has disconnected.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold transition-all"
            >
              Find New Match
            </button>
            <a
              href="/"
              className="px-6 py-3 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all text-sm flex items-center"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── Chat screen ───────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-base">
          {partner?.nickname?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm truncate">
            {partner?.nickname ?? 'Stranger'}
          </div>
          {session && session.matchedInterests.length > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-slate-500 text-xs">Matched on</span>
              {session.matchedInterests.slice(0, 3).map((i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                  {i}
                </span>
              ))}
              {session.matchedInterests.length > 3 && (
                <span className="text-slate-500 text-xs">+{session.matchedInterests.length - 3}</span>
              )}
            </div>
          )}
          {session && session.matchedInterests.length === 0 && (
            <div className="text-slate-500 text-xs">Random match</div>
          )}
        </div>
        <button
          onClick={handleLeave}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
        >
          End chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-3xl mb-3">✨</div>
            <p className="text-slate-500 text-sm">You're connected! Say hello.</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === userId
          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs text-slate-300 shrink-0 mt-0.5">
                  {msg.senderNickname[0]?.toUpperCase()}
                </div>
              )}
              <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-indigo-500 text-white rounded-tr-sm'
                      : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-slate-600 text-xs px-1">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none leading-relaxed"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
              input.trim() && !sending
                ? 'bg-indigo-500 hover:bg-indigo-400 text-white active:scale-95'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <p className="text-slate-600 text-xs mt-2 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
