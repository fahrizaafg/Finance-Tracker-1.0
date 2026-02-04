import { House, ListDashes, ChartPieSlice, Gear, PlusCircle, HandCoins } from "@phosphor-icons/react";

const BottomNav = ({ activeTab, onTabChange, onAddClick }) => {
  return (
    <nav className="bg-surface-light border-t border-slate-800 w-full flex justify-around items-center px-2 z-10 pb-[calc(env(safe-area-inset-bottom)+4px)] pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] shrink-0">
      <button
        onClick={() => onTabChange("dashboard")}
        className={`flex flex-col items-center gap-1 p-2 transition-colors ${
          activeTab === "dashboard" ? "text-primary" : "text-slate-500 hover:text-slate-300"
        }`}
      >
        <House size={24} weight={activeTab === "dashboard" ? "fill" : "regular"} />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      <button
        onClick={() => onTabChange("all_transactions")}
        className={`flex flex-col items-center gap-1 p-2 transition-colors ${
          activeTab === "all_transactions" ? "text-primary" : "text-slate-500 hover:text-slate-300"
        }`}
      >
        <ListDashes size={24} weight={activeTab === "all_transactions" ? "fill" : "regular"} />
        <span className="text-[10px] font-medium">Transaksi</span>
      </button>
      
      <button
        onClick={onAddClick}
        className="flex flex-col items-center gap-1 p-2 text-white hover:text-primary transition-colors"
      >
        <PlusCircle size={24} weight="regular" />
        <span className="text-[10px] font-medium">Tambah</span>
      </button>

      <button
        onClick={() => onTabChange("debts")}
        className={`flex flex-col items-center gap-1 p-2 transition-colors ${
          activeTab === "debts" ? "text-primary" : "text-slate-500 hover:text-slate-300"
        }`}
      >
        <HandCoins size={24} weight={activeTab === "debts" ? "fill" : "regular"} />
        <span className="text-[10px] font-medium">Hutang</span>
      </button>

      <button
        onClick={() => onTabChange("settings")}
        className={`flex flex-col items-center gap-1 p-2 transition-colors ${
          activeTab === "settings" ? "text-primary" : "text-slate-500 hover:text-slate-300"
        }`}
      >
        <Gear size={24} weight={activeTab === "settings" ? "fill" : "regular"} />
        <span className="text-[10px] font-medium">Setting</span>
      </button>
    </nav>
  );
};

export default BottomNav;
