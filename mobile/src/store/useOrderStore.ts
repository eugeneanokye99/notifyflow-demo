import { create } from 'zustand';

type OrderState = {
  selectedOrderId: number | null;
  setSelectedOrderId: (selectedOrderId: number | null) => void;
};

export const useOrderStore = create<OrderState>((set) => ({
  selectedOrderId: null,
  setSelectedOrderId: (selectedOrderId) => set({ selectedOrderId })
}));
