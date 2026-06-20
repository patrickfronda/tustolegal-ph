import { getStatus } from '@/app/lib/chatStore'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  if (!userId) {
    return Response.json({ error: 'Missing userId' }, { status: 400 })
  }

  const result = getStatus(userId)
  return Response.json(result)
}
