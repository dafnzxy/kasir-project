import { Supplier, Product, Transaction, ReorderOrder } from '../types';

/**
 * Optimized PostgreSQL Schema DDL Script with indexes, constraints, and operational triggers.
 */
export const POSTGRES_DDL_SCRIPT = `-- =========================================================================
-- BUKUCUAN DATABASE SCHEMA - FULLY OPTIMIZED FOR UMKM & SUPPLIER OPERATIONS
-- PROD-READY POSTGRESQL DDL SCRIPT WITH INTEGRITY CONSTRAINTS & INDEXES
-- =========================================================================

-- 1. EXTENSIONS (For robust UUID generation)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM TYPES
CREATE TYPE user_role_enum AS ENUM ('owner', 'cashier', 'supplier');
CREATE TYPE transaction_type_enum AS ENUM ('income', 'expense');
CREATE TYPE reorder_status_enum AS ENUM ('draft', 'pending', 'sent', 'received');

-- 3. SUPPLIERS TABLE (Master Supplier Data)
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    auto_notify_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    auto_notify_template TEXT DEFAULT 'Yth [Supplier Name], Stok produk [Product Name] di toko kami tinggal [Current Stock] [Unit]. Mohon kirimkan restock sebanyak [Order Quantity] [Unit]. Terima kasih!' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. USERS TABLE (Role-Based authentication: Owner, Cashier, Supplier Contacts)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Encrypted using Bcrypt
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role user_role_enum NOT NULL,
    business_name VARCHAR(100), -- Applicable if role is Owner/Cashier
    supplier_id UUID, -- NULL for Owners, references suppliers table if Supplier
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- 5. PRODUCTS TABLE (Inventory management)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(20) DEFAULT 'pcs' NOT NULL,
    cost_price DECIMAL(12, 2) NOT NULL, -- HPP (Harga Pokok Pembelian)
    selling_price DECIMAL(12, 2) NOT NULL, -- Harga Jual
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock INT NOT NULL DEFAULT 5 CHECK (min_stock >= 0),
    supplier_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- 6. TRANSACTIONS TABLE (Double-entry Cash Ledger: Income & operational expenses)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    type transaction_type_enum NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL, -- e.g. 'Penjualan', 'Listrik', 'Gaji', 'Restock'
    description TEXT,
    payment_method VARCHAR(30) NOT NULL, -- e.g. 'Tunai', 'QRIS', 'Debit', 'Transfer'
    created_by_user_id UUID NOT NULL,
    product_id UUID, -- Optional link to product (e.g. for automatic sale logs)
    quantity INT CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- 7. REORDER_ORDERS TABLE (Supplier restock tracking and automated logging)
CREATE TABLE reorder_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    product_id UUID NOT NULL,
    supplier_id UUID NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    estimated_cost DECIMAL(15, 2) NOT NULL,
    status reorder_status_enum NOT NULL DEFAULT 'draft',
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    notification_type VARCHAR(20) CHECK (notification_type IN ('whatsapp', 'email')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- =========================================================================
-- DATABASE RELATIONSHIP OPTIMIZATION - INDEX LIST
-- Speed up queries for complex joins, supplier lookups, and profitability calculations
-- =========================================================================

-- Primary Foreign Key Indexes (Avoid full table scans on cascading deletions and join lookups)
CREATE INDEX idx_users_supplier ON users(supplier_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_transactions_product ON transactions(product_id);
CREATE INDEX idx_reorder_product ON reorder_orders(product_id);
CREATE INDEX idx_reorder_supplier ON reorder_orders(supplier_id);

-- Operational Performance Indexes (Accelerate filters on core SaaS workflows)
CREATE INDEX idx_products_sku ON products(sku); -- Faster barcode search and SKU validation
CREATE INDEX idx_products_stock_alert ON products(stock) WHERE stock <= min_stock; -- Lightning fast stock alerts query
CREATE INDEX idx_transactions_date ON transactions(date); -- Fast cashflow reporting across custom date ranges
CREATE INDEX idx_transactions_type ON transactions(type); -- Speed up revenue vs expense divisions
CREATE INDEX idx_reorder_status ON reorder_orders(status); -- Track orders filtered by status

-- =========================================================================
-- ADVANCED POSTGRES AUTOMATIC WORKFLOWTRIGGERS
-- =========================================================================

-- A. Auto Stock Deduction after sales transaction
CREATE OR REPLACE FUNCTION func_deduct_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'income' AND NEW.product_id IS NOT NULL THEN
        UPDATE products 
        SET stock = stock - NEW.quantity, updated_at = NOW()
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_on_sale_deduct_stock
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION func_deduct_product_stock();

-- B. Auto Updated At handler
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_suppliers_modtime BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
`;

