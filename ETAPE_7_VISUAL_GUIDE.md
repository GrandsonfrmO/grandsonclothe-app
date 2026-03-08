# 🎨 TAPE 7 : GUIDE VISUEL

## 📱 Flux de navigation

```
┌─────────────────────────────────────────────────────────┐
│                    ACCUEIL (/)                          │
│                                                         │
│  [Menu] → Mon Profil / Paramètres                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  MON PROFIL (/profile)                  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Infos Utilisateur                               │   │
│  │ ├─ Nom: Jean Dupont                             │   │
│  │ ├─ Email: jean@example.com                      │   │
│  │ └─ [Modifier le profil] → /profile/settings     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Statistiques                                    │   │
│  │ ├─ Commandes totales: 5                         │   │
│  │ └─ Commandes livrées: 4                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Historique des commandes                        │   │
│  │ ┌─────────────────────────────────────────────┐ │   │
│  │ │ #123 | 08/03/2024 | 99.99€ | Livré | [Détails]│   │
│  │ │ #122 | 07/03/2024 | 49.99€ | Expédié | [Détails]│   │
│  │ │ #121 | 06/03/2024 | 199.99€ | En traitement | [Détails]│   │
│  │ └─────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Adresses sauvegardées                           │   │
│  │ ├─ Adresse par défaut: À configurer             │   │
│  │ └─ [Gérer les adresses] → /profile/settings     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────┐
        ↓                                   ↓
┌──────────────────────────┐    ┌──────────────────────────┐
│ DÉTAIL COMMANDE          │    │ PARAMÈTRES               │
│ (/profile/orders/123)    │    │ (/profile/settings)      │
│                          │    │                          │
│ ┌──────────────────────┐ │    │ [Profil] [Mot de passe]  │
│ │ Timeline de suivi    │ │    │ [Préférences]            │
│ │ ① En attente         │ │    │                          │
│ │ ② En traitement      │ │    │ ┌──────────────────────┐ │
│ │ ③ Expédié            │ │    │ │ Onglet Profil        │ │
│ │ ④ Livré ✓            │ │    │ │ ├─ Nom                │ │
│ └──────────────────────┘ │    │ │ ├─ Email              │ │
│                          │    │ │ ├─ Adresse            │ │
│ ┌──────────────────────┐ │    │ │ ├─ Téléphone          │ │
│ │ Articles             │ │    │ │ └─ [Enregistrer]      │ │
│ │ ├─ Produit 1 x2      │ │    │ └──────────────────────┘ │
│ │ │  49.99€            │ │    │                          │
│ │ └─ Produit 2 x1      │ │    │ ┌──────────────────────┐ │
│ │    50.00€            │ │    │ │ Onglet Mot de passe  │ │
│ └──────────────────────┘ │    │ │ ├─ Mot de passe      │ │
│                          │    │ │ │  actuel             │ │
│ ┌──────────────────────┐ │    │ │ ├─ Nouveau mot de    │ │
│ │ Infos de livraison   │ │    │ │ │  passe              │ │
│ │ ├─ Adresse: 123 Rue  │ │    │ │ ├─ Confirmation      │ │
│ │ ├─ Téléphone: +33... │ │    │ │ └─ [Changer]         │ │
│ │ ├─ Paiement: Complété│ │    │ └──────────────────────┘ │
│ │ └─ Total: 99.99€     │ │    │                          │
│ └──────────────────────┘ │    │ ┌──────────────────────┐ │
│                          │    │ │ Onglet Préférences   │ │
│ ┌──────────────────────┐ │    │ │ ☑ Infolettre         │ │
│ │ Retour (30 jours)    │ │    │ │ ☑ Notifications      │ │
│ │ Raison: [Sélectionner]│ │    │ │ ☐ SMS               │ │
│ │ [Soumettre retour]   │ │    │ │ [Enregistrer]        │ │
│ └──────────────────────┘ │    │ └──────────────────────┘ │
└──────────────────────────┘    │                          │
                                │ ⚠️ Zone de danger        │
                                │ [Supprimer mon compte]   │
                                └──────────────────────────┘
```

---

## 🎨 Composants UI

### Badges de statut

```
┌─────────────────────────────────────────┐
│ Statuts de commande                     │
├─────────────────────────────────────────┤
│ 🟨 En attente      (Jaune)              │
│ 🟦 En traitement   (Bleu)               │
│ 🟪 Expédié         (Violet)             │
│ 🟩 Livré           (Vert)               │
│ 🟥 Annulé          (Rouge)              │
└─────────────────────────────────────────┘
```

### Timeline de suivi

