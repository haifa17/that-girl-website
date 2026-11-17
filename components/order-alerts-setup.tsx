'use client'

import { useState } from 'react'

function decodeApplicationServerKey(value: string) {
  const padded = value + '='.repeat((4 - (value.length % 4)) % 4)
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64)
  return Uint8Array.from(raw, (character) => character.charCodeAt(0))
}

export default function OrderAlertsSetup() {
  const [passphrase, setPassphrase] = useState('')
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [working, setWorking] = useState(false)
  const [enabled, setEnabled] = useState(false)

  async function unlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setWorking(true)
    setMessage('')

    try {
      const response = await fetch('/api/push/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not verify the passphrase.')
      setPublicKey(result.publicKey)
      setPassphrase('')
      setMessage('Passphrase verified. You can now enable alerts on this device.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not verify the passphrase.')
    } finally {
      setWorking(false)
    }
  }

  async function enableAlerts() {
    if (!publicKey) return
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      setMessage('This browser does not support push notifications. Try a supported browser on your phone.')
      return
    }

    setWorking(true)
    setMessage('')
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') throw new Error('Allow notifications in your browser to receive order alerts.')

      const registration = await navigator.serviceWorker.register('/push-sw.js')
      const subscription = await registration.pushManager.getSubscription() ?? await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeApplicationServerKey(publicKey),
      })
      const response = await fetch('/api/push/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not save this device.')

      setEnabled(true)
      setMessage('Order alerts are enabled on this device.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not enable order alerts.')
    } finally {
      setWorking(false)
    }
  }

  async function sendTest() {
    setWorking(true)
    setMessage('')
    try {
      const response = await fetch('/api/push/test', { method: 'POST' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not send a test alert.')
      setMessage(result.sent ? 'Test alert sent. Check your notifications.' : 'This device is not subscribed yet. Enable alerts first.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not send a test alert.')
    } finally {
      setWorking(false)
    }
  }

  async function disableAlerts() {
    setWorking(true)
    setMessage('')
    try {
      const registration = await navigator.serviceWorker.getRegistration('/push-sw.js')
      const subscription = await registration?.pushManager.getSubscription()
      if (subscription) {
        const response = await fetch('/api/push/subscriptions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
        if (!response.ok) throw new Error('Could not remove this device.')
        await subscription.unsubscribe()
      }
      setEnabled(false)
      setMessage('Order alerts are disabled on this device.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not disable order alerts.')
    } finally {
      setWorking(false)
    }
  }

  return (
    <section className="push-setup" aria-labelledby="push-setup-title">
      <span className="eyebrow">PRIVATE DEVICE SETUP</span>
      <h2 id="push-setup-title">Order alerts, wherever you are.</h2>
      <p>Unlock this private setup with your order-alert passphrase, then allow notifications on the phone or browser you want to use.</p>

      {!publicKey ? (
        <form className="push-form" onSubmit={unlock}>
          <label htmlFor="order-alerts-passphrase">Owner passphrase</label>
          <input
            id="order-alerts-passphrase"
            type="password"
            autoComplete="current-password"
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            required
          />
          <button className="button button-dark" type="submit" disabled={working}>
            {working ? 'Checking…' : 'Continue'}
          </button>
        </form>
      ) : (
        <div className="push-actions">
          {!enabled ? (
            <button className="button button-dark" type="button" onClick={enableAlerts} disabled={working}>
              {working ? 'Enabling…' : 'Enable alerts on this device'}
            </button>
          ) : (
            <div className="push-action-row">
              <button className="button button-dark" type="button" onClick={sendTest} disabled={working}>Send a test alert</button>
              <button className="push-text-button" type="button" onClick={disableAlerts} disabled={working}>Turn off on this device</button>
            </div>
          )}
        </div>
      )}

      <p className="push-status" role="status" aria-live="polite">{message}</p>
      <p className="push-footnote">Free browser push; no phone number or SMS fees. On iPhone, add this website to your Home Screen first, then enable notifications here. Repeat setup on each device you want to notify.</p>
    </section>
  )
}
