import { apiClient } from './client';
import { InAppNotification, User } from '../types';

export async function setPresence({ userId, isActive }: { userId: number; isActive: boolean }): Promise<User> {
  const response = await apiClient.post('/presence', { userId, isActive });
  return response.data.user;
}

export async function fetchInAppNotifications(userId: number): Promise<InAppNotification[]> {
  const response = await apiClient.get(`/notifications/${userId}`);
  return response.data.notifications || [];
}
