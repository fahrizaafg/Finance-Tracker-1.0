import { User } from "@phosphor-icons/react";

const Header = () => {
  return (
    <header className="p-6 pb-2 flex justify-between items-center bg-white sticky top-0 z-10">
      <div>
        <p className="text-slate-500 text-sm font-medium">Selamat Pagi,</p>
        <h1 className="text-xl font-bold text-slate-900">Fahri</h1>
      </div>
      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm">
        <User size={20} weight="fill" />
      </div>
    </header>
  );
};

export default Header;
