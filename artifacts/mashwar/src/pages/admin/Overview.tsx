import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Car, Users, TrendingUp, AlertCircle, Clock,
  Smartphone, Monitor, Tablet, Globe, ArrowUpRight,
  RefreshCw, Wallet, CheckCircle, XCircle, Truck,
  Activity, BarChart2, Award, Target, Percent, Zap,
  Apple,
} from "lucide-react";
import { getBalance, getDrivers, getOrders, getUsers } from "@/lib/meshwarApi";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/meshwarApi";

const COLORS = ["#1F4A10", "#679632", "#D4EDA8", "#F59E0B", "#3B82F6", "#8B5CF6", "#EF4444", "#10B981"];

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
  driversCount: { all: number; accepted: number; pending: number; rejected: number; online: number };
  usersCount: number;
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
  allOrders: Order[];
}

interface VisitorStats {
  totalVisitors: number;
  mobile: number; tablet: number; desktop: number;
  browsers: { name: string; count: number }[];
  os: { name: string; count: number }[];
}

function KPICard({ label, value, icon: Icon, color, bg, sub, trend }: {
  label: string; value: string; icon: React.ElementType; color: string; bg: string;
  sub?: string; trend?: { value: string; up: boolean } | null;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${trend.up ? "text-green-700 bg-green-50" : "text-red-600 bg-red-50"}`}>
            <ArrowUpRight className={`w-3 h-3 ${!trend.up ? "rotate-90" : ""}`} />
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-heading font-black text-[#1F4A10] leading-none">{value}</p>
      {sub && <p className="text-[10px] font-bold mt-0.5" style={{ color }}>{sub}</p>}
      <p className="text-xs text-[#4A5568]/60 mt-1">{label}</p>
    </div>
  );
}

export default function Overview() {
  const [stats, setStats] = useState<RealStats | null>(null);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordersByType, setOrdersByType] = useState<{ name: string; رحلات: number }[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [balRes, driversRes, usersRes, pendingRes, activeRes, completedRes] = await Promise.allSettled([
        getBalance(),
        getDrivers(),
        getUsers(),
        getOrders(1),
        getOrders(2),
        getOrders(3),
      ]);

      const bal = balRes.status === "fulfilled" ? balRes.value.data : null;
      const drivers = driversRes.status === "fulfilled" ? driversRes.value.data ?? [] : [];
      const users = usersRes.status === "fulfilled" ? usersRes.value.data ?? [] : [];
      const pending = pendingRes.status === "fulfilled" ? pendingRes.value.data ?? [] : [];
      const active = activeRes.status === "fulfilled" ? activeRes.value.data ?? [] : [];
      const completed = completedRes.status === "fulfilled" ? completedRes.value.data ?? [] : [];
      const allOrders = [...pending, ...active, ...completed];

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
          online: drivers.filter((d) => d.is_active).length,
        },
        usersCount: users.length,
        pendingOrders: pending.length,
        activeOrders: active.length,
        completedOrders: completed.length,
        allOrders,
      });

      const typeMap: Record<string, number> = {};
      allOrders.forEach((o) => {
        const name = o.car_type?.name ?? "غير محدد";
        typeMap[name] = (typeMap[name] || 0) + 1;
      });
      setOrdersByType(Object.entries(typeMap).map(([name, رحلات]) => ({ name, رحلات })));
      setLastUpdated(new Date());
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

  // Derived metrics
  const completionRate = stats && stats.totalOrders
    ? Math.round((stats.completedOrders / (stats.pendingOrders + stats.activeOrders + stats.completedOrders)) * 100)
    : null;

  const avgRevenuePerOrder = stats && stats.totalRevenue && stats.totalOrders && stats.totalOrders > 0
    ? Math.round(stats.totalRevenue / stats.totalOrders)
    : null;

  const avgTripsPerDriver = stats && stats.driversCount.accepted > 0 && stats.totalOrders
    ? (stats.totalOrders / stats.driversCount.accepted).toFixed(1)
    : null;

  const pendingKYCRate = stats && stats.driversCount.all > 0
    ? Math.round((stats.driversCount.pending / stats.driversCount.all) * 100)
    : null;

  const kpis = stats ? [
    { label: "إجمالي الإيرادات", value: stats.totalRevenue != null ? `${fmt(stats.totalRevenue)} ريال` : "—", icon: TrendingUp, color: "#1F4A10", bg: "#D4EDA8", sub: "من جميع الرحلات المكتملة", trend: null },
    { label: "إجمالي الطلبات", value: fmt(stats.totalOrders), icon: BarChart2, color: "#679632", bg: "#D4EDA8", sub: `${stats.completedOrders} مكتملة`, trend: null },
    { label: "طلبات نشطة الآن", value: String(stats.activeOrders), icon: Activity, color: "#2563eb", bg: "#dbeafe", sub: "جارية حالياً", trend: null },
    { label: "طلبات معلّقة", value: String(stats.pendingOrders), icon: Clock, color: "#d97706", bg: "#fef3c7", sub: "بانتظار سائق", trend: null },
    { label: "مدفوعات معلقة", value: fmt(stats.pendingPayments), icon: Wallet, color: "#7c3aed", bg: "#ede9fe", sub: "ريال مستحقة", trend: null },
    { label: "رصيد السائقين الكلي", value: fmt(stats.totalDriversBalance), icon: Award, color: "#0891b2", bg: "#cffafe", sub: "ريال مجمّع", trend: null },
    { label: "إجمالي المستخدمين", value: String(stats.usersCount), icon: Users, color: "#1F4A10", bg: "#D4EDA8", sub: "مستخدم مسجّل", trend: null },
    { label: "إجمالي السائقين", value: String(stats.driversCount.all), icon: Truck, color: "#16a34a", bg: "#dcfce7", sub: `${stats.driversCount.online} متصل الآن`, trend: null },
    { label: "سائقون موثّقون", value: String(stats.driversCount.accepted), icon: CheckCircle, color: "#16a34a", bg: "#dcfce7", sub: "اكتملت الموثّقة", trend: null },
    { label: "قيد مراجعة KYC", value: String(stats.driversCount.pending), icon: AlertCircle, color: "#d97706", bg: "#fef3c7", sub: pendingKYCRate != null ? `${pendingKYCRate}% من الكل` : "", trend: null },
    { label: "مرفوضون", value: String(stats.driversCount.rejected), icon: XCircle, color: "#dc2626", bg: "#fee2e2", sub: "طلبات مرفوضة", trend: null },
    { label: "نسبة الإتمام", value: completionRate != null ? `${completionRate}%` : "—", icon: Target, color: "#1F4A10", bg: "#D4EDA8", sub: "من إجمالي الرحلات", trend: null },
  ] : [];

  const derived = stats ? [
    { label: "متوسط إيراد الرحلة", value: avgRevenuePerOrder != null ? `${avgRevenuePerOrder} ريال` : "—", icon: Percent, color: "#7c3aed", bg: "#ede9fe" },
    { label: "متوسط رحلات السائق", value: avgTripsPerDriver ?? "—", icon: Zap, color: "#0891b2", bg: "#cffafe" },
    { label: "سائقون متصلون", value: `${stats.driversCount.online} / ${stats.driversCount.accepted}`, icon: Activity, color: "#16a34a", bg: "#dcfce7" },
    { label: "مستخدمون / سائقون", value: stats.driversCount.all > 0 ? `${(stats.usersCount / stats.driversCount.all).toFixed(1)}x` : "—", icon: Users, color: "#679632", bg: "#D4EDA8" },
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

  const paymentPieData = stats?.allOrders.length ? (() => {
    const map: Record<string, number> = {};
    stats.allOrders.forEach((o) => {
      const k = o.payment_method ?? "غير محدد";
      map[k] = (map[k] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })() : [];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">لوحة الإحصائيات العامة</h2>
          <p className="text-[#4A5568]/60 text-sm mt-1">
            نظرة شاملة على أداء منصة مشوار
            {lastUpdated && <span className="mr-2 text-[#679632] font-bold">• آخر تحديث {lastUpdated.toLocaleTimeString("ar-SA")}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-xs font-bold text-green-700">
              <Smartphone className="w-3 h-3" /> Android
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700">
              <Apple className="w-3 h-3" /> iOS
            </div>
          </div>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] disabled:opacity-50 transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> تحديث
          </button>
        </div>
      </div>

      {/* KPI Grid - 12 cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
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
            <KPICard key={i} {...kpi} />
          ))}
        </div>
      )}

      {/* Derived / computed metrics row */}
      {stats && derived.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {derived.map((d, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: d.bg }}>
                <d.icon className="w-4 h-4" style={{ color: d.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-heading font-black text-[#1F4A10] truncate">{d.value}</p>
                <p className="text-[10px] text-gray-400">{d.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row 1: Website visitors + Driver distribution */}
      {stats && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-bold text-[#1F4A10] mb-4">زوار الموقع التعريفي (آخر 7 أيام)</h3>
            <ResponsiveContainer width="100%" height={210}>
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
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #D4EDA8", fontSize: 12 }} />
                <Area type="monotone" dataKey="زوار" stroke="#1F4A10" strokeWidth={2} fill="url(#visGrad)" dot={{ fill: "#679632", r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-bold text-[#1F4A10] mb-3">توزيع السائقين</h3>
            {driverPieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={driverPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                      {driverPieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-1">
                  {driverPieData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                        <span className="text-xs text-gray-600">{d.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#1F4A10]">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-300">
                <Users className="w-10 h-10" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charts Row 2: Orders by car type + Orders by status + Payment method */}
      {stats && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-bold text-[#1F4A10] mb-4 text-sm">الطلبات حسب نوع المركبة</h3>
            {ordersByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ordersByType} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#4A5568" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#4A5568" }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 11 }} />
                  <Bar dataKey="رحلات" radius={[6, 6, 0, 0]}>
                    {ordersByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-300">
                <Car className="w-10 h-10" />
                <p className="text-sm">لا توجد بيانات</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-bold text-[#1F4A10] mb-3 text-sm">حالة الطلبات</h3>
            {ordersPieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={ordersPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                      {ordersPieData.map((_, i) => <Cell key={i} fill={[COLORS[2], "#F59E0B", COLORS[1]][i] ?? COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-1">
                  {ordersPieData.map((d, i) => {
                    const colors = [COLORS[2], "#F59E0B", COLORS[1]];
                    return (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i] }} />
                          <span className="text-xs text-gray-600">{d.name}</span>
                        </div>
                        <span className="text-xs font-bold text-[#1F4A10]">{d.value}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="space-y-3 mt-4">
                {[
                  { label: "طلبات نشطة", val: stats.activeOrders, color: "#2563eb" },
                  { label: "طلبات معلّقة", val: stats.pendingOrders, color: "#d97706" },
                  { label: "مكتملة", val: stats.completedOrders, color: "#16a34a" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
                    <span className="text-sm text-gray-600 flex-1">{r.label}</span>
                    <span className="font-bold text-sm" style={{ color: r.color }}>{r.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-bold text-[#1F4A10] mb-3 text-sm">طرق الدفع</h3>
            {paymentPieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={paymentPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                      {paymentPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-1">
                  {paymentPieData.slice(0, 4).map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-xs text-gray-600">{d.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#1F4A10]">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-300">
                <Wallet className="w-10 h-10 mb-2" />
                <p className="text-sm">لا توجد بيانات</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Financial summary banner */}
      {stats && (
        <div className="bg-gradient-to-l from-[#1F4A10] to-[#2A6614] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-5">
            <TrendingUp className="w-5 h-5 text-[#D4EDA8]" />
            <h3 className="font-heading font-black text-lg">ملخص الأداء المالي</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "إجمالي الإيرادات", value: stats.totalRevenue != null ? `${fmt(stats.totalRevenue)} ريال` : "—" },
              { label: "متوسط إيراد الرحلة", value: avgRevenuePerOrder != null ? `${avgRevenuePerOrder} ريال` : "—" },
              { label: "مدفوعات معلقة", value: stats.pendingPayments != null ? `${fmt(stats.pendingPayments)} ريال` : "—" },
              { label: "رصيد مجمّع للسائقين", value: stats.totalDriversBalance != null ? `${fmt(stats.totalDriversBalance)} ريال` : "—" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-xl font-heading font-black text-[#D4EDA8]">{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visitor analytics */}
      <div className="bg-gradient-to-l from-[#0F2A07] to-[#1a3d0d] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-5">
          <Globe className="w-5 h-5 text-[#D4EDA8]" />
          <h3 className="font-heading font-black text-lg">إحصائيات زوار الموقع التعريفي</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "إجمالي الزيارات", value: visitorStats?.totalVisitors.toLocaleString("ar-SA") ?? "—", icon: Globe },
            { label: "جوال 📱", value: visitorStats?.mobile ?? "—", icon: Smartphone },
            { label: "كمبيوتر 💻", value: visitorStats?.desktop ?? "—", icon: Monitor },
            { label: "تابلت 📟", value: visitorStats?.tablet ?? "—", icon: Tablet },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <s.icon className="w-8 h-8 text-[#D4EDA8] flex-shrink-0" />
              <div>
                <p className="text-2xl font-heading font-black">{s.value}</p>
                <p className="text-white/60 text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OS + Browser breakdown */}
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
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full transition-all" style={{ width: `${Math.round((item.count / visitorStats.totalVisitors) * 100)}%`, background: COLORS[i] }} />
                    </div>
                    <span className="text-sm font-bold text-[#1F4A10] w-10 text-left">{item.count}</span>
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
