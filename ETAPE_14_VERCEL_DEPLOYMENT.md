# 🚀 ÉTAPE 14.3: VERCEL DEPLOYMENT GUIDE

**Durée:** 15 min | **Format:** Pas à pas

---

## 🎯 Objectif

Déployer l'application sur Vercel et la rendre accessible en production.

---

## 📋 PRÉ-REQUIS

Avant de commencer, vérifiez que vous avez:

- [ ] Un compte GitHub
- [ ] Un compte Vercel (gratuit)
- [ ] Votre code poussé sur GitHub
- [ ] Une base de données PostgreSQL (Neon)
- [ ] L'URL de la base de données (DATABASE_URL)

---

## 🔧 ÉTAPE 1: PRÉPARER LE CODE (5 min)

### 1.1 Vérifier que tout est commité

```bash
# Voir le statut
git status

# Ajouter tous les fichiers
git add .

# Commiter
git commit -m "ÉTAPE 14: Tests et déploiement"

# Pousser vers GitHub
git push origin main
```

✅ **Vérifier:** Tous les fichiers sont poussés sur GitHub

### 1.2 Vérifier les variables d'environnement

```bash
# Vérifier que .env.local existe
cat .env.local

# Vérifier que DATABASE_URL est défini
echo $DATABASE_URL
```

✅ **Vérifier:** DATABASE_URL est défini

### 1.3 Vérifier que le build fonctionne

```bash
# Build le projet
npm run build

# Vérifier qu'il n'y a pas d'erreurs
npm run lint
```

✅ **Vérifier:** Build réussie, pas d'erreurs

---

## 🌐 ÉTAPE 2: CRÉER UN PROJET VERCEL (5 min)

### 2.1 Accédez à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up" si vous n'avez pas de compte
3. Connectez-vous avec GitHub

### 2.2 Importer le projet

1. Cliquez sur "Add New..." en haut à gauche
2. Sélectionnez "Project"
3. Cliquez sur "Continue with GitHub"
4. Sélectionnez votre repo dans la liste
5. Cliquez sur "Import"

✅ **Vérifier:** Projet importé avec succès

### 2.3 Configurer le projet

Dans la page "Configure Project":

1. **Project Name:** Gardez le nom par défaut ou changez-le
2. **Framework Preset:** Sélectionnez "Next.js"
3. **Root Directory:** Laissez vide (ou `.` si demandé)
4. **Build Command:** Laissez par défaut (`npm run build`)
5. **Output Directory:** Laissez par défaut (`.next`)
6. **Install Command:** Laissez par défaut (`npm install`)

✅ **Vérifier:** Configuration correcte

---

## 🔐 ÉTAPE 3: CONFIGURER LES VARIABLES D'ENVIRONNEMENT (3 min)

### 3.1 Ajouter les variables

1. Cliquez sur "Environment Variables"
2. Ajoutez les variables suivantes:

#### Variable 1: DATABASE_URL

```
Name: DATABASE_URL
Value: postgresql://user:password@host:5432/database
```

