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
    activeClass: "bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-100", 
    inactiveClass: "bg-indigo-100 text-indigo-600",
    textActive: "text-indigo-600" 
  },
  { 
    id: "Transport", 
    name: "Trans", 
    icon: Bus, 
    activeClass: "bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-100", 
    inactiveClass: "bg-blue-100 text-blue-600",
    textActive: "text-blue-600" 
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
    activeClass: "bg-slate-600 text-white shadow-lg shadow-slate-200 ring-2 ring-slate-100", 
    inactiveClass: "bg-slate-100 text-slate-600",
    textActive: "text-slate-600" 
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
    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-30 flex items-end animate-fade-in">
      <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            {editingTransaction ? "Edit Transaksi" : "Tambah Transaksi"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex mb-6">
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                type === "income"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Pemasukan
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                type === "expense"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Pengeluaran
            </button>
          </div>

          {/* Input Amount */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Nominal
            </label>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">
                Rp
              </span>
              <input
                type="text"
                value={formatNumber(amount)}
                onChange={handleAmountChange}
                className="w-full bg-transparent border-b-2 border-slate-200 py-2 pl-8 text-3xl font-bold text-slate-800 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-300"
                placeholder="0"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Input Title (Keterangan) */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Keterangan
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400"
              placeholder="Contoh: Nasi Goreng, Grab ke Kantor..."
            />
          </div>

          {/* Categories */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
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
                      category === cat.id ? cat.textActive : "text-slate-600"
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
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-300 active:scale-[0.98]"
          >
            {editingTransaction ? "Update Transaksi" : "Simpan Transaksi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
