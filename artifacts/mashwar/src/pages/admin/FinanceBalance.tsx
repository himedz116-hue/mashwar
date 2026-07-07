import { useState, useEffect } from "react";
import { getBalance, driverPayment, type BalanceData } from "@/lib/meshwarApi";
import { Wallet, RefreshCw, TrendingUp, Users, Clock, DollarSign, XCircle, CheckCircle } from "lucide-react";

export default function FinanceBalance() {
  const [data, setData] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payUuid, setPayUuid] = useState("");
  const [payAmt, setPayAmt] = useState("");
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState("");

  const load = () => {
    setLoading(true); setError("");
    getBalance()
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handlePay = async (uuid: string, amount?: number) => {
    const finalAmount = amount ?? Number(payAmt);
    if (!uuid || !finalAmount) return;
    setPaying(true);
    try {
      await driverPayment({ uuid, amount: finalAmount });
      setToast("✅ تم تسجيل الدفعة بنجاح");
      setPayUuid(""); setPayAmt("");
      setTimeout(() => setToast(""), 3000);
      load();
    } catch (e: unknown) {
      setToast("خطأ: " + (e instanceof Error ? e.message : String(e)));
      setTimeout(() => setToast(""), 4000);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F4A10] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold">{toast}</div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">الشؤون المالية والرصيد</h2>
          <p className="text-sm text-gray-500 mt-0.5">متابعة الإيرادات وأرصدة السائقين والمدفوعات</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors">
          <RefreshCw className="w-4 h-4" /> تحديث
        </button>
      </div>

      {loading && <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>}

      {error && (
        <div className="bg-red-50 rounded-2xl p-6 text-center">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
          <p className="text-red-600 font-bold">{error}</p>
          <button onClick={load} className="mt-3 text-sm text-red-500 underline">إعادة المحاولة</button>
        </div>
      )}

      {data && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "إجمالي الإيرادات", value: data.total_revenue != null ? `${data.total_revenue.toLocaleString()} ريال` : "—", icon: TrendingUp, color: "#1F4A10", bg: "#D4EDA8" },
              { label: "أرصدة السائقين", value: data.total_drivers_balance != null ? `${data.total_drivers_balance.toLocaleString()} ريال` : "—", icon: Users, color: "#679632", bg: "#D4EDA8" },
              { label: "إجمالي الطلبات", value: data.total_orders?.toLocaleString() ?? "—", icon: DollarSign, color: "#2563eb", bg: "#dbeafe" },
              { label: "مدفوعات معلقة", value: data.pending_payments?.toLocaleString() ?? "—", icon: Clock, color: "#d97706", bg: "#fef3c7" },
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

          {/* Manual Payment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-heading font-black text-[#1F4A10] mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#679632]" /> تسجيل دفعة يدوية
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={payUuid} onChange={(e) => setPayUuid(e.target.value)}
                placeholder="UUID الطلب أو السائق"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
              />
              <input
                type="number" value={payAmt} onChange={(e) => setPayAmt(e.target.value)}
                placeholder="المبلغ (ريال)"
                className="w-40 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
              />
              <button onClick={() => handlePay(payUuid)} disabled={paying || !payUuid || !payAmt}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] disabled:opacity-50 transition-colors">
                <CheckCircle className="w-4 h-4" /> {paying ? "جاري التسجيل..." : "تسجيل"}
              </button>
            </div>
          </div>

          {/* Drivers Balances */}
          {data.drivers && data.drivers.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-heading font-black text-[#1F4A10] flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#679632]" /> أرصدة السائقين
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F6FAF0]">
                    <tr>
                      {["السائق", "الهاتف", "الرصيد", ""].map((h) => (
                        <th key={h} className="text-right py-3 px-4 text-xs font-bold text-[#1F4A10]/60">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.drivers.map((d) => (
                      <tr key={d.uuid} className="hover:bg-[#F6FAF0]/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-[#D4EDA8] flex items-center justify-center flex-shrink-0">
                              <span className="font-black text-[#1F4A10] text-xs">{d.name?.[0]}</span>
                            </div>
                            <span className="font-bold text-[#1F4A10]">{d.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{d.phone}</td>
                        <td className="py-3 px-4">
                          <span className={`font-heading font-black ${d.balance > 0 ? "text-green-600" : "text-gray-400"}`}>
                            {d.balance?.toLocaleString() ?? 0} ريال
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button onClick={() => handlePay(d.uuid, d.balance)}
                            className="px-3 py-1.5 rounded-lg bg-[#F6FAF0] text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors text-xs font-bold">
                            دفع الرصيد
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && !error && !data && (
        <div className="text-center py-20 text-gray-400">
          <Wallet className="w-14 h-14 mx-auto mb-4 opacity-20" />
          <p className="font-bold">لا توجد بيانات مالية</p>
        </div>
      )}
    </div>
  );
}
