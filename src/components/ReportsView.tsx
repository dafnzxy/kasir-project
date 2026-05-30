import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  Percent, 
  HelpCircle,
  PiggyBank,
  BriefcaseBusiness,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import { Transaction, Product } from '../types';

interface ReportsViewProps {
  transactions: Transaction[];
  products: Product[];
}

export default function ReportsView({
  transactions,
  products
}: ReportsViewProps) {
  const [selectedDate, setSelectedDate] = useState('2026-05-30');

  // Group transactions by date to build the analytical report
  const getDailyReport = (dateStr: string) => {
    const dayTxs = transactions.filter(t => t.date === dateStr);
    
    const revenue = dayTxs
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = dayTxs
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    let cogs = 0; // HPP (Harga Pokok Penjualan)
    dayTxs.forEach(t => {
      if (t.type === 'income' && t.productId) {
        const prod = products.find(p => p.id === t.productId);
        if (prod) {
          cogs += (prod.costPrice * (t.quantity || 1));
        }
      }
    });

    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - expense;
    const margin = revenue > 0 ? Math.round((netProfit / revenue) * 100) : 0;

    return {
      date: dateStr,
      revenue,
      cogs,
      expense,
      grossProfit,
      netProfit,
      margin,
      txCount: dayTxs.length
    };
  };

  // Get date lists sorted descending
  const dates = Array.from(new Set(transactions.map(t => t.date))).sort().reverse();
  const selectedReport = getDailyReport(selectedDate);

  // Prepare chart series data
  const chartData = dates.slice().reverse().map(d => getDailyReport(d));
  const maxNetProfit = Math.max(...chartData.map(d => Math.abs(d.netProfit)), 50000);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto max-h-screen pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-light-green text-dark-green border border-green-200 shadow-sm">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
              Laporan Analisis Profitabilitas Harian
            </h1>
            <p className="text-sm text-text-secondary">
              Perhitungan mendalam harga pokok penjualan (HPP), efisiensi biaya, laba bersih harian, dan margin laba BukuCuan.
            </p>
          </div>
        </div>
      </div>

      {/* Main Graph (Visual Analytics drawn with SVG) */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 custom-shadow space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-text-primary text-base">Grafik Kinerja Laba Bersih Berkala</h3>
            <span className="text-xs text-text-secondary">Visualisasi laba bersih harian (dalam ribuan rupiah)</span>
          </div>
          <span className="text-[10px] bg-green-50 text-dark-green font-bold px-3 py-1 rounded-full border border-green-150 uppercase">
            HPP Autocalculated
          </span>
        </div>

        {/* Responsive custom SVG representation of clean financial line bar bars */}
        <div className="h-64 rounded-2xl bg-gray-50 p-6 relative flex flex-col justify-between border border-gray-100">
          
          {/* Chart Grid Lines */}
          <div className="absolute inset-x-6 top-1/2 h-[1px] bg-gray-200" />
          
          <div className="flex-1 flex items-end justify-around gap-6 relative z-10 pt-4">
            {chartData.map((d, i) => {
              // Calculate ratio relative to max net profit
              const heightPercentage = Math.min(100, Math.round((Math.abs(d.netProfit) / maxNetProfit) * 75));
              const isPositive = d.netProfit >= 0;

              return (
                <div key={d.date} className="flex-1 flex flex-col items-center group cursor-pointer">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 bg-gray-950 text-white font-mono text-[9px] px-2.5 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none shadow-md text-center">
                    <span className="block font-bold">{d.date}</span>
                    <span className="text-green-400 font-bold block">Profit: Rp {d.netProfit.toLocaleString('id-ID')}</span>
                    <span className="text-gray-400 block">Omset: Rp {d.revenue.toLocaleString('id-ID')}</span>
                  </div>

                  {/* Responsive column block */}
                  <div className="w-full flex flex-col justify-end h-32 relative">
                    <div 
                      style={{ 
                        height: `${heightPercentage}%`,
                        bottom: isPositive ? '50%' : 'auto',
                        top: !isPositive ? '50%' : 'auto'
                      }}
                      className={`w-full rounded-md transition duration-300 absolute ${
                        isPositive 
                          ? 'bg-primary-green hover:bg-primary-green/90' 
                          : 'bg-[#DC2626] hover:bg-[#DC2626]/90'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-text-secondary mt-1 block">{d.date.substring(5)}</span>
                </div>
              );
            })}
          </div>

          {/* Legend items */}
          <div className="flex justify-end gap-5 text-[10px] font-bold uppercase tracking-wider text-text-secondary pt-3 border-t border-gray-200/60">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-primary-green inline-block" /> Laba Berlebih (Cuan)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#DC2626] inline-block" /> Defisit Rugi (Operasional &gt; Penjualan)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Date Selector & List (Left column, 1 Span width) */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 custom-shadow space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Calendar className="w-4 h-4 text-text-secondary" />
            <h3 className="font-extrabold text-text-primary text-base">Arsip Tanggal Laba</h3>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Pilihlah salah satu tanggal operasional harian BukuCuan di bawah ini untuk melihat audit komparatif HPP, pengeluaran gaji, dan rasio laba bersih secara terperinci.
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {dates.map((date) => {
              const report = getDailyReport(date);
              const isSelected = selectedDate === date;

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`w-full flex items-center justify-between p-3 rounded-[12px] border text-left transition ${
                    isSelected 
                      ? 'bg-[#DCFCE7] border-[#22C55E] text-[#15803D]' 
                      : 'border-gray-200 hover:bg-gray-50 text-[#6B7280]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block text-text-primary">{date}</span>
                    <span className="text-[10px] text-text-secondary">Omset: Rp {report.revenue.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-extrabold ${report.netProfit >= 0 ? 'text-primary-green' : 'text-danger'}`}>
                      {report.netProfit >= 0 ? '+' : ''} Rp {report.netProfit.toLocaleString('id-ID')}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary/70" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audit Details Panel (Right, 2 Spans width) */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 custom-shadow space-y-6">
          <div className="pb-3 border-b border-gray-100">
            <span className="text-[10px] text-primary-green font-extrabold uppercase block tracking-wider">Audit Finansial Harian</span>
            <h3 className="font-extrabold text-text-primary text-lg">Laporan Analisis Laba Rugi Tanggal: {selectedDate}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Harga Pokok Pembelian (HPP/COGS)</span>
              <h4 className="text-lg font-extrabold text-text-primary">
                Rp {selectedReport.cogs.toLocaleString('id-ID')}
              </h4>
              <p className="text-[9.5px] text-text-secondary/80">Kalkulasi modal barang yang laku berdasar harga beli supplier resmi.</p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Margin Keuntungan Berbayar</span>
              <h4 className={`text-lg font-extrabold flex items-center gap-1 ${selectedReport.margin >= 18 ? 'text-primary-green' : 'text-amber-600'}`}>
                <Percent className="w-4 h-4" /> {selectedReport.margin}%
              </h4>
              <p className="text-[9.5px] text-text-secondary/80">Rasio perbandingan keuntungan bersih terhadap total omset.</p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Laba Kotor (Gross Profit)</span>
              <h4 className="text-lg font-extrabold text-heading-primary text-text-primary">
                Rp {selectedReport.grossProfit.toLocaleString('id-ID')}
              </h4>
              <p className="text-[9.5px] text-text-secondary/80">Omset Penjualan dikurangi modal HPP inventori (Rp {selectedReport.revenue.toLocaleString('id-ID')} - Rp {selectedReport.cogs.toLocaleString('id-ID')}).</p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Laba Bersih (Net Profit)</span>
              <h4 className={`text-lg font-extrabold flex items-center gap-1 ${selectedReport.netProfit >= 0 ? 'text-primary-green' : 'text-danger'}`}>
                {selectedReport.netProfit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                Rp {selectedReport.netProfit.toLocaleString('id-ID')}
              </h4>
              <p className="text-[9.5px] text-text-secondary/80">Laba kotor dikurangi biaya operasional/listrik/gaji karyawan toko harian.</p>
            </div>

          </div>

          <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-2xl flex items-start gap-3">
            <PiggyBank className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 space-y-1 leading-relaxed">
              <strong>Rangkuman Penilaian Hari Ini:</strong>
              {selectedReport.netProfit > 50000 ? (
                <p>Kinerja finansial harian Anda sangat baik! Persentase laba bersih melebihi standard minimal UMKM. Pembelanjaan restock dan biaya operasional terkontrol dengan sehat di angka Rp {selectedReport.expense.toLocaleString('id-ID')}.</p>
              ) : selectedReport.netProfit >= 0 ? (
                <p>Arus kas harian seimbang/break-even. Pastikan tingkat konversi kasir POS ditingkatkan lusa untuk meningkatkan profitabilitas, dan waspadai pelandukan persediaan sebelum HPP naik.</p>
              ) : (
                <p>Defisit terdeteksi! Pengeluaran operasional (gaji/listrik/restock belanja) bernilai lebih tinggi dibanding pendapatan penjualan harian. Disarankan membatasi pengeluaran non-stok dalam sisa minggu ini.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
