import { joinPool } from '@/app/lib/chatStore'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { id, nickname, interests, personality } = body

  if (
    !id ||
    typeof nickname !== 'string' ||
    !nickname.trim() ||
    !Array.isArray(interests) ||
    interests.length === 0 ||
    !personality
  ) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const session = joinPool({
    id,
    nickname: nickname.trim(),
    interests,
    personality,
    joinedAt: Date.now(),
    lastPing: Date.now(),
  })

  if (session) {
    return Response.json({ status: 'matched', session })
  }

  return Response.json({ status: 'waiting' })
}
