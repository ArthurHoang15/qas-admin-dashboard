import { query } from "@/lib/db";

interface PriorityStat {
  priority_level: number;
  count: string;
}

interface TotalStats {
  count: string;
}

export default async function Home() {
  const totalRes = await query("SELECT count(*) FROM qas_registrations");
  const totalCount = Number(totalRes.rows[0].count);
  const priorityRes = await query(
    "SELECT priority_level, count(*) FROM qas_registrations GROUP BY priority_level ORDER BY priority_level ASC"
  );
  const priorityStats = priorityRes.rows as PriorityStat[];

  console.log(totalCount, priorityStats);

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
      </div>

      {/* 2. Grid Container (Bento Grid) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* --- CARD 1: TỔNG SỐ (Total Registrations) --- */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">
            Total Registrations
          </h3>
          {/* Hiển thị biến totalCount đã tính ở trên */}
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {totalCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">+12% from last month</p>
        </div>

        {/* --- CARD 2: PHÂN LOẠI (Priority Breakdown) --- */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-4">
            Priority Breakdown
          </h3>

          <div className="space-y-2">
            {/* VÒNG LẶP MAP:
               Chúng ta lặp qua mảng priorityStats.
               Với mỗi 'stat', chúng ta tạo ra một dòng div.
            */}
            {priorityStats.map((stat) => (
              <div
                key={stat.priority_level}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-600">
                  Level {stat.priority_level}
                </span>
                <span className="font-semibold text-slate-900">
                  {stat.count}
                </span>
              </div>
            ))}

            {/* Xử lý trường hợp chưa có dữ liệu */}
            {priorityStats.length === 0 && (
              <p className="text-sm text-slate-400 italic">No data available</p>
            )}
          </div>
        </div>

        {/* --- CARD 3: Placeholder (Chờ Chart) --- */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
          <span className="text-slate-400 font-medium">
            Chart Coming Soon...
          </span>
        </div>
      </div>
    </div>
  );
}
