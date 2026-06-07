export type Role = 'ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  address: string;
  role: Role;
  createdAt: string;
}

export interface User extends AuthUser {
  storeAvgRating?: number | null;
}

export interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  ownerId: number;
  avgRating: number | null;
  totalRatings: number;
  userRating?: number | null;
  createdAt?: string;
}

export interface Rater {
  id: number;
  name: string;
  email: string;
  rating: number;
  ratedAt: string;
}

export interface MyStore extends Omit<Store, 'totalRatings' | 'userRating'> {
  raters: Rater[];
}

export interface AdminStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
