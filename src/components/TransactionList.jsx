import {
  Hamburger,
  Bus,
  Money,
  ShoppingCart,
  Lightning,
  Plus,
  GameController,
  Gift,
  Trash,
  PencilSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import EmptyState from "./EmptyState";
import { useState } from "react";

// Helper untuk mapping icon dan warna berdasarkan kategori
const getCategoryStyle = (category) => {
  switch (category) {
    case "Makan":
      return { 
        icon: Hamburger, 
        bg: "bg-indigo-100", 
        text: "text-indigo-600" 
      };
    case "Transport":
      return { 
        icon: Bus, 
        bg: "bg-blue-100", 
        text: "text-blue-600" 
      };
    case "Jajan":
      return { 
        icon: ShoppingCart, 
        bg: "bg-purple-100", 
        text: "text-purple-600" 
      };
    case "Tagihan":
      return { 
        icon: Lightning, 
        bg: "bg-orange-100", 
        text: "text-orange-600" 
      };
    case "Hiburan":
      return { 
        icon: GameController, 
        bg: "bg-pink-100", 
        text: "text-pink-600" 
      };
    case "Gaji":
      return { 
        icon: Money, 
        bg: "bg-emerald-100", 
        text: "text-emerald-600" 
      };
    case "Lainnya":
    default:
      return { 
        icon: category === "Lainnya" ? Gift : Plus, 
        bg: "bg-slate-100", 
        text: "text-slate-600" 
      };
  }
};

const TransactionList = ({ transactions, formatRupiah, onDelete, onEdit, onViewAll, limit }) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4">Transaksi Terakhir</h2>
        <EmptyState />
      </div>
    );
  }

  // Filter pencarian
  const filteredTransactions = transactions.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">
          {limit ? "Transaksi Terakhir" : "Daftar Transaksi"}
        </h2>
        {limit && (
          <button 
            onClick={onViewAll}
            className="text-sm text-indigo-600 font-semibold hover:text-indigo-800"
          >
            Lihat Semua
          </button>
        )}
      </div>

      {/* Search Bar (Hanya muncul jika tidak dilimit / di halaman View All) */}
      {!limit && (
        <div className="mb-4 relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
      )}

      <div className="space-y-4">
        {displayedTransactions.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-4">Belum ada transaksi</p>
        ) : (
          displayedTransactions.map((item) => {
            const { icon: Icon, bg, text } = getCategoryStyle(item.category);
            const dateStr = new Date(item.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={item.id}
                className="group bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 relative overflow-hidden"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${bg} ${text}`}
                >
                  <Icon size={20} weight="fill" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400">{dateStr}</p>
                </div>

                <div className="flex flex-col items-end">
                  <p
                    className={`font-bold text-sm ${
                      item.type === "income" ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}
                    {formatRupiah(item.amount)}
                  </p>
                </div>
                
                <div className="flex gap-1 ml-2">
                   <button 
                    onClick={() => onEdit && onEdit(item)}
                    className="p-2 text-slate-300 hover:text-indigo-500 transition-colors"
                    title="Edit Transaksi"
                  >
                    <PencilSimple size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete && onDelete(item.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    title="Hapus Transaksi"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionList;
