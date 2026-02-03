import { useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TrendChart = ({ transactions }) => {
  // Proses data untuk grafik
  const chartData = useMemo(() => {
    // 1. Buat array 7 hari terakhir
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i)); // Mundur dari hari ini ke 6 hari lalu
      return d.toISOString().split("T")[0]; // YYYY-MM-DD
    });

    // 2. Filter hanya pengeluaran
    const expenses = transactions.filter((t) => t.type === "expense");

    // 3. Map data ke 7 hari tersebut
    return last7Days.map((date) => {
      const dayName = new Date(date).toLocaleDateString("id-ID", {
        weekday: "short",
      });
      
      const totalAmount = expenses
        .filter((t) => t.date.startsWith(date))
        .reduce((acc, curr) => acc + curr.amount, 0);

      return {
        date,
        day: dayName,
        amount: totalAmount,
      };
    });
  }, [transactions]);

  // Cari nilai maksimum untuk highlight bar tertinggi (opsional, bisa buat styling)
  const maxAmount = Math.max(...chartData.map((d) => d.amount));

  return (
    <div>
      <div className="flex justify-between items-end mb-3">
        <h3 className="font-bold text-slate-800">Analisis Pengeluaran</h3>
        <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-full border">
          7 Hari Terakhir
        </span>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9', radius: 4 }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`Rp ${new Intl.NumberFormat("id-ID").format(value)}`, 'Pengeluaran']}
            />
            <Bar dataKey="amount" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.amount === maxAmount && entry.amount > 0 ? '#6366f1' : '#e0e7ff'} 
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
