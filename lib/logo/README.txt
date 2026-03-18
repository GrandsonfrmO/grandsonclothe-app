SYSTÈME DE GESTION DE LOGO
===========================

Ce module fournit un système complet de gestion de logo avec :
- Compression automatique des images
- Génération automatique de favicon
- Historique des versions
- Cache intelligent
- Prévisualisation multi-device

STRUCTURE
---------

lib/
  logo/
    index.ts              - Exports centralisés
  logo-config.ts          - Configuration et validation
  logo-cache.ts           - Gestion du cache
  image-optimizer.ts      - Optimisation d'images

components/admin/
  logo-manager.tsx        - Interface principale
  logo-history-gallery.tsx - Galerie d'historique
  logo-preview-advanced.tsx - Prévisualisation avancée
  logo-recommendations.tsx - Recommandations
  logo-stats-widget.tsx   - Widget de statistiques
  logo-test-panel.tsx     - Panel de tests
  compression-stats.tsx   - Statistiques de compression

hooks/
  use-logo-history.ts     - Hook pour l'historique
  use-image-optimizer.ts  - Hook pour l'optimisation

app/api/settings/logo/
  route.ts                - CRUD des paramètres
  history/route.ts        - Gestion de l'historique
  favicon/route.ts        - Génération de favicon

UTILISATION
-----------

1. Import simple :
   import { LogoManager } from '@/components/admin/logo-manager'

2. Import avec types :
   import type { LogoSettings } from '@/lib/logo'

3. Utilisation des hooks :
   const { optimize, isOptimizing } = useImageOptimizer()

4. Configuration :
   import { LOGO_CONFIG } from '@/lib/logo-config'

API ENDPOINTS
-------------

GET  /api/settings/logo          - Récupérer les paramètres (public)
POST /api/settings/logo          - Mettre à jour (admin)
GET  /api/settings/logo/history  - Historique (admin)
DELETE /api/settings/logo/history?id=X - Supprimer (admin)

SCRIPTS NPM
-----------

npm run migrate:logo:apply  - Appliquer la migration
npm run check:logo          - Vérifier la table

CONFIGURATION
-------------

Voir LOGO_CONFIG dans lib/logo-config.ts pour :
- Tailles max/min
- Formats acceptés
- Paramètres d'optimisation
- Configuration du cache

TESTS
-----

Utiliser le composant LogoTestPanel pour vérifier :
- Accessibilité des API
- Modules d'optimisation
- Génération de favicon
- Historique

PERFORMANCE
-----------

- Compression : ~500ms
- Favicon : ~200ms
- Cache : 60s TTL
- Historique : 20 entrées max

SÉCURITÉ
--------

- Auth admin requise pour modifications
- Validation des types de fichiers
- Limite de taille (5MB)
- Sanitization des URLs
