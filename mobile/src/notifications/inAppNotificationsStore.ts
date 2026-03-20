import { create } from 'zustand';
import { InAppNotification } from '../types';

type InAppNotificationsState = {
  notifications: InAppNotification[];
  setNotifications: (notifications: InAppNotification[]) => void;
  clearNotifications: () => void;
};

export const useInAppNotificationsStore = create<InAppNotificationsState>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  clearNotifications: () => set({ notifications: [] })
}));
