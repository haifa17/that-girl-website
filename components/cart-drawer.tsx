'use client'

import { useEffect, type Dispatch, type FormEvent } from 'react'
import { ArrowRight, Check, Minus, Plus, X } from 'lucide-react'
import { CartAction, CartLine, CATEGORY_KEY, formatPrice, isSatin, Locale, SATIN_PRICE, unitPrice } from '@/lib/shop'

type Props = {
    lines: CartLine[]; count: number; total: number
    locale: Locale; t: Record<string, any>; offerExpired: boolean
    submitted: boolean
    dispatch: Dispatch<CartAction>
    onClose: () => void
    onSubmit: (form: FormData) => void
}

export function CartDrawer({ lines, count, total, locale, t, offerExpired, submitted, dispatch, onClose, onSubmit }: Props) {
    const money = (n: number | null) => formatPrice(n, locale, t.comingSoon)

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(new FormData(e.currentTarget))
    }

    return (
        <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <aside className="cart-drawer" aria-label={t.yourBag}>
                <div className="drawer-header">
                    <div><span className="eyebrow">{t.yourFinds}</span><h2>{t.yourBag} <span>({count})</span></h2></div>
                    <button className="icon-button" onClick={onClose} aria-label={t.closeBag}><X /></button>
                </div>

                {lines.length === 0 ? (
                    <div className="empty-cart">
                        <span className="empty-bow">୨୧</span>
                        {/* translations: replace emptyBagTitle with emptyBagLine1 / emptyBagLine2 */}
                        <h3>{t.emptyBagLine1}<br />{t.emptyBagLine2}</h3>
                        <button className="button button-dark" onClick={onClose}>{t.keepExploring} <ArrowRight size={16} /></button>
                    </div>
                ) : (
                    <>
                        <div className="cart-lines">
                            {lines.map(({ key, product, size, quantity, customization }) => {
                                const name = locale === 'fr' ? product.nameFr : product.name
                                return (
                                    <div className="cart-line" key={key}>
                                        <img src={product.image} alt="" />
                                        <div className="line-detail">
                                            <span className="product-category">{t[CATEGORY_KEY[product.category]]}</span>
                                            <h3>{name}</h3>
                                            {size && <span className="cart-line-size">{t.sizeLabel(size)}</span>}
                                            {customization && (
                                                <span className="cart-line-size">
                                                    {t.satinColorLabel}: {customization.color} · {t.satinWidthLabel} × {t.satinLengthLabel}: {customization.width} × {customization.length} cm
                                                </span>
                                            )}
                                            <strong>{money(unitPrice(product, offerExpired))}</strong>
                                            {isSatin(product) && <span className="cart-line-size">{t.satinPairHint(money(SATIN_PRICE.pair))}</span>}
                                            <div className="quantity">
                                                <button aria-label={t.removeProduct(name)} onClick={() => dispatch({ type: 'change', key, delta: -1 })}><Minus size={13} /></button>
                                                <span>{quantity}</span>
                                                <button aria-label={t.addProduct(name)} onClick={() => dispatch({ type: 'change', key, delta: 1 })}><Plus size={13} /></button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="order-area">
                            <div className="total-line"><span>{t.subtotal}</span><strong>{money(total)}</strong></div>
                            <p className="order-note">{t.deliveryNote}</p>
                            <form className="order-form" onSubmit={handleSubmit}>
                                <label>{t.yourName}<input name="name" autoComplete="name" required /></label>
                                <label>{t.email}<input type="email" name="email" autoComplete="email" required /></label>
                                <label>{t.phone}<input type="tel" name="phone" autoComplete="tel" required /></label>
                                <label>{t.address}<textarea name="address" autoComplete="street-address" rows={2} required /></label>
                                <label>{t.anythingElse} <span className="optional">{t.optional}</span><textarea name="note" rows={2} /></label>
                                <button className="button button-dark submit-order" type="submit">
                                    {submitted ? <><Check size={16} /> {t.emailOpened}</> : <>{t.sendOrder} <ArrowRight size={16} /></>}
                                </button>
                                <span className="email-hint">{t.emailHint}</span>
                            </form>
                        </div>
                    </>
                )}
            </aside>
        </div>
    )
}