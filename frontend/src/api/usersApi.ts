import axiosInstance from './axiosInstance';
import type { User } from '../types';

interface UserFilters {
  name?: string;
  email?: string;
  address?: string;
  role?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

interface CreateUserPayload {
  name: string;
  email: string;
  address: string;
  password: string;
  role?: 'NORMAL_USER' | 'STORE_OWNER';
}

export const getUsers = (filters?: UserFilters) =>
  axiosInstance.get<{ success: boolean; data: User[] }>('/users', { params: filters });

export const getUserById = (id: number) =>
  axiosInstance.get<{ success: boolean; data: User }>(`/users/${id}`);

export const createUser = (payload: CreateUserPayload) =>
  axiosInstance.post<{ success: boolean; data: User }>('/users', payload);

export const createAdmin = (payload: Omit<CreateUserPayload, 'role'>) =>
  axiosInstance.post<{ success: boolean; data: User }>('/users/admins', payload);
