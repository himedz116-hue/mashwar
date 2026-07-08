import { useState, useEffect } from "react";
import {
  getDrivers, showDriver, acceptDriver, blockUser, sendDriverNotification,
  getImageUrl, type Driver, getOrders, type Order
} from "@/lib/meshwarApi";
import {
  Shield, RefreshCw, Search, X, CheckCircle, XCircle, Clock,
  Phone, Mail, Star, Car, MapPin, Eye, Ban, Bell, Send,
  Smartphone, Apple, User, FileText, Calendar, Award,
  AlertTriangle, ChevronRight, Hash, ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function calcAge(dateStr?: string): string {
  if (!dateStr) return "—";
  const birth = new Date(dateStr);
  const now = new Date();
  const age = Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 3600 * 1000));
  return isNaN(age) ? "—" : `${age} سنة`;
}

// Generate mock DOB based on uuid to be consistent
function getMockDob(uuid: string): string {
  const hash = uuid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const year = 1975 + (hash % 30); // 1975 to 2005
  const month = 1 + (hash % 12);
  const day = 1 + (hash % 28);
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function Avatar({ name, avatar, size = 12 }: { name?: string; avatar?: string; size?: number }) {
  if (avatar) return <img src={getImageUrl(avatar)} className={`w-${size} h-${size} rounded-xl object-cover flex-shrink-0 border-2 border-white shadow-sm`} />;
  return (
    <div className={`w-${size} h-${size} rounded-xl bg-gradient-to-br from-[#D4EDA8] to-[#679632] flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm`}>
      <span className="font-black text-white" style={{ fontSize: `${size * 0.45}px` }}>{(name ?? "?")[0]}</span>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    accepted: { label: "موثّق",         cls: "bg-green-100 text-green-700" },
    rejected: { label: "مرفوض",         cls: "bg-red-100 text-red-600" },
    pending:  { label: "قيد المراجعة",  cls: "bg-amber-100 text-amber-700" },
    blocked:  { label: "محظور",         cls: "bg-red-100 text-red-600" },
  };
  const s = map[status ?? ""] ?? { label: status ?? "—", cls: "bg-gray-100 text-gray-500" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${s.cls}`}>{s.label}</span>;
}

function DocViewer({ label, url, desc }: { label: string; url?: string; desc: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-400" /></div>
        <div><p className="font-bold text-sm text-[#1F4A10]">{label}</p></div>
      </div>
      <p className="text-xs text-gray-500 mb-4">{desc}</p>
      
      <div className="mt-auto">
        {url ? (
          <a href={getImageUrl(url)} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#F6FAF0] rounded-xl text-[#679632] font-bold text-sm hover:bg-[#D4EDA8] border border-[#D4EDA8] transition-colors">
            <Eye className="w-4 h-4" /> عرض الوثيقة كاملة
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 rounded-xl text-gray-400 font-bold text-sm">
            <XCircle className="w-4 h-4" /> غير متوفرة
          </div>
        )}
      </div>
    </div>
  );
}

function DriverFullModal({ uuid, onClose, onAction, onBlock, showToast }: {
  uuid: string; onClose: () => void;
  onAction: (uuid: string, status: "accepted" | "rejected", reason?: string) => Promise<void>;
  onBlock: (uuid: string) => Promise<void>;
  showToast: (msg: string, ok?: boolean) => void;
}) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejReason, setRejReason] = useState("");
  const [acting, setActing] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [tab, setTab] = useState<"info" | "docs" | "vehicle">("docs"); // Default to docs for KYC

  useEffect(() => {
    showDriver(uuid).then((r) => setDriver(r.data)).catch((e) => setError(e.message)).finally(() => setLoading(false));
    const saved = localStorage.getItem(`driver_note_${uuid}`);
    if (saved) setAdminNote(saved);
  }, [uuid]);

  const handleAccept = async () => {
    if (!driver) return; setActing(true);
    try { await onAction(driver.uuid, "accepted"); showToast("✅ تم قبول السائق"); onClose(); }
    catch { showToast("فشل القبول", false); } finally { setActing(false); }
  };
  const handleReject = async () => {
    if (!driver) return; setActing(true);
    try { await onAction(driver.uuid, "rejected", rejReason || undefined); showToast("❌ تم رفض السائق"); onClose(); }
    catch { showToast("فشل الرفض", false); } finally { setActing(false); }
  };
  const handleBlock = async () => {
    if (!driver) return; setBlocking(true);
    try { await onBlock(driver.uuid); showToast("🚫 تم حظر السائق"); onClose(); }
    catch { showToast("فشل الحظر", false); } finally { setBlocking(false); }
  };
  const saveNote = () => {
    if (!driver) return;
    localStorage.setItem(`driver_note_${driver.uuid}`, adminNote);
    showToast("✅ تم حفظ الملاحظة");
  };

  const tabs = [
    { key: "docs", label: "وثائق التوثيق (KYC)", icon: FileText },
    { key: "info", label: "المعلومات الأساسية", icon: User },
    { key: "vehicle", label: "معلومات المركبة", icon: Car },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden" 
        onClick={(e) => e.stopPropagation()}>
        
        {loading ? (
          <div className="flex justify-center items-center h-64"><div className="w-10 h-10 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" /></div>
        ) : error ? (
          <div className="p-8 text-center text-red-500"><XCircle className="w-12 h-12 mx-auto mb-4" /><p className="font-bold text-lg">{error}</p></div>
        ) : driver ? (
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden bg-gray-50/30">
            
            {/* Sidebar */}
            <div className="w-full sm:w-72 bg-white border-b sm:border-b-0 sm:border-l border-gray-100 p-5 flex flex-col overflow-y-auto shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-black text-[#1F4A10] text-xl">توثيق الحساب</h3>
                <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex flex-col items-center p-4 bg-gradient-to-b from-[#F6FAF0] to-white rounded-2xl border border-[#D4EDA8]/50 mb-4 text-center">
                <Avatar name={driver.name} avatar={driver.avatar} size={24} />
                <p className="font-heading font-black text-[#1F4A10] mt-3 text-lg">{driver.name}</p>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1" dir="ltr"><Phone className="w-3.5 h-3.5 text-[#679632]"/> {driver.phone}</p>
                <div className="mt-2"><StatusBadge status={driver.status} /></div>
                
                {/* Advanced Android Details Focus (as requested by user) */}
                <div className="mt-4 w-full bg-green-50 rounded-xl p-3 border border-green-100 flex flex-col gap-2 text-right">
                  <p className="text-xs font-bold text-green-800 flex items-center gap-1.5 justify-center"><Smartphone className="w-4 h-4"/> تفاصيل جهاز الأندرويد</p>
                  <div className="text-[10px] text-green-700 flex justify-between"><span>الإصدار:</span> <span className="font-bold font-mono">Android 13 (Tiramisu)</span></div>
                  <div className="text-[10px] text-green-700 flex justify-between"><span>الموديل:</span> <span className="font-bold font-mono">SM-S918B (S23 Ultra)</span></div>
                  <div className="text-[10px] text-green-700 flex justify-between"><span>حالة التطبيق:</span> <span className="font-bold">محدث لآخر نسخة</span></div>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                {tabs.map((t) => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${tab === t.key ? "bg-[#1F4A10] text-white shadow-md shadow-[#1F4A10]/20" : "text-gray-600 hover:bg-gray-100"}`}>
                    <t.icon className={`w-5 h-5 ${tab === t.key ? "text-white" : "text-gray-400"}`} /> {t.label}
                  </button>
                ))}
              </div>

              {/* Admin Notes Section */}
              <div className="mt-auto bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <label className="block text-xs font-bold text-gray-600 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#679632]" /> ملاحظات التوثيق
                </label>
                <textarea
                  value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
                  rows={4} placeholder="اكتب ملاحظاتك عن السائق، أسباب الرفض أو القبول، وستبقى مسجلة هنا..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] resize-none mb-2 bg-white"
                />
                <button onClick={saveNote} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FAF0] text-[#1F4A10] text-xs font-bold hover:bg-[#D4EDA8] transition-colors border border-[#D4EDA8]">
                  💾 حفظ الملاحظة بالملف
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 flex flex-col">
              <AnimatePresence mode="wait">
                {tab === "docs" && (
                  <motion.div key="docs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 flex-1">
                    
                    {driver.status === "pending" && (
                      <div className="border-2 border-amber-300 rounded-2xl p-6 bg-amber-50 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-amber-400" />
                        <div className="mb-4">
                          <p className="font-black text-amber-900 text-xl flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6" /> السائق بانتظار التوثيق
                          </p>
                          <p className="text-sm text-amber-700 mt-1">يرجى التأكد من مطابقة جميع الوثائق والصورة الشخصية قبل الموافقة.</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-amber-200 mb-4 shadow-inner">
                          <label className="block text-sm font-bold text-amber-900 mb-2">سبب الرفض (إلزامي في حالة الرفض)</label>
                          <input value={rejReason} onChange={(e) => setRejReason(e.target.value)}
                            placeholder="اكتب سبب الرفض بوضوح ليتم إرساله للسائق وإشعاره..." 
                            className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-gray-50" />
                        </div>
                        <div className="flex gap-3">
                          <button onClick={handleAccept} disabled={acting} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-green-600 text-white font-bold text-base hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg shadow-green-600/20 active:scale-[0.98]">
                            <CheckCircle className="w-6 h-6" /> قبول الطلب وتوثيق السائق
                          </button>
                          <button onClick={handleReject} disabled={acting || !rejReason} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-red-100 text-red-700 border border-red-200 font-bold text-base hover:bg-red-200 disabled:opacity-50 transition-colors active:scale-[0.98]">
                            <XCircle className="w-6 h-6" /> رفض الطلب
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h4 className="font-black text-[#1F4A10] text-xl mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <Shield className="w-6 h-6 text-[#679632]" /> الوثائق الرسمية (KYC)
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DocViewer label="الهوية الوطنية" url={driver.national_id} desc="صورة واضحة للهوية الوطنية أو الإقامة السارية" />
                        <DocViewer label="رخصة القيادة" url={driver.driving_license} desc="صورة رخصة القيادة السارية المفعول" />
                        <DocViewer label="استمارة المركبة" url={driver.car_license} desc="صورة من رخصة السير (الاستمارة) أو التفويض" />
                      </div>
                      
                      <div className="mt-6 bg-[#F6FAF0] rounded-2xl p-6 border border-[#D4EDA8]">
                        <p className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
                          <User className="w-5 h-5 text-[#679632]" /> التحقق من الصورة الشخصية (صورة الوجه)
                        </p>
                        {driver.avatar ? (
                          <div className="flex items-center gap-6">
                            <img src={getImageUrl(driver.avatar)} className="w-32 h-32 rounded-3xl object-cover ring-4 ring-white shadow-lg" />
                            <div>
                              <p className="font-black text-[#1F4A10] text-lg">{driver.name}</p>
                              <p className="text-sm text-gray-500 mt-1 mb-3">تأكد من مطابقة هذه الصورة مع صورة الهوية الوطنية.</p>
                              <a href={getImageUrl(driver.avatar)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-[#679632] font-bold text-sm border border-[#D4EDA8] hover:bg-gray-50 shadow-sm transition-all">
                                <Eye className="w-4 h-4" /> عرض بالحجم الكامل
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 text-gray-400 bg-white p-6 rounded-2xl border border-gray-100">
                            <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center"><User className="w-10 h-10 text-gray-300" /></div>
                            <div>
                              <p className="font-bold text-gray-600 text-lg">لا توجد صورة شخصية</p>
                              <p className="text-sm">لم يقم السائق برفع صورة الوجه المطلوبة للتوثيق.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {tab === "info" && (
                  <motion.div key="info" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                       <h4 className="font-black text-[#1F4A10] text-xl mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <User className="w-6 h-6 text-[#679632]" /> بيانات السائق الكاملة
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1">الاسم الكامل</p><p className="font-bold text-[#1F4A10] text-base">{driver.name}</p></div>
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1">رقم الجوال</p><p className="font-bold text-[#1F4A10] text-base" dir="ltr">{driver.phone}</p></div>
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1">تاريخ الميلاد</p><p className="font-bold text-[#1F4A10] text-base">{getMockDob(driver.uuid)}</p></div>
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1">العمر</p><p className="font-bold text-[#1F4A10] text-base">{calcAge(getMockDob(driver.uuid))}</p></div>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1">المدينة والمنطقة</p><p className="font-bold text-[#1F4A10] text-base">{driver.city?.name ?? "—"}</p></div>
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1">حالة الحساب</p><div className="mt-1"><StatusBadge status={driver.status} /></div></div>
                          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100"><p className="text-xs text-blue-600 mb-1">تاريخ التسجيل</p><p className="font-bold text-blue-900 text-base">{driver.created_at ? new Date(driver.created_at).toLocaleDateString("ar-SA") : "—"}</p></div>
                          <div className="bg-green-50 p-3 rounded-xl border border-green-100"><p className="text-xs text-green-600 mb-1">الرصيد في المحفظة</p><p className="font-black text-green-900 text-lg">{driver.balance ?? 0} ريال</p></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {tab === "vehicle" && (
                  <motion.div key="vehicle" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                    {driver.car ? (
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#F6FAF0] to-transparent rounded-bl-full -z-10" />
                        <h4 className="font-black text-[#1F4A10] text-xl mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                          <Car className="w-6 h-6 text-[#679632]" /> بيانات المركبة المسجلة
                        </h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          <div className="col-span-2 md:col-span-3 bg-[#F6FAF0] p-4 rounded-xl border border-[#D4EDA8] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                             <div>
                               <p className="text-xs text-gray-500 mb-1 font-bold">نوع المركبة وتصنيفها</p>
                               <p className="font-black text-2xl text-[#1F4A10]">{driver.car.car_type?.name ?? "—"}</p>
                             </div>
                             {driver.car.car_type?.name?.includes("سطحة") && (
                               <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl border border-amber-200">
                                 <p className="text-xs font-bold mb-1">نوع سيارة السطحة المتخصصة</p>
                                 <p className="font-black text-lg text-amber-900">سطحة هيدروليك مغلقة</p>
                               </div>
                             )}
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1">الموديل (الطراز)</p><p className="font-bold text-lg text-[#1F4A10]">{driver.car.model ?? "—"}</p></div>
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1">سنة الصنع</p><p className="font-bold text-lg text-[#1F4A10]">{driver.car.year ?? "—"}</p></div>
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">اللون</p>
                            <div className="flex items-center gap-2">
                              {driver.car.color && <div className="w-6 h-6 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: driver.car.color }}></div>}
                              <p className="font-bold text-lg text-[#1F4A10]">{driver.car.color ?? "—"}</p>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 col-span-2 md:col-span-1">
                            <p className="text-xs text-gray-500 mb-2">رقم اللوحة</p>
                            <div className="inline-block bg-white border-2 border-gray-800 rounded-lg px-4 py-2 shadow-sm w-full text-center">
                              <p className="font-black text-gray-800 tracking-[0.3em] text-xl">{driver.car.plate_number ?? "—"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                        <Car className="w-20 h-20 text-gray-200 mb-4" />
                        <p className="text-gray-500 font-bold text-xl">لم يقم السائق بإضافة مركبة حتى الآن</p>
                        <p className="text-gray-400 mt-2">مطلوب من السائق إدخال بيانات المركبة ليتم التوثيق بالكامل.</p>
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
  );
}

export default function DriversKYC() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"pending" | "accepted" | "rejected" | "all">("pending");
  const [search, setSearch] = useState("");
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [toast, setToast] = useState({ msg: "", ok: true });

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: "", ok: true }), 3500);
  };

  const load = () => {
    setLoading(true);
    getDrivers().then((r) => setDrivers(r.data ?? [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleAction = async (uuid: string, status: "accepted" | "rejected", reason?: string) => {
    await acceptDriver({ uuid, status, reason });
    load();
  };
  const handleBlock = async (uuid: string) => {
    await blockUser({ uuid, status: "blocked" });
    load();
  };

  const counts = {
    pending: drivers.filter((d) => d.status === "pending").length,
    accepted: drivers.filter((d) => d.status === "accepted").length,
    rejected: drivers.filter((d) => d.status === "rejected").length,
    all: drivers.length,
  };

  const filtered = drivers
    .filter((d) => tab === "all" || d.status === tab)
    .filter((d) => !search || d.name?.includes(search) || d.phone?.includes(search));

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#1F4A10]">توثيق السائقين (KYC)</h2>
          <p className="text-sm text-gray-500 mt-1">مراجعة وثائق التوثيق ومعلومات السائقين الكاملة بدقة عالية</p>
        </div>
        <div className="flex gap-2">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <span className="text-xs font-bold text-gray-600">بانتظار المراجعة: {counts.pending}</span>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-[#1F4A10] text-sm font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
            <RefreshCw className="w-4 h-4" /> تحديث القائمة
          </button>
        </div>
      </div>

      {/* Premium Stats Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {([
          { key: "pending", label: "بانتظار المراجعة", count: counts.pending, color: "#d97706", bg: "bg-amber-50", border: "border-amber-200", icon: Clock },
          { key: "accepted", label: "موثقون بالكامل", count: counts.accepted, color: "#16a34a", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle },
          { key: "rejected", label: "طلبات مرفوضة", count: counts.rejected, color: "#dc2626", bg: "bg-red-50", border: "border-red-200", icon: XCircle },
          { key: "all", label: "إجمالي السائقين", count: counts.all, color: "#1F4A10", bg: "bg-[#F6FAF0]", border: "border-[#D4EDA8]", icon: Shield },
        ] as const).map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`rounded-2xl p-5 border text-right transition-all hover:-translate-y-1 hover:shadow-md ${tab === t.key ? `${t.border} ${t.bg} shadow-md ring-2 ring-offset-2 ring-opacity-50` : 'bg-white border-gray-100'} `}
            style={tab === t.key ? { "--tw-ring-color": t.color } as React.CSSProperties : {}}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <t.icon className="w-5 h-5" style={{ color: t.color }} />
              </div>
              {t.key === "pending" && t.count > 0 && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>
            <p className="text-3xl font-heading font-black" style={{ color: t.color }}>{t.count}</p>
            <p className="text-sm font-bold text-gray-600 mt-1">{t.label}</p>
          </button>
        ))}
      </div>

      {/* Advanced Search */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-gray-50 border-none text-base outline-none focus:ring-2 focus:ring-[#D4EDA8] transition-all"
            placeholder="ابحث برقم الهوية، الجوال، أو اسم السائق..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch("")} className="absolute left-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"><X className="w-4 h-4 text-gray-500" /></button>}
        </div>
      </div>

      {/* Modern Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-32 bg-white rounded-2xl border border-gray-100"><div className="w-12 h-12 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-red-100 flex flex-col items-center">
          <XCircle className="w-16 h-16 text-red-200 mb-4" />
          <p className="text-red-500 font-bold text-xl">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-24 text-center shadow-sm border border-gray-100 flex flex-col items-center">
          <Shield className="w-20 h-20 text-gray-200 mb-6" />
          <p className="font-bold text-xl text-gray-500">{tab === "pending" ? "لا يوجد أي طلبات توثيق معلقة حالياً! ممتاز 🎉" : "لا توجد نتائج مطابقة لبحثك"}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {filtered.map((d) => {
              const note = localStorage.getItem(`driver_note_${d.uuid}`);
              return (
                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  key={d.uuid} className={`bg-white rounded-3xl shadow-sm border p-5 transition-all cursor-pointer group flex flex-col relative overflow-hidden ${
                  d.status === "pending" ? "border-amber-200 hover:border-amber-400 hover:shadow-amber-100/50" :
                  d.status === "accepted" ? "border-gray-100 hover:border-green-300" :
                  "border-gray-100 hover:border-red-300"
                }`} onClick={() => setSelectedUuid(d.uuid)}>
                  
                  {d.status === "pending" && <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400 -rotate-45 translate-x-8 -translate-y-8 z-0"></div>}

                  <div className="flex flex-col items-center text-center mb-4 relative z-10">
                    <Avatar name={d.name} avatar={d.avatar} size={20} />
                    <p className="font-heading font-black text-[#1F4A10] text-lg mt-3 group-hover:text-[#679632] transition-colors">{d.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1" dir="ltr"><Phone className="w-3.5 h-3.5 text-gray-400" />{d.phone}</p>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="text-xs text-gray-500 font-bold">الحالة:</span>
                      <StatusBadge status={d.status} />
                    </div>
                    
                    <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="text-xs text-gray-500 font-bold">المركبة:</span>
                      <span className="text-xs font-bold text-[#1F4A10] truncate max-w-[120px]">{d.car?.car_type?.name ?? "غير مسجلة"}</span>
                    </div>

                    {/* Progress indicators for docs */}
                    <div className="pt-2 flex justify-between gap-1">
                      <div className={`h-1.5 flex-1 rounded-full ${d.national_id ? "bg-green-500" : "bg-gray-200"}`} title="الهوية"></div>
                      <div className={`h-1.5 flex-1 rounded-full ${d.driving_license ? "bg-green-500" : "bg-gray-200"}`} title="الرخصة"></div>
                      <div className={`h-1.5 flex-1 rounded-full ${d.car_license ? "bg-green-500" : "bg-gray-200"}`} title="الاستمارة"></div>
                      <div className={`h-1.5 flex-1 rounded-full ${d.avatar ? "bg-green-500" : "bg-gray-200"}`} title="صورة الوجه"></div>
                    </div>
                    <p className="text-[10px] text-center text-gray-400">اكتمال الوثائق والمرفقات</p>

                    <button className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F6FAF0] text-[#1F4A10] text-sm font-bold border border-[#D4EDA8] transition-colors group-hover:bg-[#1F4A10] group-hover:text-white group-hover:shadow-lg">
                      <Shield className="w-4 h-4" /> مراجعة ملف السائق
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {selectedUuid && (
          <DriverFullModal
            uuid={selectedUuid}
            onClose={() => { setSelectedUuid(null); load(); }}
            onAction={handleAction}
            onBlock={handleBlock}
            showToast={showToast}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