**Où trouver cette valeur:**
- Si vous utilisez Neon: Allez sur [neon.tech](https://neon.tech)
- Connectez-vous à votre compte
- Sélectionnez votre projet
- Cliquez sur "Connection string"
- Copiez l'URL PostgreSQL

#### Variable 2: NODE_ENV

```
Name: NODE_ENV
Value: production
```

#### Variable 3: NEXT_PUBLIC_API_URL (optionnel)

```
Name: NEXT_PUBLIC_API_URL
Value: https://your-vercel-url.vercel.app
```

**Note:** Vous pouvez ajouter cette variable après le déploiement

### 3.2 Ajouter d'autres variables si nécessaire

Si vous avez d'autres variables d'environnement (ex: Resend API key):

```
Name: RESEND_API_KEY
Value: re_xxxxxxxxxxxxx
```

✅ **Vérifier:** Toutes les variables sont ajoutées

---

## 🚀 ÉTAPE 4: DÉPLOYER (2 min)

### 4.1 Cliquer sur "Deploy"

1. Vérifiez que toutes les variables sont configurées
2. Cliquez sur le bouton "Deploy" en bas à droite
3. Attendez que le déploiement commence

### 4.2 Attendre le déploiement

Vercel va:
1. Cloner votre repo
2. Installer les dépendances
3. Builder le projet
4. Déployer sur les serveurs Vercel

Cela prend généralement 2-5 minutes.

✅ **Vérifier:** Déploiement terminé (écran vert avec "Congratulations!")

### 4.3 Copier l'URL de déploiement

1. Cliquez sur "Visit"
2. Votre site s'ouvre dans un nouvel onglet
3. Copiez l'URL (ex: `https://grandson-clothes.vercel.app`)

✅ **Vérifier:** Site accessible via l'URL Vercel

---

## 🔗 ÉTAPE 5: CONFIGURER UN DOMAINE PERSONNALISÉ (optionnel)

### 5.1 Ajouter un domaine

1. Allez sur le dashboard Vercel
2. Sélectionnez votre projet
3. Cliquez sur "Settings"
4. Cliquez sur "Domains"
5. Entrez votre domaine (ex: `grandson-clothes.com`)
6. Cliquez sur "Add"

### 5.2 Configurer les DNS

Vercel va vous donner des instructions pour configurer les DNS chez votre registraire de domaine.

Suivez les instructions pour pointer votre domaine vers Vercel.

✅ **Vérifier:** Domaine configuré et accessible

---

## 🧪 ÉTAPE 6: TESTER EN PRODUCTION (5 min)

### 6.1 Tester les fonctionnalités basiques

1. Ouvrez l'URL Vercel
2. Vérifiez que la page se charge
3. Vérifiez que les produits s'affichent
4. Testez l'inscription
5. Testez le login
6. Testez l'ajout au panier
7. Testez le checkout

### 6.2 Vérifier les logs

1. Allez sur le dashboard Vercel
2. Sélectionnez votre projet
3. Cliquez sur "Deployments"
4. Sélectionnez le dernier déploiement
5. Cliquez sur "Logs"
6. Vérifiez qu'il n'y a pas d'erreurs

### 6.3 Vérifier les erreurs

Si vous voyez des erreurs:

1. Vérifiez les variables d'environnement
2. Vérifiez que la base de données est accessible
3. Vérifiez les logs Vercel
4. Vérifiez la console du navigateur

---

## 🔄 ÉTAPE 7: CONFIGURER LES DÉPLOIEMENTS AUTOMATIQUES

### 7.1 Déploiements automatiques

Par défaut, Vercel déploie automatiquement à chaque push sur `main`.

Pour vérifier:

1. Allez sur le dashboard Vercel
2. Sélectionnez votre projet
3. Cliquez sur "Settings"
4. Cliquez sur "Git"
5. Vérifiez que "Deploy on push" est activé

### 7.2 Déploiements manuels

Pour déployer manuellement:

1. Allez sur le dashboard Vercel
2. Sélectionnez votre projet
3. Cliquez sur "Deployments"
4. Cliquez sur "Redeploy" sur un déploiement précédent

---

## 📊 ÉTAPE 8: MONITORING

### 8.1 Vérifier les performances

1. Allez sur le dashboard Vercel
2. Sélectionnez votre projet
3. Cliquez sur "Analytics"
4. Vérifiez les métriques:
   - Temps de réponse
   - Taux d'erreur
   - Requêtes par seconde

### 8.2 Configurer les alertes

1. Allez sur "Settings"
2. Cliquez sur "Alerts"
3. Configurez les alertes pour:
   - Erreurs 5xx
   - Downtime
   - Performance dégradée

### 8.3 Vérifier les logs

1. Allez sur "Deployments"
2. Sélectionnez un déploiement
3. Cliquez sur "Logs"
4. Vérifiez les erreurs et avertissements

---

## 🔒 SÉCURITÉ

### 8.1 Vérifier HTTPS

- [ ] Site accessible via HTTPS
- [ ] Certificat SSL valide
- [ ] Pas d'avertissements de sécurité

### 8.2 Vérifier les variables d'environnement

- [ ] DATABASE_URL n'est pas exposé
- [ ] Pas de secrets dans le code
- [ ] Pas de secrets dans les logs

### 8.3 Vérifier les cookies

- [ ] Cookies httpOnly activés
- [ ] Cookies Secure activés
- [ ] Cookies SameSite configurés

---

## 🆘 DÉPANNAGE

### Erreur: "Build failed"

```bash
# Vérifier les erreurs de build
npm run build

# Vérifier les erreurs de linting
npm run lint

# Vérifier les erreurs TypeScript
npx tsc --noEmit
```

**Solutions:**
1. Vérifiez les logs Vercel
2. Vérifiez que toutes les dépendances sont installées
3. Vérifiez que les variables d'environnement sont correctes

### Erreur: "DATABASE_URL not found"

**Solutions:**
1. Vérifiez que DATABASE_URL est configuré dans Vercel
2. Vérifiez que la valeur est correcte
3. Redéployez après avoir ajouté la variable

### Erreur: "Database connection failed"

**Solutions:**
1. Vérifiez que DATABASE_URL est correct
2. Vérifiez que la base de données est accessible
3. Vérifiez les logs Neon
4. Vérifiez que les migrations sont appliquées

### Erreur: "Emails not received"

**Solutions:**
1. Vérifiez que Resend API key est configuré
2. Vérifiez que la valeur est correcte
3. Vérifiez les logs Resend
4. Vérifiez que l'email est dans la liste blanche

### Erreur: "500 Internal Server Error"

**Solutions:**
1. Vérifiez les logs Vercel
2. Vérifiez la console du navigateur
3. Vérifiez que toutes les variables d'environnement sont configurées
4. Vérifiez que la base de données est accessible

---

## 📋 CHECKLIST FINALE

### Avant le Déploiement
- [ ] Code poussé sur GitHub
- [ ] Build réussie en local
- [ ] Pas d'erreurs de linting
- [ ] DATABASE_URL configuré

### Déploiement
- [ ] Projet créé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] URL accessible

### Après le Déploiement
- [ ] Site accessible
- [ ] Pas d'erreurs 500
- [ ] Pas d'erreurs dans les logs
- [ ] Base de données connectée
- [ ] Emails fonctionnent
- [ ] Fonctionnalités testées

### Monitoring
- [ ] Analytics configuré
- [ ] Alertes configurées
- [ ] Logs vérifiés
- [ ] Performance acceptable

---

## 📞 RESSOURCES

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Neon Docs](https://neon.tech/docs)

### Support
- [Vercel Support](https://vercel.com/support)
- [Vercel Community](https://vercel.com/community)

---

## 🎯 RÉSUMÉ

| Étape | Durée | Statut |
|-------|-------|--------|
| 1. Préparer le code | 5 min | ⏳ |
| 2. Créer un projet | 5 min | ⏳ |
| 3. Configurer les variables | 3 min | ⏳ |
| 4. Déployer | 2 min | ⏳ |
| 5. Configurer le domaine | - | ⏳ |
| 6. Tester | 5 min | ⏳ |
| **Total** | **15 min** | ⏳ |

---

**Prêt à déployer?** 🚀

Commencez par l'étape 1!
