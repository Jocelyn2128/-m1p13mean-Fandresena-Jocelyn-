export interface Product {
  _id?: string;
  storeId?: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  images?: string[];
  category: string;
  stockStatus?: 'disponible' | 'rupture' | 'precommande';
  stockQuantity?: number;
  lowStockThreshold?: number;
  promotion?: {
    isOnSale: boolean;
    discountPrice?: number;
    startDate?: Date;
    endDate?: Date;
  };
  isActive?: boolean;
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
