# ⚡ DÉPLOIEMENT VERCEL - VERSION ULTRA RAPIDE

**Durée:** 15 minutes | **Complexité:** Très facile

---

## 🎯 3 ÉTAPES SEULEMENT

### ✅ ÉTAPE 1: Préparer le Code (3 min)

```bash
npm install jsonwebtoken
git add .
git commit -m "Deploy: Ready for Vercel"
git push origin main
```

**C'est tout!** ✅

---

### ✅ ÉTAPE 2: Créer le Projet sur Vercel (5 min)

1. Allez sur **[vercel.com](https://vercel.com)**
2. Cliquez **"Add New"** → **"Project"**
3. Sélectionnez **"grandsonclothe-app"**
4. Cliquez **"Import"**

**C'est tout!** ✅

---

### ✅ ÉTAPE 3: Ajouter les Variables (5 min)

Cliquez **"Environment Variables"** et collez:

```
DATABASE_URL=postgresql://[votre-url-neon]
NODE_ENV=production
RESEND_API_KEY=re_[votre-clé]
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

Puis cliquez **"Deploy"**

**C'est tout!** ✅

---

## 🔑 OÙ TROUVER LES CLÉS

### DATABASE_URL
- [neon.tech](https://neon.tech) → Votre projet → "Connection string"

### RESEND_API_KEY
- [resend.com](https://resend.com) → "API Keys"

---

## ✨ RÉSULTAT

Après 15 minutes:
- ✅ Site en ligne
- ✅ URL: `https://grandsonclothe-app.vercel.app`
- ✅ Déploiement automatique à chaque push

---

## 🧪 TESTER

```
https://grandsonclothe-app.vercel.app
```

- Inscription
- Login
- Panier
- Checkout

---

**C'est prêt!** 🚀
