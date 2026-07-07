import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DollarSign, TrendingUp, Wallet, CheckCircle, XCircle, Clock } from "lucide-react";

const transactions = [
  { id: "TX-5501", customer: "محمد الأحمد", amount: 85, method: "مدى", trip: "T-0998", date: "2024-07-06 13:42", status: "success" },
  { id: "TX-5502", customer: "نورة الزهراني", amount: 420, method: "آبل باي", trip: "T-0999", date: "2024-07-06 12:10", status: "success" },
  { id: "TX-5503", customer: "فهد العتيبي", amount: 210, method: "فيزا", trip: "T-1000", date: "2024-07-06 11:30", status: "success" },
  { id: "TX-5504", customer: "ريم الدوسري", amount: 70, method: "محفظة", trip: "T-1001", date: "2024-07-05 18:05", status: "refunded" },
  { id: "TX-5505", customer: "عبدالرحمن الشمري", amount: 340, method: "مدى", trip: "T-1002", date: "2024-07-05 16:00", status: "success" },
  { id: "TX-5506", customer: "سارة المطيري", amount: 90, method: "نقدي", trip: "T-1003", date: "2024-07-05 14:20", status: "pending" },
];

const payouts = [
  { id: "PO-201", driver: "خالد القحطاني", amount: 3200, bank: "مصرف الراجحي", iban: "SA•••••1234", requestedAt: "2024-07-06", status: "pending" },
  { id: "PO-202", driver: "عمر البقمي", amount: 5400, bank: "البنك الأهلي", iban: "SA•••••5678", requestedAt: "2024-07-05", status: "done" },
  { id: "PO-203", driver: "سليمان الغامدي", amount: 1800, bank: "بنك الرياض", iban: "SA•••••9012", requestedAt: "2024-07-04", status: "rejected" },
  { id: "PO-204", driver: "إبراهيم الحربي", amount: 2750, bank: "مصرف الراجحي", iban: "SA•••••3456", requestedAt: "2024-07-04", status: "pending" },
];

const paymentMethods = [
  { name: "مدى", value: 42 },
  { name: "آبل باي", value: 25 },
  { name: "فيزا", value: 18 },
  { name: "محفظة", value: 10 },
  { name: "نقدي", value: 5 },
];

const COLORS = ["#1F4A10", "#679632", "#D4EDA8", "#F59E0B", "#3B82F6"];

const txStatus = (s: string) => {
  const map: Record<string, { label: string; cls: string }> = {
    success: { label: "ناجحة", cls: "bg-green-100 text-green-700" },
    refunded: { label: "مُستردة", cls: "bg-blue-100 text-blue-600" },
    pending: { label: "معلقة", cls: "bg-amber-100 text-amber-700" },
  };
  const m = map[s] || { label: s, cls: "bg-gray-100 text-gray-500" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${m.cls}`}>{m.label}</span>;
};

const payoutStatus = (s: string) => {
  const map: Record<string, { label: string; icon: typeof Clock; cls: string }> = {
    pending: { label: "معلق", icon: Clock, cls: "bg-amber-100 text-amber-700" },
    done: { label: "تم التحويل", icon: CheckCircle, cls: "bg-green-100 text-green-700" },
    rejected: { label: "مرفوض", icon: XCircle, cls: "bg-red-100 text-red-500" },
  };
  const m = map[s];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${m.cls}`}>
      <m.icon className="w-3 h-3" />{m.label}
    </span>
  );
};

