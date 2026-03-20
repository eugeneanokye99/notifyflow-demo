export type Role = 'customer' | 'staff';
export type OrderStatus = 'created' | 'accepted' | 'ready';

export type User = {
  id: number;
  name: string;
  role: Role;
  isActive: boolean;
  pushToken: string | null;
  createdAt: string;
  lastSeenAt?: string;
};

export type Order = {
  id: number;
  customerId: number;
  description: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  updatedByStaffId?: number;
};

export type InAppNotification = {
  id: number;
  userId: number;
  title: string;
  message: string;
  data: Record<string, unknown>;
  read: boolean;
  channel: 'in-app';
  createdAt: string;
};
