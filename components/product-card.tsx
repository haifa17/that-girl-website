'use client'

import { useState } from 'react'
import { ShoppingBag, ShoppingCart } from 'lucide-react'
import { CATEGORY_KEY, formatPrice, Product, productImages, Size, SIZES, unitPrice } from '@/lib/shop'
import { useShop } from './shop-provider'

export function ProductCard({ product }: { product: Product }) {
  const { t, locale, offerExpired, selectProduct, addToCart } = useShop()
  const [index, setIndex] = useState(0)
  const [size, setSize] = useState<Size | null>(null)
  const images = productImages(product)
  const fr = locale === 'fr'
  const name = fr ? product.nameFr : product.name
  const hasSizeOptions = product.hasSizeOptions !== false
  const open = () => selectProduct(product)
  const openLabel = `${fr ? 'Voir les détails de' : 'View details for'} ${name}`

  function handleAdd() {
    if (hasSizeOptions && !size) return
    addToCart(product, hasSizeOptions ? size : null)
    setSize(null) // ready for the next add
  }

  return (
    <article className="product-card ">
      <div className={`product-image ${product.tone}`}>
        <button type="button" className="product-image-button" onClick={open} aria-label={openLabel}>
          <img src={images[index]} alt="" loading="lazy" />
        </button>
        {!offerExpired && product.tag && <span className="product-tag">{t.openingSpecial}</span>}
        {images.length > 1 && (
          <div className="card-gallery" role="group" aria-label={t.morePhotos(name)}>
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={i === index ? 'card-gallery-thumb active' : 'card-gallery-thumb'}
                aria-pressed={i === index}
                aria-label={`${t.morePhotos(name)} ${i + 1}`}
                onClick={() => setIndex(i)}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      <button type="button" className="product-open" onClick={open} aria-label={openLabel}>
        <div className="product-info">
          <div><span className="product-category">{t[CATEGORY_KEY[product.category]]}</span><h3>{name}</h3></div>
          <span className="price">{formatPrice(unitPrice(product, offerExpired), locale, t.comingSoon)}</span>
        </div>
      </button>

      <div className="card-purchase">
        {hasSizeOptions ? (
          <fieldset className="card-sizes">
            <legend className="visually-hidden">{t.chooseSize}</legend>
            {SIZES.map((s) => (
              <label className="card-size-option" key={s}>
                <input type="radio" name={`card-size-${product.id}`} value={s} checked={size === s} onChange={() => setSize(s)} />
                <span>{s}</span>
              </label>
            ))}
          </fieldset>
        ) : <span className="card-one-size">{t.oneSize}</span>}
        <button type="button" className="button button-dark card-add-button" disabled={hasSizeOptions && !size} onClick={handleAdd} aria-label={`${t.addToBag}: ${name}`}>
          <ShoppingCart size={20} />
        </button>
      </div>
    </article>
  )
}
