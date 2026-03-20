import { OrderStatus, Role } from '../types';

export const API_BASE_URL = 'https://notifyflow-demo.onrender.com';

export const ROLES: { CUSTOMER: Role; STAFF: Role } = {
  CUSTOMER: 'customer',
  STAFF: 'staff'
};

export const ORDER_STATUS = {
  CREATED: 'created',
  ACCEPTED: 'accepted',
  READY: 'ready'
} as const satisfies { CREATED: OrderStatus; ACCEPTED: OrderStatus; READY: OrderStatus };
