import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertOctagon, 
  HelpCircle, 
  ShoppingBag,
  Send,
  Plus,
  Coins,
  RefreshCw,
  Clock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Product, Transaction, Supplier } from '../types';

interface DashboardViewProps {
  products: Product[];
  transactions: Transaction[];
  suppliers: Supplier[];
  onAddTransaction: (tx: Partial<Transaction>) => void;
  onDispatchReorder: (productId: string, quantity: number, method: 'whatsapp' | 'email') => void;
  currentUserRole: string;
}

export default function DashboardView({
  products,
  transactions,
  suppliers,
  onAddTransaction,
  onDispatchReorder,
  currentUserRole
}: DashboardViewProps) {
  const [showPOSModal, setShowPOSModal] = useState(false);
  const [posProduct, setPosProduct] = useState('');
  const [posQty, setPosQty] = useState(1);
  const [posPayment, setPosPayment] = useState<'Tunai' | 'QRIS' | 'Debit' | 'Transfer Bank'>('Tunai');
  const [posSuccess, setPosSuccess] = useState(false);

  // Calculate metrics for today (May 30, 2026)
  const todayStr = '2026-05-30';
  const todayTxs = transactions.filter(t => t.date === todayStr);
  
  const todayRevenue = todayTxs
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayExpenses = todayTxs
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Automatically calculate today's COGS (HPP - Harga Pokok Pembangkian) for items sold
  let todayCOGS = 0;
  todayTxs.forEach(t => {
    if (t.type === 'income' && t.productId) {
      const prod = products.find(p => p.id === t.productId);
      if (prod) {
        todayCOGS += (prod.costPrice * (t.quantity || 1));
      }
    }
  });

  const todayGrossProfit = todayRevenue - todayCOGS;
  const todayNetProfit = todayGrossProfit - todayExpenses;

  // Critical stock level products (stock <= minStock)
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  const handlePOSSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === posProduct);
    if (!prod) return;

    if (prod.stock < posQty) {
      alert(`Stok tidak mencukupi! Stok saat ini: ${prod.stock} ${prod.unit}`);
      return;
    }

    const saleAmount = prod.sellingPrice * posQty;

    onAddTransaction({
      date: todayStr,
      type: 'income',
      amount: saleAmount,
      category: 'Penjualan',
      description: `Penjualan ${prod.name} (x${posQty}) via POS`,
      paymentMethod: posPayment,
      productId: prod.id,
      quantity: posQty
    });

    setPosSuccess(true);
    setPosQty(1);
    
    setTimeout(() => {
      setPosSuccess(false);
      setShowPOSModal(false);
    }, 1500);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto max-h-screen pb-24">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
            Halaman Ringkasan (Dashboard)
          </h1>
          <p className="text-sm text-text-secondary">
            Pantau arus kas harian, operasional persediaan stok, dan notifikasi kelangkaan barang dengan supplier.
          </p>
        </div>

        {currentUserRole !== 'supplier' && (
          <button
            onClick={() => setShowPOSModal(true)}
            className="bg-[#22C55E] hover:bg-[#15803D] text-white font-bold text-sm px-5 py-3 rounded-[12px] shadow-[0_8px_20px_rgba(34,197,94,0.25)] flex items-center gap-2 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Buka Kasir POS Baru
          </button>
        )}
      </div>

      {/* Financial Scorecard Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Revenue Today */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 custom-shadow space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Omset Hari Ini (Sales)</span>
            <div className="w-8 h-8 rounded-lg bg-green-50 text-primary-green flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-text-primary">
              Rp {todayRevenue.toLocaleString('id-ID')}
            </h3>
            <span className="text-[10px] text-text-secondary/70">Asumsi per tanggal hari ini</span>
          </div>
        </div>

        {/* Card 2: COGS (HPP) Today */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 custom-shadow space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Harga Pokok (HPP)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-text-primary">
              Rp {todayCOGS.toLocaleString('id-ID')}
            </h3>
            <span className="text-[10px] text-text-secondary/70">Aset inventori terserap</span>
          </div>
        </div>

        {/* Card 3: Net Profit */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 custom-shadow space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Laba Bersih Hari Ini</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-extrabold ${todayNetProfit >= 0 ? 'text-primary-green' : 'text-danger'}`}>
              Rp {todayNetProfit.toLocaleString('id-ID')}
            </h3>
            <span className="text-[10px] text-text-secondary/70">Dipotong HPP & kompensasi biaya</span>
          </div>
        </div>

        {/* Card 4: Low Stock Count */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 custom-shadow space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Persediaan Kritis</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lowStockProducts.length > 0 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-green-50 text-primary-green'}`}>
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-text-primary">
              {lowStockProducts.length} <span className="text-xs font-normal text-text-secondary">Produk</span>
            </h3>
            <span className="text-[10px] text-text-secondary/70">Stok di bawah limit aman</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Low Stock Alerts & Automated Supply Orders (2 Grid width on large dev screen) */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 custom-shadow space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <AlertOctagon className="w-5 h-5 text-red-500 animate-bounce" />
              <h3 className="font-extrabold text-text-primary text-base">Alarm Persediaan & Notifikasi Supplier</h3>
            </div>
            <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-3 py-1 rounded-full uppercase">
              Butuh Reorder
            </span>
          </div>

          <p className="text-xs text-text-secondary">
            BukuCuan membandingkan sisa persediaan dengan batas minimum setiap produk. Klik <strong>"Kirim PO Cetak"</strong> untuk merekam transaksi pemesanan restock dan memicu pesan template otomatis ke distributor.
          </p>

          {lowStockProducts.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-50 text-primary-green flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-text-primary">Semua Persediaan Aman!</span>
              <p className="text-xs text-text-secondary">Tidak ada produk yang berada di bawah tingkat stock alarm.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {lowStockProducts.map((prod) => {
                const supp = suppliers.find(s => s.id === prod.supplierId);
                return (
                  <div key={prod.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:bg-gray-100/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 font-mono">{prod.sku}</span>
                        <h4 className="font-bold text-text-primary text-sm">{prod.name}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-text-secondary font-medium">
                        <span>Kategori: <strong className="text-text-primary">{prod.category}</strong></span>
                        <span>Stok: <strong className="text-red-600">{prod.stock} / {prod.minStock} {prod.unit}</strong></span>
                        {supp && (
                          <span className="text-dark-green">Supplier: <strong>{supp.name}</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDispatchReorder(prod.id, prod.minStock * 3, 'whatsapp')}
                        className="bg-[#22C55E] hover:bg-[#15803D] text-white text-xs font-bold px-4 py-2.5 rounded-[12px] shadow-[0_4px_12px_rgba(34,197,94,0.2)] flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" /> Kirim WhatsApp PO
                      </button>
                      <button
                        onClick={() => onDispatchReorder(prod.id, prod.minStock * 3, 'email')}
                        className="bg-[#111827] hover:bg-[#1f2937] text-white text-xs font-bold px-4 py-2.5 rounded-[12px] shadow-sm transition-all active:scale-95"
                      >
                        Email PO
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Recent Activity Cashflow Ledger */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 custom-shadow space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-500" />
              <h3 className="font-extrabold text-text-primary text-base">Arus Kas Hari Ini</h3>
            </div>
            <Clock className="w-4 h-4 text-text-secondary" />
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[350px] pr-1">
            {todayTxs.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-gray-400 space-y-1">
                <span className="text-xs font-bold">Harini Belum Ada Kas</span>
                <p className="text-[10px]">Gunakan trigger kasir POS di atas untuk mencatatkan penjualan instan!</p>
              </div>
            ) : (
              todayTxs.map((tx) => (
                <div key={tx.id} className="flex items-start justify-between text-xs gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-text-primary block leading-tight">{tx.description}</span>
                    <div className="flex items-center gap-2 text-[10px] text-text-secondary">
                      <span>{tx.paymentMethod}</span>
                      <span>•</span>
                      <span>Oleh {tx.createdBy}</span>
                    </div>
                  </div>
                  <span className={`font-extrabold text-right shrink-0 ${tx.type === 'income' ? 'text-primary-green' : 'text-danger'}`}>
                    {tx.type === 'income' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* POS QUICK CASIER MODAL SIMULATOR */}
      {showPOSModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-gray-100 custom-shadow p-6 space-y-5 relative">
            <button 
              onClick={() => setShowPOSModal(false)}
              className="absolute right-6 top-6 text-text-secondary hover:text-text-primary font-bold text-lg"
            >
              ✕
            </button>
            <h3 className="text-lg font-extrabold text-text-primary tracking-tight">Kalkulator Kasir POS</h3>
            
            {posSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 text-primary-green rounded-full flex items-center justify-center animate-bounce">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-sm">Transaksi Berhasil Dicatatkan!</h4>
                  <p className="text-xs text-text-secondary">Persediaan stock otomatis terpotong di database BukuCuan.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePOSSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                    Pilih Barang Konsumen
                  </label>
                  <select
                    required
                    value={posProduct}
                    onChange={(e) => setPosProduct(e.target.value)}
                    className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
                  >
                    <option value="">-- Pilih Produk --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id} disabled={p.stock === 0}>
                        {p.name} - Rp {p.sellingPrice.toLocaleString('id-ID')} (Sisa: {p.stock} {p.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                      Jumlah (Kuantitas)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={posQty}
                      onChange={(e) => setPosQty(Number(e.target.value))}
                      className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                      Metode Pembayaran
                    </label>
                    <select
                      value={posPayment}
                      onChange={(e: any) => setPosPayment(e.target.value)}
                      className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
                    >
                      <option value="Tunai">Uang Pas / Tunai</option>
                      <option value="QRIS">QRIS Dinamis</option>
                      <option value="Debit">Debit BCA/Mandiri</option>
                      <option value="Transfer Bank">Transfer Bank</option>
                    </select>
                  </div>
                </div>

                {posProduct && (
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-bold">
                    <span>Total Pembayaran:</span>
                    <span className="text-primary-green">
                      Rp {((products.find(p => p.id === posProduct)?.sellingPrice || 0) * posQty).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                 <button
                  type="submit"
                  className="w-full bg-[#22C55E] hover:bg-[#15803D] text-white font-bold text-xs uppercase py-3.5 rounded-[12px] shadow-[0_8px_20px_rgba(34,197,94,0.25)] transition-all duration-200 active:scale-95"
                >
                  Bayar & Cetak Struk
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
