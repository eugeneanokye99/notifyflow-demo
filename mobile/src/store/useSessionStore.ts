import { create } from 'zustand';
import { User } from '../types';

type SessionState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
}));
