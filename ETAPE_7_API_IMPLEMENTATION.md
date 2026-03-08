# TAPE 7 : IMPLÉMENTATION DES APIs 🔌

## APIs à implémenter

### 1. PUT `/api/auth/profile` - Mise à jour du profil

**Endpoint:** `PUT /api/auth/profile`

**Request:**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "address": "123 Rue de la Paix, 75000 Paris",
  "phone": "+33 6 12 34 56 78"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Jean Dupont",
    "email": "jean@example.com"
  }
}
```

**Erreurs:**
- 400: Email déjà utilisé
- 401: Non authentifié
- 500: Erreur serveur

**Implémentation (app/api/auth/profile/route.ts):**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification (via session/JWT)
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, address, phone } = body;

    // Vérifier si l'email est déjà utilisé
    if (email) {
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      
      if (existing.length > 0 && existing[0].id !== parseInt(userId)) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour l'utilisateur
    const updated = await db
      .update(users)
      .set({
        name: name || undefined,
        email: email || undefined,
        updatedAt: new Date(),
      })
      .where(eq(users.id, parseInt(userId)))
      .returning();

    return NextResponse.json({
      success: true,
      user: updated[0],
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
```

---

### 2. PUT `/api/auth/password` - Changement de mot de passe

**Endpoint:** `PUT /api/auth/password`

**Request:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Erreurs:**
- 400: Mot de passe actuel incorrect
- 400: Nouveau mot de passe trop court
- 401: Non authentifié
- 500: Erreur serveur

**Implémentation (app/api/auth/password/route.ts):**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(userId)));

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Vérifier le mot de passe actuel
    const isValid = await bcrypt.compare(currentPassword, user[0].password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, parseInt(userId)));

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
```

---

### 3. PUT `/api/auth/preferences` - Mise à jour des préférences

**Endpoint:** `PUT /api/auth/preferences`

**Request:**
```json
{
  "newsletter": true,
  "notifications": true,
  "smsUpdates": false
}
```

**Response (200):**
```json
{
  "success": true,
  "preferences": {
    "newsletter": true,
    "notifications": true,
    "smsUpdates": false
  }
}
```

**Note:** Nécessite une table `user_preferences` dans la base de données.

**Schéma à ajouter:**
```typescript
export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).unique(),
  newsletter: boolean('newsletter').default(true),
  notifications: boolean('notifications').default(true),
  smsUpdates: boolean('sms_updates').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

---

### 4. POST `/api/orders/{id}/return` - Demande de retour

**Endpoint:** `POST /api/orders/{id}/return`

**Request:**
```json
{
  "reason": "defective",
  "comment": "Le produit est arrivé endommagé"
}
```

**Response (201):**
```json
{
  "success": true,
  "return": {
    "id": 1,
    "orderId": 123,
    "reason": "defective",
    "status": "pending",
    "createdAt": "2024-03-08T10:00:00Z"
  }
}
```

**Schéma à ajouter:**
```typescript
export const orderReturns = pgTable('order_returns', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id),
  reason: varchar('reason', { length: 100 }),
  comment: text('comment'),
  status: pgEnum('return_status', ['pending', 'approved', 'rejected', 'refunded'])('status').default('pending'),
  refundAmount: decimal('refund_amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

---

### 5. DELETE `/api/auth/account` - Suppression de compte

**Endpoint:** `DELETE /api/auth/account`

**Request:**
```json
{
  "password": "userPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Implémentation (app/api/auth/account/route.ts):**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, orders, cart } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { password } = body;

    // Récupérer l'utilisateur
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(userId)));

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Password is incorrect' },
        { status: 400 }
      );
    }

    // Supprimer les données de l'utilisateur
    await db.delete(cart).where(eq(cart.userId, parseInt(userId)));
    await db.delete(users).where(eq(users.id, parseInt(userId)));

    // Note: Les commandes sont conservées pour l'historique

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
```

---

## Mise à jour des pages pour utiliser les APIs

### app/profile/settings/page.tsx

```typescript
const handleProfileSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading2(true);
  setMessage('');
  setError('');

  try {
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error);
    }

    setMessage('Profil mis à jour avec succès');
    setTimeout(() => setMessage(''), 3000);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
  } finally {
    setLoading2(false);
  }
};
```

---

## Checklist d'implémentation

- [ ] Créer `app/api/auth/profile/route.ts`
- [ ] Créer `app/api/auth/password/route.ts`
- [ ] Créer `app/api/auth/preferences/route.ts`
- [ ] Créer `app/api/orders/[id]/return/route.ts`
- [ ] Créer `app/api/auth/account/route.ts`
- [ ] Ajouter table `user_preferences` au schéma
- [ ] Ajouter table `order_returns` au schéma
- [ ] Mettre à jour les pages pour appeler les APIs
- [ ] Tester tous les endpoints
- [ ] Ajouter la validation côté serveur
- [ ] Ajouter les logs d'audit

---

## Sécurité

✅ **À implémenter:**
- Vérification de l'authentification (middleware)
- Validation des données côté serveur
- Hachage des mots de passe (bcrypt)
- Limitation de débit (rate limiting)
- Logs d'audit pour les suppressions de compte
- Confirmation par email pour les changements critiques

---

## Tests

```bash
# Test de mise à jour du profil
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"name":"Jean Dupont","email":"jean@example.com"}'

# Test de changement de mot de passe
curl -X PUT http://localhost:3000/api/auth/password \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"currentPassword":"old","newPassword":"new123456"}'
```
