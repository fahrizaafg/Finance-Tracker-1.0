import { useState, useEffect } from "react";
import {
  X,
  Hamburger,
  Bus,
  ShoppingCart,
  Lightning,
  Plus,
  GameController,
  Gift,
} from "@phosphor-icons/react";

const CATEGORIES = [
  { 
    id: "Makan", 
    name: "Makan", 
    icon: Hamburger, 
    activeClass: "bg-primary text-white shadow-lg shadow-primary/30 ring-2 ring-primary/20", 
    inactiveClass: "bg-primary/10 text-primary",
    textActive: "text-primary" 
  },
  { 
    id: "Transport", 
    name: "Trans", 
    icon: Bus, 
    activeClass: "bg-cyan-600 text-white shadow-lg shadow-cyan-200 ring-2 ring-cyan-100", 
    inactiveClass: "bg-cyan-100 text-cyan-600",
    textActive: "text-cyan-600" 
  },
  { 
    id: "Jajan", 
    name: "Jajan", 
    icon: ShoppingCart, 
    activeClass: "bg-purple-600 text-white shadow-lg shadow-purple-200 ring-2 ring-purple-100", 
    inactiveClass: "bg-purple-100 text-purple-600",
    textActive: "text-purple-600" 
  },
  { 
    id: "Tagihan", 
    name: "Tagihan", 
    icon: Lightning, 
    activeClass: "bg-orange-600 text-white shadow-lg shadow-orange-200 ring-2 ring-orange-100", 
    inactiveClass: "bg-orange-100 text-orange-600",
    textActive: "text-orange-600" 
  },
  { 
    id: "Hiburan", 
    name: "Main", 
    icon: GameController, 
    activeClass: "bg-pink-600 text-white shadow-lg shadow-pink-200 ring-2 ring-pink-100", 
    inactiveClass: "bg-pink-100 text-pink-600",
    textActive: "text-pink-600" 
  },
  { 
    id: "Lainnya", 
    name: "Lainnya", 
    icon: Gift, 
    activeClass: "bg-slate-700 text-white shadow-lg shadow-slate-900 ring-2 ring-slate-600", 
    inactiveClass: "bg-slate-800 text-slate-400",
    textActive: "text-slate-300" 
  },
];

const AddTransactionModal = ({ isOpen, onClose, onAddTransaction, onUpdateTransaction, editingTransaction }) => {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Makan");
  const [title, setTitle] = useState("");

  // Reset or populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingTransaction) {
        setType(editingTransaction.type);
        setAmount(editingTransaction.amount.toString());
        setCategory(editingTransaction.category);
        setTitle(editingTransaction.title);
      } else {
        setType("expense");
        setAmount("");
        setCategory("Makan");
        setTitle("");
      }
    }
  }, [isOpen, editingTransaction]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || !title) {
      alert("Mohon isi nominal dan keterangan transaksi");
      return;
    }

    const transactionData = {
      title,
      amount: parseInt(amount.replace(/\D/g, "")),
      category,
      type,
    };

    if (editingTransaction) {
      onUpdateTransaction({ ...editingTransaction, ...transactionData });
    } else {
      onAddTransaction(transactionData);
    }
  };

  const formatNumber = (val) => {
    if (!val) return "";
    return new Intl.NumberFormat("id-ID").format(val);
  };

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setAmount(val);
  };

  return (
    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-30 flex items-end animate-fade-in">
      <div className="bg-surface-light w-full rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto border-t border-slate-700 shadow-2xl">
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">
            {editingTransaction ? "Edit Transaksi" : "Tambah Transaksi"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type Toggle */}
          <div className="bg-slate-800 p-1 rounded-xl flex mb-6 border border-slate-700">
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                type === "income"
                  ? "bg-emerald-500/10 text-emerald-400 shadow-sm border border-emerald-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Pemasukan
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                type === "expense"
                  ? "bg-rose-500/10 text-rose-400 shadow-sm border border-rose-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Pengeluaran
            </button>
          </div>

          {/* Input Amount */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Nominal
            </label>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xl">
                Rp
              </span>
              <input
                type="text"
                value={formatNumber(amount)}
                onChange={handleAmountChange}
                className="w-full bg-transparent border-b-2 border-slate-700 py-2 pl-8 text-3xl font-bold text-white focus:outline-none focus:border-primary transition-colors placeholder:text-slate-600"
                placeholder="0"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Input Title (Keterangan) */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Keterangan
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-slate-500"
              placeholder="Contoh: Nasi Goreng, Grab ke Kantor..."
            />
          </div>

          {/* Categories */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              Kategori
            </label>
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center gap-2 min-w-[60px] transition-all ${
                    category === cat.id ? "opacity-100 scale-105" : "opacity-60 grayscale hover:grayscale-0"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-shadow ${
                      category === cat.id ? cat.activeClass : cat.inactiveClass
                    }`}
                  >
                    <cat.icon size={24} weight="fill" />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      category === cat.id ? cat.textActive : "text-slate-400"
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 active:scale-[0.98]"
          >
            {editingTransaction ? "Update Transaksi" : "Simpan Transaksi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
