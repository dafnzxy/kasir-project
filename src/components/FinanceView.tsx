import React, { useState } from 'react';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Trash2, 
  Filter, 
  TrendingUp,
  Receipt,
  Download
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface FinanceViewProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
  currentUserRole: string;
}

export default function FinanceView({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  currentUserRole
}: FinanceViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  
  // Form states
  const [date, setDate] = useState('2026-05-30');
  const [type, setType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Penjualan');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Transfer Bank' | 'Debit'>('Tunai');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    onAddTransaction({
      date,
      type,
      amount: Number(amount),
      category,
      description,
      paymentMethod,
      createdBy: currentUserRole === 'owner' ? 'Rudi (Owner)' : 'Andi (Kasir)'
    });

    // Reset Form
    setAmount('');
    setDescription('');
    setShowAddForm(false);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto max-h-screen pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-light-green text-dark-green border border-green-200 shadow-sm">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
              Kasir & Arus Kas Keuangan Keuangan
            </h1>
            <p className="text-sm text-text-secondary">
              Pencatatan real-time pendapatan harian dari kasir dan pengeluaran operasional toko.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#22C55E] hover:bg-[#15803D] text-white font-bold text-sm px-5 py-3 rounded-[12px] shadow-[0_8px_20px_rgba(34,197,94,0.25)] flex items-center gap-2 transition-all duration-200 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Catat Transaksi Baru
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 custom-shadow space-y-5">
          <h3 className="font-extrabold text-text-primary text-base">Formulir Catat Kas Masuk / Keluar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Tanggal Transaksi
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Jenis Aliran Kas
              </label>
              <select
                value={type}
                onChange={(e: any) => {
                  const newType = e.target.value;
                  setType(newType);
                  setCategory(newType === 'income' ? 'Penjualan' : 'Operasional');
                }}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              >
                <option value="income">Kas Masuk (Pendapatan)</option>
                <option value="expense">Kas Keluar (Pengeluaran)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Metode Pembayaran
              </label>
              <select
                value={paymentMethod}
                onChange={(e: any) => setPaymentMethod(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              >
                <option value="Tunai">Uang Pas / Tunai</option>
                <option value="QRIS">QRIS Dinamis</option>
                <option value="Debit">Debit BCA/Mandiri</option>
                <option value="Transfer Bank">Transfer Bank</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Nominal Transaksi (Rupiah)
              </label>
              <input
                type="number"
                required
                min="100"
                placeholder="cth: 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Kategori Pengelompokkan
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2.5 rounded-xl border border-gray-200"
              >
                {type === 'income' ? (
                  <>
                    <option value="Penjualan">Penjualan Eceran</option>
                    <option value="Grosir">Penjualan Partai Grosir</option>
                    <option value="Lainnya">Lain-lain</option>
                  </>
                ) : (
                  <>
                    <option value="Operasional">Pengeluaran Operasional</option>
                    <option value="Gaji Karyawan">Gaji / Insentif Staf</option>
                    <option value="Listrik & Air">Tagihan Listrik / Air Toko</option>
                    <option value="Restock Barang">Restock Bahan / Kulakan</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Deskripsi Memo Transaksi
              </label>
              <input
                type="text"
                required
                placeholder="cth: Penjualan beras premium 2 karung"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              Simpan Buku Kas
            </button>
          </div>
        </form>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-3xl custom-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Kas Masuk</span>
            <h3 className="text-xl font-extrabold text-primary-green">Rp {totalIncome.toLocaleString('id-ID')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 text-primary-green flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 font-bold" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-3xl custom-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Kas Keluar</span>
            <h3 className="text-xl font-extrabold text-danger">Rp {totalExpense.toLocaleString('id-ID')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-danger flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5 font-bold" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-3xl custom-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Saldo Bersih Terfilter</span>
            <h3 className={`text-xl font-extrabold ${totalIncome - totalExpense >= 0 ? 'text-primary-green' : 'text-danger'}`}>
              Rp {(totalIncome - totalExpense).toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 font-bold" />
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 custom-shadow space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-gray-500" />
            <h3 className="font-extrabold text-text-primary text-base">Jurnal Transaksi Arus Kas</h3>
          </div>

          {/* Action and filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  filterType === 'all' ? 'bg-white shadow text-dark-green' : 'text-text-secondary'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  filterType === 'income' ? 'bg-white shadow text-dark-green' : 'text-text-secondary'
                }`}
              >
                Kas Masuk
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  filterType === 'expense' ? 'bg-white shadow text-dark-green' : 'text-text-secondary'
                }`}
              >
                Kas Keluar
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-text-secondary font-bold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Aliran</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Memo Deskripsi</th>
                <th className="p-4">Metode</th>
                <th className="p-4 text-right">Nominal</th>
                <th className="p-4 text-center">Petugas</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-xs text-text-secondary font-semibold">
                    Tidak ditemukan data transaksi keuangan.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-semibold text-text-secondary">{tx.date}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                        tx.type === 'income' 
                          ? 'bg-light-green text-dark-green' 
                          : 'bg-red-50 text-danger'
                      }`}>
                        {tx.type === 'income' ? 'Masuk' : 'Keluar'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-text-primary">{tx.category}</td>
                    <td className="p-4 text-text-primary text-sm font-semibold">{tx.description}</td>
                    <td className="p-4 font-medium text-text-secondary">{tx.paymentMethod}</td>
                    <td className={`p-4 text-right font-extrabold ${tx.type === 'income' ? 'text-primary-green' : 'text-danger'}`}>
                      {tx.type === 'income' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-center text-text-secondary font-semibold">{tx.createdBy}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-2 text-gray-400 hover:text-danger rounded-lg hover:bg-red-50 transition inline-flex"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
