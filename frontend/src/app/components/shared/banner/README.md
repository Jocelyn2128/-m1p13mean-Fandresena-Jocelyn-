# 📸 Guide: Ajouter des Images et Bannières dans MallConnect

## 🎯 Objective
Ce guide explique comment intégrer des images et bannières dans le frontend Angular du projet MallConnect.

---

## 📁 Structure des fichiers créés

```
frontend/src/app/components/shared/banner/
├── banner.component.ts           ← Composant bannière réutilisable
├── GUIDE_IMAGES_BANNIERES.ts     ← Guide complet avec 6 exemples
└── README.md                      ← Ce fichier

frontend/src/app/components/catalog/
├── catalog-with-banner.example.ts ← Exemple d'intégration complète

frontend/src/assets/images/        ← Images statiques à créer
├── hero-catalog.jpg
├── banner-1.jpg
├── banner-2.jpg
├── placeholder-product.png
└── default-store-logo.png
```

---

## 🚀 Démarrage rapide

### Étape 1: Créer les dossiers nécessaires
```bash
# Dans le terminal
mkdir -p frontend/src/assets/images
mkdir -p backend/uploads
```

### Étape 2: Ajouter les images statiques
- Placez vos images dans `frontend/src/assets/images/`
- Images recommandées:
  - `hero-catalog.jpg` (1920x600px minimum)
  - `placeholder-product.png` (400x400px)
  - `placeholder-store.png` (300x300px)
  - `default-store-logo.png` (256x256px)
  - `default-store-cover.jpg` (1200x300px)

### Étape 3: Importer le composant bannière
```typescript
import { BannerComponent } from '@app/components/shared/banner/banner.component';

@Component({
  imports: [BannerComponent]
})
```

### Étape 4: Utiliser la bannière
```html
<app-banner 
  imageUrl="assets/images/hero-catalog.jpg"
  title="Titre de la bannière"
  subtitle="Sous-titre optionnel">
</app-banner>
```

---

## 🎨 6 Méthodes d'intégration

### 1️⃣ Bannière Hero Simple
**Utilisation:** Page d'accueil, section principale
```html
<app-banner 
  imageUrl="assets/images/hero.jpg"
  title="Bienvenue"
  [overlayOpacity]="0.4">
</app-banner>
```

### 2️⃣ Images de Produits (Dynamiques)
**Utilisation:** Grille de produits
```html
<img 
  [src]="getProductImageUrl(product)"
  [alt]="product.name"
  (error)="onImageError($event)"
  class="w-full h-64 object-cover"
>
```

**TypeScript:**
```typescript
getProductImageUrl(product: any): string {
  return product?.image 
    ? `http://localhost:5000/uploads/${product.image}`
    : 'assets/images/placeholder-product.png';
}
```

### 3️⃣ Logo de Boutique
**Utilisation:** Détails boutique, recherche
```html
<img 
  [src]="getStoreLogoUrl(store)"
  class="w-24 h-24 rounded-full object-cover"
>
```

**TypeScript:**
```typescript
getStoreLogoUrl(store: any): string {
  return store?.logo 
    ? `http://localhost:5000/uploads/${store.logo}`
    : 'assets/images/default-store-logo.png';
}
```

### 4️⃣ Upload d'Image par l'Utilisateur
**Utilisation:** Formulaire de création produit

**TypeScript:**
```typescript
onFileSelected(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

uploadImage(): void {
  if (!this.selectedFile) return;
  const formData = new FormData();
  formData.append('file', this.selectedFile);
  
  this.productService.uploadImage(formData).subscribe(
    (response) => {
      this.form.patchValue({ image: response.filename });
    }
  );
}
```

**Template:**
```html
<input type="file" accept="image/*" (change)="onFileSelected($event)">
<img *ngIf="imagePreview" [src]="imagePreview" class="max-h-48">
<button (click)="uploadImage()" [disabled]="!selectedFile">Uploader</button>
```

### 5️⃣ Bannière Carrousel
**Utilisation:** Promotions tournantes

**TypeScript:**
```typescript
banners = [
  { image: 'assets/images/banner-1.jpg', title: 'Promo 1' },
  { image: 'assets/images/banner-2.jpg', title: 'Promo 2' },
  { image: 'assets/images/banner-3.jpg', title: 'Promo 3' }
];

currentIndex = 0;

nextBanner(): void {
  this.currentIndex = (this.currentIndex + 1) % this.banners.length;
}
```

**Template:**
```html
<app-banner 
  [imageUrl]="banners[currentIndex].image"
  [title]="banners[currentIndex].title">
</app-banner>
<button (click)="nextBanner()">Suivant →</button>
```

### 6️⃣ Bannière Parallax
**Utilisation:** Design premium

```html
<div 
  class="relative bg-cover bg-center h-96"
  [style.background-image]="'url(' + imageUrl + ')'"
  [style.background-attachment]="'fixed'"
>
  <div class="absolute inset-0 bg-black/40"></div>
  <div class="relative flex items-center h-full">
    <div class="text-white p-8">
      <h2 class="text-5xl font-bold">{{ title }}</h2>
    </div>
  </div>
</div>
```

---

## 🔧 Configuration Backend (uploads)

### Step 1: Installer multer
```bash
cd backend
npm install multer
```

### Step 2: Configurer dans server.js
```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Servir les fichiers uploadés
app.use('/uploads', express.static('uploads'));

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont acceptées'));
    }
  }
});

