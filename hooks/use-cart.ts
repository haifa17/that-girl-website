import { useEffect, useMemo, useReducer, useRef } from 'react'
import { products, satinPillowcase } from '@/data/products'
import { CartLine, cartReducer, cartTotal, lineKey, Product, SatinCustomization, Size } from '@/lib/shop'

const STORAGE_KEY = 'thatgirl:cart:v1' // bump the suffix if the stored shape changes

/** Only ids/choices are stored, never prices — so price or copy changes apply to carts saved earlier. */
type StoredLine = { id: number; size: Size | null; quantity: number; customization?: SatinCustomization; image?: string }

const catalog = new Map<number, Product>([...products, satinPillowcase].map((p) => [p.id, p]))

const serialize = (lines: CartLine[]): StoredLine[] =>
    lines.map(({ product, size, quantity, customization }) => ({
        id: product.id, size, quantity, customization,
        image: product.id === satinPillowcase.id ? product.image : undefined, // satin image depends on chosen color
    }))

function restore(stored: unknown): CartLine[] {
    if (!Array.isArray(stored)) return []
    return stored.flatMap((s: StoredLine): CartLine[] => {
        const base = catalog.get(s?.id)
        if (!base || !Number.isInteger(s.quantity) || s.quantity < 1) return [] // drop products that no longer exist
        const product = s.image && base.id === satinPillowcase.id ? { ...base, image: s.image } : base
        return [{ key: lineKey(product, s.size ?? null, s.customization), product, size: s.size ?? null, quantity: s.quantity, customization: s.customization }]
    })
}

export function useCart(offerExpired: boolean) {
    const [lines, dispatch] = useReducer(cartReducer, [])
    const hydrated = useRef(false)

    // Load after mount (not in the initial state) to avoid SSR hydration mismatches.
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY)
            if (raw) dispatch({ type: 'hydrate', lines: restore(JSON.parse(raw)) })
        } catch { /* storage blocked or corrupt JSON: start with an empty cart */ }
        hydrated.current = true
    }, [])

    // Save on change — but never before the load above has run, or we'd overwrite the saved cart with [].
    useEffect(() => {
        if (!hydrated.current) return
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(lines))) } catch { /* quota/private mode */ }
    }, [lines])

    // Keep multiple tabs in sync.
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key !== STORAGE_KEY) return
            try { dispatch({ type: 'hydrate', lines: restore(e.newValue ? JSON.parse(e.newValue) : []) }) } catch { }
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    const { count, total } = useMemo(() => ({
        count: lines.reduce((n, l) => n + l.quantity, 0),
        total: cartTotal(lines, offerExpired),
    }), [lines, offerExpired])

    return { lines, count, total, dispatch }
}