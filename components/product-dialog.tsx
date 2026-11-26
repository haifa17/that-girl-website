'use client'

import { useEffect, useRef, useState } from 'react'
import { ShoppingBag, X } from 'lucide-react'
import { formatPrice, Locale, Product, Size, SIZES, unitPrice } from '@/lib/shop'
import { fitEditionSpecifications, fitEditionSpecificationsFr } from '@/data/products'

type Props = {
    product: Product
    locale: Locale
    t: Record<string, any>
    offerExpired: boolean
    onClose: () => void
    onAdd: (product: Product, size: Size) => void
}

/** Mount with `key={product.id}` so size/image state resets per product. */
export function ProductDialog({ product, locale, t, offerExpired, onClose, onAdd }: Props) {
    const ref = useRef<HTMLDialogElement>(null)
    const [size, setSize] = useState<Size | null>(null)
    const [image, setImage] = useState(product.image)
    const fr = locale === 'fr'
    const name = fr ? product.nameFr : product.name
    const specs = fr ? fitEditionSpecificationsFr : fitEditionSpecifications

    useEffect(() => {
        const dialog = ref.current
        if (dialog && !dialog.open) dialog.showModal()
        return () => dialog?.close()
    }, [])

    return (
        <dialog
            ref={ref}
            className="product-dialog"
            aria-labelledby="product-dialog-title"
            onClose={onClose} // fires for Esc, close() and the X button alike
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <button type="button" className="product-dialog-close icon-button" onClick={onClose} aria-label={t.closeProduct} autoFocus><X /></button>
            <div className="product-dialog-layout">
                <div className={`product-dialog-image ${product.tone}`}><img src={image} alt={name} /></div>
                <div className="product-dialog-copy">
                    <span className="eyebrow">THAT GIRL · FIT EDITION</span>
                    <h2 id="product-dialog-title">{name}</h2>
                    <p className="product-dialog-price">
                        {offerExpired ? t.regularPrice : t.openingSpecial} · {formatPrice(unitPrice(product, offerExpired), locale, t.comingSoon)}
                    </p>
                    <details className="product-extra-details">
                        <summary>{t.productDetails}</summary>
                        <ul>{(fr ? product.detailsFr : product.details).map((d) => <li key={d}>{d}</li>)}</ul>
                    </details>
                    <div className="product-purchase">
                        <div className="product-specifications">
                            <h3>{t.specifications}</h3>
                            <ul>{specs.map((s) => <li key={s}>{s}</li>)}</ul>
                        </div>
                        <fieldset className="size-picker">
                            <legend>{t.chooseSize}</legend>
                            {SIZES.map((s) => (
                                <label className="size-option" key={s}>
                                    <input type="radio" name="size" value={s} checked={size === s} onChange={() => setSize(s)} />
                                    <span>{s}</span>
                                </label>
                            ))}
                        </fieldset>
                        <button type="button" className="button button-dark product-add-button" disabled={!size} onClick={() => size && onAdd(product, size)}>
                            {t.addToBag} <ShoppingBag size={16} />
                        </button>
                    </div>
                </div>
            </div>
            {product.gallery?.length ? (
                <div className="product-dialog-gallery" aria-label={t.morePhotos(name)}>
                    {product.gallery.map((src, i) => (
                        <button type="button" key={src} onClick={() => setImage(src)} aria-pressed={image === src} aria-label={`${t.morePhotos(name)} ${i + 1}`}>
                            <img src={src} alt={`${name} ${fr ? 'vue supplémentaire' : 'alternate way to wear'}`} loading="lazy" />
                        </button>
                    ))}
                </div>
            ) : null}
        </dialog>
    )
}