// Endpoint d'upload
app.post('/api/products/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' });
  }
  res.json({ 
    filename: req.file.filename, 
    path: `/uploads/${req.file.filename}` 
  });
});
```

### Step 3: Créer le dossier uploads
```bash
mkdir backend/uploads
echo "*.jpg" > backend/uploads/.gitkeep
```

---

## 📱 Propriétés du composant BannerComponent

| Propriété | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `imageUrl` | string | `assets/images/default-banner.jpg` | URL de l'image |
| `title` | string | `''` | Titre principal |
| `subtitle` | string | `''` | Sous-titre |
| `altText` | string | `'Bannière'` | Texte alternatif |
| `height` | string | `'24rem'` | Hauteur (en CSS) |
| `overlayOpacity` | number | `0.4` | Opacité overlay (0-1) |
| `showButton` | boolean | `false` | Afficher le bouton CTA |
| `buttonText` | string | `''` | Texte du bouton |
| `textAlignClass` | string | `'text-center'` | Classe d'alignement du texte |

---

## 🐛 Gestion des erreurs d'image

```typescript
onImageError(event: any): void {
  // Remplacer par placeholder en cas d'erreur
  event.target.src = 'assets/images/placeholder.png';
  console.warn('Erreur chargement:', event.target.src);
}
```

**Template:**
```html
<img 
  [src]="imageUrl"
  alt="Description"
  (error)="onImageError($event)"
>
```

---

## ⚡ Optimisations Performance

### Lazy Loading
```html
<img 
  src="..." 
  loading="lazy"
  alt="Description"
>
```

### Responsive Images
```html
<img 
  srcset="
    assets/images/banner-small.jpg 640w,
    assets/images/banner-medium.jpg 1024w,
    assets/images/banner-large.jpg 1920w
  "
  sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
  src="assets/images/banner.jpg"
  alt="Banner"
>
```

### WebP avec fallback
```html
<picture>
  <source srcset="assets/images/banner.webp" type="image/webp">
  <source srcset="assets/images/banner.jpg" type="image/jpeg">
  <img src="assets/images/banner.jpg" alt="Banner">
</picture>
```

---

## 🎯 Cas d'usage courants

### Page d'accueil
```html
<app-banner 
  imageUrl="assets/images/hero.jpg"
  title="Bienvenue sur MallConnect"
  subtitle="Découvrez les meilleures boutiques"
  [showButton]="true"
  buttonText="Commencer">
</app-banner>
```

### Catalogue produits
```html
<div class="grid grid-cols-4 gap-4">
  <div *ngFor="let product of products">
    <img [src]="getProductImageUrl(product)" alt="">
  </div>
</div>
```

### Détail boutique
```html
<img [src]="getStoreCoverUrl(store)" class="w-full h-40 object-cover">
<img [src]="getStoreLogoUrl(store)" class="w-24 h-24 rounded-full">
```

---

## 📚 Fichiers de référence

- **Composant bannière:** `shared/banner/banner.component.ts`
- **Guide complet:** `shared/banner/GUIDE_IMAGES_BANNIERES.ts`
- **Exemple intégration:** `catalog/catalog-with-banner.example.ts`
- **Documentation:** `fonctionnalites.md`

---

## ❓ FAQ

**Q: Quelle est la taille max d'une image?**
A: Par défaut 5MB (configurable dans multer)

**Q: Formats supportés?**
A: JPG, PNG, WebP, GIF (images seulement)

**Q: Ma bannière n'affiche pas?**
A: Vérifiez le chemin (relatif vs absolu) et les permissions du fichier

**Q: Les images uploadées sont lentes?**
A: Optimisez-les avec un outil comme ImageOptim avant l'upload

**Q: Comment faire un carrousel?**
A: Voir l'exemple #5 dans le guide

---

## 🔗 Ressources utiles

- [Angular Images Documentation](https://angular.io/guide/image-optimization)
- [Tailwind CSS Images](https://tailwindcss.com/docs/content-configuration)
- [Multer Documentation](https://github.com/expressjs/multer)
- [WebP Converter](https://cloudconvert.com/jpg-to-webp)

---

**Version:** 1.0.0  
**Date:** 28 Février 2026  
**Statut:** ✅ Prêt à l'emploi
