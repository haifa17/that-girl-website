import type { Product } from '@/lib/shop'

const BLOB = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/'
const img = (file: string) => BLOB + file

const COCO_WRAP = ['Matching wrap top and high-waist leggings', 'Adjustable waist tie and flattering wrap neckline', 'Soft, breathable, lightweight fabric']
const COCO_WRAP_FR = ['Ensemble composé d’un haut cache-cœur et d’un legging taille haute', 'Lien ajustable à la taille et encolure cache-cœur flatteuse', 'Tissu doux, respirant et léger']
const ELORA = ['Wrap-front top with matching high-waist leggings', 'Adjustable side tie and flattering wrap neckline', 'Thumb-hole sleeves and soft, four-way stretch fabric']
const ELORA_FR = ['Haut cache-cœur et legging taille haute assorti', 'Lien latéral ajustable et encolure cache-cœur flatteuse', 'Manches avec passe-pouces et tissu doux extensible dans les quatre sens']
 const local = (file: string) => `/images/${file}`
export const products: Product[] = [
    {
        id: 1, name: 'The Coco Set · Black', nameFr: 'Ensemble Coco · Noir', category: 'Coco Set', price: 69.9, tag: 'Opening special', tone: 'rose',
        image: local('coco-black1.jpeg'),
        gallery: [local('coco-black1.jpeg'), local('coco-black2.jpeg')],
        details: ['Matching long-sleeve top and high-waist leggings', 'Square neckline with halter-style straps', 'Color: Black'],
        detailsFr: ['Ensemble composé d’un haut à manches longues et d’un legging taille haute', 'Encolure carrée avec bretelles style dos nu', 'Couleur : noir'],
    },
    {
        id: 4, name: 'The Coco Set · Green', nameFr: 'Ensemble Coco · Vert', category: 'Coco Set', price: 69.9, tag: 'Opening special', tone: 'green',
        image: local('coco-green-1.jpeg'),
        gallery: [local('coco-green-1.jpeg'), local('coco-green-2.jpeg')],
        details: [...COCO_WRAP, 'Color: Green'], detailsFr: [...COCO_WRAP_FR, 'Couleur : vert'],
    },
    {
        id: 10, name: 'The Coco Set · Mauve', nameFr: 'Ensemble Coco · Mauve', category: 'Coco Set', price: 69.9, tag: 'Opening special', tone: 'mauve',
        image: local('coco-mauve-1.jpeg'),
        gallery: [local('coco-mauve-1.jpeg'), local('coco-mauve-2.jpeg')],
        details: [...COCO_WRAP, 'Color: Mauve'], detailsFr: [...COCO_WRAP_FR, 'Couleur : mauve'],
    },
    {
        id: 11, name: 'The Coco Set · Burgundy', nameFr: 'Ensemble Coco · Bordeaux', category: 'Coco Set', price: 69.9, tag: 'Opening special', tone: 'rose',
        image: local('coco-red-1.jpeg'),
        gallery: [local('coco-red-1.jpeg'), local('coco-red-2.jpeg')],
        details: [...COCO_WRAP, 'Color: Burgundy'], detailsFr: [...COCO_WRAP_FR, 'Couleur : bordeaux'],
    },
    {
        id: 6, name: 'The Elora Wrap Set · Burgundy', nameFr: 'Ensemble cache-cœur Elora · Bordeaux', category: 'Elora Set', price: 69.9, tag: 'Opening special', tone: 'rose',
        image: img('elora-burgundy-CnSzBfNFzegu3iA0afn7xvb8wN6U96.jpeg'),
        details: [...ELORA, 'Color: Burgundy'], detailsFr: [...ELORA_FR, 'Couleur : bordeaux'],
    },
    {
        id: 7, name: 'The Elora Wrap Set · Black', nameFr: 'Ensemble cache-cœur Elora · Noir', category: 'Elora Set', price: 69.9, tag: 'Opening special', tone: 'cream',
        image: img('elora-black-rj9MHOmjqEnmHGAsOIKUaTz3IeOxkp.jpeg'),
        details: [...ELORA, 'Color: Black'], detailsFr: [...ELORA_FR, 'Couleur : noir'],
    },
    {
        id: 9, name: 'The Elora Wrap Set · Mauve', nameFr: 'Ensemble cache-cœur Elora · Mauve', category: 'Elora Set', price: 69.9, tag: 'Opening special', tone: 'mauve',
        image: img('elora-pink-zaZobikaNMUdvbFjLGs3hAuiNC0eTi.jpeg'),
        details: [...ELORA, 'Color: Mauve'], detailsFr: [...ELORA_FR, 'Couleur : mauve'],
    },
    {
        id: 12, name: 'The Fit Set · Black', nameFr: 'Ensemble Fit · Noir', category: 'Fit Set', price: 69.9, tag: 'Opening special', tone: 'cream',
        image: img('WhatsApp%20Image%202026-11-26%20at%201.17.00%20PM9-aAWMhb2cWzLdcKGNyDulycJi7uggyM.jpeg'),
        gallery: [img('WhatsApp%20Image%202026-11-26%20at%201.17.00%20PM-710JrHd0Cc947VpswzxlMIWp5aqDjr.jpeg')],
        details: ['Matching long-sleeve cutout-shoulder crop top and flared leggings', 'Soft, stretchy premium fabric with a non-sheer finish', 'Color: Black'],
        detailsFr: ['Haut court à manches longues et épaules ajourées, assorti à un legging évasé', 'Tissu premium doux, extensible et non transparent', 'Couleur : noir'],
    },
    {
        id: 13, name: 'High-Waist Legging · Black', nameFr: 'Legging taille haute · Noir', category: 'Leggings', price: 29.9, tone: 'cream',
        image: img('legging%20noir-gSIBxNF1AtV71oOspMY8Lk2mS8cw1r.jpeg'),
        details: ['Ultra-stretchy, lightweight and breathable fabric', 'Opaque, non-sheer finish', 'Premium quality', 'Color: Black'],
        detailsFr: ['Tissu ultra-extensible, léger et respirant', 'Finition opaque et non transparente', 'Qualité premium', 'Couleur : noir'],
    },
    {
        id: 14, name: 'The Flare Legging · Black', nameFr: 'Legging patte d’éléphant · Noir', category: 'Leggings', price: 29.9, tone: 'cream',
        image: img('patte-elephant-noir-vZLo3Quy8ofYkSHpaDopLNW3XkTtmN.jpeg'),
        details: ['High-waisted fit', 'Flared-leg silhouette', 'Soft, stretchy black fabric', 'Color: Black'],
        detailsFr: ['Coupe taille haute', 'Silhouette à jambes évasées', 'Tissu noir doux et extensible', 'Couleur : noir'],
    },
]

