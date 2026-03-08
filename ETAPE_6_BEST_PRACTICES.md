# ÉTAPE 6 : BONNES PRATIQUES 🎯

## 1. Configuration et Sécurité

### ✅ À Faire

```env
# .env.local (JAMAIS commiter)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

```env
# .env.example (Commiter)
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### ❌ À Éviter

```env
# Ne pas commiter les vraies clés
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

## 2. Gestion des Erreurs

### ✅ À Faire

```typescript
try {
  await sendOrderConfirmationEmail(email, data);
} catch (emailError) {
  console.error('Failed to send email:', emailError);
  // Ne pas bloquer la création de commande
}
```

### ❌ À Éviter

```typescript
// Ne pas bloquer la commande si l'email échoue
await sendOrderConfirmationEmail(email, data);
```

## 3. Validation des Données

### ✅ À Faire

```typescript
const orderData = {
  userId: 1,
  totalAmount: '150000',
  customerName: 'Jean Dupont',
  customerEmail: 'jean@example.com', // Valider l'email
  deliveryAddress: 'Rue de la Paix, Conakry',
  items: [
    {
      productId: 1,
      quantity: 2,
      price: '75000',
      productName: 'T-shirt Premium',
    },
  ],
};
```

### ❌ À Éviter

```typescript
// Ne pas envoyer d'email sans email valide
const orderData = {
  userId: 1,
  totalAmount: '150000',
  // customerEmail manquant
};
```

## 4. Formatage des Données

### ✅ À Faire

```typescript
// Utiliser les fonctions de formatage
import { formatCurrency, formatDate } from '@/lib/email-templates';

const amount = formatCurrency('150000'); // 150 000 GNF
const date = formatDate(new Date()); // 7 mars 2026
```

### ❌ À Éviter

```typescript
// Ne pas formater manuellement
const amount = '150000'; // Pas formaté
const date = new Date().toString(); // Format non lisible
```

## 5. Templates Email

### ✅ À Faire

```typescript
// Utiliser les templates réutilisables
import { getEmailHeader, getEmailFooter, emailStyles } from '@/lib/email-templates';

const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        ${getEmailHeader('Titre', 'Sous-titre')}
        <!-- Contenu -->
        ${getEmailFooter()}
      </div>
    </body>
  </html>
`;
```

### ❌ À Éviter

```typescript
// Ne pas dupliquer les styles et la structure
const html = `
  <html>
    <head>
      <style>/* Styles dupliqués */</style>
    </head>
    <body>
      <!-- Pas de structure cohérente -->
    </body>
  </html>
`;
```

## 6. Logs et Débogage

### ✅ À Faire

```typescript
console.log(`✓ Order confirmation email sent to ${email}`);
console.error('Error sending email:', error);
```

### ❌ À Éviter

```typescript
// Pas de logs
// Logs peu informatifs
console.log('Email sent');
```

## 7. Webhooks

### ✅ À Faire

```typescript
// Webhook pour les mises à jour
POST /api/webhooks/order-status
{
  "orderId": 1,
  "paymentStatus": "completed"
}
```

### ❌ À Éviter

```typescript
// Ne pas mettre à jour directement en base de données
// Utiliser les webhooks pour les mises à jour
```

## 8. Tester les Emails

### ✅ À Faire

```bash
# Tester avec curl
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "totalAmount": "150000",
    "customerName": "Jean Dupont",
    "customerEmail": "jean@example.com",
    "deliveryAddress": "Rue de la Paix, Conakry",
    "items": [...]
  }'

# Vérifier dans Resend Dashboard
# Vérifier les logs du serveur
```

### ❌ À Éviter

```bash
# Ne pas tester sans vérifier les résultats
# Ne pas vérifier dans Resend Dashboard
```

## 9. Performance

### ✅ À Faire

