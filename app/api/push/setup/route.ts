import { NextRequest, NextResponse } from 'next/server'
import { createOwnerSession, getOwnerPassphrase, getVapidKeys, hasSameOriginRequest, isOwnerPassphraseValid, PUSH_SESSION_COOKIE } from '@/lib/push-server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!hasSameOriginRequest(request)) return NextResponse.json({ error: 'Unsupported request origin.' }, { status: 403 })

  const expected = getOwnerPassphrase()
  if (!expected) {
    return NextResponse.json({ error: 'Order alerts are not configured. Set a passphrase of at least 16 characters.' }, { status: 503 })
  }

  let passphrase = ''
  try {
    const body = await request.json()
    passphrase = typeof body.passphrase === 'string' ? body.passphrase : ''
  } catch {
    return NextResponse.json({ error: 'Enter your owner passphrase.' }, { status: 400 })
  }

  if (!isOwnerPassphraseValid(passphrase, expected)) {
    return NextResponse.json({ error: 'That passphrase did not match.' }, { status: 401 })
  }

  try {
    const keys = await getVapidKeys()
    const session = createOwnerSession(expected)
    const response = NextResponse.json({ publicKey: keys.publicKey })
    const secure = request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https' || process.env.NODE_ENV === 'production'

    response.cookies.set(PUSH_SESSION_COOKIE, session.value, {
      httpOnly: true,
      secure,
      sameSite: process.env.NODE_ENV === 'development' && secure ? 'none' : 'strict',
      maxAge: session.maxAge,
      path: '/api/push',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Could not prepare push alerts. Please try again.' }, { status: 500 })
  }
}
