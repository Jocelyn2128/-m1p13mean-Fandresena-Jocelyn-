# MallConnect Frontend

Frontend Angular pour MallConnect - Système de Gestion de Centre Commercial

## Stack Technique

- **Framework**: Angular 17
- **Langage**: TypeScript
- **Styling**: Tailwind CSS (inspiré de TailAdmin)
- **UI Components**: Angular Material
- **HTTP Client**: HttpClientModule
- **Charts**: Chart.js / ng2-charts
- **Icons**: Font Awesome

## Structure du Projet

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── admin-dashboard/    # Dashboard Admin
│   │   │   ├── pos-system/         # Système de caisse (boutique)
│   │   │   ├── catalog/            # Catalogue client
│   │   │   ├── auth/               # Login, Register
│   │   │   └── shared/             # Composants partagés
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── product.service.ts
│   │   │   ├── store.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── cash-register.service.ts
│   │   │   └── cart.service.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── store.model.ts
│   │   │   ├── product.model.ts
│   │   │   ├── order.model.ts
│   │   │   └── cash-register.model.ts
│   │   ├── guards/                 # Route guards
│   │   ├── interceptors/           # HTTP interceptors
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── app.routes.ts
│   ├── assets/
│   │   ├── css/tailwind.css
│   │   └── images/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## Installation

### Prérequis
- Node.js (v18+)
- Angular CLI

### Étapes

1. **Installer les dépendances** :
```bash
cd frontend
npm install
```

2. **Configurer l'environnement** :
Modifier `src/environments/environment.ts` si nécessaire :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',  // URL du backend
  appName: 'MallConnect'
};
```

3. **Démarrer le serveur de développement** :
```bash
npm start
# ou
ng serve
```

L'application sera accessible sur `http://localhost:4200`

## Fonctionnalités

### Profil Admin
- Tableau de bord avec statistiques globales
- Gestion des boutiques (approbation/suspension)
- Gestion des événements promotionnels
- Plan du centre commercial
- Modération des produits

### Profil Boutique
- Système de caisse (POS)
- Gestion des produits et stocks
- Multi-caisses (ouvrir/fermer)
- Historique des ventes
- Tickets de caisse numériques avec QR Code
- Rapports journaliers (Z de caisse)
- Gestion des réservations

### Profil Client (Acheteur)
- Catalogue produits avec recherche
- Filtres par catégorie, étage, prix
- Favoris (boutiques et produits)
- Réservation en ligne (24h)
- Portefeuille de tickets numériques
- Historique d'achats

## Architecture

### Services
- **AuthService** : Gestion de l'authentification JWT
- **CartService** : Gestion du panier (localStorage)
- **ProductService** : API produits
- **StoreService** : API boutiques
- **OrderService** : API commandes/ventes
- **CashRegisterService** : API caisses

### Guards
- **AuthGuard** : Protection des routes
- **RoleGuard** : Vérification des rôles (Admin/Boutique/Client)

### Interceptors
- **AuthInterceptor** : Ajout automatique du token JWT

## Build Production

```bash
ng build --configuration production
```

Les fichiers seront générés dans `dist/mallconnect-frontend/`

## Scripts Disponibles

- `npm start` / `ng serve` : Serveur de développement
- `ng build` : Build de production
- `ng test` : Tests unitaires
- `ng lint` : Linting

## Conventions de Code

- Composants standalone pour de meilleures performances
- Lazy loading pour les routes
- Services injectables avec `providedIn: 'root'`
- Modèles TypeScript stricts
- Observables RxJS pour la gestion asynchrone
