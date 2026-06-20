export interface WaitingUser {
  id: string
  nickname: string
  interests: string[]
  personality: string
  joinedAt: number
  lastPing: number
}

export interface Message {
  id: string
  senderId: string
  senderNickname: string
  content: string
  timestamp: number
}

export interface ChatSession {
  id: string
  users: Array<{ id: string; nickname: string }>
  messages: Message[]
  startedAt: number
  active: boolean
  matchedInterests: string[]
}

declare global {
  // eslint-disable-next-line no-var
  var __chatStore:
    | {
        waitingPool: Map<string, WaitingUser>
        sessions: Map<string, ChatSession>
        userToSession: Map<string, string>
      }
    | undefined
}

const store = globalThis.__chatStore ?? {
  waitingPool: new Map<string, WaitingUser>(),
  sessions: new Map<string, ChatSession>(),
  userToSession: new Map<string, string>(),
}
globalThis.__chatStore = store

function interestScore(u1: WaitingUser, u2: WaitingUser): number {
  const shared = u1.interests.filter((i) => u2.interests.includes(i)).length
  const personalityBonus = u1.personality === u2.personality ? 0.5 : 0
  return shared + personalityBonus
}

function makeId(): string {
  return crypto.randomUUID()
}

function cleanStale(): void {
  const cutoff = Date.now() - 90_000
  for (const [id, user] of store.waitingPool) {
    if (user.lastPing < cutoff) store.waitingPool.delete(id)
  }
}

export function joinPool(user: WaitingUser): ChatSession | null {
  cleanStale()

  const existingSessionId = store.userToSession.get(user.id)
  if (existingSessionId) {
    const s = store.sessions.get(existingSessionId)
    if (s?.active) return s
    store.userToSession.delete(user.id)
  }

  let bestMatch: WaitingUser | null = null
  let bestScore = 0
  let fallbackMatch: WaitingUser | null = null
  const userWaitedLong = Date.now() - user.joinedAt > 60_000

  for (const [, waiting] of store.waitingPool) {
    if (waiting.id === user.id) continue
    const score = interestScore(user, waiting)
    if (score > bestScore) {
      bestScore = score
      bestMatch = waiting
    }
    const waitingWaitedLong = Date.now() - waiting.joinedAt > 60_000
    if ((userWaitedLong || waitingWaitedLong) && !fallbackMatch) {
      fallbackMatch = waiting
    }
  }

  const matchedUser = bestMatch ?? fallbackMatch
  if (!matchedUser) {
    store.waitingPool.set(user.id, { ...user, lastPing: Date.now() })
    return null
  }

  const matchedInterests = user.interests.filter((i) =>
    matchedUser.interests.includes(i)
  )
  const session: ChatSession = {
    id: makeId(),
    users: [
      { id: user.id, nickname: user.nickname },
      { id: matchedUser.id, nickname: matchedUser.nickname },
    ],
    messages: [],
    startedAt: Date.now(),
    active: true,
    matchedInterests,
  }

  store.sessions.set(session.id, session)
  store.userToSession.set(user.id, session.id)
  store.userToSession.set(matchedUser.id, session.id)
  store.waitingPool.delete(matchedUser.id)
  store.waitingPool.delete(user.id)
  return session
}

export function getStatus(
  userId: string
): { status: 'waiting' | 'matched' | 'unknown'; session?: ChatSession } {
  const waiting = store.waitingPool.get(userId)
  if (waiting) {
    waiting.lastPing = Date.now()
    return { status: 'waiting' }
  }

  const sessionId = store.userToSession.get(userId)
  if (sessionId) {
    const session = store.sessions.get(sessionId)
    if (session?.active) return { status: 'matched', session }
  }

  return { status: 'unknown' }
}

export function sendMessage(userId: string, content: string): Message | null {
  const sessionId = store.userToSession.get(userId)
  if (!sessionId) return null

  const session = store.sessions.get(sessionId)
  if (!session?.active) return null

  const user = session.users.find((u) => u.id === userId)
  if (!user) return null

  const message: Message = {
    id: makeId(),
    senderId: userId,
    senderNickname: user.nickname,
    content,
    timestamp: Date.now(),
  }
  session.messages.push(message)
  return message
}

export function getMessages(
  userId: string,
  since: number
): { messages: Message[]; sessionActive: boolean } {
  const waiting = store.waitingPool.get(userId)
  if (waiting) waiting.lastPing = Date.now()

  const sessionId = store.userToSession.get(userId)
  if (!sessionId) return { messages: [], sessionActive: false }

  const session = store.sessions.get(sessionId)
  if (!session) return { messages: [], sessionActive: false }

  return {
    messages: session.messages.filter((m) => m.timestamp > since),
    sessionActive: session.active,
  }
}

export function leaveSession(userId: string): void {
  const sessionId = store.userToSession.get(userId)
  if (sessionId) {
    const session = store.sessions.get(sessionId)
    if (session) session.active = false
    store.userToSession.delete(userId)
  }
  store.waitingPool.delete(userId)
}
