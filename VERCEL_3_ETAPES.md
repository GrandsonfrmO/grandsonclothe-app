# 🚀 DÉPLOYER SUR VERCEL EN 3 ÉTAPES

---

## ✅ ÉTAPE 1: CODE POUSSÉ ✓

```bash
✓ Tous les fichiers sont sur GitHub
✓ Build réussie
✓ Prêt à déployer
```

---

## 🎯 ÉTAPE 2: ALLER SUR VERCEL

### **1. Ouvrir Vercel**
👉 Allez sur: **https://vercel.com**

### **2. Se connecter**
- Cliquez sur **"Login"**
- Choisissez **"Continue with GitHub"**

### **3. Créer un projet**
- Cliquez sur **"Add New..."** (en haut à droite)
- Cliquez sur **"Project"**

### **4. Importer le repository**
- Cherchez **"grandsonclothe-app"**
- Cliquez sur **"Import"**

---

## ⚙️ ÉTAPE 3: CONFIGURER ET DÉPLOYER

### **1. Configuration automatique**
Vercel détecte Next.js automatiquement ✓

### **2. Ajouter les variables d'environnement**

Cliquez sur **"Environment Variables"** et ajoutez ces 4 variables:

#### Variable 1: DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_HEXaY3j1xPKy@ep-morning-king-abp97nic-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
```

#### Variable 2: NODE_ENV
```
Name: NODE_ENV
Value: production
```

#### Variable 3: RESEND_API_KEY
```
Name: RESEND_API_KEY
Value: re_2a336QZ6_PhyvxG1bSWnxwv2KfxvuwqSL
```

#### Variable 4: RESEND_FROM_EMAIL
```
Name: RESEND_FROM_EMAIL
Value: papicamara22@gmail.com
```

### **3. Déployer**
- Cliquez sur **"Deploy"** (en bas)
- Attendez 2-3 minutes ⏳
- C'est fait! 🎉

---

## 🎉 RÉSULTAT

Votre site sera accessible à:
```
https://grandsonclothe-app.vercel.app
```

---

## ✅ TESTER LE SITE

Une fois déployé, testez:
- [ ] Page d'accueil
- [ ] Inscription
- [ ] Login
- [ ] Ajouter au panier
- [ ] Checkout

---

## 🔧 SI PROBLÈME

### Le site ne charge pas?
1. Allez dans **"Deployments"**
2. Cliquez sur votre déploiement
3. Regardez les **"Function Logs"**

### Erreur de base de données?
1. Vérifiez que DATABASE_URL est correct
2. Allez sur Neon.tech
3. Vérifiez que la base de données est active

---

**C'est tout!** Votre site est maintenant en ligne! 🚀
