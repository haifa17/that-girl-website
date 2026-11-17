import { createECDH, createHmac, timingSafeEqual } from 'node:crypto'
import { sendNotification, setVapidDetails, type PushSubscription } from 'web-push'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { pushSubscriptions, pushVapidKeys } from '@/lib/db/schema'

export const PUSH_SESSION_COOKIE = 'that-girl-order-alerts'
const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 30

type PushNotice = { title: string; body: string; url?: string }

export function getOwnerPassphrase() {
  const passphrase = process.env.ORDER_ALERTS_PIN
  return passphrase && passphrase.length >= 16 ? passphrase : null
}

export function hasSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() || request.headers.get('host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase()
  } catch {
    return false
  }
}

function safeEqual(received: string, expected: string) {
  const left = Buffer.from(received)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function isOwnerPassphraseValid(received: string, expected: string) {
  return safeEqual(received, expected)
}

export function createOwnerSession(passphrase: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS
  const signature = createHmac('sha256', passphrase).update(String(expiresAt)).digest('hex')
  return { value: `${expiresAt}.${signature}`, maxAge: SESSION_LIFETIME_SECONDS }
}

export function hasOwnerSession(request: Request & { cookies: { get: (name: string) => { value: string } | undefined } }) {
  const passphrase = getOwnerPassphrase()
  const value = request.cookies.get(PUSH_SESSION_COOKIE)?.value
  if (!passphrase || !value) return false

  const [expiresAt, signature] = value.split('.')
  const expires = Number(expiresAt)
  if (!Number.isSafeInteger(expires) || expires <= Math.floor(Date.now() / 1000) || !signature) return false

  const expected = createHmac('sha256', passphrase).update(expiresAt).digest('hex')
  return safeEqual(signature, expected)
}

export async function getVapidKeys() {
  const [stored] = await db.select().from(pushVapidKeys).where(eq(pushVapidKeys.id, 1)).limit(1)
  if (stored) return stored

  const ecdh = createECDH('prime256v1')
  ecdh.generateKeys()
  await db.insert(pushVapidKeys).values({
    id: 1,
    publicKey: ecdh.getPublicKey().toString('base64url'),
    privateKey: ecdh.getPrivateKey().toString('base64url'),
  }).onConflictDoNothing()

  const [created] = await db.select().from(pushVapidKeys).where(eq(pushVapidKeys.id, 1)).limit(1)
  if (!created) throw new Error('Push keys could not be initialized')
  return created
}

export async function sendPushNotice(notice: PushNotice) {
  const keys = await getVapidKeys()
  setVapidDetails('mailto:that_girl2026@outlook.fr', keys.publicKey, keys.privateKey)

  const subscriptions = await db.select().from(pushSubscriptions)
  const results = await Promise.all(subscriptions.map(async (subscription) => {
    const target: PushSubscription = {
      endpoint: subscription.endpoint,
      expirationTime: null,
      keys: { p256dh: subscription.p256dh, auth: subscription.auth },
    }

    try {
      await sendNotification(target, JSON.stringify(notice))
      return true
    } catch (error) {
      const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error
        ? Number(error.statusCode)
        : 0
      if (statusCode === 404 || statusCode === 410) {
        await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, subscription.endpoint))
      }
      return false
    }
  }))

  return results.filter(Boolean).length
}
