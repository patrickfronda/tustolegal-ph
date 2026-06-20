import { getMessages } from '@/app/lib/chatStore'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  const since = Number(request.nextUrl.searchParams.get('since') ?? '0')

  if (!userId) {
    return Response.json({ error: 'Missing userId' }, { status: 400 })
  }

  const result = getMessages(userId, since)
  return Response.json(result)
}
