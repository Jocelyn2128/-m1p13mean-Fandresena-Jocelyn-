import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private apiUrl = `${environment.apiUrl}/uploads`;

    constructor(private http: HttpClient) { }

    // =============================================
    // PRODUITS
    // =============================================

    /**
     * Ajouter des images à un produit (max 5)
     */
    addProductImages(productId: string, files: File[]): Observable<any> {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        return this.http.post(`${this.apiUrl}/products/${productId}/images`, formData);
    }

    /**
     * Remplacer toutes les images d'un produit
     */
    replaceProductImages(productId: string, files: File[]): Observable<any> {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        return this.http.put(`${this.apiUrl}/products/${productId}/images`, formData);
    }

    /**
     * Supprimer une image spécifique d'un produit
     */
    deleteProductImage(productId: string, imageUrl: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/products/${productId}/images`, {
            body: { imageUrl }
        });
    }

    // =============================================
    // BOUTIQUES
    // =============================================

    /**
     * Uploader/changer le logo d'une boutique
     */
    uploadStoreLogo(storeId: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('logo', file);
        return this.http.post(`${this.apiUrl}/stores/${storeId}/logo`, formData);
    }

    /**
     * Uploader/changer l'image de couverture d'une boutique
     */
    uploadStoreCover(storeId: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('cover', file);
        return this.http.post(`${this.apiUrl}/stores/${storeId}/cover`, formData);
    }
}
