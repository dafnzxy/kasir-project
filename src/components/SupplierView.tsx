import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Send, 
  MessageSquareCode, 
  Mail, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import { Supplier, ReorderOrder, Product } from '../types';

interface SupplierViewProps {
  suppliers: Supplier[];
  reorders: ReorderOrder[];
  products: Product[];
  onAddSupplier: (supplier: Partial<Supplier>) => void;
  onUpdateTemplate: (supplierId: string, template: string) => void;
  onUpdateReorderStatus: (reorderId: string, status: 'sent' | 'received') => void;
  currentUserRole: string;
}

export default function SupplierView({
  suppliers,
  reorders,
  products,
  onAddSupplier,
  onUpdateTemplate,
  onUpdateReorderStatus,
  currentUserRole
}: SupplierViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSupplierIdForTemplate, setSelectedSupplierIdForTemplate] = useState<string | null>(null);
  const [activeTemplateText, setActiveTemplateText] = useState('');
  
  // New Supplier form states
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmitSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;

    onAddSupplier({
      name,
      contactPerson,
      phone,
      email,
      address,
      autoNotifyEnabled: true,
      autoNotifyTemplate: 'Yth [Supplier Name], Stok produk [Product Name] di toko kami tinggal [Current Stock] [Unit]. Mohon kirimkan restock sebanyak [Order Quantity] [Unit] seharga [Cost Price]. Terima kasih! - BukuCuan'
    });

    setName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setAddress('');
    setShowAddForm(false);
  };

  const handleOpenTemplateModal = (supp: Supplier) => {
    setSelectedSupplierIdForTemplate(supp.id);
    setActiveTemplateText(supp.autoNotifyTemplate);
  };

  const handleSaveTemplate = () => {
    if (selectedSupplierIdForTemplate) {
      onUpdateTemplate(selectedSupplierIdForTemplate, activeTemplateText);
      setSelectedSupplierIdForTemplate(null);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto max-h-screen pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-light-green text-dark-green border border-green-200 shadow-sm">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
              Supplier & Auto Order Notifikasi
            </h1>
            <p className="text-sm text-text-secondary">
              Hubungkan UMKM dengan pemasok barang, atur parameter template pesan otomatis, dan verifikasi log order.
            </p>
          </div>
        </div>

        {currentUserRole === 'owner' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#22C55E] hover:bg-[#15803D] text-white font-bold text-sm px-5 py-3 rounded-[12px] shadow-[0_8px_20px_rgba(34,197,94,0.25)] flex items-center gap-2 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Daftarkan Supplier Baru
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmitSupplier} className="bg-white border border-gray-100 rounded-3xl p-6 custom-shadow space-y-5">
          <h3 className="font-extrabold text-text-primary text-base">Registrasi Hubungan Supplier Baru</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Nama PT / Perusahaan Supplier
              </label>
              <input
                type="text"
                required
                placeholder="cth: PT Sinar Pangan Semesta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200 font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Nama Kontak Person (PIC)
              </label>
              <input
                type="text"
                placeholder="cth: Budi Santoso"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                No. Telepon / WhatsApp Pemasokan
              </label>
              <input
                type="text"
                required
                placeholder="cth: 08123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Email Perusahaan
              </label>
              <input
                type="email"
                required
                placeholder="cth: cs@pabrik.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Kantor / Cabang Alamat Gudang
              </label>
              <input
                type="text"
                placeholder="cth: Kawasan Industri No. 15, Bekasi"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3.5 pt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-gray-100 hover:bg-gray-200 text-text-[#111827] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-[12px] transition"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="bg-[#22C55E] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-[12px] shadow-[0_4px_12px_rgba(34,197,94,0.2)] transition-all active:scale-95"
            >
              Hubungkan Supplier
            </button>
          </div>
        </form>
      )}

      {/* Grid panels of suppliers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supp) => (
          <div key={supp.id} className="bg-white border border-gray-100 rounded-3xl p-5 custom-shadow space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-extrabold text-sm text-text-primary leading-tight">{supp.name}</h3>
                <span className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded-full border ${
                  supp.autoNotifyEnabled 
                    ? 'bg-green-50 text-dark-green border-green-150' 
                    : 'bg-gray-50 text-text-secondary border-gray-150'
                }`}>
                  {supp.autoNotifyEnabled ? '🔔 Auto Notif' : '🔕 Manual'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-text-secondary font-medium">
                <div>PIC: <strong className="text-text-primary">{supp.contactPerson || 'Gudang'}</strong></div>
                <div>WA/Telp: <strong className="text-text-primary">{supp.phone}</strong></div>
                <div>Email: <strong className="text-text-primary">{supp.email}</strong></div>
                <div className="truncate">Gudang PIC: {supp.address}</div>
              </div>
            </div>

            {currentUserRole === 'owner' && (
              <button
                onClick={() => handleOpenTemplateModal(supp)}
                className="w-full bg-gray-50 hover:bg-gray-150 border border-gray-150 text-text-primary text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Sliders className="w-3.5 h-3.5 text-text-secondary" /> Konfigurasi Notif PO
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Reorder/Purchase Order logs */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 custom-shadow space-y-5">
        <h3 className="font-extrabold text-text-primary text-base">Arsip Notifikasi & Faktur Transaksi Supplier</h3>
        <p className="text-xs text-text-secondary">
          Log transaksi di bawah menunjukkan draf pesanan otomatis atau pemesanan manual yang saat ini dioperasikan ke distributor untuk mengembalikan tingkat stock cadangan.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-text-secondary font-bold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="p-4">Tanggal Order</th>
                <th className="p-4">Info Produk / Supplier</th>
                <th className="p-4 text-center">Jumlah Pesan</th>
                <th className="p-4 text-right">Estimasi Tagihan</th>
                <th className="p-4 text-center">Tipe Notif</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Konfirmasi Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reorders.map((re) => {
                const prod = products.find(p => p.id === re.productId);
                return (
                  <tr key={re.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-semibold text-text-secondary">{re.date}</td>
                    
                    <td className="p-4 space-y-0.5">
                      <div className="font-extrabold text-text-primary">{re.productName}</div>
                      <div className="text-[10px] text-text-secondary">Tujuan: <strong>{re.supplierName}</strong></div>
                    </td>

                    <td className="p-4 text-center font-bold text-text-primary">
                      {re.quantity} pcs
                    </td>

                    <td className="p-4 text-right font-extrabold text-text-primary">
                      Rp {re.estimatedCost.toLocaleString('id-ID')}
                    </td>

                    <td className="p-4 text-center">
                      {re.notificationType === 'whatsapp' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-150">
                          <MessageSquareCode className="w-3.5 h-3.5 text-green-600" /> WhatsApp API
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-150">
                          <Mail className="w-3.5 h-3.5 text-amber-600" /> Gateway Email
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      {re.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-150">
                          <Clock className="w-3.5 h-3.5 text-gray-400" /> Draf Pending
                        </span>
                      )}
                      {re.status === 'sent' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-150">
                          <CheckCheck className="w-3.5 h-3.5 text-blue-600" /> Terkirim
                        </span>
                      )}
                      {re.status === 'received' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-dark-green bg-green-50 px-2.5 py-1 rounded-full border border-green-150">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary-green" /> Barang Masuk
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1.5">
                        {re.status === 'pending' && (
                          <button
                            onClick={() => onUpdateReorderStatus(re.id, 'sent')}
                            className="bg-primary-green text-white font-bold text-[10px] px-2.5 py-1.5 rounded hover:bg-primary-green/90 transition shadow-sm uppercase tracking-wider"
                          >
                            Kirim Notifikasi
                          </button>
                        )}
                        {re.status === 'sent' && (
                          <button
                            onClick={() => {
                              onUpdateReorderStatus(re.id, 'received');
                              // Automatically top-up the stock of the product in memory based on order qty!
                              if (prod) {
                                alert(`Barang Masuk! Stok produk ${re.productName} telah otomatis ditambahkan sebesar ${re.quantity} ${prod.unit} di Gudang BukuCuan.`);
                              }
                            }}
                            className="bg-indigo-600 text-white font-bold text-[10px] px-2.5 py-1.5 rounded hover:bg-indigo-700 transition shadow-sm uppercase tracking-wider"
                          >
                            Konfirmasi Masuk
                          </button>
                        )}
                        {re.status === 'received' && (
                          <span className="text-[10px] font-semibold text-text-secondary bg-gray-100 py-1.5 px-3 rounded">
                            Transaksi Selesai
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTIFICATION TEMPLATE SETUP MODAL */}
      {selectedSupplierIdForTemplate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-100 custom-shadow p-6 space-y-4">
            <h3 className="text-base font-extrabold text-text-primary tracking-tight">Atur Template Notifikasi Auto-Reorder</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Sesuaikan pesan otomatis yang dikirimkan saat stock barang di bawah parameter minimal. Anda dapat menggunakan placeholder yang terisi dinamis berikut:
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10.5px] font-semibold bg-gray-50 p-3 rounded-xl border border-gray-100 text-text-secondary">
              <div><code>[Supplier Name]</code> : Nama PT/PIC</div>
              <div><code>[Product Name]</code> : Nama barang kritis</div>
              <div><code>[Current Stock]</code> : Sisa sisa stok</div>
              <div><code>[Order Quantity]</code> : Jumlah order</div>
              <div><code>[Unit]</code> : Karung, pcs, kg</div>
              <div><code>[Cost Price]</code> : Harga beli HPP</div>
            </div>

            <textarea
              rows={4}
              value={activeTemplateText}
              onChange={(e) => setActiveTemplateText(e.target.value)}
              className="w-full text-xs font-semibold p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-primary-green leading-relaxed text-text-primary"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedSupplierIdForTemplate(null)}
                className="bg-gray-100 hover:bg-gray-200 text-text-primary text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={handleSaveTemplate}
                className="bg-primary-green hover:bg-primary-green/90 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-sm"
              >
                Simpan & Sinkronkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
