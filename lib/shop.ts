export type Locale = 'en' | 'fr'
export type Category = 'Coco Set' | 'Elora Set' | 'Fit Set' | 'Leggings' | 'Satin Pillowcases' | 'Satin Accessories'
export type Filter = 'Everything' | Exclude<Category, 'Satin Pillowcases' | 'Satin Accessories'>

export const FILTERS: readonly Filter[] = ['Everything', 'Coco Set', 'Elora Set', 'Fit Set', 'Leggings']
export const SIZES = ['S', 'M', 'L'] as const
export type Size = (typeof SIZES)[number]

export type Product = {
    id: number
    name: string
    nameFr: string
    category: Category
    price: number | null
    hasSizeOptions?: boolean
    image: string
    gallery?: string[]
    tag?: string
    tone: string
    details: string[]
    detailsFr: string[]
}

export type SatinCustomization = { color: string; width: number; length: number }
export type CartLine = {
    key: string
    product: Product
    size: Size | null
    quantity: number
    customization?: SatinCustomization
}

export const ORDER_EMAIL = 'that_girl2026@outlook.fr'
export const EXPIRED_OFFER_SURCHARGE = 10 // DT added to sets once the opening offer ends
export const SATIN_PRICE = { single: 12, pair: 21 } as const // 1 piece = 12 DT, 2 pieces = 21 DT
export const isSatin = (p: Product) => p.category === 'Satin Pillowcases'
export const SATIN_LIMITS = { min: 20, max: 300 } as const

/** Single source of truth for dimension validation (UI gate + add-to-cart). */
export function parseDimension(value: string): number | null {
    const n = Number(value)
    return value.trim() !== '' && Number.isFinite(n) && n >= SATIN_LIMITS.min && n <= SATIN_LIMITS.max ? n : null
}

export function unitPrice(product: Product, offerExpired: boolean): number | null {
    if (product.price === null) return null
    const isSportSet = product.category === 'Coco Set' || product.category === 'Elora Set' || product.category === 'Fit Set'
    const surcharge = offerExpired && isSportSet ? EXPIRED_OFFER_SURCHARGE : 0
    return product.price + surcharge
}

export function formatPrice(amount: number | null, locale: Locale, comingSoon: string): string {
    if (amount === null) return comingSoon
    const formatted = amount.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
    return `${formatted} DT`
}

export const lineKey = (p: Product, size: Size | null, c?: SatinCustomization) =>
    [p.id, size ?? '-', c?.color ?? '-', c?.width ?? '-', c?.length ?? '-'].join('|')

/* ---------- cart reducer ---------- */
export type CartAction =
    | { type: 'add'; product: Product; size: Size | null; customization?: SatinCustomization }
    | { type: 'change'; key: string; delta: number }
    | { type: 'hydrate'; lines: CartLine[] }

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
    switch (action.type) {
        case 'hydrate':
            return action.lines
        case 'add': {
            const key = lineKey(action.product, action.size, action.customization)
            return state.some((l) => l.key === key)
                ? state.map((l) => (l.key === key ? { ...l, quantity: l.quantity + 1 } : l))
                : [...state, { key, product: action.product, size: action.size, quantity: 1, customization: action.customization }]
        }
        case 'change':
            return state
                .map((l) => (l.key === action.key ? { ...l, quantity: l.quantity + action.delta } : l))
                .filter((l) => l.quantity > 0)
    }
}

/** Satin is bundle-priced across ALL satin lines (any color/size): every 2 pieces = 21 DT, a leftover piece = 12 DT. */
export function satinTotal(pieces: number): number {
    return Math.floor(pieces / 2) * SATIN_PRICE.pair + (pieces % 2) * SATIN_PRICE.single
}

export function cartTotal(lines: CartLine[], offerExpired: boolean): number {
    let satinPieces = 0
    let rest = 0
    for (const l of lines) {
        if (isSatin(l.product)) satinPieces += l.quantity
        else rest += (unitPrice(l.product, offerExpired) ?? 0) * l.quantity
    }
    return rest + satinTotal(satinPieces)
}

/** Maps a category to its translation key — replaces the nested ternaries. */
export const CATEGORY_KEY = {
    'Coco Set': 'cocoSet',
    'Elora Set': 'eloraSet',
    'Fit Set': 'fitSet',
    Leggings: 'leggings',
    'Satin Pillowcases': 'satinPillowcases',
    'Satin Accessories': 'satinAccessories',
} as const satisfies Record<Category, string>

export const LOCALE_COOKIE = 'locale'
export const productImages = (p: Product): string[] =>
    Array.from(new Set([p.image, ...(p.gallery ?? [])]))
