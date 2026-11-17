import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { pushSubscriptions } from '@/lib/db/schema'
import { hasOwnerSession, hasSameOriginRequest } from '@/lib/push-server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!hasSameOriginRequest(request)) return NextResponse.json({ error: 'Unsupported request origin.' }, { status: 403 })
  if (!hasOwnerSession(request)) return NextResponse.json({ error: 'Please unlock private setup again.' }, { status: 401 })

  let subscription: { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } }
  try {
    subscription = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid subscription.' }, { status: 400 })
  }

  const { endpoint, keys } = subscription
  if (typeof endpoint !== 'string' || endpoint.length > 2048 || typeof keys?.p256dh !== 'string' || typeof keys.auth !== 'string' || keys.p256dh.length > 256 || keys.auth.length > 256) {
    return NextResponse.json({ error: 'Invalid subscription.' }, { status: 400 })
  }

  try {
    if (new URL(endpoint).protocol !== 'https:') return NextResponse.json({ error: 'Invalid notification endpoint.' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Invalid notification endpoint.' }, { status: 400 })
  }

  try {
    await db.insert(pushSubscriptions).values({
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    }).onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: { p256dh: keys.p256dh, auth: keys.auth },
    })
    return NextResponse.json({ saved: true })
  } catch {
    return NextResponse.json({ error: 'Could not save this device. Please try again.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!hasSameOriginRequest(request)) return NextResponse.json({ error: 'Unsupported request origin.' }, { status: 403 })
  if (!hasOwnerSession(request)) return NextResponse.json({ error: 'Please unlock private setup again.' }, { status: 401 })

  let endpoint = ''
  try {
    const body = await request.json()
    endpoint = typeof body.endpoint === 'string' ? body.endpoint : ''
  } catch {
    return NextResponse.json({ error: 'Invalid subscription.' }, { status: 400 })
  }

  if (!endpoint || endpoint.length > 2048) return NextResponse.json({ error: 'Invalid subscription.' }, { status: 400 })

  try {
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint))
    return NextResponse.json({ removed: true })
  } catch {
    return NextResponse.json({ error: 'Could not remove this device. Please try again.' }, { status: 500 })
  }
}
