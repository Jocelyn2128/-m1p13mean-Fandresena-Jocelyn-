# Fonctionnalités du Projet MallConnect

## ✅ FONCTIONNALITÉS DÉJÀ IMPLÉMENTÉES

### 1. Architecture & Configuration
- [x] Structure du projet (Backend Express + Frontend Angular)
- [x] Configuration MongoDB avec schémas
- [x] Configuration Tailwind CSS (style TailAdmin)
- [x] Configuration JWT (8h expiration, secret key)
- [x] Workflow Git (dev → preprod → main)
- [x] HTTP Interceptor pour JWT

### 2. Authentification & Inscription
- [x] Page de connexion (/login)
- [x] Page de choix d'inscription (/register)
- [x] Inscription Admin (/register/admin)
- [x] Inscription Boutique en 2 étapes (/register/boutique)
  - Étape 1: Informations propriétaire
  - Étape 2: Informations boutique
  - Étape 3: Confirmation d'attente
- [x] Inscription Acheteur (/register/acheteur)
- [x] Déconnexion fonctionnelle sur toutes les interfaces
- [x] Redirection automatique vers /login après déconnexion

### 3. Interface Administrateur
- [x] Dashboard Admin avec sidebar
- [x] Sous-menu Validation dans la sidebar
  - Boutiques en attente
  - Utilisateurs en attente
- [x] Interface de validation des boutiques (/admin/approvals)
  - Liste des boutiques en attente
  - Détails complets (propriétaire + boutique)
  - Boutons Approuver/Refuser
  - Statistiques (en attente, approuvées, refusées)
- [x] Interface de validation des utilisateurs boutique (/admin/approvals/users)
  - Liste des comptes boutique en attente
  - Informations détaillées propriétaire
  - Informations boutique
  - Boutons Approuver/Refuser
  - Statistiques

### 4. Interface Boutique (POS)
- [x] Interface de caisse (/boutique)
- [x] Sidebar avec navigation
- [x] Section Produits (placeholder)
- [x] Section Historique (placeholder)
- [x] Section Rapports (placeholder)
- [x] Panier de vente (placeholder)
- [x] Déconnexion fonctionnelle

### 5. Interface Client (Catalogue)
- [x] Page d'accueil catalogue (/catalog)
- [x] Header avec navigation
- [x] Section Hero (bannière)
- [x] Filtres par catégorie
- [x] Grille de produits (placeholder)
- [x] Grille de boutiques (placeholder)
- [x] Footer
- [x] Déconnexion fonctionnelle

### 6. Backend API
- [x] Routes d'authentification (register/login)
- [x] Modèles Mongoose (User, Store, Product, Order, CashRegister, Event, Favorite)
- [x] Routes CRUD pour utilisateurs
- [x] Routes CRUD pour boutiques
- [x] Routes CRUD pour produits
- [x] Routes pour commandes
- [x] Routes pour caisses
- [x] Configuration CORS
- [x] Gestion des uploads (structure)

---

## 🚧 FONCTIONNALITÉS À IMPLÉMENTER

### Priorité Haute

#### 1. Backend - Validation des Boutiques
- [ ] Endpoint API pour approuver une boutique
  - PUT `/api/stores/:id/approve`
  - Envoi d'email de confirmation
  - Activation du compte utilisateur
- [ ] Endpoint API pour refuser une boutique
  - PUT `/api/stores/:id/reject`
  - Envoi d'email avec motif de refus
- [ ] Endpoint API pour récupérer les boutiques en attente
  - GET `/api/stores?status=pending_approval`
- [ ] Endpoint API pour récupérer les utilisateurs en attente
  - GET `/api/users?role=BOUTIQUE&status=pending`

#### 2. Backend - Notifications Email
- [ ] Configuration service email (Nodemailer)
- [ ] Template email d'approbation boutique
- [ ] Template email de refus boutique
- [ ] Template email de confirmation d'inscription

#### 3. Système de Caisse (POS) - Fonctionnalités Complètes
- [ ] Affichage des produits de la boutique
- [ ] Recherche de produits par nom/code
- [ ] Ajout au panier
- [ ] Gestion des quantités
- [ ] Calcul automatique des totaux
- [ ] Application de réductions/promotions
- [ ] Sélection du mode de paiement
  - Espèces
  - MVola
  - Orange Money
  - Carte Bancaire
- [ ] Finalisation de la vente
- [ ] Génération de ticket de caisse
- [ ] Impression du ticket
- [ ] QR Code sur le ticket
- [ ] Décrémentation automatique du stock

#### 4. Gestion Multi-Caisse
- [ ] Création de caisses multiples
- [ ] Ouverture de caisse (avec solde initial)
- [ ] Fermeture de caisse
- [ ] Rapport Z (X de caisse)
  - Total des ventes par mode de paiement
  - Solde final
  - Nombre de transactions
- [ ] Historique des ouvertures/fermetures

