# ÉTAPE 6 : INTÉGRATION AU CHECKOUT 🛒

## Vue d'ensemble

Ce guide explique comment intégrer l'envoi d'emails au processus de checkout.

## Flux Actuel

```
1. Utilisateur remplit le formulaire de checkout
2. Clique sur "Confirmer la commande"
3. Commande créée en base de données
4. Email de confirmation envoyé automatiquement
5. Redirection vers page de confirmation
```

## Implémentation

### 1. Récupérer les Données du Formulaire

Dans votre composant de checkout (`app/checkout/page.tsx`), récupérez :

```typescript
const formData = {
  userId: user.id,
  totalAmount: cartTotal.toString(),
  customerName: user.name,
  customerEmail: user.email,
  deliveryAddress: formValues.address,
  phoneNumber: formValues.phone,
  items: cartItems.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
    productName: item.productName,
  })),
};
```

### 2. Envoyer la Commande

```typescript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});

const order = await response.json();
```

### 3. Rediriger vers la Confirmation

```typescript
if (response.ok) {
  // Email envoyé automatiquement
  router.push(`/order-confirmation/${order.id}`);
}
```

## Exemple Complet

```typescript
// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items: cartItems, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Préparer les données
      const orderData = {
        userId: user?.id,
        totalAmount: total.toString(),
        customerName: user?.name,
        customerEmail: user?.email,
        deliveryAddress: formData.address,
        phoneNumber: formData.phone,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price.toString(),
          productName: item.productName,
        })),
      };

      // Créer la commande
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // Email envoyé automatiquement
      // Rediriger vers la confirmation
      router.push(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Error:', error);
      // Afficher un message d'erreur
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Adresse de livraison"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Numéro de téléphone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Traitement...' : 'Confirmer la commande'}
        </button>
      </form>
    </div>
  );
}
```

## Affichage du Message de Confirmation

Dans la page de confirmation (`app/order-confirmation/[id]/page.tsx`) :

```typescript
export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  return (
    <div className="confirmation-container">
      <h1>Commande confirmée!</h1>
      <p>Numéro de commande: #{params.id}</p>
      <p>Un email de confirmation a été envoyé à votre adresse email.</p>
      <p>Vous recevrez une notification SMS quand votre commande sera en route.</p>
    </div>
  );
}
```

## Gestion des Erreurs

```typescript
try {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }

  const order = await response.json();
  router.push(`/order-confirmation/${order.id}`);
} catch (error) {
  console.error('Order creation error:', error);
  // Afficher un toast ou un message d'erreur
  toast.error('Erreur lors de la création de la commande');
}
```

## Vérification de l'Email

Après la création de la commande :

1. Allez sur [resend.com/emails](https://resend.com/emails)
2. Vous verrez l'email de confirmation envoyé
3. Cliquez pour voir le contenu HTML

## Logs

Vérifiez la console du serveur :

```
✓ Order confirmation email sent to jean@example.com
```

## Prochaines Étapes

1. **Ajouter un toast de succès** après la création
2. **Ajouter un toast d'erreur** en cas d'échec
3. **Ajouter une animation de chargement** pendant le traitement
4. **Ajouter une validation du formulaire** côté client
5. **Ajouter une confirmation avant de soumettre**

## Exemple avec Toast

```typescript
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      // ... créer la commande
      toast({
        title: 'Succès',
        description: 'Commande créée avec succès. Un email de confirmation a été envoyé.',
      });
      router.push(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de la commande.',
        variant: 'destructive',
      });
    }
  };
}
```

## Checklist d'Intégration

- [ ] Récupérer les données du formulaire
- [ ] Envoyer la commande à l'API
- [ ] Gérer les erreurs
- [ ] Afficher un message de succès
- [ ] Rediriger vers la confirmation
- [ ] Vérifier l'email dans Resend Dashboard
- [ ] Tester le flux complet
- [ ] Ajouter des toasts de notification
- [ ] Ajouter une animation de chargement
- [ ] Tester en production

## Notes

- L'email est envoyé automatiquement lors de la création de la commande
- Les erreurs d'email ne bloquent pas la création de commande
- L'utilisateur reçoit toujours une confirmation même si l'email échoue
- Les logs sont disponibles dans la console du serveur
