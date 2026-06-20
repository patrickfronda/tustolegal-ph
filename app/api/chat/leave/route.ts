import { leaveSession } from '@/app/lib/chatStore'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userId } = body

  if (!userId) {
    return Response.json({ error: 'Missing userId' }, { status: 400 })
  }

  leaveSession(userId)
  return Response.json({ success: true })
}