#### 5. Gestion des Stocks
- [ ] Création de produits
- [ ] Modification de produits
- [ ] Suppression de produits (soft delete)
- [ ] Upload d'images produits
- [ ] Gestion des catégories
- [ ] Alertes stock bas (seuil configurable)
- [ ] Statut automatique "Rupture de stock"
- [ ] Historique des mouvements de stock

### Priorité Moyenne

#### 6. Catalogue Client - Fonctionnalités Complètes
- [ ] Affichage réel des produits depuis l'API
- [ ] Affichage réel des boutiques depuis l'API
- [ ] Filtres avancés
  - Par catégorie
  - Par étage
  - Par prix (min/max)
  - En promotion
  - En stock
- [ ] Recherche textuelle
- [ ] Tri des résultats
- [ ] Pagination
- [ ] Vue détaillée produit
- [ ] Vue détaillée boutique

#### 7. Système de Favoris
- [ ] Ajouter/retirer des favoris (produits)
- [ ] Ajouter/retirer des favoris (boutiques)
- [ ] Page "Mes favoris"
- [ ] Persistence en base de données

#### 8. Réservations & Commandes Client
- [ ] Réservation de produits (24h)
- [ ] Panier d'achat
- [ ] Passage de commande
- [ ] Paiement en ligne (à définir)
- [ ] Suivi des commandes
- [ ] Historique des achats
- [ ] Portefeuille de tickets numériques
- [ ] QR Code pour retrait en boutique

#### 9. Statistiques Admin
- [ ] Tableau de bord avec vraies données
- [ ] Graphiques des ventes (Chart.js)
- [ ] Boutiques les plus visitées
- [ ] Produits les plus populaires
- [ ] Nombre total de ventes
- [ ] Revenus totaux
- [ ] Export de rapports (PDF/Excel)

### Priorité Basse

#### 10. Événements & Promotions
- [ ] Création d'événements promotionnels
- [ ] Bannières sur la page d'accueil
- [ ] Gestion des promotions par boutique
  - Réductions temporaires
  - Dates de début/fin
  - Pourcentage ou montant fixe
- [ ] Notifications push (optionnel)

#### 11. Plan du Centre Commercial
- [ ] Visualisation des étages
- [ ] Localisation des boutiques
- [ ] Filtrage par étage

#### 12. Gestion des Profils
- [ ] Modification du profil utilisateur
- [ ] Changement de mot de passe
- [ ] Upload de photo de profil
- [ ] Modification des informations boutique

#### 13. Modération
- [ ] Interface de modération des produits
- [ ] Signalement de contenu inapproprié
- [ ] Suppression de produits par l'admin

#### 14. Fonctionnalités Avancées
- [ ] Système de notation/avis
- [ ] Chat entre client et boutique (optionnel)
- [ ] Notifications push
- [ ] Application mobile (PWA ou native)
- [ ] Intégration paiement mobile (MVola, Orange Money)
- [ ] Génération automatique de factures PDF

---

## 📝 NOTES DE DÉVELOPPEMENT

### Backend - Points d'Attention
1. **Validation des données**: Utiliser express-validator
2. **Gestion des erreurs**: Middleware global d'erreur
3. **Sécurité**: 
   - Hasher les mots de passe avec bcrypt
   - Sanitiser les entrées utilisateur
   - Limiter les requêtes (rate limiting)
4. **Uploads**: Stocker les images dans /uploads avec des noms uniques

### Frontend - Points d'Attention
1. **Reactive Forms**: Utiliser pour tous les formulaires
2. **Guards**: Implémenter AuthGuard et RoleGuard
3. **Interceptors**: Gérer les erreurs 401 (token expiré)
4. **Services**: Toujours utiliser providedIn: 'root'
5. **Types**: Définir des interfaces TypeScript strictes
6. **Styles**: Suivre le design system TailAdmin

### Tests Recommandés
- [ ] Tests unitaires (Jest pour backend, Jasmine pour frontend)
- [ ] Tests d'intégration API
- [ ] Tests end-to-end (Cypress)

---

## 🎯 PROCHAINES PRIORITÉS

1. **Implémenter les endpoints API de validation** (priorité CRITIQUE)
2. **Connecter le POS aux vraies données**
3. **Connecter le catalogue aux vraies données**
4. **Système de caisse fonctionnel avec tickets**
5. **Gestion des stocks complète**

---

## 🔄 WORKFLOW ACTUEL

```
dev → preprod → main
```

### Branches Disponibles
- **dev**: Développement quotidien
- **preprod**: Tests et intégration
- **main**: Production

### Commandes Utiles
```bash
# Développement
git checkout dev
git add .
git commit -m "Description"
git push origin dev

# Déploiement test
git checkout preprod
git merge dev --no-ff
git push origin preprod

# Production
git checkout main
git merge preprod --no-ff
git push origin main
```

---

*Dernière mise à jour: 05 Février 2026*
*Branche active: dev*
*Version: 1.0.0*
