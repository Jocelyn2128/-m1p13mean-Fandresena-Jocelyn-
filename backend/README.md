# MallConnect Backend

Backend API for MallConnect - Shopping Mall Management System

## Stack Technique

- **Framework**: Express.js
- **Base de données**: MongoDB
- **Authentification**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Upload**: Multer

## Structure du Projet

```
backend/
├── config/
│   └── database.js      # Configuration MongoDB
├── controllers/         # Contrôleurs (logique métier)
├── middlewares/         # Middlewares personnalisés
├── models/             # Modèles Mongoose
│   ├── User.js
│   ├── Store.js
│   ├── Product.js
│   ├── CashRegister.js
│   ├── Order.js
│   ├── Event.js
│   └── Favorite.js
├── routes/             # Routes API
│   ├── auth.js
│   ├── users.js
│   ├── stores.js
│   ├── products.js
│   ├── orders.js
│   ├── cashRegisters.js
│   ├── events.js
│   └── favorites.js
├── utils/              # Utilitaires
├── uploads/            # Fichiers uploadés
├── .env               # Variables d'environnement
├── .gitignore
├── package.json
└── server.js          # Point d'entrée
```

## Installation

1. **Installer les dépendances** :
```bash
cd backend
npm install
```

2. **Configurer les variables d'environnement** :
Créer un fichier `.env` avec :
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://mongo:mongo@localhost:27017/mallConnectDB?authSource=admin
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

3. **Démarrer le serveur** :
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur
- `GET /api/users/search?phone=xxx` - Recherche par téléphone (caisse)

### Boutiques
- `GET /api/stores` - Liste des boutiques
- `GET /api/stores/:id` - Détails d'une boutique
- `POST /api/stores` - Créer une boutique

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Commandes
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détails d'une commande
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id/status` - Modifier le statut
- `GET /api/orders/receipt/:number` - Voir le reçu

### Caisses
- `GET /api/cash-registers?storeId=xxx` - Liste des caisses
- `POST /api/cash-registers` - Créer une caisse
- `POST /api/cash-registers/:id/open` - Ouvrir la caisse
- `POST /api/cash-registers/:id/close` - Fermer la caisse
- `GET /api/cash-registers/:id/report` - Rapport journalier

### Événements
- `GET /api/events` - Liste des événements
- `POST /api/events` - Créer un événement (Admin)
- `PUT /api/events/:id` - Modifier un événement
- `DELETE /api/events/:id` - Supprimer un événement

### Favoris
- `GET /api/favorites?userId=xxx` - Liste des favoris
- `POST /api/favorites` - Ajouter aux favoris
- `DELETE /api/favorites` - Retirer des favoris

## Modèles de Données

Voir `script.sql` pour la structure complète des collections MongoDB.
