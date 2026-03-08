# Configuration de l'Authentification 🔐

## Vue d'ensemble

L'authentification a été implémentée avec les fonctionnalités suivantes :

### 1. **Auth Context** (`lib/auth-context.tsx`)
- Gestion centralisée de l'état d'authentification
- Hook `useAuth()` pour accéder aux données utilisateur
- Méthodes : `login()`, `signup()`, `logout()`

### 2. **Routes API**

#### `/api/auth/login` (POST)
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
Retourne l'utilisateur et définit un cookie `auth_token`

#### `/api/auth/signup` (POST)
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```
Crée un nouvel utilisateur et le connecte automatiquement

#### `/api/auth/logout` (POST)
Supprime le cookie d'authentification

#### `/api/auth/me` (GET)
Retourne l'utilisateur actuellement connecté

### 3. **Pages d'Authentification**

- `/app/auth/login` - Formulaire de connexion
- `/app/auth/signup` - Formulaire d'inscription

### 4. **Middleware** (`middleware.ts`)

Protège les routes suivantes :
- `/admin/*` - Tableau de bord administrateur
- `/cart` - Panier
- `/orders` - Commandes
- `/profile` - Profil utilisateur

Redirige automatiquement vers `/auth/login` si non authentifié.

### 5. **Composants**

#### `UserMenu` (`components/user-menu.tsx`)
Menu déroulant dans le header avec :
- Affichage du nom et email
- Lien vers le profil
- Lien vers les commandes
- Bouton de déconnexion

#### `ProtectedRoute` (`components/protected-route.tsx`)
Composant wrapper pour protéger les pages côté client

### 6. **Pages Protégées**

- `/profile` - Affiche les informations de l'utilisateur
- `/orders` - Liste les commandes de l'utilisateur

## Installation

1. Installer les dépendances :
```bash
npm install
# ou
pnpm install
```

2. Configurer les variables d'environnement dans `.env.local` :
```
DATABASE_URL=your_database_url
```

3. Exécuter les migrations de base de données :
```bash
npm run db:push
```

## Utilisation

### Dans un composant
```tsx
'use client';

import { useAuth } from '@/lib/auth-context';

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Non connecté</p>;
  }

  return (
    <div>
      <p>Bienvenue {user?.name}</p>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

### Protéger une page
```tsx
'use client';

import { ProtectedRoute } from '@/components/protected-route';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div>Contenu admin</div>
    </ProtectedRoute>
  );
}
```

## Sécurité

- Les mots de passe sont hashés avec bcryptjs
- Les tokens sont stockés dans des cookies httpOnly
- Le middleware protège les routes côté serveur
- Les routes API valident les données d'entrée

## Prochaines étapes

- [ ] Ajouter la vérification du rôle admin
- [ ] Implémenter la réinitialisation de mot de passe
- [ ] Ajouter l'authentification OAuth (Google, GitHub)
- [ ] Implémenter la vérification d'email
- [ ] Ajouter la 2FA (authentification à deux facteurs)
