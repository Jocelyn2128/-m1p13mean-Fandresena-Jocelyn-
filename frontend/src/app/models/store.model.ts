export interface Store {
  _id?: string;
  ownerId?: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  category: string;
  location: {
    floor: string;
    shopNumber: string;
  };
  acceptedPaymentMethods?: string[];
  openingHours?: string;
  status?: 'active' | 'suspended' | 'pending_approval';
  isApproved?: boolean;
  metrics?: {
    totalSales: number;
    totalVisits: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
