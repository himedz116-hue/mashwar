import { useState, useEffect } from "react";
import {
  Tag, Plus, Send, Trash2, Copy, Check, RefreshCw, Users, Bell,
  Smartphone, Apple, X, Percent, DollarSign, Calendar, BarChart2,
  TrendingUp, Eye, Zap, Gift, AlertCircle, Star, Search, Filter,
  CheckCircle2, Ticket, Clock, Target, Sparkles, ArrowUpRight, Power
} from "lucide-react";
import { sendDriverNotification, getDrivers, type Driver } from "@/lib/meshwarApi";
import { motion, AnimatePresence } from "framer-motion";

interface PromoCode {
  id: number; code: string; discount: number; type: "fixed" | "percent";
  maxUses: number; used: number; expiry: string; active: boolean;
  platform: "all" | "android" | "ios";
  description: string; createdAt: string;
  targetType: "all" | "new" | "vip";
}

const INITIAL_CODES: PromoCode[] = [
  { id: 1, code: "MASHWAR20", discount: 20, type: "percent", maxUses: 500, used: 213, expiry: "2026-12-31", active: true, platform: "all", description: "خصم ترحيبي للمستخدمين الجدد", createdAt: "2026-01-01", targetType: "new" },
  { id: 2, code: "WELCOME50", discount: 50, type: "fixed", maxUses: 100, used: 87, expiry: "2026-08-31", active: true, platform: "android", description: "كود خاص لمستخدمي Android", createdAt: "2026-03-01", targetType: "new" },
  { id: 3, code: "SUMMER15", discount: 15, type: "percent", maxUses: 200, used: 200, expiry: "2026-07-01", active: false, platform: "all", description: "عرض الصيف المنتهي", createdAt: "2026-05-01", targetType: "all" },
  { id: 4, code: "VIP100", discount: 100, type: "fixed", maxUses: 50, used: 12, expiry: "2026-09-30", active: true, platform: "ios", description: "خصم VIP لعملاء iOS المميزين", createdAt: "2026-06-01", targetType: "vip" },
  { id: 5, code: "EID30", discount: 30, type: "percent", maxUses: 1000, used: 445, expiry: "2026-10-15", active: true, platform: "all", description: "عرض العيد الخاص", createdAt: "2026-06-15", targetType: "all" },
];

const NOTIF_TEMPLATES = [
  { label: "عرض خاص 🎉", title: "عرض حصري من مشوار!", body: "احصل على خصم 20% على رحلتك القادمة. استخدم الكود: MASHWAR20" },
  { label: "ترحيب 👋", title: "أهلاً في مشوار!", body: "مرحباً بك! ابدأ رحلتك الأولى الآن واستمتع بخدمة نقل متميزة." },
  { label: "تذكير 🚛", title: "مشوار بانتظارك", body: "لم تستخدم التطبيق مؤخراً. اطلب رحلتك الآن بأفضل الأسعار!" },
  { label: "مكافأة ⭐", title: "مكافأة الولاء", body: "شكراً لاستخدامك مشوار! لقد حصلت على 100 نقطة مكافأة." },
  { label: "موسم عروض 🛍️", title: "عروض موسمية!", body: "الآن خصومات حتى 30% على جميع رحلات النقل. العرض لوقت محدود!" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 }
};

