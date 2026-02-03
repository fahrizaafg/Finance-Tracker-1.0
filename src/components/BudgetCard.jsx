import { useState, useEffect } from "react";
import { PencilSimple, Check } from "@phosphor-icons/react";

const BudgetCard = ({ transactions, formatRupiah }) => {
  const [budget, setBudget] = useState(() => {
    return parseInt(localStorage.getItem("monthly_budget")) || 0;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget);

  useEffect(() => {
    localStorage.setItem("monthly_budget", budget);
  }, [budget]);

  // Hitung pengeluaran bulan ini
  const currentMonthExpense = transactions
    .filter((t) => {
      const tDate = new Date(t.date);
      const now = new Date();
      return (
        t.type === "expense" &&
        tDate.getMonth() === now.getMonth() &&
        tDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((acc, curr) => acc + curr.amount, 0);

  const percentage = Math.min((currentMonthExpense / budget) * 100, 100);
  
  // Tentukan warna progress bar
  let progressColor = "bg-emerald-custom";
  if (percentage > 75) progressColor = "bg-yellow-500";
  if (percentage > 90) progressColor = "bg-rose-custom";

  const handleSave = () => {
    setBudget(tempBudget);
    setIsEditing(false);
  };

  return (
    <div className="bg-surface-light p-4 rounded-2xl shadow-sm border border-slate-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-slate-200">Budget Bulan Ini</h3>
        <button 
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          className="text-slate-400 hover:text-primary"
        >
          {isEditing ? <Check size={18} weight="bold" /> : <PencilSimple size={18} weight="bold" />}
        </button>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-xs text-slate-400">Terpakai</p>
          <p className={`font-bold ${percentage > 90 ? "text-rose-custom" : "text-slate-100"}`}>
            {formatRupiah(currentMonthExpense)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Target</p>
          {isEditing ? (
            <input
              type="number"
              value={tempBudget}
              onChange={(e) => setTempBudget(Number(e.target.value))}
              className="w-24 text-right text-sm font-bold border-b border-primary/50 focus:outline-none bg-transparent text-white"
              autoFocus
            />
          ) : (
            <p className="font-bold text-slate-100">{formatRupiah(budget)}</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <p className="text-[10px] text-slate-400 mt-2 text-right">
        {percentage.toFixed(0)}% dari budget
      </p>
    </div>
  );
};

export default BudgetCard;
