# MallConnect - Système de Gestion de Centre Commercial

Application complète de gestion pour centre commercial avec gestion des boutiques, système de caisse (POS), catalogue produits et réservations.

## Architecture du Projet

Ce projet utilise une architecture **Git Flow simplifiée** avec 3 branches principales:

```
main (production)
  │
  ├── preprod (intégration)
  │     ├── dev-back (développement backend)
  │     └── dev-front (développement frontend)
```

### Branches

- **`main`** : Code en production
- **`preprod`** : Intégration des features avant production (contient dev-back + dev-front)
- **`dev-back`** : Développement du backend Express/MongoDB
- **`dev-front`** : Développement du frontend Angular

## Stack Technique

### Backend (`/backend`)
- **Framework**: Express.js (JavaScript)
- **Base de données**: MongoDB
- **Authentification**: JWT
- **Validation**: express-validator
- **Upload**: Multer

### Frontend (`/frontend`)
- **Framework**: Angular 17
- **Langage**: TypeScript
- **Styling**: Tailwind CSS (inspiré de TailAdmin)
- **UI**: Angular Material
- **Icons**: Font Awesome

## Structure du Projet

```
mallconnect/
├── backend/                    # Backend Express
│   ├── config/                # Configuration
│   ├── models/                # Modèles Mongoose
│   ├── routes/                # Routes API
│   ├── controllers/           # Contrôleurs
│   ├── middlewares/           # Middlewares
│   ├── utils/                 # Utilitaires
│   ├── .env                   # Variables d'environnement
│   ├── package.json
│   └── server.js              # Point d'entrée
│
├── frontend/                   # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Composants Angular
│   │   │   ├── services/      # Services
│   │   │   ├── models/        # Modèles TypeScript
│   │   │   ├── guards/        # Route guards
│   │   │   └── interceptors/  # HTTP interceptors
│   │   ├── assets/            # Assets statiques
│   │   └── environments/      # Configurations environnement
│   ├── angular.json
│   ├── package.json
│   └── tailwind.config.js
│
├── fonctionnalites.md          # Documentation fonctionnalités
└── script.sql                  # Schéma MongoDB
```

## Fonctionnalités

### Profil Admin
- ✅ Gestion des boutiques (approbation/suspension)
- ✅ Statistiques globales
- ✅ Gestion des événements promotionnels
- ✅ Plan du centre commercial
- ✅ Modération des produits

### Profil Boutique
- ✅ Système de caisse (POS)
- ✅ Gestion multi-caisses
- ✅ Gestion des stocks et produits
- ✅ Tickets de caisse numériques avec QR Code
- ✅ Rapports journaliers (Z de caisse)
- ✅ Gestion des réservations
- ✅ Historique des ventes

### Profil Client
- ✅ Catalogue produits avec recherche
- ✅ Filtres avancés (catégorie, étage, prix)
- ✅ Favoris (boutiques et produits)
- ✅ Réservation en ligne (24h)
- ✅ Portefeuille de tickets numériques
- ✅ Historique d'achats
- ✅ Notifications

## Installation

### Prérequis
- Node.js (v18+)
- MongoDB (v5+)
- Angular CLI

### 1. Cloner le projet

```bash
git clone <repository-url>
cd mallconnect
```

### 2. Installation Backend

```bash
cd backend
npm install
```

**Configuration MongoDB** (déjà configuré dans `.env`):
```env
PORT=5000
MONGODB_URI=mongodb://mongo:mongo@localhost:27017/mallConnectDB?authSource=admin
JWT_SECRET=your-secret-key
```

**Démarrer le backend**:
```bash
npm run dev
```

Le backend sera accessible sur `http://localhost:5000`

### 3. Installation Frontend

```bash
cd frontend
npm install
```

**Démarrer le frontend**:
```bash
npm start
# ou
ng serve
```

Le frontend sera accessible sur `http://localhost:4200`

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur
- `GET /api/users/search?phone=xxx` - Recherche par téléphone

### Boutiques
- `GET /api/stores` - Liste des boutiques
- `POST /api/stores` - Créer une boutique
- `GET /api/stores/:id` - Détails boutique

### Produits
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Commandes
- `GET /api/orders` - Liste des commandes
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id/status` - Modifier statut

### Caisses
- `GET /api/cash-registers` - Liste des caisses
- `POST /api/cash-registers/:id/open` - Ouvrir caisse
- `POST /api/cash-registers/:id/close` - Fermer caisse
- `GET /api/cash-registers/:id/report` - Rapport

## Workflow Git

### Développement Backend
```bash
git checkout dev-back
# ... faire les modifications ...
git add .
git commit -m "Description des changements"
git push origin dev-back
```

### Développement Frontend
```bash
git checkout dev-front
# ... faire les modifications ...
git add .
git commit -m "Description des changements"
git push origin dev-front
```

### Intégration dans Preprod
```bash
git checkout preprod
git merge dev-back --no-ff
git merge dev-front --no-ff
git push origin preprod
```

### Déploiement Production
```bash
git checkout main
git merge preprod --no-ff
git push origin main
```

## Scripts Disponibles

### Backend
```bash
npm start      # Production
npm run dev    # Développement avec nodemon
npm test       # Tests
```

### Frontend
```bash
npm start      # Serveur de développement
ng build       # Build production
ng test        # Tests unitaires
ng lint        # Linting
```

## Documentation

- [Documentation Fonctionnalités](fonctionnalites.md)
- [Schéma MongoDB](script.sql)
- [Documentation Backend](backend/README.md)
- [Documentation Frontend](frontend/README.md)

## Contribution

1. Créer une branche à partir de `dev-back` ou `dev-front` selon le type de modification
2. Faire les modifications
3. Créer une Pull Request vers `dev-back` ou `dev-front`
4. Après review, merger dans `preprod` pour tests
5. Enfin merger dans `main` pour production

## Licence

Ce projet est propriétaire. Tous droits réservés.
