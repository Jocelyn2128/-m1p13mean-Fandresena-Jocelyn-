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
- [x] Endpoint API pour approuver une boutique
  - PUT `/api/stores/:id/approve`
  - Activation du compte utilisateur
- [x] Endpoint API pour refuser une boutique
  - PUT `/api/stores/:id/reject`
- [x] Endpoint API pour récupérer les boutiques en attente
  - GET `/api/stores?status=pending_approval`
- [x] Endpoint API pour récupérer les utilisateurs en attente
  - GET `/api/users?role=BOUTIQUE&status=pending`

#### 2. Gestion des Stocks
- [x] Création de produits
- [x] Modification de produits
- [x] Suppression de produits (soft delete)
- [x] Upload d'images produits
- [x] Gestion des catégories
- [x] Alertes stock bas (seuil configurable)
- [x] Statut automatique "Rupture de stock"
- [x] Historique des mouvements de stock

#### 3. Gestion Multi-Caisse
- [x] Création de caisses multiples
- [x] Ouverture de caisse (avec solde initial)
- [x] Fermeture de caisse
- [x] Rapport Z (X de caisse)
  - Total des ventes par mode de paiement
  - Solde final
  - Nombre de transactions
- [x] Historique des ouvertures/fermetures
- [x] Lien entre modes de paiement et caisses
  - Chaque paiement doit être associé à une caisse spécifique
  - Suivi des paiements par caisse et par mode

#### 4. Système de Caisse (POS) - Fonctionnalités Complètes
- [x] Affichage des produits de la boutique
- [x] Recherche de produits par nom/code
- [x] Ajout au panier
- [x] Gestion des quantités
- [x] Calcul automatique des totaux
- [x] Application de réductions/promotions
- [x] Sélection du mode de paiement (lié aux caisses)
  - Espèces
  - MVola
  - Orange Money
  - Carte Bancaire
  - **Chaque paiement est associé à une caisse ouverte**
- [x] Finalisation de la vente
- [ ] Génération de ticket de caisse
- [ ] Impression du ticket
- [x] Décrémentation automatique du stock

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

#### 11. Plan du Centre Commercial
- [ ] Visualisation des étages
- [ ] Localisation des boutiques
- [ ] Filtrage par étage

#### 12. Gestion des Profils
- [ ] Modification du profil utilisateur
- [x] Changement de mot de passe
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

---

## 🎯 PROCHAINES PRIORITÉS

1. **Implémenter les endpoints API de validation** (priorité CRITIQUE)
2. **Gestion des stocks complète** (création, modification, suivi)
3. **Gestion Multi-Caisse** (ouverture, fermeture, rapport Z)
4. **Système de caisse fonctionnel avec tickets** (lié aux caisses)
5. **Connecter le catalogue aux vraies données**

---
*Dernière mise à jour: 05 Février 2026*
*Branche active: dev*
*Version: 1.0.0*
