import axiosInstance from './axiosInstance';
import type { AdminStats } from '../types';

export const getAdminStats = () =>
  axiosInstance.get<{ success: boolean; data: AdminStats }>('/admin/stats');
