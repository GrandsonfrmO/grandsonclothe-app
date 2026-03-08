# ÉTAPE 6 : AJOUTER LES EMAILS 📧

## Vue d'ensemble

Cette étape ajoute la fonctionnalité d'envoi d'emails transactionnels avec **Resend** pour :
- Confirmation de commande
- Confirmation de paiement
- Notification d'expédition

## Installation

### 1. Resend est déjà installé ✓

```bash
pnpm add resend
```

## Configuration

### 2. Variables d'environnement

Ajoutez à votre `.env.local` :

```env
# Email (Resend)
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Obtenir une clé API Resend :**
1. Allez sur [resend.com](https://resend.com)
2. Créez un compte
3. Allez dans Settings → API Keys
4. Copiez votre clé API
5. Collez-la dans `.env.local`

## Architecture

### Service Email (`lib/email.ts`)

Trois fonctions principales :

#### 1. `sendOrderConfirmationEmail()`
Envoyée immédiatement après la création de la commande.

**Contient :**
- Numéro de commande
- Détails des produits (nom, quantité, prix)
- Montant total
- Adresse de livraison
- Mode de paiement

#### 2. `sendPaymentConfirmationEmail()`
Envoyée quand le paiement est confirmé.

**Contient :**
- Confirmation du paiement
- Numéro de commande
- Montant payé
- Date du paiement

#### 3. `sendShippingNotificationEmail()`
Envoyée quand la commande est expédiée.

**Contient :**
- Notification d'expédition
- Numéro de suivi (optionnel)
- Date de livraison estimée

## Intégration

### API des Commandes (`app/api/orders/route.ts`)

Mise à jour du POST pour envoyer un email de confirmation :

```typescript
// Après la création de la commande
await sendOrderConfirmationEmail(user.email, {
  orderId,
  customerName: user.name,
  totalAmount: totalAmount.toString(),
  deliveryAddress: deliveryAddress || '',
  items: items.map((item) => ({
    productName: item.productName,
    quantity: item.quantity,
    price: item.price.toString(),
  })),
});
```

### Webhook de Statut (`app/api/webhooks/order-status/route.ts`)

Nouvel endpoint pour gérer les mises à jour de statut :

```bash
POST /api/webhooks/order-status
```

**Body :**
```json
{
  "orderId": 1,
  "status": "shipped",
  "paymentStatus": "completed"
}
```

**Comportement :**
- Si `paymentStatus` = "completed" → Envoie email de confirmation de paiement
- Si `status` = "shipped" → Envoie notification d'expédition

## Utilisation

### 1. Créer une commande (envoie email de confirmation)

```bash
POST /api/orders
Content-Type: application/json

{
  "userId": 1,
  "totalAmount": "150000",
  "paymentMethod": "cash_on_delivery",
  "deliveryAddress": "Rue de la Paix, Conakry",
  "phoneNumber": "+224 XXX XXX XXX",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": "75000",
      "productName": "T-shirt Premium"
    }
  ]
}
```

### 2. Mettre à jour le statut de paiement

```bash
POST /api/webhooks/order-status
Content-Type: application/json

{
  "orderId": 1,
  "paymentStatus": "completed"
}
```

### 3. Mettre à jour le statut d'expédition

```bash
POST /api/webhooks/order-status
Content-Type: application/json

{
  "orderId": 1,
  "status": "shipped"
}
```

## Templates Email

### Email de Confirmation de Commande

```
Commande #123
Merci pour votre achat!

Détails de la commande:
- T-shirt Premium × 2 = 150,000 GNF
- Total: 150,000 GNF

Adresse de livraison:
Rue de la Paix, Conakry

Mode de paiement:
Paiement à la livraison

Vous recevrez une notification SMS quand votre commande sera en route.
```

### Email de Confirmation de Paiement

```
✓ Paiement confirmé

Merci, votre paiement a été reçu avec succès!

Détails du paiement:
- Numéro de commande: #123
- Montant: 150,000 GNF
- Date: 07/03/2026

Votre commande est maintenant en cours de traitement.
```

### Email de Notification d'Expédition

```
Votre commande est en route!

Informations de livraison:
- Numéro de commande: #123
- Livraison estimée: 10/03/2026

Vous recevrez un SMS avec les détails du livreur.
```

## Gestion des Erreurs

Les erreurs d'envoi d'email ne bloquent pas la création de commande :

```typescript
try {
  await sendOrderConfirmationEmail(...);
} catch (emailError) {
  console.error('Failed to send email:', emailError);
  // La commande est créée même si l'email échoue
}
```

## Prochaines Étapes

1. **Tester les emails** avec Resend Dashboard
2. **Ajouter des templates personnalisés** (logo, couleurs)
3. **Implémenter les webhooks** côté admin pour déclencher les emails
4. **Ajouter des emails supplémentaires** :
   - Email de bienvenue
   - Email de récupération de mot de passe
   - Email de notification de livraison

## Fichiers Modifiés

- ✅ `lib/email.ts` - Service email (nouveau)
- ✅ `app/api/orders/route.ts` - Intégration email
- ✅ `app/api/webhooks/order-status/route.ts` - Webhook (nouveau)
- ✅ `.env.example` - Variables d'environnement

## Checklist

- [ ] Clé API Resend configurée dans `.env.local`
- [ ] Email `RESEND_FROM_EMAIL` configuré
- [ ] Tester l'envoi d'email de confirmation de commande
- [ ] Tester le webhook de paiement
- [ ] Tester le webhook d'expédition
- [ ] Vérifier les emails dans Resend Dashboard
- [ ] Ajouter des templates personnalisés (optionnel)
