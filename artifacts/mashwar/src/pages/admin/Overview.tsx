import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Car, Users, TrendingUp, AlertCircle, Clock,
  Smartphone, Monitor, Tablet, Globe, ArrowUpRight, ArrowDownRight,
  RefreshCw, Wallet, CheckCircle, XCircle,
} from "lucide-react";
import { getBalance, getDrivers, getOrders } from "@/lib/meshwarApi";
import { supabase } from "@/lib/supabase";

const COLORS = ["#1F4A10", "#679632", "#D4EDA8", "#F59E0B", "#3B82F6", "#8B5CF6", "#EF4444"];

const mockDailyVisitors = [
  { day: "السبت", زوار: 42 }, { day: "الأحد", زوار: 78 },
  { day: "الاثنين", زوار: 95 }, { day: "الثلاثاء", زوار: 63 },
  { day: "الأربعاء", زوار: 110 }, { day: "الخميس", زوار: 87 }, { day: "الجمعة", زوار: 54 },
];

interface RealStats {
  totalRevenue: number | null;
  totalOrders: number | null;
  pendingPayments: number | null;
  totalDriversBalance: number | null;
  driversCount: { all: number; accepted: number; pending: number; rejected: number };
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
}

interface VisitorStats {
  totalVisitors: number;
  mobile: number; tablet: number; desktop: number;
  browsers: { name: string; count: number }[];
  os: { name: string; count: number }[];
}

