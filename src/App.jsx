import { useState, useEffect } from "react";
import { Plus, CaretLeft, User } from "@phosphor-icons/react";
import Header from "./components/Header";
import SummaryCard from "./components/SummaryCard";
import BudgetCard from "./components/BudgetCard";
import TrendChart from "./components/TrendChart";
import TransactionList from "./components/TransactionList";
import BottomNav from "./components/BottomNav";
import Sidebar from "./components/Sidebar";

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
    <div className="bg-background-light flex h-screen text-slate-100 font-sans overflow-hidden">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden md:block shrink-0 h-full">
        <Sidebar 
          activeTab={currentView} 
          onTabChange={setCurrentView} 
          onAddClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Main Scrollable Container */}
        <div className="w-full md:max-w-7xl mx-auto h-full flex flex-col relative bg-background-light overflow-hidden">
          
          {currentView === "dashboard" && (
            <>
              {/* Mobile Header */}
              <div className="md:hidden">
                <Header userName={userName} userPhoto={userPhoto} />
              </div>

              {/* Desktop Header */}
              <div className="hidden md:flex justify-between items-center px-8 py-6 sticky top-0 bg-background-light z-20">
                <div>
                  <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                  <p className="text-slate-400 text-sm">Selamat datang kembali, {userName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-white">{userName}</p>
                    <p className="text-xs text-slate-400">Personal Account</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border border-slate-600 shadow-sm">
                    {userPhoto ? (
                      <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User size={20} weight="fill" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <main className="flex-1 overflow-y-auto px-6 md:px-8 pt-4 space-y-6 custom-scrollbar pb-24 md:pb-8">
                {/* Filter Section */}
                <div className="flex bg-surface-light p-1 rounded-xl shadow-sm border border-slate-700 md:w-fit md:min-w-[300px]">
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

                {/* Dashboard Grid Layout for Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column (Summary + Chart) */}
                  <div className="md:col-span-12 lg:col-span-8 space-y-6">
                    <SummaryCard
                      balance={formatRupiah(balance)}
                      income={formatRupiah(income)}
                      expense={formatRupiah(expense)}
                    />
                    <TrendChart transactions={filteredTransactions} />
                  </div>

                  {/* Right Column (Budget + Recent Transactions) */}
                  <div className="md:col-span-12 lg:col-span-4 space-y-6">
                    <BudgetCard transactions={transactions} formatRupiah={formatRupiah} />
                    <TransactionList 
                      transactions={filteredTransactions} 
                      formatRupiah={formatRupiah} 
                      onDelete={handleDeleteTransaction}
                      onEdit={handleEditClick}
                      limit={5}
                      onViewAll={() => setCurrentView("all_transactions")}
                    />
                  </div>
                </div>
              </main>
            </>
          )}

          {currentView === "all_transactions" && (
            <>
              {/* Header All Transactions View */}
              <div className="bg-background-light px-6 md:px-8 py-4 flex items-center gap-4 shadow-sm z-10 sticky top-0 border-b border-slate-800 md:border-none md:pt-8">
                <button 
                  onClick={() => setCurrentView("dashboard")}
                  className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors text-white md:hidden"
                >
                  <CaretLeft size={24} weight="bold" />
                </button>
                <h1 className="text-lg md:text-2xl font-bold text-white">Semua Transaksi</h1>
              </div>

              <main className="flex-1 overflow-y-auto px-6 md:px-8 pt-4 space-y-6 custom-scrollbar pb-24 md:pb-8">
                 {/* Filter Section */}
                 <div className="flex bg-surface-light p-1 rounded-xl shadow-sm border border-slate-700 md:w-fit md:min-w-[300px]">
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

                <div className="md:max-w-4xl">
                  <TransactionList 
                    transactions={filteredTransactions} 
                    formatRupiah={formatRupiah} 
                    onDelete={handleDeleteTransaction}
                    onEdit={handleEditClick}
                    // No limit here
                  />
                </div>
              </main>
            </>
          )}

          {currentView === "statistics" && (
            <>
              <div className="bg-background-light px-6 md:px-8 py-4 shadow-sm z-10 sticky top-0 border-b border-slate-800 md:border-none md:pt-8">
                <h1 className="text-lg md:text-2xl font-bold text-white">Statistik Pengeluaran</h1>
              </div>
              <main className="flex-1 overflow-y-auto px-6 md:px-8 pt-4 space-y-6 custom-scrollbar pb-24 md:pb-8">
                {/* Filter Section */}
                <div className="flex bg-surface-light p-1 rounded-xl shadow-sm border border-slate-700 md:w-fit md:min-w-[300px]">
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
                
                <div className="md:grid md:grid-cols-2 md:gap-8">
                   <Statistics 
                    transactions={filteredTransactions} 
                    formatRupiah={formatRupiah} 
                  />
                </div>
              </main>
            </>
          )}

          {currentView === "settings" && (
            <>
              <div className="bg-background-light px-6 md:px-8 py-4 shadow-sm z-10 sticky top-0 border-b border-slate-800 md:border-none md:pt-8">
                <h1 className="text-lg md:text-2xl font-bold text-white">Pengaturan</h1>
              </div>
              <main className="flex-1 overflow-y-auto px-6 md:px-8 pt-4 space-y-6 custom-scrollbar pb-24 md:pb-8">
                <div className="md:max-w-2xl">
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
                </div>
              </main>
            </>
          )}

          {/* Mobile Bottom Nav */}
          <div className="md:hidden">
            <BottomNav 
              activeTab={currentView} 
              onTabChange={setCurrentView} 
              onAddClick={() => {
                setEditingTransaction(null);
                setIsModalOpen(true);
              }}
            />
          </div>

          {/* Modal Overlay */}
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
    </div>
  );
}

export default App;
