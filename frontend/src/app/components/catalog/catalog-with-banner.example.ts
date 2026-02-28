/**
 * EXEMPLE D'INTÉGRATION - Catalogue avec Bannière
 * 
 * Cet exemple montre comment ajouter une bannière avec images
 * dans le composant catalogue
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../shared/banner/banner.component';

@Component({
  selector: 'app-catalog-with-banner',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      
      <!-- ========== BANNIÈRE HERO ========== -->
      <app-banner 
        imageUrl="assets/images/hero-catalog.jpg"
        title="Bienvenue sur MallConnect"
        subtitle="Découvrez les meilleures boutiques et produits"
        height="28rem"
        [overlayOpacity]="0.35"
        [showButton]="true"
        buttonText="Voir nos produits">
      </app-banner>

      <!-- ========== SECTION PRODUITS ========== -->
      <section class="py-12">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-3xl font-bold mb-8">Produits en vedette</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div 
              *ngFor="let product of products" 
              class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <!-- Image du produit -->
              <div class="relative h-48 bg-gray-200 overflow-hidden">
                <img 
                  [src]="getProductImageUrl(product)"
                  [alt]="product.name"
                  class="w-full h-full object-cover hover:scale-110 transition duration-300"
                  (error)="onImageError($event)"
                >
                <!-- Badge de catégorie -->
                <div class="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {{ product.category }}
                </div>
              </div>
              
              <!-- Info produit -->
              <div class="p-4">
                <h3 class="font-bold text-lg truncate">{{ product.name }}</h3>
                <p class="text-gray-500 text-sm mb-2 line-clamp-2">{{ product.description }}</p>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-lg text-blue-600">{{ product.price | number:'1.0-0' }} Ar</span>
                  <button class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========== SECTION BOUTIQUES ========== -->
      <section class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-3xl font-bold mb-8">Nos boutiques partenaires</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              *ngFor="let store of stores"
              class="rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <!-- Image de couverture -->
              <div class="relative h-32 bg-gray-300">
                <img 
                  [src]="getStoreCoverUrl(store)"
                  alt="Couverture boutique"
                  class="w-full h-full object-cover"
                  (error)="onImageError($event)"
                >
              </div>
              
              <!-- Info boutique -->
              <div class="p-4">
                <div class="flex items-center gap-3 mb-3">
                  <!-- Logo boutique -->
                  <img 
                    [src]="getStoreLogoUrl(store)"
                    [alt]="store.name"
                    class="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
                    (error)="onImageError($event)"
                  >
                  <div>
                    <h3 class="font-bold text-lg">{{ store.name }}</h3>
                    <p class="text-gray-500 text-xs">{{ store.category }}</p>
                  </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ store.description }}</p>
                
                <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded transition">
                  Voir la boutique →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    /* Utilitaires Tailwind personnalisés */
    :host {
      display: block;
    }
    
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class CatalogWithBannerComponent implements OnInit {
  
  products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      description: 'Smartphone dernière génération',
      category: 'Électronique',
      price: 4500000,
      image: null // Si null, utilise placeholder
    },
    {
      id: 2,
      name: 'Laptop Dell XPS',
      description: 'Ordinateur portable performant',
      category: 'Informatique',
      price: 2800000,
      image: null
    }
  ];

  stores = [
    {
      id: 1,
      name: 'ElectroShop',
      description: 'Meilleur choix en électronique',
      category: 'Électronique',
      logo: null,
      coverImage: null
    },
    {
      id: 2,
      name: 'TechWorld',
      description: 'Informatique et accessoires',
      category: 'Informatique',
      logo: null,
      coverImage: null
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Charger les produits et boutiques
    // this.chargerProduits();
    // this.chargerBoutiques();
  }

  /**
   * Retourne l'URL de l'image du produit
   * Utilise le placeholder si pas d'image
   */
  getProductImageUrl(product: any): string {
    return product?.image 
      ? `http://localhost:5000/uploads/${product.image}`
      : 'assets/images/placeholder-product.png';
  }

  /**
   * Retourne l'URL du logo de la boutique
   */
  getStoreLogoUrl(store: any): string {
    return store?.logo 
      ? `http://localhost:5000/uploads/${store.logo}`
      : 'assets/images/default-store-logo.png';
  }

  /**
   * Retourne l'URL de couverture de la boutique
   */
  getStoreCoverUrl(store: any): string {
    return store?.coverImage 
      ? `http://localhost:5000/uploads/${store.coverImage}`
      : 'assets/images/default-store-cover.jpg';
  }

  /**
   * Gère les erreurs de chargement d'image
   */
  onImageError(event: any): void {
    console.warn('Erreur de chargement d\'image:', event.target.src);
    event.target.src = 'assets/images/placeholder-image.png';
  }
}
