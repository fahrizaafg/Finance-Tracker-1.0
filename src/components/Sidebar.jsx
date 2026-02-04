import { House, ListDashes, ChartPieSlice, Gear, Plus, Wallet, HandCoins } from "@phosphor-icons/react";

const Sidebar = ({ activeTab, onTabChange, onAddClick }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: House },
    { id: "all_transactions", label: "Transaksi", icon: ListDashes },
    { id: "debts", label: "Hutang", icon: HandCoins },
    { id: "statistics", label: "Statistik", icon: ChartPieSlice },
    { id: "settings", label: "Pengaturan", icon: Gear },
  ];

  return (
    <aside className="w-64 h-full bg-surface-light border-r border-slate-800 flex flex-col p-6">
      {/* Logo Area */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <Wallet size={24} weight="fill" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Dompetku</h1>
          <p className="text-xs text-slate-400">Finance Tracker</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <item.icon 
              size={24} 
              weight={activeTab === item.id ? "fill" : "regular"} 
              className={activeTab === item.id ? "animate-bounce-subtle" : "group-hover:scale-110 transition-transform"}
            />
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Add Button */}
      <button
        onClick={onAddClick}
        className="w-full bg-gradient-to-r from-primary to-primary-dark text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-4 border border-white/10"
      >
        <Plus size={20} weight="bold" />
        <span>Tambah Transaksi</span>
      </button>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-[10px] text-slate-600">
          &copy; 2026 Dompetku App
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
