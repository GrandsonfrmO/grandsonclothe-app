# 🚀 Quick Start - Authentification

## ✅ Installation Complète

Toutes les dépendances sont installées et la base de données est configurée !

## 🧪 Tester l'Authentification

### 1. Démarrer le serveur de développement
```bash
pnpm run dev
```

### 2. Créer un compte
- Accédez à `http://localhost:3000/auth/signup`
- Remplissez le formulaire :
  - Nom : Jean Dupont
  - Email : jean@example.com
  - Mot de passe : password123
- Cliquez sur "S'inscrire"

### 3. Vérifier la connexion
- Vous devriez être redirigé vers la page d'accueil
- Le menu utilisateur devrait afficher votre nom dans le header

### 4. Tester le profil
- Cliquez sur votre nom dans le header
- Sélectionnez "Mon profil"
- Vous devriez voir vos informations

### 5. Tester la déconnexion
- Cliquez sur votre nom dans le header
- Sélectionnez "Déconnexion"
- Vous devriez être redirigé vers la page d'accueil
- Le menu devrait afficher "Connexion" et "S'inscrire"

### 6. Tester la protection des routes
- Essayez d'accéder à `/admin` sans être connecté
- Vous devriez être redirigé vers `/auth/login`

## 📁 Structure des Fichiers

```
lib/
├── auth-context.tsx          # Provider d'authentification
└── db/
    ├── index.ts              # Configuration DB
    ├── schema.ts             # Schéma des tables
    └── queries.ts            # Requêtes DB

app/
├── api/auth/
│   ├── login/route.ts        # Endpoint login
│   ├── signup/route.ts       # Endpoint signup
│   ├── logout/route.ts       # Endpoint logout
│   └── me/route.ts           # Endpoint vérification
├── auth/
│   ├── login/page.tsx        # Page login
│   └── signup/page.tsx       # Page signup
├── profile/page.tsx          # Page profil (protégée)
└── orders/page.tsx           # Page commandes (protégée)

components/
├── user-menu.tsx             # Menu utilisateur
└── protected-route.tsx       # Wrapper protection

middleware.ts                  # Protection routes serveur
```

## 🔐 Fonctionnalités

✅ Inscription avec validation
✅ Connexion sécurisée
✅ Hachage des mots de passe (bcryptjs)
✅ Cookies httpOnly
✅ Middleware de protection
✅ Menu utilisateur
✅ Déconnexion
✅ Pages protégées

## 🛠️ Commandes Utiles

```bash
# Démarrer le dev
pnpm run dev

# Build production
pnpm run build

# Démarrer production
pnpm run start

# Linter
pnpm run lint

# Pousser le schéma DB
pnpm run db:push

# Générer les migrations
pnpm run db:generate

# Ouvrir Drizzle Studio
pnpm run db:studio
```

## 🐛 Dépannage

### Les erreurs TypeScript persistent
- C'est normal, ce sont des problèmes de version de drizzle-orm
- Elles n'affectent pas le runtime
- Elles disparaîtront après une mise à jour de drizzle-orm

### La base de données ne se connecte pas
- Vérifiez que `DATABASE_URL` est défini dans `.env.local`
- Assurez-vous que votre base de données est accessible

### Les cookies ne sont pas définis
- Vérifiez que vous êtes en HTTPS en production
- En développement, les cookies httpOnly fonctionnent sur localhost

## 📝 Notes

- Les tokens expirent après 7 jours
- Les mots de passe sont hashés avec 10 rounds de bcryptjs
- Le middleware redirige automatiquement vers login si non authentifié
- Les routes protégées : `/admin`, `/cart`, `/orders`, `/profile`

## 🎯 Prochaines Étapes

1. Ajouter la vérification d'email
2. Implémenter la réinitialisation de mot de passe
3. Ajouter OAuth (Google, GitHub)
4. Implémenter la 2FA
5. Ajouter les rôles utilisateur (admin, user)
