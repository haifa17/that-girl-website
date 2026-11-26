'use client'

import { CartDrawer } from './cart-drawer'
import { ProductDialog } from './product-dialog'
import { useShop } from './shop-provider'

export function Overlays() {
    const s = useShop()
    return (
        <>
            {s.selected && (
                <ProductDialog
                    key={s.selected.id}
                    product={s.selected} locale={s.locale} t={s.t} offerExpired={s.offerExpired}
                    onClose={() => s.selectProduct(null)}
                    onAdd={(product, size) => { s.addToCart(product, size); s.selectProduct(null) }}
                />
            )}
            {s.cartOpen && (
                <CartDrawer
                    lines={s.lines} count={s.count} total={s.total} locale={s.locale} t={s.t}
                    offerExpired={s.offerExpired} submitted={s.submitted}
                    dispatch={s.dispatch} onClose={() => s.setCartOpen(false)} onSubmit={s.placeOrder}
                />
            )}
        </>
    )
}