```typescript
// Envoyer les emails de manière asynchrone
try {
  await sendOrderConfirmationEmail(email, data);
} catch (error) {
  console.error('Email error:', error);
}
// Continuer sans attendre
```

### ❌ À Éviter

```typescript
// Ne pas bloquer sur l'envoi d'email
await sendOrderConfirmationEmail(email, data);
// Attendre la réponse
```

## 10. Monitoring

### ✅ À Faire

```typescript
// Monitorer les erreurs d'email
try {
  await sendOrderConfirmationEmail(email, data);
} catch (error) {
  console.error('Email error:', error);
  // Envoyer une alerte
  // Enregistrer dans un système de monitoring
}
```

### ❌ À Éviter

```typescript
// Ne pas ignorer les erreurs
try {
  await sendOrderConfirmationEmail(email, data);
} catch (error) {
  // Ignorer l'erreur
}
```

## 11. Personnalisation

### ✅ À Faire

```typescript
// Personnaliser les emails avec les données de l'utilisateur
const html = `
  <p>Bonjour ${customerName},</p>
  <p>Votre commande #${orderId} a été confirmée.</p>
`;
```

### ❌ À Éviter

```typescript
// Ne pas utiliser de templates génériques
const html = `
  <p>Bonjour,</p>
  <p>Votre commande a été confirmée.</p>
`;
```

## 12. Internationalisation

### ✅ À Faire

```typescript
// Utiliser la locale française
const date = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(new Date());

const amount = new Intl.NumberFormat('fr-GN', {
  style: 'currency',
  currency: 'GNF',
}).format(150000);
```

### ❌ À Éviter

```typescript
// Ne pas utiliser la locale par défaut
const date = new Date().toString(); // Anglais
const amount = '150000'; // Pas formaté
```

## 13. Accessibilité

### ✅ À Faire

```html
<!-- Utiliser des balises sémantiques -->
<h1>Commande confirmée</h1>
<table>
  <thead>
    <tr>
      <th>Produit</th>
      <th>Quantité</th>
      <th>Prix</th>
    </tr>
  </thead>
  <tbody>
    <!-- Contenu -->
  </tbody>
</table>
```

### ❌ À Éviter

```html
<!-- Ne pas utiliser de divs pour tout -->
<div>Commande confirmée</div>
<div>
  <div>Produit</div>
  <div>Quantité</div>
  <div>Prix</div>
</div>
```

## 14. Maintenance

### ✅ À Faire

```typescript
// Documenter les fonctions
/**
 * Envoie un email de confirmation de commande
 * @param email - Email du client
 * @param orderData - Données de la commande
 */
export const sendOrderConfirmationEmail = async (
  email: string,
  orderData: OrderData
) => {
  // ...
};
```

### ❌ À Éviter

```typescript
// Ne pas documenter
export const sendOrderConfirmationEmail = async (email, orderData) => {
  // ...
};
```

## 15. Versioning

### ✅ À Faire

```typescript
// Versionner les templates
// v1: Template initial
// v2: Ajout du logo
// v3: Changement de couleurs
```

### ❌ À Éviter

```typescript
// Ne pas versionner
// Modifier directement les templates
```

## Checklist de Bonnes Pratiques

- [ ] Clés API dans `.env.local` (jamais commiter)
- [ ] Gestion des erreurs gracieuse
- [ ] Validation des données
- [ ] Formatage des données
- [ ] Templates réutilisables
- [ ] Logs informatifs
- [ ] Tests réguliers
- [ ] Monitoring des erreurs
- [ ] Personnalisation des emails
- [ ] Internationalisation
- [ ] Accessibilité
- [ ] Documentation
- [ ] Versioning des templates
- [ ] Performance optimisée
- [ ] Sécurité renforcée

## Ressources

- [Resend Documentation](https://resend.com/docs)
- [Email Best Practices](https://resend.com/docs/best-practices)
- [HTML Email Guide](https://www.campaignmonitor.com/guides/email-design/)
