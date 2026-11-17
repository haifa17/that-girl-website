import { NextRequest, NextResponse } from 'next/server'
import { hasSameOriginRequest, sendPushNotice } from '@/lib/push-server'

export const runtime = 'nodejs'

const attemptsByIp = new Map<string, number[]>()
const RATE_WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 4

export async function POST(request: NextRequest) {
  if (!hasSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Unsupported request origin.' }, { status: 403 })
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported request.' }, { status: 415 })
  }

  let name = ''
  try {
    const body = await request.json()
    name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : ''
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
  if (!name) return NextResponse.json({ error: 'A name is required.' }, { status: 400 })

  const address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const recentAttempts = (attemptsByIp.get(address) || []).filter((time) => now - time < RATE_WINDOW_MS)
  if (recentAttempts.length >= MAX_ATTEMPTS) return NextResponse.json({ error: 'Please try again later.' }, { status: 429 })
  if (attemptsByIp.size > 1000) {
    for (const [key, times] of attemptsByIp) {
      if (!times.some((time) => now - time < RATE_WINDOW_MS)) attemptsByIp.delete(key)
    }
  }
  attemptsByIp.set(address, [...recentAttempts, now])

  try {
    const sent = await sendPushNotice({
      title: 'New THAT GIRL order request',
      body: `A request was started by ${name}. Check your email for the details.`,
      url: '/',
    })
    return NextResponse.json({ accepted: true, sent })
  } catch {
    return NextResponse.json({ error: 'Order alert could not be sent.' }, { status: 503 })
  }
}
