import { House, ListDashes, ChartPieSlice, Gear, PlusCircle } from "@phosphor-icons/react";

const BottomNav = ({ activeTab, onTabChange, onAddClick }) => {
  return (
    <nav className="bg-white border-t border-slate-100 fixed bottom-0 w-full max-w-md flex justify-around items-center px-2 z-10 pb-[calc(env(safe-area-inset-bottom)+4px)] pt-2">
      <button
        onClick={() => onTabChange("dashboard")}
        className={`flex flex-col items-center gap-1 p-2 ${
          activeTab === "dashboard" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <House size={24} weight={activeTab === "dashboard" ? "fill" : "regular"} />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      <button
        onClick={() => onTabChange("all_transactions")}
        className={`flex flex-col items-center gap-1 p-2 ${
          activeTab === "all_transactions" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <ListDashes size={24} weight={activeTab === "all_transactions" ? "fill" : "regular"} />
        <span className="text-[10px] font-medium">Transaksi</span>
      </button>
      
      <button
        onClick={onAddClick}
        className="flex flex-col items-center gap-1 p-2 text-slate-900 hover:text-indigo-600"
      >
        <PlusCircle size={24} weight="regular" />
        <span className="text-[10px] font-medium">Tambah</span>
      </button>

      <button
        onClick={() => onTabChange("statistics")}
        className={`flex flex-col items-center gap-1 p-2 ${
          activeTab === "statistics" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <ChartPieSlice size={24} weight={activeTab === "statistics" ? "fill" : "regular"} />
        <span className="text-[10px] font-medium">Statistik</span>
      </button>
      
      <button
        onClick={() => onTabChange("settings")}
        className={`flex flex-col items-center gap-1 p-2 ${
          activeTab === "settings" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <Gear size={24} weight={activeTab === "settings" ? "fill" : "regular"} />
        <span className="text-[10px] font-medium">Setting</span>
      </button>
    </nav>
  );
};

export default BottomNav;
