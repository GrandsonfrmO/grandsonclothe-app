const postgres = require('postgres');

async function seedData() {
  const sql = postgres(process.env.DATABASE_URL);

  console.log('🌱 Ajout des données de test...');

  try {
    // Ajouter des ambassadeurs
    console.log('\n📸 Ajout des ambassadeurs...');
    
    const ambassadors = [
      {
        name: 'Aïssatou Diallo',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        bio: 'Influenceuse mode et lifestyle passionnée par la qualité et l\'authenticité. Partage ses coups de cœur avec sa communauté de 50k followers.',
        role: 'Influenceuse Mode',
        instagram: 'https://instagram.com/aissatou.style',
        facebook: 'https://facebook.com/aissatou.style',
        isActive: true,
        displayOrder: 1,
      },
      {
        name: 'Mamadou Bah',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        bio: 'Artiste et créateur de contenu. Utilise nos produits dans ses créations artistiques et partage son processus créatif.',
        role: 'Artiste Créateur',
        instagram: 'https://instagram.com/mamadou.art',
        twitter: 'https://twitter.com/mamadou_art',
        isActive: true,
        displayOrder: 2,
      },
      {
        name: 'Fatoumata Sow',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        bio: 'Entrepreneur et femme d\'affaires. Ambassadrice de l\'empowerment féminin et de l\'entrepreneuriat local.',
        role: 'Entrepreneur',
        instagram: 'https://instagram.com/fatoumata.business',
        facebook: 'https://facebook.com/fatoumata.business',
        website: 'https://fatoumata-business.com',
        isActive: true,
        displayOrder: 3,
      },
      {
        name: 'Ousmane Kone',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        bio: 'Photographe professionnel et content creator. Capture les moments authentiques avec nos produits.',
        role: 'Photographe',
        instagram: 'https://instagram.com/ousmane.photo',
        twitter: 'https://twitter.com/ousmane_photo',
        isActive: true,
        displayOrder: 4,
      },
    ];

    for (const ambassador of ambassadors) {
      await sql`
        INSERT INTO brand_ambassadors (name, profile_image, bio, role, instagram, facebook, twitter, is_active, display_order)
        VALUES (${ambassador.name}, ${ambassador.profileImage}, ${ambassador.bio}, ${ambassador.role}, ${ambassador.instagram || null}, ${ambassador.facebook || null}, ${ambassador.twitter || null}, ${ambassador.isActive}, ${ambassador.displayOrder})
        ON CONFLICT DO NOTHING
      `;
    }
    console.log(`✅ ${ambassadors.length} ambassadeurs ajoutés`);

    // Ajouter des images de galerie client
    console.log('\n🖼️  Ajout des images de galerie...');
    
    const galleryImages = [
      {
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
        customerName: 'Mariam',
        caption: 'Adorable ce produit! Qualité exceptionnelle',
        isApproved: true,
        isActive: true,
        displayOrder: 1,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop',
        customerName: 'Aminata',
        caption: 'Parfait pour mon style personnel',
        isApproved: true,
        isActive: true,
        displayOrder: 2,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1515562141207-6811bcb33eaf?w=400&h=400&fit=crop',
        customerName: 'Hawa',
        caption: 'Recommandé à tous mes amis!',
        isApproved: true,
        isActive: true,
        displayOrder: 3,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop',
        customerName: 'Awa',
        caption: 'Excellent rapport qualité-prix',
        isApproved: true,
        isActive: true,
        displayOrder: 4,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
        customerName: 'Ndeye',
        caption: 'Je suis tombée amoureuse de ce produit',
        isApproved: true,
        isActive: true,
        displayOrder: 5,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop',
        customerName: 'Oumou',
        caption: 'Livraison rapide et produit conforme',
        isApproved: true,
        isActive: true,
        displayOrder: 6,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1515562141207-6811bcb33eaf?w=400&h=400&fit=crop',
        customerName: 'Aïssatou',
        caption: 'Meilleur achat de l\'année!',
        isApproved: true,
        isActive: true,
        displayOrder: 7,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
        customerName: 'Fatou',
        caption: 'Très satisfaite de ma commande',
        isApproved: true,
        isActive: true,
        displayOrder: 8,
      },
    ];

    for (const image of galleryImages) {
      await sql`
        INSERT INTO customer_gallery (image_url, customer_name, caption, is_approved, is_active, display_order)
        VALUES (${image.imageUrl}, ${image.customerName}, ${image.caption}, ${image.isApproved}, ${image.isActive}, ${image.displayOrder})
        ON CONFLICT DO NOTHING
      `;
    }
    console.log(`✅ ${galleryImages.length} images de galerie ajoutées`);

    console.log('\n🎉 Données de test ajoutées avec succès!');
    console.log('\n📱 Vérifiez la page d\'accueil pour voir les sections:');
    console.log('   - Nos Ambassadeurs');
    console.log('   - Ils portent notre marque (Galerie)');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedData();
