# 🔐 Système d'Authentification GRANDSON CLOTHES

## 📌 Vue d'Ensemble

Système d'authentification complet et sécurisé pour l'application GRANDSON CLOTHES, incluant :

- ✅ Inscription et connexion
- ✅ Gestion de session
- ✅ Protection des routes
- ✅ Menu utilisateur
- ✅ Hachage sécurisé des mots de passe
- ✅ Cookies httpOnly

## 🚀 Démarrage Rapide

### 1. Installation
```bash
pnpm install
```

### 2. Configuration
```bash
pnpm run db:push
```

### 3. Démarrage
```bash
pnpm run dev
```

### 4. Test
- Accédez à `http://localhost:3000/auth/signup`
- Créez un compte
- Vérifiez le menu utilisateur

## 📁 Structure

```
lib/
├── auth-context.tsx          # Provider d'authentification
└── db/
    ├── index.ts              # Configuration DB
    ├── schema.ts             # Schéma des tables
    └── queries.ts            # Requêtes DB

app/
├── api/auth/
│   ├── login/route.ts        # POST /api/auth/login
│   ├── signup/route.ts       # POST /api/auth/signup
│   ├── logout/route.ts       # POST /api/auth/logout
│   └── me/route.ts           # GET /api/auth/me
├── auth/
│   ├── login/page.tsx        # Page /auth/login
│   └── signup/page.tsx       # Page /auth/signup
├── profile/page.tsx          # Page /profile (protégée)
└── orders/page.tsx           # Page /orders (protégée)

components/
├── user-menu.tsx             # Menu utilisateur
├── protected-route.tsx       # Wrapper de protection
└── auth-test.tsx             # Composant de test

middleware.ts                  # Protection côté serveur
```

## 🔑 Utilisation

### Hook useAuth()

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
    </ProtectedRoute>
  );
}
```

## 🔐 Sécurité

### Hachage des Mots de Passe
- Algorithme : bcryptjs
- Rounds : 10
- Jamais stocké en clair

### Cookies
- Type : httpOnly
- Secure : true (production)
- SameSite : lax
- Expiration : 7 jours

### Validation
- Données d'entrée validées
- Erreurs génériques (pas de révélation d'info)
- Protection CSRF

## 📚 Documentation

- `QUICK_START.md` - Guide de démarrage
- `AUTHENTICATION_GUIDE.md` - Guide complet
- `API_TEST.md` - Tests de l'API
- `DEPLOYMENT_CHECKLIST.md` - Checklist de déploiement

## 🧪 Tests

### Tester l'API

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Me
curl -X GET http://localhost:3000/api/auth/me

# Logout
curl -X POST http://localhost:3000/api/auth/logout
```

## 🛠️ Commandes

```bash
# Démarrage
pnpm run dev          # Développement
pnpm run build        # Build production
pnpm run start        # Production

# Base de données
pnpm run db:push      # Appliquer les migrations
pnpm run db:generate  # Générer les migrations
pnpm run db:studio    # Ouvrir Drizzle Studio

# Linting
pnpm run lint         # Vérifier le code
```

## 📊 Routes Protégées

| Route | Protection | Description |
|-------|-----------|-------------|
| `/admin/*` | Middleware | Tableau de bord admin |
| `/cart` | Middleware | Panier |
| `/orders` | Middleware | Commandes |
| `/profile` | Client | Profil utilisateur |

## 🔄 Flux d'Authentification

```
Utilisateur
    ↓
Page Login/Signup
    ↓
useAuth() Hook
    ↓
API Route (/api/auth/*)
    ↓
Database (Postgres)
    ↓
Cookie (auth_token)
    ↓
AuthContext (user state)
    ↓
Protected Routes
```

## 🎯 Endpoints API

### POST /api/auth/signup
Créer un compte

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

### POST /api/auth/login
Se connecter

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

### POST /api/auth/logout
Se déconnecter

**Response (200):**
```json
{
  "message": "Logged out"
}
```

### GET /api/auth/me
Vérifier la session

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

## 🐛 Dépannage

### Erreur : "Cannot find module 'bcryptjs'"
```bash
pnpm install
```

### Erreur : "DATABASE_URL is not defined"
Vérifiez que `.env.local` contient `DATABASE_URL`

### Les cookies ne sont pas définis
En production, HTTPS est requis

### La redirection ne fonctionne pas
Vérifiez que le middleware est activé

## 📞 Support

Pour toute question ou problème :

1. Consultez la documentation
2. Vérifiez les logs
3. Testez en local
4. Contactez le support

## 📝 Changelog

### v1.0.0 (Initial)
- ✅ Signup/Login/Logout
- ✅ Auth Context
- ✅ Protection des routes
- ✅ Menu utilisateur
- ✅ Hachage des mots de passe
- ✅ Cookies httpOnly

## 🎓 Prochaines Étapes

- [ ] Vérification d'email
- [ ] Réinitialisation de mot de passe
- [ ] OAuth (Google, GitHub)
- [ ] 2FA
- [ ] Rôles utilisateur
- [ ] Refresh tokens

---

**Système d'authentification prêt pour la production !** 🚀
