'use client'

import { ArrowRight } from 'lucide-react'
import OpeningOfferCountdown from '@/components/opening-offer-countdown'
import { products } from '@/data/products'
import { CATEGORY_KEY, FILTERS, formatPrice, unitPrice } from '@/lib/shop'
import { useShop } from './shop-provider'
import { ProductCard } from './product-card'

export function ShopSection() {
    const { t, locale, offerExpired, expireOffer, filter, setFilter, selectProduct } = useShop()
    const fr = locale === 'fr'
    const visible = filter === 'Everything' ? products : products.filter((p) => p.category === filter)

    return (
        <section className="shop-section" id="shop">
            <div className="section-heading">
                <div>
                    <span className="eyebrow">THAT GIRL · FIT EDITION</span>
                    <h2>{t.fitTitle} <em>{t.fitTitleEmphasis}</em></h2>
                    <p className="collection-intro">{offerExpired ? t.introExpired : t.introOpening}</p>
                </div>
                <a className="text-link" href="#satin">{t.discoverSatin} <ArrowRight size={15} /></a>
            </div>
            <OpeningOfferCountdown onExpired={expireOffer} locale={locale} />
            <div className="shop-toolbar">
                <div className="filters" role="group" aria-label={t.filterLabel}>
                    {FILTERS.map((f) => (
                        <button key={f} className={filter === f ? 'filter active' : 'filter'} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                            {f === 'Everything' ? t.everything : t[CATEGORY_KEY[f]]}
                        </button>
                    ))}
                </div>
                <span className="product-count">{t.productCount(visible.length)}</span>
            </div>
            <div className="product-grid space-y-8 fit-product-grid">
                {visible.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
        </section>
    )
}