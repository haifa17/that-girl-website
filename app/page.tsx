import type { Metadata } from 'next'
import { Overlays } from '@/components/overlays'
import { ShopProvider } from '@/components/shop-provider'
import { ShopSection } from '@/components/shop-section'
import { SatinCustomizer } from '@/components/satin-customizer'
import { SiteHeader } from '@/components/site-header'
import { Footer, Hero, Newsletter, PromiseStrip, SatinAccessories, SatinGallery, SatinInfo, Story } from '@/components/static-sections'
import { getLocale } from '@/lib/locale.server'
import { translations } from '@/i18n/translations'

export const metadata: Metadata = {
  title: 'THAT GIRL · Active Lifestyle',
  description: 'Coco, Elora and Fit sets, plus custom satin pillowcases and sleep masks.',
}

// Server Component: reads the language cookie and renders every static section on the server.
// Only the interactive pieces (header, shop grid, satin form, dialog, cart) are client components.
export default async function Page() {
  const locale = await getLocale()
  const t = translations[locale]

  return (
    <ShopProvider locale={locale}>
      <main>
        <div className="announcement">{t.announcement} <span>♡</span></div>
        <SiteHeader />
        <Hero t={t} />
        <PromiseStrip t={t} />
        <ShopSection />

        <section className="shop-section satin-section" id="satin" aria-labelledby="satin-heading">
          <header className="satin-intro">
            <span className="eyebrow">THAT GIRL · SATIN SLEEP</span>
            <h2 id="satin-heading">{t.satinTitle} <em>{t.satinTitleEmphasis}</em></h2>
            <p className="collection-intro">{t.satinIntro}</p>
          </header>

          <section className="satin-offers-block" aria-label={t.satinOffersLabel}>
            <div className="satin-block-heading"><span className="eyebrow">{t.satinOffersLabel}</span></div>
            <SatinGallery t={t} locale={locale} />
          </section>

          <SatinCustomizer />

          <section className="satin-details-block" aria-labelledby="satin-details-heading">
            <header className="satin-block-heading">
              <span className="eyebrow">{t.satinDetailsLabel}</span>
              <h3 id="satin-details-heading">{t.satinBenefitsTitle}</h3>
            </header>
            <SatinInfo t={t} />
          </section>

          <SatinAccessories t={t} />
        </section>

        <Story t={t} />
        <Newsletter t={t} />
        <Footer t={t} />
      </main>
      <Overlays />
    </ShopProvider>
  )
}
