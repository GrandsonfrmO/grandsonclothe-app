export interface Product {
  id: number
  name: string
  price: number
  originalPrice: number | null
  image: string
  images: string[]
  category: string
  description: string
  sizes: string[]
  colors: { name: string; hex: string }[]
  isNew: boolean
  inStock: boolean
  rating: number
  reviews: number
}

export const products: Product[] = [
  {
    id: 1,
    name: "Hoodie Oversize Noir",
    price: 450000,
    originalPrice: null,
    image: "/images/product-hoodie-black.jpg",
    images: ["/images/product-hoodie-black.jpg", "/images/hero-streetwear-1.jpg"],
    category: "Hoodies",
    description: "Hoodie oversize premium en coton epais 400gsm. Coupe decontractee avec capuche doublee et poche kangourou. Le style streetwear authentique de GRANDSON CLOTHES.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Noir", hex: "#0a0a0a" },
      { name: "Gris", hex: "#4a4a4a" },
    ],
    isNew: true,
    inStock: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "T-Shirt Graphic GRANDSON",
    price: 180000,
    originalPrice: 220000,
    image: "/images/product-tshirt-graphic.jpg",
    images: ["/images/product-tshirt-graphic.jpg"],
    category: "T-Shirts",
    description: "T-shirt en coton bio avec impression serigraphie haute qualite. Design exclusif GRANDSON CLOTHES. Coupe reguliere.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Noir", hex: "#0a0a0a" },
      { name: "Blanc", hex: "#ffffff" },
    ],
    isNew: false,
    inStock: true,
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 3,
    name: "Cargo Pants Tactical",
    price: 380000,
    originalPrice: null,
    image: "/images/product-cargo.jpg",
    images: ["/images/product-cargo.jpg"],
    category: "Pantalons",
    description: "Pantalon cargo avec multiples poches fonctionnelles. Tissu ripstop resistant. Coupe streetwear moderne avec taille elastique.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Noir", hex: "#0a0a0a" },
      { name: "Olive", hex: "#4a5d23" },
    ],
    isNew: true,
    inStock: true,
    rating: 4.9,
    reviews: 67,
  },
  {
    id: 4,
    name: "Bomber Jacket Classic",
    price: 520000,
    originalPrice: 650000,
    image: "/images/product-bomber.jpg",
    images: ["/images/product-bomber.jpg"],
    category: "Vestes",
    description: "Bomber jacket classique avec doublure satin. Broderie GRANDSON sur la poitrine. Poches zippees et elastiques aux poignets.",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Noir", hex: "#0a0a0a" },
    ],
    isNew: false,
    inStock: true,
    rating: 4.7,
    reviews: 45,
  },
  {
    id: 5,
    name: "Joggers Tech Fleece",
    price: 320000,
    originalPrice: null,
    image: "/images/product-joggers.jpg",
    images: ["/images/product-joggers.jpg"],
    category: "Pantalons",
    description: "Joggers en tech fleece ultra confortable. Poches zippees laterales. Parfait pour le style decontracte ou le sport.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Gris", hex: "#6b6b6b" },
      { name: "Noir", hex: "#0a0a0a" },
    ],
    isNew: false,
    inStock: true,
    rating: 4.5,
    reviews: 156,
  },
  {
    id: 6,
    name: "Casquette Snapback Logo",
    price: 95000,
    originalPrice: null,
    image: "/images/product-cap.jpg",
    images: ["/images/product-cap.jpg"],
    category: "Accessoires",
    description: "Casquette snapback avec logo GRANDSON brode. Taille ajustable. Visiere plate style streetwear.",
    sizes: ["Unique"],
    colors: [
      { name: "Noir", hex: "#0a0a0a" },
    ],
    isNew: true,
    inStock: true,
    rating: 4.4,
    reviews: 203,
  },
  {
    id: 7,
    name: "Hoodie Oversize Vert",
    price: 450000,
    originalPrice: null,
    image: "/images/product-hoodie-green.jpg",
    images: ["/images/product-hoodie-green.jpg"],
    category: "Hoodies",
    description: "Hoodie oversize premium en coton epais 400gsm. Coloris olive militaire. Coupe decontractee avec capuche doublee.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Olive", hex: "#4a5d23" },
    ],
    isNew: false,
    inStock: true,
    rating: 4.8,
    reviews: 78,
  },
  {
    id: 8,
    name: "T-Shirt Basic Essential",
    price: 120000,
    originalPrice: null,
    image: "/images/product-tshirt-graphic.jpg",
    images: ["/images/product-tshirt-graphic.jpg"],
    category: "T-Shirts",
    description: "T-shirt basique en coton premium 220gsm. Coupe oversize moderne. Indispensable dans toute garde-robe streetwear.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Noir", hex: "#0a0a0a" },
      { name: "Blanc", hex: "#ffffff" },
      { name: "Gris", hex: "#6b6b6b" },
    ],
    isNew: false,
    inStock: true,
    rating: 4.3,
    reviews: 312,
  },
]

export function getProduct(id: number): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-GN').format(price) + ' GNF'
}
