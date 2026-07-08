import { useState, useEffect } from "react";
import {
  getDrivers, showDriver, sendDriverNotification, acceptDriver,
  blockUser, getOrders, getImageUrl, lookupSaudiPlate,
  type Driver, type Order, type PlateLookupResult
} from "@/lib/meshwarApi";
import {
  Search, RefreshCw, Star, Phone, MapPin, Car, CheckCircle,
  XCircle, Clock, Eye, ChevronDown, Bell, Send, X, Shield,
  Ban, Smartphone, Apple, UserCheck, AlertTriangle, User,
  Calendar, CreditCard, ChevronRight, Activity, Navigation, Image as ImageIcon,
  ZoomIn, ExternalLink, FileText, Flag, Hash, Search as SearchIcon,
  Loader2, Info, FileCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function detectOS(device?: string, osVersion?: string): "ios" | "android" | "unknown" {
  const combined = `${device ?? ""} ${osVersion ?? ""}`.toLowerCase().trim();
  if (!combined) return "unknown";
  if (/ios|iphone|ipad|ipod|apple|apns|darwin/.test(combined)) return "ios";
  if (/android|google|fcm|samsung|huawei|xiaomi|oppo|vivo|oneplus|realme|pixel|motorola/.test(combined)) return "android";
  const trimmed = combined.trim();
  if (trimmed === "1") return "android";
  if (trimmed === "2") return "ios";
  return "unknown";
}

const statusMap: Record<string, { label: string; cls: string }> = {
  accepted: { label: "موثّق",          cls: "bg-green-100 text-green-700" },
  rejected:  { label: "مرفوض",         cls: "bg-red-100 text-red-600" },
  pending:   { label: "قيد المراجعة",  cls: "bg-amber-100 text-amber-700" },
  online:    { label: "متصل",          cls: "bg-emerald-100 text-emerald-700" },
  offline:   { label: "غير متصل",      cls: "bg-gray-100 text-gray-500" },
  blocked:   { label: "محظور",         cls: "bg-red-100 text-red-600" },
};

function Badge({ status }: { status?: string }) {
  const s = statusMap[status ?? ""] ?? { label: status ?? "—", cls: "bg-gray-100 text-gray-500" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${s.cls}`}>{s.label}</span>;
}

function Avatar({ name, avatar, size = 9 }: { name?: string; avatar?: string; size?: number }) {
  const [err, setErr] = useState(false);
  const letter = ((name ?? "?")[0] ?? "?").toUpperCase();
  const showImg = avatar && !err && !avatar.toLowerCase().includes("placeholder");
  const px = size * 4;
  if (showImg) {
    return (
      <img
        src={getImageUrl(avatar!)}
        className={`w-${size} h-${size} rounded-full object-cover ring-2 ring-white shadow-md flex-shrink-0`}
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-md`}
      style={{ background: "linear-gradient(135deg, #5aa526 0%, #1F4A10 100%)" }}
    >
      <span className="font-black text-white select-none" style={{ fontSize: `${px * 0.42}px`, lineHeight: 1 }}>{letter}</span>
    </div>
  );
}

