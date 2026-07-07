import { useState, useEffect } from "react";
import {
  getDrivers, showDriver, sendDriverNotification, acceptDriver,
  blockUser, type Driver,
} from "@/lib/meshwarApi";
import {
  Search, RefreshCw, Star, Phone, MapPin, Car, CheckCircle,
  XCircle, Clock, Eye, ChevronDown, Bell, Send, X, Shield,
  Ban, Smartphone, Apple, UserCheck, AlertTriangle, Trash2,
} from "lucide-react";

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
  if (avatar) return <img src={avatar} className={`w-${size} h-${size} rounded-xl object-cover`} />;
  return (
    <div className={`w-${size} h-${size} rounded-xl bg-[#D4EDA8] flex items-center justify-center flex-shrink-0`}>
      <span className="font-black text-[#1F4A10] text-sm">{(name ?? "?")[0]}</span>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <form className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4" onSubmit={send} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#1F4A10]" />
            </div>
            <div>
              <h3 className="font-heading font-black text-[#1F4A10]">إرسال إشعار</h3>
              <p className="text-xs text-gray-400">إلى: {driver.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        {/* Platform */}
        <div className="flex gap-2 p-2.5 bg-[#F6FAF0] rounded-xl border border-[#D4EDA8]">
          <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
            <Smartphone className="w-3 h-3" /> Android
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
            <Apple className="w-3 h-3" /> iOS
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {quickTemplates.map((t, i) => (
            <button key={i} type="button" onClick={() => { setTitle(t.title); setBody(t.body); }}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#F6FAF0] text-[#679632] hover:bg-[#D4EDA8] transition-colors">
              {t.title}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">العنوان *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الإشعار..."
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">المحتوى *</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="محتوى الإشعار..."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] resize-none" />
        </div>
        {err && <p className="text-red-500 text-xs">{err}</p>}
        {done && <p className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> تم الإرسال بنجاح!</p>}
        <button type="submit" disabled={sending}
          className="w-full py-3 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] disabled:opacity-50 flex items-center justify-center gap-2">
          <Send className="w-4 h-4" /> {sending ? "جاري الإرسال..." : "إرسال"}
        </button>
      </form>
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

  useEffect(() => {
    showDriver(uuid)
      .then((r) => setDriver(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [uuid]);

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

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-black text-[#1F4A10] text-lg">تفاصيل السائق</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5" /></button>
          </div>
          <div className="p-6">
            {loading && <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {driver && (
              <div className="space-y-5">
                {/* Profile header */}
                <div className="flex items-center gap-4 p-4 bg-[#F6FAF0] rounded-2xl">
                  <Avatar name={driver.name} avatar={driver.avatar} size={14} />
                  <div className="flex-1">
                    <p className="font-heading font-black text-[#1F4A10] text-lg">{driver.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{driver.phone}</p>
                    {driver.email && <p className="text-xs text-gray-400 mt-0.5">{driver.email}</p>}
                  </div>
                  <Badge status={driver.status} />
                </div>

                {/* Platform */}
                <div className="flex gap-2 p-3 bg-[#F6FAF0] rounded-xl border border-[#D4EDA8]">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                    <Smartphone className="w-3 h-3" /> Android
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
                    <Apple className="w-3 h-3" /> iOS
                  </span>
                  <span className="text-xs text-gray-400 self-center">متوافق مع كلا المنصتين</span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "التقييم", value: driver.rating ? `⭐ ${driver.rating}` : "—" },
                    { label: "عدد الرحلات", value: driver.trips_count ?? "—" },
                    { label: "الرصيد", value: driver.balance != null ? `${driver.balance} ريال` : "—" },
                    { label: "المدينة", value: driver.city?.name ?? "—" },
                    { label: "نوع السيارة", value: driver.car?.car_type?.name ?? "—" },
                    { label: "رقم اللوحة", value: driver.car?.plate_number ?? "—" },
                    { label: "الموديل", value: driver.car?.model ?? "—" },
                    { label: "السنة", value: driver.car?.year ?? "—" },
                  ].map((row) => (
                    <div key={row.label} className="bg-[#F6FAF0] rounded-xl p-3">
                      <p className="text-xs text-gray-500">{row.label}</p>
                      <p className="font-bold text-[#1F4A10] mt-0.5 text-sm">{String(row.value)}</p>
                    </div>
                  ))}
                </div>

                {/* KYC Docs */}
                {(driver.national_id || driver.driving_license || driver.car_license) && (
                  <div>
                    <p className="font-bold text-[#1F4A10] text-sm mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#679632]" /> وثائق التوثيق (KYC)
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "الهوية الوطنية", url: driver.national_id },
                        { label: "رخصة القيادة", url: driver.driving_license },
                        { label: "رخصة السيارة", url: driver.car_license },
                      ].map((doc) => (
                        doc.url ? (
                          <a key={doc.label} href={doc.url} target="_blank" rel="noreferrer"
                            className="block bg-[#F6FAF0] rounded-xl p-3 text-center hover:bg-[#D4EDA8] transition-colors border border-[#D4EDA8]/50">
                            <p className="text-xs text-gray-500">{doc.label}</p>
                            <p className="text-xs text-[#679632] font-bold mt-1">عرض ↗</p>
                          </a>
                        ) : (
                          <div key={doc.label} className="bg-gray-50 rounded-xl p-3 text-center opacity-50">
                            <p className="text-xs text-gray-400">{doc.label}</p>
                            <p className="text-xs text-gray-300 mt-1">غير متوفر</p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* KYC Actions (for pending drivers) */}
                {driver.status === "pending" && (
                  <div className="border border-amber-200 rounded-2xl p-4 bg-amber-50 space-y-3">
                    <p className="font-bold text-amber-800 text-sm flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> توثيق السائق - قيد المراجعة
                    </p>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">سبب الرفض (اختياري)</label>
                      <input
                        value={rejReason} onChange={(e) => setRejReason(e.target.value)}
                        placeholder="اكتب سبب الرفض إن وجد..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAccept} disabled={acting}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 disabled:opacity-50 transition-colors">
                        <CheckCircle className="w-4 h-4" /> قبول التوثيق
                      </button>
                      <button onClick={handleReject} disabled={acting}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 disabled:opacity-50 transition-colors">
                        <XCircle className="w-4 h-4" /> رفض
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowNotif(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] transition-colors">
                    <Bell className="w-4 h-4" /> إرسال إشعار
                  </button>
                  <a href={`tel:${driver.phone}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F6FAF0] text-[#1F4A10] font-bold text-sm hover:bg-[#D4EDA8] transition-colors">
                    <Phone className="w-4 h-4" /> اتصال
                  </a>
                  <button onClick={handleBlock} disabled={blocking}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 disabled:opacity-50 transition-colors">
                    <Ban className="w-4 h-4" /> {blocking ? "..." : "حظر"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
    <div className="space-y-5" dir="rtl">
      {/* Toast */}
      {toast.msg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold ${toast.ok ? "bg-[#1F4A10] text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة السائقين</h2>
          <p className="text-sm text-gray-500 mt-0.5">قائمة جميع السائقين المسجلين على Android و iOS</p>
        </div>
        <div className="flex gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6FAF0] border border-[#D4EDA8]">
            <Smartphone className="w-3.5 h-3.5 text-green-600" />
            <Apple className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-xs font-bold text-[#679632]">متزامن</span>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors">
            <RefreshCw className="w-4 h-4" /> تحديث
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "الكل",           val: counts.all,      icon: Car,         color: "#1F4A10", bg: "#D4EDA8",  filter: "all"      },
          { label: "موثّقون",        val: counts.accepted, icon: UserCheck,   color: "#16a34a", bg: "#dcfce7",  filter: "accepted" },
          { label: "قيد المراجعة",   val: counts.pending,  icon: Clock,       color: "#d97706", bg: "#fef3c7",  filter: "pending"  },
          { label: "مرفوضون",        val: counts.rejected, icon: XCircle,     color: "#dc2626", bg: "#fee2e2",  filter: "rejected" },
          { label: "متصلون الآن",    val: counts.online,   icon: CheckCircle, color: "#0891b2", bg: "#cffafe",  filter: "_online"  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setStatusFilter(statusFilter === s.filter ? "all" : s.filter)}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
            <p className="text-2xl font-heading font-black" style={{ color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
            placeholder="البحث بالاسم أو الهاتف..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select className="appearance-none pr-4 pl-9 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] bg-white"
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">كل الحالات</option>
            <option value="accepted">موثّق</option>
            <option value="pending">قيد المراجعة</option>
            <option value="rejected">مرفوض</option>
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-500 font-bold">{error}</p>
            <button onClick={load} className="mt-3 text-sm text-[#679632] underline">إعادة المحاولة</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>لا توجد نتائج</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F6FAF0]">
                  <tr>
                    {["السائق", "الهاتف", "المدينة", "السيارة", "الرحلات", "التقييم", "الرصيد", "الحالة", "إجراءات"].map((h) => (
                      <th key={h} className="text-right py-3.5 px-4 text-xs font-bold text-[#1F4A10]/60 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((d) => (
                    <tr key={d.uuid} className="hover:bg-[#F6FAF0]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={d.name} avatar={d.avatar} />
                          <div>
                            <p className="font-bold text-[#1F4A10]">{d.name}</p>
                            {d.email && <p className="text-xs text-gray-400 truncate max-w-[140px]">{d.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 text-xs">{d.phone}</td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {d.city?.name ? (
                          <span className="flex items-center gap-1 text-xs"><MapPin className="w-3 h-3" />{d.city.name}</span>
                        ) : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 text-xs">{d.car?.car_type?.name ?? "—"}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-[#1F4A10] text-xs">{d.trips_count ?? "—"}</td>
                      <td className="py-3.5 px-4">
                        {d.rating ? (
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="font-bold text-xs">{d.rating}</span>
                          </span>
                        ) : "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        {d.balance != null ? (
                          <span className={`font-bold text-xs ${d.balance > 0 ? "text-green-600" : "text-gray-400"}`}>
                            {d.balance} ريال
                          </span>
                        ) : "—"}
                      </td>
                      <td className="py-3.5 px-4"><Badge status={d.status} /></td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelectedUuid(d.uuid)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F6FAF0] text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors text-xs font-bold">
                            <Eye className="w-3.5 h-3.5" /> عرض
                          </button>
                          {d.status === "pending" && (
                            <>
                              <button onClick={async () => { await handleAction(d.uuid, "accepted"); }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-xs font-bold">
                                <CheckCircle className="w-3.5 h-3.5" /> قبول
                              </button>
                              <button onClick={async () => { await handleAction(d.uuid, "rejected"); }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold">
                                <XCircle className="w-3.5 h-3.5" /> رفض
                              </button>
                            </>
                          )}
                          <button onClick={() => setNotifDriver(d)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400 text-center">
              عرض {filtered.length} من {drivers.length} سائق
              {counts.pending > 0 && (
                <span className="mr-3 text-amber-600 font-bold animate-pulse">• {counts.pending} بانتظار التوثيق</span>
              )}
            </div>
          </>
        )}
      </div>

      {selectedUuid && (
        <DriverModal
          uuid={selectedUuid}
          onClose={() => setSelectedUuid(null)}
          onAction={handleAction}
          onBlock={handleBlock}
        />
      )}
      {notifDriver && <NotifModal driver={notifDriver} onClose={() => setNotifDriver(null)} />}
    </div>
  );
}
