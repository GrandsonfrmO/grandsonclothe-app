# ÉTAPE 6 : QUICK START - EMAILS AVEC RESEND ⚡

## 1️⃣ Configuration (2 min)

### Ajouter à `.env.local` :
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Obtenir la clé :**
1. Allez sur [resend.com](https://resend.com)
2. Créez un compte
3. Settings → API Keys → Copiez la clé

## 2️⃣ Fichiers Créés

| Fichier | Rôle |
|---------|------|
| `lib/email.ts` | Service d'envoi d'emails |
| `lib/email-templates.ts` | Templates et utilitaires |
| `app/api/webhooks/order-status/route.ts` | Webhook pour les mises à jour |

## 3️⃣ Utilisation

### Créer une commande (envoie email)
```bash
POST /api/orders
{
  "userId": 1,
  "totalAmount": "150000",
  "customerName": "Jean Dupont",
  "customerEmail": "jean@example.com",
  "deliveryAddress": "Rue de la Paix, Conakry",
  "items": [...]
}
```

### Confirmer le paiement
```bash
POST /api/webhooks/order-status
{
  "orderId": 1,
  "paymentStatus": "completed"
}
```

### Expédier la commande
```bash
POST /api/webhooks/order-status
{
  "orderId": 1,
  "status": "shipped"
}
```

## 4️⃣ Emails Envoyés

✅ **Confirmation de commande** - Immédiatement après création
✅ **Confirmation de paiement** - Quand paiement confirmé
✅ **Notification d'expédition** - Quand commande expédiée

## 5️⃣ Vérifier les Emails

1. Allez sur [resend.com/emails](https://resend.com/emails)
2. Vous verrez tous les emails envoyés
3. Cliquez pour voir le contenu

## 6️⃣ Logs

Vérifiez la console du serveur :
```
✓ Order confirmation email sent to jean@example.com
✓ Payment confirmation email sent to jean@example.com
✓ Shipping notification email sent to jean@example.com
```

## 📚 Documentation Complète

- `ETAPE_6_EMAIL.md` - Guide détaillé
- `EMAIL_TEST.md` - Guide de test complet

## ✅ Checklist

- [ ] Clé API Resend configurée
- [ ] Email `RESEND_FROM_EMAIL` configuré
- [ ] Tester création de commande
- [ ] Vérifier email dans Resend Dashboard
- [ ] Tester webhook de paiement
- [ ] Tester webhook d'expédition
