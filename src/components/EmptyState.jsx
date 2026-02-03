import { Ghost } from "@phosphor-icons/react";

const EmptyState = ({ message = "Belum ada transaksi" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600 ring-1 ring-slate-700">
        <Ghost size={32} weight="fill" />
      </div>
      <p className="text-slate-400 text-sm font-medium">{message}</p>
      <p className="text-slate-500 text-xs mt-1">Yuk mulai catat pengeluaranmu!</p>
    </div>
  );
};

export default EmptyState;
