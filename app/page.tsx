'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Check, Menu, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import OpeningOfferCountdown, { OPENING_OFFER_ENDS_AT } from '@/components/opening-offer-countdown'

type Product = { id: number; name: string; nameFr: string; category: 'Sport Sets'; price: number | null; image: string; gallery?: string[]; tag?: string; tone: string; details: string[]; detailsFr: string[] }
type Locale = 'en' | 'fr'

const products: Product[] = [
  { id: 1, name: 'The Strappy Sculpt Set · Black', nameFr: 'Ensemble sculptant à bretelles · Noir', category: 'Sport Sets', price: 69.9, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-23%20at%209.02.02%20PM68-k5GI2IoUY8Vxdn1Xf12BWBXqvpt32y.jpeg', tag: 'Opening special', tone: 'rose', details: ['Matching long-sleeve top and high-waist leggings', 'Square neckline with halter-style straps', 'Color: Black'], detailsFr: ['Ensemble composé d’un haut à manches longues et d’un legging taille haute', 'Encolure carrée avec bretelles style dos nu', 'Couleur : noir'] },
  { id: 2, name: 'The Strappy Sculpt Set · Mauve', nameFr: 'Ensemble sculptant à bretelles · Mauve', category: 'Sport Sets', price: 69.9, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-23%20at%209.02.02%20PM-NmOtz6MnWlPyzmCqFTzib7J4Xwez24.jpeg', tag: 'Opening special', tone: 'mauve', details: ['Matching long-sleeve top and high-waist leggings', 'Square neckline with halter-style straps', 'Color: Mauve'], detailsFr: ['Ensemble composé d’un haut à manches longues et d’un legging taille haute', 'Encolure carrée avec bretelles style dos nu', 'Couleur : mauve'] },
  { id: 3, name: 'The Strappy Sculpt Set · Burgundy', nameFr: 'Ensemble sculptant à bretelles · Bordeaux', category: 'Sport Sets', price: 69.9, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-23%20at%209.02.02%20PM8-GaiidGQKsOp8evqrYUpVAQFKuAei7t.jpeg', tag: 'Opening special', tone: 'rose', details: ['Matching long-sleeve top and high-waist leggings', 'Square neckline with halter-style straps', 'Color: Burgundy'], detailsFr: ['Ensemble composé d’un haut à manches longues et d’un legging taille haute', 'Encolure carrée avec bretelles style dos nu', 'Couleur : bordeaux'] },
  { id: 4, name: 'The Wrap Sculpt Set · Green', nameFr: 'Ensemble sculptant cache-cœur · Vert', category: 'Sport Sets', price: 69.9, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-23%20at%209.02.02%20PM54-MwR7qGyZ4lJnrWkh7hTkJ18mlb89U6.jpeg', tag: 'Opening special', tone: 'green', details: ['Matching wrap top and high-waist leggings', 'Adjustable waist tie and flattering wrap neckline', 'Soft, breathable, lightweight fabric', 'Color: Green'], detailsFr: ['Ensemble composé d’un haut cache-cœur et d’un legging taille haute', 'Lien ajustable à la taille et encolure cache-cœur flatteuse', 'Tissu doux, respirant et léger', 'Couleur : vert'] },
  { id: 5, name: 'The Wrap Sculpt Set · Mauve', nameFr: 'Ensemble sculptant cache-cœur · Mauve', category: 'Sport Sets', price: 69.9, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-23%20at%209.02.02%20PM-NmOtz6MnWlPyzmCqFTzib7J4Xwez24.jpeg', tag: 'Opening special', tone: 'mauve', details: ['Matching wrap top and high-waist leggings', 'Adjustable waist tie and flattering wrap neckline', 'Soft, breathable, lightweight fabric', 'Color: Mauve'], detailsFr: ['Ensemble composé d’un haut cache-cœur et d’un legging taille haute', 'Lien ajustable à la taille et encolure cache-cœur flatteuse', 'Tissu doux, respirant et léger', 'Couleur : mauve'] }
]
const fitEditionSpecifications = ['Soft, stretchy fabric with an elastic finish', 'Opaque and non-sheer', 'Premium quality', 'Available sizes: S, M and L']
const fitEditionSpecificationsFr = ['Tissu doux et extensible, avec une finition élastiquée', 'Opaque et non transparent', 'Qualité premium', 'Tailles disponibles : S, M et L']
const sizes = ['S', 'M', 'L'] as const
type Size = (typeof sizes)[number]
const categories = ['Everything', 'Sport Sets']
const formatPrice = (amount: number | null) => amount === null ? 'Coming soon' : `${amount.toFixed(3)} DT`
const currentPrice = (product: Product, offerExpired: boolean) => product.price === null ? null : product.price + (offerExpired ? 10 : 0)

const translations = {
  en: {
    announcement: 'A little love, a lot of confidence. Free delivery from 99 DT', openMenu: 'Open menu', closeMenu: 'Close menu', mainNavigation: 'Main navigation', heroLink: 'Discover the THAT GIRL collection', heroAlt: 'THAT GIRL active lifestyle collection in a blush pink boutique, featuring apparel, bags, accessories, and the message “Look good. Feel good.”', satinPromoAlt: 'Promotional artwork showing champagne and rose satin pillowcases', satinChampagneAlt: 'Promotional artwork featuring a champagne satin pillowcase', satinBenefitsAlt: 'Infographic describing satin benefits for hair and skin', satinTextureAlt: 'Editorial collage showing a gold satin pillowcase and styled bed', storyImageAlt: 'Blush activewear, tote, yoga mat, water bottle, and accessories arranged in a sunlit studio', shopAll: 'Shop all', sportSets: 'Sport sets', satinPillowcases: 'Satin pillowcases', ourStory: 'Our story', bag: 'Bag', openBag: (count: number) => `Open shopping bag, ${count} items`, switchLanguage: 'Switch language to French',
    promiseOne: '♡ MADE TO FEEL GOOD', promiseTwo: 'EVERYDAY, ELEVATED', promiseThree: 'YOUR NEW FAVORITE THING', fitTitle: 'Made to move,', fitTitleEmphasis: 'made for you.', introExpired: 'Sculpt and wrap sets are now 79.900 DT.', introOpening: 'New sculpt and wrap sets at the opening price of 69.900 DT.', discoverSatin: 'Discover satin pillowcases', filterLabel: 'Filter Fit Edition products', everything: 'Everything', productCount: (count: number) => `${count} Fit Edition pieces`, openingSpecial: 'Opening special',
    satinTitle: 'A little luxury,', satinTitleEmphasis: 'every night.', satinIntro: 'Meet the THAT GIRL satin pillowcase in luminous champagne and soft rose. Choose your favorite look, then explore the benefits for your hair and skin.', satinOfferOne: 'Soft satin, in your favorite shade.', satinOfferTwo: 'A luminous champagne finish for bedtime.', satinOffersLabel: 'Satin pillowcase offers', satinDetailsLabel: 'Satin pillowcase details',
    ourStoryLabel: 'THAT GIRL · OUR STORY', storyCaption: 'Everyday, elevated.', storyNote: 'A NOTE FROM THAT GIRL', storyTitle: 'A little more', storyTitleEnd: 'Every day.', storyBody: 'A good outfit can change the way a day begins. We bring together easy-to-love pieces for wherever yours takes you — from your first coffee to those last-minute plans. Wear what feels like you, and let the rest follow.', valueOne: 'Feel-good finds', valueTwo: 'Everyday favorites', valueThree: 'Your kind of iconic', storyLink: 'Meet your new favorites', storySignature: 'Look good. Feel good. ♡', newsletterLabel: 'A LITTLE NOTE FROM US', newsletterTitle: 'Good things look', newsletterTitleEnd: 'good on you.', followInstagram: 'Follow THAT GIRL on Instagram', sayHello: 'Say hello', copyright: '© 2026 THAT GIRL. Made with a little extra love.',
    closeProduct: 'Close product details', regularPrice: 'Regular price', productDetails: 'Product details', specifications: 'Specifications', chooseSize: 'Choose your size', addToBag: 'Add to bag', morePhotos: (name: string) => `More photos of ${name}`, yourFinds: 'YOUR LITTLE FINDS', yourBag: 'Your bag', closeBag: 'Close bag', emptyBagTitle: 'Your bag is waiting<br>for something lovely.', keepExploring: 'Keep exploring', sizeLabel: (size: string) => `Size: ${size}`, removeProduct: (name: string) => `Remove one ${name}`, addProduct: (name: string) => `Add one ${name}`, subtotal: 'Subtotal', deliveryNote: 'Delivery details will be confirmed with you by email.', yourName: 'Your name', email: 'Email address', phone: 'Phone number', address: 'Delivery address', anythingElse: 'Anything else?', optional: '(optional)', emailOpened: 'Email draft opened', sendOrder: 'Send order request', emailHint: 'Your email app will open with your order addressed to us.', emailSubject: 'THAT GIRL order request', orderEmailIntro: 'New THAT GIRL order', orderTotal: 'Total', note: 'Note', comingSoon: 'Coming soon',
  },
  fr: {
    announcement: 'Un peu d’amour, beaucoup de confiance. Livraison gratuite dès 99 DT', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu', mainNavigation: 'Navigation principale', heroLink: 'Découvrir la collection THAT GIRL', heroAlt: 'Collection activewear THAT GIRL dans une boutique rose poudré, avec des vêtements, sacs et accessoires, et le message « Soyez belle. Sentez-vous bien. »', satinPromoAlt: 'Visuel promotionnel présentant des taies en satin champagne et rose', satinChampagneAlt: 'Visuel promotionnel présentant une taie en satin champagne', satinBenefitsAlt: 'Infographie sur les bienfaits du satin pour les cheveux et la peau', satinTextureAlt: 'Collage éditorial présentant une taie en satin doré et une chambre élégante', storyImageAlt: 'Vêtements de sport rose poudré, sac, tapis de yoga, gourde et accessoires dans un studio ensoleillé', shopAll: 'Tout voir', sportSets: 'Ensembles de sport', satinPillowcases: 'Taies d’oreiller en satin', ourStory: 'Notre histoire', bag: 'Panier', openBag: (count: number) => `Ouvrir le panier, ${count} article(s)`, switchLanguage: 'Passer en anglais',
    promiseOne: '♡ LE BIEN-ÊTRE AVANT TOUT', promiseTwo: 'LE QUOTIDIEN, SUBLIMÉ', promiseThree: 'VOTRE NOUVEAU COUP DE CŒUR', fitTitle: 'Bougez librement,', fitTitleEmphasis: 'soyez vous-même.', introExpired: 'Les ensembles sculptants sont maintenant à 79,900 DT.', introOpening: 'Nouveaux ensembles sculptants au prix de lancement de 69,900 DT.', discoverSatin: 'Découvrir les taies en satin', filterLabel: 'Filtrer les articles Fit Edition', everything: 'Tout voir', productCount: (count: number) => `${count} articles Fit Edition`, openingSpecial: 'Offre de lancement',
    satinTitle: 'Un peu de luxe,', satinTitleEmphasis: 'chaque soir.', satinIntro: 'Découvrez la taie en satin THAT GIRL, dans un champagne lumineux ou un rose poudré. Choisissez votre style préféré et découvrez ses bienfaits pour vos cheveux et votre peau.', satinOfferOne: 'Un satin doux dans votre teinte préférée.', satinOfferTwo: 'Un champagne lumineux pour vos soirées.', satinOffersLabel: 'Offres sur les taies en satin', satinDetailsLabel: 'Détails sur les taies en satin',
    ourStoryLabel: 'THAT GIRL · NOTRE HISTOIRE', storyCaption: 'Le quotidien, sublimé.', storyNote: 'UN MOT DE THAT GIRL', storyTitle: 'Un peu plus', storyTitleEnd: 'Chaque jour.', storyBody: 'Une belle tenue peut changer le début d’une journée. Nous réunissons des pièces faciles à aimer, pour vous accompagner partout — du premier café aux sorties improvisées. Portez ce qui vous ressemble et laissez le reste suivre.', valueOne: 'Des trouvailles qui font du bien', valueTwo: 'Vos essentiels du quotidien', valueThree: 'Votre style, votre signature', storyLink: 'Découvrez vos nouveaux coups de cœur', storySignature: 'Soyez belle. Sentez-vous bien. ♡', newsletterLabel: 'UN PETIT MOT DE NOTRE PART', newsletterTitle: 'Les belles choses vous vont', newsletterTitleEnd: 'si bien.', followInstagram: 'Suivre THAT GIRL sur Instagram', sayHello: 'Nous écrire', copyright: '© 2026 THAT GIRL. Avec beaucoup d’amour.',
    closeProduct: 'Fermer les détails du produit', regularPrice: 'Prix habituel', productDetails: 'Détails du produit', specifications: 'Spécifications', chooseSize: 'Choisissez votre taille', addToBag: 'Ajouter au panier', morePhotos: (name: string) => `Autres photos de ${name}`, yourFinds: 'VOS JOLIES TROUVAILLES', yourBag: 'Votre panier', closeBag: 'Fermer le panier', emptyBagTitle: 'Votre panier attend<br>sa prochaine merveille.', keepExploring: 'Continuer à découvrir', sizeLabel: (size: string) => `Taille : ${size}`, removeProduct: (name: string) => `Retirer un article : ${name}`, addProduct: (name: string) => `Ajouter un article : ${name}`, subtotal: 'Sous-total', deliveryNote: 'Les détails de livraison seront confirmés par e-mail.', yourName: 'Votre nom', email: 'Adresse e-mail', phone: 'Numéro de téléphone', address: 'Adresse de livraison', anythingElse: 'Un message ?', optional: '(facultatif)', emailOpened: 'Brouillon e-mail ouvert', sendOrder: 'Envoyer la demande', emailHint: 'Votre application e-mail s’ouvrira avec votre commande adressée à notre équipe.', emailSubject: 'Commande THAT GIRL', orderEmailIntro: 'Nouvelle commande THAT GIRL', orderTotal: 'Total', note: 'Note', comingSoon: 'Bientôt disponible',
  },
} as const

type CartLine = { product: Product; size: Size; quantity: number }

export default function Home() {
  const [locale, setLocale] = useState<Locale>('en')
  const t = translations[locale]
  const productName = (product: Product) => locale === 'fr' ? product.nameFr : product.name
  const productDetails = (product: Product) => locale === 'fr' ? product.detailsFr : product.details
  const [category, setCategory] = useState('Everything')
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<Size | ''>('')
  const [offerExpired, setOfferExpired] = useState(() => Date.now() >= OPENING_OFFER_ENDS_AT)
  const productDialogRef = useRef<HTMLDialogElement>(null)
  const visibleProducts = useMemo(() => category === 'Everything' ? products : products.filter((product) => product.category === category), [category])
  const count = cart.reduce((sum, line) => sum + line.quantity, 0)
  const total = cart.reduce((sum, line) => sum + (currentPrice(line.product, offerExpired) ?? 0) * line.quantity, 0)
  const expireOffer = useCallback(() => setOfferExpired(true), [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    if (offerExpired) return
    const timeout = window.setTimeout(expireOffer, Math.max(0, OPENING_OFFER_ENDS_AT - Date.now()))
    return () => window.clearTimeout(timeout)
  }, [expireOffer, offerExpired])

  useEffect(() => {
    if (selectedProduct && productDialogRef.current && !productDialogRef.current.open) {
      productDialogRef.current.showModal()
    }
  }, [selectedProduct])

  function addToCart(product: Product, size: Size) {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id && line.size === size)
      return existing
        ? current.map((line) => line.product.id === product.id && line.size === size ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { product, size, quantity: 1 }]
    })
    setCartOpen(true)
    setSubmitted(false)
  }

  function updateQuantity(id: number, size: Size, amount: number) {
    setCart((current) => current.map((line) => line.product.id === id && line.size === size ? { ...line, quantity: line.quantity + amount } : line).filter((line) => line.quantity > 0))
  }

  function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const items = cart.map(({ product, size, quantity }) => {
      const price = currentPrice(product, offerExpired)
      return `${productName(product)} · ${t.sizeLabel(size)} x${quantity} — ${formatPrice(price === null ? null : price * quantity)}`
    }).join('\n')
    const body = `${t.orderEmailIntro}\n\n${items}\n\n${t.orderTotal}: ${formatPrice(total)}\n\n${t.yourName}: ${data.get('name')}\n${t.email}: ${data.get('email')}\n${t.phone}: ${data.get('phone')}\n${t.address}: ${data.get('address')}\n\n${t.note}: ${data.get('note') || '—'}`
    window.location.href = `mailto:that_girl2026@outlook.fr?subject=${encodeURIComponent(t.emailSubject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return (
    <main>
      <div className="announcement">{t.announcement} <span>♡</span></div>
      <header className="site-header">
        <button className="mobile-menu icon-button" aria-label={mobileOpen ? t.closeMenu : t.openMenu} onClick={() => setMobileOpen(!mobileOpen)}><Menu /></button>
        <a href="#top" className="wordmark" aria-label="THAT GIRL home"><span className="wordmark-bow">୨୧</span>THAT GIRL<small>ACTIVE · LIFESTYLE</small></a>
        <nav className={mobileOpen ? 'main-nav open' : 'main-nav'} aria-label={t.mainNavigation}>
          <a href="#shop" onClick={() => setMobileOpen(false)}>{t.shopAll}</a><a href="#shop" onClick={() => { setCategory('Sport Sets'); setMobileOpen(false) }}>{t.sportSets}</a><a href="#satin" onClick={() => setMobileOpen(false)}>{t.satinPillowcases}</a><a href="#story" onClick={() => setMobileOpen(false)}>{t.ourStory}</a>
        </nav>
        <div className="header-actions"><button type="button" className="locale-toggle" onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')} aria-label={t.switchLanguage}>{locale === 'en' ? 'FR' : 'EN'}</button><button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={t.openBag(count)}><ShoppingBag size={19} /><span>{t.bag}</span><span className="cart-count">{count}</span></button></div>
      </header>

      <section className="hero hero-banner" id="top"><a className="hero-banner-link" href="#shop" aria-label={t.heroLink}><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Univers%20rose%20poudr%C3%A9%20That%20Girl-gg9aNkhCEVW3e65SD4bu6fxLEakLc3.png" alt={t.heroAlt} /></a></section>

      <section className="promise-strip" aria-label={t.promiseOne}><div className="marquee-track"><div className="marquee-group"><span>{t.promiseOne}</span><i>✳</i><span>{t.promiseTwo}</span><i>✳</i><span>{t.promiseThree}</span><i>✳</i><span>{t.promiseOne}</span><i>✳</i></div><div className="marquee-group" aria-hidden="true"><span>{t.promiseOne}</span><i>✳</i><span>{t.promiseTwo}</span><i>✳</i><span>{t.promiseThree}</span><i>✳</i><span>{t.promiseOne}</span><i>✳</i></div></div></section>

      <section className="shop-section" id="shop"><div className="section-heading"><div><span className="eyebrow">THAT GIRL · FIT EDITION</span><h2>{t.fitTitle} <em>{t.fitTitleEmphasis}</em></h2><p className="collection-intro">{offerExpired ? t.introExpired : t.introOpening}</p></div><a className="text-link" href="#satin">{t.discoverSatin} <ArrowRight size={15} /></a></div>
        <OpeningOfferCountdown onExpired={expireOffer} locale={locale} />
        <div className="shop-toolbar"><div className="filters" role="group" aria-label={t.filterLabel}>{categories.map((item) => <button key={item} className={category === item ? 'filter active' : 'filter'} onClick={() => setCategory(item)}>{item === 'Everything' ? t.everything : t.sportSets}</button>)}</div><span className="product-count">{t.productCount(visibleProducts.length)}</span></div>
        <div className="product-grid fit-product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}><button type="button" className="product-open" onClick={() => { setSelectedProduct(product); setSelectedSize('') }} aria-label={`${locale === 'fr' ? 'Voir les détails de' : 'View details for'} ${productName(product)}`}><div className={`product-image ${product.tone}`}><img src={product.image} alt="" loading="lazy" />{!offerExpired && product.tag && <span className="product-tag">{t.openingSpecial}</span>}<span className="product-tag product-price-tag">{formatPrice(currentPrice(product, offerExpired))}</span></div><div className="product-info"><div><span className="product-category">{t.sportSets}</span><h3>{productName(product)}</h3></div><span className="price">{formatPrice(currentPrice(product, offerExpired))}</span></div></button></article>)}</div>
      </section>

      <section className="shop-section satin-section" id="satin"><div className="section-heading"><div><span className="eyebrow">THAT GIRL · SATIN SLEEP</span><h2>{t.satinTitle} <em>{t.satinTitleEmphasis}</em></h2><p className="collection-intro">{t.satinIntro}</p></div></div><div className="satin-offer-grid" aria-label={t.satinOffersLabel}><figure className="satin-image-card"><img src="/images/satin-pillowcases-21dt.jpeg" alt={t.satinPromoAlt} loading="lazy" /><figcaption>{t.satinOfferOne} <strong className="satin-price">21.000 DT</strong></figcaption></figure><figure className="satin-image-card"><img src="/images/satin-pillowcase-12dt.jpeg" alt={t.satinChampagneAlt} loading="lazy" /><figcaption>{t.satinOfferTwo} <strong className="satin-price">12.000 DT</strong></figcaption></figure></div><div className="satin-info-grid" aria-label={t.satinDetailsLabel}><figure className="satin-image-card"><img src="/images/satin-benefits-arabic.jpeg" alt={t.satinBenefitsAlt} loading="lazy" /></figure><figure className="satin-image-card"><img src="/images/satin-benefits-french.jpeg" alt={t.satinBenefitsAlt} loading="lazy" /></figure><figure className="satin-image-card"><img src="/images/satin-pillowcase-texture.jpeg" alt={t.satinTextureAlt} loading="lazy" /></figure></div></section>

      <section className="story-section" id="story"><div className="story-image"><img src="/images/story-concept.png" alt={t.storyImageAlt} loading="lazy" /><div className="story-photo-caption"><span>{t.ourStoryLabel}</span><strong>{t.storyCaption}</strong></div></div><div className="story-copy"><span className="eyebrow">{t.storyNote}</span><h2>{t.storyTitle}<br /><em>{locale === 'en' ? 'you.' : 'de vous.'}</em> {t.storyTitleEnd}</h2><p>{t.storyBody}</p><div className="story-values"><span>{t.valueOne}</span><span>{t.valueTwo}</span><span>{t.valueThree}</span></div><a href="#shop" className="text-link">{t.storyLink} <ArrowRight size={15} /></a><span className="story-signature">{t.storySignature}</span></div></section>

      <section className="newsletter"><span className="eyebrow">{t.newsletterLabel}</span><h2>{t.newsletterTitle}<br /><em>{t.newsletterTitleEnd}</em></h2><span className="newsletter-spark">✳</span></section>
      <footer className="site-footer"><a href="#top" className="footer-mark">THAT GIRL <span>♡</span></a><span>ACTIVE · LIFESTYLE</span><a href="https://instagram.com/that________giirl" target="_blank" rel="noreferrer" aria-label={t.followInstagram}>Instagram</a><a href="mailto:haifa.khiari@outlook.fr">{t.sayHello}</a><small>{t.copyright}</small></footer>

      {selectedProduct && <dialog ref={productDialogRef} className="product-dialog" aria-labelledby="product-dialog-title" onCancel={() => setSelectedProduct(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null) }}><button type="button" className="product-dialog-close icon-button" onClick={() => setSelectedProduct(null)} aria-label={t.closeProduct} autoFocus><X /></button><div className="product-dialog-layout"><div className={`product-dialog-image ${selectedProduct.tone}`}><img src={selectedProduct.image} alt={productName(selectedProduct)} /></div><div className="product-dialog-copy"><span className="eyebrow">THAT GIRL · FIT EDITION</span><h2 id="product-dialog-title">{productName(selectedProduct)}</h2><p className="product-dialog-price">{offerExpired ? t.regularPrice : t.openingSpecial} · {formatPrice(currentPrice(selectedProduct, offerExpired))}</p><details className="product-extra-details"><summary>{t.productDetails}</summary><ul>{productDetails(selectedProduct).map((detail) => <li key={detail}>{detail}</li>)}</ul></details><div className="product-purchase"><div className="product-specifications"><h3>{t.specifications}</h3><ul>{(locale === 'fr' ? fitEditionSpecificationsFr : fitEditionSpecifications).map((specification) => <li key={specification}>{specification}</li>)}</ul></div><fieldset className="size-picker"><legend>{t.chooseSize}</legend>{sizes.map((size) => <label className="size-option" key={size}><input type="radio" name={`size-${selectedProduct.id}`} value={size} checked={selectedSize === size} onChange={() => setSelectedSize(size)} /><span>{size}</span></label>)}</fieldset><button type="button" className="button button-dark product-add-button" disabled={!selectedSize} onClick={() => { if (!selectedSize) return; addToCart(selectedProduct, selectedSize); setSelectedProduct(null) }}>{t.addToBag} <ShoppingBag size={16} /></button></div></div></div>{selectedProduct.gallery?.length ? <div className="product-dialog-gallery" aria-label={t.morePhotos(productName(selectedProduct))}>{selectedProduct.gallery.map((image) => <img key={image} src={image} alt={`${productName(selectedProduct)} ${locale === 'fr' ? 'vue supplémentaire' : 'additional product view'}`} loading="lazy" />)}</div> : null}</dialog>}

      {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer" aria-label={t.yourBag}><div className="drawer-header"><div><span className="eyebrow">{t.yourFinds}</span><h2>{t.yourBag} <span>({count})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label={t.closeBag}><X /></button></div>
        {cart.length === 0 ? <div className="empty-cart"><span className="empty-bow">୨୧</span><h3>{t.emptyBagTitle.split('<br>').map((part, index) => <span key={part}>{index > 0 && <br />}{part}</span>)}</h3><button className="button button-dark" onClick={() => setCartOpen(false)}>{t.keepExploring} <ArrowRight size={16} /></button></div> : <><div className="cart-lines">{cart.map(({ product, size, quantity }) => <div className="cart-line" key={`${product.id}-${size}`}><img src={product.image} alt="" /><div className="line-detail"><span className="product-category">{t.sportSets}</span><h3>{productName(product)}</h3><span className="cart-line-size">{t.sizeLabel(size)}</span><strong>{formatPrice(currentPrice(product, offerExpired))}</strong><div className="quantity"><button aria-label={t.removeProduct(productName(product))} onClick={() => updateQuantity(product.id, size, -1)}><Minus size={13} /></button><span>{quantity}</span><button aria-label={t.addProduct(productName(product))} onClick={() => updateQuantity(product.id, size, 1)}><Plus size={13} /></button></div></div></div>)}</div><div className="order-area"><div className="total-line"><span>{t.subtotal}</span><strong>{formatPrice(total)}</strong></div><p className="order-note">{t.deliveryNote}</p><form className="order-form" onSubmit={placeOrder}><label>{t.yourName}<input name="name" autoComplete="name" required /></label><label>{t.email}<input type="email" name="email" autoComplete="email" required /></label><label>{t.phone}<input type="tel" name="phone" autoComplete="tel" required /></label><label>{t.address}<textarea name="address" autoComplete="street-address" rows={2} required /></label><label>{t.anythingElse} <span className="optional">{t.optional}</span><textarea name="note" rows={2} /></label><button className="button button-dark submit-order" type="submit">{submitted ? <><Check size={16} /> {t.emailOpened}</> : <>{t.sendOrder} <ArrowRight size={16} /></>}</button><span className="email-hint">{t.emailHint}</span></form></div></>}
      </aside></div>}
    </main>
  )
}
