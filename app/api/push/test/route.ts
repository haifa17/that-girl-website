import { NextRequest, NextResponse } from 'next/server'
import { hasOwnerSession, hasSameOriginRequest, sendPushNotice } from '@/lib/push-server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!hasSameOriginRequest(request)) return NextResponse.json({ error: 'Unsupported request origin.' }, { status: 403 })
  if (!hasOwnerSession(request)) return NextResponse.json({ error: 'Please unlock private setup again.' }, { status: 401 })

  try {
    const sent = await sendPushNotice({
      title: 'THAT GIRL order alerts',
      body: 'This device is connected and ready for new order requests.',
      url: '/notifications',
    })
    return NextResponse.json({ sent: sent > 0 })
  } catch {
    return NextResponse.json({ error: 'Could not send a test alert. Check your notification permission and try again.' }, { status: 500 })
  }
}
