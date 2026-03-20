import { apiClient } from './client';
import { User } from '../types';

export async function loginWithRole({ name, role }: { name: string; role: 'customer' | 'staff' }): Promise<User> {
  const response = await apiClient.post('/auth', { name, role });
  return response.data.user;
}

export async function registerPushToken({ userId, pushToken }: { userId: number; pushToken: string }): Promise<User> {
  const response = await apiClient.post('/auth/push-token', { userId, pushToken });
  return response.data.user;
}
