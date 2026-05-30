import { useState, useEffect } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_SUPPLIERS, 
  INITIAL_REORDERS 
} from './data/dbSchema';
import { Product, Transaction, Supplier, ReorderOrder, UserRole, User } from './types';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import FinanceView from './components/FinanceView';
import InventoryView from './components/InventoryView';
import SupplierView from './components/SupplierView';
import ReportsView from './components/ReportsView';
import AuthVisualizer from './components/AuthVisualizer';
import DatabaseSchemaView from './components/DatabaseSchemaView';
import LandingPageView from './components/LandingPageView';
import AuthView from './components/AuthView';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Load persistent states or fallback to high-fidelity seed data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bukucuan_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bukucuan_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('bukucuan_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [reorders, setReorders] = useState<ReorderOrder[]>(() => {
    const saved = localStorage.getItem('bukucuan_reorders');
    return saved ? JSON.parse(saved) : INITIAL_REORDERS;
  });

  const [loggedInUser, setLoggedInUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bukucuan_current_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => {
    const savedUser = localStorage.getItem('bukucuan_current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        return parsed.role || 'owner';
      } catch (e) {
        return 'owner';
      }
    }
    return 'owner';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemMode, setSystemMode] = useState<'visitor' | 'admin'>(() => {
    const saved = localStorage.getItem('bukucuan_system_mode');
    return (saved === 'admin' || saved === 'visitor') ? saved : 'visitor';
  });
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bukucuan_system_mode', systemMode);
  }, [systemMode]);

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('bukucuan_current_user', JSON.stringify(loggedInUser));
      setCurrentUserRole(loggedInUser.role);
    } else {
      localStorage.removeItem('bukucuan_current_user');
    }
  }, [loggedInUser]);

  useEffect(() => {
    localStorage.setItem('bukucuan_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bukucuan_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('bukucuan_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('bukucuan_reorders', JSON.stringify(reorders));
  }, [reorders]);

  // Alert dismisser timer
  const triggerNativeAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertMessage(null);
    }, 4500);
  };

  // Callback 1: Record cashier transaction
  const handleAddTransaction = (newTx: Partial<Transaction>) => {
    const txId = 'tx-' + Math.random().toString(36).substring(2, 9);
    const fullTx: Transaction = {
      id: txId,
      date: newTx.date || '2026-05-30',
      type: newTx.type || 'income',
      amount: newTx.amount || 0,
      category: newTx.category || 'Penjualan',
      description: newTx.description || 'Transaksi POS Baru',
      paymentMethod: newTx.paymentMethod || 'Tunai',
      createdBy: newTx.createdBy || 'Andi (Kasir)',
      productId: newTx.productId,
      quantity: newTx.quantity
    };

    setTransactions(prev => [fullTx, ...prev]);

    // If transaction is selling sales, deduct remaining stock automatically!
    if (fullTx.type === 'income' && fullTx.productId && fullTx.quantity) {
      setProducts(prevProducts => {
        return prevProducts.map(p => {
          if (p.id === fullTx.productId) {
            const resultStock = Math.max(0, p.stock - (fullTx.quantity || 1));
            // Trigger auto notification overlay if stok falls below minimum alert threshold!
            if (resultStock <= p.minStock) {
              const supp = suppliers.find(s => s.id === p.supplierId);
              triggerNativeAlert(`⚠ ALARM STOK KRITIS: Sisa stok ${p.name} tinggal ${resultStock} ${p.unit}. Mengajukan auto draf order ke ${supp?.name || 'Supplier'}!`);
              
              // Automatically draft a restock reorder!
              handleAutoDraftReorder(p, resultStock);
            }
            return { ...p, stock: resultStock };
          }
          return p;
        });
      });
    }

    triggerNativeAlert(`✓ Sukses: Kas ${fullTx.type === 'income' ? 'Masuk' : 'Keluar'} Rp ${fullTx.amount.toLocaleString('id-ID')} telah dicatatkan ke server BukuCuan!`);
  };

  const handleAutoDraftReorder = (prod: Product, currentStock: number) => {
    const supp = suppliers.find(s => s.id === prod.supplierId);
    if (!supp) return;

    const orderQty = prod.minStock * 3;
    const reorderId = 'reorder-' + Math.random().toString(36).substring(2, 9);
    
    // Interpolate template parameters
    let messageText = supp.autoNotifyTemplate
      .replace(/\[Supplier Name\]/g, supp.name)
      .replace(/\[Product Name\]/g, prod.name)
      .replace(/\[Current Stock\]/g, currentStock.toString())
      .replace(/\[Order Quantity\]/g, orderQty.toString())
      .replace(/\[Unit\]/g, prod.unit)
      .replace(/\[Cost Price\]/g, 'Rp ' + prod.costPrice.toLocaleString('id-ID'));

    const draftOrder: ReorderOrder = {
      id: reorderId,
      date: '2026-05-30',
      productId: prod.id,
      productName: prod.name,
      supplierId: prod.supplierId,
      supplierName: supp.name,
      quantity: orderQty,
      estimatedCost: prod.costPrice * orderQty,
      status: 'pending',
      messageText,
      notificationType: 'whatsapp'
    };

    setReorders(prev => [draftOrder, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    triggerNativeAlert('✓ Riwayat Transaksi berhasil dihapus.');
  };

  // Callback 2: Inventory CRUD or Stock adjustments
  const handleAddProduct = (newProduct: Partial<Product>) => {
    const prodId = 'prod-' + Math.random().toString(36).substring(2, 9);
    const fullProduct: Product = {
      id: prodId,
      name: newProduct.name || 'Produk Baru',
      sku: newProduct.sku || 'SKU-NEW',
      category: newProduct.category || 'Sembako',
      unit: newProduct.unit || 'pcs',
      costPrice: newProduct.costPrice || 0,
      sellingPrice: newProduct.sellingPrice || 0,
      stock: newProduct.stock || 0,
      minStock: newProduct.minStock || 5,
      supplierId: newProduct.supplierId || 'supp-1'
    };

    setProducts(prev => [...prev, fullProduct]);
    triggerNativeAlert(`✓ Sukses: Produk Baru ${fullProduct.name} didaftarkan perpajakan HPP.`);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    triggerNativeAlert('✓ Produk berhasil dihapus dari katalog barang.');
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        // Trigger alert if adjustments hits warning
        if (newStock <= p.minStock && p.stock > p.minStock) {
          triggerNativeAlert(`⚠ ALARM STOK: Produk ${p.name} tinggal ${newStock} unit.`);
          handleAutoDraftReorder(p, newStock);
        }
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  // Callback 3: Suppliers & notifications template sync
  const handleAddSupplier = (newSupp: Partial<Supplier>) => {
    const suppId = 'supp-' + Math.random().toString(36).substring(2, 9);
    const fullSupp: Supplier = {
      id: suppId,
      name: newSupp.name || 'Supplier Baru',
      contactPerson: newSupp.contactPerson || 'Gudang',
      phone: newSupp.phone || '',
      email: newSupp.email || '',
      address: newSupp.address || '',
      autoNotifyEnabled: true,
      autoNotifyTemplate: newSupp.autoNotifyTemplate || 'Notifikasi...'
    };

    setSuppliers(prev => [...prev, fullSupp]);
    triggerNativeAlert(`✓ Rekanan supplier ${fullSupp.name} berhasil terhubung.`);
  };

  const handleUpdateTemplate = (supplierId: string, template: string) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        return { ...s, autoNotifyTemplate: template };
      }
      return s;
    }));
    triggerNativeAlert('✓ Template pesanan otomatis Auto-Reorder disinkronisasikan ke sistem WhatsApp gateway.');
  };

  const handleUpdateReorderStatus = (reorderId: string, status: 'sent' | 'received') => {
    setReorders(prev => prev.map(re => {
      if (re.id === reorderId) {
        // If status changed to 'received', we automatically top-up warehouse product stocks!
        if (status === 'received') {
          setProducts(prevProds => prevProds.map(p => {
            if (p.id === re.productId) {
              return { ...p, stock: p.stock + re.quantity };
            }
            return p;
          }));

          // Also record an expense cashflow transaction automatically for accountability!
          handleAddTransaction({
            date: '2026-05-30',
            type: 'expense',
            amount: re.estimatedCost,
            category: 'Restock Barang',
            description: `Pembelian restock ${re.productName} (x${re.quantity}) dari ${re.supplierName}`,
            paymentMethod: 'Transfer Bank',
            productId: re.productId,
            quantity: re.quantity
          });
        }
        
        return { 
          ...re, 
          status,
          sentAt: status === 'sent' ? '2026-05-30 08:44:00' : re.sentAt
        };
      }
      return re;
    }));

    if (status === 'sent') {
      const re = reorders.find(r => r.id === reorderId);
      triggerNativeAlert(`✉ TIGA PILAR NOTIFIKASI: Pesanan otomatis berhasil dikirimkan via ${re?.notificationType === 'whatsapp' ? 'WhatsApp Gateway ke ' + re.supplierName : 'Email SMTP Client'}!`);
    }
  };

  // Dispatched Order manual from warnings card
  const handleDispatchReorder = (productId: string, quantity: number, method: 'whatsapp' | 'email') => {
    const prod = products.find(p => p.id === productId);
    const supp = suppliers.find(s => s && s.id === prod?.supplierId);
    if (!prod || !supp) return;

    const reId = 'reorder-' + Math.random().toString(36).substring(2, 9);
    
    let messageText = supp.autoNotifyTemplate
      .replace(/\[Supplier Name\]/g, supp.name)
      .replace(/\[Product Name\]/g, prod.name)
      .replace(/\[Current Stock\]/g, prod.stock.toString())
      .replace(/\[Order Quantity\]/g, quantity.toString())
      .replace(/\[Unit\]/g, prod.unit)
      .replace(/\[Cost Price\]/g, 'Rp ' + prod.costPrice.toLocaleString('id-ID'));

    const newReorder: ReorderOrder = {
      id: reId,
      date: '2026-05-30',
      productId: prod.id,
      productName: prod.name,
      supplierId: supp.id,
      supplierName: supp.name,
      quantity,
      estimatedCost: prod.costPrice * quantity,
      status: 'sent',
      messageText,
      sentAt: '2026-05-30 08:45:12',
      notificationType: method
    };

    setReorders(prev => [newReorder, ...prev]);
    triggerNativeAlert(`✉ DISPATCH REAL-TIME: Formulir PO otomatis dikirimkan ke WhatsApp ${supp.name} (${supp.phone})!`);
  };

  if (systemMode === 'visitor') {
    return (
      <LandingPageView 
        onEnterAdminPortal={(tab) => {
          if (tab) {
            setAuthTab(tab);
          }
          setSystemMode('admin');
          if (!loggedInUser) {
            triggerNativeAlert('🔐 Sesi Terkunci: Silakan masuk atau daftarkan akun BukuCuan Anda.');
          } else {
            triggerNativeAlert(`✓ Selamat datang kembali, ${loggedInUser.name}!`);
          }
        }} 
      />
    );
  }

  if (loggedInUser === null) {
    return (
      <AuthView 
        initialTab={authTab}
        onLoginSuccess={(user) => {
          setLoggedInUser(user);
          triggerNativeAlert(`🟢 Selamat datang, ${user.name}! Masuk sebagai ${user.role}.`);
        }}
        onExitToLandingPage={() => {
          setSystemMode('visitor');
          triggerNativeAlert('ℹ Berpindah ke Mode Tamu: Menampilkan Landing Page Utama.');
        }}
      />
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen text-text-primary antialiased font-sans">
      
      {/* 1. Left Drawer Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUserRole={currentUserRole}
        setCurrentUserRole={setCurrentUserRole}
        businessName={loggedInUser?.businessName || "Toko Sembako Cuan Abadi"}
        onExitToLandingPage={() => {
          setSystemMode('visitor');
          triggerNativeAlert('ℹ Berpindah ke Mode Tamu: Menampilkan Landing Page Utama.');
        }}
        onLogout={() => {
          setLoggedInUser(null);
          setSystemMode('visitor');
          triggerNativeAlert('🔴 Anda telah keluar dari sesi admin BukuCuan.');
        }}
      />

      {/* 2. Main Work Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        
        {/* Top bar context area */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 left-0 z-10">
          <div className="flex flex-col text-left">
            <h1 className="text-lg font-extrabold text-[#111827] leading-none">Operasional Harian</h1>
            <p className="text-xs text-[#6B7280] font-medium mt-1">Sesi UMKM Online • Koneksi PostgreSQL Terjamin</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Direct Back to Landing page guide */}
            <button
              onClick={() => {
                setSystemMode('visitor');
                triggerNativeAlert('ℹ Berpindah ke Mode Tamu: Menampilkan Landing Page Utama.');
              }}
              className="text-xs font-bold text-[#15803D] hover:text-[#111827] bg-[#DCFCE7] px-3.5 py-2 rounded-[10px] border border-green-200 transition-all active:scale-95 flex items-center gap-1.5"
            >
              Ke Landing Page
            </button>

            {/* Quick alert bar badge link */}
            <div className="flex items-center gap-2 bg-[#F9FAFB] px-3.5 py-1.5 rounded-[12px] border border-gray-100 text-xs text-[#6B7280]">
              <span className="font-bold text-[#111827]">Stok Warning:</span>
              <span className="bg-red-100 text-red-700 font-extrabold px-1.5 py-0.5 rounded-[6px] text-[10px]">
                {products.filter(p => p.stock <= p.minStock).length} Kritis
              </span>
            </div>

            {/* Profile Context */}
            <div className="flex items-center space-x-3 bg-[#F9FAFB] p-2 pr-4 rounded-[12px] border border-gray-100">
              <div className="w-8 h-8 rounded-[8px] bg-[#15803D] flex items-center justify-center text-white font-bold text-xs">
                {loggedInUser?.name ? loggedInUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left">
                <span className="font-semibold text-xs text-[#111827] block leading-none">
                  {loggedInUser?.name || 'Rudi Setiawan'}
                </span>
                <span className="text-[9px] text-[#6B7280] uppercase tracking-wider font-bold mt-1 block">
                  {currentUserRole}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Route views router */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              products={products}
              transactions={transactions}
              suppliers={suppliers}
              onAddTransaction={handleAddTransaction}
              onDispatchReorder={handleDispatchReorder}
              currentUserRole={currentUserRole}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceView
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              currentUserRole={currentUserRole}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              suppliers={suppliers}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateStock={handleUpdateStock}
              currentUserRole={currentUserRole}
            />
          )}

          {activeTab === 'suppliers' && (
            <SupplierView
              suppliers={suppliers}
              reorders={reorders}
              products={products}
              onAddSupplier={handleAddSupplier}
              onUpdateTemplate={handleUpdateTemplate}
              onUpdateReorderStatus={handleUpdateReorderStatus}
              currentUserRole={currentUserRole}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              transactions={transactions}
              products={products}
            />
          )}

          {activeTab === 'auth-visual' && (
            <AuthVisualizer />
          )}

          {activeTab === 'db-schema' && (
            <DatabaseSchemaView />
          )}
        </main>

        {/* 3. TRANSIT OVERLAY POP NOTIFICATION */}
        {alertMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce">
            <div className="bg-gray-900 border border-gray-800 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3.5 max-w-md">
              <div className="p-2 bg-light-green text-dark-green rounded-xl shrink-0">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block">Sistem BukuCuan</span>
                <p className="text-xs font-semibold text-gray-200 leading-relaxed">{alertMessage}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

