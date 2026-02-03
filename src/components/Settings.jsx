import { Trash, DownloadSimple, UploadSimple, Info, User, Camera, PencilSimple, Check } from "@phosphor-icons/react";
import { useRef, useState } from "react";

const Settings = ({ transactions, onUpdateTransactions, userName, onUpdateUserName, userPhoto, onUpdateUserPhoto }) => {
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // 0. Profile Handlers
  const handlePhotoClick = () => {
    photoInputRef.current.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Limit size to 2MB to avoid localStorage quota exceeded
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto terlalu besar (Max 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdateUserPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveName = () => {
    if (tempName.trim()) {
      onUpdateUserName(tempName.trim());
      setIsEditingName(false);
    }
  };

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
      {/* Profile Section */}
      <div className="bg-surface-light rounded-xl shadow-sm border border-slate-700 overflow-hidden p-6 flex flex-col items-center">
        <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary border-4 border-surface-light shadow-lg overflow-hidden ring-1 ring-slate-700">
             {userPhoto ? (
              <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={48} weight="fill" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={24} className="text-white" weight="bold" />
          </div>
          <input 
            type="file" 
            ref={photoInputRef} 
            onChange={handlePhotoChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="bg-transparent border-b-2 border-primary outline-none text-center font-bold text-lg text-white w-40 pb-1"
                autoFocus
              />
              <button 
                onClick={saveName}
                className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
              >
                <Check size={16} weight="bold" />
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-white">{userName}</h2>
              <button 
                onClick={() => {
                  setTempName(userName);
                  setIsEditingName(true);
                }}
                className="text-slate-500 hover:text-primary transition-colors"
              >
                <PencilSimple size={18} weight="bold" />
              </button>
            </>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1">Ketuk foto untuk mengganti</p>
      </div>

      {/* Data Management Section */}
      <div className="bg-surface-light rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/50">
          <h2 className="text-sm font-semibold text-slate-300">Manajemen Data</h2>
        </div>
        <div className="divide-y divide-slate-800">
          
          {/* Export */}
          <button 
            onClick={handleExportData}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-800 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                <DownloadSimple size={20} weight="fill" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Backup Data</p>
                <p className="text-xs text-slate-400">Download data ke file JSON</p>
              </div>
            </div>
          </button>

          {/* Import */}
          <button 
            onClick={handleImportClick}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-800 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-custom/20 text-emerald-custom flex items-center justify-center">
                <UploadSimple size={20} weight="fill" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Restore Data</p>
                <p className="text-xs text-slate-400">Upload file backup JSON</p>
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
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-rose-custom/10 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-custom/20 text-rose-custom flex items-center justify-center group-hover:bg-rose-custom/30">
                <Trash size={20} weight="fill" />
              </div>
              <div>
                <p className="text-sm font-medium text-rose-custom">Reset Semua Data</p>
                <p className="text-xs text-rose-custom/70">Hapus permanen semua transaksi</p>
              </div>
            </div>
          </button>

        </div>
      </div>

      {/* About Section */}
      <div className="bg-surface-light rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/50">
          <h2 className="text-sm font-semibold text-slate-300">Tentang Aplikasi</h2>
        </div>
        <div className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <Info size={20} weight="fill" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Dompetku</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Dompetku adalah aplikasi pencatat keuangan sederhana yang membantu kamu memantau pemasukan dan pengeluaran harian dengan rapi dan mudah. Semua transaksi tercatat jelas, sehingga kamu bisa mengontrol uang, mengatur budget, dan bikin keputusan finansial yang lebih cerdas tanpa ribet.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-700">
              <p className="text-xs text-slate-500">
                Dibuat oleh <span className="font-semibold text-slate-300">Fahriza</span>
              </p>
              <a 
                href="https://instagram.com/fahrizaafg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:text-primary-dark font-medium inline-flex items-center gap-1 mt-1"
              >
                @fahrizaafg
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
