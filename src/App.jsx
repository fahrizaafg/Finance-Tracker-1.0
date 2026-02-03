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
import LoginScreen from "./components/LoginScreen"; // Import LoginScreen


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
  
  // State untuk nama user
  const [userName, setUserName] = useState(() => localStorage.getItem("user_name") || "");
  // State untuk foto profil user (base64)
  const [userPhoto, setUserPhoto] = useState(() => localStorage.getItem("user_photo") || null);

  // 1. State untuk menyimpan daftar transaksi
  // Inisialisasi dari LocalStorage jika ada, jika tidak kosong
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }
    return []; // Kosong untuk user baru
  });

  // Simpan ke LocalStorage setiap kali transactions berubah
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Jika belum ada user name, tampilkan login screen
  if (!userName) {
    return (
      <LoginScreen 
        onLogin={(name) => {
          localStorage.setItem("user_name", name);
          setUserName(name);
        }} 
      />
    );
  }

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
    <div className="bg-background-light flex justify-center h-screen text-slate-100 font-sans overflow-hidden">
      {/* Mobile Wrapper */}
      <div className="w-full max-w-md bg-background-light h-full relative shadow-2xl flex flex-col border-x border-slate-800 overflow-hidden">
        {currentView === "dashboard" && (
          <>
            <Header userName={userName} userPhoto={userPhoto} />
            
            <main className="flex-1 overflow-y-auto px-6 pt-4 space-y-6 custom-scrollbar pb-6">
              {/* Filter Section */}
              <div className="flex bg-surface-light p-1 rounded-xl shadow-sm border border-slate-700">
                {["all", "week", "month"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      filterType === type
                        ? "bg-primary text-white shadow-md"
                        : "text-slate-400 hover:bg-slate-700"
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
            </main>
          </>
        )}

        {currentView === "all_transactions" && (
          <>
            {/* Header All Transactions View */}
            <div className="bg-background-light px-6 py-4 flex items-center gap-4 shadow-sm z-10 sticky top-0 border-b border-slate-800">
              <button 
                onClick={() => setCurrentView("dashboard")}
                className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors text-white"
              >
                <CaretLeft size={24} weight="bold" />
              </button>
              <h1 className="text-lg font-bold text-white">Semua Transaksi</h1>
            </div>

            <main className="flex-1 overflow-y-auto px-6 pt-4 space-y-6 custom-scrollbar pb-6">
               {/* Filter Section di View All juga berguna */}
               <div className="flex bg-surface-light p-1 rounded-xl shadow-sm border border-slate-700">
                {["all", "week", "month"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      filterType === type
                        ? "bg-primary text-white shadow-md"
                        : "text-slate-400 hover:bg-slate-700"
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
            </main>
          </>
        )}

        {currentView === "statistics" && (
          <>
            <div className="bg-background-light px-6 py-4 shadow-sm z-10 sticky top-0 border-b border-slate-800">
              <h1 className="text-lg font-bold text-white">Statistik Pengeluaran</h1>
            </div>
            <main className="flex-1 overflow-y-auto px-6 pt-4 space-y-6 custom-scrollbar pb-6">
              {/* Filter Section */}
              <div className="flex bg-surface-light p-1 rounded-xl shadow-sm border border-slate-700">
                {["all", "week", "month"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      filterType === type
                        ? "bg-primary text-white shadow-md"
                        : "text-slate-400 hover:bg-slate-700"
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
            </main>
          </>
        )}

        {currentView === "settings" && (
          <>
            <div className="bg-background-light px-6 py-4 shadow-sm z-10 sticky top-0 border-b border-slate-800">
              <h1 className="text-lg font-bold text-white">Pengaturan</h1>
            </div>
            <main className="flex-1 overflow-y-auto px-6 pt-4 space-y-6 custom-scrollbar pb-6">
              <Settings 
                transactions={transactions} 
                onUpdateTransactions={setTransactions}
                userName={userName}
                onUpdateUserName={(name) => {
                  setUserName(name);
                  localStorage.setItem("user_name", name);
                }}
                userPhoto={userPhoto}
                onUpdateUserPhoto={(photo) => {
                  setUserPhoto(photo);
                  localStorage.setItem("user_photo", photo);
                }}
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
