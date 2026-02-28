# 🖼️ Images et Ressources Visuelles

Ce dossier contient les images statiques du projet MallConnect.

## 📋 Fichiers actuels

| Fichier | Taille | Usage | Format |
|---------|--------|-------|--------|
| `placeholder-product.svg` | 400×400 | Images produits par défaut | SVG |
| `default-store-logo.svg` | 256×256 | Logo boutique par défaut | SVG |
| `default-store-cover.svg` | 1200×300 | Couverture boutique par défaut | SVG |
| `hero-catalog.svg` | 1920×600 | Bannière hero d'accueil | SVG |

## 🎨 Fichiers à ajouter

Pour une meilleure expérience, vous pouvez ajouter vos propres images en remplaçant les placeholders :

```
images/
├── hero-catalog.jpg          ← Remplacer par votre bannière (1920x600)
├── hero-boutique.jpg         ← Boutique hero banner (1920x600)
├── banner-promo-1.jpg        ← Bannière promo 1 (1920x600)
├── banner-promo-2.jpg        ← Bannière promo 2 (1920x600)
├── banner-promo-3.jpg        ← Bannière promo 3 (1920x600)
├── placeholder-product.png   ← Remplacer par image produit (400x400)
├── placeholder-store.png     ← Remplacer par image boutique (800x600)
├── default-store-logo.png    ← Remplacer par logo boutique (256x256)
├── default-store-cover.jpg   ← Remplacer par couverture (1200x300)
├── logo-main.png             ← Logo principal (500x500)
└── favicon.ico               ← Favicône du site
```

## 🔄 Comment remplacer les images

### Méthode 1: Direct dans les fichiers HTML
```html
<!-- Avant -->
<img src="assets/images/hero-catalog.svg" alt="Hero">

<!-- Après -->
<img src="assets/images/hero-catalog.jpg" alt="Hero">
```

### Méthode 2: Importer depuis TypeScript
```typescript
export class MyComponent {
  heroBannerImage = 'assets/images/hero-catalog.jpg';
}
```

## 📐 Recommandations de taille

| Type | Résolution | Format | Taille max |
|------|-----------|--------|-----------|
| Bannière hero | 1920×600 | JPG/WebP | 200KB |
| Couverture boutique | 1200×300 | JPG/WebP | 100KB |
| Logo boutique | 256×256 | PNG/SVG | 50KB |
| Image produit | 400×400 | JPG/WebP | 80KB |
| Favicon | 32×32 | ICO | 10KB |

## 🖼️ Outils de compression

- [TinyJPG](https://tinyjpg.com/) - Compression JPG sans perte
- [Squoosh](https://squoosh.app/) - Outil Google de compression
- [ImageOptim](https://imageoptim.com/) - Mac
- [FileOptimizer](https://nikkhokkho.sourceforge.io/) - Windows

## 🎯 Bonnes pratiques

✅ **À faire:**
- Optimiser les images avant upload
- Utiliser WebP quand possible
- Respecter les dimensions recommandées
- Ajouter des alt-text descriptifs

❌ **À éviter:**
- Images non optimisées (ralentissent le site)
- Formats incompatibles
- Images inversées ou mal cadrées
- Noms de fichiers en majuscules ou avec espaces

## 📝 Exemple d'ajout d'image

### 1. Ajouter l'image dans le dossier
```bash
# Placer votre image JPG
cp mon-image.jpg assets/images/hero-catalog.jpg
```

### 2. Référencer dans le code
```typescript
export class CatalogComponent {
  heroBanner = 'assets/images/hero-catalog.jpg';
}
```

### 3. Afficher dans le template
```html
<app-banner 
  [imageUrl]="heroBanner"
  title="Titre"
  subtitle="Sous-titre">
</app-banner>
```

## 🔗 Fichiers liés

- [Guide complet des images](../shared/banner/README.md)
- [Composant bannière](../shared/banner/banner.component.ts)
- [Exemples d'implémentation](../catalog/catalog-with-banner.example.ts)

---

**Mise à jour:** 28 Février 2026  
**Version:** 1.0.0
