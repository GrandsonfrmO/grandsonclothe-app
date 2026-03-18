import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { products } from '@/lib/db/schema'

const colorSets = [
  [
    { name: 'Rouge', hex: '#FF0000' },
    { name: 'Bleu', hex: '#0000FF' },
    { name: 'Noir', hex: '#000000' }
  ],
  [
    { name: 'Rose', hex: '#FFC0CB' },
    { name: 'Bleu Ciel', hex: '#87CEEB' },
    { name: 'Menthe', hex: '#98FF98' }
  ],
  [
    { name: 'Noir', hex: '#000000' },
    { name: 'Blanc', hex: '#FFFFFF' },
    { name: 'Gris', hex: '#808080' }
  ],
  [
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Jaune', hex: '#FFD700' },
    { name: 'Rouge Foncé', hex: '#DC143C' }
  ],
  [
    { name: 'Bleu Marine', hex: '#000080' },
    { name: 'Turquoise', hex: '#40E0D0' },
    { name: 'Violet', hex: '#800080' }
  ],
  [
    { name: 'Marron', hex: '#8B4513' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Vert Olive', hex: '#808000' }
  ],
  [
    { name: 'Corail', hex: '#FF7F50' },
    { name: 'Lavande', hex: '#E6E6FA' },
    { name: 'Bordeaux', hex: '#800020' }
  ]
]

export async function POST() {
  try {
    // Récupérer tous les produits
    const productsList = await db.select({ id: products.id, name: products.name }).from(products)
    
    let updated = 0
    const updates: any[] = []
    
    for (let i = 0; i < productsList.length; i++) {
      const product = productsList[i]
      const colorSet = colorSets[i % colorSets.length]
      const colorsJson = JSON.stringify(colorSet)
      
      await db.update(products).set({ colors: colorsJson }).where(eq(products.id, product.id))
      
      updates.push({
        id: product.id,
        name: product.name,
        colors: colorSet.map(c => c.name).join(', ')
      })
      
      updated++
    }
    
    return NextResponse.json({
      success: true,
      message: `${updated} produits mis à jour avec succès`,
      updates
    })
  } catch (error: any) {
    console.error('Error updating colors:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des couleurs' },
      { status: 500 }
    )
  }
}
