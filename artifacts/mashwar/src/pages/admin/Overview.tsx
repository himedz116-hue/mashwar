import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { supabase } from "@/lib/supabase";
import {
  Car, Users, TrendingUp, AlertCircle, Clock,
  Smartphone, Monitor, Tablet, Globe, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const CHART_COLORS = ["#1F4A10", "#679632", "#D4EDA8", "#F59E0B", "#3B82F6", "#8B5CF6", "#EF4444"];

const mockDailyVisitors = [
  { day: "السبت", visitors: 42 },
  { day: "الأحد", visitors: 78 },
  { day: "الاثنين", visitors: 95 },
  { day: "الثلاثاء", visitors: 63 },
  { day: "الأربعاء", visitors: 110 },
  { day: "الخميس", visitors: 87 },
  { day: "الجمعة", visitors: 54 },
];

const mockTripsByVehicle = [
  { name: "وانيت", trips: 312 },
  { name: "دينا", trips: 215 },
  { name: "دينا ونش", trips: 98 },
  { name: "سطحة", trips: 145 },
];

const mockRevenue = [
  { month: "يناير", revenue: 18500 },
  { month: "فبراير", revenue: 22100 },
  { month: "مارس", revenue: 19800 },
  { month: "أبريل", revenue: 26400 },
  { month: "مايو", revenue: 31200 },
  { month: "يونيو", revenue: 28700 },
  { month: "يوليو", revenue: 34500 },
];

const kpis = [
  { label: "رحلات نشطة الآن", value: "23", icon: Car, color: "#1F4A10", bg: "#D4EDA8", trend: +12, unit: "رحلة" },
  { label: "إيرادات اليوم", value: "4,820", icon: TrendingUp, color: "#679632", bg: "#D4EDA8", trend: +8, unit: "ريال" },
  { label: "سائقون متصلون", value: "41", icon: Users, color: "#1F4A10", bg: "#D4EDA8", trend: -3, unit: "سائق" },
  { label: "طلبات توثيق معلقة", value: "7", icon: Clock, color: "#F59E0B", bg: "#FEF3C7", trend: +2, unit: "طلب" },
  { label: "شكاوى مفتوحة", value: "3", icon: AlertCircle, color: "#EF4444", bg: "#FEE2E2", trend: -1, unit: "شكوى" },
];

interface PageViewStats {
  totalVisitors: number;
  mobile: number;
  tablet: number;
  desktop: number;
  browsers: { name: string; count: number }[];
  topPages: { page: string; count: number }[];
  os: { name: string; count: number }[];
}

export default function Overview() {
  const [stats, setStats] = useState<PageViewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await supabase
          .from("page_views")
          .select("device_type, browser, os, page")
          .order("created_at", { ascending: false })
          .limit(1000);

        if (!data || data.length === 0) {
          setStats(null);
          return;
        }

        const mobile = data.filter((r) => r.device_type === "mobile").length;
        const tablet = data.filter((r) => r.device_type === "tablet").length;
        const desktop = data.filter((r) => r.device_type === "desktop").length;

        const browserMap: Record<string, number> = {};
        data.forEach((r) => { if (r.browser) browserMap[r.browser] = (browserMap[r.browser] || 0) + 1; });

        const osMap: Record<string, number> = {};
        data.forEach((r) => { if (r.os) osMap[r.os] = (osMap[r.os] || 0) + 1; });

        const pageMap: Record<string, number> = {};
        data.forEach((r) => { if (r.page) pageMap[r.page] = (pageMap[r.page] || 0) + 1; });

        setStats({
          totalVisitors: data.length,
          mobile, tablet, desktop,
          browsers: Object.entries(browserMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
          os: Object.entries(osMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
          topPages: Object.entries(pageMap).map(([page, count]) => ({ page, count })).sort((a, b) => b.count - a.count),
        });
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const devicePieData = stats
    ? [
        { name: "جوال", value: stats.mobile },
        { name: "تابلت", value: stats.tablet },
        { name: "كمبيوتر", value: stats.desktop },
      ].filter((d) => d.value > 0)
    : [{ name: "جوال", value: 60 }, { name: "تابلت", value: 8 }, { name: "كمبيوتر", value: 32 }];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">لوحة الإحصائيات العامة</h2>
        <p className="text-[#4A5568]/60 text-sm mt-1">نظرة شاملة على أداء التطبيق اليومي</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: kpi.bg }}>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-bold ${kpi.trend > 0 ? "text-green-500" : "text-red-400"}`}>
                {kpi.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(kpi.trend)}%
              </span>
            </div>
            <p className="text-2xl font-heading font-black text-[#1F4A10]">{kpi.value}</p>
            <p className="text-xs text-[#4A5568]/60 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Visitor Stats Banner */}
      <div className="bg-gradient-to-l from-[#1F4A10] to-[#2A5A14] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-[#D4EDA8]" />
          <h3 className="font-heading font-black text-lg">إحصائيات زوار الموقع</h3>
          {loading && <span className="text-xs text-[#D4EDA8]/60 animate-pulse">جاري التحميل...</span>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-4xl font-heading font-black text-[#D4EDA8]">
              {stats ? stats.totalVisitors.toLocaleString() : "—"}
            </p>
            <p className="text-white/60 text-sm mt-1">إجمالي الزيارات</p>
          </div>
          <div className="flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-[#D4EDA8]" />
            <div>
              <p className="text-2xl font-heading font-black">{stats ? stats.mobile : "—"}</p>
              <p className="text-white/60 text-xs">جوال</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Monitor className="w-8 h-8 text-[#D4EDA8]" />
            <div>
              <p className="text-2xl font-heading font-black">{stats ? stats.desktop : "—"}</p>
              <p className="text-white/60 text-xs">كمبيوتر</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tablet className="w-8 h-8 text-[#D4EDA8]" />
            <div>
              <p className="text-2xl font-heading font-black">{stats ? stats.tablet : "—"}</p>
              <p className="text-white/60 text-xs">تابلت</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Daily visitors */}
        <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-heading font-bold text-[#1F4A10] mb-4">زوار الموقع (آخر 7 أيام)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockDailyVisitors}>
              <defs>
                <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1F4A10" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1F4A10" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#4A5568" }} />
              <YAxis tick={{ fontSize: 11, fill: "#4A5568" }} />
              <Tooltip />
              <Area type="monotone" dataKey="visitors" stroke="#1F4A10" strokeWidth={2} fill="url(#visitorGrad)" name="الزوار" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-heading font-bold text-[#1F4A10] mb-4">نوع الجهاز</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={devicePieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" nameKey="name">
                {devicePieData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v} زيارة`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Trips by vehicle */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-heading font-bold text-[#1F4A10] mb-4">الرحلات حسب نوع المركبة</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockTripsByVehicle} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4A5568" }} />
              <YAxis tick={{ fontSize: 11, fill: "#4A5568" }} />
              <Tooltip />
              <Bar dataKey="trips" name="الرحلات" radius={[6, 6, 0, 0]}>
                {mockTripsByVehicle.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue trend */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-heading font-bold text-[#1F4A10] mb-4">الإيرادات الشهرية (ريال)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockRevenue}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#679632" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#679632" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4A5568" }} />
              <YAxis tick={{ fontSize: 10, fill: "#4A5568" }} />
              <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ريال`} />
              <Area type="monotone" dataKey="revenue" stroke="#679632" strokeWidth={2} fill="url(#revenueGrad)" name="الإيرادات" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Browser & OS breakdown */}
      {stats && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-bold text-[#1F4A10] mb-4">المتصفحات</h3>
            <div className="space-y-3">
              {stats.browsers.slice(0, 5).map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS[i] }} />
                  <span className="text-sm text-[#4A5568] flex-1">{b.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${(b.count / stats.totalVisitors) * 100}%`, background: CHART_COLORS[i] }} />
                  </div>
                  <span className="text-sm font-bold text-[#1F4A10] w-8 text-left">{b.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-heading font-bold text-[#1F4A10] mb-4">أنظمة التشغيل</h3>
            <div className="space-y-3">
              {stats.os.slice(0, 5).map((o, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS[i] }} />
                  <span className="text-sm text-[#4A5568] flex-1">{o.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${(o.count / stats.totalVisitors) * 100}%`, background: CHART_COLORS[i] }} />
                  </div>
                  <span className="text-sm font-bold text-[#1F4A10] w-8 text-left">{o.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top pages */}
      {stats && stats.topPages.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-heading font-bold text-[#1F4A10] mb-4">أكثر الصفحات زيارةً</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right py-2 px-3 text-[#4A5568]/60 font-medium">الصفحة</th>
                  <th className="text-right py-2 px-3 text-[#4A5568]/60 font-medium">الزيارات</th>
                  <th className="text-right py-2 px-3 text-[#4A5568]/60 font-medium">النسبة</th>
                </tr>
              </thead>
              <tbody>
                {stats.topPages.slice(0, 8).map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-[#1F4A10]">{p.page || "/"}</td>
                    <td className="py-2.5 px-3 text-[#4A5568]">{p.count}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-24">
                          <div className="h-1.5 rounded-full bg-[#679632]" style={{ width: `${(p.count / stats.totalVisitors) * 100}%` }} />
                        </div>
                        <span className="text-xs text-[#4A5568]">{((p.count / stats.totalVisitors) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