function NotifModal({ driver, onClose }: { driver: Driver; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const quickTemplates = [
    { title: "تحديث مطلوب", body: "يرجى تحديث بيانات ملفك الشخصي." },
    { title: "تنبيه مهم", body: "يرجى مراجعة الشروط والأحكام المحدّثة." },
    { title: "طلب توثيق", body: "يرجى رفع وثائق التوثيق المطلوبة لإكمال تسجيلك." },
    { title: "تذكير رحلة", body: "لديك طلب رحلة جديد في انتظارك، تحقق من التطبيق." },
  ];

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) { setErr("العنوان والمحتوى مطلوبان"); return; }
    setSending(true); setErr("");
    try {
      await sendDriverNotification({ title, body, uuid: driver.uuid });
      setDone(true);
      setTimeout(onClose, 2000);
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setSending(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.form 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4" onSubmit={send} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#F6FAF0] flex items-center justify-center border border-[#D4EDA8]">
              <Bell className="w-6 h-6 text-[#1F4A10]" />
            </div>
            <div>
              <h3 className="font-heading font-black text-[#1F4A10] text-lg">إرسال إشعار</h3>
              <p className="text-sm text-gray-500">إلى: {driver.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="flex gap-2 flex-wrap pt-2">
          {quickTemplates.map((t, i) => (
            <button key={i} type="button" onClick={() => { setTitle(t.title); setBody(t.body); }}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#F6FAF0] text-[#679632] hover:bg-[#D4EDA8] transition-colors border border-[#D4EDA8]">
              {t.title}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">العنوان *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الإشعار..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/50 transition-all bg-gray-50/50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">المحتوى *</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="محتوى الإشعار..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/50 transition-all bg-gray-50/50 resize-none" />
          </div>
        </div>
        
        {err && <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{err}</p>}
        {done && <p className="text-green-600 text-sm font-bold flex items-center gap-1 bg-green-50 p-2 rounded-lg"><CheckCircle className="w-4 h-4" /> تم الإرسال بنجاح!</p>}
        
        <button type="submit" disabled={sending}
          className="w-full py-3.5 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#2A5A14] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#1F4A10]/20 transition-all active:scale-[0.98]">
          <Send className="w-4 h-4" /> {sending ? "جاري الإرسال..." : "إرسال الإشعار"}
        </button>
      </motion.form>
    </div>
  );
}

function DriverModal({ uuid, onClose, onAction, onBlock }: {
  uuid: string; onClose: () => void;
  onAction: (uuid: string, action: "accepted" | "rejected", reason?: string) => Promise<void>;
  onBlock: (uuid: string) => Promise<void>;
}) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [rejReason, setRejReason] = useState("");
  const [acting, setActing] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [plateLookup, setPlateLookup] = useState<{
    open: boolean; loading: boolean; result: PlateLookupResult | null;
  }>({ open: false, loading: false, result: null });

  useEffect(() => {
    showDriver(uuid)
      .then((r) => setDriver(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [uuid]);

  useEffect(() => {
    // Fetch as soon as the driver loads (not only when the trips tab is
    // opened) so the completed-trips stat on the info tab can fall back to
    // a computed value when the driver record itself doesn't report one.
    if (driver) {
      setLoadingOrders(true);
      getOrders({ driver_uuid: driver.uuid })
        .then((r) => setOrders(r.data ?? []))
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [driver]);

  const completedTripsCount = orders.filter((o) => o.status === "completed").length;
  const tripsCountDisplay = driver?.trips_count ?? (orders.length ? completedTripsCount : 0);

  const handleAccept = async () => {
    if (!driver) return;
    setActing(true);
    try { await onAction(driver.uuid, "accepted"); onClose(); }
    catch { /* ignore */ } finally { setActing(false); }
  };

  const handleReject = async () => {
    if (!driver) return;
    setActing(true);
    try { await onAction(driver.uuid, "rejected", rejReason || undefined); onClose(); }
    catch { /* ignore */ } finally { setActing(false); }
  };

  const handleBlock = async () => {
    if (!driver) return;
    setBlocking(true);
    try { await onBlock(driver.uuid); onClose(); }
    catch { /* ignore */ } finally { setBlocking(false); }
  };

  const tabs = [
    { id: "info", label: "المعلومات الأساسية", icon: User },
    { id: "kyc", label: "توثيق الحساب", icon: Shield },
    { id: "vehicle", label: "المركبة", icon: Car },
    { id: "trips", label: "سجل الطلبات", icon: Navigation },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" 
          onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-heading font-black text-[#1F4A10] text-xl">ملف السائق</h3>
                <p className="text-xs text-gray-500">عرض كافة تفاصيل السائق والمركبة والطلبات</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {driver && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6FAF0] border border-[#D4EDA8] ml-4">
                  <Smartphone className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-bold text-[#679632]">تطبيق السائق متصل</span>
                </div>
              )}
              <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex justify-center items-center py-20 bg-gray-50/30">
              <div className="w-10 h-10 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col justify-center items-center py-20 bg-gray-50/30">
              <XCircle className="w-16 h-16 text-red-300 mb-4" />
              <p className="text-red-500 font-bold text-lg">{error}</p>
            </div>
          ) : driver ? (
            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden bg-gray-50/30">
              
              {/* Sidebar Tabs */}
              <div className="w-full sm:w-64 bg-white border-b sm:border-b-0 sm:border-l border-gray-100 p-4 flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto shrink-0">
                {/* Driver Summary Mini Profile */}
                <div className="hidden sm:flex flex-col items-center p-4 bg-gradient-to-b from-[#F6FAF0] to-white rounded-2xl border border-[#D4EDA8]/50 mb-4">
                  <Avatar name={driver.name} avatar={driver.avatar} size={20} />
                  <p className="font-heading font-black text-[#1F4A10] mt-3 text-center">{driver.name}</p>
                  <Badge status={driver.status} />
                </div>

                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.id 
                        ? "bg-[#1F4A10] text-white shadow-md shadow-[#1F4A10]/20" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-gray-400"}`} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <AnimatePresence mode="wait">
                  
                  {activeTab === "info" && (
                    <motion.div key="info" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <h4 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2"><User className="w-4 h-4" /> البيانات الشخصية التقنية</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-xs text-gray-400">الاسم الكامل</p><p className="font-bold text-[#1F4A10]">{driver.name}</p></div>
                            <div><p className="text-xs text-gray-400">رقم الهاتف</p><p className="font-bold text-[#1F4A10] flex items-center gap-2" dir="ltr"><Phone className="w-3.5 h-3.5 text-[#679632]"/> {driver.phone}</p></div>
                            <div><p className="text-xs text-gray-400">تاريخ الميلاد</p><p className="font-bold text-[#1F4A10]">{driver.dob || "—"} {driver.age ? `(${driver.age} سنة)` : ""}</p></div>
                            <div><p className="text-xs text-gray-400">المدينة</p><p className="font-bold text-[#1F4A10]">{driver.city?.name || "—"}</p></div>
                            <div><p className="text-xs text-gray-400">البريد الإلكتروني</p><p className="font-bold text-[#1F4A10]">{driver.email || "—"}</p></div>
                            <div className="col-span-2 mt-2 pt-2 border-t border-gray-50">
                              <p className="text-xs text-gray-400">نظام التشغيل والجهاز</p>
                              {(() => {
                                const hasData = !!(driver.device || driver.os_version);
                                if (!hasData) return <span className="text-gray-300 mt-1">—</span>;
                                const os = detectOS(driver.device, driver.os_version);
                                const Icon = os === "ios" ? Apple : Smartphone;
                                const label = os === "ios" ? "iOS" : os === "android" ? "Android" : (driver.device || driver.os_version);
                                const textCls = os === "ios" ? "text-gray-700" : os === "android" ? "text-green-700" : "text-gray-500";
                                return (
                                  <p className={`font-bold flex items-center gap-2 mt-1 ${textCls}`}>
                                    <Icon className="w-4 h-4" />
                                    {label}
                                    {driver.os_version && os !== "unknown" && (
                                      <span className="text-xs font-mono text-gray-400">{driver.os_version}</span>
                                    )}
                                  </p>
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <h4 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> الإحصائيات والأداء</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                              <p className="text-xs text-blue-600 font-bold mb-1">الرحلات المكتملة</p>
                              <p className="text-2xl font-black text-blue-800">{loadingOrders && driver.trips_count == null ? "…" : tripsCountDisplay}</p>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                              <p className="text-xs text-amber-600 font-bold mb-1 flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-500" /> التقييم</p>
                              <p className="text-2xl font-black text-amber-800">{driver.rating != null ? Number(driver.rating).toFixed(1) : "—"}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-xl border border-green-100 col-span-2 flex justify-between items-center">
                              <div>
                                <p className="text-xs text-green-600 font-bold mb-1 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> الرصيد المتاح</p>
                                <p className="text-2xl font-black text-green-800">{driver.balance ?? 0} ريال</p>
                              </div>
                              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center"><CreditCard className="w-5 h-5 text-green-700" /></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div>
                          <h4 className="font-bold text-[#1F4A10]">إجراءات سريعة</h4>
                          <p className="text-xs text-gray-500">تواصل مع السائق أو قم بإدارة حالته</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button onClick={() => setShowNotif(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm hover:bg-blue-100 transition-colors">
                            <Bell className="w-4 h-4" /> إرسال إشعار
                          </button>
                          <a href={`tel:${driver.phone}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6FAF0] text-[#1F4A10] font-bold text-sm hover:bg-[#D4EDA8] transition-colors border border-[#D4EDA8]">
                            <Phone className="w-4 h-4" /> اتصال
                          </a>
                          <button onClick={handleBlock} disabled={blocking} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors">
                            <Ban className="w-4 h-4" /> {blocking ? "..." : "حظر السائق"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "kyc" && (
                    <motion.div key="kyc" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      
                      {driver.status === "pending" && (
                        <div className="border border-amber-200 rounded-2xl p-5 bg-amber-50 space-y-4 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-2 h-full bg-amber-400" />
                          <div>
                            <p className="font-bold text-amber-800 text-lg flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5" /> توثيق الحساب - قيد المراجعة
                            </p>
                            <p className="text-sm text-amber-700 mt-1">يرجى مراجعة الوثائق المرفقة والموافقة على توثيق الحساب أو رفضه مع ذكر السبب.</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-amber-100">
                            <label className="block text-xs font-bold text-gray-500 mb-2">سبب الرفض (إلزامي في حالة الرفض)</label>
                            <input
                              value={rejReason} onChange={(e) => setRejReason(e.target.value)}
                              placeholder="اكتب سبب الرفض بوضوح ليتم إرساله للسائق..."
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-amber-400 bg-gray-50/50"
                            />
                          </div>
                          <div className="flex gap-3">
                            <button onClick={handleAccept} disabled={acting}
                              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg shadow-green-600/20">
                              <CheckCircle className="w-5 h-5" /> الموافقة وتوثيق الحساب
                            </button>
                            <button onClick={handleReject} disabled={acting || !rejReason}
                              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-100 text-red-700 font-bold text-sm hover:bg-red-200 disabled:opacity-50 transition-colors">
                              <XCircle className="w-5 h-5" /> رفض الطلب
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-[#1F4A10] text-lg mb-6 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-[#679632]" /> الوثائق الرسمية والمرفقات
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {[
                            { label: "صورة الوجه الشخصية", url: driver.face_image, desc: "صورة واضحة لوجه السائق للتحقق السريع" },
                            { label: "الهوية الوطنية", url: driver.national_id, desc: "صورة واضحة للهوية من الأمام" },
                            { label: "رخصة القيادة", url: driver.driving_license, desc: "رخصة قيادة سارية المفعول" },
                            { label: "استمارة المركبة", url: driver.car_license, desc: "رخصة السير (الاستمارة)" },
                          ].map((doc, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col h-full">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-400" /></div>
                                <div><p className="font-bold text-sm text-[#1F4A10]">{doc.label}</p></div>
                              </div>
                              <p className="text-xs text-gray-500 mb-4">{doc.desc}</p>

                              {doc.url ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setLightboxUrl(getImageUrl(doc.url))}
                                    className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-200 mb-3 group bg-white"
                                  >
                                    <img src={getImageUrl(doc.url)} alt={doc.label} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setLightboxUrl(getImageUrl(doc.url))}
                                    className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-[#F6FAF0] rounded-xl text-[#679632] font-bold text-sm hover:bg-[#D4EDA8] border border-[#D4EDA8] transition-colors">
                                    <Eye className="w-4 h-4" /> عرض الوثيقة كاملة
                                  </button>
                                </>
                              ) : (
                                <div className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 rounded-xl text-gray-400 font-bold text-sm">
                                  <XCircle className="w-4 h-4" /> غير متوفرة
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "vehicle" && (() => {
                    // Resolve vehicle fields from both nested car object and
                    // flat driver-level fields (backend may return either shape)
                    const d = driver as unknown as Record<string, any>;
                    const vehicleType =
                      driver.car?.car_type?.name ?? driver.car?.name ??
                      driver.truck_type ?? driver.car_name ??
                      (driver.car_type as any)?.name ?? "—";
                    // Use license as final fallback so the field the driver
                    // actually filled in (stored as "license") is shown
                    const plateNumber =
                      driver.car?.plate_number ?? driver.plate_number ??
                      driver.car_number ?? driver.car_plate ??
                      driver.license ?? "—";
                    const carModel =
                      driver.car?.model ?? driver.car_model ?? d.model ?? "—";
                    const carYear =
                      driver.car?.year ?? driver.car_year ?? d.car_year ?? "—";
                    const carColor =
                      driver.car?.color ?? driver.car_color ?? "—";
                    const carImage = driver.car?.image;
                    const carTypeIcon = driver.car?.car_type?.icon;
                    const hasVehicleData =
                      vehicleType !== "—" || plateNumber !== "—" ||
                      !!driver.driving_license || !!driver.car_license || !!driver.car;

                    const doLookup = async () => {
                      if (plateNumber === "—" || !plateNumber) return;
                      setPlateLookup({ open: true, loading: true, result: null });
                      try {
                        const res = await lookupSaudiPlate(plateNumber);
                        setPlateLookup({ open: true, loading: false, result: res });
                      } catch {
                        setPlateLookup({ open: true, loading: false, result: { success: false, message: "تعذّر الاتصال بخدمة الاستعلام" } });
                      }
                    };

                    return (
                      <motion.div key="vehicle" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                        {!hasVehicleData && (
                          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <Car className="w-14 h-14 text-gray-200 mb-3" />
                            <p className="text-gray-500 font-bold">لم يقم السائق بإضافة مركبة حتى الآن</p>
                          </div>
                        )}

                        {hasVehicleData && (
                          <>
                            {/* ── Vehicle photo + 3 required fields ──────────────── */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#F6FAF0] to-transparent rounded-bl-full -z-10" />
                              <h4 className="font-bold text-[#1F4A10] text-lg mb-5 flex items-center gap-2">
                                <Car className="w-5 h-5 text-[#679632]" /> معلومات المركبة
                              </h4>

                              <div className="flex flex-col sm:flex-row gap-5">
                                {/* Vehicle image / icon */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                                  {carImage ? (
                                    <button type="button" onClick={() => setLightboxUrl(getImageUrl(carImage))}
                                      className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#D4EDA8] bg-white shadow-sm group relative">
                                      <img src={getImageUrl(carImage)} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                        <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                    </button>
                                  ) : carTypeIcon ? (
                                    <div className="w-24 h-24 rounded-2xl bg-[#F6FAF0] border-2 border-[#D4EDA8] flex items-center justify-center p-3">
                                      <img src={getImageUrl(carTypeIcon)} className="w-full h-full object-contain" />
                                    </div>
                                  ) : (
                                    <div className="w-24 h-24 rounded-2xl bg-[#F6FAF0] border-2 border-[#D4EDA8] flex items-center justify-center">
                                      <Car className="w-10 h-10 text-[#679632]" />
                                    </div>
                                  )}
                                </div>

                                {/* 3 key required fields */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  {/* 1. نوع السيارة */}
                                  <div className="bg-[#F6FAF0] rounded-xl p-4 border border-[#D4EDA8]">
                                    <p className="text-xs font-bold text-[#679632] mb-1 flex items-center gap-1">
                                      <Car className="w-3.5 h-3.5" /> نوع السيارة
                                    </p>
                                    <p className="font-black text-[#1F4A10] text-lg leading-tight">{vehicleType}</p>
                                    {carModel !== "—" && <p className="text-xs text-gray-500 mt-0.5">{carModel} {carYear !== "—" ? `· ${carYear}` : ""}</p>}
                                  </div>

                                  {/* 2. لوحة السيارة */}
                                  <div className="bg-white rounded-xl p-4 border-2 border-gray-800 shadow-sm">
                                    <p className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                                      <Hash className="w-3.5 h-3.5" /> لوحة السيارة
                                    </p>
                                    <p className="font-black text-gray-900 text-lg tracking-widest leading-tight">{plateNumber}</p>
                                    <button
                                      type="button"
                                      onClick={doLookup}
                                      disabled={plateNumber === "—"}
                                      className="mt-2 text-[10px] font-bold text-[#679632] flex items-center gap-1 hover:underline disabled:opacity-40 disabled:no-underline"
                                    >
                                      <SearchIcon className="w-3 h-3" /> استعلام سعودي
                                    </button>
                                  </div>

                                  {/* 3. رخصة القيادة */}
                                  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                    <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                                      <FileCheck className="w-3.5 h-3.5 text-[#679632]" /> رخصة القيادة
                                    </p>
                                    {/* رقم الرخصة النصي */}
                                    {driver.license && (
                                      <div className="mb-2 px-2 py-1 bg-[#F6FAF0] rounded-lg border border-[#D4EDA8] inline-flex items-center gap-1.5">
                                        <Hash className="w-3 h-3 text-[#679632]" />
                                        <span className="font-black text-[#1F4A10] text-sm tracking-wide" dir="ltr">{driver.license}</span>
                                      </div>
                                    )}
                                    {/* صورة الرخصة */}
                                    {driver.driving_license ? (
                                      <button type="button" onClick={() => setLightboxUrl(getImageUrl(driver.driving_license))}
                                        className="relative w-full h-16 rounded-lg overflow-hidden border border-gray-200 group bg-gray-50">
                                        <img src={getImageUrl(driver.driving_license)} alt="رخصة القيادة" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                                          <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </button>
                                    ) : !driver.license ? (
                                      <div className="w-full h-16 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                                        <span className="text-xs text-gray-400 font-bold">غير مرفوعة</span>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>

                              {/* Extra details row */}
                              {(carColor !== "—" || driver.car?.is_active !== undefined) && (
                                <div className="mt-5 pt-4 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                  <div><p className="text-xs text-gray-400 mb-0.5">اللون</p>
                                    <div className="flex items-center gap-1.5">
                                      {carColor !== "—" && <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: carColor }} />}
                                      <p className="font-bold text-[#1F4A10]">{carColor}</p>
                                    </div>
                                  </div>
                                  <div><p className="text-xs text-gray-400 mb-0.5">حالة المركبة</p>
                                    <Badge status={driver.car?.is_active === false ? "offline" : driver.status === "accepted" ? "accepted" : driver.status} />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* ── استمارة المركبة ─────────────────────────────── */}
                            {driver.car_license && (
                              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                                  <FileText className="w-4 h-4 text-[#679632]" /> استمارة المركبة (رخصة السير)
                                </div>
                                <button type="button" onClick={() => setLightboxUrl(getImageUrl(driver.car_license))}
                                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F6FAF0] text-[#679632] font-bold text-xs hover:bg-[#D4EDA8] border border-[#D4EDA8] transition-colors">
                                  <Eye className="w-3.5 h-3.5" /> عرض الاستمارة
                                </button>
                              </div>
                            )}

                            {/* ── Saudi Plate Lookup Modal ─────────────────────── */}
                            {plateLookup.open && (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4"
                              >
                                <div className="flex items-center justify-between">
                                  <h5 className="font-bold text-[#1F4A10] flex items-center gap-2">
                                    <SearchIcon className="w-4 h-4 text-[#679632]" /> استعلام عن اللوحة: {plateNumber}
                                  </h5>
                                  <button type="button" onClick={() => setPlateLookup({ open: false, loading: false, result: null })}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-4 h-4 text-gray-400" />
                                  </button>
                                </div>

                                {plateLookup.loading && (
                                  <div className="flex items-center justify-center py-8 gap-3 text-[#679632]">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm font-bold">جاري الاستعلام من المرور السعودي...</span>
                                  </div>
                                )}

                                {!plateLookup.loading && plateLookup.result && (
                                  (() => {
                                    const r = plateLookup.result;
                                    if (r.success && r.data) {
                                      const fields = Object.entries(r.data)
                                        .filter(([, v]) => v !== null && v !== undefined && v !== "");
                                      const sourceLabel: Record<string, string> = {
                                        elm_yakeen: "Elm Yakeen",
                                        moi: "وزارة الداخلية",
                                      };
                                      return (
                                        <div className="space-y-3">
                                          {r.source && (
                                            <div className="flex items-center gap-1.5">
                                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold border border-green-200">
                                                ✓ {sourceLabel[r.source] ?? r.source}
                                              </span>
                                            </div>
                                          )}
                                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {fields.map(([key, val]) => (
                                              <div key={key} className="bg-[#F6FAF0] rounded-xl p-3 border border-[#D4EDA8]">
                                                <p className="text-[10px] text-gray-400 font-bold mb-0.5">{key.replace(/_/g, " ")}</p>
                                                <p className="font-bold text-[#1F4A10] text-sm">{String(val)}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    }
                                    // Not available — show message + links
                                    return (
                                      <div className="space-y-3">
                                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                                          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                          <p className="text-sm text-amber-800 font-medium">{r.message ?? "خدمة الاستعلام غير متاحة حالياً."}</p>
                                        </div>
                                        {r.needs_api_key && (
                                          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                                            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                            <div>
                                              <p className="text-xs font-bold text-blue-800 mb-0.5">لتفعيل البحث التلقائي الكامل</p>
                                              <p className="text-xs text-blue-700">أضف مفتاح <span dir="ltr" className="font-mono">ELM_API_KEY</span> من خدمة Elm (<span dir="ltr">api.elm.sa</span>) في إعدادات المشروع</p>
                                            </div>
                                          </div>
                                        )}
                                        {r.inquiry_links && r.inquiry_links.length > 0 && (
                                          <div className="flex flex-wrap gap-2">
                                            {r.inquiry_links.map((link, i) => (
                                              <a key={i} href={link.url} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F6FAF0] text-[#679632] font-bold text-xs hover:bg-[#D4EDA8] border border-[#D4EDA8] transition-colors">
                                                <ExternalLink className="w-3.5 h-3.5" /> {link.label}
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()
                                )}
                              </motion.div>
                            )}
                          </>
                        )}
                      </motion.div>
                    );
                  })()}

                  {activeTab === "trips" && (
                    <motion.div key="trips" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                      {loadingOrders ? (
                         <div className="flex justify-center items-center py-16 bg-white rounded-2xl border border-gray-100">
                           <div className="w-8 h-8 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" />
                         </div>
                      ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                          <Navigation className="w-16 h-16 text-gray-200 mb-4" />
                          <p className="text-gray-500 font-bold">لا يوجد سجل طلبات لهذا السائق</p>
                          <p className="text-xs text-gray-400 mt-1">الرحلات التي يقوم بها السائق ستظهر هنا بالتفصيل</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {orders.map((order) => (
                            <div key={order.uuid} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-[#D4EDA8] transition-colors">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    order.status === "completed" ? "bg-green-50 text-green-600" :
                                    order.status === "cancelled" ? "bg-red-50 text-red-500" :
                                    "bg-blue-50 text-blue-600"
                                  }`}>
                                    <Car className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-[#1F4A10]">الرحلة #{order.uuid.substring(0,6)}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(order.created_at || "").toLocaleDateString("ar-SA")}</p>
                                  </div>
                                </div>
                                <div className="text-left">
                                  <p className="font-black text-[#1F4A10]">{order.price} ريال</p>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    order.status === "completed" ? "bg-green-100 text-green-700" :
                                    order.status === "cancelled" ? "bg-red-100 text-red-700" :
                                    "bg-blue-100 text-blue-700"
                                  }`}>
                                    {order.status === "completed" ? "مكتملة" : order.status === "cancelled" ? "ملغاة" : "نشطة"}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F6FAF0] rounded-xl p-3 text-sm mt-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0"><User className="w-3 h-3 text-gray-400" /></div>
                                  <div className="min-w-0">
                                    <p className="text-xs text-gray-500">العميل</p>
                                    <p className="font-bold text-[#1F4A10] text-xs truncate">{order.user?.name ?? "عميل غير معروف"}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0"><CreditCard className="w-3 h-3 text-gray-400" /></div>
                                  <div className="min-w-0">
                                    <p className="text-xs text-gray-500">الدفع</p>
                                    <p className="font-bold text-[#1F4A10] text-xs">{order.payment_method === "cash" ? "نقدي" : order.payment_method === "card" ? "بطاقة" : order.payment_method ?? "—"}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0"><MapPin className="w-3 h-3 text-gray-400" /></div>
                                  <div className="min-w-0">
                                    <p className="text-xs text-gray-500">المسافة</p>
                                    <p className="font-bold text-[#1F4A10] text-xs">{order.distance != null ? `${order.distance} كم` : "—"}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                                    {order.car_type?.icon
                                      ? <img src={getImageUrl(order.car_type.icon)} className="w-4 h-4 object-contain" />
                                      : <Car className="w-3 h-3 text-gray-400" />}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs text-gray-500">نوع المركبة</p>
                                    <p className="font-bold text-[#1F4A10] text-xs truncate">{order.car_type?.name ?? "—"}</p>
                                  </div>
                                </div>
                              </div>

                              {(order.from_address || order.to_address) && (
                                <div className="mt-3 space-y-2 border-t border-gray-50 pt-3">
                                  {order.from_address && (
                                    <div className="flex items-start gap-2 text-xs">
                                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5"><Flag className="w-3 h-3 text-green-600" /></div>
                                      <div><span className="text-gray-400">من: </span><span className="font-bold text-[#1F4A10]">{order.from_address}</span></div>
                                    </div>
                                  )}
                                  {order.to_address && (
                                    <div className="flex items-start gap-2 text-xs">
                                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5"><MapPin className="w-3 h-3 text-red-600" /></div>
                                      <div><span className="text-gray-400">إلى: </span><span className="font-bold text-[#1F4A10]">{order.to_address}</span></div>
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-2">
                                <p className="text-[10px] text-gray-400 flex items-center gap-1"><Hash className="w-3 h-3" /> {order.uuid}</p>
                                {order.note && <p className="text-xs text-gray-500 flex items-center gap-1"><FileText className="w-3 h-3" /> {order.note}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm"
            onClick={() => setLightboxUrl(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-12 left-0 right-0 flex items-center justify-between px-1">
                <a href={lightboxUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> فتح في تبويب جديد
                </a>
                <button type="button" onClick={() => setLightboxUrl(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <img src={lightboxUrl} alt="وثيقة" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain bg-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {showNotif && driver && <NotifModal driver={driver} onClose={() => setShowNotif(false)} />}
    </>
  );
}

export default function DriversManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [notifDriver, setNotifDriver] = useState<Driver | null>(null);
  const [toast, setToast] = useState({ msg: "", ok: true });

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: "", ok: true }), 3500);
  };

  const load = () => {
    setLoading(true); setError("");
    getDrivers()
      .then((r) => setDrivers(r.data ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (uuid: string, action: "accepted" | "rejected", reason?: string) => {
    await acceptDriver({ uuid, status: action, reason });
    showToast(action === "accepted" ? "✅ تم قبول السائق" : "❌ تم رفض السائق");
    load();
  };

  const handleBlock = async (uuid: string) => {
    await blockUser({ uuid, status: "blocked" });
    showToast("🚫 تم حظر السائق");
    load();
  };

  const filtered = drivers.filter((d) => {
    const matchSearch = !search || d.name?.includes(search) || d.phone?.includes(search);
    const matchStatus =
      statusFilter === "all" ? true :
      statusFilter === "_online" ? !!d.is_active :
      d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: drivers.length,
    accepted: drivers.filter((d) => d.status === "accepted").length,
    pending: drivers.filter((d) => d.status === "pending").length,
    rejected: drivers.filter((d) => d.status === "rejected").length,
    online: drivers.filter((d) => d.is_active).length,
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Toast */}
      <AnimatePresence>
        {toast.msg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 ${toast.ok ? "bg-[#1F4A10] text-white" : "bg-red-600 text-white"}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#1F4A10]">إدارة السائقين</h2>
          <p className="text-sm text-gray-500 mt-1">التحكم الكامل بالسائقين وتوثيق الحسابات ومتابعة الرحلات</p>
        </div>
        <div className="flex gap-2">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-gray-600">تحديث مباشر</span>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-[#1F4A10] text-sm font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
            <RefreshCw className="w-4 h-4" /> تحديث البيانات
          </button>
        </div>
      </div>

      {/* Premium Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "إجمالي السائقين",   val: counts.all,      icon: Car,         color: "#1F4A10", bg: "bg-[#F6FAF0]", border: "border-[#D4EDA8]", filter: "all"      },
          { label: "السائقين الموثقين", val: counts.accepted, icon: Shield,      color: "#16a34a", bg: "bg-green-50", border: "border-green-200", filter: "accepted" },
          { label: "بانتظار التوثيق",   val: counts.pending,  icon: AlertTriangle,color: "#d97706", bg: "bg-amber-50", border: "border-amber-200", filter: "pending"  },
          { label: "طلبات مرفوضة",      val: counts.rejected, icon: Ban,         color: "#dc2626", bg: "bg-red-50", border: "border-red-200", filter: "rejected" },
          { label: "متصلون الآن",       val: counts.online,   icon: Activity,    color: "#0891b2", bg: "bg-cyan-50", border: "border-cyan-200", filter: "_online"  },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 border ${s.border} ${s.bg} cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${statusFilter === s.filter ? 'ring-2 ring-offset-2 ring-[#679632]' : ''}`}
            onClick={() => setStatusFilter(statusFilter === s.filter ? "all" : s.filter)}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              {s.filter === "pending" && counts.pending > 0 && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>
            <p className="text-3xl font-heading font-black" style={{ color: s.color }}>{s.val}</p>
            <span className="text-xs font-bold text-gray-600 mt-1 block">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pr-12 pl-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none focus:ring-2 focus:ring-[#D4EDA8] transition-all"
            placeholder="ابحث عن سائق بالاسم، رقم الهاتف، أو الإيميل..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="relative min-w-[200px]">
          <select className="w-full appearance-none pr-4 pl-10 py-3 rounded-xl bg-gray-50 border-none text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#D4EDA8] transition-all"
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">عرض الجميع</option>
            <option value="accepted">السائقين الموثقين فقط</option>
            <option value="pending">طلبات التوثيق المعلقة</option>
            <option value="rejected">الطلبات المرفوضة</option>
          </select>
          <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Advanced Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <XCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
            <p className="text-red-500 font-bold text-lg mb-2">{error}</p>
            <button onClick={load} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors">إعادة المحاولة</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-bold text-lg mb-1">لا توجد نتائج مطابقة لبحثك</p>
            <p className="text-gray-400 text-sm">جرب تغيير كلمات البحث أو الفلاتر المستخدمة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="text-right py-4 px-5 text-xs font-bold text-gray-500 whitespace-nowrap">السائق</th>
                  <th className="text-right py-4 px-5 text-xs font-bold text-gray-500 whitespace-nowrap">معلومات الاتصال</th>
                  <th className="text-right py-4 px-5 text-xs font-bold text-gray-500 whitespace-nowrap">المركبة والمنطقة</th>
                  <th className="text-center py-4 px-5 text-xs font-bold text-gray-500 whitespace-nowrap">الإحصائيات</th>
                  <th className="text-center py-4 px-5 text-xs font-bold text-gray-500 whitespace-nowrap">الحالة</th>
                  <th className="text-left py-4 px-5 text-xs font-bold text-gray-500 whitespace-nowrap">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((d) => (
                  <tr key={d.uuid} className="hover:bg-[#F6FAF0]/40 transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar name={d.name} avatar={d.avatar} size={11} />
                          {d.is_active && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                        </div>
                        <div>
                          <p className="font-bold text-[#1F4A10] group-hover:text-[#679632] transition-colors">{d.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono mt-0.5">{d.uuid.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5" dir="ltr">
                          <Phone className="w-3 h-3 text-gray-400" /> {d.phone}
                        </p>
                        {d.email && <p className="text-xs text-gray-500 truncate max-w-[150px]">{d.email}</p>}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-[#679632]" /> {d.car?.car_type?.name ?? "لم يضف مركبة"}
                        </p>
                        {d.city?.name && (
                          <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" /> {d.city.name}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-center" title="عدد الطلبات">
                          <p className="font-black text-[#1F4A10]">{d.trips_count ?? 0}</p>
                          <p className="text-[10px] text-gray-400">طلب</p>
                        </div>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <div className="text-center" title="التقييم">
                          <p className="font-black text-amber-500 flex items-center justify-center gap-0.5">
                            {d.rating ?? "—"} <Star className="w-3 h-3 fill-amber-500" />
                          </p>
                          <p className="text-[10px] text-gray-400">التقييم</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <Badge status={d.status} />
                        {d.status === "pending" && <span className="text-[10px] text-amber-600 font-bold animate-pulse">مطلوب إجراء</span>}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-left">
                      <div className="flex items-center justify-end gap-2">
                        {d.status === "pending" && (
                          <button onClick={async () => { await handleAction(d.uuid, "accepted"); }}
                            className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 hover:scale-110 transition-all" title="قبول السائق">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => setNotifDriver(d)}
                          className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all" title="إرسال إشعار">
                          <Bell className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedUuid(d.uuid)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-700 font-bold hover:bg-[#1F4A10] hover:text-white transition-colors border border-gray-200 hover:border-[#1F4A10]">
                          <span className="text-xs">التفاصيل</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-bold">إجمالي السائقين المعروضين: <span className="text-[#1F4A10]">{filtered.length}</span></p>
            <div className="flex gap-1">
              <button disabled className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 bg-white opacity-50"><ChevronRight className="w-4 h-4" /></button>
              <button disabled className="w-8 h-8 rounded-lg border border-[#D4EDA8] flex items-center justify-center text-[#1F4A10] bg-[#F6FAF0] font-bold text-xs">1</button>
              <button disabled className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 bg-white opacity-50"><ChevronRight className="w-4 h-4 rotate-180" /></button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedUuid && (
          <DriverModal
            uuid={selectedUuid}
            onClose={() => setSelectedUuid(null)}
            onAction={handleAction}
            onBlock={handleBlock}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
