export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface Order {
  _id?: string;
  storeId?: string;
  buyerId?: string | null;
  cashRegisterId?: string;
  items: OrderItem[];
  totalAmount: number;
  orderType: 'VENTE_DIRECTE' | 'RESERVATION' | 'COMMANDE_LIGNE';
  status: 'en_attente' | 'paye' | 'annule' | 'pret_pour_retrait' | 'retire';
  paymentMethod?: string;
  receiptNumber?: string;
  qrCode?: string;
  reservationExpiry?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
