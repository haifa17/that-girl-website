'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Check, Menu, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import OpeningOfferCountdown, { OPENING_OFFER_ENDS_AT } from '@/components/opening-offer-countdown'

type Product = { id: number; name: string; category: 'Sport Sets'; price: number | null; image: string; gallery?: string[]; tag?: string; tone: string; details: string[] }

const products: Product[] = [
  { id: 1, name: 'The Strappy Sculpt Set · Black', category: 'Sport Sets', price: 69.9, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-23%20at%209.02.02%20PM68-k5GI2IoUY8Vxdn1Xf12BWBXqvpt32y.jpeg', tag: 'Opening special', tone: 'rose', details: ['Matching long-sleeve top and high-waist leggings', 'Square neckline with halter-style straps', 'Color: Black'] },
  { id: 2, name: 'The Strappy Sculpt Set · Mauve', category: 'Sport Sets', price: 69.9, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-23%20at%209.02.02%20PM-NmOtz6MnWlPyzmCqFTzib7J4Xwez24.jpeg', tag: 'Opening special', tone: 'mauve', details: ['Matching long-sleeve top and high-waist leggings', 'Square neckline with halter-style straps', 'Color: Mauve'] },
  { id: 3, name: 'The Strappy Sculpt Set · Burgundy', category: 'Sport Sets', price: 69.9, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-23%20at%209.02.02%20PM8-GaiidGQKsOp8evqrYUpVAQFKuAei7t.jpeg', tag: 'Opening special', tone: 'rose', details: ['Matching long-sleeve top and high-waist leggings', 'Square neckline with halter-style straps', 'Color: Burgundy'] },
  { id: 4, name: 'The Wrap Sculpt Set · Black', category: 'Sport Sets', price: 69.9, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-23%20at%209.02.02%20PM68-k5GI2IoUY8Vxdn1Xf12BWBXqvpt32y.jpeg', tag: 'Opening special', tone: 'cream', details: ['Matching wrap top and high-waist leggings', 'Adjustable waist tie and flattering wrap neckline', 'Soft, breathable, lightweight fabric', 'Color: Black'] },
  { id: 5, name: 'The Wrap Sculpt Set · Green', category: 'Sport Sets', price: 69.9, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-23%20at%209.02.02%20PM54-MwR7qGyZ4lJnrWkh7hTkJ18mlb89U6.jpeg', tag: 'Opening special', tone: 'green', details: ['Matching wrap top and high-waist leggings', 'Adjustable waist tie and flattering wrap neckline', 'Soft, breathable, lightweight fabric', 'Color: Green'] },
]
const categories = ['Everything', 'Sport Sets']
const formatPrice = (amount: number | null) => amount === null ? 'Coming soon' : `${amount.toFixed(3)} DT`
const currentPrice = (product: Product, offerExpired: boolean) => product.price === null ? null : product.price + (offerExpired ? 10 : 0)

type CartLine = { product: Product; quantity: number }

export default function Home() {
  const [category, setCategory] = useState('Everything')
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [offerExpired, setOfferExpired] = useState(() => Date.now() >= OPENING_OFFER_ENDS_AT)
  const productDialogRef = useRef<HTMLDialogElement>(null)
  const visibleProducts = useMemo(() => category === 'Everything' ? products : products.filter((product) => product.category === category), [category])
  const count = cart.reduce((sum, line) => sum + line.quantity, 0)
  const total = cart.reduce((sum, line) => sum + (currentPrice(line.product, offerExpired) ?? 0) * line.quantity, 0)
  const expireOffer = useCallback(() => setOfferExpired(true), [])

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

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id)
      return existing ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, quantity: 1 }]
    })
    setCartOpen(true)
    setSubmitted(false)
  }

  function updateQuantity(id: number, amount: number) {
    setCart((current) => current.map((line) => line.product.id === id ? { ...line, quantity: line.quantity + amount } : line).filter((line) => line.quantity > 0))
  }

  function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const items = cart.map(({ product, quantity }) => {
      const price = currentPrice(product, offerExpired)
      return `${product.name} x${quantity} — ${formatPrice(price === null ? null : price * quantity)}`
    }).join('\n')
    const body = `New THAT GIRL order\n\n${items}\n\nTotal: ${formatPrice(total)}\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')}\nDelivery address: ${data.get('address')}\n\nNote: ${data.get('note') || '—'}`
    window.location.href = `mailto:that_girl2026@outlook.fr?subject=${encodeURIComponent('THAT GIRL order request')}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return (
    <main>
      <div className="announcement">A little love, a lot of confidence. Free delivery from 99 DT <span>♡</span></div>
      <header className="site-header">
        <button className="mobile-menu icon-button" aria-label="Open menu" onClick={() => setMobileOpen(!mobileOpen)}><Menu /></button>
        <a href="#top" className="wordmark" aria-label="THAT GIRL home"><span className="wordmark-bow">୨୧</span>THAT GIRL<small>ACTIVE · LIFESTYLE</small></a>
        <nav className={mobileOpen ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
          <a href="#shop" onClick={() => setMobileOpen(false)}>Shop all</a><a href="#shop" onClick={() => { setCategory('Sport Sets'); setMobileOpen(false) }}>Sport sets</a><a href="#satin" onClick={() => setMobileOpen(false)}>Satin pillowcases</a><a href="#story" onClick={() => setMobileOpen(false)}>Our story</a>
        </nav>
        <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Open shopping bag, ${count} items`}><ShoppingBag size={19} /><span>Bag</span><span className="cart-count">{count}</span></button>
      </header>

      <section className="hero hero-banner" id="top"><a className="hero-banner-link" href="#shop" aria-label="Discover the THAT GIRL collection"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Univers%20rose%20poudr%C3%A9%20That%20Girl-gg9aNkhCEVW3e65SD4bu6fxLEakLc3.png" alt="THAT GIRL active lifestyle collection in a blush pink boutique, featuring apparel, bags, accessories, and the message ‘Look good. Feel good.’" /></a></section>

      <section className="promise-strip" aria-label="Brand promises"><div className="marquee-track"><div className="marquee-group"><span>♡ MADE TO FEEL GOOD</span><i>✳</i><span>EVERYDAY, ELEVATED</span><i>✳</i><span>YOUR NEW FAVORITE THING</span><i>✳</i><span>♡ MADE TO FEEL GOOD</span><i>✳</i></div><div className="marquee-group" aria-hidden="true"><span>♡ MADE TO FEEL GOOD</span><i>✳</i><span>EVERYDAY, ELEVATED</span><i>✳</i><span>YOUR NEW FAVORITE THING</span><i>✳</i><span>♡ MADE TO FEEL GOOD</span><i>✳</i></div></div></section>

      <section className="shop-section" id="shop"><div className="section-heading"><div><span className="eyebrow">THAT GIRL · FIT EDITION</span><h2>Made to move, <em>made for you.</em></h2><p className="collection-intro">{offerExpired ? 'Sculpt and wrap sets are now 79.900 DT.' : 'New sculpt and wrap sets at the opening price of 69.900 DT.'}</p></div><a className="text-link" href="#satin">Discover satin pillowcases <ArrowRight size={15} /></a></div>
        <OpeningOfferCountdown onExpired={expireOffer} />
        <div className="shop-toolbar"><div className="filters" role="group" aria-label="Filter Fit Edition products">{categories.map((item) => <button key={item} className={category === item ? 'filter active' : 'filter'} onClick={() => setCategory(item)}>{item}</button>)}</div><span className="product-count">{visibleProducts.length} Fit Edition pieces</span></div>
        <div className="product-grid fit-product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}><button type="button" className="product-open" onClick={() => setSelectedProduct(product)} aria-label={`View details for ${product.name}`}><div className={`product-image ${product.tone}`}><img src={product.image} alt="" loading="lazy" />{!offerExpired && product.tag && <span className="product-tag">{product.tag}</span>}<span className="product-tag product-price-tag">{formatPrice(currentPrice(product, offerExpired))}</span></div><div className="product-info"><div><span className="product-category">{product.category}</span><h3>{product.name}</h3></div><span className="price">{formatPrice(currentPrice(product, offerExpired))}</span></div></button></article>)}</div>
      </section>

      <section className="shop-section satin-section" id="satin"><div className="section-heading"><div><span className="eyebrow">THAT GIRL · SATIN SLEEP</span><h2>A little luxury, <em>every night.</em></h2><p className="collection-intro">Meet the THAT GIRL satin pillowcase in luminous champagne and soft rose. Choose your favorite look, then explore the benefits for your hair and skin.</p></div></div><div className="satin-offer-grid" aria-label="Satin pillowcase offers"><figure className="satin-image-card"><img src="/images/satin-pillowcases-21dt.jpeg" alt="Promo artwork showing champagne and rose satin pillowcases with a 21 DT offer and order-by-request note" loading="lazy" /><figcaption>Soft satin, in your favorite shade. <strong className="satin-price">21.000 DT</strong></figcaption></figure><figure className="satin-image-card"><img src="/images/satin-pillowcase-12dt.jpeg" alt="Promo artwork featuring a single champagne satin pillowcase and a 12 DT offer" loading="lazy" /><figcaption>A luminous champagne finish for bedtime. <strong className="satin-price">12.000 DT</strong></figcaption></figure></div><div className="satin-info-grid" aria-label="Satin pillowcase details"><figure className="satin-image-card"><img src="/images/satin-benefits-arabic.jpeg" alt="Arabic-language infographic describing satin benefits for hair and skin" loading="lazy" /></figure><figure className="satin-image-card"><img src="/images/satin-benefits-french.jpeg" alt="French-language infographic listing satin pillowcase benefits for hair and skin" loading="lazy" /></figure><figure className="satin-image-card"><img src="/images/satin-pillowcase-texture.jpeg" alt="Editorial collage showing a gold satin pillowcase, close-up fabric texture, and styled bed" loading="lazy" /></figure></div></section>

      <section className="story-section" id="story"><div className="story-image"><img src="/images/story-concept.png" alt="Curated blush activewear, bow tote, yoga mat, water bottle, and accessories arranged in a sunlit studio" loading="lazy" /><div className="story-photo-caption"><span>THAT GIRL · OUR STORY</span><strong>Everyday, elevated.</strong></div></div><div className="story-copy"><span className="eyebrow">A NOTE FROM THAT GIRL</span><h2>A little more<br /><em>you.</em> Every day.</h2><p>A good outfit can change the way a day begins. We bring together easy-to-love pieces for wherever yours takes you — from your first coffee to those last-minute plans. Wear what feels like you, and let the rest follow.</p><div className="story-values"><span>Feel-good finds</span><span>Everyday favorites</span><span>Your kind of iconic</span></div><a href="#shop" className="text-link">Meet your new favorites <ArrowRight size={15} /></a><span className="story-signature">Look good. Feel good. ♡</span></div></section>

      <section className="newsletter"><span className="eyebrow">A LITTLE NOTE FROM US</span><h2>Good things look<br /><em>good on you.</em></h2><span className="newsletter-spark">✳</span></section>
      <footer className="site-footer"><a href="#top" className="footer-mark">THAT GIRL <span>♡</span></a><span>ACTIVE · LIFESTYLE</span><a href="https://instagram.com/that________giirl" target="_blank" rel="noreferrer" aria-label="Follow THAT GIRL on Instagram">Instagram</a><a href="mailto:haifa.khiari@outlook.fr">Say hello</a><small>© 2026 THAT GIRL. Made with a little extra love.</small></footer>

      {selectedProduct && <dialog ref={productDialogRef} className="product-dialog" aria-labelledby="product-dialog-title" onCancel={() => setSelectedProduct(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null) }}><button type="button" className="product-dialog-close icon-button" onClick={() => setSelectedProduct(null)} aria-label="Close product details" autoFocus><X /></button><div className="product-dialog-layout"><div className={`product-dialog-image ${selectedProduct.tone}`}><img src={selectedProduct.image} alt={selectedProduct.name} /></div><div className="product-dialog-copy"><span className="eyebrow">THAT GIRL · FIT EDITION</span><h2 id="product-dialog-title">{selectedProduct.name}</h2><p className="product-dialog-price">{offerExpired ? 'Regular price' : 'Opening special'} · {formatPrice(currentPrice(selectedProduct, offerExpired))}</p><h3>Product details</h3><ul>{selectedProduct.details.map((detail) => <li key={detail}>{detail}</li>)}</ul><p className="product-dialog-note">{offerExpired ? 'Current price.' : 'Special opening price.'}</p></div></div>{selectedProduct.gallery?.length ? <div className="product-dialog-gallery" aria-label={`More photos of ${selectedProduct.name}`}>{selectedProduct.gallery.map((image) => <img key={image} src={image} alt={`${selectedProduct.name} additional product view`} loading="lazy" />)}</div> : null}</dialog>}

      {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer" aria-label="Your shopping bag"><div className="drawer-header"><div><span className="eyebrow">YOUR LITTLE FINDS</span><h2>Your bag <span>({count})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X /></button></div>
        {cart.length === 0 ? <div className="empty-cart"><span className="empty-bow">୨୧</span><h3>Your bag is waiting<br />for something lovely.</h3><button className="button button-dark" onClick={() => setCartOpen(false)}>Keep exploring <ArrowRight size={16} /></button></div> : <><div className="cart-lines">{cart.map(({ product, quantity }) => <div className="cart-line" key={product.id}><img src={product.image} alt="" /><div className="line-detail"><span className="product-category">{product.category}</span><h3>{product.name}</h3><strong>{formatPrice(currentPrice(product, offerExpired))}</strong><div className="quantity"><button aria-label={`Remove one ${product.name}`} onClick={() => updateQuantity(product.id, -1)}><Minus size={13} /></button><span>{quantity}</span><button aria-label={`Add one ${product.name}`} onClick={() => updateQuantity(product.id, 1)}><Plus size={13} /></button></div></div></div>)}</div><div className="order-area"><div className="total-line"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div><p className="order-note">Delivery details will be confirmed with you by email.</p><form className="order-form" onSubmit={placeOrder}><label>Your name<input name="name" autoComplete="name" required /></label><label>Email address<input type="email" name="email" autoComplete="email" required /></label><label>Phone number<input type="tel" name="phone" autoComplete="tel" required /></label><label>Delivery address<textarea name="address" autoComplete="street-address" rows={2} required /></label><label>Anything else? <span className="optional">(optional)</span><textarea name="note" rows={2} /></label><button className="button button-dark submit-order" type="submit">{submitted ? <><Check size={16} /> Email draft opened</> : <>Send order request <ArrowRight size={16} /></>}</button><span className="email-hint">Your email app will open with your order addressed to us.</span></form></div></>}
      </aside></div>}
    </main>
  )
}
