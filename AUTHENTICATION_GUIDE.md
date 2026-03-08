# 📚 Guide Complet de l'Authentification

## 📋 Table des Matières

1. [Architecture](#architecture)
2. [Installation](#installation)
3. [Utilisation](#utilisation)
4. [API Reference](#api-reference)
5. [Sécurité](#sécurité)
6. [Dépannage](#dépannage)

## Architecture

### Flux d'Authentification

```
┌─────────────────────────────────────────────────────────────┐
│                    Utilisateur                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Page Login/Signup     │
        │  (Client Component)    │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  useAuth() Hook        │
        │  (Auth Context)        │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  API Routes            │
        │  /api/auth/*           │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Database              │
        │  (Postgres)            │
        └────────────────────────┘
```

### Composants Clés

1. **AuthContext** (`lib/auth-context.tsx`)
   - Gère l'état global d'authentification
   - Fournit le hook `useAuth()`
   - Méthodes : login, signup, logout

2. **Routes API** (`app/api/auth/*`)
   - `/login` - Authentification
   - `/signup` - Création de compte
   - `/logout` - Déconnexion
   - `/me` - Vérification de session

3. **Middleware** (`middleware.ts`)
   - Protège les routes côté serveur
   - Redirige vers login si non authentifié

4. **Composants UI**
   - `UserMenu` - Menu utilisateur dans le header
   - `ProtectedRoute` - Wrapper pour pages protégées

## Installation

### 1. Dépendances

```bash
pnpm install
```

Packages ajoutés :
- `bcryptjs` - Hachage des mots de passe

### 2. Configuration Base de Données

```bash
pnpm run db:push
```

Crée les tables nécessaires (users, orders, etc.)

### 3. Variables d'Environnement

Créez `.env.local` :

```env
DATABASE_URL=postgresql://user:password@localhost:5432/grandson
NODE_ENV=development
```

## Utilisation

### Utiliser le Hook useAuth()

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';

export function MyComponent() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  if (loading) return <p>Chargement...</p>;

  if (isAuthenticated) {
    return (
      <div>
        <p>Bienvenue {user?.name}</p>
        <button onClick={logout}>Déconnexion</button>
      </div>
    );
  }

  return <p>Non connecté</p>;
}
```

### Protéger une Page

```tsx
'use client';

import { ProtectedRoute } from '@/components/protected-route';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <h1>Tableau de Bord Admin</h1>
      {/* Contenu protégé */}
    </ProtectedRoute>
  );
}
```

### Redirection Conditionnelle

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  return <div>Contenu protégé</div>;
}
```

## API Reference

### POST /api/auth/login

Authentifie un utilisateur.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `400` - Email ou mot de passe manquant
- `401` - Identifiants invalides
- `500` - Erreur serveur

### POST /api/auth/signup

Crée un nouvel utilisateur.

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `400` - Données manquantes ou invalides
- `409` - Email déjà existant
- `500` - Erreur serveur

### POST /api/auth/logout

Déconnecte l'utilisateur.

**Response (200):**
```json
{
  "message": "Logged out"
}
```

### GET /api/auth/me

Retourne l'utilisateur actuellement connecté.

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

Ou si non connecté :
```json
{
  "user": null
}
```

## Sécurité

### Hachage des Mots de Passe

Les mots de passe sont hashés avec bcryptjs (10 rounds) :

```typescript
const hashedPassword = await bcrypt.hash(password, 10);
```

### Cookies httpOnly

Les tokens sont stockés dans des cookies httpOnly :

```typescript
response.cookies.set('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 jours
});
```

### Middleware de Protection

Le middleware protège les routes côté serveur :

```typescript
const protectedRoutes = ['/admin', '/cart', '/orders'];

if (isProtectedRoute && !token) {
  return NextResponse.redirect(new URL('/auth/login', request.url));
}
```

### Validation des Données

Toutes les entrées sont validées :

```typescript
if (!email || !password) {
  return NextResponse.json(
    { message: 'Email and password required' },
    { status: 400 }
  );
}
```

## Dépannage

### Erreur : "Cannot find module 'bcryptjs'"

**Solution :** Réinstallez les dépendances
```bash
pnpm install
```

### Erreur : "DATABASE_URL is not defined"

**Solution :** Vérifiez que `.env.local` contient `DATABASE_URL`

### Les cookies ne sont pas définis

**Causes possibles :**
- En production, HTTPS est requis
- Le domaine n'est pas correct
- Les cookies sont bloqués par le navigateur

**Solution :** Vérifiez les paramètres des cookies dans `app/api/auth/login/route.ts`

### La redirection ne fonctionne pas

**Solution :** Assurez-vous que le middleware est activé dans `next.config.mjs`

### L'utilisateur reste connecté après fermeture du navigateur

**Comportement normal :** Les cookies httpOnly persistent jusqu'à expiration (7 jours)

**Pour forcer la déconnexion :** Appelez `/api/auth/logout`

## Exemples Complets

### Formulaire de Connexion Personnalisé

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      <button type="submit">Se connecter</button>
    </form>
  );
}
```

### Affichage Conditionnel

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';

export function Header() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <p>Bienvenue {user?.name}</p>
      ) : (
        <p>Veuillez vous connecter</p>
      )}
    </header>
  );
}
```

## Prochaines Étapes

- [ ] Ajouter la vérification d'email
- [ ] Implémenter la réinitialisation de mot de passe
- [ ] Ajouter OAuth (Google, GitHub)
- [ ] Implémenter la 2FA
- [ ] Ajouter les rôles utilisateur
- [ ] Implémenter le refresh token
- [ ] Ajouter les logs d'authentification
