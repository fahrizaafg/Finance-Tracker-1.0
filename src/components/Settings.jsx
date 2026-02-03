import { Trash, DownloadSimple, UploadSimple, Info } from "@phosphor-icons/react";
import { useRef } from "react";

const Settings = ({ transactions, onUpdateTransactions }) => {
  const fileInputRef = useRef(null);

  // 1. Reset Data
  const handleResetData = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus SEMUA data transaksi? Data tidak bisa dikembalikan.")) {
      localStorage.removeItem("transactions");
      onUpdateTransactions([]);
      alert("Data berhasil direset.");
    }
  };

  // 2. Export Data (Download JSON)
  const handleExportData = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `finance-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Import Data (Upload JSON)
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          if (window.confirm(`Ditemukan ${importedData.length} transaksi dari file. Apakah Anda ingin menimpa data saat ini?`)) {
            onUpdateTransactions(importedData);
            alert("Data berhasil diimpor!");
          }
        } else {
          alert("Format file tidak valid.");
        }
      } catch (error) {
        alert("Gagal membaca file backup.");
      }
    };
    reader.readAsText(file);
    // Reset input agar bisa pilih file yang sama lagi jika perlu
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Data Management Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-700">Manajemen Data</h2>
        </div>
        <div className="divide-y divide-slate-50">
          
          {/* Export */}
          <button 
            onClick={handleExportData}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <DownloadSimple size={20} weight="fill" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Backup Data</p>
                <p className="text-xs text-slate-500">Download data ke file JSON</p>
              </div>
            </div>
          </button>

          {/* Import */}
          <button 
            onClick={handleImportClick}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <UploadSimple size={20} weight="fill" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Restore Data</p>
                <p className="text-xs text-slate-500">Upload file backup JSON</p>
              </div>
            </div>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />

          {/* Reset */}
          <button 
            onClick={handleResetData}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-red-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-100">
                <Trash size={20} weight="fill" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-600">Reset Semua Data</p>
                <p className="text-xs text-red-400">Hapus permanen semua transaksi</p>
              </div>
            </div>
          </button>

        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-700">Tentang Aplikasi</h2>
        </div>
        <div className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Info size={20} weight="fill" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">Finance Tracker v1.0</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Aplikasi pencatat keuangan sederhana. Dibuat dengan React & Tailwind CSS. Data tersimpan aman di browser Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
