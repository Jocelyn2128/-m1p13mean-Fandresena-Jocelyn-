# Contexte du Projet MallConnect

## Workflow Git

### Structure des Branches

```
main (production)
  ↑
preprod (tests et intégration)
  ↑
dev (développement actif)
```

### Branches Utilisées

- **`main`** : Code en production, stable et déployé
- **`preprod`** : Environnement de test, intégration des features avant production
- **`dev`** : Branche de développement actif où toutes les modifications sont faites

### Workflow Détaillé

#### 1. Développement Quotidien
```bash
# Vous êtes sur la branche dev
git checkout dev

# Faites vos modifications...
git add .
git commit -m "Description des changements"
git push origin dev
```

#### 2. Tests et Intégration
```bash
# Quand vous voulez tester sur preprod
git checkout preprod
git merge dev --no-ff -m "Merge dev: Description des changements"
git push origin preprod
```

#### 3. Mise en Production
```bash
# Quand tout est testé et validé
git checkout main
git merge preprod --no-ff -m "Release: Version X.X.X"
git push origin main
```

### Règles Importantes

1. **Toujours développer sur `dev`**
2. **Ne jamais modifier directement `preprod` ou `main`**
3. **Toujours faire des merges avec `--no-ff`** pour préserver l'historique
4. **Commiter régulièrement** sur dev avec des messages descriptifs
5. **Tester sur preprod** avant de merger dans main

## Stack Technique

### Backend
- **Framework**: Express.js (JavaScript)
- **Base de données**: MongoDB (mongoose)
- **Authentification**: JWT (JSON Web Tokens)
- **Durée JWT**: 8 heures
- **Secret JWT**: cf902edeea8953a360f082faa4ed3413
- **Port**: 5000
- **MongoDB**: mongodb://mongo:mongo@localhost:27017/mallConnectDB

### Frontend
- **Framework**: Angular 17
- **Langage**: TypeScript
- **Styling**: Tailwind CSS (inspiré de TailAdmin)
- **UI Components**: Angular Material
- **Icons**: Font Awesome 6
- **Port**: 4200
- **Charting**: Chart.js / ng2-charts

## Style Frontend - TailAdmin

### Design System

#### Couleurs Principales
```css
--primary: #3b82f6 (Bleu)
--secondary: #64748b (Gris)
--success: #22c55e (Vert)
--danger: #ef4444 (Rouge)
--warning: #f59e0b (Orange)
--info: #3b82f6 (Bleu info)
--dark: #1e293b (Noir)
--light: #f1f5f9 (Gris clair)
```

#### Composants UI

**1. Cards (mall-card)**
```css
- Background: white
- Border-radius: 0.75rem (rounded-xl)
- Shadow: shadow-sm
- Border: 1px solid gray-200
- Padding: 1.5rem (p-6)
```

**2. Boutons**
```css
/* Primary */
.btn-primary: bg-blue-600, hover:bg-blue-700, text-white, rounded-lg

/* Secondary */
.btn-secondary: bg-gray-200, hover:bg-gray-300, text-gray-800, rounded-lg

/* Success */
.btn-success: bg-green-600, hover:bg-green-700, text-white, rounded-lg

/* Danger */
.btn-danger: bg-red-600, hover:bg-red-700, text-white, rounded-lg
```

**3. Formulaires**
```css
.form-input: 
  - w-full
  - px-4 py-2
  - border border-gray-300
  - rounded-lg
  - focus:ring-2 focus:ring-blue-500
  
.form-label:
  - block
  - text-sm font-medium text-gray-700
  - mb-1
```

**4. Sidebar**
```css
- Width: 16rem (w-64)
- Background: white
- Border-right: 1px solid gray-200
- Active state: bg-blue-50, text-blue-600, border-r-2 border-blue-600
```

**5. Badges**
```css
.badge: inline-flex, px-2.5 py-0.5, rounded-full, text-xs
.badge-success: bg-green-100, text-green-800
.badge-warning: bg-yellow-100, text-yellow-800
.badge-danger: bg-red-100, text-red-800
```

