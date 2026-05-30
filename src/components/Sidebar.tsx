import { 
  LayoutDashboard, 
  WalletCards, 
  PackageSearch, 
  Truck, 
  BarChart3, 
  ShieldAlert, 
  Database,
  UserCheck,
  ChevronDown,
  Home,
  LogOut
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  businessName: string;
  onExitToLandingPage?: () => void;
  onLogout?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUserRole,
  setCurrentUserRole,
  businessName,
  onExitToLandingPage,
  onLogout
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['owner', 'cashier', 'supplier'] },
    { id: 'finance', label: 'Kasir & Keuangan', icon: WalletCards, roles: ['owner', 'cashier'] },
    { id: 'inventory', label: 'Stok & Produk', icon: PackageSearch, roles: ['owner', 'cashier', 'supplier'] },
    { id: 'suppliers', label: 'Supplier & Order', icon: Truck, roles: ['owner', 'supplier'] },
    { id: 'reports', label: 'Analisis Profit', icon: BarChart3, roles: ['owner'] },
    { id: 'auth-visual', label: 'Keamanan JWT/Bcrypt', icon: ShieldAlert, roles: ['owner', 'cashier', 'supplier'] },
    { id: 'db-schema', label: 'PostgreSQL Schema', icon: Database, roles: ['owner', 'cashier', 'supplier'] },
  ];

  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case 'owner': return 'Owner (Owner/Admin)';
      case 'cashier': return 'Cashier (Staf Kasir)';
      case 'supplier': return 'Supplier (Mitra Pabrik)';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch(role) {
      case 'owner': return 'bg-dark-green text-white';
      case 'cashier': return 'bg-light-green text-dark-green';
      case 'supplier': return 'bg-blue-50 text-blue-700 border border-blue-200';
    }
  };

  return (
    <div className="w-72 h-screen bg-[#F9FAFB] border-r border-gray-150 flex flex-col justify-between sticky top-0 left-0 shrink-0 z-20">
      {/* Header Brand */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#22C55E] rounded-[12px] flex items-center justify-center shadow-[0_4px_12px_rgba(34,197,94,0.2)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#15803D] flex items-center">
              BukuCuan
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold block mt-0.5">
              SaaS POS & STOK UMKM
            </span>
          </div>
        </div>

        {/* Business Context */}
        <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Bisnis Anda</span>
          <span className="font-extrabold text-[#111827] block mt-1 text-sm truncate">{businessName}</span>
        </div>
      </div>

      {/* Navigation Menus */}
      <div className="flex-1 px-4 py-2 overflow-y-auto space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]/70 px-3 block mb-3">
          MENU UTAMA
        </span>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const hasAccess = item.roles.includes(currentUserRole);
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => hasAccess && setActiveTab(item.id)}
              disabled={!hasAccess}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[12px] text-left transition-all duration-200 ${
                !hasAccess 
                  ? 'opacity-40 cursor-not-allowed text-gray-300' 
                  : isActive
                    ? 'bg-[#DCFCE7] text-[#15803D] font-bold shadow-sm'
                    : 'text-[#6B7280] hover:bg-white/80 hover:text-[#111827]'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-[#15803D]' : 'text-[#6B7280]'}`} />
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              {!hasAccess && (
                <span className="text-[9px] bg-gray-150 text-gray-400 font-bold px-1.5 py-0.5 rounded">Terkunci</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Role Switcher Sandbox Footer */}
      <div className="p-4 border-t border-gray-50 bg-gray-50/50">
        <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-primary-green" />
            <span className="text-[11px] font-bold text-text-secondary uppercase">Sandbox Switcher Role</span>
          </div>
          
          <div className="relative group">
            <select
              value={currentUserRole}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setCurrentUserRole(newRole);
                
                // If switching roles causes access restriction to currently active tab, redirect to dashboard
                const targetedItem = menuItems.find(item => item.id === activeTab);
                if (targetedItem && !targetedItem.roles.includes(newRole)) {
                  setActiveTab('dashboard');
                }
              }}
              className="w-full bg-gray-50 text-xs font-semibold text-text-primary px-3 py-2 rounded-xl border border-gray-200 outline-none appearance-none cursor-pointer focus:border-primary-green transition"
            >
              <option value="owner">Owner (Hak Penuh)</option>
              <option value="cashier">Kasir (Staf Penjualan)</option>
              <option value="supplier">Supplier (Lihat Stok)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary absolute right-3 top-3 pointer-events-none" />
          </div>

          <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11.5px] font-medium text-text-secondary">Akses Saat Ini:</span>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg ${getRoleBadgeColor(currentUserRole)}`}>
              {currentUserRole}
            </span>
          </div>
        </div>
        
        {onExitToLandingPage && (
          <button
            onClick={onExitToLandingPage}
            className="mt-3 w-full bg-white hover:bg-white/80 hover:text-[#111827] text-[#15803D] hover:border-gray-300 font-bold text-xs py-2.5 rounded-[12px] border border-gray-100 shadow-sm flex items-center justify-center gap-2 transition-all duration-155 active:scale-95"
          >
            <Home className="w-3.5 h-3.5" />
            Lihat Landing Page (Guest)
          </button>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            className="mt-2 w-full bg-red-50 hover:bg-red-100/80 text-red-600 font-bold text-xs py-2.5 rounded-[12px] border border-red-100 shadow-sm flex items-center justify-center gap-2 transition-all duration-155 active:scale-95 animate-fade-in"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar Akun (Log Out)
          </button>
        )}
      </div>
    </div>
  );
}
