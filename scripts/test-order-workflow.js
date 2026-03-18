#!/usr/bin/env node

/**
 * Script de test du flux de commande
 * Teste la création de commande et la validation par l'admin
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function testOrderWorkflow() {
  console.log('🧪 Démarrage des tests du flux de commande...\n');

  try {
    // 1. Créer une commande de test
    console.log('1️⃣  Création d\'une commande de test...');
    const orderResponse = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guestName: 'Test Client',
        guestEmail: 'test@example.com',
        phoneNumber: '+224612345678',
        deliveryAddress: '123 Rue de Test, Conakry',
        totalAmount: 50000,
        paymentMethod: 'cash_on_delivery',
        items: [
          {
            productId: 1,
            quantity: 2,
            price: 25000,
          },
        ],
      }),
    });

    if (!orderResponse.ok) {
      throw new Error(`Erreur création commande: ${orderResponse.status}`);
    }

    const order = await orderResponse.json();
    console.log(`✅ Commande créée: #${order.id}\n`);

    // 2. Vérifier que la commande est en attente
    console.log('2️⃣  Vérification du statut initial...');
    const getResponse = await fetch(`${API_URL}/api/orders?orderId=${order.id}`);
    const orderData = await getResponse.json();
    const createdOrder = orderData[0];

    if (createdOrder.status !== 'pending') {
      throw new Error(`Statut attendu: pending, reçu: ${createdOrder.status}`);
    }
    console.log(`✅ Statut: ${createdOrder.status}\n`);

    // 3. Valider la commande (admin)
    console.log('3️⃣  Validation de la commande par l\'admin...');
    const validateResponse = await fetch(`${API_URL}/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'processing',
        adminNotes: 'Commande validée - Prête pour expédition',
      }),
    });

    if (!validateResponse.ok) {
      throw new Error(`Erreur validation: ${validateResponse.status}`);
    }

    const validatedOrder = await validateResponse.json();
    console.log(`✅ Commande validée: statut = ${validatedOrder.status}\n`);

    // 4. Marquer comme expédiée
    console.log('4️⃣  Marquage de la commande comme expédiée...');
    const shipResponse = await fetch(`${API_URL}/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'shipped',
      }),
    });

    if (!shipResponse.ok) {
      throw new Error(`Erreur expédition: ${shipResponse.status}`);
    }

    const shippedOrder = await shipResponse.json();
    console.log(`✅ Commande expédiée: statut = ${shippedOrder.status}\n`);

    // 5. Marquer comme livrée
    console.log('5️⃣  Marquage de la commande comme livrée...');
    const deliverResponse = await fetch(`${API_URL}/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'delivered',
      }),
    });

    if (!deliverResponse.ok) {
      throw new Error(`Erreur livraison: ${deliverResponse.status}`);
    }

    const deliveredOrder = await deliverResponse.json();
    console.log(`✅ Commande livrée: statut = ${deliveredOrder.status}\n`);

    console.log('✨ Tous les tests sont passés avec succès!\n');
    console.log('📊 Résumé:');
    console.log(`  - Commande créée: #${order.id}`);
    console.log(`  - Client: ${createdOrder.guestName}`);
    console.log(`  - Email: ${createdOrder.guestEmail}`);
    console.log(`  - Montant: ${createdOrder.totalAmount} GNF`);
    console.log(`  - Statut final: ${deliveredOrder.status}`);
    console.log(`  - Notes admin: ${deliveredOrder.adminNotes || 'Aucune'}`);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    process.exit(1);
  }
}

testOrderWorkflow();
