/**
 * Formate un prix en Franc Guinéen (GNF) sans décimales
 */
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseInt(price, 10) : Math.floor(price);
  return `${numPrice.toLocaleString('fr-GN')} GNF`;
}

/**
 * Formate un prix pour l'affichage simple (nombre seulement)
 */
export function formatPriceNumber(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseInt(price, 10) : Math.floor(price);
  return numPrice.toLocaleString('fr-GN');
}
