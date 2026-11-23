'use client'

import { useEffect, useState } from 'react'

export const OPENING_OFFER_ENDS_AT = Date.parse('2026-12-12T23:59:59+01:00')

type OpeningOfferCountdownProps = {
  onExpired: () => void
  locale: 'en' | 'fr'
}

function getSecondsRemaining() {
  return Math.max(0, Math.ceil((OPENING_OFFER_ENDS_AT - Date.now()) / 1000))
}

export default function OpeningOfferCountdown({ onExpired, locale }: OpeningOfferCountdownProps) {
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

  const copy = locale === 'fr'
    ? { ended: 'L’offre de lancement est terminée.', opening: 'Fin de l’offre de lancement dans', currentPrice: 'Maintenant 79,900 DT par ensemble', nextPrice: 'Puis 79,900 DT par ensemble', timerEnded: 'Offre terminée ; les ensembles de sport sont à 79,900 DT', timerRemaining: 'Temps restant avant la hausse des prix', days: 'Jours', hours: 'Heures', minutes: 'Minutes', seconds: 'Secondes' }
    : { ended: 'The opening offer has ended.', opening: 'Opening offer ends in', currentPrice: 'Now 79.900 DT per sport set', nextPrice: 'Then 79.900 DT per sport set', timerEnded: 'Opening offer ended; sport sets are now 79.900 DT', timerRemaining: 'Time remaining until sport set prices increase', days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' }

  return (
    <div className="opening-offer">
      <p className="opening-offer-message">
        {isExpired ? copy.ended : copy.opening}
        <strong>{isExpired ? copy.currentPrice : copy.nextPrice}</strong>
      </p>
      <div className="opening-offer-clock" role="timer" aria-label={isExpired ? copy.timerEnded : copy.timerRemaining}>
        <div className="opening-offer-unit"><strong>{days}</strong><span>{copy.days}</span></div>
        <div className="opening-offer-unit"><strong>{String(hours).padStart(2, '0')}</strong><span>{copy.hours}</span></div>
        <div className="opening-offer-unit"><strong>{String(minutes).padStart(2, '0')}</strong><span>{copy.minutes}</span></div>
        <div className="opening-offer-unit"><strong>{String(seconds).padStart(2, '0')}</strong><span>{copy.seconds}</span></div>
      </div>
    </div>
  )
}
