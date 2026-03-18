/**
 * Script pour vérifier et créer l'utilisateur admin
 * Email: papicamara22@gmail.com
 * Password: gabriel612223341
 */

const postgres = require('postgres');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL);

async function checkAndCreateAdmin() {
  console.log('🔍 Vérification de l\'utilisateur admin...\n');

  const adminEmail = 'papicamara22@gmail.com';
  const adminPassword = 'gabriel612223341';
  const adminName = 'Admin GRANDSON';

  try {
    // Vérifier si l'utilisateur existe
    console.log(`📧 Recherche de l'utilisateur: ${adminEmail}`);
    const existingUsers = await sql`
      SELECT id, email, name, role, created_at 
      FROM users 
      WHERE email = ${adminEmail}
    `;

    if (existingUsers.length > 0) {
      const user = existingUsers[0];
      console.log('✅ Utilisateur trouvé:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Nom: ${user.name}`);
      console.log(`   Rôle: ${user.role}`);
      console.log(`   Créé le: ${user.created_at}`);

      // Vérifier le rôle
      if (user.role !== 'admin') {
        console.log('\n⚠️  Le rôle n\'est pas "admin", mise à jour...');
        await sql`
          UPDATE users 
          SET role = 'admin' 
          WHERE email = ${adminEmail}
        `;
        console.log('✅ Rôle mis à jour vers "admin"');
      }

      // Vérifier le mot de passe
      console.log('\n🔐 Vérification du mot de passe...');
      const passwordMatch = await bcrypt.compare(adminPassword, user.password || '');
      
      if (!passwordMatch) {
        console.log('⚠️  Le mot de passe ne correspond pas, mise à jour...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await sql`
          UPDATE users 
          SET password = ${hashedPassword}
          WHERE email = ${adminEmail}
        `;
        console.log('✅ Mot de passe mis à jour');
      } else {
        console.log('✅ Mot de passe correct');
      }

      console.log('\n✅ Configuration admin complète!');
      
    } else {
      console.log('❌ Utilisateur non trouvé, création...\n');
      
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Créer l'utilisateur admin
      const newUser = await sql`
        INSERT INTO users (email, name, password, role, created_at)
        VALUES (
          ${adminEmail},
          ${adminName},
          ${hashedPassword},
          'admin',
          NOW()
        )
        RETURNING id, email, name, role, created_at
      `;

      console.log('✅ Utilisateur admin créé:');
      console.log(`   ID: ${newUser[0].id}`);
      console.log(`   Email: ${newUser[0].email}`);
      console.log(`   Nom: ${newUser[0].name}`);
      console.log(`   Rôle: ${newUser[0].role}`);
    }

    // Afficher les identifiants
    console.log('\n' + '='.repeat(60));
    console.log('🔑 IDENTIFIANTS ADMIN');
    console.log('='.repeat(60));
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`URL:      http://localhost:3000/2tact`);
    console.log('='.repeat(60));

    console.log('\n✅ Vous pouvez maintenant tester la connexion avec:');
    console.log('   node test-admin-login-2tact.js');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('\n🔍 Vérifications:');
    console.error('1. DATABASE_URL est-il configuré dans .env.local?');
    console.error('2. La table users existe-t-elle?');
    console.error('3. La connexion à la base de données fonctionne-t-elle?');
  } finally {
    await sql.end();
  }
}

checkAndCreateAdmin();
