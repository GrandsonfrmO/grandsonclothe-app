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

// Les produits sont maintenant gérés via la base de données
// Utilisez l'API /api/products pour récupérer les produits réels
export const products: Product[] = []

export function getProduct(id: number): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-GN').format(price) + ' GNF'
}
