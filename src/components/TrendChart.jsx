import { useMemo } from "react";
import {
  AreaChart,
  Area,
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
        <h3 className="font-bold text-slate-100">Analisis Pengeluaran</h3>
        <span className="text-xs text-slate-400 bg-surface-light px-2 py-1 rounded-full border border-slate-700">
          7 Hari Terakhir
        </span>
      </div>
      <div className="bg-surface-light p-4 rounded-2xl border border-slate-700 shadow-sm h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              dy={10}
            />
            <Tooltip 
              cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
              contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#f1f5f9' }}
              formatter={(value) => [`Rp ${new Intl.NumberFormat("id-ID").format(value)}`, 'Pengeluaran']}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
