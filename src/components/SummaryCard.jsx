import { ArrowDownLeft, ArrowUpRight } from "@phosphor-icons/react";

const SummaryCard = ({ balance, income, expense }) => {
  return (
    <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden border border-white/10">
      {/* Decoration Circle */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-slate-100 opacity-10"></div>

      <p className="text-blue-100 text-sm mb-1">Total Saldo</p>
      <h2 className="text-3xl font-bold tracking-tight mb-6">{balance}</h2>

      <div className="flex gap-4">
        <div className="flex-1 bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center">
              <ArrowDownLeft
                className="text-emerald-300"
                size={12}
                weight="bold"
              />
            </div>
            <span className="text-xs text-blue-100">Pemasukan</span>
          </div>
          <p className="font-semibold text-sm text-white">{income}</p>
        </div>
        <div className="flex-1 bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-rose-400/20 flex items-center justify-center">
              <ArrowUpRight
                className="text-rose-300"
                size={12}
                weight="bold"
              />
            </div>
            <span className="text-xs text-blue-100">Pengeluaran</span>
          </div>
          <p className="font-semibold text-sm text-white">{expense}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
