'use client'

import { createContext, useContext, useState, useTransition, type Dispatch, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { translations } from '@/i18n/translations'
import { useCart } from '@/hooks/use-cart'
import { useOfferExpiry } from '@/hooks/use-offer-expiry'
import { buildOrderMailto } from '@/lib/order'
import { CartAction, CartLine, Filter, LOCALE_COOKIE, Locale, Product, SatinCustomization, Size } from '@/lib/shop'

type ShopContext = {
    locale: Locale
    t: Record<string, any> // translations contain functions, so they're resolved client-side (not passed as RSC props)
    switchLocale: () => void
    offerExpired: boolean
    expireOffer: () => void
    lines: CartLine[]; count: number; total: number; dispatch: Dispatch<CartAction>
    filter: Filter; setFilter: (f: Filter) => void
    menuOpen: boolean; setMenuOpen: (open: boolean) => void
    selected: Product | null; selectProduct: (p: Product | null) => void
    cartOpen: boolean; setCartOpen: (open: boolean) => void
    submitted: boolean
    addToCart: (product: Product, size: Size | null, customization?: SatinCustomization) => void
    placeOrder: (form: FormData) => void
}

const Ctx = createContext<ShopContext | null>(null)

export function useShop() {
    const ctx = useContext(Ctx)
    if (!ctx) throw new Error('useShop must be used inside <ShopProvider>')
    return ctx
}

/** Client boundary holding all interactive state. Server-rendered sections are passed in as `children`. */
export function ShopProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
    const router = useRouter()
    const [, startTransition] = useTransition()
    const { expired: offerExpired, expire: expireOffer } = useOfferExpiry()
    const { lines, count, total, dispatch } = useCart(offerExpired)
    const [filter, setFilter] = useState<Filter>('Everything')
    const [menuOpen, setMenuOpen] = useState(false)
    const [selected, selectProduct] = useState<Product | null>(null)
    const [cartOpen, setCartOpen] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const t = translations[locale]

    // Language is a cookie, so the server re-renders the static sections in the new language.
    function switchLocale() {
        const next: Locale = locale === 'en' ? 'fr' : 'en'
        document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
        startTransition(() => router.refresh())
    }

    function addToCart(product: Product, size: Size | null, customization?: SatinCustomization) {
        dispatch({ type: 'add', product, size, customization })
        setCartOpen(true)
        setSubmitted(false)
    }

    function placeOrder(form: FormData) {
        window.location.href = buildOrderMailto({ cart: lines, total, form, t, locale, offerExpired })
        setSubmitted(true)
    }

    return (
        <Ctx.Provider value={{
            locale, t, switchLocale, offerExpired, expireOffer, lines, count, total, dispatch,
            filter, setFilter, menuOpen, setMenuOpen, selected, selectProduct, cartOpen, setCartOpen,
            submitted, addToCart, placeOrder,
        }}>
            {children}
        </Ctx.Provider>
    )
}