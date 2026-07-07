import { useState, useEffect } from "react";
import { getOrders, showOrder, driverPayment, type Order } from "@/lib/meshwarApi";
import {
  Route, RefreshCw, Search, ChevronDown, Eye, XCircle,
  MapPin, User, Car, Clock, CheckCircle, AlertCircle, DollarSign,
} from "lucide-react";

const statusMap: Record<number, { label: string; cls: string }> = {
  1: { label: "قيد الانتظار", cls: "bg-amber-100 text-amber-700" },
  2: { label: "نشط",         cls: "bg-blue-100 text-blue-700" },
  3: { label: "مكتمل",       cls: "bg-green-100 text-green-700" },
  4: { label: "ملغي",        cls: "bg-red-100 text-red-600" },
};

function Badge({ type }: { type?: number }) {
  const s = statusMap[type ?? 0] ?? { label: "—", cls: "bg-gray-100 text-gray-500" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${s.cls}`}>{s.label}</span>;
}

function OrderModal({ uuid, onClose }: { uuid: string; onClose: () => void }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [payAmt, setPayAmt] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    showOrder(uuid).then((r) => setOrder(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [uuid]);

  const handlePay = async () => {
    if (!order || !payAmt) return;
    setPaying(true);
    try {
      await driverPayment({ uuid: order.uuid, amount: Number(payAmt) });
      setMsg("✅ تم تسجيل الدفعة بنجاح");
      setPayAmt("");
    } catch (e: unknown) {
      setMsg("خطأ: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10]">تفاصيل الطلب</h3>
          <button onClick={onClose}><XCircle className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-5">
          {loading && <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>}
          {order && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-gray-400 truncate">{order.uuid}</p>
                <Badge type={order.type} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "السعر", value: order.price != null ? `${order.price} ريال` : "—", icon: DollarSign },
                  { label: "المسافة", value: order.distance != null ? `${order.distance} كم` : "—", icon: MapPin },
                  { label: "العميل", value: order.user?.name ?? "—", icon: User },
                  { label: "السائق", value: order.driver?.name ?? "—", icon: Car },
                  { label: "نوع السيارة", value: order.car_type?.name ?? "—", icon: Car },
                  { label: "طريقة الدفع", value: order.payment_method ?? "—", icon: DollarSign },
                ].map((r) => (
                  <div key={r.label} className="bg-[#F6FAF0] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <r.icon className="w-3.5 h-3.5 text-[#679632]" />
                      <p className="text-xs text-gray-400">{r.label}</p>
                    </div>
                    <p className="font-bold text-[#1F4A10] text-sm">{r.value}</p>
                  </div>
                ))}
              </div>
              {order.from_address && (
                <div className="space-y-2">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-blue-400 mb-1">من</p>
                    <p className="text-sm font-bold text-blue-700">{order.from_address}</p>
                  </div>
                  {order.to_address && (
                    <div className="bg-green-50 rounded-xl p-3">
                      <p className="text-xs text-green-400 mb-1">إلى</p>
                      <p className="text-sm font-bold text-green-700">{order.to_address}</p>
                    </div>
                  )}
                </div>
              )}
              {order.note && (
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-xs text-amber-400 mb-1">ملاحظة</p>
                  <p className="text-sm text-amber-800">{order.note}</p>
                </div>
              )}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-bold text-[#1F4A10] mb-2">تسجيل دفعة للسائق</p>
                <div className="flex gap-2">
                  <input
                    type="number" value={payAmt} onChange={(e) => setPayAmt(e.target.value)}
                    placeholder="المبلغ بالريال"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
                  />
                  <button onClick={handlePay} disabled={paying || !payAmt}
                    className="px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] disabled:opacity-50 transition-colors">
                    {paying ? "..." : "تسجيل"}
                  </button>
                </div>
                {msg && <p className="text-xs mt-2 text-green-600 font-bold">{msg}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  const load = (type?: number) => {
    setLoading(true); setError("");
    getOrders(type)
      .then((r) => setOrders(r.data ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(tab); }, [tab]);

  const filtered = orders.filter((o) =>
    !search || o.user?.name?.includes(search) || o.driver?.name?.includes(search) || o.uuid?.includes(search)
  );

  const tabs = [
    { label: "الكل", value: undefined, icon: Route },
    { label: "انتظار", value: 1, icon: Clock },
    { label: "نشطة", value: 2, icon: AlertCircle },
    { label: "مكتملة", value: 3, icon: CheckCircle },
    { label: "ملغاة", value: 4, icon: XCircle },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">الطلبات والرحلات</h2>
          <p className="text-sm text-gray-500 mt-0.5">متابعة جميع طلبات النقل في التطبيق</p>
        </div>
        <button onClick={() => load(tab)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors">
          <RefreshCw className="w-4 h-4" /> تحديث
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 overflow-x-auto">
        {tabs.map((t) => (
          <button key={String(t.value)} onClick={() => setTab(t.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === t.value ? "bg-[#1F4A10] text-white shadow" : "text-gray-500 hover:text-[#1F4A10]"}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
            placeholder="البحث باسم العميل أو السائق..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
        ) : error ? (
          <div className="text-center py-12">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
            <p className="text-red-500 font-bold">{error}</p>
            <button onClick={() => load(tab)} className="mt-2 text-sm text-[#679632] underline">إعادة المحاولة</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Route className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p>لا توجد طلبات</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F6FAF0]">
                <tr>
                  {["#", "العميل", "السائق", "السيارة", "السعر", "الحالة", "التاريخ", ""].map((h) => (
                    <th key={h} className="text-right py-3 px-4 text-xs font-bold text-[#1F4A10]/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((o, i) => (
                  <tr key={o.uuid} className="hover:bg-[#F6FAF0]/60 transition-colors">
                    <td className="py-3 px-4 text-gray-400 text-xs">{i + 1}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#1F4A10]">{o.user?.name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{o.user?.phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#1F4A10]">{o.driver?.name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{o.driver?.phone}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{o.car_type?.name ?? "—"}</td>
                    <td className="py-3 px-4 font-bold text-[#679632]">{o.price != null ? `${o.price} ريال` : "—"}</td>
                    <td className="py-3 px-4"><Badge type={o.type} /></td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {o.created_at ? new Date(o.created_at).toLocaleDateString("ar-SA") : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => setSelectedUuid(o.uuid)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6FAF0] text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors text-xs font-bold">
                        <Eye className="w-3.5 h-3.5" /> عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedUuid && <OrderModal uuid={selectedUuid} onClose={() => setSelectedUuid(null)} />}
    </div>
  );
}
