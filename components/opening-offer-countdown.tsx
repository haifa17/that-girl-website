'use client'

import { useEffect, useState } from 'react'

export const OPENING_OFFER_ENDS_AT = Date.parse('2026-12-12T23:59:59+01:00')

type OpeningOfferCountdownProps = {
  onExpired: () => void
}

function getSecondsRemaining() {
  return Math.max(0, Math.ceil((OPENING_OFFER_ENDS_AT - Date.now()) / 1000))
}

export default function OpeningOfferCountdown({ onExpired }: OpeningOfferCountdownProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(getSecondsRemaining)
  const isExpired = secondsRemaining === 0
  const days = Math.floor(secondsRemaining / 86_400)
  const hours = Math.floor((secondsRemaining % 86_400) / 3_600)
  const minutes = Math.floor((secondsRemaining % 3_600) / 60)
  const seconds = secondsRemaining % 60

  useEffect(() => {
    if (isExpired) {
      onExpired()
      return
    }

    const interval = window.setInterval(() => {
      const remaining = getSecondsRemaining()
      setSecondsRemaining(remaining)

      if (remaining === 0) {
        window.clearInterval(interval)
        onExpired()
      }
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isExpired, onExpired])

  return (
    <div className="opening-offer">
      <p className="opening-offer-message">
        {isExpired ? 'The opening offer has ended.' : 'Opening offer ends in'}
        <strong>{isExpired ? 'Now 79.900 DT per sport set' : 'Then 79.900 DT per sport set'}</strong>
      </p>
      <div className="opening-offer-clock" role="timer" aria-label={isExpired ? 'Opening offer ended; sport sets are now 79.900 DT' : 'Time remaining until sport set prices increase'}>
        <div className="opening-offer-unit"><strong>{days}</strong><span>Days</span></div>
        <div className="opening-offer-unit"><strong>{String(hours).padStart(2, '0')}</strong><span>Hours</span></div>
        <div className="opening-offer-unit"><strong>{String(minutes).padStart(2, '0')}</strong><span>Minutes</span></div>
        <div className="opening-offer-unit"><strong>{String(seconds).padStart(2, '0')}</strong><span>Seconds</span></div>
      </div>
    </div>
  )
}
