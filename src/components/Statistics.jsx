import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = {
  Makan: "#4f46e5", // Indigo
  Transport: "#2563eb", // Blue
  Jajan: "#9333ea", // Purple
  Tagihan: "#ea580c", // Orange
  Hiburan: "#db2777", // Pink
  Lainnya: "#64748b", // Slate
};

const Statistics = ({ transactions, formatRupiah }) => {
  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    
    // Group by category
    const categoryTotals = expenses.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = 0;
      }
      acc[curr.category] += curr.amount;
      return acc;
    }, {});

    // Convert to array
    const chartData = Object.keys(categoryTotals).map((category) => ({
      name: category,
      value: categoryTotals[category],
    }));

    // Sort by value (highest first)
    return chartData.sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalExpense = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 text-center">Pengeluaran per Kategori</h3>
        
        {data.length === 0 ? (
           <p className="text-center text-slate-400 text-sm py-10">Belum ada data pengeluaran</p>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name] || COLORS.Lainnya} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatRupiah(value)}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Detail List */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800">Detail Pengeluaran</h3>
        {data.map((item) => (
          <div 
            key={item.name}
            className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[item.name] || COLORS.Lainnya }}
              ></div>
              <span className="text-sm font-semibold text-slate-700">{item.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800">{formatRupiah(item.value)}</span>
              <span className="text-xs text-slate-400">
                {((item.value / totalExpense) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
