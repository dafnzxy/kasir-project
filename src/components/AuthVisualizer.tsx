import { useState, useEffect } from 'react';
import { 
  Key, 
  Lock, 
  ShieldCheck, 
  Cpu, 
  Hash, 
  Binary, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';
import { UserRole } from '../types';

export default function AuthVisualizer() {
  // Bcrypt states
  const [bcryptPassword, setBcryptPassword] = useState('BukuCuanSangatAman2026!');
  const [saltRounds, setSaltRounds] = useState(10);
  const [computedHash, setComputedHash] = useState('');
  const [hashTime, setHashTime] = useState(0);
  const [isHashing, setIsHashing] = useState(false);
  const [testPassword, setTestPassword] = useState('BukuCuanSangatAman2026!');
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  // JWT states
  const [jwtRole, setJwtRole] = useState<UserRole>('owner');
  const [jwtUser, setJwtUser] = useState('Andi Wibowo');
  const [jwtBusiness, setJwtBusiness] = useState('Kios Cuan Sejahtera');
  const [generatedToken, setGeneratedToken] = useState('');
  const [jwtPayload, setJwtPayload] = useState<any>(null);
  const [isTokenForged, setIsTokenForged] = useState(false);
  const [forgedRole, setForgedRole] = useState<string>('owner');
  const [tokenVerificationResult, setTokenVerificationResult] = useState<'valid' | 'invalid'>('valid');

  // Initial calculation on mount
  useEffect(() => {
    generateMockBcrypt();
    generateMockJWT();
  }, []);

  // Sync JWT generation
  useEffect(() => {
    generateMockJWT();
  }, [jwtRole, jwtUser, jwtBusiness, forgedRole, isTokenForged]);

  const generateMockBcrypt = () => {
    setIsHashing(true);
    const start = performance.now();
    
    // Simulate cpu complexity delay proportional to salt rounds
    const delay = Math.max(15, Math.pow(1.8, saltRounds - 5) * 15);
    
    setTimeout(() => {
      // Simulate real Bcrypt hash structure
      // Format: $2a or $2b$[rounds]$[22 bytes salt][31 bytes Hash]
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
      let randomSalt = '';
      let randomHash = '';
      for (let i = 0; i < 22; i++) {
        randomSalt += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }
      for (let i = 0; i < 31; i++) {
        randomHash += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }
      
      const paddedRounds = saltRounds.toString().padStart(2, '0');
      const hashResult = `$2b$${paddedRounds}$${randomSalt}${randomHash}`;
      
      const end = performance.now();
      setComputedHash(hashResult);
      setHashTime(Math.round((end - start + delay)));
      setIsHashing(false);
      setVerifyStatus('idle');
    }, 400);
  };

  const handleVerifyPassword = () => {
    if (testPassword === bcryptPassword) {
      setVerifyStatus('success');
    } else {
      setVerifyStatus('fail');
    }
  };

  const generateMockJWT = () => {
    // 1. Header (Standard algorithm and type token)
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    // 2. Claims / Payload
    const payload = {
      sub: 'user-uuid-1234-5678',
      name: jwtUser,
      role: isTokenForged ? forgedRole : jwtRole,
      business_name: jwtBusiness,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 Hours validity
      iss: 'BukuCuan-Secure-Auth-SaaS'
    };

    setJwtPayload(payload);

    // Simulated Base64Url Encoding function
    const base64UrlEncode = (jsonObj: any) => {
      const jsonStr = JSON.stringify(jsonObj);
      return btoa(unescape(encodeURIComponent(jsonStr)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);

    // Mock HSM Signature with custom secret key
    // Signature = HMACSHA256(encodedHeader + "." + encodedPayload, "secretBukuCuanToken2026@!!!")
    let secureSignature = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    for (let i = 0; i < 43; i++) {
      secureSignature += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    if (isTokenForged) {
      // Forged token: we modify the payload, but signature is invalid because key is secret
      setGeneratedToken(`${encodedHeader}.${encodedPayload}.MALFORMED_OR_FORGED_SIGNATURE_INVALID_123456`);
      setTokenVerificationResult('invalid');
    } else {
      setGeneratedToken(`${encodedHeader}.${encodedPayload}.${secureSignature}`);
      setTokenVerificationResult('valid');
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto max-h-screen pb-24">
      {/* Header View */}
      <div>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-light-green text-dark-green border border-green-200">
            <LockKeyhole className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
              Sistem Otentikasi & Enkripsi Kriptografi
            </h1>
            <p className="text-sm text-text-secondary">
              Simulasi interaktif algoritma Bcrypt (Password Hashing) dan JWT (JSON Web Tokens) berbasis peran BukuCuan.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. SECTION BCRYPT */}
        <div className="bg-white rounded-3xl border border-gray-100 custom-shadow p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <Hash className="w-5 h-5 text-primary-green" />
              <h3 className="font-bold text-text-primary text-lg">Keamanan Kata Sandi (Bcrypt)</h3>
            </div>
            <span className="text-[10px] bg-light-green text-dark-green font-bold uppercase py-1 px-3 rounded-full border border-green-100">
              One-Way Hash
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Bcrypt dirancang lambat secara komputasi (adaptive hashing) untuk mencegah serangan brute-force. Ia menghasilkan garam acak otomatis (salt) yang ditambahkan ke password sebelum dihash.
          </p>

          {/* Hashing Controller */}
          <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">
                Kata Sandi Baru (Plaintext)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={bcryptPassword}
                  onChange={(e) => setBcryptPassword(e.target.value)}
                  className="w-full bg-white text-sm font-semibold text-text-primary px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-green transition"
                  placeholder="Masukkan password..."
                />
                <Lock className="w-4 h-4 text-text-secondary absolute right-4 top-3.5" />
              </div>
            </div>

            {/* Salt Rounds Selector */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Salt Rounds (Work Factor): <span className="text-dark-green font-extrabold">{saltRounds}</span>
                </label>
                <span className="text-[10px] text-text-secondary/70">Waktu komputasi 2<sup>rounds</sup></span>
              </div>
              <input
                type="range"
                min="4"
                max="14"
                value={saltRounds}
                onChange={(e) => setSaltRounds(Number(e.target.value))}
                className="w-full accent-primary-green cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
              />
            </div>

            <button
              onClick={generateMockBcrypt}
              disabled={isHashing}
              className="w-full bg-dark-green text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-dark-green/90 transition shadow-sm flex items-center justify-center gap-2"
            >
              {isHashing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Mengkomputasi Iterasi Kriptografi...
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  Generate Bcrypt Salt & Hash
                </>
              )}
            </button>
          </div>

          {/* Computed Analysis */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Hasil Komputasi Bcrypt</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-[10px] text-text-secondary block">Waktu Generate</span>
                  <span className="text-sm font-bold text-text-primary">{hashTime} ms</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
                <Binary className="w-5 h-5 text-primary-green" />
                <div>
                  <span className="text-[10px] text-text-secondary block">Garam (Auto-Salt)</span>
                  <span className="text-sm font-bold text-text-primary">22 Karakter</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-900 text-green-400 font-mono text-xs rounded-2xl border border-gray-800 break-all relative">
              <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold block mb-1">Hash Tersimpan di Database</span>
              {computedHash}
            </div>

            {/* Bcrypt Structure Legend */}
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 text-[11px] text-blue-800 space-y-1">
              <strong className="block">Penjelasan Struktur Hash Bcrypt di PostgreSQL:</strong>
              <div><span className="font-mono bg-blue-100/80 px-1 rounded font-bold">{computedHash.substring(0, 4)}</span> = Versi Algoritma hash (Bcrypt v2b)</div>
              <div><span className="font-mono bg-blue-100/80 px-1 rounded font-bold">{computedHash.substring(4, 7)}</span> = Cost Factor ({saltRounds} salt rounds / komputasi berulang)</div>
              <div><span className="font-mono bg-blue-100/80 px-1 rounded font-bold">22 Karakter Pertama</span> = Salt acak yang digenerate sistem otomatis</div>
              <div><span className="font-mono bg-blue-100/80 px-1 rounded font-bold">31 Karakter Terakhir</span> = Checksum hasil hash dari password + salt</div>
            </div>
          </div>

          {/* Test verification */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Metode Verifikasi Login (Compare)</h4>
            <div className="flex gap-2">
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="Ketik password untuk testing..."
                className="flex-1 bg-white text-sm font-semibold text-text-primary px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary-green transition"
              />
              <button
                onClick={handleVerifyPassword}
                className="bg-primary-green hover:bg-primary-green/90 text-white font-bold text-xs uppercase px-4 rounded-xl transition"
              >
                Uji Hash
              </button>
            </div>

            {verifyStatus === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-primary-green" />
                <span><strong>Macth Berhasil!</strong> Server mendekode cost round, menggunakan salt yang tersimpan, menghasilkan hash baru, dan mematchingkannya dalam {hashTime / 2}ms. User berhasil login.</span>
              </div>
            )}
            {verifyStatus === 'fail' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span><strong>Gagal Matching!</strong> Salt + password menghasilkan hash yang berbeda dengan di database. Login ditolak demi keamanan.</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. SECTION JWT AUTH */}
        <div className="bg-white rounded-3xl border border-gray-100 custom-shadow p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-primary-green" />
              <h3 className="font-bold text-text-primary text-lg">Token Akses Keamanan (JWT)</h3>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold uppercase py-1 px-3 rounded-full border border-blue-100">
              Stateless Session
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Stateless authentication menggunakan JSON Web Token (JWT). Data payload disandikan dan ditandatangani secara kriptografis menggunakan kunci rahasia (Secret Key). Server tidak perlu menyimpan session di memori.
          </p>

          {/* JWT Controller */}
          <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                  Nama User (Sub claim)
                </label>
                <input
                  type="text"
                  value={jwtUser}
                  onChange={(e) => setJwtUser(e.target.value)}
                  className="w-full bg-white text-xs font-semibold text-text-primary px-3 py-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                  Nama Bisnis UMKM
                </label>
                <input
                  type="text"
                  value={jwtBusiness}
                  onChange={(e) => setJwtBusiness(e.target.value)}
                  className="w-full bg-white text-xs font-semibold text-text-primary px-3 py-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
                  Role Otoritas Token (JWT)
                </label>
                <select
                  value={jwtRole}
                  onChange={(e) => setJwtRole(e.target.value as UserRole)}
                  className="w-full bg-white text-xs font-semibold text-text-primary px-3 py-2 rounded-xl border border-gray-200 outline-none"
                >
                  <option value="owner">Owner (Admin Utama)</option>
                  <option value="cashier">Cashier (Staff Kasir)</option>
                  <option value="supplier">Supplier (Distributor)</option>
                </select>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Simulasi Pemalsuan</span>
                <label className="inline-flex items-center gap-1.5 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={isTokenForged}
                    onChange={(e) => setIsTokenForged(e.target.checked)}
                    className="rounded text-primary-green focus:ring-primary-green/30"
                  />
                  <span className="text-xs font-bold text-red-600">Simulasikan Hack (Spoof)</span>
                </label>
              </div>
            </div>

            {isTokenForged && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <span className="text-[10px] text-red-700 font-bold uppercase block">Hacker mencoba meretas role didalam token:</span>
                <div className="flex items-center gap-2">
                  <select
                    value={forgedRole}
                    onChange={(e) => setForgedRole(e.target.value)}
                    className="bg-white text-xs font-semibold text-text-primary px-2.5 py-1.5 rounded-lg border border-red-300"
                  >
                    <option value="owner">Paksa Role Jadi owner</option>
                    <option value="cashier">Ubah Role Jadi cashier</option>
                  </select>
                  <span className="text-[9px] font-bold text-red-700 bg-red-100 px-2 py-1 rounded">Hack Aktif</span>
                </div>
              </div>
            )}
          </div>

          {/* JWT Token Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Hasil JWT Token string</h4>
            
            <div className="p-3.5 bg-gray-900 border border-gray-800 rounded-2xl break-all font-mono text-[11px] leading-relaxed select-all">
              <span className="text-[8px] text-red-400 font-bold">HEADER.</span>
              <span className="text-[8px] text-purple-400 font-bold">PAYLOAD.</span>
              <span className="text-[8px] text-blue-400 font-bold">SIGNATURE</span>
              <div className="mt-1">
                <span className="text-red-400">{generatedToken.split('.')[0]}</span>
                <span className="text-white">.</span>
                <span className="text-purple-400">{generatedToken.split('.')[1]}</span>
                <span className="text-white">.</span>
                <span className="text-blue-400">{generatedToken.split('.')[2] || 'SIGNATURE_EMPTY'}</span>
              </div>
            </div>

            {/* Simulated verification block */}
            <div className="pt-2">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">Status Verifikasi Token di Sisi Server BukuCuan:</span>
              {tokenVerificationResult === 'valid' ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-primary-green" />
                    <span>Tanda Tangan Token Valid (Akses Disetujui)</span>
                  </div>
                  <p className="text-[11px] text-green-600/90 pl-6">
                    Kunci server mengenali signature. User diijinkan mengakses dashboard sebagai <strong>{jwtRole.toUpperCase()}</strong>.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>HACKING DETECTED! Tanda Tangan Token Tidak Cocok (Akses Ditolak)</span>
                  </div>
                  <p className="text-[11px] text-red-600/90 pl-6">
                    Meskipun hacker berhasil decode base64 dan mengganti payload role menjadi "{forgedRole.toUpperCase()}", server mendeteksi bahwa signature baru tidak dihasilkan oleh Secret Key server yang sah. Server memblokir request ini dengan respon error <strong>401 Unauthorized</strong>!
                  </p>
                </div>
              )}
            </div>

            {/* Decoded format */}
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Decoded Claims Payload (Server-Read Only):</span>
              <pre className="text-[11px] text-text-primary font-mono bg-white p-3 rounded-lg border border-gray-200 overflow-x-auto">
                {JSON.stringify(jwtPayload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
