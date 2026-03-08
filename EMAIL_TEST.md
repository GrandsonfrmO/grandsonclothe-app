# Test des Emails 📧

## Configuration Préalable

1. **Clé API Resend** dans `.env.local` :
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

2. **Démarrer le serveur** :
```bash
pnpm dev
```

## Test 1 : Email de Confirmation de Commande

### Créer une commande

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "totalAmount": "150000",
    "paymentMethod": "cash_on_delivery",
    "deliveryAddress": "Rue de la Paix, Conakry",
    "phoneNumber": "+224 XXX XXX XXX",
    "customerName": "Jean Dupont",
    "customerEmail": "jean@example.com",
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "price": "75000",
        "productName": "T-shirt Premium"
      }
    ]
  }'
```

**Résultat attendu :**
- ✅ Commande créée avec ID
- ✅ Email de confirmation envoyé à jean@example.com
- ✅ Vérifier dans Resend Dashboard

## Test 2 : Email de Confirmation de Paiement

### Mettre à jour le statut de paiement

```bash
curl -X POST http://localhost:3000/api/webhooks/order-status \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1,
    "paymentStatus": "completed"
  }'
```

**Résultat attendu :**
- ✅ Statut de paiement mis à jour
- ✅ Email de confirmation de paiement envoyé
- ✅ Vérifier dans Resend Dashboard

## Test 3 : Email de Notification d'Expédition

### Mettre à jour le statut d'expédition

```bash
curl -X POST http://localhost:3000/api/webhooks/order-status \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1,
    "status": "shipped"
  }'
```

**Résultat attendu :**
- ✅ Statut d'expédition mis à jour
- ✅ Email de notification d'expédition envoyé
- ✅ Vérifier dans Resend Dashboard

## Vérification dans Resend Dashboard

1. Allez sur [resend.com/emails](https://resend.com/emails)
2. Vous devriez voir les emails envoyés
3. Cliquez sur chaque email pour voir le contenu HTML

## Dépannage

### Email non reçu

**Problème :** L'email n'apparaît pas dans Resend Dashboard

**Solutions :**
1. Vérifier la clé API dans `.env.local`
2. Vérifier que `RESEND_FROM_EMAIL` est configuré
3. Vérifier les logs du serveur pour les erreurs
4. Vérifier que `customerEmail` et `customerName` sont fournis dans la requête

### Erreur "Unsupported URL Type"

**Problème :** Erreur lors de l'installation de Resend

**Solution :**
```bash
pnpm add resend
```

### Email avec contenu vide

**Problème :** L'email est reçu mais sans contenu

**Solutions :**
1. Vérifier que les données sont correctement formatées
2. Vérifier que le HTML est valide
3. Vérifier les logs du serveur

## Logs

Pour voir les logs d'envoi d'email, vérifiez la console du serveur :

```
✓ Order confirmation email sent to jean@example.com
✓ Payment confirmation email sent to jean@example.com
✓ Shipping notification email sent to jean@example.com
```

## Prochaines Étapes

1. **Intégrer au checkout** pour envoyer l'email automatiquement
2. **Ajouter des templates personnalisés** avec logo et couleurs
3. **Implémenter les webhooks** côté admin
4. **Ajouter des emails supplémentaires** (bienvenue, récupération mot de passe)
