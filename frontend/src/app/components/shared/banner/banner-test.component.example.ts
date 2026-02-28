import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../shared/banner/banner.component';

/**
 * 🧪 COMPOSANT DE TEST - Bannières
 * 
 * Utilise ce composant pour tester les bannières
 * Importe-le dans appRoutes ou ajoute-le à un template
 */

@Component({
  selector: 'app-banner-test',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="max-w-7xl mx-auto px-4">
        
        <!-- En-tête -->
        <h1 class="text-4xl font-bold mb-8 text-gray-800">🧪 Test des Bannières</h1>

        <!-- TEST 1: Bannière par défaut -->
        <div class="mb-12 bg-white p-6 rounded-lg shadow">
          <h2 class="text-2xl font-bold mb-4 text-blue-600">Test 1: Bannière par défaut (DEVRAIT MARCHER)</h2>
          <p class="text-gray-600 mb-4">Utilise hero-catalog.svg (fichier qui existe)</p>
          <app-banner></app-banner>
        </div>

        <!-- TEST 2: Bannière avec titre et sous-titre -->
        <div class="mb-12 bg-white p-6 rounded-lg shadow">
          <h2 class="text-2xl font-bold mb-4 text-blue-600">Test 2: Avec titre et sous-titre</h2>
          <p class="text-gray-600 mb-4">Affiche du texte sur la bannière</p>
          <app-banner 
            title="Bienvenue sur MallConnect" 
            subtitle="Découvrez les meilleures boutiques">
          </app-banner>
        </div>

        <!-- TEST 3: Bannière avec image SVG spécifique -->
        <div class="mb-12 bg-white p-6 rounded-lg shadow">
          <h2 class="text-2xl font-bold mb-4 text-blue-600">Test 3: Image SVG Spécifique</h2>
          <p class="text-gray-600 mb-4">imageUrl: assets/images/banner.svg</p>
          <app-banner 
            imageUrl="assets/images/banner.svg"
            title="Bannière SVG"
            subtitle="Test avec l'image banner.svg">
          </app-banner>
        </div>

        <!-- TEST 4: Bannière avec hauteur customisée -->
        <div class="mb-12 bg-white p-6 rounded-lg shadow">
          <h2 class="text-2xl font-bold mb-4 text-blue-600">Test 4: Hauteur Customisée</h2>
          <p class="text-gray-600 mb-4">height: 32rem (plus grande)</p>
          <app-banner 
            imageUrl="assets/images/hero-catalog.svg"
            title="Grande Bannière"
            subtitle="Plus précisément dimensionnée"
            height="32rem"
            [overlayOpacity]="0.3">
          </app-banner>
        </div>

        <!-- TEST 5: Bannière avec bouton -->
        <div class="mb-12 bg-white p-6 rounded-lg shadow">
          <h2 class="text-2xl font-bold mb-4 text-blue-600">Test 5: Avec Bouton CTA</h2>
          <p class="text-gray-600 mb-4">showButton: true, buttonText: "Cliquez ici"</p>
          <app-banner 
            imageUrl="assets/images/banner.svg"
            title="Appel à l'Action"
            subtitle="Cliquez le bouton en bas"
            [showButton]="true"
            buttonText="🚀 Commencer"
            [overlayOpacity]="0.4">
          </app-banner>
        </div>

        <!-- TEST 6: Bannière légère (overlay minimal) -->
        <div class="mb-12 bg-white p-6 rounded-lg shadow">
          <h2 class="text-2xl font-bold mb-4 text-blue-600">Test 6: Overlay Minimum</h2>
          <p class="text-gray-600 mb-4">overlayOpacity: 0.1 (très léger)</p>
          <app-banner 
            imageUrl="assets/images/default-store-cover.svg"
            title="Légère"
            subtitle="Image bien visible"
            [overlayOpacity]="0.1">
          </app-banner>
        </div>

        <!-- TEST 7: Bannière avec overlay fort -->
        <div class="mb-12 bg-white p-6 rounded-lg shadow">
          <h2 class="text-2xl font-bold mb-4 text-blue-600">Test 7: Overlay Fort</h2>
          <p class="text-gray-600 mb-4">overlayOpacity: 0.7 (très opaque)</p>
          <app-banner 
            imageUrl="assets/images/hero-catalog.svg"
            title="Très Contraste"
            subtitle="Overlay très fort pour lisibilité"
            [overlayOpacity]="0.7">
          </app-banner>
        </div>

        <!-- TEST 8: Bannière petite (comme section) -->
        <div class="mb-12 bg-white p-6 rounded-lg shadow">
          <h2 class="text-2xl font-bold mb-4 text-blue-600">Test 8: Mini Bannière</h2>
          <p class="text-gray-600 mb-4">height: 12rem (petite)</p>
          <app-banner 
            imageUrl="assets/images/banner.svg"
            title="Mini"
            height="12rem"
            [overlayOpacity]="0.5">
          </app-banner>
        </div>

        <!-- INFORMATIONS DE DEBUG -->
        <div class="mb-12 bg-yellow-50 border-2 border-yellow-300 p-6 rounded-lg">
          <h2 class="text-2xl font-bold mb-4 text-yellow-800">📋 Informations Debug</h2>
          
          <div class="space-y-4">
            <div>
              <h3 class="font-bold text-lg">Fichiers d'images disponibles:</h3>
              <ul class="list-disc ml-6 text-gray-700 mt-2">
                <li>✅ assets/images/hero-catalog.svg</li>
                <li>✅ assets/images/banner.svg</li>
                <li>✅ assets/images/default-store-cover.svg</li>
                <li>✅ assets/images/default-store-logo.svg</li>
                <li>✅ assets/images/placeholder-product.svg</li>
              </ul>
            </div>

            <div>
              <h3 class="font-bold text-lg">Si rien ne s'affiche:</h3>
              <ol class="list-decimal ml-6 text-gray-700 mt-2">
                <li>Ouvrir DevTools (F12)</li>
                <li>Aller à: Console</li>
                <li>Chercher les erreurs 404</li>
                <li>Vérifier: Network tab pour les images</li>
                <li>Vérifier: Elements tab pour voir la structure HTML</li>
                <li>Recharger: Ctrl+F5 (cache busting)</li>
              </ol>
            </div>

            <div>
              <h3 class="font-bold text-lg">Commandes utiles:</h3>
              <code class="block bg-gray-200 p-2 mt-2 rounded">ng serve --poll=2000</code>
            </div>
          </div>
        </div>

        <!-- RÉSULTATS -->
        <div class="mb-12 bg-green-50 border-2 border-green-300 p-6 rounded-lg">
          <h2 class="text-2xl font-bold mb-4 text-green-800">✅ Résultats Attendus</h2>
          
          <div class="space-y-2 text-gray-700">
            <p>✓ Tous les tests CI-DESSUS devraient montrer une bannière</p>
            <p>✓ Si aucune n'apparaît → consulter DIAGNOSTIC_BANNIERES.ts</p>
            <p>✓ Les images doivent être dans: src/assets/images/</p>
            <p>✓ Les chemins sont relatifs à: src/</p>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class BannerTestComponent {
  constructor() {
    console.log('🧪 Composant Test Bannières chargé');
  }
}
