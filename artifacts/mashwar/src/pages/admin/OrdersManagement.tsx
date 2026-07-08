import { useState, useEffect } from "react";
import { getOrders, showOrder, driverPayment, getImageUrl, type Order } from "@/lib/meshwarApi";
import {
  Package, RefreshCw, Search, X, Eye, DollarSign, MapPin,
  Phone, Star, Car, User, Clock, CheckCircle, XCircle,
  Calendar, CreditCard, Truck, AlertCircle, Smartphone, Apple,
  Route as RouteIcon, Navigation, ReceiptText, Map as MapIcon,
  Briefcase, ArrowDownUp, CheckCircle2, ChevronLeft, CalendarClock, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_TABS = [
  { key: undefined, label: "جميع الطلبات",    color: "#1F4A10", bg: "#F6FAF0",  border: "border-[#D4EDA8]", icon: Package },
  { key: 1,        label: "طلبات معلّقة",   color: "#d97706", bg: "#fffbeb",  border: "border-amber-200", icon: Clock },
  { key: 2,        label: "رحلات نشطة",     color: "#0284c7", bg: "#f0f9ff",  border: "border-sky-200", icon: Navigation },
  { key: 3,        label: "رحلات مكتملة",   color: "#16a34a", bg: "#f0fdf4",  border: "border-green-200", icon: CheckCircle2 },
  { key: 4,        label: "طلبات ملغاة",    color: "#dc2626", bg: "#fef2f2",  border: "border-red-200", icon: XCircle },
] as const;

const STATUS_LABELS: Record<string, { label: string; cls: string; icon: any }> = {
  pending:   { label: "معلّقة",  cls: "bg-amber-100 text-amber-700", icon: Clock },
  active:    { label: "نشطة",    cls: "bg-sky-100 text-sky-700", icon: Navigation },
  completed: { label: "مكتملة", cls: "bg-green-100 text-green-700", icon: CheckCircle2 },
  cancelled: { label: "ملغاة",  cls: "bg-red-100 text-red-600", icon: XCircle },
  accepted:  { label: "مقبولة", cls: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
};

const PAYMENT_ICONS: Record<string, string> = {
  cash: "💵 كاش", card: "💳 بطاقة", wallet: "👛 محفظة", online: "🌐 أونلاين",
};

function StatusBadge({ status }: { status?: string }) {
  const s = STATUS_LABELS[status ?? ""] ?? { label: status ?? "—", cls: "bg-gray-100 text-gray-500", icon: Package };
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${s.cls}`}>
      <Icon className="w-3 h-3" /> {s.label}
    </span>
  );
}

function Avatar({ name, size = 10, colorClass = "" }: { name?: string; size?: number; colorClass?: string }) {
  const px = size * 4;
  const gradient = colorClass.includes("blue")
    ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
    : "linear-gradient(135deg, #5aa526 0%, #1F4A10 100%)";
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-md`}
      style={{ background: gradient }}
    >
      <span className="font-black text-white select-none" style={{ fontSize: `${px * 0.42}px`, lineHeight: 1 }}>{(name ?? "?")[0]}</span>
    </div>
  );
}

