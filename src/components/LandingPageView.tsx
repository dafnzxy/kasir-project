import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  BarChart3, 
  ArrowUpRight,
  Calculator,
  Percent
} from 'lucide-react';

interface LandingPageViewProps {
  onEnterAdminPortal: (tab?: 'login' | 'register') => void;
}

export default function LandingPageView({ onEnterAdminPortal }: LandingPageViewProps) {
  // Simple interactive demo widget state for visitor playground
  const [demoRevenue, setDemoRevenue] = useState(500000);
  const [demoCogs, setDemoCogs] = useState(300000);
  const [demoExpense, setDemoExpense] = useState(50000);

  // Auto-calculated interactive metrics
  const grossProfit = demoRevenue - demoCogs;
  const netProfit = grossProfit - demoExpense;
  const devMargin = demoRevenue > 0 ? Math.round((netProfit / demoRevenue) * 100) : 0;

  return (
    <div className="bg-white min-h-screen text-[#111827] font-sans selection:bg-[#DCFCE7] selection:text-[#15803D]">
      {/* 1. Header/Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22C55E] rounded-[12px] flex items-center justify-center shadow-[0_4px_12px_rgba(34,197,94,0.25)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#15803D] block transition-all hover:opacity-90">
                BukuCuan
              </span>
              <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block leading-none">
                SaaS POS & Stok UMKM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onEnterAdminPortal('login')}
              className="border border-gray-150 hover:bg-gray-50 text-[#15803D] text-xs font-bold px-4 py-2.5 rounded-[12px] bg-white transition duration-200 active:scale-95 shadow-sm"
            >
              Masuk
            </button>
            <button
              onClick={() => onEnterAdminPortal('register')}
              className="bg-[#15803D] hover:bg-[#111827] text-white text-xs font-bold px-4 py-2.5 rounded-[12px] shadow-[0_4px_12px_rgba(34,197,94,0.15)] transition duration-200 active:scale-95 flex items-center gap-1.5"
            >
              Daftar
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#DCFCE7]/40 via-white to-white py-16 sm:py-24 border-b border-gray-50 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#DCFCE7] text-[#15803D] px-4 py-1.5 rounded-full border border-green-200 font-bold text-xs uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Solusi Modern Pencatatan Keuangan & Stok Toko
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#111827] leading-tight">
            Kendalikan <span className="text-[#15803D]">Stok Otomatis</span> & Audit Keuangan UMKM Secepat Kilat!
          </h1>
          
          <p className="text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            BukuCuan membantu pemilik warung dan UKM mengaudit Harga Pokok Penjualan (HPP) real-time, 
            memonitor arus kas digital, beserta sistem auto-order WhatsApp tanggap bencana ke Supplier resmi.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => onEnterAdminPortal('register')}
              className="w-full sm:w-auto bg-[#22C55E] hover:bg-[#15803D] text-white font-extrabold px-8 py-4 rounded-[16px] shadow-[0_10px_25px_rgba(34,197,94,0.3)] transition transform active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              Mulai Kelola Sekarang (Gratis)
              <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href="#playground" 
              className="w-full sm:w-auto bg-gray-55 hover:bg-gray-100 text-[#6B7280] font-semibold px-8 py-4 rounded-[16px] border border-gray-200 transition text-sm text-center"
            >
              Coba Kalkulator HPP
            </a>
          </div>
        </div>

        {/* Feature quick badges row */}
        <div className="max-w-6xl mx-auto px-6 mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-3 text-left">
            <div className="p-3 bg-[#DCFCE7] text-[#15803D] rounded-[12px]"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <span className="text-xs font-bold text-[#6B7280] block">Omset & HPP</span>
              <span className="font-extrabold text-[#111827] text-sm">Autocalculated</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-3 text-left">
            <div className="p-3 bg-blue-100 text-[#1D4ED8] rounded-[12px]"><Package className="w-5 h-5" /></div>
            <div>
              <span className="text-xs font-bold text-[#6B7280] block">Stok Kritis</span>
              <span className="font-extrabold text-[#111827] text-sm">SMS & WA Alerts</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-3 text-left">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-[12px]"><MessageSquare className="w-5 h-5" /></div>
            <div>
              <span className="text-xs font-bold text-[#6B7280] block">Pesanan ke Supplier</span>
              <span className="font-extrabold text-[#111827] text-sm">Auto-template WA</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-3 text-left">
            <div className="p-3 bg-purple-100 text-[#7C3AED] rounded-[12px]"><ShieldCheck className="w-5 h-5" /></div>
            <div>
              <span className="text-xs font-bold text-[#6B7280] block">Database Aman</span>
              <span className="font-extrabold text-[#111827] text-sm">Audit Terverifikasi</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Interactive Playground Calculator Section */}
      <section id="playground" className="py-20 bg-[#F9FAFB] border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="w-12 h-12 rounded-[16px] bg-[#22C55E]/10 text-[#15803D] flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight leading-tight">
              Playground Interaktif: <br />Bandingkan Laba Kotor vs Laba Bersih
            </h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Pahamkah Anda perbedaan antara Laba Kotor dan Laba Bersih pada bisnis Anda? 
              BukuCuan menghitung Harga Pokok Penjualan (HPP) dari harga modal supplier, sehingga Anda tidak salah dalam menentukan margin keuntungan penjualan.
            </p>
            <div className="p-4 bg-white rounded-[16px] border border-gray-200">
              <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                👉 <strong>Rumus BukuCuan:</strong> <br />
                • Laba Kotor = Omset - HPP <br />
                • Laba Bersih = Laba Kotor - Pengeluaran Operasional
              </p>
            </div>
          </div>

          {/* Right Live Calculator Widget */}
          <div className="lg:col-span-7 bg-white rounded-[24px] border border-gray-200 p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-extrabold text-base text-[#111827]">Simulasi Kasir & Rugi Laba BukuCuan</h3>
              <span className="text-[10px] uppercase font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-[6px] border border-green-150">
                Interactive Live Demo
              </span>
            </div>

            {/* Range controls */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#6B7280]">
                  <span>Omset Penjualan (Revenue)</span>
                  <span className="text-[#111827]">Rp {demoRevenue.toLocaleString('id-ID')}</span>
                </div>
                <input 
                  type="range" 
                  min="50000" 
                  max="5000000" 
                  step="50000"
                  value={demoRevenue}
                  onChange={(e) => setDemoRevenue(Number(e.target.value))}
                  className="w-full accent-[#22C55E]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#6B7280]">
                  <span>Harga Pokok Penjualan Modal (HPP / COGS)</span>
                  <span className="text-red-600">Rp {demoCogs.toLocaleString('id-ID')}</span>
                </div>
                <input 
                  type="range" 
                  min="30000" 
                  max={Math.min(demoRevenue, 4000000)} 
                  step="10000"
                  value={demoCogs}
                  onChange={(e) => setDemoCogs(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#6B7280]">
                  <span>Biaya Operasional Toko (Gaji / Listrik / Sewa)</span>
                  <span className="text-[#6B7280]">Rp {demoExpense.toLocaleString('id-ID')}</span>
                </div>
                <input 
                  type="range" 
                  min="10000" 
                  max="1000000" 
                  step="10000"
                  value={demoExpense}
                  onChange={(e) => setDemoExpense(Number(e.target.value))}
                  className="w-full accent-gray-600"
                />
              </div>
            </div>

            {/* Output Visual Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="p-4 bg-gray-50 rounded-[16px] border border-gray-100 text-left">
                <span className="text-[10px] text-[#6B7280] font-bold block uppercase tracking-wider">Laba Kotor</span>
                <span className="text-base font-extrabold text-[#111827] mt-1 block">
                  Rp {grossProfit.toLocaleString('id-ID')}
                </span>
                <span className="text-[9px] text-[#6B7280] block mt-0.5">Sisa setelah modal</span>
              </div>

              <div className="p-4 bg-[#DCFCE7] rounded-[16px] border border-[#DCFCE7] text-left">
                <span className="text-[10px] text-[#15803D] font-bold block uppercase tracking-wider">Laba Bersih harian</span>
                <span className={`text-base font-extrabold mt-1 block ${netProfit >= 0 ? 'text-[#15803D]' : 'text-red-600'}`}>
                  Rp {netProfit.toLocaleString('id-ID')}
                </span>
                <span className="text-[9px] text-[#15803D] block mt-0.5">
                  {netProfit >= 0 ? 'Cuan Bersih Untung' : 'Mengalami Kerugian'}
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-[16px] border border-gray-100 text-left">
                <span className="text-[10px] text-[#6B7280] font-bold block uppercase tracking-wider">Margin Laba</span>
                <span className={`text-base font-extrabold mt-1 block ${netProfit >= 0 ? 'text-[#15803D]' : 'text-amber-600'}`}>
                  <Percent className="w-3.5 h-3.5 inline mr-0.5" />
                  {devMargin}%
                </span>
                <span className="text-[9px] text-[#6B7280] block mt-0.5">Rasio efisiensi kas</span>
              </div>
            </div>

            <div className="flex items-center justify-center pt-2">
              <button
                onClick={() => onEnterAdminPortal('login')}
                className="w-full bg-[#15803D] hover:bg-[#111827] text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-[12px] shadow-[0_4px_12px_rgba(21,128,61,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Coba Kelola Database Asli Dengan Fitur Ini
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Elegant Features Grid */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-3.5 py-1.5 rounded-full">
            Fitur Unggulan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Semua yang Anda Butuhkan untuk Membesarkan UMKM Anda
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            Dari pencatatan transaksi toko hingga sistem koordinasi stok cerdas yang mengirimkan WhatsApp otomatis ke supplier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="border border-gray-100 p-8 rounded-[24px] bg-white shadow-[0_5px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition duration-300 flex flex-col space-y-4 text-left">
            <div className="w-12 h-12 rounded-[16px] bg-[#DCFCE7] text-[#15803D] flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#111827]">Sistem Kasir (POS) Fleksibel</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Catat penjualan kasir secara dinamis, pilih barang dagangan, dan kurangi stok gudang secara real-time otomatis saat dicetak.
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-[6px]">
                Support Cash & Transfer bank
              </span>
            </div>
          </div>

          <div className="border border-gray-100 p-8 rounded-[24px] bg-white shadow-[0_5px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition duration-300 flex flex-col space-y-4 text-left">
            <div className="w-12 h-12 rounded-[16px] bg-[#DCFCE7] text-[#15803D] flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#111827]">Auto-Draft PO WhatsApp</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Setiap kali stok barang kritis turun di bawah nilai minimal, draft WhatsApp penambahan stok otomatis terbentuk mengarah tepat ke Supplier.
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-[6px]">
                WhatsApp Gateway Ready
              </span>
            </div>
          </div>

          <div className="border border-gray-100 p-8 rounded-[24px] bg-white shadow-[0_5px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition duration-300 flex flex-col space-y-4 text-left">
            <div className="w-12 h-12 rounded-[16px] bg-[#DCFCE7] text-[#15803D] flex items-center justify-center font-bold">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#111827]">Audit HPP & Profit Bersih</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Analisis keuangan harian dengan perhitungan Harga Pokok Penjualan (HPP) yang akurat. Tidak ada lagi kerancuan kas warung dan keluarga.
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-[6px]">
                Laporan Komparatif SVG
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Pricing / Call-to-action */}
      <section className="bg-gradient-to-t from-[#DCFCE7]/30 to-white py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Siap Majukan Bisnis UMKM Beras, Sembako, atau Grosir Anda?
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] max-w-xl mx-auto leading-relaxed">
            Mulailah hari ini dan rasakan kemudahan pencatatan terstruktur berkat sistem cloud server BukuCuan yang ramah kuota.
          </p>

          <div className="pt-4">
            <button
              onClick={() => onEnterAdminPortal('register')}
              className="bg-[#15803D] hover:bg-[#111827] text-white font-extrabold text-sm px-10 py-5 rounded-[16px] shadow-lg transition transform active:scale-95 inline-flex items-center gap-2"
            >
              Masuk ke Dashboard Pengelolaan Admin
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex justify-center items-center gap-6 pt-4 text-xs font-bold text-[#6B7280]">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Akses Admin Selamanya</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Tidak Butuh Kartu Kredit</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 bg-gray-50 text-center text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 BukuCuan Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Syarat Layanan</a>
            <a href="#" className="hover:underline">Kebijakan Privasi</a>
            <a href="#" onClick={() => onEnterAdminPortal('login')} className="text-[#15803D] hover:underline font-bold">Portal Admin</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
