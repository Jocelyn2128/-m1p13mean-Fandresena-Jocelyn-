/**
 * GUIDE D'UTILISATION - IMAGES ET BANNIÈRES
 * 
 * Ce fichier montre différents exemples d'intégration d'images
 * et bannières dans le projet Angular MallConnect
 */

// ============================================
// 1. BANNIÈRE SIMPLE (composant réutilisable)
// ============================================

import { BannerComponent } from '@shared/banner/banner.component';

// Dans votre composant:
export class CatalogComponent {
  readonly heroBannerImage = 'assets/images/hero-catalog.jpg';
}

// Dans le template:
/*
<app-banner 
  [imageUrl]="heroBannerImage"
  title="Nos Produits"
  subtitle="Découvrez notre large sélection"
  height="28rem"
  [overlayOpacity]="0.3"
  [showButton]="false">
</app-banner>
*/

// ============================================
// 2. IMAGES DE PRODUITS (dynamiques)
// ============================================

export class ProductGridComponent {
  products: any[] = [];

  getProductImageUrl(product: any): string {
    return product?.image 
      ? `https://m1p13mean-fandresena-jocelyn.onrender.com/uploads/${product.image}`
      : 'assets/images/placeholder-product.png';
  }

  onImageError(event: any): void {
    // Afficher une image par défaut en cas d'erreur
    event.target.src = 'assets/images/placeholder-product.png';
  }
}

// Template:
/*
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <div *ngFor="let product of products" class="card">
    <img 
      [src]="getProductImageUrl(product)"
      [alt]="product.name"
      class="w-full h-64 object-cover rounded-t-lg"
      (error)="onImageError($event)"
    >
    <div class="p-4">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price | currency }}</p>
    </div>
  </div>
</div>
*/

// ============================================
// 3. LOGO DE BOUTIQUE
// ============================================

export class StoreDetailComponent {
  store: any;

  get storeLogoUrl(): string {
    return this.store?.logo 
      ? `https://m1p13mean-fandresena-jocelyn.onrender.com/uploads/${this.store.logo}`
      : 'assets/images/default-store-logo.png';
  }

  get storeImageUrl(): string {
    return this.store?.coverImage 
      ? `https://m1p13mean-fandresena-jocelyn.onrender.com/uploads/${this.store.coverImage}`
      : 'assets/images/default-store-cover.jpg';
  }
}

// Template:
/*
<div class="store-header">
  <img 
    [src]="storeImageUrl" 
    alt="Couverture boutique"
    class="w-full h-40 object-cover"
  >
  <div class="flex items-end gap-4 px-6 pb-4">
    <img 
      [src]="storeLogoUrl" 
      [alt]="store.name"
      class="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
    >
    <div>
      <h1 class="text-3xl font-bold">{{ store.name }}</h1>
      <p class="text-gray-500">{{ store.description }}</p>
    </div>
  </div>
</div>
*/

// ============================================
// 4. UPLOAD D'IMAGE (formulaire)
// ============================================

export class ProductFormComponent {
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;

      // Aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadImage(): Promise<void> {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    try {
      // L'interceptor ajoutera le token JWT automatiquement
      const response = await this.productService
        .uploadImage(formData)
        .toPromise();
      console.log('Image uploadée:', response.filename);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    }
  }
}

// Template:
/*
<div class="form-group">
  <label>Image du produit</label>
  
  <!-- Aperçu -->
  <div *ngIf="imagePreview" class="mb-4">
    <img [src]="imagePreview" class="max-h-48 rounded-lg shadow">
  </div>
  
  <!-- Upload -->
  <input 
    type="file" 
    accept="image/*"
    (change)="onFileSelected($event)"
    class="form-control"
  >
  
  <!-- Bouton upload -->
  <button 
    (click)="uploadImage()" 
    [disabled]="!selectedFile"
    class="btn btn-primary mt-2"
  >
    Uploader
  </button>
</div>
*/

// ============================================
// 5. BANNIÈRE CARROUSEL (bannières multiples)
// ============================================

export class HomeComponent {
  banners = [
    {
      image: 'assets/images/banner-1.jpg',
      title: 'Offre de bienvenue',
      subtitle: '20% sur votre première commande'
    },
    {
      image: 'assets/images/banner-2.jpg',
      title: 'Nouvelles boutiques',
      subtitle: 'Découvrez les commerçants du mois'
    },
    {
      image: 'assets/images/banner-3.jpg',
      title: 'Livraison rapide',
      subtitle: 'Gratuite à partir de 50 000 Ar'
    }
  ];

  currentBannerIndex = 0;

  get currentBanner() {
    return this.banners[this.currentBannerIndex];
  }

  nextBanner(): void {
    this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
  }

  previousBanner(): void {
    this.currentBannerIndex = 
      (this.currentBannerIndex - 1 + this.banners.length) % this.banners.length;
  }
}

// Template:
/*
<div class="banner-container">
  <app-banner 
    [imageUrl]="currentBanner.image"
    [title]="currentBanner.title"
    [subtitle]="currentBanner.subtitle"
  ></app-banner>
  
  <div class="banner-controls mt-4">
    <button (click)="previousBanner()" class="btn">← Précédent</button>
    <span>{{ currentBannerIndex + 1 }} / {{ banners.length }}</span>
    <button (click)="nextBanner()" class="btn">Suivant →</button>
  </div>
</div>
*/

// ============================================
// 6. STRUCTURE DES DOSSIERS À CRÉER
// ============================================

/*
frontend/src/assets/
├── images/
│   ├── hero-catalog.jpg
│   ├── hero-boutique.jpg
│   ├── banner-1.jpg
│   ├── banner-2.jpg
│   ├── banner-3.jpg
│   ├── placeholder-product.png
│   ├── placeholder-store.png
│   ├── default-store-logo.png
│   └── default-store-cover.jpg
└── css/
    └── tailwind.css

backend/uploads/
├── products/
│   └── [générés automatiquement]
├── stores/
│   └── [générés automatiquement]
└── users/
    └── [générés automatiquement]
*/

// ============================================
// 7. CONFIGURATION BACKEND (pour uploads)
// ============================================

/*
// backend/server.js
app.use('/uploads', express.static('uploads'));

// Middleware pour upload
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Endpoint d'upload
app.post('/api/products/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});
*/
