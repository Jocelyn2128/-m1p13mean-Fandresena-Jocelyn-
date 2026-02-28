import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full overflow-hidden" [style.height]="height">
      <!-- Image de fond -->
      <img 
        [src]="imageUrl" 
        [alt]="altText"
        class="w-full h-full object-cover"
        loading="lazy"
        (error)="onImageError($event)"
      >
      
      <!-- Overlay transparent (inline rgba pour éviter problème de purge Tailwind) -->
      <div class="absolute inset-0" [style.background-color]="'rgba(0,0,0,' + overlayOpacity + ')'">
        <!-- Contenu centré -->
        <div class="flex items-center justify-center h-full px-4">
          <div [ngClass]="textAlignClass">
            <!-- Titre -->
        <h1 *ngIf="title" class="text-4xl md:text-5xl font-bold text-white mb-4">
              {{ title }}
            </h1>
            
            <!-- Sous-titre -->
            <p *ngIf="subtitle" class="text-lg md:text-xl text-white opacity-90 mb-6">
              {{ subtitle }}
            </p>
            
            <!-- Bouton CTA (optionnel) -->
            <button 
              *ngIf="showButton && buttonText"
              (click)="onButtonClick()"
              class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              {{ buttonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BannerComponent {
  @Input() imageUrl: string = 'assets/images/banner.png';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() altText: string = 'Bannière';
  @Input() height: string = '24rem'; // h-96 par défaut (384px)
  @Input() overlayOpacity: number = 0.4; // 0 à 1
  @Input() showButton: boolean = false;
  @Input() buttonText: string = '';
  @Input() textAlignClass: string = 'text-center';

  get overlayClass(): string {
    const opacity = Math.round(this.overlayOpacity * 100);
    return `bg-black bg-opacity-${opacity}`;
  }

  onButtonClick(): void {
    console.log('Bouton cliqué');
  }

  onImageError(event: any): void {
    // Fallback en cas d'erreur
    if (event.target.src !== 'assets/images/banner.png') {
      event.target.src = 'assets/images/banner.png';
    }
  }
}
