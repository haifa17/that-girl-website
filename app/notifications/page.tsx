import type { Metadata } from 'next'
import OrderAlertsSetup from '@/components/order-alerts-setup'

export const metadata: Metadata = {
  title: 'Order Alerts | THAT GIRL',
  description: 'Privately set up free browser push notifications for THAT GIRL order requests.',
  robots: { index: false, follow: false },
}

export default function NotificationsPage() {
  return (
    <main className="push-page">
      <a href="/" className="push-brand" aria-label="THAT GIRL home">THAT GIRL <span>♡</span></a>
      <div className="push-card">
        <span className="eyebrow">THAT GIRL · EVERYDAY, ELEVATED</span>
        <h1>Stay close to every lovely order.</h1>
        <p className="push-intro">Set up a private browser alert for new order requests. Your passphrase keeps device registration limited to you.</p>
        <OrderAlertsSetup />
        <a className="push-back-link" href="/">Back to the collection</a>
      </div>
    </main>
  )
}
