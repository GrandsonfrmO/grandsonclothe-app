const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { users } = require('../lib/db/schema');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function updateAdmin() {
  try {
    console.log('🔄 Mise à jour du compte administrateur...');

    const newEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const newPassword = process.env.ADMIN_PASSWORD || 'secure_password_here';

    // Connexion à la base de données
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in .env.local');
    }
    
    const client = postgres(connectionString);
    const db = drizzle(client);

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Chercher s'il existe déjà un admin
    const existingAdmins = await db
      .select()
      .from(users)
      .where(eq(users.role, 'admin'));

    if (existingAdmins.length > 0) {
      // Mettre à jour le premier admin trouvé
      const adminId = existingAdmins[0].id;
      
      await db
        .update(users)
        .set({
          email: newEmail,
          password: hashedPassword,
          name: 'Papi Camara',
          role: 'admin',
        })
        .where(eq(users.id, adminId));

      console.log('✅ Compte admin mis à jour avec succès !');
      console.log(`📧 Email: ${newEmail}`);
      console.log(`🔑 Mot de passe: ${newPassword}`);
    } else {
      // Créer un nouveau compte admin
      await db.insert(users).values({
        email: newEmail,
        password: hashedPassword,
        name: 'Papi Camara',
        role: 'admin',
      });

      console.log('✅ Nouveau compte admin créé avec succès !');
      console.log(`📧 Email: ${newEmail}`);
      console.log(`🔑 Mot de passe: ${newPassword}`);
    }

    console.log('\n🎉 Vous pouvez maintenant vous connecter sur /2tact');
    console.log(`🔗 URL: http://localhost:3000/2tact`);
    
    await client.end();
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    throw error;
  }
}

updateAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
