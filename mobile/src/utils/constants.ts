import { OrderStatus, Role } from '../types';

export const API_BASE_URL = 'http://localhost:4000';

export const ROLES: { CUSTOMER: Role; STAFF: Role } = {
  CUSTOMER: 'customer',
  STAFF: 'staff'
};

export const ORDER_STATUS: { CREATED: OrderStatus; ACCEPTED: OrderStatus; READY: OrderStatus } = {
  CREATED: 'created',
  ACCEPTED: 'accepted',
  READY: 'ready'
};
