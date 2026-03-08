# 🧪 Test de l'API d'Authentification

## Prérequis

- Serveur de développement en cours d'exécution : `pnpm run dev`
- Postman, Insomnia, ou curl

## 1️⃣ Créer un Compte (Signup)

### Request
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'
```

### Response (201)
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### Erreurs Possibles
- `400` - Données manquantes
- `409` - Email déjà existant

---

## 2️⃣ Se Connecter (Login)

### Request
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Response (200)
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

**Note:** Un cookie `auth_token` est défini automatiquement

### Erreurs Possibles
- `400` - Email ou mot de passe manquant
- `401` - Identifiants invalides

---

## 3️⃣ Vérifier la Session (Me)

### Request
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: auth_token={token}"
```

### Response (200)
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

Ou si non connecté :
```json
{
  "user": null
}
```

---

## 4️⃣ Se Déconnecter (Logout)

### Request
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: auth_token={token}"
```

### Response (200)
```json
{
  "message": "Logged out"
}
```

**Note:** Le cookie `auth_token` est supprimé

---

## 📝 Scénario de Test Complet

### 1. Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "password": "SecurePass123"
  }'
```

### 2. Vérifier la Connexion
```bash
curl -X GET http://localhost:3000/api/auth/me
```

### 3. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout
```

### 4. Vérifier après Logout
```bash
curl -X GET http://localhost:3000/api/auth/me
```

---

## 🔍 Validation des Données

### Signup - Données Invalides

**Email manquant:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "password": "password123"
  }'
```

Response (400):
```json
{
  "message": "Email, name, and password required"
}
```

**Mot de passe trop court:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "password": "123"
  }'
```

Response (400):
```json
{
  "message": "Password must be at least 6 characters"
}
```

**Email déjà existant:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "password": "password123"
  }'
```

Response (409):
```json
{
  "message": "Email already exists"
}
```

---

## 🔐 Test de Sécurité

### 1. Vérifier le Hachage du Mot de Passe

Les mots de passe ne sont jamais retournés en clair.

Response de login/signup :
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
    // ❌ Pas de "password" ici
  }
}
```

### 2. Vérifier les Cookies httpOnly

Les cookies sont définis avec le flag `httpOnly` :

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Cherchez dans les headers :
```
Set-Cookie: auth_token=...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

### 3. Tester les Identifiants Invalides

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrongpassword"
  }'
```

Response (401):
```json
{
  "message": "Invalid credentials"
}
```

---

## 🧩 Test avec Postman

### 1. Créer une Collection "Auth Tests"

### 2. Ajouter les Requêtes

**Signup:**
- Method: POST
- URL: `http://localhost:3000/api/auth/signup`
- Body (JSON):
```json
{
  "email": "{{email}}",
  "name": "{{name}}",
  "password": "{{password}}"
}
```

**Login:**
- Method: POST
- URL: `http://localhost:3000/api/auth/login`
- Body (JSON):
```json
{
  "email": "{{email}}",
  "password": "{{password}}"
}
```

**Me:**
- Method: GET
- URL: `http://localhost:3000/api/auth/me`

**Logout:**
- Method: POST
- URL: `http://localhost:3000/api/auth/logout`

### 3. Utiliser les Variables

Définissez les variables d'environnement :
- `email`: test@example.com
- `name`: Test User
- `password`: password123

---

## ✅ Checklist de Test

- [ ] Signup avec données valides
- [ ] Signup avec email déjà existant
- [ ] Signup avec mot de passe trop court
- [ ] Login avec identifiants valides
- [ ] Login avec identifiants invalides
- [ ] Vérifier la session après login
- [ ] Logout
- [ ] Vérifier la session après logout
- [ ] Vérifier que les mots de passe ne sont pas retournés
- [ ] Vérifier les cookies httpOnly

---

## 🐛 Dépannage

### Erreur : "Cannot POST /api/auth/signup"

**Cause:** Le serveur n'est pas en cours d'exécution

**Solution:**
```bash
pnpm run dev
```

### Erreur : "DATABASE_URL is not defined"

**Cause:** `.env.local` n'est pas configuré

**Solution:** Vérifiez que `DATABASE_URL` est défini dans `.env.local`

### Erreur : "Internal server error"

**Cause:** Problème de base de données

**Solution:**
1. Vérifiez la connexion à la BD
2. Vérifiez que les tables existent : `pnpm run db:push`
3. Consultez les logs du serveur

---

## 📊 Résumé des Endpoints

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/auth/signup` | POST | Créer un compte | ❌ |
| `/api/auth/login` | POST | Se connecter | ❌ |
| `/api/auth/logout` | POST | Se déconnecter | ✅ |
| `/api/auth/me` | GET | Vérifier la session | ✅ |

---

## 🎯 Prochaines Étapes

1. Tester les pages UI (`/auth/login`, `/auth/signup`)
2. Tester la protection des routes (`/admin`, `/profile`)
3. Tester le menu utilisateur dans le header
4. Tester la redirection automatique
