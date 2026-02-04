import { useState, useEffect } from "react";
import { Plus, Wallet, HandCoins, Calendar, CheckCircle, Trash, ClockCounterClockwise, CaretDown, CaretUp } from "@phosphor-icons/react";

// Helper Component for Currency Input
const CurrencyInput = ({ value, onChange, placeholder, className, required }) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    setDisplayValue(value ? formatNumber(value) : "");
  }, [value]);

  const formatNumber = (num) => {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e) => {
    // Remove dots to get raw number
    const rawValue = e.target.value.replace(/\./g, "");
    
    // Validate only digits
    if (!/^\d*$/.test(rawValue)) return;

    const numericValue = rawValue ? parseInt(rawValue, 10) : "";
    
    // Update parent with raw number
    onChange(numericValue);
    
    // Update local display with formatting
    setDisplayValue(formatNumber(numericValue));
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      required={required}
      inputMode="numeric"
    />
  );
};

const DebtList = ({ debts, onAddDebt, onPayDebt, onDeleteDebt, formatRupiah }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("payable"); // payable (Hutang Kita), receivable (Piutang/Orang Ngutang)
  
  // State for expanded history
  const [expandedDebtId, setExpandedDebtId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    type: "payable", // payable (Kita Hutang), receivable (Orang Hutang)
    description: "",
  });

  // Payment State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      type: activeTab, // Default to current tab
      description: "",
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    onAddDebt({
      ...formData,
      amount: parseFloat(formData.amount),
      paidAmount: 0,
      status: "unpaid",
      id: crypto.randomUUID(),
    });
    setIsAddModalOpen(false);
  };

  const handleOpenPayment = (debt) => {
    setSelectedDebt(debt);
    setPaymentAmount(""); // Reset payment amount
    setPaymentModalOpen(true);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!paymentAmount || !selectedDebt) return;

    const amount = parseFloat(paymentAmount);
    const remaining = selectedDebt.amount - selectedDebt.paidAmount;

    if (amount > remaining) {
      alert("Jumlah pembayaran melebihi sisa hutang!");
      return;
    }

    onPayDebt(selectedDebt.id, amount);
    setPaymentModalOpen(false);
  };

  const filteredDebts = debts.filter((d) => d.type === activeTab);
  const totalActive = filteredDebts.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);

  const toggleHistory = (id) => {
    if (expandedDebtId === id) {
      setExpandedDebtId(null);
    } else {
      setExpandedDebtId(id);
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-700">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Total {activeTab === "payable" ? "Hutang Saya" : "Piutang (Orang Lain)"}</p>
            <h2 className="text-3xl font-bold">{formatRupiah(totalActive)}</h2>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            {activeTab === "payable" ? <Wallet size={32} weight="fill" className="text-red-400" /> : <HandCoins size={32} weight="fill" className="text-green-400" />}
          </div>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setActiveTab("payable")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === "payable" ? "bg-red-500/20 text-red-300 border border-red-500/50" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
           >
             Hutang Saya
           </button>
           <button 
            onClick={() => setActiveTab("receivable")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === "receivable" ? "bg-green-500/20 text-green-300 border border-green-500/50" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
           >
             Piutang Saya
           </button>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleOpenAdd}
        className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <Plus size={20} weight="bold" />
        Tambah {activeTab === "payable" ? "Hutang" : "Piutang"} Baru
      </button>

      {/* Debt List */}
      <div className="space-y-4">
        {filteredDebts.length === 0 ? (
           <div className="text-center py-10 text-slate-500">
             <p>Belum ada data {activeTab === "payable" ? "hutang" : "piutang"}.</p>
           </div>
        ) : (
          filteredDebts.map((debt) => {
            const remaining = debt.amount - debt.paidAmount;
            const progress = (debt.paidAmount / debt.amount) * 100;
            const isPaidOff = remaining <= 0;
            const isExpanded = expandedDebtId === debt.id;

            return (
              <div key={debt.id} className="bg-surface-light rounded-xl border border-slate-700 shadow-sm relative overflow-hidden transition-all">
                {isPaidOff && (
                   <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
                     LUNAS
                   </div>
                )}
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">{debt.name}</h3>
                      <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                        <Calendar size={14} />
                        {new Date(debt.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        {debt.dueDate && ` • Jatuh Tempo: ${new Date(debt.dueDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Sisa</p>
                      <p className={`font-bold ${isPaidOff ? "text-green-400" : "text-white"}`}>{formatRupiah(remaining)}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 h-2 rounded-full mb-4 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isPaidOff ? "bg-green-500" : "bg-primary"}`} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                     <p className="text-xs text-slate-500">Total: {formatRupiah(debt.amount)}</p>
                     
                     <div className="flex gap-2">
                       <button 
                         onClick={() => toggleHistory(debt.id)}
                         className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${isExpanded ? "bg-slate-700 text-white" : "text-slate-400 hover:bg-slate-800"}`}
                       >
                         <ClockCounterClockwise size={16} />
                         Riwayat
                         {isExpanded ? <CaretUp size={12} /> : <CaretDown size={12} />}
                       </button>

                       {!isPaidOff && (
                         <>
                           <button 
                             onClick={() => onDeleteDebt(debt.id)}
                             className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                           >
                             <Trash size={18} />
                           </button>
                           <button
                             onClick={() => handleOpenPayment(debt)}
                             className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                           >
                             <CheckCircle size={16} />
                             Bayar
                           </button>
                         </>
                       )}
                     </div>
                  </div>
                </div>

                {/* History Section */}
                {isExpanded && (
                  <div className="bg-slate-800/50 p-4 border-t border-slate-700">
                    <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Riwayat Transaksi</h4>
                    {debt.history && debt.history.length > 0 ? (
                      <div className="space-y-3">
                        {debt.history.slice().reverse().map((hist, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${hist.type === 'initial' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                              <div>
                                <p className="text-white font-medium">
                                  {hist.type === 'initial' ? 'Hutang Awal' : 'Pembayaran'}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {new Date(hist.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <span className={hist.type === 'initial' ? 'text-blue-400' : 'text-green-400'}>
                              {formatRupiah(hist.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Belum ada riwayat transaksi.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-surface-light w-full max-w-md rounded-2xl p-6 border border-slate-700 animate-slide-up md:animate-scale-up">
            <h3 className="text-xl font-bold text-white mb-4">
              Tambah {formData.type === "payable" ? "Hutang" : "Piutang"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Jenis</label>
                <div className="flex bg-slate-800 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "payable" })}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                      formData.type === "payable" ? "bg-surface-light text-red-400 shadow-sm" : "text-slate-400"
                    }`}
                  >
                    Hutang (Saya Pinjam)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "receivable" })}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                      formData.type === "receivable" ? "bg-surface-light text-green-400 shadow-sm" : "text-slate-400"
                    }`}
                  >
                    Piutang (Saya Pinjamkan)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  {formData.type === "payable" ? "Hutang Kepada (Pemberi Pinjaman)" : "Dipinjamkan Kepada (Peminjam)"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder={formData.type === "payable" ? "Nama pemberi pinjaman..." : "Nama peminjam..."}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Jumlah {formData.type === "payable" ? "Hutang" : "Piutang"}</label>
                <CurrencyInput
                  value={formData.amount}
                  onChange={(val) => setFormData({ ...formData, amount: val })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="Rp 0"
                  required={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Jatuh Tempo (Opsional)</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && selectedDebt && (
        <div className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-surface-light w-full max-w-md rounded-2xl p-6 border border-slate-700 animate-slide-up md:animate-scale-up">
            <h3 className="text-xl font-bold text-white mb-6">
              Bayar {selectedDebt.type === "payable" ? "Hutang" : "Piutang"}
            </h3>
            
            <div className="bg-slate-800/50 p-4 rounded-xl mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Hutang</span>
                <span className="text-white font-medium">{formatRupiah(selectedDebt.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Sudah Dibayar</span>
                <span className="text-green-400 font-medium">{formatRupiah(selectedDebt.paidAmount)}</span>
              </div>
              <div className="h-px bg-slate-700 my-2"></div>
              <div className="flex justify-between text-base font-bold">
                <span className="text-white">Sisa Hutang</span>
                <span className="text-primary">{formatRupiah(selectedDebt.amount - selectedDebt.paidAmount)}</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmitPayment} className="space-y-6">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Jumlah Pembayaran</label>
                <CurrencyInput
                  value={paymentAmount}
                  onChange={(val) => setPaymentAmount(val)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-lg font-bold"
                  placeholder="Rp 0"
                  required={true}
                />
                
                {/* Dynamic Calculation Preview */}
                {paymentAmount && (
                  <div className="mt-3 text-xs flex justify-between items-center bg-primary/10 p-2 rounded-lg border border-primary/20">
                    <span className="text-primary">Sisa setelah bayar:</span>
                    <span className="font-bold text-primary">
                      {formatRupiah(Math.max(0, (selectedDebt.amount - selectedDebt.paidAmount) - (parseFloat(paymentAmount) || 0)))}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
                >
                  Bayar Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtList;