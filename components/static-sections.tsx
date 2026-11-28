// Server components: no 'use client', no hooks, no event handlers. `t` is passed from app/page.tsx.
import { ArrowRight } from 'lucide-react'
import { formatPrice, Locale, ORDER_EMAIL, SATIN_PRICE } from '@/lib/shop'
import { satinEyeMask } from '@/data/products'
import Link from 'next/link'
import { ProductCard } from './product-card'

type T = Record<string, any>

export function Hero({ t }: { t: T }) {
    return (
        <section className="hero hero-banner" id="top">
            <Link className="hero-banner-link" href="#shop" aria-label={t.heroLink}>
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Univers%20rose%20poudr%C3%A9%20That%20Girl-gg9aNkhCEVW3e65SD4bu6fxLEakLc3.png" alt={t.heroAlt} />
            </Link>
        </section>
    )
}

export function PromiseStrip({ t }: { t: T }) {
    const group = (hidden = false) => (
        <div className="marquee-group" aria-hidden={hidden || undefined}>
            {[t.promiseOne, t.promiseTwo, t.promiseThree, t.promiseOne].map((text, i) => (
                <span key={i} style={{ display: 'contents' }}><span>{text}</span><i>✳</i></span>
            ))}
        </div>
    )
    return (
        <section className="promise-strip" aria-label={t.promiseOne}>
            <div className="marquee-track">{group()}{group(true)}</div>
        </section>
    )
}

export function SatinGallery({ t, locale }: { t: T; locale: Locale }) {
    const price = (n: number) => formatPrice(n, locale, t.comingSoon)
    const card = (src: string, alt: string, caption?: string, amount?: number) => (
        <figure className="satin-image-card">
            <img src={src} alt={alt} loading="lazy" />
            {caption && <figcaption>{caption} <strong className="satin-price">{price(amount!)}</strong></figcaption>}
        </figure>
    )
    return (
        <>
            <div className="satin-offer-grid" aria-label={t.satinOffersLabel}>
                {card('/images/satin-pillowcases-21dt.jpeg', t.satinPromoAlt, t.satinOfferOne, SATIN_PRICE.pair)}
                {card('/images/satin-pillowcase-12dt.jpeg', t.satinChampagneAlt, t.satinOfferTwo, SATIN_PRICE.single)}
            </div>
            {/* <SatinCustomizer /> is rendered between these two blocks by app/page.tsx */}
        </>
    )
}

export function SatinAccessories({ t }: { t: T }) {
    return (
        <section className="satin-accessories-feature" aria-labelledby="satin-accessories-heading">
            <h3 id="satin-accessories-heading" className="satin-accessories-title">{t.satinAccessoriesTitle}</h3>
            <div className="satin-accessory-grid">
                <ProductCard product={satinEyeMask} />
            </div>
        </section>
    )
}

export function SatinInfo({ t }: { t: T }) {
    return (
        <div className="satin-info-grid" aria-label={t.satinDetailsLabel}>
            <figure className="satin-image-card"><img src="/images/satin-benefits-arabic.jpeg" alt={t.satinBenefitsAlt} loading="lazy" /></figure>
            <figure className="satin-image-card"><img src="/images/satin-benefits-french.jpeg" alt={t.satinBenefitsAlt} loading="lazy" /></figure>
            <figure className="satin-image-card"><img src="/images/satin-pillowcase-texture.jpeg" alt={t.satinTextureAlt} loading="lazy" /></figure>
        </div>
    )
}

export function Story({ t }: { t: T }) {
    return (
        <section className="story-section" id="story">
            <div className="story-image">
                <img src="/images/story-concept.png" alt={t.storyImageAlt} loading="lazy" />
                <div className="story-photo-caption"><span>{t.ourStoryLabel}</span><strong>{t.storyCaption}</strong></div>
            </div>
            <div className="story-copy">
                <span className="eyebrow">{t.storyNote}</span>
                <h2>{t.storyTitle}<br /><em>{t.storyTitleYou}</em> {t.storyTitleEnd}</h2>
                <p>{t.storyBody}</p>
                <div className="story-values"><span>{t.valueOne}</span><span>{t.valueTwo}</span><span>{t.valueThree}</span></div>
                <a href="#shop" className="text-link">{t.storyLink} <ArrowRight size={15} /></a>
                <span className="story-signature">{t.storySignature}</span>
            </div>
        </section>
    )
}

export function Newsletter({ t }: { t: T }) {
    return (
        <section className="newsletter">
            <span className="eyebrow">{t.newsletterLabel}</span>
            <h2>{t.newsletterTitle}<br /><em>{t.newsletterTitleEnd}</em></h2>
            <span className="newsletter-spark">✳</span>
        </section>
    )
}

export function Footer({ t }: { t: T }) {
    return (
        <footer className="site-footer">
            <Link href="#top" className="footer-mark">THAT GIRL <span>♡</span></Link>
            <span>ACTIVE · LIFESTYLE</span>
            <Link href="https://instagram.com/that________giirl" target="_blank" rel="noreferrer" aria-label={t.followInstagram}>
                Instagram
            </Link>
            <Link href={`mailto:${ORDER_EMAIL}`}>{t.sayHello}</Link>
            <small>{t.copyright}</small>
        </footer>
    )
}