export default function FinancialManagement() {
  const [commission, setCommission] = useState("15");
  const [vat, setVat] = useState("15");
  const [tab, setTab] = useState<"transactions" | "payouts" | "settings">("transactions");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة الشؤون المالية</h2>
        <p className="text-[#4A5568]/60 text-sm mt-1">مراقبة التدفقات النقدية والعمولات وطلبات السحب</p>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "إيرادات اليوم", value: "4,820 ريال", icon: DollarSign, color: "#1F4A10", bg: "#D4EDA8" },
          { label: "إيرادات الشهر", value: "34,500 ريال", icon: TrendingUp, color: "#679632", bg: "#D4EDA8" },
          { label: "عمولات الشهر", value: "5,175 ريال", icon: DollarSign, color: "#F59E0B", bg: "#FEF3C7" },
          { label: "مستحقات سائقين", value: "12,150 ريال", icon: Wallet, color: "#3B82F6", bg: "#DBEAFE" },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: k.bg }}>
              <k.icon className="w-5 h-5" style={{ color: k.color }} />
            </div>
            <p className="text-lg font-heading font-black" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs text-[#4A5568]/60 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Payment methods chart */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-heading font-bold text-[#1F4A10] mb-4">توزيع طرق الدفع</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie data={paymentMethods} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                {paymentMethods.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2.5 w-full">
            {paymentMethods.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                <span className="text-sm text-[#4A5568] flex-1">{m.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${m.value}%`, background: COLORS[i] }} />
                </div>
                <span className="text-sm font-bold text-[#1F4A10] w-10 text-left">{m.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { key: "transactions", label: "سجل المعاملات" },
            { key: "payouts", label: "طلبات سحب الأرباح" },
            { key: "settings", label: "إعدادات العمولات" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                tab === t.key ? "text-[#1F4A10] border-b-2 border-[#1F4A10] bg-[#F6FAF0]" : "text-[#4A5568]/60 hover:text-[#1F4A10]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "transactions" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["رقم العملية", "العميل", "المبلغ", "طريقة الدفع", "الرحلة", "التاريخ", "الحالة"].map((h) => (
                      <th key={h} className="text-right py-2.5 px-3 text-[#4A5568]/60 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-50 hover:bg-[#F6FAF0] transition-colors">
                      <td className="py-3 px-3 font-mono text-xs font-bold text-[#679632]">{tx.id}</td>
                      <td className="py-3 px-3 font-medium text-[#1F4A10]">{tx.customer}</td>
                      <td className="py-3 px-3 font-bold text-[#1F4A10]">{tx.amount} ريال</td>
                      <td className="py-3 px-3"><span className="px-2 py-0.5 text-xs font-bold bg-[#F6FAF0] text-[#679632] rounded-lg">{tx.method}</span></td>
                      <td className="py-3 px-3 font-mono text-xs text-[#4A5568]">{tx.trip}</td>
                      <td className="py-3 px-3 text-[#4A5568]/70 text-xs">{tx.date}</td>
                      <td className="py-3 px-3">{txStatus(tx.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "payouts" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["رقم الطلب", "السائق", "المبلغ", "البنك", "IBAN", "تاريخ الطلب", "الحالة", "إجراء"].map((h) => (
                      <th key={h} className="text-right py-2.5 px-3 text-[#4A5568]/60 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-[#F6FAF0] transition-colors">
                      <td className="py-3 px-3 font-mono text-xs font-bold text-[#679632]">{p.id}</td>
                      <td className="py-3 px-3 font-medium text-[#1F4A10]">{p.driver}</td>
                      <td className="py-3 px-3 font-bold text-[#1F4A10]">{p.amount.toLocaleString()} ريال</td>
                      <td className="py-3 px-3 text-[#4A5568]">{p.bank}</td>
                      <td className="py-3 px-3 font-mono text-xs text-[#4A5568]">{p.iban}</td>
                      <td className="py-3 px-3 text-[#4A5568]/70 text-xs">{p.requestedAt}</td>
                      <td className="py-3 px-3">{payoutStatus(p.status)}</td>
                      <td className="py-3 px-3">
                        {p.status === "pending" && (
                          <div className="flex gap-1.5">
                            <button className="px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-bold hover:bg-green-200 transition-colors">تم</button>
                            <button className="px-2.5 py-1 rounded-lg bg-red-100 text-red-500 text-xs font-bold hover:bg-red-200 transition-colors">رفض</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "settings" && (
            <div className="max-w-sm space-y-5">
              <p className="text-sm text-[#4A5568]/70">تحديد النسب المطبقة على كل رحلة في التطبيق</p>
              <div>
                <label className="block text-sm font-bold text-[#1F4A10] mb-2">نسبة عمولة التطبيق (%)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    className="w-28 py-2.5 px-4 text-center text-lg font-black text-[#1F4A10] border-2 border-[#679632] rounded-xl outline-none focus:ring-2 focus:ring-[#679632]/20"
                    min={0} max={100}
                  />
                  <span className="text-2xl font-black text-[#679632]">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1F4A10] mb-2">ضريبة القيمة المضافة (VAT) (%)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}
                    className="w-28 py-2.5 px-4 text-center text-lg font-black text-[#1F4A10] border-2 border-[#679632] rounded-xl outline-none focus:ring-2 focus:ring-[#679632]/20"
                    min={0} max={100}
                  />
                  <span className="text-2xl font-black text-[#679632]">%</span>
                </div>
              </div>
              <button className="px-6 py-2.5 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] transition-colors">
                حفظ الإعدادات
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
