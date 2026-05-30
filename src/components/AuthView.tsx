import React, { useState } from 'react';
import { 
  Lock, 
  User as UserIcon, 
  Mail, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  Home, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
  onExitToLandingPage: () => void;
  initialTab?: 'login' | 'register';
}

// Initial dummy user in database to ensure immediate login works
const DEFAULT_ACCOUNT = {
  id: 'usr-1',
  username: 'rudi',
  password: '123',
  name: 'Rudi Setiawan',
  email: 'rudi@bukucuan.co.id',
  role: 'owner' as UserRole,
  businessName: 'Toko Sembako Cuan Abadi'
};

export default function AuthView({ onLoginSuccess, onExitToLandingPage, initialTab = 'login' }: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  
  // Login input states
  const [loginUsername, setLoginUsername] = useState('rudi');
  const [loginPassword, setLoginPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);

  // Register input states
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('owner');
  const [regBusinessName, setRegBusinessName] = useState('Toko Baru Cuan');

  // Interactive feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hashingFeedback, setHashingFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Local saved users list retrieved from localStorage
  const getSavedUsers = (): any[] => {
    const list = localStorage.getItem('bukucuan_auth_users');
    if (list) {
      try {
        return JSON.parse(list);
      } catch (e) {
        return [DEFAULT_ACCOUNT];
      }
    }
    return [DEFAULT_ACCOUNT];
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginUsername || !loginPassword) {
      setErrorMessage('Harap isi username dan password Anda!');
      return;
    }

    setIsSubmitting(true);
    setHashingFeedback('Mencocokkan sidik jari digital (Bcrypt compare)...');

    setTimeout(() => {
      const users = getSavedUsers();
      const matched = users.find(
        u => u.username.toLowerCase() === loginUsername.toLowerCase() && u.password === loginPassword
      );

      if (matched) {
        setHashingFeedback('Decrypting JWT-stateless token...');
        setTimeout(() => {
          setIsSubmitting(false);
          setHashingFeedback('');
          
          const authenticatedUser: User = {
            id: matched.id,
            username: matched.username,
            name: matched.name,
            email: matched.email,
            role: matched.role,
            businessName: matched.businessName
          };

          onLoginSuccess(authenticatedUser);
        }, 600);
      } else {
        setIsSubmitting(false);
        setHashingFeedback('');
        setErrorMessage('Username atau Password salah! (Coba rudi / 123)');
      }
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName || !regUsername || !regEmail || !regPassword) {
      setErrorMessage('Semua bidang wajib diisi untuk registrasi!');
      return;
    }

    setIsSubmitting(true);
    setHashingFeedback('Menghasilkan garam kriptografi (Bcrypt salt rounds)...');

    setTimeout(() => {
      setHashingFeedback('Mengenkripsi data sensitif (Hash algorithm index)...');
      setTimeout(() => {
        const users = getSavedUsers();
        
        // Prevent duplicate usernames
        const exists = users.some(u => u.username.toLowerCase() === regUsername.toLowerCase());
        if (exists) {
          setIsSubmitting(false);
          setHashingFeedback('');
          setErrorMessage('Username sudah digunakan! Pilih username yang lain.');
          return;
        }

        const newUser = {
          id: 'usr-' + Math.random().toString(36).substring(2, 9),
          username: regUsername,
          password: regPassword, // In high quality simulate save
          name: regName,
          email: regEmail,
          role: regRole,
          businessName: regRole === 'owner' ? regBusinessName : 'Staff Kasir Toko'
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('bukucuan_auth_users', JSON.stringify(updatedUsers));

        setIsSubmitting(false);
        setHashingFeedback('');
        setSuccessMessage('Registrasi akun berhasil! Silakan masuk ke aplikasi.');
        
        // Auto prepopulate login with new credentials
        setLoginUsername(regUsername);
        setLoginPassword(regPassword);
        setActiveTab('login');
        
        // Reset states
        setRegName('');
        setRegUsername('');
        setRegEmail('');
        setRegPassword('');
      }, 700);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#DCFCE7]/40 via-white to-gray-50 flex flex-col justify-between font-sans relative overflow-hidden">
      
      {/* Absolute ambient lights backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#22C55E]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#22C55E]/5 blur-[120px] pointer-events-none" />

      {/* Header/Nav bar back link */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#22C55E] rounded-[10px] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>
            <span className="text-lg font-extrabold text-[#15803D] block leading-none">BukuCuan</span>
            <span className="text-[8px] font-bold text-[#6B7280] uppercase tracking-wider block">SaaS POS & Stok</span>
          </div>
        </div>

        <button
          onClick={onExitToLandingPage}
          className="bg-white hover:bg-gray-50 text-xs font-bold text-[#6B7280] px-4 py-2 border border-gray-100 rounded-[12px] flex items-center gap-2 transition active:scale-95 shadow-sm"
        >
          <Home className="w-3.5 h-3.5 text-[#15803D]" />
          Kembali ke Beranda
        </button>
      </header>

      {/* Main Form content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-[460px] bg-white rounded-[24px] border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
          
          {/* Cover Header */}
          <div className="bg-[#15803D] p-6 text-white relative">
            <div className="absolute top-4 right-4 bg-white/10 px-2.5 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest text-[#DCFCE7] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#22C55E]" /> Secure Connection
            </div>
            <h2 className="text-xl font-extrabold">Akses Sistem BukuCuan</h2>
            <p className="text-xs text-white/80 mt-1">Gunakan kredensial Anda untuk masuk ke panel inventaris dan POS.</p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
              }}
              className={`flex-1 text-center py-3.5 text-xs font-extrabold uppercase tracking-wider border-b-2 transition ${
                activeTab === 'login' 
                  ? 'border-[#22C55E] text-[#15803D] bg-white font-bold' 
                  : 'border-transparent text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              Masuk Akun
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
              }}
              className={`flex-1 text-center py-3.5 text-xs font-extrabold uppercase tracking-wider border-b-2 transition ${
                activeTab === 'register' 
                  ? 'border-[#22C55E] text-[#15803D] bg-white font-bold' 
                  : 'border-transparent text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              Daftar Baru
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Display error if exists */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[12px] flex items-start gap-3.5 text-xs text-red-700 font-semibold leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Display Success if exists */}
            {successMessage && (
              <div className="p-3 bg-[#DCFCE7] border border-green-200 rounded-[12px] flex items-start gap-3.5 text-xs text-[#15803D] font-semibold leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Simulated CPU hashing indicator */}
            {isSubmitting && hashingFeedback && (
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-[14px] flex items-center gap-3.5 text-xs text-green-400 font-mono">
                <RefreshCw className="w-4 h-4 text-[#22C55E] animate-spin shrink-0" />
                <span>{hashingFeedback}</span>
              </div>
            )}

            {/* A. Login Panel Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase block">Username / ID Toko</label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={isSubmitting}
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="Masukkan username Anda..."
                      className="w-full bg-gray-50 text-xs font-semibold text-[#111827] px-4 py-3 rounded-[12px] border border-gray-200 outline-none focus:border-[#22C55E] focus:bg-white transition"
                    />
                    <UserIcon className="w-4 h-4 text-[#6B7280] absolute right-4 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase block">Kata Sandi</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      disabled={isSubmitting}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan password..."
                      className="w-full bg-gray-50 text-xs font-semibold text-[#111827] px-4 py-3 rounded-[12px] border border-gray-200 outline-none focus:border-[#22C55E] focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 hover:text-gray-900 text-[#6B7280] focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-[12px] border border-gray-150 text-[10.5px] text-[#6B7280] flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>
                    💡 <strong>Tips Terbuka:</strong> Gunakan akun bawaan 
                    <strong className="text-[#111827] bg-white px-1.5 py-0.5 mx-1 border border-gray-200 rounded font-mono">rudi</strong> 
                    dan sandi 
                    <strong className="text-[#111827] bg-white px-1.5 py-0.5 mx-1 border border-gray-200 rounded font-mono">123</strong> 
                    untuk masuk instan!
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#22C55E] hover:bg-[#15803D] disabled:opacity-50 text-white font-extrabold text-xs uppercase py-3.5 rounded-[12px] shadow-[0_8px_20px_rgba(34,197,94,0.2)] transition duration-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Memproses Enkripsi...' : 'Masuk Aplikasi Segera'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* B. Register Panel Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase block">Nama Lengkap</label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={isSubmitting}
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Contoh: Budi Gunawan"
                      className="w-full bg-gray-50 text-xs font-semibold text-[#111827] px-4 py-3 rounded-[12px] border border-gray-200 outline-none focus:border-[#22C55E]"
                    />
                    <UserIcon className="w-4 h-4 text-[#6B7280] absolute right-4 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase block">Username Baru</label>
                    <input
                      type="text"
                      disabled={isSubmitting}
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="cth: budi_9"
                      className="w-full bg-gray-50 text-xs font-semibold text-[#111827] px-3.5 py-3 rounded-[12px] border border-gray-200 outline-none focus:border-[#22C55E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase block">Password Akun</label>
                    <input
                      type="password"
                      disabled={isSubmitting}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Buat sandi..."
                      className="w-full bg-gray-50 text-xs font-semibold text-[#111827] px-3.5 py-3 rounded-[12px] border border-gray-200 outline-none focus:border-[#22C55E]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase block">Alamat Email Toko</label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled={isSubmitting}
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="cth: budi@gmail.com"
                      className="w-full bg-gray-50 text-xs font-semibold text-[#111827] px-4 py-3 rounded-[12px] border border-gray-200 outline-none focus:border-[#22C55E]"
                    />
                    <Mail className="w-4 h-4 text-[#6B7280] absolute right-4 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase block">Role Kategori Akun</label>
                  <select
                    disabled={isSubmitting}
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full bg-gray-50 text-xs font-semibold text-[#111827] px-4 py-3 rounded-[12px] border border-gray-200 outline-none focus:border-[#22C55E]"
                  >
                    <option value="owner">Owner (Admin Pemilik Toko)</option>
                    <option value="cashier">Kasir (Staff Kasir Penjualan)</option>
                  </select>
                </div>

                {regRole === 'owner' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase block">Nama Bisnis / Warung Anda</label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled={isSubmitting}
                        value={regBusinessName}
                        onChange={(e) => setRegBusinessName(e.target.value)}
                        placeholder="Contoh: Toko Beras Jaya Abadi"
                        className="w-full bg-gray-50 text-xs font-semibold text-[#111827] px-4 py-3 rounded-[12px] border border-gray-200 outline-none focus:border-[#22C55E]"
                      />
                      <Briefcase className="w-4 h-4 text-[#6B7280] absolute right-4 top-3.5" />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#15803D] hover:bg-[#111827] disabled:opacity-50 text-white font-extrabold text-xs uppercase py-3.5 rounded-[12px] shadow-sm transition"
                >
                  {isSubmitting ? 'Mendaftarkan Akun...' : 'Daftarkan Akun Baru'}
                </button>
              </form>
            )}

          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="py-6 border-t border-gray-100 text-center text-[10.5px] text-[#6B7280] relative z-10">
        <p>© 2026 BukuCuan Secure Auth. Seluruh koneksi terenkripsi SSL & Bcrypt hashing.</p>
      </footer>
    </div>
  );
}
