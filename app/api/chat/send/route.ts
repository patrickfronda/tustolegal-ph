import { sendMessage } from '@/app/lib/chatStore'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userId, content } = body

  if (!userId || typeof content !== 'string' || !content.trim()) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const message = sendMessage(userId, content.trim())

  if (!message) {
    return Response.json({ error: 'No active session' }, { status: 404 })
  }

  return Response.json({ message })
}