```
┌─────────────────────────────────────────────────────┐
│ Suivi de la commande                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ① En attente ─── ② En traitement ─── ③ Expédié ─── ④ Livré
│  ✓              ✓                    ✓              ✓
│                                                     │
│  Statut actuel: Livré                              │
│  Dernière mise à jour: 08/03/2024                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Tableau d'historique

```
┌──────────────────────────────────────────────────────────────┐
│ Historique des commandes                                     │
├──────┬────────────┬──────────┬──────────────┬────────────────┤
│ Cmd  │ Date       │ Montant  │ Statut       │ Action         │
├──────┼────────────┼──────────┼──────────────┼────────────────┤
│ #123 │ 08/03/2024 │ 99.99€   │ 🟩 Livré     │ [Détails]      │
│ #122 │ 07/03/2024 │ 49.99€   │ 🟪 Expédié   │ [Détails]      │
│ #121 │ 06/03/2024 │ 199.99€  │ 🟦 Traitement│ [Détails]      │
└──────┴────────────┴──────────┴──────────────┴────────────────┘
```

---

## 📐 Layout responsive

### Mobile (< 640px)
```
┌─────────────────────┐
│ [Menu]              │
├─────────────────────┤
│ MON PROFIL          │
│                     │
│ Infos Utilisateur   │
│ ├─ Nom              │
│ ├─ Email            │
│ └─ [Modifier]       │
│                     │
│ Statistiques        │
│ ├─ Commandes: 5     │
│ └─ Livrées: 4       │
│                     │
│ Historique          │
│ ├─ #123 | 99.99€    │
│ ├─ #122 | 49.99€    │
│ └─ #121 | 199.99€   │
│                     │
│ Adresses            │
│ └─ [Gérer]          │
└─────────────────────┘
```

### Desktop (> 1024px)
```
┌─────────────────────────────────────────────────────────┐
│ [Menu]                                                  │
├─────────────────────────────────────────────────────────┤
│ MON PROFIL                                              │
│                                                         │
│ ┌──────────────────────────────┐  ┌──────────────────┐ │
│ │ Infos Utilisateur            │  │ Statistiques     │ │
│ │ ├─ Nom: Jean Dupont          │  │ ├─ Commandes: 5  │ │
│ │ ├─ Email: jean@example.com   │  │ └─ Livrées: 4    │ │
│ │ └─ [Modifier le profil]       │  └──────────────────┘ │
│ └──────────────────────────────┘                        │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Historique des commandes                            │ │
│ │ ┌─────┬────────────┬──────────┬──────────┬────────┐ │ │
│ │ │ Cmd │ Date       │ Montant  │ Statut   │ Action │ │ │
│ │ ├─────┼────────────┼──────────┼──────────┼────────┤ │ │
│ │ │ #123│ 08/03/2024 │ 99.99€   │ Livré    │ Détails│ │ │
│ │ │ #122│ 07/03/2024 │ 49.99€   │ Expédié  │ Détails│ │ │
│ │ │ #121│ 06/03/2024 │ 199.99€  │ Traitement│ Détails│ │ │
│ │ └─────┴────────────┴──────────┴──────────┴────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Adresses sauvegardées                               │ │
│ │ ├─ Adresse par défaut: À configurer                 │ │
│ │ └─ [Gérer les adresses]                             │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Flux de formulaire

### Modification du profil

```
┌─────────────────────────────────────┐
│ Formulaire de modification           │
├─────────────────────────────────────┤
│                                     │
│ Nom complet                         │
│ [Jean Dupont_____________]          │
│                                     │
│ Email                               │
│ [jean@example.com_________________] │
│                                     │
│ Adresse de livraison                │
│ [123 Rue de la Paix, 75000 Paris___]│
│                                     │
│ Numéro de téléphone                 │
│ [+33 6 12 34 56 78_________________]│
│                                     │
│ [Enregistrer les modifications]     │
│                                     │
│ ✓ Profil mis à jour avec succès     │
│   (message disparaît après 3s)      │
│                                     │
└─────────────────────────────────────┘
```

### Changement de mot de passe

```
┌─────────────────────────────────────┐
│ Changer le mot de passe              │
├─────────────────────────────────────┤
│                                     │
│ Mot de passe actuel                 │
│ [••••••••••••••••••••••••••••••••]   │
│                                     │
│ Nouveau mot de passe                │
│ [••••••••••••••••••••••••••••••••]   │
│ Minimum 6 caractères                │
│                                     │
│ Confirmer le mot de passe           │
│ [••••••••••••••••••••••••••••••••]   │
│                                     │
│ [Changer le mot de passe]           │
│                                     │
│ ✗ Les mots de passe ne correspondent│
│   pas (message persistant)          │
│                                     │
└─────────────────────────────────────┘
```

### Formulaire de retour

```
┌─────────────────────────────────────┐
│ Retour et remboursement              │
├─────────────────────────────────────┤
│                                     │
│ Cette commande peut être retournée  │
│ jusqu'au 07/04/2024                 │
│                                     │
│ Raison du retour                    │
│ [Sélectionner une raison ▼]         │
│ ├─ Produit défectueux               │
│ ├─ Ne correspond pas à la desc.     │
│ ├─ Mauvais article reçu             │
│ ├─ J'ai changé d'avis               │
│ └─ Autre                            │
│                                     │
│ [Soumettre la demande] [Annuler]    │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎯 Points clés

### Sécurité
- 🔒 Authentification requise
- 🔒 Redirection vers login
- 🔒 Validation des données
- 🔒 Gestion des erreurs

### UX
- 📱 Responsive design
- 🎨 Couleurs cohérentes
- ⚡ Feedback utilisateur
- 🔄 Navigation claire

### Performance
- ⚡ Chargement des commandes
- ⚡ Gestion des états
- ⚡ Optimisation des requêtes

---

## 📊 Données affichées

### Profil utilisateur
```
{
  id: 1,
  name: "Jean Dupont",
  email: "jean@example.com",
  createdAt: "2024-01-15T10:00:00Z"
}
```

### Commande
```
{
  id: 123,
  status: "delivered",
  totalAmount: "99.99",
  paymentStatus: "completed",
  paymentMethod: "cash_on_delivery",
  deliveryAddress: "123 Rue de la Paix, 75000 Paris",
  phoneNumber: "+33 6 12 34 56 78",
  createdAt: "2024-03-08T10:00:00Z",
  items: [
    {
      id: 1,
      productId: 1,
      quantity: 2,
      price: "49.99",
      product: { name: "T-shirt" }
    }
  ]
}
```

---

**Créé:** 8 Mars 2026
**Version:** 1.0