export default function Overview() {
  const [stats, setStats] = useState<RealStats | null>(null);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordersByType, setOrdersByType] = useState<{ name: string; رحلات: number }[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const [balRes, driversRes, pendingRes, activeRes, completedRes] = await Promise.allSettled([
        getBalance(),
        getDrivers(),
        getOrders(1),
        getOrders(2),
        getOrders(3),
      ]);

      const bal = balRes.status === "fulfilled" ? balRes.value.data : null;
      const drivers = driversRes.status === "fulfilled" ? driversRes.value.data ?? [] : [];
      const pending = pendingRes.status === "fulfilled" ? pendingRes.value.data ?? [] : [];
      const active = activeRes.status === "fulfilled" ? activeRes.value.data ?? [] : [];
      const completed = completedRes.status === "fulfilled" ? completedRes.value.data ?? [] : [];

      setStats({
        totalRevenue: bal?.total_revenue ?? null,
        totalOrders: bal?.total_orders ?? null,
        pendingPayments: bal?.pending_payments ?? null,
        totalDriversBalance: bal?.total_drivers_balance ?? null,
        driversCount: {
          all: drivers.length,
          accepted: drivers.filter((d) => d.status === "accepted").length,
          pending: drivers.filter((d) => d.status === "pending").length,
          rejected: drivers.filter((d) => d.status === "rejected").length,
        },
        pendingOrders: pending.length,
        activeOrders: active.length,
        completedOrders: completed.length,
      });

      // Build orders by car type chart
      const typeMap: Record<string, number> = {};
      [...pending, ...active, ...completed].forEach((o) => {
        const name = o.car_type?.name ?? "غير محدد";
        typeMap[name] = (typeMap[name] || 0) + 1;
      });
      setOrdersByType(Object.entries(typeMap).map(([name, رحلات]) => ({ name, رحلات })));
    } catch { /* ignore */ } finally {
      setLoading(false);
    }

    // Supabase visitor stats
    try {
      const { data } = await supabase.from("page_views").select("device_type, browser, os").limit(1000);
      if (data?.length) {
        const browserMap: Record<string, number> = {};
        const osMap: Record<string, number> = {};
        data.forEach((r) => {
          if (r.browser) browserMap[r.browser] = (browserMap[r.browser] || 0) + 1;
          if (r.os) osMap[r.os] = (osMap[r.os] || 0) + 1;
        });
        setVisitorStats({
          totalVisitors: data.length,
          mobile: data.filter((r) => r.device_type === "mobile").length,
          tablet: data.filter((r) => r.device_type === "tablet").length,
          desktop: data.filter((r) => r.device_type === "desktop").length,
          browsers: Object.entries(browserMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
          os: Object.entries(osMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
        });
      }
    } catch { /* no supabase */ }
  };

  useEffect(() => { load(); }, []);

  const fmt = (v: number | null | undefined) =>
    v != null ? v.toLocaleString("ar-SA") : "—";

  const kpis = stats ? [
    { label: "إجمالي الإيرادات", value: stats.totalRevenue != null ? `${fmt(stats.totalRevenue)} ريال` : "—", icon: TrendingUp, color: "#1F4A10", bg: "#D4EDA8", trend: null },
    { label: "إجمالي الطلبات", value: fmt(stats.totalOrders), icon: Car, color: "#679632", bg: "#D4EDA8", trend: null },
    { label: "طلبات نشطة", value: String(stats.activeOrders), icon: AlertCircle, color: "#2563eb", bg: "#dbeafe", trend: null },
    { label: "طلبات معلّقة", value: String(stats.pendingOrders), icon: Clock, color: "#d97706", bg: "#fef3c7", trend: null },
    { label: "مدفوعات معلقة", value: fmt(stats.pendingPayments), icon: Wallet, color: "#7c3aed", bg: "#ede9fe", trend: null },
    { label: "إجمالي السائقين", value: String(stats.driversCount.all), icon: Users, color: "#1F4A10", bg: "#D4EDA8", trend: null },
    { label: "سائقون موثّقون", value: String(stats.driversCount.accepted), icon: CheckCircle, color: "#16a34a", bg: "#dcfce7", trend: null },
    { label: "قيد المراجعة", value: String(stats.driversCount.pending), icon: Clock, color: "#d97706", bg: "#fef3c7", trend: null },
  ] : [];

  const driverPieData = stats ? [
    { name: "موثّقون", value: stats.driversCount.accepted },
    { name: "قيد المراجعة", value: stats.driversCount.pending },
    { name: "مرفوضون", value: stats.driversCount.rejected },
  ].filter((d) => d.value > 0) : [];

  const ordersPieData = stats ? [
    { name: "نشطة", value: stats.activeOrders },
    { name: "معلّقة", value: stats.pendingOrders },
    { name: "مكتملة", value: stats.completedOrders },
  ].filter((d) => d.value > 0) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">لوحة الإحصائيات العامة</h2>
          <p className="text-[#4A5568]/60 text-sm mt-1">نظرة شاملة على أداء منصة مشوار</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] disabled:opacity-50 transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> تحديث
        </button>
      </div>

      {/* Platform badge */}
      <div className="flex gap-3">
        {[
          { label: "Android", icon: "🤖", color: "bg-green-50 border-green-200 text-green-700" },
          { label: "iOS / iPhone", icon: "🍎", color: "bg-gray-50 border-gray-200 text-gray-700" },
        ].map((p) => (
          <div key={p.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${p.color}`}>
            <span>{p.icon}</span>{p.label}
          </div>
        ))}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4EDA8] bg-[#F6FAF0] text-xs font-bold text-[#679632]">
          🌐 منصة مشوار v2
        </div>
      </div>

      {/* KPI Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
              <div className="w-11 h-11 bg-gray-100 rounded-xl mb-3" />
              <div className="h-7 bg-gray-100 rounded w-16 mb-1" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: kpi.bg }}>
                  <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
              </div>
              <p className="text-2xl font-heading font-black text-[#1F4A10]">{kpi.value}</p>
              <p className="text-xs text-[#4A5568]/60 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row 1: Drivers + Orders Pie */}
      {stats && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-bold text-[#1F4A10] mb-4">زوار الموقع (آخر 7 أيام)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockDailyVisitors}>
                <defs>
                  <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F4A10" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1F4A10" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#4A5568" }} />
                <YAxis tick={{ fontSize: 11, fill: "#4A5568" }} />
                <Tooltip />
                <Area type="monotone" dataKey="زوار" stroke="#1F4A10" strokeWidth={2} fill="url(#visGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-bold text-[#1F4A10] mb-2">توزيع السائقين</h3>
            {driverPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={driverPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" nameKey="name">
                    {driverPieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-300">
                <Users className="w-10 h-10" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charts Row 2: Orders by car type + Orders status */}
      {stats && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-bold text-[#1F4A10] mb-4">الطلبات حسب نوع المركبة</h3>
            {ordersByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ordersByType} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#4A5568" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#4A5568" }} />
                  <Tooltip />
                  <Bar dataKey="رحلات" radius={[6, 6, 0, 0]}>
                    {ordersByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-300">
                <Car className="w-10 h-10" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-bold text-[#1F4A10] mb-2">حالة الطلبات</h3>
            {ordersPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={ordersPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {ordersPieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                {[
                  { label: "طلبات نشطة", val: stats.activeOrders, color: "#2563eb", bg: "#dbeafe" },
                  { label: "طلبات معلّقة", val: stats.pendingOrders, color: "#d97706", bg: "#fef3c7" },
                  { label: "مكتملة", val: stats.completedOrders, color: "#16a34a", bg: "#dcfce7" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3 w-full">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: r.color }} />
                    <span className="text-sm text-gray-600 flex-1">{r.label}</span>
                    <span className="font-bold text-sm" style={{ color: r.color }}>{r.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visitor stats */}
      {stats && (
        <div className="bg-gradient-to-l from-[#1F4A10] to-[#2A5A14] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-[#D4EDA8]" />
            <h3 className="font-heading font-black text-lg">إحصائيات زوار الموقع التعريفي</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "إجمالي الزيارات", value: visitorStats ? visitorStats.totalVisitors.toLocaleString() : "—", icon: Globe },
              { label: "جوال 📱", value: visitorStats ? visitorStats.mobile : "—", icon: Smartphone },
              { label: "كمبيوتر 💻", value: visitorStats ? visitorStats.desktop : "—", icon: Monitor },
              { label: "تابلت 📟", value: visitorStats ? visitorStats.tablet : "—", icon: Tablet },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <s.icon className="w-7 h-7 text-[#D4EDA8]" />
                <div>
                  <p className="text-2xl font-heading font-black">{s.value}</p>
                  <p className="text-white/60 text-xs">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OS breakdown */}
      {visitorStats && visitorStats.os.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: "أنظمة التشغيل", data: visitorStats.os },
            { title: "المتصفحات", data: visitorStats.browsers },
          ].map(({ title, data }) => (
            <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-heading font-bold text-[#1F4A10] mb-4">{title}</h3>
              <div className="space-y-3">
                {data.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                    <span className="text-sm text-[#4A5568] flex-1">{item.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${(item.count / visitorStats.totalVisitors) * 100}%`, background: COLORS[i] }} />
                    </div>
                    <span className="text-sm font-bold text-[#1F4A10] w-8 text-left">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
