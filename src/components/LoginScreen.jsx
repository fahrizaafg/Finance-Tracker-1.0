import { useState } from "react";
import { User, ArrowRight } from "@phosphor-icons/react";

const LoginScreen = ({ onLogin }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <User size={40} weight="fill" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Selamat Datang!</h1>
        <p className="text-slate-500 mb-8">
          Siapa nama panggilanmu?
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Masukkan namamu..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            autoFocus
            required
          />
          
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mulai Aplikasi
            <ArrowRight size={20} weight="bold" />
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-xs text-slate-400">
        Aplikasi Keuangan Pribadi v1.0
      </p>
    </div>
  );
};

export default LoginScreen;
