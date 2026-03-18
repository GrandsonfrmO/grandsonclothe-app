// Configuration pour la Guinée Conakry
export const siteConfig = {
  country: {
    name: 'Guinée',
    code: 'GN',
    capital: 'Conakry',
    locale: 'fr-GN',
  },
  currency: {
    code: 'GNF',
    symbol: 'GNF',
    name: 'Franc Guinéen',
    decimals: 0, // Le GNF n'utilise pas de décimales
  },
  contact: {
    phone: '+224 620 00 00 00', // Format guinéen
    whatsapp: '+224 620 00 00 00',
    email: 'contact@grandsonclothes.com',
    address: 'Conakry, Guinée',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'secure_password_here',
  },
  shipping: {
    freeThreshold: 500000, // 500,000 GNF pour livraison gratuite
    conakryFee: 20000, // 20,000 GNF
    otherCitiesFee: 50000, // 50,000 GNF
    cities: [
      'Conakry',
      'Kankan',
      'Nzérékoré',
      'Kindia',
      'Labé',
      'Mamou',
      'Boké',
      'Faranah',
      'Siguiri',
      'Kissidougou',
    ],
  },
  social: {
    instagram: 'https://instagram.com/grandsonclothes',
    tiktok: 'https://tiktok.com/@grandsonclothes',
    facebook: 'https://facebook.com/grandsonclothes',
    twitter: '@grandsonclothes',
  },
  business: {
    name: 'GRANDSON CLOTHES',
    tagline: 'Streetwear authentique depuis la Guinée',
    description: 'GRANDSON CLOTHES - Streetwear authentique depuis la Guinée, Afrique. Découvrez notre collection urbaine unique.',
    foundedYear: 2024,
  },
}

// Fonction pour formater les prix en GNF
export function formatPrice(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat(siteConfig.country.locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num) + ' ' + siteConfig.currency.code
}

// Fonction pour formater les numéros de téléphone guinéens
export function formatPhoneNumber(phone: string): string {
  // Format: +224 6XX XX XX XX
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('224')) {
    const number = cleaned.slice(3)
    return `+224 ${number.slice(0, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7, 9)}`
  }
  return phone
}
