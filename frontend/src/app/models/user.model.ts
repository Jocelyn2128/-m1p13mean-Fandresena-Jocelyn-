// User Model
export interface User {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'ADMIN_MALL' | 'BOUTIQUE' | 'ACHETEUR';
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'ADMIN_MALL' | 'BOUTIQUE' | 'ACHETEUR';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}
