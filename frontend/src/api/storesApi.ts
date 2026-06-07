import axiosInstance from './axiosInstance';
import type { Store, MyStore } from '../types';

interface StoreFilters {
  name?: string;
  address?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

interface CreateStorePayload {
  name: string;
  email: string;
  address: string;
  ownerId: number;
}

export const getStores = (filters?: StoreFilters) =>
  axiosInstance.get<{ success: boolean; data: Store[] }>('/stores', { params: filters });

export const getStoreById = (id: number) =>
  axiosInstance.get<{ success: boolean; data: Store }>(`/stores/${id}`);

export const getMyStore = () =>
  axiosInstance.get<{ success: boolean; data: MyStore }>('/stores/mine');

export const createStore = (payload: CreateStorePayload) =>
  axiosInstance.post<{ success: boolean; data: Store }>('/stores', payload);
