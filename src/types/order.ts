export interface BaseEntity<T> {
  id: T;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export interface Product extends BaseEntity<string> {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface Customer extends BaseEntity<string> {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order extends BaseEntity<string> {
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateCustomerDTO = Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>;

export type CustomerSummary = Pick<Customer, 'id' | 'name' | 'phone'>;

export type OrderFilters = Record<string, string | number | boolean | undefined>;

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;
}