function PayModal({ order, onClose, onPay }: {
  order: Order; onClose: () => void;
  onPay: (uuid: string, amount: number) => Promise<void>;
}) {
  const [amount, setAmount] = useState<number | "">(order.price ?? "");
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) { setErr("المبلغ مطلوب"); return; }
    setPaying(true);
    try { await onPay(order.uuid, Number(amount)); setDone(true); setTimeout(onClose, 1800); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setPaying(false); }
  };
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <motion.form initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4 border border-gray-100" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10] flex items-center gap-2"><DollarSign className="w-5 h-5 text-[#679632]"/> تسجيل دفعة للسائق</h3>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="bg-[#F6FAF0] rounded-xl p-4 text-xs text-gray-600 border border-[#D4EDA8]">
          <p className="flex justify-between mb-1"><span>رقم الطلب:</span> <span className="font-mono font-bold text-[#1F4A10]">#{order.uuid.slice(0, 8)}</span></p>
          <p className="flex justify-between mb-1"><span>السائق:</span> <span className="font-bold text-[#1F4A10]">{order.driver?.name ?? "—"}</span></p>
          <p className="flex justify-between"><span>إجمالي الرحلة:</span> <span className="font-bold text-[#1F4A10]">{order.price} ريال</span></p>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">المبلغ المراد تسجيله (ريال)</label>
          <input type="number" min={0} value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full px-4 py-4 rounded-xl bg-gray-50 border border-gray-200 text-2xl font-heading font-black text-[#1F4A10] outline-none focus:border-[#679632] focus:ring-2 focus:ring-[#D4EDA8] text-center transition-all" />
        </div>
        {err && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg">{err}</p>}
        {done && <p className="text-green-600 text-sm font-bold text-center bg-green-50 p-3 rounded-xl border border-green-200">✅ تمت العملية بنجاح!</p>}
        <button type="submit" disabled={paying}
          className="w-full py-3.5 rounded-xl bg-[#1F4A10] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-[#2A5A14] transition-colors shadow-lg shadow-[#1F4A10]/20 active:scale-[0.98]">
          <DollarSign className="w-5 h-5" /> {paying ? "جاري المعالجة..." : "تأكيد الدفع"}
        </button>
      </motion.form>
    </div>
  );
}

