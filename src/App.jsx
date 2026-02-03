import { useState, useEffect } from "react";
import { Plus, CaretLeft } from "@phosphor-icons/react";
import Header from "./components/Header";
import SummaryCard from "./components/SummaryCard";
import BudgetCard from "./components/BudgetCard";
import TrendChart from "./components/TrendChart";
import TransactionList from "./components/TransactionList";
import BottomNav from "./components/BottomNav";

import AddTransactionModal from "./components/AddTransactionModal";
import Statistics from "./components/Statistics";
import Settings from "./components/Settings";


// Helper untuk format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState("all"); // all, week, month
  const [currentView, setCurrentView] = useState("dashboard"); // dashboard, all_transactions, statistics, settings

  // 1. State untuk menyimpan daftar transaksi
  // Inisialisasi dari LocalStorage jika ada, jika tidak pakai dummy
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }
    return [
      {
        id: 1,
        title: "Makan Siang",
        category: "Makan",
        date: new Date().toISOString(),
        amount: 25000,
        type: "expense",
      },
      {
        id: 2,
        title: "Gaji Bulanan",
        category: "Gaji",
        date: new Date(Date.now() - 86400000).toISOString(),
        amount: 5000000,
        type: "income",
      },
    ];
  });

  // Simpan ke LocalStorage setiap kali transactions berubah
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Filter Logic
  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "all") return true;
    
    const tDate = new Date(t.date);
    const now = new Date();

    if (filterType === "week") {
      // Minggu ini (7 hari terakhir)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return tDate >= oneWeekAgo && tDate <= now;
    }

    if (filterType === "month") {
      // Bulan ini
      return (
        tDate.getMonth() === now.getMonth() &&
        tDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });

  // 2. Hitung Saldo (Total), Pemasukan (Filtered), dan Pengeluaran (Filtered)
  // Balance tetap dari total transaksi (aset saat ini)
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  // Income & Expense cards mengikuti filter (untuk melihat cashflow periode tsb)
  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // 3. Fungsi untuk Menambah Transaksi Baru
  const handleAddTransaction = (newTransaction) => {
    const transactionWithId = {
      ...newTransaction,
      id: Date.now(), // Generate ID unik pakai timestamp
      date: new Date().toISOString(),
    };

    // Tambahkan ke array (paling atas = terbaru)
    setTransactions([transactionWithId, ...transactions]);
    setIsModalOpen(false); // Tutup modal setelah simpan
  };

  // 4. Fungsi untuk Menghapus Transaksi
  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // 5. Fungsi untuk Edit Transaksi
  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleUpdateTransaction = (updatedTransaction) => {
    setTransactions(
      transactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="bg-slate-100 flex justify-center min-h-screen text-slate-800 font-sans">
      {/* Mobile Wrapper */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl flex flex-col pb-24">
        {currentView === "dashboard" && (
          <>
            <Header />
            
            <main className="flex-1 overflow-y-auto px-6 pt-4 space-y-6">
              {/* Filter Section */}
              <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                {["all", "week", "month"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      filterType === type
                        ? "bg-slate-900 text-white shadow-md"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {type === "all"
                      ? "Semua"
                      : type === "week"
                      ? "Minggu Ini"
                      : "Bulan Ini"}
                  </button>
                ))}
              </div>

              {/* Kirim data saldo yang sudah dihitung ke SummaryCard */}
              <SummaryCard
                balance={formatRupiah(balance)}
                income={formatRupiah(income)}
                expense={formatRupiah(expense)}
              />
              
              <BudgetCard transactions={transactions} formatRupiah={formatRupiah} />

              <TrendChart transactions={filteredTransactions} />
              
              {/* Kirim daftar transaksi ke TransactionList */}
              <TransactionList 
                transactions={filteredTransactions} 
                formatRupiah={formatRupiah} 
                onDelete={handleDeleteTransaction}
                onEdit={handleEditClick}
                limit={5}
                onViewAll={() => setCurrentView("all_transactions")}
              />
              
              <div className="h-10"></div> {/* Spacer */}
            </main>
          </>
        )}

        {currentView === "all_transactions" && (
          <>
            {/* Header All Transactions View */}
            <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm z-10 sticky top-0">
              <button 
                onClick={() => setCurrentView("dashboard")}
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <CaretLeft size={24} weight="bold" />
              </button>
              <h1 className="text-lg font-bold">Semua Transaksi</h1>
            </div>

            <main className="flex-1 overflow-y-auto px-6 pt-4 space-y-6">
               {/* Filter Section di View All juga berguna */}
               <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                {["all", "week", "month"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      filterType === type
                        ? "bg-slate-900 text-white shadow-md"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {type === "all"
                      ? "Semua"
                      : type === "week"
                      ? "Minggu Ini"
                      : "Bulan Ini"}
                  </button>
                ))}
              </div>

              <TransactionList 
                transactions={filteredTransactions} 
                formatRupiah={formatRupiah} 
                onDelete={handleDeleteTransaction}
                onEdit={handleEditClick}
                // No limit here
              />
               <div className="h-10"></div>
            </main>
          </>
        )}

        {currentView === "statistics" && (
          <>
            <div className="bg-white px-6 py-4 shadow-sm z-10 sticky top-0">
              <h1 className="text-lg font-bold">Statistik Pengeluaran</h1>
            </div>
            <main className="flex-1 overflow-y-auto px-6 pt-4 space-y-6">
              {/* Filter Section */}
              <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                {["all", "week", "month"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      filterType === type
                        ? "bg-slate-900 text-white shadow-md"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {type === "all"
                      ? "Semua"
                      : type === "week"
                      ? "Minggu Ini"
                      : "Bulan Ini"}
                  </button>
                ))}
              </div>
              
              <Statistics 
                transactions={filteredTransactions} 
                formatRupiah={formatRupiah} 
              />
              <div className="h-10"></div>
            </main>
          </>
        )}

        {currentView === "settings" && (
          <>
            <div className="bg-white px-6 py-4 shadow-sm z-10 sticky top-0">
              <h1 className="text-lg font-bold">Pengaturan</h1>
            </div>
            <main className="flex-1 overflow-y-auto px-6 pt-4 space-y-6">
              <Settings 
                transactions={transactions} 
                onUpdateTransactions={setTransactions} 
              />
            </main>
          </>
        )}

        <BottomNav 
          activeTab={currentView} 
          onTabChange={setCurrentView} 
          onAddClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
        />

        {/* Modal Overlay: Kirim fungsi handleAddTransaction */}
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
          onAddTransaction={handleAddTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          editingTransaction={editingTransaction}
        />
      </div>
    </div>
  );
}

export default App;
