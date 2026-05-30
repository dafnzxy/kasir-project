/**
 * BukuCuan SaaS TypeScript Types
 */

export type UserRole = 'owner' | 'cashier' | 'supplier';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  businessName?: string;
  supplierId?: string; // Links user to a supplier if role is 'supplier'
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  autoNotifyEnabled: boolean;
  autoNotifyTemplate: string; // Notification template for auto reorders
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  costPrice: number; // Purchase price from supplier (HPP)
  sellingPrice: number; // Retail selling price
  stock: number;
  minStock: number; // Minimum stock alerting threshold
  supplierId: string; // Linked supplier
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  amount: number;
  category: string; // e.g. 'Penjualan', 'Listrik & Air', 'Gaji Karyawan', 'Restock Barang'
  description: string;
  paymentMethod: 'Tunai' | 'QRIS' | 'Transfer Bank' | 'Debit';
  createdBy: string; // User Name
  productId?: string; // Optional linked product (if sale/purchase)
  quantity?: number; // Optional quantity
}

export type ReorderStatus = 'draft' | 'pending' | 'sent' | 'received';

export interface ReorderOrder {
  id: string;
  date: string;
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  estimatedCost: number;
  status: ReorderStatus;
  messageText: string;
  sentAt?: string;
  notificationType: 'whatsapp' | 'email';
}

export interface ProfitReport {
  date: string; // YYYY-MM-DD
  totalRevenue: number; // Total Sales
  totalCostOfGoods: number; // Cost price of items sold (HPP)
  totalOperatingExpense: number; // General cash outflows
  grossProfit: number; // totalRevenue - totalCostOfGoods
  netProfit: number; // grossProfit - totalOperatingExpense
  transactionCount: number;
}
