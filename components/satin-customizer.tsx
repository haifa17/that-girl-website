'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { formatPrice, parseDimension, SATIN_LIMITS, SATIN_PRICE } from '@/lib/shop'
import { satinPillowcase } from '@/data/products'
import { useShop } from './shop-provider'

const COLORS = [
    { id: 'Burgundy', swatch: 'burgundy', labelKey: 'satinBurgundy', altKey: 'satinBurgundyAlt', image: satinPillowcase.image },
    { id: 'Blush pink', swatch: 'blush', labelKey: 'satinBlush', altKey: 'satinBlushAlt', image: satinPillowcase.gallery?.[0] ?? satinPillowcase.image },
] as const

export function SatinCustomizer() {
    const { locale, t, addToCart } = useShop()
    const [colorId, setColorId] = useState<(typeof COLORS)[number]['id']>('Burgundy')
    const [customColor, setCustomColor] = useState('')
    const [width, setWidth] = useState('')
    const [length, setLength] = useState('')
    const w = parseDimension(width)
    const l = parseDimension(length)

    function submit(e: React.FormEvent) {
        e.preventDefault()
        if (w === null || l === null) return
        const chosen = COLORS.find((c) => c.id === colorId)!
        addToCart({ ...satinPillowcase, image: chosen.image }, null, { color: customColor.trim() || chosen.id, width: w, length: l })
    }

    return (
        <div className="satin-customizer">
            <div className="satin-customizer-gallery" role="group" aria-label={t.satinGalleryLabel}>
                {COLORS.map((c) => <img key={c.id} src={c.image} alt={t[c.altKey]} loading="lazy" />)}
            </div>
            <form className="satin-customizer-panel" onSubmit={submit}>
                <span className="eyebrow">THAT GIRL · SATIN SLEEP</span>
                <h3>{t.satinCustomTitle}</h3>
                <strong className="satin-customizer-price">{formatPrice(SATIN_PRICE.single, locale, t.comingSoon)}</strong>
                <span className="satin-pair-hint">{t.satinPairHint(formatPrice(SATIN_PRICE.pair, locale, t.comingSoon))}</span>
                <fieldset>
                    <legend>{t.satinColorLabel}</legend>
                    <div className="satin-color-options">
                        {COLORS.map((c) => (
                            <label className="satin-color-option" key={c.id}>
                                <input type="radio" name="satin-color" value={c.id} checked={colorId === c.id} onChange={() => { setColorId(c.id); setCustomColor('') }} />
                                <span className={`satin-color-swatch ${c.swatch}`} aria-hidden="true" />
                                <span>{t[c.labelKey]}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>
                <label>{t.satinCustomColorLabel}
                    <input type="text" value={customColor} onChange={(e) => setCustomColor(e.target.value)} placeholder={t.satinCustomColorPlaceholder} maxLength={40} />
                </label>
                <fieldset>
                    <legend>{t.satinDimensionsLabel}</legend>
                    <div className="satin-dimension-fields">
                        <label>{t.satinWidthLabel}<input type="number" inputMode="decimal" {...SATIN_LIMITS} step="0.5" value={width} onChange={(e) => setWidth(e.target.value)} required /></label>
                        <label>{t.satinLengthLabel}<input type="number" inputMode="decimal" {...SATIN_LIMITS} step="0.5" value={length} onChange={(e) => setLength(e.target.value)} required /></label>
                    </div>
                </fieldset>
                <button type="submit" className="button button-dark" disabled={w === null || l === null}>{t.addToBag} <ShoppingBag size={16} /></button>
            </form>
        </div>
    )
}