### Layout Standards

**Dashboard Admin**
- Sidebar fixe à gauche (64px)
- Header sticky en haut
- Contenu scrollable
- Cards avec statistiques en haut
- Grille responsive

**Formulaires**
- Max-width: 28rem (max-w-md)
- Centré verticalement et horizontalement
- Background gradient pour la page
- Shadow-xl sur le conteneur

**Tables**
```css
- min-w-full
- divide-y divide-gray-200
- Header: text-left, text-xs, uppercase, text-gray-500
- Cells: px-6 py-4, whitespace-nowrap
```

### Icônes Font Awesome
Utiliser les classes `fas` et `fab` pour les icônes :
- `fa-home`, `fa-store`, `fa-users`, `fa-chart-bar`
- `fa-check-circle`, `fa-times`, `fa-clock`
- `fa-shopping-bag`, `fa-cash-register`

## Architecture des Dossiers

```
project/
├── backend/               # API Express
│   ├── config/           # Configuration
│   ├── models/           # Modèles Mongoose
│   ├── routes/           # Routes API
│   ├── middlewares/      # Middlewares
│   └── server.js         # Point d'entrée
│
├── frontend/             # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── admin-dashboard/
│   │   │   │   ├── auth/
│   │   │   │   ├── catalog/
│   │   │   │   └── pos-system/
│   │   │   ├── services/     # Services Angular
│   │   │   ├── models/       # Interfaces TypeScript
│   │   │   └── interceptors/ # HTTP interceptors
│   │   ├── assets/
│   │   └── environments/
│   └── angular.json
│
├── context.md           # Ce fichier
├── fonctionnalites.md   # Fichier des fonctionnalités
└── README.md            # Documentation générale
```

## Modèles de Données

### Collections MongoDB
1. **users** - Utilisateurs (Admin, Boutique, Acheteur)
2. **stores** - Boutiques
3. **products** - Produits
4. **orders** - Commandes/Ventes
5. **cashRegisters** - Caisses
6. **events** - Événements
7. **favorites** - Favoris

## Routes API Principales

### Authentification
- POST `/api/auth/register`
- POST `/api/auth/login`

### Utilisateurs
- GET `/api/users/profile`
- GET `/api/users/search?phone=xxx`

### Boutiques
- GET `/api/stores`
- POST `/api/stores`
- GET `/api/stores/:id`

### Produits
- GET `/api/products`
- POST `/api/products`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`

### Commandes
- GET `/api/orders`
- POST `/api/orders`
- PUT `/api/orders/:id/status`

### Caisses
- GET `/api/cash-registers`
- POST `/api/cash-registers/:id/open`
- POST `/api/cash-registers/:id/close`

## URLs Frontend

### Auth
- `/login` - Connexion
- `/register` - Choix type de compte
- `/register/admin` - Inscription admin
- `/register/boutique` - Inscription boutique
- `/register/acheteur` - Inscription acheteur

### Admin
- `/admin` - Dashboard
- `/admin/approvals` - Validation boutiques
- `/admin/approvals/users` - Validation utilisateurs

### Boutique
- `/boutique` - Point de vente (POS)

### Client
- `/catalog` - Catalogue produits

## Notes Importantes

1. **Déconnexion**: Toujours rediriger vers `/login` après logout
2. **JWT**: Vérifié automatiquement via AuthInterceptor
3. **Validation**: Les boutiques doivent être approuvées par l'admin
4. **Uploads**: Les images sont stockées dans `/uploads/`
5. **CORS**: Activé pour le développement local

## Commandes Utiles

### Backend
```bash
cd backend
npm install
npm start          # Production
npm run dev        # Développement
```

### Frontend
```bash
cd frontend
npm install
ng serve           # Développement
ng build           # Production
ng build --watch   # Watch mode
```

## Contact et Support

- Repository: https://github.com/Jocelyn2128/mean-project-m1-p13
- Branches: dev, preprod, main