// Pre-seeded high fidelity initial datasets for fully interactive live client state
export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'supp-1',
    name: 'PT Sinar Pangan Semesta',
    contactPerson: 'Budi Santoso',
    phone: '081234567890',
    email: 'kontak@sinarpangan.com',
    address: 'Kawasan Industri Jababeka Blok C-15, Cikarang, Bekasi',
    autoNotifyEnabled: true,
    autoNotifyTemplate: 'Yth [Supplier Name], Stok produk [Product Name] di toko kami tinggal [Current Stock] [Unit]. Mohon kirimkan restock sebanyak [Order Quantity] [Unit] seberat [Cost Price]. Terima kasih! - BukuCuan UMKM'
  },
  {
    id: 'supp-2',
    name: 'Sinar Abadi Distribusi Grosir',
    contactPerson: 'Dewi Lestari',
    phone: '085711223344',
    email: 'sales@sinarabadi.co.id',
    address: 'Jl. Gatot Subroto No. 42, Bandung',
    autoNotifyEnabled: true,
    autoNotifyTemplate: 'Pemberitahuan Otomatis BukuCuan: Pembelian darurat untuk [Product Name]. Stok menipis di angka [Current Stock]. Mohon dicarikan restock [Order Quantity] unit secepatnya ke alamat kami.'
  },
  {
    id: 'supp-3',
    name: 'CV Tani Sejahtera Mandiri',
    contactPerson: 'Eko Wahyudi',
    phone: '089988776655',
    email: 'info@tanisejahtera.org',
    address: 'Sentra Agrobisnis Tani Baru No. 12, Sleman, Yogyakarta',
    autoNotifyEnabled: false,
    autoNotifyTemplate: 'Auto Order CV Tani Sejahtera: [Product Name] qty [Order Quantity] pcs. Mohon dikonfirmasi.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Beras Premium Mentari 5kg',
    sku: 'BRS-MEN-5K',
    category: 'Sembako',
    unit: 'karung',
    costPrice: 65000,
    sellingPrice: 78000,
    stock: 45,
    minStock: 10,
    supplierId: 'supp-1'
  },
  {
    id: 'prod-2',
    name: 'Minyak Goreng SunCo 2L',
    sku: 'MYK-SUN-2L',
    category: 'Sembako',
    unit: 'pouch',
    costPrice: 29000,
    sellingPrice: 34500,
    stock: 6, // Low stock alert! (minStock is 12)
    minStock: 12,
    supplierId: 'supp-1'
  },
  {
    id: 'prod-3',
    name: 'Gula Pasir Gulaku 1kg',
    sku: 'GLK-PAS-1K',
    category: 'Sembako',
    unit: 'pcs',
    costPrice: 13500,
    sellingPrice: 16000,
    stock: 8, // Low stock alert! (minStock is 15)
    minStock: 15,
    supplierId: 'supp-2'
  },
  {
    id: 'prod-4',
    name: 'Kopi Kapal Api Spesial Mix 1 Renteng',
    sku: 'KPL-API-RENT',
    category: 'Minuman',
    unit: 'renteng',
    costPrice: 10500,
    sellingPrice: 13000,
    stock: 22,
    minStock: 5,
    supplierId: 'supp-2'
  },
  {
    id: 'prod-5',
    name: 'Telur Ayam Ras Grade A 1kg',
    sku: 'TLR-RAS-1K',
    category: 'Sembako',
    unit: 'kg',
    costPrice: 22000,
    sellingPrice: 26500,
    stock: 3, // Low stock alert! (minStock is 10)
    minStock: 10,
    supplierId: 'supp-3'
  },
  {
    id: 'prod-6',
    name: 'Terigu Segitiga Biru 1kg',
    sku: 'TRG-SGT-1K',
    category: 'Bahan Kue',
    unit: 'pcs',
    costPrice: 11000,
    sellingPrice: 13500,
    stock: 35,
    minStock: 10,
    supplierId: 'supp-2'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Day 1 (May 28, 2026)
  {
    id: 'tx-1',
    date: '2026-05-28',
    type: 'income',
    amount: 78000,
    category: 'Penjualan',
    description: 'Penjualan Beras Premium Mentari 5kg (x1)',
    paymentMethod: 'Tunai',
    createdBy: 'Andi (Kasir)',
    productId: 'prod-1',
    quantity: 1
  },
  {
    id: 'tx-2',
    date: '2026-05-28',
    type: 'income',
    amount: 69000,
    category: 'Penjualan',
    description: 'Penjualan Minyak Goreng SunCo 2L (x2)',
    paymentMethod: 'QRIS',
    createdBy: 'Andi (Kasir)',
    productId: 'prod-2',
    quantity: 2
  },
  {
    id: 'tx-3',
    date: '2026-05-28',
    type: 'expense',
    amount: 150000,
    category: 'Operasional',
    description: 'Bayar Tagihan Listrik Toko Bulanan',
    paymentMethod: 'Debit',
    createdBy: 'Rudi (Owner)'
  },
  // Day 2 (May 29, 2026)
  {
    id: 'tx-4',
    date: '2026-05-29',
    type: 'income',
    amount: 156000,
    category: 'Penjualan',
    description: 'Penjualan Beras Premium Mentari 5kg (x2)',
    paymentMethod: 'Tunai',
    createdBy: 'Andi (Kasir)',
    productId: 'prod-1',
    quantity: 2
  },
  {
    id: 'tx-5',
    date: '2026-05-29',
    type: 'income',
    amount: 106000,
    category: 'Penjualan',
    description: 'Penjualan Telur Ayam Ras Grade A 1kg (x4)',
    paymentMethod: 'QRIS',
    createdBy: 'Andi (Kasir)',
    productId: 'prod-5',
    quantity: 4
  },
  {
    id: 'tx-6',
    date: '2026-05-29',
    type: 'expense',
    amount: 75000,
    category: 'Operasional',
    description: 'Pembelian Kantong Plastik & Lakban Packing',
    paymentMethod: 'Tunai',
    createdBy: 'Rudi (Owner)'
  },
  // Day 3 (Today, May 30, 2026)
  {
    id: 'tx-7',
    date: '2026-05-30',
    type: 'income',
    amount: 390000,
    category: 'Penjualan',
    description: 'Penjualan Beras Premium Mentari 5kg (x5)',
    paymentMethod: 'Transfer Bank',
    createdBy: 'Andi (Kasir)',
    productId: 'prod-1',
    quantity: 5
  },
  {
    id: 'tx-8',
    date: '2026-05-30',
    type: 'income',
    amount: 137500,
    category: 'Penjualan',
    description: 'Penjualan Minyak Goreng SunCo 2L (x4)',
    paymentMethod: 'QRIS',
    createdBy: 'Andi (Kasir)',
    productId: 'prod-2',
    quantity: 4
  },
  {
    id: 'tx-9',
    date: '2026-05-30',
    type: 'income',
    amount: 80000,
    category: 'Penjualan',
    description: 'Penjualan Gula Pasir Gulaku 1kg (x5)',
    paymentMethod: 'Tunai',
    createdBy: 'Andi (Kasir)',
    productId: 'prod-3',
    quantity: 5
  },
  {
    id: 'tx-10',
    date: '2026-05-30',
    type: 'expense',
    amount: 50000,
    category: 'Gaji Karyawan',
    description: 'Gaji harian kasir andi lembur sabtu',
    paymentMethod: 'Tunai',
    createdBy: 'Rudi (Owner)'
  }
];

