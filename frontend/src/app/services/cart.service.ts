import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const stored = localStorage.getItem('cart');
    if (stored) {
      this.cartItems.next(JSON.parse(stored));
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItems.next(items);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.saveCart([...currentItems]);
    } else {
      this.saveCart([...currentItems, { product, quantity }]);
    }
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems.value;
    this.saveCart(currentItems.filter(item => item.product._id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.product._id === productId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart([...currentItems]);
      }
    }
  }

  clearCart(): void {
    localStorage.removeItem('cart');
    this.cartItems.next([]);
  }

  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => {
      const price = item.product.promotion?.isOnSale && item.product.promotion.discountPrice
        ? item.product.promotion.discountPrice
        : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }

  getItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }
}
