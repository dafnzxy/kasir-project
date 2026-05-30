import { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  Compass, 
  FileCode, 
  ArrowRight, 
  Play, 
  Info,
  Layers
} from 'lucide-react';
import { POSTGRES_DDL_SCRIPT } from '../data/dbSchema';

export default function DatabaseSchemaView() {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'erd' | 'ddl' | 'playground'>('erd');
  const [selectedPlaygroundQuery, setSelectedPlaygroundQuery] = useState('low-stock');
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [queryExecutionTime, setQueryExecutionTime] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(POSTGRES_DDL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sqlTemplates = {
    'low-stock': {
      title: 'Cari Produk Stok Menipis & Hubungi Supplier',
      description: 'Menampilkan data produk yang berada di bawah ambang batas minimal beserta nama supplier, nomor telepon, dan sisa stok untuk automasi pemesanan.',
      sql: `SELECT 
    p.sku, 
    p.name AS nama_produk, 
    p.stock AS stok_saat_ini, 
    p.min_stock AS stok_minimum,
    s.name AS nama_supplier, 
    s.phone AS telepon_supplier
FROM products p
LEFT JOIN suppliers s ON p.supplier_id = s.id
WHERE p.stock <= p.min_stock
ORDER BY p.stock ASC;`,
      results: [
        { sku: 'TLR-RAS-1K', nama_produk: 'Telur Ayam Ras Grade A 1kg', stok_saat_ini: 3, stok_minimum: 10, nama_supplier: 'CV Tani Sejahtera Mandiri', telepon_supplier: '089988776655' },
        { sku: 'MYK-SUN-2L', nama_produk: 'Minyak Goreng SunCo 2L', stok_saat_ini: 6, stok_minimum: 12, nama_supplier: 'PT Sinar Pangan Semesta', telepon_supplier: '081234567890' },
        { sku: 'GLK-PAS-1K', nama_produk: 'Gula Pasir Gulaku 1kg', stok_saat_ini: 8, stok_minimum: 15, nama_supplier: 'Sinar Abadi Distribusi Grosir', telepon_supplier: '085711223344' }
      ]
    },
    'daily-profitability': {
      title: 'Analisis Pendapatan Bersih (Net Profit) & HPP Harian',
      description: 'Menghitung total penjualan, pengeluaran HPP, pengeluaran operasional lain, dan total laba bersih per tanggal hari ini.',
      sql: `SELECT 
    t.date AS tanggal,
    COUNT(t.id) AS jumlah_transaksi,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) AS total_pendapatan,
    SUM(CASE WHEN t.type = 'income' AND p.cost_price IS NOT NULL THEN p.cost_price * t.quantity ELSE 0 END) AS total_hpp,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS total_operasional,
    (SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) - 
     SUM(CASE WHEN t.type = 'income' AND p.cost_price IS NOT NULL THEN p.cost_price * t.quantity ELSE 0 END) - 
     SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END)) AS laba_bersih
FROM transactions t
LEFT JOIN products p ON t.product_id = p.id
GROUP BY t.date
ORDER BY t.date DESC;`,
      results: [
        { tanggal: '2026-05-30', jumlah_transaksi: 4, total_pendapatan: 607500, total_hpp: 248500, total_operasional: 50000, laba_bersih: 309000 },
        { tanggal: '2026-05-29', jumlah_transaksi: 3, total_pendapatan: 262000, total_hpp: 218000, total_operasional: 75000, laba_bersih: -31000 },
        { tanggal: '2026-05-28', jumlah_transaksi: 3, total_pendapatan: 147000, total_hpp: 123000, total_operasional: 150000, laba_bersih: -126000 }
      ]
    },
    'supplier-transactions': {
      title: 'Akumulasi Transaksi & Pengeluaran Restock Berdasarkan Supplier',
      description: 'Mengelompokkan reorder barang yang berstatus "received" untuk memetakan berapa banyak dana belanja yang terserap oleh masing-masing supplier.',
      sql: `SELECT 
    s.name AS nama_supplier,
    COUNT(r.id) AS total_restock,
    SUM(r.estimated_cost) AS total_biaya_restock,
    s.email AS email_supplier
FROM reorder_orders r
INNER JOIN suppliers s ON r.supplier_id = s.id
WHERE r.status = 'received' OR r.status = 'sent'
GROUP BY s.id, s.name, s.email
ORDER BY total_biaya_restock DESC;`,
      results: [
        { nama_supplier: 'PT Sinar Pangan Semesta', total_restock: 1, total_biaya_restock: 870000, email_supplier: 'kontak@sinarpangan.com' },
        { nama_supplier: 'CV Tani Sejahtera Mandiri', total_restock: 1, total_biaya_restock: 440000, email_supplier: 'info@tanisejahtera.org' }
      ]
    }
  };

  const handleRunQuery = () => {
    setQueryResults([]);
    const start = performance.now();
    setTimeout(() => {
      const template = sqlTemplates[selectedPlaygroundQuery as keyof typeof sqlTemplates];
      setQueryResults(template.results);
      setQueryExecutionTime(Math.round(performance.now() - start + 2)); // simulate DB parse time
    }, 300);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto max-h-screen pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-light-green text-dark-green border border-green-200 shadow-sm">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
              Desain Relasi Database PostgreSQL
            </h1>
            <p className="text-sm text-text-secondary">
              Arsitektur database relasional yang dinormalisasi untuk efisiensi penyimpanan, integritas, dan kecepatan pencarian.
            </p>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="bg-gray-100 p-1 rounded-xl flex">
          <button
            onClick={() => setActiveSubTab('erd')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeSubTab === 'erd'
                ? 'bg-white shadow text-dark-green'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Compass className="w-3.5 h-3.5 inline mr-1" /> ERD Visual
          </button>
          <button
            onClick={() => setActiveSubTab('ddl')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeSubTab === 'ddl'
                ? 'bg-white shadow text-dark-green'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 inline mr-1" /> Script DDL (Postgres)
          </button>
          <button
            onClick={() => setActiveSubTab('playground')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeSubTab === 'playground'
                ? 'bg-white shadow text-dark-green'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Play className="w-3.5 h-3.5 inline mr-1" /> SQL Playground
          </button>
        </div>
      </div>

      {/* Tab Content 1: ERD Visual Mapping */}
      {activeSubTab === 'erd' && (
        <div className="space-y-6">
          <div className="p-4 bg-light-green/40 border border-green-200/50 rounded-2xl text-[13px] text-dark-green flex items-start gap-3">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>Informasi Skema Database:</strong> ER Diagram ini memvisualisasikan bagaimana draf tabel berelasi. Setiap tabel dioptimalkan dengan tipe data terstruktur (misalnya <code>DECIMAL(12,2)</code> untuk nominal rupiah, <code>UUID</code> untuk primary key, dan <code>FK Constraints</code> untuk integritas referensial).
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            
            {/* Table 1: Suppliers */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 custom-shadow-lg space-y-3 relative overflow-hidden">
              <div className="bg-indigo-600 text-white p-2.5 rounded-xl text-xs font-extrabold flex justify-between items-center">
                <span>[Table] suppliers</span>
                <span className="text-[9px] bg-indigo-700 px-1.5 py-0.5 rounded font-bold">1:M</span>
              </div>
              <div className="font-mono text-xs space-y-1">
                <div className="text-blue-600 font-bold">★ id : UUID</div>
                <div>name : VARCHAR(100)</div>
                <div>contact_person : VARCHAR(100)</div>
                <div>phone : VARCHAR(20)</div>
                <div className="text-gray-400">email : VARCHAR(100) (Unique)</div>
                <div className="text-gray-400">address : TEXT</div>
                <div className="text-gray-400">auto_notify_enabled : BOOLEAN</div>
              </div>
            </div>

            {/* Table 2: Users */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 custom-shadow-lg space-y-3 relative overflow-hidden">
              <div className="bg-gray-800 text-white p-2.5 rounded-xl text-xs font-extrabold flex justify-between items-center">
                <span>[Table] users</span>
                <span className="text-[9px] bg-gray-700 px-1.5 py-0.5 rounded font-bold">Audit</span>
              </div>
              <div className="font-mono text-xs space-y-1">
                <div className="text-blue-600 font-bold">★ id : UUID</div>
                <div>username : VARCHAR(50)</div>
                <div className="text-gray-400">password_hash : VARCHAR(255)</div>
                <div>email : VARCHAR(100)</div>
                <div>name : VARCHAR(100)</div>
                <div className="text-amber-600 font-semibold">role : user_role_enum</div>
                <div className="text-cyan-600">⚓ supplier_id : UUID (FK)</div>
              </div>
            </div>

            {/* Table 3: Products */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 custom-shadow-lg space-y-3 relative overflow-hidden">
              <div className="bg-green-700 text-white p-2.5 rounded-xl text-xs font-extrabold flex justify-between items-center">
                <span>[Table] products</span>
                <span className="text-[9px] bg-green-800 px-1.5 py-0.5 rounded font-bold">1:M Target</span>
              </div>
              <div className="font-mono text-xs space-y-1">
                <div className="text-blue-600 font-bold">★ id : UUID</div>
                <div>name : VARCHAR(150)</div>
                <div className="text-gray-400">sku : VARCHAR(50) (Unique)</div>
                <div>category : VARCHAR(50)</div>
                <div>cost_price : DECIMAL(12,2)</div>
                <div>selling_price : DECIMAL(12,2)</div>
                <div className="text-red-500 font-bold">stock : INT</div>
                <div className="text-gray-400">min_stock : INT</div>
                <div className="text-cyan-600">⚓ supplier_id : UUID (FK)</div>
              </div>
            </div>

            {/* Table 4: Transactions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 custom-shadow-lg space-y-3 relative overflow-hidden">
              <div className="bg-[#DC2626] text-white p-2.5 rounded-xl text-xs font-extrabold flex justify-between items-center">
                <span>[Table] transactions</span>
                <span className="text-[9px] bg-red-700 px-1.5 py-0.5 rounded font-bold">Ledger</span>
              </div>
              <div className="font-mono text-xs space-y-1">
                <div className="text-blue-600 font-bold">★ id : UUID</div>
                <div className="text-amber-500 font-semibold">date : DATE</div>
                <div className="text-purple-600 font-semibold">type : transaction_type_enum</div>
                <div className="font-bold">amount : DECIMAL(15,2)</div>
                <div>category : VARCHAR(50)</div>
                <div className="text-cyan-600">⚓ created_by : UUID (FK)</div>
                <div className="text-cyan-600">⚓ product_id : UUID (FK)</div>
                <div className="text-gray-400">quantity : INT</div>
              </div>
            </div>

            {/* Table 5: Reorders */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 custom-shadow-lg space-y-3 relative overflow-hidden col-span-1 md:col-span-2 lg:col-span-1">
              <div className="bg-amber-500 text-white p-2.5 rounded-xl text-xs font-extrabold flex justify-between items-center">
                <span>[Table] reorder_orders</span>
                <span className="text-[9px] bg-amber-600 px-1.5 py-0.5 rounded font-bold">Notification</span>
              </div>
              <div className="font-mono text-xs space-y-1">
                <div className="text-blue-600 font-bold">★ id : UUID</div>
                <div>date : DATE</div>
                <div className="text-cyan-600">⚓ product_id : UUID (FK)</div>
                <div className="text-cyan-600">⚓ supplier_id : UUID (FK)</div>
                <div>quantity : INT</div>
                <div className="text-gray-400">estimated_cost : DECIMAL(15,2)</div>
                <div className="text-amber-600 font-semibold">status : reorder_status_enum</div>
                <div className="text-gray-400 truncate">message_text : TEXT</div>
                <div className="text-gray-400">notification_type : VARCHAR</div>
              </div>
            </div>

            {/* Visual explanations of relations on bottom cards */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-center space-y-2 text-xs">
              <span className="font-bold text-text-primary text-sm flex items-center gap-1.5 text-dark-green">
                <Layers className="w-4 h-4" /> Optimasi Integritas & Keamanan
              </span>
              <ul className="space-y-1.5 text-text-secondary list-disc pl-4 font-medium">
                <li>Primary key menggunakan <code>UUID</code> untuk keamanan ID generator dan skalabilitas sync.</li>
                <li>HPP (cost_price) dikunci di tabel <code>products</code> untuk menghitung COGS secara dinamis.</li>
                <li>Indeks <code>idx_products_stock_alert</code> memastikan kueri notifikasi dihitung di bawah &lt;1ms.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: DDL Scripts */}
      {activeSubTab === 'ddl' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Script DDL SQL untuk PostgreSQL v12+
            </span>
            <button
              onClick={handleCopy}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs text-text-primary px-3 py-2 rounded-xl transition flex items-center gap-1.5 font-bold"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-primary-green" />
                  Salin Berhasil!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Salin SQL
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-gray-950 text-green-400 font-mono text-xs rounded-2xl overflow-x-auto max-h-[500px] border border-gray-900 shadow-inner">
            <pre>{POSTGRES_DDL_SCRIPT}</pre>
          </div>
        </div>
      )}

      {/* Tab Content 3: SQL Simulation Sandbox */}
      {activeSubTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Query Selector (Left Panel) */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 custom-shadow space-y-5 lg:col-span-1">
            <h3 className="font-bold text-text-primary text-base">Templates Kasus Finansial / POS</h3>
            <p className="text-xs text-text-secondary">
              Pilih kasus query SQL di bawah ini untuk menguji bagaimana relasi database PostgreSQL BukuCuan menyelesaikan kalkulasi finansial real-time.
            </p>

            <div className="space-y-3">
              {Object.keys(sqlTemplates).map((key) => {
                const template = sqlTemplates[key as keyof typeof sqlTemplates];
                const isSelected = selectedPlaygroundQuery === key;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedPlaygroundQuery(key);
                      setQueryResults([]);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-light-green border-primary-green text-dark-green shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50 text-text-secondary'
                    }`}
                  >
                    <span className="text-xs font-bold block text-text-primary">{template.title}</span>
                    <span className="text-[10px] text-text-secondary line-clamp-2">{template.description}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleRunQuery}
              className="w-full bg-dark-green text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-dark-green/90 transition shadow flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5" /> Jalankan Run Query SQL
            </button>
          </div>

          {/* Code Viewer & Result Tabular (Right Panel) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Real SQL code preview */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 shadow-lg space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kueri Dijalankan</span>
              <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                {sqlTemplates[selectedPlaygroundQuery as keyof typeof sqlTemplates].sql}
              </pre>
            </div>

            {/* Simulator Output Result */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 custom-shadow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Tabular Output (Query Result)</span>
                {queryResults.length > 0 && (
                  <span className="text-[10px] text-text-secondary">Waktu Eksekusi: <strong className="text-primary-green">{queryExecutionTime} ms</strong></span>
                )}
              </div>

              {queryResults.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Database className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="text-xs font-bold text-text-secondary">Kosong - Klik Jalankan SQL Kueri</span>
                  <p className="text-[10px] text-text-secondary/70">Tekan tombol hijau untuk memacu compiler simulasi relasi data BukuCuan.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-text-secondary uppercase tracking-wider font-bold text-[10px]">
                      <tr>
                        {Object.keys(queryResults[0]).map((header) => (
                          <th key={header} className="p-3">
                            {header.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {queryResults.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          {Object.values(row).map((val: any, idx2) => (
                            <td key={idx2} className="p-3 font-semibold text-text-primary">
                              {typeof val === 'number' && val > 1000 
                                ? 'Rp ' + val.toLocaleString('id-ID')
                                : val.toString()
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
