# 🚀 Checklist de Déploiement

## ✅ Avant le Déploiement

### 1. Vérification du Code

- [ ] Build réussie : `pnpm run build`
- [ ] Pas d'erreurs critiques
- [ ] Linter passe : `pnpm run lint`
- [ ] Tests passent (si applicable)

### 2. Configuration

- [ ] `.env.local` configuré avec `DATABASE_URL`
- [ ] `NODE_ENV=production` en production
- [ ] Secrets sécurisés (pas dans le repo)

### 3. Base de Données

- [ ] Migrations appliquées : `pnpm run db:push`
- [ ] Tables créées (users, orders, etc.)
- [ ] Backups effectués

### 4. Sécurité

- [ ] Mots de passe hashés (bcryptjs)
- [ ] Cookies httpOnly activés
- [ ] HTTPS en production
- [ ] CORS configuré si nécessaire
- [ ] Rate limiting en place (optionnel)

### 5. Tests

- [ ] Signup fonctionne
- [ ] Login fonctionne
- [ ] Logout fonctionne
- [ ] Routes protégées redirigent vers login
- [ ] Menu utilisateur s'affiche
- [ ] Cookies sont définis

## 🌐 Déploiement sur Vercel

### 1. Préparation

```bash
# Vérifier que tout est commité
git status

# Pousser vers GitHub
git push origin main
```

### 2. Configuration Vercel

1. Accédez à [vercel.com](https://vercel.com)
2. Connectez votre repo GitHub
3. Configurez les variables d'environnement :
   - `DATABASE_URL` - URL de la base de données
   - `NODE_ENV` - production

### 3. Déploiement

```bash
# Vercel déploie automatiquement à chaque push
# Ou déployez manuellement via le dashboard
```

### 4. Vérification Post-Déploiement

- [ ] Site accessible
- [ ] Signup fonctionne
- [ ] Login fonctionne
- [ ] Cookies définis correctement
- [ ] Pas d'erreurs dans les logs

## 🐳 Déploiement avec Docker

### 1. Créer un Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]
```

### 2. Créer un .dockerignore

```
node_modules
.next
.git
.env.local
```

### 3. Build et Run

```bash
docker build -t grandson-app .
docker run -p 3000:3000 -e DATABASE_URL=... grandson-app
```

## 🔒 Sécurité en Production

### 1. Variables d'Environnement

```env
DATABASE_URL=postgresql://user:password@host:5432/grandson
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### 2. HTTPS

- [ ] Certificat SSL/TLS configuré
- [ ] Redirection HTTP → HTTPS
- [ ] Cookies Secure flag activé

### 3. Authentification

- [ ] Mots de passe forts (min 8 caractères)
- [ ] Rate limiting sur les endpoints auth
- [ ] Logs d'authentification
- [ ] Alertes sur les tentatives échouées

### 4. Base de Données

- [ ] Backups réguliers
- [ ] Chiffrement des données sensibles
- [ ] Accès restreint
- [ ] Monitoring

## 📊 Monitoring

### 1. Logs

- [ ] Logs d'authentification
- [ ] Logs d'erreurs
- [ ] Logs de performance

### 2. Alertes

- [ ] Erreurs 5xx
- [ ] Tentatives de login échouées
- [ ] Downtime

### 3. Métriques

- [ ] Temps de réponse
- [ ] Taux d'erreur
- [ ] Utilisateurs actifs

## 🔄 Mise à Jour

### 1. Avant la Mise à Jour

```bash
# Backup de la BD
pnpm run db:backup

# Vérifier les migrations
pnpm run db:generate
```

### 2. Mise à Jour

```bash
# Mettre à jour les dépendances
pnpm update

# Appliquer les migrations
pnpm run db:push

# Build et test
pnpm run build
pnpm run dev
```

### 3. Après la Mise à Jour

- [ ] Tests passent
- [ ] Pas de régressions
- [ ] Performance acceptable

## 🆘 Rollback

### Si Quelque Chose Casse

```bash
# Revenir à la version précédente
git revert <commit>

# Ou restaurer depuis un backup
pnpm run db:restore
```

## 📋 Checklist Finale

- [ ] Code testé et validé
- [ ] Build réussie
- [ ] Variables d'environnement configurées
- [ ] Base de données prête
- [ ] HTTPS activé
- [ ] Monitoring en place
- [ ] Backups configurés
- [ ] Documentation à jour
- [ ] Équipe informée
- [ ] Plan de rollback en place

## 🎯 Après le Déploiement

1. **Monitoring**
   - Surveiller les logs
   - Vérifier les métriques
   - Répondre aux alertes

2. **Support**
   - Répondre aux problèmes utilisateurs
   - Corriger les bugs
   - Optimiser les performances

3. **Maintenance**
   - Mettre à jour les dépendances
   - Appliquer les patches de sécurité
   - Nettoyer les données obsolètes

## 📞 Support

En cas de problème :

1. Vérifiez les logs
2. Consultez la documentation
3. Testez en local
4. Contactez le support

---

**Prêt pour le déploiement !** 🚀
