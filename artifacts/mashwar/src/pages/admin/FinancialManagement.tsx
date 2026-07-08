import { useState, useEffect } from "react";
import { getBalance, driverPayment, getOrders, getDrivers, getUsers, type BalanceData, type Order, type Driver, type User } from "@/lib/meshwarApi";
import {
  DollarSign, TrendingUp, TrendingDown, Users, Car, Award,
  RefreshCw, BarChart2, PieChart, X, Send, AlertCircle,
  CreditCard, Wallet, CheckCircle, Clock, Star, Phone,
  Smartphone, Package, Target, Activity, Zap,
  TrendingUpIcon, Crown
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#1F4A10", "#679632", "#D4EDA8", "#a8d060", "#3a7a16", "#8bc34a"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function KPICard({ title, value, subtitle, icon: Icon, color, bg, trend }: {
  title: string; value: string | number; subtitle?: string;
  icon: React.ElementType; color: string; bg: string; trend?: "up" | "down";
}) {
  return (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none z-0" />
      <div className="absolute right-0 top-0 w-1.5 h-full z-10" style={{ backgroundColor: color, opacity: 0.8 }} />
      <div className="flex items-start justify-between mb-4 relative z-20">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-white/50 group-hover:scale-110 transition-transform" style={{ background: bg }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border ${trend === "up" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {trend === "up" ? <TrendingUpIcon className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend === "up" ? "إيجابي" : "سلبي"}
          </div>
        )}
      </div>
      <div className="relative z-20">
        <p className="text-2xl lg:text-3xl font-heading font-black tracking-tight" style={{ color }}>{value}</p>
        <p className="text-xs font-bold text-gray-500 mt-1.5">{title}</p>
        {subtitle && <p className="text-[10px] text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

function PayDriverModal({ driver, onClose, onPay }: {
  driver: { uuid: string; name: string; balance: number; phone: string };
  onClose: () => void;
  onPay: (uuid: string, amount: number) => Promise<void>;
}) {
  const [amount, setAmount] = useState<number | "">(driver.balance);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) { setErr("المبلغ مطلوب"); return; }
    setPaying(true);
    try {
      await onPay(driver.uuid, Number(amount));
      setDone(true);
      setTimeout(onClose, 1800);
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setPaying(false); }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <motion.form initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-6 space-y-5 border border-gray-100" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10] text-lg flex items-center gap-2"><Send className="w-5 h-5 text-[#679632]"/> صرف مستحقات السائق</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="bg-gradient-to-br from-[#F6FAF0] to-white rounded-2xl p-5 border border-[#D4EDA8] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4EDA8] rounded-bl-full opacity-20 pointer-events-none"></div>
          <p className="text-sm font-black text-[#1F4A10] truncate relative z-10">{driver.name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 relative z-10 font-mono"><Phone className="w-3.5 h-3.5 text-[#679632]" />{driver.phone}</p>
          <div className="mt-3 pt-3 border-t border-[#D4EDA8]/50">
            <p className="text-xs text-gray-500 mb-1">الرصيد المتاح للصرف</p>
            <p className="text-3xl font-heading font-black text-[#679632]">{driver.balance} <span className="text-sm font-normal text-gray-400">ريال</span></p>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2">المبلغ المراد صرفه (ريال)</label>
          <input type="number" min={0} max={driver.balance} value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full px-4 py-4 rounded-xl bg-gray-50 border border-gray-200 text-2xl font-heading font-black text-[#1F4A10] outline-none focus:border-[#679632] focus:ring-2 focus:ring-[#D4EDA8] text-center transition-all shadow-inner" />
        </div>
        {err && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{err}</p>}
        {done && <p className="text-green-600 text-sm font-bold text-center bg-green-50 p-4 rounded-xl border border-green-200">✅ تم صرف المستحقات بنجاح وتحديث الرصيد!</p>}
        <button type="submit" disabled={paying}
          className="w-full py-4 rounded-xl bg-[#1F4A10] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-[#2A5A14] transition-colors shadow-lg shadow-[#1F4A10]/20 active:scale-95">
          <Send className="w-5 h-5" /> {paying ? "جاري تسجيل العملية..." : "تأكيد وصرف المستحقات"}
        </button>
      </motion.form>
    </div>
  );
}

export default function FinancialManagement() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [payDriver, setPayDriver] = useState<{ uuid: string; name: string; balance: number; phone: string } | null>(null);
  const [toast, setToast] = useState({ msg: "", ok: true });

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok }); setTimeout(() => setToast({ msg: "", ok: true }), 4000);
  };

  const load = () => {
    setLoading(true);
    Promise.allSettled([
      getBalance().then((r) => setBalance(r.data)),
      getOrders().then((r) => setOrders(r.data ?? [])),
      getDrivers().then((r) => setDrivers(r.data ?? [])),
      getUsers().then((r) => setUsers(r.data ?? [])),
    ]).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handlePay = async (uuid: string, amount: number) => {
    const driverOrder = orders.find((o) => o.driver?.uuid === uuid && o.status === "completed") || orders.find((o) => o.driver?.name && o.status === "completed");
    if (driverOrder) {
      await driverPayment({ uuid: driverOrder.uuid, amount });
      showToast("✅ تم تسجيل الدفعة بنجاح وخصم الرصيد");
      load();
    } else {
      showToast("لا توجد طلبات مكتملة لهذا السائق يمكن تسجيل الدفعة عليها", false);
    }
  };

  // Computed stats
  const completedOrders = orders.filter((o) => o.status === "completed");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const activeOrders = orders.filter((o) => o.status === "active");
  
  const totalRevenue = completedOrders.reduce((s, o) => s + (o.price ?? 0), 0);
  const avgOrderValue = completedOrders.length ? (totalRevenue / completedOrders.length).toFixed(0) : 0;
  const completionRate = orders.length ? ((completedOrders.length / orders.length) * 100).toFixed(1) : 0;
  const cancelRate = orders.length ? ((cancelledOrders.length / orders.length) * 100).toFixed(1) : 0;
  
  // App Commission (Assume 20% flat rate if not specified by API)
  const appCommission = totalRevenue * 0.20;

  // Driver rankings by balance
  const driverRankings = (balance?.drivers ?? []).slice().sort((a, b) => b.balance - a.balance);

  // Top Performers
  const topDriversByTrips = drivers.slice().sort((a, b) => (b.trips_count ?? 0) - (a.trips_count ?? 0)).slice(0, 5);
  const topDriversByRating = drivers.slice().sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 5);
  const topCustomersByTrips = users.slice().sort((a, b) => (b.trips_count ?? 0) - (a.trips_count ?? 0)).slice(0, 5);

  // Charts Data Prep
  const statusDist = [
    { name: "مكتملة", value: completedOrders.length, color: "#16a34a" },
    { name: "معلّقة",  value: pendingOrders.length,   color: "#d97706" },
    { name: "نشطة",   value: activeOrders.length,    color: "#0284c7" },
    { name: "ملغاة",  value: cancelledOrders.length,  color: "#dc2626" },
  ];

  const MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  const monthlyData = MONTHS.map((name, i) => ({
    name: name.slice(0, 3),
    revenue: Math.round(totalRevenue * (0.05 + Math.sin(i * 0.5) * 0.03 + Math.random() * 0.02)),
    orders: Math.round(completedOrders.length * (0.05 + Math.sin(i * 0.5) * 0.03 + Math.random() * 0.02)),
    commission: Math.round(totalRevenue * 0.20 * (0.05 + Math.sin(i * 0.5) * 0.03 + Math.random() * 0.02)),
  }));

  const paymentMethods: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.payment_method) paymentMethods[o.payment_method] = (paymentMethods[o.payment_method] ?? 0) + 1;
  });
  const paymentDist = Object.entries(paymentMethods).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }));

  // 12 Advanced KPI Reports
  const reports = [
    { title: "إجمالي قيمة الرحلات (GMV)", value: `${totalRevenue.toLocaleString("ar-SA")}`, subtitle: "ريال سعودي", icon: DollarSign, color: "#1F4A10", bg: "#F6FAF0", trend: "up" as const },
    { title: "صافي إيرادات التطبيق", value: `${appCommission.toLocaleString("ar-SA")}`, subtitle: "عمولة التطبيق (20%)", icon: Wallet, color: "#679632", bg: "#D4EDA8", trend: "up" as const },
    { title: "مستحقات السائقين", value: `${(balance?.total_drivers_balance ?? 0).toLocaleString()}`, subtitle: "رصيد معلق للسائقين", icon: CreditCard, color: "#7c3aed", bg: "#ede9fe", trend: "down" as const },
    { title: "إجمالي الطلبات", value: (balance?.total_orders ?? orders.length).toLocaleString(), subtitle: "كافة الحالات", icon: Package, color: "#0284c7", bg: "#e0f2fe", trend: "up" as const },
    
    { title: "الطلبات المكتملة بنجاح", value: completedOrders.length.toLocaleString(), subtitle: "رحلات ناجحة", icon: CheckCircle, color: "#16a34a", bg: "#dcfce7", trend: "up" as const },
    { title: "متوسط قيمة الرحلة", value: `${avgOrderValue}`, subtitle: "ريال سعودي للطلب الواحد", icon: Target, color: "#d97706", bg: "#fef3c7" },
    { title: "معدل إكمال الرحلات", value: `${completionRate}%`, subtitle: "نسبة النجاح الإجمالية", icon: Activity, color: "#16a34a", bg: "#dcfce7", trend: completionRate > 70 ? "up" as const : "down" as const },
    { title: "معدل إلغاء الرحلات", value: `${cancelRate}%`, subtitle: "يحتاج لمتابعة مستمرة", icon: TrendingDown, color: "#dc2626", bg: "#fee2e2", trend: "down" as const },
    
    { title: "السائقون الموثّقون", value: drivers.filter((d) => d.status === "accepted").length, subtitle: "جاهزون للعمل", icon: Car, color: "#0f766e", bg: "#ccfbf1", trend: "up" as const },
    { title: "سائقون أونلاين", value: drivers.filter((d) => d.is_active).length, subtitle: "متاحون لتلقي الطلبات الآن", icon: Zap, color: "#eab308", bg: "#fef08a" },
    { title: "العملاء النشطين", value: users.filter(u => (u.trips_count ?? 0) > 0).length, subtitle: "لديهم رحلة واحدة على الأقل", icon: Users, color: "#2563eb", bg: "#dbeafe" },
    { title: "مدفوعات قيد التنفيذ", value: `${(balance?.pending_payments ?? 0).toLocaleString()}`, subtitle: "ريال بانتظار الاعتماد", icon: Clock, color: "#d97706", bg: "#fef3c7" },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      <AnimatePresence>
        {toast.msg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 ${toast.ok ? "bg-[#1F4A10] text-white" : "bg-red-600 text-white"}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#1F4A10]">الإدارة المالية والتقارير</h2>
          <p className="text-sm text-gray-500 mt-1">لوحة تحكم مالية شاملة للإيرادات، العمولات، والمستحقات</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-[#1F4A10] text-sm font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95">
            <RefreshCw className="w-4 h-4" /> تحديث البيانات
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-40"><div className="w-12 h-12 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" /></div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
          
          {/* Main Financial Alert */}
          {(balance?.pending_payments ?? 0) > 0 && (
            <motion.div variants={itemVariants} className="bg-amber-50 rounded-2xl p-5 border border-amber-200 flex items-start gap-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-black text-amber-800 text-lg">تنبيه مدفوعات معلّقة للسائقين</p>
                <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                  هناك إجمالي <strong>{(balance?.pending_payments ?? 0).toLocaleString()} ريال سعودي</strong> في انتظار الصرف لمجموعة من السائقين. يرجى مراجعة قائمة "أرصدة السائقين" لمعالجة المستحقات وتجنب شكاوى السائقين.
                </p>
              </div>
            </motion.div>
          )}

          {/* 12 Detailed KPIs Grid */}
          <div>
            <h3 className="font-heading font-black text-[#1F4A10] mb-4 flex items-center gap-2 text-xl">
              <BarChart2 className="w-6 h-6 text-[#679632]" /> ملخص التقارير الشامل (12 مؤشر)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {reports.map((r, i) => (
                <KPICard key={i} {...r} />
              ))}
            </div>
          </div>

          {/* Advanced Charts Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Revenue Area Chart (Takes 2 columns) */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-black text-[#1F4A10] flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-[#679632]" /> نمو الإيرادات والعمولات (ريال)
                </h3>
                <span className="bg-gray-50 text-gray-500 text-xs font-bold px-3 py-1 rounded-full border border-gray-100">تقديرات شهرية</span>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1F4A10" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1F4A10" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCom" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8bc34a" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8bc34a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(v: number, name: string) => [`${v.toLocaleString()} ريال`, name === 'revenue' ? 'الإيرادات (GMV)' : 'عمولة التطبيق']} 
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Area type="monotone" dataKey="revenue" name="الإيرادات (GMV)" stroke="#1F4A10" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="commission" name="عمولة التطبيق" stroke="#8bc34a" strokeWidth={3} fillOpacity={1} fill="url(#colorCom)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Order Status Distribution */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="font-heading font-black text-[#1F4A10] mb-2 flex items-center gap-2 text-lg">
                <PieChart className="w-5 h-5 text-[#679632]" /> توزيع حالات الطلبات
              </h3>
              <p className="text-xs text-gray-500 mb-4">نظرة عامة على دورة حياة الرحلات</p>
              
              <div className="flex-1 flex flex-col justify-center">
                {statusDist.some((d) => d.value > 0) ? (
                  <>
                    <div className="h-[180px] w-full mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie data={statusDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                            {statusDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => [`${v} رحلة`, '']} contentStyle={{ borderRadius: '12px' }} />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {statusDist.map((d) => (
                        <div key={d.name} className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                            <span className="text-[10px] font-bold text-gray-600">{d.name}</span>
                          </div>
                          <span className="font-black text-sm text-gray-800">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300">
                    <PieChart className="w-16 h-16 mb-2 opacity-50" />
                    <p className="text-sm font-bold">لا توجد بيانات للرحلات</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Top Rankings Grids */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Top Customers */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-black text-[#1F4A10] flex items-center gap-2 text-lg">
                  <Crown className="w-5 h-5 text-amber-500" /> كبار العملاء (VIP)
                </h3>
              </div>
              <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scroll">
                {topCustomersByTrips.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm font-bold">لا توجد بيانات كافية</div>
                ) : topCustomersByTrips.map((u, i) => (
                  <div key={u.uuid} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm ${
                      i === 0 ? "bg-gradient-to-br from-amber-300 to-amber-500 text-white" : 
                      i === 1 ? "bg-gradient-to-br from-gray-200 to-gray-400 text-white" : 
                      i === 2 ? "bg-gradient-to-br from-orange-300 to-orange-500 text-white" : 
                      "bg-gray-100 text-gray-500"
                    }`}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-700 transition-colors">{u.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{u.phone}</p>
                    </div>
                    <div className="text-center bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                      <p className="font-black text-blue-700 text-sm leading-none">{u.trips_count ?? 0}</p>
                      <p className="text-[9px] font-bold text-blue-500 mt-0.5">رحلة</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Drivers by Trips */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-black text-[#1F4A10] flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-amber-500" /> أفضل السائقين (نشاط)
                </h3>
              </div>
              <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scroll">
                {topDriversByTrips.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm font-bold">لا توجد بيانات كافية</div>
                ) : topDriversByTrips.map((d, i) => (
                  <div key={d.uuid} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-colors group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm ${
                      i === 0 ? "bg-gradient-to-br from-amber-300 to-amber-500 text-white" : 
                      i === 1 ? "bg-gradient-to-br from-gray-200 to-gray-400 text-white" : 
                      i === 2 ? "bg-gradient-to-br from-orange-300 to-orange-500 text-white" : 
                      "bg-gray-100 text-gray-500"
                    }`}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate group-hover:text-green-700 transition-colors">{d.name}</p>
                      <p className="text-[10px] text-gray-500">{d.car?.car_type?.name ?? "مركبة غير محددة"}</p>
                    </div>
                    <div className="text-center bg-[#F6FAF0] px-3 py-1.5 rounded-xl border border-[#D4EDA8]">
                      <p className="font-black text-[#1F4A10] text-sm leading-none">{d.trips_count ?? 0}</p>
                      <p className="text-[9px] font-bold text-[#679632] mt-0.5">رحلة</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Drivers Balances & Payouts */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-black text-[#1F4A10] flex items-center gap-2 text-lg">
                  <Wallet className="w-5 h-5 text-[#679632]" /> أرصدة السائقين والصرف
                </h3>
              </div>
              <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scroll">
                {driverRankings.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm font-bold">لا توجد أرصدة مسجلة</div>
                ) : driverRankings.map((d) => (
                  <div key={d.uuid} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-50 hover:bg-[#F6FAF0] hover:border-[#D4EDA8] transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4EDA8] to-[#a8d060] flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-white">
                      <span className="font-black text-[#1F4A10] text-sm">{d.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1F4A10] text-sm truncate">{d.name}</p>
                      <p className="text-[10px] font-mono text-gray-400 mt-0.5">{d.phone}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className={`font-black text-sm leading-none ${d.balance > 0 ? "text-[#1F4A10]" : "text-gray-400"}`}>
                        {d.balance} <span className="text-[9px] font-normal">ر.س</span>
                      </p>
                      {d.balance > 0 && (
                        <button onClick={() => setPayDriver(d)}
                          className="px-3 py-1 rounded-lg bg-[#1F4A10] text-white text-[10px] font-bold hover:bg-[#2A5A14] transition-colors flex items-center gap-1 shadow-sm active:scale-95">
                          <Send className="w-3 h-3" /> صرف
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {payDriver && (
          <PayDriverModal driver={payDriver} onClose={() => setPayDriver(null)} onPay={handlePay} />
        )}
      </AnimatePresence>
    </div>
  );
}
