'use client'

import { Menu, ShoppingBag } from 'lucide-react'
import { Filter } from '@/lib/shop'
import { useShop } from './shop-provider'
import Link from 'next/link'

export function SiteHeader() {
    const { t, locale, switchLocale, count, setCartOpen, menuOpen, setMenuOpen, setFilter } = useShop()
    const go = (next?: Filter) => () => { if (next) setFilter(next); setMenuOpen(false) }

    return (
        <header className="site-header">
            <button className="mobile-menu icon-button" aria-label={menuOpen ? t.closeMenu : t.openMenu} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu /></button>
            <Link href="#top" className="wordmark" aria-label="THAT GIRL home">
                <span className="wordmark-bow">୨୧</span>THAT GIRL
                <small>ACTIVE · LIFESTYLE</small>
            </Link>
            <nav className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label={t.mainNavigation}>
                <Link
                    href="#shop" onClick={go('Everything')}>{t.shopAll}</Link>
                <Link href="#shop" onClick={go('Coco Set')}>{t.cocoSet}</Link>
                <Link href="#shop" onClick={go('Elora Set')}>{t.eloraSet}</Link>
                <Link href="#satin" onClick={go()}>{t.satinPillowcases}</Link>
                <Link href="#story" onClick={go()}>{t.ourStory}</Link>
            </nav>
            <div className="header-actions">
                <button type="button" className="locale-toggle" onClick={switchLocale} aria-label={t.switchLanguage}>{locale.toUpperCase()}</button>
                <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={t.openBag(count)}><ShoppingBag size={19} /><span>{t.bag}</span><span className="cart-count">{count}</span></button>
            </div>
        </header>
    )
}