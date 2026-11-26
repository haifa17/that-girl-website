import { useCallback, useEffect, useState } from 'react'
import { OPENING_OFFER_ENDS_AT } from '@/components/opening-offer-countdown'

/** Starts `false` so server and client render the same HTML; flips after mount (or at the deadline). */
export function useOfferExpiry() {
    const [expired, setExpired] = useState(false)
    const expire = useCallback(() => setExpired(true), [])
    useEffect(() => {
        const remaining = OPENING_OFFER_ENDS_AT - Date.now()
        if (remaining <= 0) { expire(); return }
        const id = window.setTimeout(expire, remaining)
        return () => window.clearTimeout(id)
    }, [expire])
    return { expired, expire }
}