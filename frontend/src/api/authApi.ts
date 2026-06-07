import axiosInstance from './axiosInstance';
import type { LoginResponse, AuthUser } from '../types';

export const login = (email: string, password: string) =>
  axiosInstance.post<{ success: boolean; data: LoginResponse }>('/auth/login', { email, password });

export const signup = (data: { name: string; email: string; address: string; password: string }) =>
  axiosInstance.post<{ success: boolean; data: AuthUser }>('/auth/signup', data);

export const updatePassword = (currentPassword: string, newPassword: string) =>
  axiosInstance.patch('/auth/password', { currentPassword, newPassword });