function CodeCard({ code, onToggle, onDelete, onCopy, copied }: {
  code: PromoCode; onToggle: () => void; onDelete: () => void;
  onCopy: (c: string) => void; copied: string | null;
}) {
  const usedPct = code.maxUses > 0 ? Math.min(100, Math.round((code.used / code.maxUses) * 100)) : 0;
  const isExpired = new Date(code.expiry) < new Date();
  const isFull = code.used >= code.maxUses;
  const isActive = code.active && !isExpired && !isFull;

  return (
    <motion.div variants={itemVariants} className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-xl group relative ${
      isActive ? "border-gray-100 hover:border-[#D4EDA8]" : "border-gray-100 opacity-70"
    }`}>
      {/* Status Indicator */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isExpired ? 'bg-gray-300' : isFull ? 'bg-red-400' : isActive ? 'bg-gradient-to-r from-[#679632] to-[#D4EDA8]' : 'bg-amber-400'}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isActive ? "bg-gradient-to-br from-[#F6FAF0] to-[#D4EDA8]" : "bg-gray-100"}`}>
              {code.type === "percent"
                ? <Percent className={`w-6 h-6 ${isActive ? "text-[#1F4A10]" : "text-gray-400"}`} />
                : <DollarSign className={`w-6 h-6 ${isActive ? "text-[#1F4A10]" : "text-gray-400"}`} />
              }
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-heading font-black text-[#1F4A10] text-lg tracking-widest">{code.code}</p>
                <button onClick={() => onCopy(code.code)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors" title="نسخ الكود">
                  {copied === code.code ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{code.description}</p>
            </div>
          </div>
        </div>

        {/* Discount & Usage */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`px-5 py-3 rounded-2xl font-heading font-black text-3xl ${isActive ? "bg-[#F6FAF0] text-[#1F4A10]" : "bg-gray-50 text-gray-400"}`}>
            {code.type === "percent" ? `${code.discount}%` : `${code.discount}₺`}
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-bold text-gray-500">نسبة الاستخدام</span>
              <span className="font-black text-[#1F4A10]">{code.used}/{code.maxUses}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${usedPct}%` }} transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${usedPct >= 90 ? "bg-red-500" : usedPct >= 60 ? "bg-amber-500" : "bg-gradient-to-r from-[#679632] to-[#D4EDA8]"}`} />
            </div>
            <p className="text-[10px] text-gray-400 mt-1 text-left">{usedPct}%</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
            isExpired ? "bg-gray-50 text-gray-400 border-gray-200" :
            isFull ? "bg-red-50 text-red-600 border-red-100" :
            isActive ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"
          }`}>
            {isExpired ? "⏰ منتهي الصلاحية" : isFull ? "🔴 مستنفد بالكامل" : isActive ? "✅ نشط" : "⏸️ موقوف"}
          </span>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1 ${
            code.platform === "android" ? "bg-green-50 text-green-700 border-green-100" :
            code.platform === "ios" ? "bg-gray-50 text-gray-600 border-gray-200" :
            "bg-blue-50 text-blue-700 border-blue-100"
          }`}>
            {code.platform === "android" ? <><Smartphone className="w-2.5 h-2.5"/>Android</> :
             code.platform === "ios" ? <><Apple className="w-2.5 h-2.5"/>iOS</> :
             <>كافة المنصات</>}
          </span>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
            code.targetType === "vip" ? "bg-amber-50 text-amber-700 border-amber-100" :
            code.targetType === "new" ? "bg-blue-50 text-blue-700 border-blue-100" :
            "bg-gray-50 text-gray-600 border-gray-200"
          }`}>
            {code.targetType === "vip" ? "⭐ VIP" : code.targetType === "new" ? "🆕 جدد" : "👥 الكل"}
          </span>
        </div>

        {/* Expiry & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> ينتهي {new Date(code.expiry).toLocaleDateString("ar-SA")}</span>
          <div className="flex gap-1.5">
            <button onClick={onToggle} className={`p-2 rounded-xl text-xs font-bold transition-colors ${
              code.active ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-green-50 text-green-700 hover:bg-green-100"
            }`} title={code.active ? "إيقاف" : "تفعيل"}>
              <Power className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="حذف">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Marketing() {
  const [codes, setCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem("mashwar_promo_codes");
      return saved ? JSON.parse(saved) : INITIAL_CODES;
    } catch { return INITIAL_CODES; }
  });
  const [tab, setTab] = useState<"promo" | "notifications" | "stats">("promo");
  const [showNewCode, setShowNewCode] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [notifTarget, setNotifTarget] = useState<"all" | "specific">("all");
  const [selectedDriverUuids, setSelectedDriverUuids] = useState<string[]>([]);
  const [driverSearch, setDriverSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success", show: false });
  const [newCode, setNewCode] = useState({ code: "", discount: "", type: "percent" as const, maxUses: "100", expiry: "", description: "", platform: "all" as const, targetType: "all" as const });

  useEffect(() => {
    getDrivers().then((r) => setDrivers(r.data ?? [])).catch(() => {});
  }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const saveCodes = (updated: PromoCode[]) => {
    setCodes(updated);
    localStorage.setItem("mashwar_promo_codes", JSON.stringify(updated));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code); setTimeout(() => setCopied(null), 2000);
  };

  const toggleCode = (id: number) => saveCodes(codes.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  const deleteCode = (id: number) => { if (confirm("هل تريد حذف هذا الكود نهائياً؟")) saveCodes(codes.filter((c) => c.id !== id)); };

  const addCode = () => {
    if (!newCode.code || !newCode.discount) { showToast("الكود ومبلغ الخصم مطلوبان", "error"); return; }
    const c: PromoCode = {
      id: Date.now(), code: newCode.code.toUpperCase().replace(/\s/g, ""),
      discount: parseFloat(newCode.discount), type: newCode.type,
      maxUses: parseInt(newCode.maxUses) || 100, used: 0,
      expiry: newCode.expiry || "2026-12-31", active: true,
      platform: newCode.platform, description: newCode.description,
      createdAt: new Date().toISOString().slice(0, 10),
      targetType: newCode.targetType,
    };
    saveCodes([...codes, c]);
    setNewCode({ code: "", discount: "", type: "percent", maxUses: "100", expiry: "", description: "", platform: "all", targetType: "all" });
    setShowNewCode(false);
    showToast(`تم إنشاء كود الخصم ${c.code} بنجاح`);
  };

  const sendNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifBody) { showToast("العنوان والمحتوى مطلوبان", "error"); return; }
    setSending(true);
    try {
      if (notifTarget === "specific" && selectedDriverUuids.length > 0) {
        await Promise.all(selectedDriverUuids.map((uuid) => sendDriverNotification({ title: notifTitle, body: notifBody, uuid })));
      } else {
        await sendDriverNotification({ title: notifTitle, body: notifBody });
      }
      showToast("تم إرسال الإشعار التسويقي بنجاح");
      setNotifTitle(""); setNotifBody(""); setSelectedDriverUuids([]);
    } catch (e: unknown) { showToast(e instanceof Error ? e.message : String(e), "error"); }
    finally { setSending(false); }
  };

  const filteredCodes = codes.filter((c) => {
    const matchSearch = !search || c.code.includes(search.toUpperCase()) || c.description.includes(search);
    const matchStatus = filterStatus === "all" || (filterStatus === "active" && c.active) || (filterStatus === "inactive" && !c.active) || (filterStatus === "expired" && new Date(c.expiry) < new Date());
    return matchSearch && matchStatus;
  });

  const activeCount = codes.filter((c) => c.active && new Date(c.expiry) >= new Date()).length;
  const totalUses = codes.reduce((s, c) => s + c.used, 0);
  const totalSavings = codes.reduce((s, c) => s + (c.type === "fixed" ? c.used * c.discount : 0), 0);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 ${toast.type === 'success' ? "bg-[#1F4A10] text-white" : "bg-red-600 text-white"}`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#1F4A10]">التسويق والعروض الترويجية</h2>
          <p className="text-sm text-gray-500 mt-1">إدارة أكواد الخصم وحملات الإشعارات التسويقية لجميع المنصات</p>
        </div>
      </div>

      {/* KPI Stats */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "أكواد خصم نشطة", value: activeCount, icon: Tag, color: "#1F4A10", bg: "#F6FAF0", trend: "+2 هذا الشهر" },
          { label: "إجمالي عمليات الاستخدام", value: totalUses.toLocaleString(), icon: TrendingUp, color: "#16a34a", bg: "#dcfce7", trend: "↑ 15% هذا الأسبوع" },
          { label: "قيمة الخصومات الممنوحة", value: `${totalSavings.toLocaleString()} ر.س`, icon: DollarSign, color: "#7c3aed", bg: "#ede9fe", trend: "خصومات ثابتة فقط" },
          { label: "الوصول التسويقي", value: drivers.length, icon: Users, color: "#0891b2", bg: "#cffafe", trend: "سائقون مسجلون" },
        ].map((s, i) => (
          <motion.div variants={itemVariants} key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-30 group-hover:scale-125 transition-transform duration-500" style={{ background: s.bg }} />
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative z-10" style={{ background: s.bg }}>
              <s.icon className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <p className="text-3xl font-heading font-black relative z-10" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-bold text-gray-500 mt-1 relative z-10">{s.label}</p>
            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1 relative z-10"><ArrowUpRight className="w-3 h-3"/> {s.trend}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col" style={{ minHeight: "500px" }}>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          {([
            { key: "promo", label: `أكواد الخصم (${codes.length})`, icon: Tag },
            { key: "notifications", label: "حملات تسويقية", icon: Sparkles },
            { key: "stats", label: "ملخص الأداء", icon: BarChart2 },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all flex-1 md:flex-none md:w-52 ${
                tab === t.key ? "border-[#679632] text-[#1F4A10] bg-white" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <t.icon className={`w-4 h-4 ${tab === t.key ? "text-[#679632]" : ""}`} /> {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 md:p-6 bg-gray-50/30">
          <AnimatePresence mode="wait">
            
            {/* PROMO CODES TAB */}
            {tab === "promo" && (
              <motion.div key="promo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                
                {/* Filters */}
                <div className="flex gap-3 flex-wrap items-center">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن كود خصم..."
                      className="w-full pr-12 pl-4 py-3 rounded-xl bg-white border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all" />
                  </div>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    {[["all","الكل"], ["active","نشط"], ["inactive","موقوف"], ["expired","منتهي"]].map(([val, label]) => (
                      <button key={val} onClick={() => setFilterStatus(val)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === val ? "bg-white shadow-sm text-[#1F4A10]" : "text-gray-500 hover:text-gray-700"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowNewCode(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#2A6A14] text-white text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95">
                    <Plus className="w-5 h-5" /> كود جديد
                  </button>
                </div>

                {/* Codes Grid */}
                {filteredCodes.length === 0 ? (
                  <div className="bg-white rounded-3xl p-20 text-center border border-gray-100">
                    <Tag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="font-heading font-black text-gray-700 text-xl mb-2">لا توجد أكواد خصم</p>
                    <p className="text-gray-500 text-sm mb-6">ابدأ بإنشاء كود خصم جديد لتشجيع العملاء على استخدام المنصة</p>
                    <button onClick={() => setShowNewCode(true)} className="px-6 py-3 bg-[#1F4A10] text-white rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-md active:scale-95"><Plus className="w-5 h-5"/> إنشاء كود</button>
                  </div>
                ) : (
                  <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredCodes.map((c) => (
                      <CodeCard key={c.id} code={c} onToggle={() => toggleCode(c.id)} onDelete={() => deleteCode(c.id)} onCopy={copyCode} copied={copied} />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {tab === "notifications" && (
              <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid lg:grid-cols-12 gap-6">
                
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                  <form onSubmit={sendNotif} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                    <h3 className="font-heading font-black text-[#1F4A10] text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" /> إنشاء حملة تسويقية جديدة
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">الجمهور المستهدف</label>
                      <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button type="button" onClick={() => setNotifTarget("all")}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${notifTarget === "all" ? "bg-white shadow-sm text-[#1F4A10]" : "text-gray-500"}`}>
                          جميع السائقين ({drivers.length})
                        </button>
                        <button type="button" onClick={() => setNotifTarget("specific")}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${notifTarget === "specific" ? "bg-white shadow-sm text-[#1F4A10]" : "text-gray-500"}`}>
                          سائقون محددون
                        </button>
                      </div>
                    </div>

                    {notifTarget === "specific" && (
                      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-3 bg-white border-b border-gray-200">
                          <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input value={driverSearch} onChange={(e) => setDriverSearch(e.target.value)} placeholder="ابحث عن سائق..."
                              className="w-full pr-9 pl-3 py-2 rounded-lg bg-gray-50 text-xs outline-none focus:bg-white transition-all" />
                          </div>
                        </div>
                        <div className="max-h-40 overflow-y-auto p-2 space-y-1 custom-scroll">
                          {drivers.filter((d) => !driverSearch || d.name?.includes(driverSearch) || d.phone?.includes(driverSearch)).map((d) => (
                            <label key={d.uuid} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedDriverUuids.includes(d.uuid) ? "bg-[#F6FAF0] border border-[#D4EDA8]" : "hover:bg-gray-100 border border-transparent"}`}>
                              <input type="checkbox" checked={selectedDriverUuids.includes(d.uuid)} onChange={() => setSelectedDriverUuids(prev => prev.includes(d.uuid) ? prev.filter(u => u !== d.uuid) : [...prev, d.uuid])} className="w-4 h-4 rounded accent-[#679632]" />
                              <span className="text-xs font-bold text-gray-700">{d.name}</span>
                            </label>
                          ))}
                        </div>
                        {selectedDriverUuids.length > 0 && (
                          <div className="p-2 border-t border-gray-200 bg-white flex justify-between items-center">
                            <span className="text-xs font-bold text-[#1F4A10]">{selectedDriverUuids.length} سائق محدد</span>
                            <button type="button" onClick={() => setSelectedDriverUuids([])} className="text-xs text-red-500 hover:underline">مسح الكل</button>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">عنوان الإشعار</label>
                      <input value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} placeholder="مثال: عرض حصري من مشوار!"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">نص الرسالة التسويقية</label>
                      <textarea value={notifBody} onChange={(e) => setNotifBody(e.target.value)} rows={4} placeholder="اكتب رسالة تسويقية جذابة..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white resize-none" />
                    </div>

                    <button type="submit" disabled={sending || !notifTitle || !notifBody}
                      className="w-full py-4 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#2A6A14] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]">
                      {sending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                      {sending ? "جاري الإرسال..." : "بث الحملة التسويقية"}
                    </button>
                  </form>
                </div>

                {/* Templates */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                  {/* Preview */}
                  {(notifTitle || notifBody) && (
                    <div className="bg-gray-900 rounded-2xl p-5 shadow-lg">
                      <p className="text-[10px] text-gray-500 mb-3 font-bold">معاينة الإشعار على الجهاز</p>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F4A10] to-[#679632] flex items-center justify-center flex-shrink-0">
                            <Bell className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{notifTitle || "العنوان..."}</p>
                            <p className="text-xs text-white/70 mt-1 leading-relaxed">{notifBody || "المحتوى..."}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-heading font-black text-gray-800 mb-4 text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" /> قوالب تسويقية جاهزة
                    </h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto custom-scroll pr-1">
                      {NOTIF_TEMPLATES.map((t, i) => (
                        <button key={i} type="button" onClick={() => { setNotifTitle(t.title); setNotifBody(t.body); }}
                          className="w-full text-right p-3 rounded-xl bg-gray-50 hover:bg-[#F6FAF0] hover:border-[#D4EDA8] transition-colors border border-gray-100 group">
                          <p className="font-bold text-gray-800 text-xs mb-0.5 group-hover:text-[#1F4A10] transition-colors">{t.label}</p>
                          <p className="text-[10px] text-gray-500 truncate">{t.body}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STATS TAB */}
            {tab === "stats" && (
              <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-6">
                
                {/* Performance Summary */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-heading font-black text-[#1F4A10] mb-6 flex items-center gap-2 text-lg">
                    <BarChart2 className="w-5 h-5 text-[#679632]" /> أداء أكواد الخصم
                  </h3>
                  <div className="space-y-4">
                    {codes.sort((a,b) => b.used - a.used).slice(0,5).map((code) => {
                      const pct = code.maxUses > 0 ? Math.round((code.used / code.maxUses) * 100) : 0;
                      return (
                        <div key={code.id} className="flex items-center gap-4 group">
                          <div className="w-20 text-left">
                            <p className="font-heading font-black text-[#1F4A10] text-sm tracking-widest">{code.code}</p>
                          </div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 60 ? "bg-amber-500" : "bg-gradient-to-r from-[#679632] to-[#D4EDA8]"}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-500 w-16 text-left">{code.used}/{code.maxUses}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-heading font-black text-[#1F4A10] mb-6 flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-[#679632]" /> ملخص تفصيلي
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "إجمالي الأكواد", value: codes.length, bg: "#F6FAF0", color: "#1F4A10" },
                      { label: "أكواد نشطة", value: activeCount, bg: "#dcfce7", color: "#16a34a" },
                      { label: "أكواد منتهية", value: codes.filter(c => new Date(c.expiry) < new Date()).length, bg: "#fef2f2", color: "#dc2626" },
                      { label: "أكواد موقوفة", value: codes.filter(c => !c.active).length, bg: "#fef3c7", color: "#d97706" },
                      { label: "خصومات نسبية (%)", value: codes.filter(c => c.type === "percent").length, bg: "#ede9fe", color: "#7c3aed" },
                      { label: "خصومات ثابتة (ر.س)", value: codes.filter(c => c.type === "fixed").length, bg: "#dbeafe", color: "#2563eb" },
                      { label: "استهداف VIP", value: codes.filter(c => c.targetType === "vip").length, bg: "#fff7ed", color: "#c2410c" },
                      { label: "كود مستنفد", value: codes.filter(c => c.used >= c.maxUses).length, bg: "#f1f5f9", color: "#475569" },
                    ].map((s, i) => (
                      <div key={i} className="rounded-2xl p-4 border border-gray-100/50 text-center transition-shadow hover:shadow-sm" style={{ background: s.bg }}>
                        <p className="text-2xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-xs font-bold text-gray-500 mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* New Code Modal */}
      <AnimatePresence>
        {showNewCode && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setShowNewCode(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-6 md:p-8 space-y-6 border border-gray-100" onClick={(e) => e.stopPropagation()}>
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F6FAF0] to-[#D4EDA8] flex items-center justify-center shadow-sm border border-[#D4EDA8]">
                    <Gift className="w-6 h-6 text-[#1F4A10]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-[#1F4A10] text-xl">إنشاء كود خصم جديد</h3>
                    <p className="text-sm text-gray-500 mt-0.5">سيكون متاحاً للعملاء فوراً بعد الحفظ</p>
                  </div>
                </div>
                <button onClick={() => setShowNewCode(false)} className="p-2 bg-gray-50 hover:bg-red-50 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-2">رمز الكود *</label>
                    <input value={newCode.code} onChange={(e) => setNewCode(p => ({...p, code: e.target.value}))} placeholder="مثال: SUMMER2026" dir="ltr"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-black tracking-[0.3em] text-center text-[#1F4A10] outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white uppercase" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">نوع الخصم</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button type="button" onClick={() => setNewCode(p => ({...p, type: "percent"}))}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${newCode.type === "percent" ? "bg-white shadow-sm text-[#1F4A10]" : "text-gray-500"}`}>نسبة %</button>
                      <button type="button" onClick={() => setNewCode(p => ({...p, type: "fixed"}))}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${newCode.type === "fixed" ? "bg-white shadow-sm text-[#1F4A10]" : "text-gray-500"}`}>مبلغ ثابت</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">قيمة الخصم *</label>
                    <input type="number" value={newCode.discount} onChange={(e) => setNewCode(p => ({...p, discount: e.target.value}))} placeholder={newCode.type === "percent" ? "20" : "50"}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">أقصى عدد استخدام</label>
                    <input type="number" value={newCode.maxUses} onChange={(e) => setNewCode(p => ({...p, maxUses: e.target.value}))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">تاريخ الانتهاء</label>
                    <input type="date" value={newCode.expiry} onChange={(e) => setNewCode(p => ({...p, expiry: e.target.value}))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-2">وصف الكود</label>
                    <input value={newCode.description} onChange={(e) => setNewCode(p => ({...p, description: e.target.value}))} placeholder="خصم خاص بمناسبة..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">المنصة</label>
                    <select value={newCode.platform} onChange={(e) => setNewCode(p => ({...p, platform: e.target.value as any}))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] bg-white">
                      <option value="all">كافة المنصات</option>
                      <option value="android">Android فقط</option>
                      <option value="ios">iOS فقط</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">الفئة المستهدفة</label>
                    <select value={newCode.targetType} onChange={(e) => setNewCode(p => ({...p, targetType: e.target.value as any}))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] bg-white">
                      <option value="all">جميع المستخدمين</option>
                      <option value="new">المستخدمون الجدد</option>
                      <option value="vip">عملاء VIP</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button onClick={addCode}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#2A6A14] text-white font-bold text-base hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1F4A10]/20 active:scale-[0.98]">
                  <CheckCircle2 className="w-5 h-5" /> اعتماد الكود الجديد
                </button>
                <button onClick={() => setShowNewCode(false)}
                  className="px-6 py-4 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors active:scale-[0.98]">
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
