import { CartLine, formatPrice, isSatin, Locale, ORDER_EMAIL, unitPrice } from './shop'

type Copy = Record<string, any> // pass translations[locale]

export function buildOrderMailto(opts: {
    cart: CartLine[]; total: number; form: FormData; t: Copy; locale: Locale; offerExpired: boolean
}) {
    const { cart, total, form, t, locale, offerExpired } = opts
    const money = (n: number | null) => formatPrice(n, locale, t.comingSoon)
    const name = (p: CartLine['product']) => (locale === 'fr' ? p.nameFr : p.name)

    const items = cart.map(({ product, size, quantity, customization }) => {
        const price = unitPrice(product, offerExpired)
        const parts = [
            name(product),
            size && t.sizeLabel(size),
            customization && `${t.satinColorSummary}: ${customization.color}`,
            customization && `${t.satinDimensionsSummary}: ${customization.width} × ${customization.length} cm`,
        ].filter(Boolean)
        const lineTotal = isSatin(product) ? '' : ` — ${money(price === null ? null : price * quantity)}` // satin is bundle-priced; see total
        return `${parts.join(' · ')} x${quantity}${lineTotal}`
    })

    const field = (label: string, key: string, fallback = '') => `${label}: ${form.get(key) || fallback}`
    const body = [
        t.orderEmailIntro, '', ...items, '', `${t.orderTotal}: ${money(total)}`, '',
        field(t.yourName, 'name'), field(t.email, 'email'), field(t.phone, 'phone'), field(t.address, 'address'), '',
        field(t.note, 'note', '—'),
    ].join('\n')

    return `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(t.emailSubject)}&body=${encodeURIComponent(body)}`
}