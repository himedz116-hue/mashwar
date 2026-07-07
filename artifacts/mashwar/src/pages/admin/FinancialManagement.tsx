import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { getBalance, driverPayment, type BalanceData } from "@/lib/meshwarApi";
import { DollarSign, TrendingUp, Wallet, CheckCircle, XCircle, Clock, RefreshCw, Users, CreditCard, Banknote } from "lucide-react";

const COLORS = ["#1F4A10", "#679632", "#D4EDA8", "#F59E0B", "#3B82F6"];

const paymentMethods = [
  { name: "مدى", value: 42 },
  { name: "آبل باي", value: 25 },
  { name: "فيزا", value: 18 },
  { name: "محفظة", value: 10 },
  { name: "نقدي", value: 5 },
];

const monthlyRevenue = [
  { month: "يناير", إيرادات: 12400 },
  { month: "فبراير", إيرادات: 18200 },
  { month: "مارس", إيرادات: 15800 },
  { month: "أبريل", إيرادات: 22100 },
  { month: "مايو", إيرادات: 19600 },
  { month: "يونيو", إيرادات: 28400 },
  { month: "يوليو", إيرادات: 31200 },
];

function PayDriverModal({ driver, onClose, onPay }: {
  driver: { uuid: string; name: string; balance: number; phone: string };
  onClose: () => void;
  onPay: (uuid: string, amount: number) => Promise<void>;
}) {
  const [amount, setAmount] = useState(String(driver.balance));
  const [paying, setPaying] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) { setMsg("أدخل مبلغاً صحيحاً"); return; }
    setPaying(true);
    try {
      await onPay(driver.uuid, Number(amount));
      setMsg("✅ تم تسجيل الدفعة بنجاح");
      setTimeout(onClose, 1500);
    } catch (e: unknown) {
      setMsg("خطأ: " + (e instanceof Error ? e.message : String(e)));
    } finally { setPaying(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <form className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10]">تسجيل دفعة</h3>
          <button type="button" onClick={onClose}><XCircle className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="bg-[#F6FAF0] rounded-2xl p-4">
          <p className="font-bold text-[#1F4A10]">{driver.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{driver.phone}</p>
          <p className="text-lg font-heading font-black text-green-700 mt-2">{driver.balance.toLocaleString()} ريال مستحق</p>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">المبلغ (ريال)</label>
          <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-lg font-bold outline-none focus:border-[#679632]" />
        </div>
        {msg && <p className={`text-xs font-bold p-2 rounded-lg ${msg.startsWith("✅") ? "text-green-700 bg-green-50" : "text-red-500 bg-red-50"}`}>{msg}</p>}
        <button type="submit" disabled={paying}
          className="w-full py-3 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] disabled:opacity-50 flex items-center justify-center gap-2">
          <Banknote className="w-4 h-4" /> {paying ? "جاري التسجيل..." : "تسجيل الدفعة"}
        </button>
      </form>
    </div>
  );
}

export default function FinancialManagement() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"overview" | "drivers" | "methods">("overview");
  const [payDriver, setPayDriver] = useState<{ uuid: string; name: string; balance: number; phone: string } | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const load = () => {
    setLoading(true); setError("");
    getBalance()
      .then((r) => setBalance(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handlePay = async (uuid: string, amount: number) => {
    await driverPayment({ uuid, amount });
    showToast("✅ تم تسجيل الدفعة بنجاح");
    load();
  };

  const drivers = balance?.drivers ?? [];
  const driversWithBalance = drivers.filter((d) => d.balance > 0);

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F4A10] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold">
          {toast}
        </div>
      )}
      {payDriver && (
        <PayDriverModal driver={payDriver} onClose={() => setPayDriver(null)} onPay={handlePay} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة الشؤون المالية</h2>
          <p className="text-sm text-gray-500 mt-0.5">مراقبة الإيرادات والأرصدة ومدفوعات السائقين</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] disabled:opacity-50 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> تحديث
        </button>
      </div>

      {loading && <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>}

      {error && (
        <div className="bg-red-50 rounded-2xl p-6 text-center border border-red-100">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
          <p className="text-red-600 font-bold">{error}</p>
          <button onClick={load} className="mt-3 text-sm text-red-500 underline">إعادة المحاولة</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "إجمالي الإيرادات",
                value: balance?.total_revenue != null ? `${balance.total_revenue.toLocaleString()} ريال` : "—",
                icon: TrendingUp, color: "#1F4A10", bg: "#D4EDA8",
              },
              {
                label: "أرصدة السائقين",
                value: balance?.total_drivers_balance != null ? `${balance.total_drivers_balance.toLocaleString()} ريال` : "—",
                icon: Users, color: "#679632", bg: "#D4EDA8",
              },
              {
                label: "إجمالي الطلبات",
                value: balance?.total_orders?.toLocaleString() ?? "—",
                icon: DollarSign, color: "#2563eb", bg: "#dbeafe",
              },
              {
                label: "مدفوعات معلقة",
                value: balance?.pending_payments?.toLocaleString() ?? "—",
                icon: Clock, color: "#d97706", bg: "#fef3c7",
              },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: kpi.bg }}>
                  <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
                <p className="text-xl font-heading font-black" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {[
                { key: "overview", label: "📊 الإيرادات الشهرية" },
                { key: "drivers", label: `💰 أرصدة السائقين (${driversWithBalance.length})` },
                { key: "methods", label: "💳 طرق الدفع" },
              ].map((t) => (
                <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
                  className={`flex-1 py-3.5 text-xs sm:text-sm font-bold transition-colors ${tab === t.key ? "text-[#1F4A10] border-b-2 border-[#1F4A10] bg-[#F6FAF0]" : "text-gray-400 hover:text-[#1F4A10]"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Monthly Revenue Chart */}
              {tab === "overview" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">بيانات تقديرية للإيرادات الشهرية</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} ريال`, "الإيرادات"]} />
                      <Bar dataKey="إيرادات" fill="#679632" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      { label: "العمولة (15%)", value: balance?.total_revenue != null ? `${(balance.total_revenue * 0.15).toLocaleString()} ريال` : "—", color: "#1F4A10" },
                      { label: "ضريبة القيمة المضافة (15%)", value: balance?.total_revenue != null ? `${(balance.total_revenue * 0.15).toLocaleString()} ريال` : "—", color: "#679632" },
                      { label: "صافي الأرباح", value: balance?.total_revenue != null ? `${(balance.total_revenue * 0.70).toLocaleString()} ريال` : "—", color: "#2563eb" },
                    ].map((s) => (
                      <div key={s.label} className="bg-[#F6FAF0] rounded-2xl p-4 text-center">
                        <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                        <p className="font-heading font-black text-sm" style={{ color: s.color }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Drivers Balances */}
              {tab === "drivers" && (
                <div className="space-y-3">
                  {drivers.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-bold">لا توجد بيانات سائقين</p>
                    </div>
                  ) : (
                    drivers.map((d) => (
                      <div key={d.uuid} className="flex items-center justify-between p-4 bg-[#F6FAF0] rounded-2xl border border-[#D4EDA8]/50 hover:border-[#D4EDA8] transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
                            <span className="font-black text-[#1F4A10] text-sm">{d.name[0]}</span>
                          </div>
                          <div>
                            <p className="font-bold text-[#1F4A10]">{d.name}</p>
                            <p className="text-xs text-gray-500">{d.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-left">
                            <p className={`font-heading font-black text-lg ${d.balance > 0 ? "text-green-600" : "text-gray-400"}`}>
                              {d.balance.toLocaleString()} ريال
                            </p>
                            <p className="text-xs text-gray-400 text-left">الرصيد المستحق</p>
                          </div>
                          {d.balance > 0 && (
                            <button onClick={() => setPayDriver(d)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1F4A10] text-white text-xs font-bold hover:bg-[#2A5A14] transition-colors">
                              <Banknote className="w-3.5 h-3.5" /> دفع
                            </button>
                          )}
                          {d.balance === 0 && (
                            <span className="flex items-center gap-1 px-3 py-2 rounded-xl bg-green-50 text-green-600 text-xs font-bold">
                              <CheckCircle className="w-3.5 h-3.5" /> مسدّد
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {driversWithBalance.length > 0 && (
                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-amber-800 text-sm">{driversWithBalance.length} سائق لديهم مستحقات</p>
                        <p className="text-xs text-amber-600">إجمالي: {driversWithBalance.reduce((s, d) => s + d.balance, 0).toLocaleString()} ريال</p>
                      </div>
                      <Clock className="w-6 h-6 text-amber-500" />
                    </div>
                  )}
                </div>
              )}

              {/* Payment Methods */}
              {tab === "methods" && (
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <ResponsiveContainer width={220} height={220}>
                    <PieChart>
                      <Pie data={paymentMethods} cx="50%" cy="50%" outerRadius={85} dataKey="value" nameKey="name">
                        {paymentMethods.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-3 w-full">
                    {paymentMethods.map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-sm text-[#1F4A10] font-bold flex-1">{m.name}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                          <div className="h-2.5 rounded-full transition-all" style={{ width: `${m.value}%`, background: COLORS[i % COLORS.length] }} />
                        </div>
                        <span className="text-sm font-black text-[#1F4A10] w-12 text-left">{m.value}%</span>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 pt-2 text-center">* بيانات تقريبية لتوزيع طرق الدفع</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
