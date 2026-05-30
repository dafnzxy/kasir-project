import React, { useState } from 'react';
import { 
  PackageSearch, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Edit,
  ArrowUpDown,
  FileSpreadsheet
} from 'lucide-react';
import { Product, Supplier } from '../types';

interface InventoryViewProps {
  products: Product[];
  suppliers: Supplier[];
  onAddProduct: (product: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  currentUserRole: string;
}

export default function InventoryView({
  products,
  suppliers,
  onAddProduct,
  onDeleteProduct,
  onUpdateStock,
  currentUserRole
}: InventoryViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [skuFilter, setSkuFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Sembako');
  const [unit, setUnit] = useState('pcs');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('10');
  const [supplierId, setSupplierId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !costPrice || !sellingPrice || !stock || !supplierId) {
      alert('Mohon lengkapi semua field!');
      return;
    }

    if (products.some(p => p.sku.toLowerCase() === sku.toLowerCase())) {
      alert('SKU sudah terdaftar! Harap gunakan SKU unik.');
      return;
    }

    onAddProduct({
      name,
      sku: sku.toUpperCase(),
      category,
      unit,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      stock: Number(stock),
      minStock: Number(minStock),
      supplierId
    });

    // Reset Form
    setName('');
    setSku('');
    setCostPrice('');
    setSellingPrice('');
    setStock('');
    setShowAddForm(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesSku = p.sku.toLowerCase().includes(skuFilter.toLowerCase()) || 
                      p.name.toLowerCase().includes(skuFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSku && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto max-h-screen pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-light-green text-dark-green border border-green-200 shadow-sm">
            <PackageSearch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
              Manajemen Persediaan & Katalog Produk
            </h1>
            <p className="text-sm text-text-secondary">
              Manajemen database stok, penentuan HPP operasional, harga jual retail, dan notifikasi limit aman gudang.
            </p>
          </div>
        </div>

        {currentUserRole !== 'supplier' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#22C55E] hover:bg-[#15803D] text-white font-bold text-sm px-5 py-3 rounded-[12px] shadow-[0_8px_20px_rgba(34,197,94,0.25)] flex items-center gap-2 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Daftarkan Produk Baru
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 custom-shadow space-y-5">
          <h3 className="font-extrabold text-text-primary text-base">Registrasi Produk & Stok Baru</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                SKU / Kode Unit (Unik)
              </label>
              <input
                type="text"
                required
                placeholder="cth: BRS-MEN-5K"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                required
                placeholder="cth: Beras Premium Mentari 5kg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Kategori Produk
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              >
                <option value="Sembako">Sembako Pokok</option>
                <option value="Minuman">Minuman Ringan</option>
                <option value="Makanan">Makanan Ringan</option>
                <option value="Bahan Kue">Bahan Kue</option>
                <option value="Lainnya">Lain-lain</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Satuan Jual (Unit)
              </label>
              <input
                type="text"
                required
                placeholder="cth: pcs, kg, karung"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Harga Beli Supplier (HPP)
              </label>
              <input
                type="number"
                required
                min="100"
                placeholder="cth: 30000"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Harga Jual Eceran (Selling Price)
              </label>
              <input
                type="number"
                required
                min="100"
                placeholder="cth: 37500"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Stok Awal
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="cth: 50"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Batas Minimum Alarm Stok (Alert Limit)
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="cth: 10"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Hubungkan Supplier Resmi
              </label>
              <select
                required
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              >
                <option value="">-- Pilih Supplier --</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3.5 pt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-gray-100 hover:bg-gray-200 text-text-primary text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="bg-primary-green hover:bg-primary-green/90 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition shadow-sm"
            >
              Daftarkan Produk
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Box */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 custom-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-1 max-w-md bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-150">
          <PackageSearch className="w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Cari sku, nama produk, kategori..."
            value={skuFilter}
            onChange={(e) => setSkuFilter(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-text-primary font-semibold w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Kategori:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs font-semibold text-text-primary p-2.5 rounded-xl outline-none"
          >
            <option value="all">Tampilkan Semua</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid listing */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 custom-shadow space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-text-secondary font-bold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="p-4">SKU / Nama</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Satuan</th>
                <th className="p-4 text-right">Harga Beli (HPP)</th>
                <th className="p-4 text-right">Harga Jual</th>
                <th className="p-4 text-center">Tingkat Persediaan</th>
                <th className="p-4 text-center">Status Gudang</th>
                {currentUserRole !== 'supplier' && (
                  <th className="p-4 text-center">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-xs text-text-secondary font-semibold">
                    Tidak ditemukan data produk/barang persediaan.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="p-4 space-y-0.5">
                        <span className="text-[10px] text-text-secondary font-mono font-bold block">{p.sku}</span>
                        <span className="font-extrabold text-sm text-text-primary block">{p.name}</span>
                      </td>
                      <td className="p-4 font-bold text-text-secondary">{p.category}</td>
                      <td className="p-4 font-medium text-text-secondary uppercase">{p.unit}</td>
                      <td className="p-4 text-right font-semibold text-text-secondary">Rp {p.costPrice.toLocaleString('id-ID')}</td>
                      <td className="p-4 text-right font-extrabold text-primary-green">Rp {p.sellingPrice.toLocaleString('id-ID')}</td>
                      
                      {/* Stock controller with fast adjustment buttons */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          {currentUserRole !== 'supplier' && (
                            <button
                              onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 5))}
                              className="w-7 h-7 bg-gray-100 hover:bg-gray-200 font-bold rounded-lg flex items-center justify-center transition active:scale-90 text-text-primary"
                            >
                              -5
                            </button>
                          )}
                          <span className={`text-sm font-extrabold w-12 text-center ${isLow ? 'text-danger' : 'text-text-primary'}`}>
                            {p.stock}
                          </span>
                          {currentUserRole !== 'supplier' && (
                            <button
                              onClick={() => onUpdateStock(p.id, p.stock + 5)}
                              className="w-7 h-7 bg-gray-100 hover:bg-gray-200 font-bold rounded-lg flex items-center justify-center transition active:scale-90 text-text-primary"
                            >
                              +5
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-red-50 text-danger rounded-full border border-red-100">
                            <AlertTriangle className="w-3 h-3 text-red-600 animate-pulse" /> Kritis (&lt;={p.minStock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-green-50 text-dark-green rounded-full border border-green-100">
                            <CheckCircle2 className="w-3 h-3 text-primary-green" /> Amandemen
                          </span>
                        )}
                      </td>

                      {currentUserRole !== 'supplier' && (
                        <td className="p-4 text-center">
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-2 text-gray-400 hover:text-danger rounded-lg hover:bg-red-50 transition inline-flex"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
