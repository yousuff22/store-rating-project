import axiosInstance from './axiosInstance';
import type { Rater } from '../types';

export const upsertRating = (storeId: number, value: number) =>
  axiosInstance.post('/ratings', { storeId, value });

export const getRatingsForStore = (storeId: number) =>
  axiosInstance.get<{ success: boolean; data: Rater[] }>(`/ratings/store/${storeId}`);
