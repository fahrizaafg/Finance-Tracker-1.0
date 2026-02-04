import { User } from "@phosphor-icons/react";
import RealtimeClock from "./RealtimeClock";

const Header = ({ userName, userPhoto }) => {
  return (
    <header className="p-6 pb-2 bg-surface-light sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-sm font-medium">Selamat Pagi,</p>
          <h1 className="text-xl font-bold text-white">{userName || "User"}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-surface-light shadow-sm overflow-hidden">
          {userPhoto ? (
            <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={20} weight="fill" />
          )}
        </div>
      </div>
      <RealtimeClock />
    </header>
  );
};

export default Header;