function OrderFullModal({ uuid, onClose, onPay }: {
  uuid: string; onClose: () => void;
  onPay: (uuid: string, amount: number) => Promise<void>;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPay, setShowPay] = useState(false);
  const [tab, setTab] = useState<"info" | "parties" | "finance">("info");

  useEffect(() => {
    showOrder(uuid).then((r) => setOrder(r.data)).finally(() => setLoading(false));
  }, [uuid]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
          
          {loading ? (
            <div className="flex justify-center items-center h-64"><div className="w-10 h-10 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" /></div>
          ) : order ? (
            <>
              {/* Premium Header */}
              <div className={`p-6 sm:p-8 relative overflow-hidden ${
                order.status === "completed" ? "bg-gradient-to-l from-green-700 to-green-600" :
                order.status === "cancelled" ? "bg-gradient-to-l from-red-700 to-red-600" :
                order.status === "active" ? "bg-gradient-to-l from-sky-700 to-sky-600" :
                "bg-gradient-to-l from-[#1F4A10] to-[#2A6A14]"
              }`}>
                {/* Decorative background elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-[20px] border-white"></div>
                  <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full border-[10px] border-white"></div>
                </div>
                
                <div className="relative flex items-start justify-between z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <StatusBadge status={order.status} />
                      <span className="text-white/60 text-sm font-mono font-bold tracking-widest bg-black/20 px-2 py-0.5 rounded-lg">#{order.uuid.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex items-end gap-3">
                      <p className="text-white text-4xl sm:text-5xl font-heading font-black drop-shadow-md">
                        {order.price ? `${order.price}` : "0"} <span className="text-xl text-white/80">ريال</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-white/80 text-sm font-bold">
                      {order.distance && <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-xl"><RouteIcon className="w-4 h-4" /> {order.distance} كم</span>}
                      {order.created_at && <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-xl"><CalendarClock className="w-4 h-4" /> {new Date(order.created_at).toLocaleString("ar-SA")}</span>}
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors backdrop-blur-sm"><X className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 px-6 bg-gray-50/50">
                {[
                  { id: "info", label: "تفاصيل الرحلة", icon: MapIcon },
                  { id: "parties", label: "العميل والسائق", icon: User },
                  { id: "finance", label: "المعاملات المالية", icon: ReceiptText },
                ].map((t) => (
                  <button key={t.id} onClick={() => setTab(t.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all ${
                      tab === t.id ? "border-[#679632] text-[#1F4A10] bg-white" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}>
                    <t.icon className={`w-4 h-4 ${tab === t.id ? "text-[#679632]" : ""}`} /> {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white">
                <AnimatePresence mode="wait">
                  
                  {tab === "info" && (
                    <motion.div key="info" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      
                      {/* Map & Route Placeholder */}
                      <div className="bg-[#F6FAF0] rounded-2xl p-6 border border-[#D4EDA8] relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-white/40 to-transparent pointer-events-none"></div>
                        <h4 className="text-[#1F4A10] font-black text-lg mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#679632]"/> مسار الرحلة الجغرافي</h4>
                        
                        <div className="flex gap-6 relative z-10">
                          <div className="flex flex-col items-center gap-1 pt-1.5">
                            <div className="w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100 shadow-sm z-10" />
                            <div className="w-1 flex-1 bg-gradient-to-b from-green-300 via-gray-300 to-red-300 my-1 rounded-full" />
                            <div className="w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-100 shadow-sm z-10" />
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-green-200 transition-colors">
                              <p className="text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wider">نقطة الانطلاق</p>
                              <p className="font-bold text-[#1F4A10] text-base leading-relaxed">{order.from_address ?? "غير محدد"}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-red-200 transition-colors">
                              <p className="text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wider">نقطة الوصول</p>
                              <p className="font-bold text-[#1F4A10] text-base leading-relaxed">{order.to_address ?? "غير محدد"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive map placeholder */}
                        <div className="mt-6 w-full h-32 bg-blue-50/50 rounded-xl border-2 border-dashed border-blue-200 flex items-center justify-center relative overflow-hidden">
                          <MapIcon className="w-10 h-10 text-blue-200 absolute opacity-50" />
                          <p className="text-blue-600/70 font-bold text-sm relative z-10 bg-white/80 px-4 py-2 rounded-lg">خريطة المسار التفاعلية</p>
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div>
                        <h4 className="text-gray-800 font-bold text-sm mb-3 flex items-center gap-2"><Car className="w-4 h-4 text-gray-400"/> بيانات المركبة المطلوبة</h4>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                          {order.car_type?.icon ? (
                            <img src={getImageUrl(order.car_type.icon)} className="w-16 h-16 rounded-xl object-cover bg-white p-1 border border-gray-200 shadow-sm" />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                              <Car className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-black text-lg text-gray-800">{order.car_type?.name ?? "غير محدد"}</p>
                            <div className="flex gap-4 mt-2">
                              {order.car_type?.max_weight && <p className="text-xs text-gray-500 font-bold bg-white px-2 py-1 rounded-md border border-gray-200">حمولة: {order.car_type.max_weight} كغ</p>}
                              {order.car_type?.base_price && <p className="text-xs text-gray-500 font-bold bg-white px-2 py-1 rounded-md border border-gray-200">سعر أساسي: {order.car_type.base_price} ر.س</p>}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {order.note && (
                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-sm">
                          <p className="text-xs font-black text-amber-800 mb-2 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" /> ملاحظة العميل
                          </p>
                          <p className="text-sm text-amber-900 leading-relaxed bg-white/50 p-3 rounded-xl border border-amber-100">{order.note}</p>
                        </div>
                      )}

                    </motion.div>
                  )}

                  {tab === "parties" && (
                    <motion.div key="parties" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* Customer Card */}
                        <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-blue-800 font-black text-lg flex items-center gap-2">
                              <User className="w-5 h-5 bg-blue-200 text-blue-700 p-1 rounded-lg" /> العميل
                            </h4>
                            <span className="bg-white border border-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-lg">طالب الرحلة</span>
                          </div>
                          
                          {order.user ? (
                            <div className="space-y-5 relative z-10">
                              <div className="flex items-center gap-4">
                                <Avatar name={order.user.name} size={14} colorClass="bg-blue-600 text-white" />
                                <div>
                                  <p className="font-black text-blue-950 text-xl">{order.user.name}</p>
                                  <p className="text-sm text-blue-600/80 font-mono mt-0.5">{order.user.phone}</p>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <span className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-2 rounded-xl flex-1 border border-emerald-200">
                                  <Smartphone className="w-4 h-4" /> أندرويد
                                </span>
                                <span className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 bg-white px-3 py-2 rounded-xl flex-1 border border-gray-200 opacity-50 grayscale">
                                  <Apple className="w-4 h-4" /> iOS
                                </span>
                              </div>

                              <a href={`tel:${order.user.phone}`}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-blue-200 text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                                <Phone className="w-4 h-4" /> الاتصال بالعميل
                              </a>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-10 opacity-50">
                              <User className="w-12 h-12 text-blue-200 mb-2" />
                              <p className="font-bold text-blue-400 text-sm">بيانات العميل غير متوفرة</p>
                            </div>
                          )}
                        </div>

                        {/* Driver Card */}
                        <div className="bg-green-50/50 rounded-3xl p-6 border border-green-100 shadow-sm relative overflow-hidden group hover:border-green-300 transition-all">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-green-800 font-black text-lg flex items-center gap-2">
                              <Truck className="w-5 h-5 bg-green-200 text-green-700 p-1 rounded-lg" /> السائق
                            </h4>
                            <span className="bg-white border border-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded-lg">منفذ الرحلة</span>
                          </div>
                          
                          {order.driver ? (
                            <div className="space-y-5 relative z-10">
                              <div className="flex items-center gap-4">
                                <Avatar name={order.driver.name} size={14} colorClass="bg-[#1F4A10] text-white" />
                                <div>
                                  <p className="font-black text-[#1F4A10] text-xl">{order.driver.name}</p>
                                  <p className="text-sm text-[#679632] font-mono mt-0.5">{order.driver.phone}</p>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <span className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-2 rounded-xl flex-1 border border-emerald-200">
                                  <Smartphone className="w-4 h-4" /> أندرويد
                                </span>
                                <span className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 bg-white px-3 py-2 rounded-xl flex-1 border border-gray-200 opacity-50 grayscale">
                                  <Apple className="w-4 h-4" /> iOS
                                </span>
                              </div>

                              <a href={`tel:${order.driver.phone}`}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-green-200 text-green-700 font-bold text-sm rounded-xl hover:bg-green-50 transition-colors shadow-sm">
                                <Phone className="w-4 h-4" /> الاتصال بالسائق
                              </a>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-10 h-[220px]">
                              <Truck className="w-12 h-12 text-green-200 mb-3 opacity-50" />
                              <p className="font-bold text-green-700 text-base bg-green-100 px-4 py-2 rounded-xl">لم يُسند الطلب لسائق بعد</p>
                              <p className="text-xs text-green-600/60 mt-2 text-center">الطلب مازال في قائمة الانتظار للموافقة.</p>
                            </div>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {tab === "finance" && (
                    <motion.div key="finance" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                          <p className="text-xs font-bold text-gray-500 mb-2">إجمالي تكلفة الرحلة</p>
                          <p className="font-heading font-black text-3xl text-[#1F4A10]">{order.price ?? "0"} <span className="text-sm font-normal text-gray-500">ر.س</span></p>
                        </div>
                        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 text-center">
                          <p className="text-xs font-bold text-amber-700 mb-2">عمولة التطبيق (20%)</p>
                          <p className="font-heading font-black text-3xl text-amber-600">{((order.price ?? 0) * 0.2).toFixed(2)} <span className="text-sm font-normal text-amber-700/60">ر.س</span></p>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-5 border border-green-100 text-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-10 h-10 bg-green-200 rounded-bl-full"></div>
                          <p className="text-xs font-bold text-green-700 mb-2">صافي مستحقات السائق</p>
                          <p className="font-heading font-black text-3xl text-green-700">{((order.price ?? 0) * 0.8).toFixed(2)} <span className="text-sm font-normal text-green-700/60">ر.س</span></p>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
                        <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                          <h4 className="font-bold text-gray-800 flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-500"/> تفاصيل المعاملة</h4>
                        </div>
                        <div className="p-5 space-y-4">
                          <div className="flex items-center justify-between py-3 border-b border-dashed border-gray-200">
                            <span className="text-sm font-bold text-gray-500">طريقة الدفع</span>
                            <span className="text-base font-black text-[#1F4A10] bg-[#F6FAF0] px-4 py-1.5 rounded-lg border border-[#D4EDA8]">
                              {PAYMENT_ICONS[order.payment_method ?? ""] ?? "💰 غير محدد"} 
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-dashed border-gray-200">
                            <span className="text-sm font-bold text-gray-500">حالة الدفع</span>
                            {order.status === "completed" ? (
                              <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-lg flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> مدفوعة</span>
                            ) : (
                              <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-lg flex items-center gap-1"><Clock className="w-4 h-4"/> معلقة</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between py-3">
                            <span className="text-sm font-bold text-gray-500">معرف المعاملة المرجعي</span>
                            <span className="text-sm font-mono font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-md">TRX-{order.uuid.slice(0, 10).toUpperCase()}</span>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
                {order.status === "completed" && (
                  <button onClick={() => setShowPay(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] transition-colors shadow-lg shadow-[#1F4A10]/20 active:scale-[0.98]">
                    <DollarSign className="w-5 h-5" /> تسجيل دفعة يدوية للسائق
                  </button>
                )}
                <button onClick={onClose}
                  className="px-6 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-colors active:scale-[0.98] flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4"/> العودة للقائمة
                </button>
              </div>
            </>
          ) : null}
        </motion.div>
      </div>
      {showPay && order && (
        <PayModal order={order} onClose={() => setShowPay(false)} onPay={onPay} />
      )}
    </>
  );
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [toast, setToast] = useState({ msg: "", ok: true });

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok }); setTimeout(() => setToast({ msg: "", ok: true }), 3000);
  };

  const load = (type?: number) => {
    setLoading(true); setError("");
    getOrders(type).then((r) => setOrders(r.data ?? [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(activeTab); }, [activeTab]);

  const handlePay = async (uuid: string, amount: number) => {
    await driverPayment({ uuid, amount });
    showToast("✅ تم تسجيل الدفعة بنجاح");
    load(activeTab);
  };

  const filtered = orders.filter((o) =>
    !search || o.user?.name?.includes(search) || o.driver?.name?.includes(search) ||
    o.from_address?.includes(search) || o.uuid.includes(search)
  );

  const totalRevenue = filtered.filter((o) => o.status === "completed").reduce((sum, o) => sum + (o.price ?? 0), 0);

  return (
    <div className="space-y-6" dir="rtl">
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
          <h2 className="text-3xl font-heading font-black text-[#1F4A10]">إدارة الطلبات والرحلات</h2>
          <p className="text-sm text-gray-500 mt-1">متابعة دقيقة لجميع العمليات والرحلات في النظام</p>
        </div>
        <div className="flex gap-2">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold text-gray-600">نشطة الآن: {orders.filter(o => o.status === 'active').length}</span>
          </div>
          <button onClick={() => load(activeTab)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-[#1F4A10] text-sm font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
            <RefreshCw className="w-4 h-4" /> تحديث البيانات
          </button>
        </div>
      </div>

      {/* Modern Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUS_TABS.map((t) => {
          const count = activeTab === t.key ? filtered.length : orders.filter(o => t.key === undefined ? true : 
             (t.key === 1 && o.status === 'pending') || 
             (t.key === 2 && o.status === 'active') || 
             (t.key === 3 && o.status === 'completed') || 
             (t.key === 4 && o.status === 'cancelled')
          ).length;
          
          return (
            <button key={String(t.key)} onClick={() => setActiveTab(t.key)}
              className={`rounded-2xl p-4 text-right transition-all flex flex-col justify-between h-[110px] border ${
                activeTab === t.key ? `${t.bg} ${t.border} shadow-md ring-2 ring-offset-2 ring-opacity-50` : "bg-white border-gray-100 hover:shadow-sm hover:border-gray-300"
              }`}
              style={activeTab === t.key ? { "--tw-ring-color": t.color } as React.CSSProperties : {}}>
              <div className="flex items-center justify-between w-full">
                <div className={`p-2 rounded-xl ${activeTab === t.key ? "bg-white/60" : "bg-gray-50"}`}>
                  <t.icon className="w-5 h-5" style={{ color: t.color }} />
                </div>
                {t.key === 2 && count > 0 && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
              </div>
              <div>
                <p className="text-2xl font-heading font-black leading-none mt-2" style={{ color: t.color }}>{count}</p>
                <p className="text-[11px] font-bold text-gray-500 mt-1">{t.label}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Revenue & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-gray-50 border-none text-base outline-none focus:ring-2 focus:ring-[#D4EDA8] transition-all"
              placeholder="البحث برقم الطلب، اسم العميل، اسم السائق، أو العنوان..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch("")} className="absolute left-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"><X className="w-4 h-4 text-gray-500" /></button>}
          </div>
        </div>
        
        {totalRevenue > 0 && (
          <div className="bg-gradient-to-l from-[#1F4A10] to-[#2A6A14] rounded-2xl p-4 flex items-center justify-between gap-6 shadow-md border border-[#D4EDA8]/20 min-w-[250px] relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div>
              <p className="text-white/70 text-xs font-bold mb-0.5">إجمالي قيمة الرحلات (المكتملة)</p>
              <p className="text-white font-heading font-black text-2xl drop-shadow-md">{totalRevenue.toLocaleString("ar-SA")} <span className="text-sm font-normal">ر.س</span></p>
            </div>
            <div className="w-12 h-12 bg-[#D4EDA8] rounded-xl flex items-center justify-center rotate-12 shadow-inner">
              <DollarSign className="w-6 h-6 text-[#1F4A10]" />
            </div>
          </div>
        )}
      </div>

      {/* Premium Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-32 bg-white rounded-2xl border border-gray-100"><div className="w-12 h-12 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" /></div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-red-100 flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-200 mb-4" />
            <p className="text-red-500 font-bold text-xl">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-24 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <Package className="w-20 h-20 text-gray-200 mb-6" />
            <p className="font-bold text-xl text-gray-500">لا توجد طلبات لعرضها حالياً</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {filtered.map((o) => (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  key={o.uuid} onClick={() => setSelectedUuid(o.uuid)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#D4EDA8] transition-all cursor-pointer overflow-hidden group">
                  
                  <div className="flex flex-col lg:flex-row">
                    {/* Status Strip */}
                    <div className={`w-full lg:w-2 ${
                      o.status === "completed" ? "bg-green-500" :
                      o.status === "cancelled" ? "bg-red-500" :
                      o.status === "active" ? "bg-blue-500" :
                      "bg-amber-400"
                    }`}></div>
                    
                    <div className="flex-1 p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
                      
                      {/* ID & Date */}
                      <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                          <StatusBadge status={o.status} />
                          <span className="text-xs font-mono font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">#{o.uuid.slice(0,6)}</span>
                        </div>
                        <p className="text-xs text-gray-500 font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> {o.created_at ? new Date(o.created_at).toLocaleDateString("ar-SA") : "—"}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 pr-5">{o.created_at ? new Date(o.created_at).toLocaleTimeString("ar-SA") : "—"}</p>
                      </div>

                      {/* Route */}
                      <div className="col-span-1 lg:col-span-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center gap-1 pt-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            <div className="w-0.5 h-6 bg-gray-300 rounded-full" />
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          </div>
                          <div className="flex-1 space-y-2 min-w-0">
                            <p className="text-xs font-bold text-gray-700 truncate" title={o.from_address ?? ""}>{o.from_address ?? "غير محدد"}</p>
                            <p className="text-xs font-bold text-gray-700 truncate" title={o.to_address ?? ""}>{o.to_address ?? "غير محدد"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Parties */}
                      <div className="col-span-1 lg:col-span-1 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar name={o.user?.name} size={6} colorClass="bg-blue-100 text-blue-700" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] text-gray-400 leading-none mb-0.5">العميل</p>
                            <p className="text-xs font-bold text-gray-800 truncate">{o.user?.name ?? "غير متوفر"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar name={o.driver?.name} size={6} colorClass="bg-green-100 text-green-700" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] text-gray-400 leading-none mb-0.5">السائق</p>
                            <p className="text-xs font-bold text-gray-800 truncate">{o.driver?.name ?? "لم يُسند"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Financials & Action */}
                      <div className="col-span-1 lg:col-span-1 flex items-center justify-between lg:justify-end gap-4 lg:flex-col lg:items-end lg:border-r border-gray-100 lg:pr-6">
                        <div className="text-right">
                          <p className="font-heading font-black text-xl text-[#1F4A10] leading-none">{o.price ?? "0"} <span className="text-xs font-normal">ر.س</span></p>
                          <p className="text-[11px] font-bold text-gray-500 mt-1">{PAYMENT_ICONS[o.payment_method ?? ""] ?? "💰 غير محدد"}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#F6FAF0] text-[#679632] flex items-center justify-center group-hover:bg-[#1F4A10] group-hover:text-white transition-colors border border-[#D4EDA8]">
                          <ArrowLeft className="w-5 h-5" />
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedUuid && (
          <OrderFullModal uuid={selectedUuid} onClose={() => setSelectedUuid(null)} onPay={handlePay} />
        )}
      </AnimatePresence>
    </div>
  );
}