export const fitEditionSpecifications = ['Soft, stretchy fabric with an elastic finish', 'Opaque and non-sheer', 'Premium quality', 'Available sizes: S, M and L']
export const fitEditionSpecificationsFr = ['Tissu doux et extensible, avec une finition élastiquée', 'Opaque et non transparent', 'Qualité premium', 'Tailles disponibles : S, M et L']

/** Base price is the single-piece price (12 DT). Two or more pieces are bundle-priced in lib/shop.ts (SATIN_PRICE). */
export const satinPillowcase: Product = {
    id: 20,
    name: 'THAT GIRL Satin Pillowcase',
    nameFr: 'Taie en satin THAT GIRL',
    category: 'Satin Pillowcases',
    price: 12,
    tone: 'rose',
    image: img('WhatsApp%20Image%202026-11-23%20at%209.02.15%20PM-rdcXzxmIXq25EdxyedVzTDrErj5HOy.jpeg'),
    gallery: [img('WhatsApp%20Image%202026-11-23%20at%209.02.16%20PM-KejRzsAxBdZf1ByPEUHdKvDvB4FW5g.jpeg')],
    details: [],
    detailsFr: [],
}

if (process.env.NODE_ENV === 'development') {
    for (const p of products) {
        if (!p.gallery?.length) console.warn(`[products] #${p.id} "${p.name}" has only 1 photo — add the 2nd way of wearing it to \`gallery\`.`)
    }
}
