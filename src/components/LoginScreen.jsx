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
    <div className="min-h-screen bg-background-light flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-surface-light p-8 rounded-3xl shadow-xl border border-slate-700 text-center">
        <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-primary/10">
          <User size={40} weight="fill" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Selamat Datang!</h1>
        <p className="text-slate-400 mb-8">
          Siapa nama panggilanmu?
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Masukkan namamu..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-background-light border border-slate-700 rounded-xl text-center font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-600"
            autoFocus
            required
          />
          
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
          >
            Mulai Aplikasi
            <ArrowRight size={20} weight="bold" />
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-xs text-slate-500">
        Dompetku
      </p>
    </div>
  );
};

export default LoginScreen;
