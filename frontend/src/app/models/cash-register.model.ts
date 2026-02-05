export interface CashRegister {
  _id?: string;
  storeId?: string;
  registerName: string;
  status: 'ouvert' | 'ferme';
  currentBalance?: number;
  openedAt?: Date;
  closedAt?: Date;
  openedBy?: string;
  dailyReport?: {
    totalSales: number;
    paymentMethods: {
      [key: string]: number;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}