export const INITIAL_REORDERS: ReorderOrder[] = [
  {
    id: 'reorder-1',
    date: '2026-05-29',
    productId: 'prod-2',
    productName: 'Minyak Goreng SunCo 2L',
    supplierId: 'supp-1',
    supplierName: 'PT Sinar Pangan Semesta',
    quantity: 30,
    estimatedCost: 870000,
    status: 'sent',
    messageText: 'Auto Notification BukuCuan: Stok Minyak Goreng SunCo 2L tinggal 6 pouch. Mengirimkan restock order sebesar 30 pouch.',
    sentAt: '2026-05-29 14:02:11',
    notificationType: 'whatsapp'
  },
  {
    id: 'reorder-2',
    date: '2026-05-30',
    productId: 'prod-5',
    productName: 'Telur Ayam Ras Grade A 1kg',
    supplierId: 'supp-3',
    supplierName: 'CV Tani Sejahtera Mandiri',
    quantity: 20,
    estimatedCost: 440000,
    status: 'pending',
    messageText: 'Yth CV Tani Sejahtera Mandiri, Stok produk Telur Ayam Ras Grade A 1kg di toko kami tinggal 3 kg. Mohon kirimkan restock sebanyak 20 kg. Terima kasih! - BukuCuan',
    notificationType: 'email'
  }
];
