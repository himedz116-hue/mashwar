import { useState, useEffect, useRef } from "react";
import { getIntroductions, addIntroduction, editIntroduction, deleteIntroduction, getAdminToken, getImageUrl, type Introduction } from "@/lib/meshwarApi";
import {
  BookOpen, RefreshCw, Plus, Trash2, X, Check, Upload, Smartphone, Apple,
  Eye, CheckCircle2, AlertCircle, Layers, Users, Car, ChevronLeft, ChevronRight,
  Image as ImageIcon, GripVertical, Sparkles, ArrowUp, ArrowDown, Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = (import.meta.env.VITE_MESHWAR_API_URL as string | undefined) ?? "https://meshwarsv2.meshwars.net";

async function saveIntroduction(form: Partial<Introduction> & { imageFile?: File }) {
  const fd = new FormData();
  if (form.title) fd.append("title", form.title);
  if (form.description) fd.append("description", form.description);
  if (form.type != null) fd.append("type", String(form.type));
  if (form.sort != null) fd.append("sort", String(form.sort));
  if (form.imageFile) fd.append("image", form.imageFile);
  const url = form.uuid
    ? `${API_BASE}/api/admin/introductions/update`
    : `${API_BASE}/api/admin/introductions/store`;
  if (form.uuid) fd.append("uuid", form.uuid);
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${getAdminToken()}`, Accept: "application/json" },
    body: fd,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message ?? `خطأ ${res.status}`);
  return json;
}

type FormState = Partial<Introduction> & { imageFile?: File; imagePreview?: string };

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const TYPE_MAP: Record<number, { label: string; color: string; bg: string; icon: typeof Users }> = {
  1: { label: "تطبيق العملاء", color: "#2563eb", bg: "#dbeafe", icon: Users },
  2: { label: "تطبيق السائقين", color: "#16a34a", bg: "#dcfce7", icon: Car },
};

function Modal({ initial, onSave, onClose }: {
  initial: FormState; onSave: (d: FormState) => Promise<void>; onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initial.uuid;
  const set = (k: keyof FormState, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { set("imageFile", file); set("imagePreview", URL.createObjectURL(file)); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description) { setErr("الوصف مطلوب"); return; }
    setSaving(true); setErr("");
    try { await onSave(form); onClose(); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setSaving(false); }
  };

  const previewSrc = form.imagePreview ?? form.image;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <motion.form initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scroll border border-gray-100"
        onSubmit={submit} onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F6FAF0] to-[#D4EDA8] flex items-center justify-center shadow-sm border border-[#D4EDA8]">
              <Layers className="w-6 h-6 text-[#1F4A10]" />
            </div>
            <div>
              <h3 className="font-heading font-black text-[#1F4A10] text-2xl">{isEdit ? "تحديث الشريحة" : "إضافة شريحة تعريفية"}</h3>
              <p className="text-sm text-gray-500 mt-0.5">ستظهر للمستخدمين عند فتح التطبيق لأول مرة</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 bg-gray-50 hover:bg-red-50 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Image Upload Area */}
          <div className="md:col-span-2 flex flex-col">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-[250px]">
              {previewSrc ? (
                <div className="relative w-full h-full">
                  <img src={getImageUrl(previewSrc)} className="w-full h-full object-cover rounded-xl" />
                  <button type="button" onClick={() => { set("imageFile", undefined); set("imagePreview", ""); set("image", ""); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="absolute bottom-2 left-2 right-2 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-xs font-bold text-[#1F4A10] hover:bg-white transition-colors text-center shadow-sm">
                    تغيير الصورة
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#679632] hover:bg-[#F6FAF0] transition-all p-6">
                  <Upload className="w-10 h-10 text-gray-400" />
                  <span className="text-sm font-bold text-gray-500">اسحب صورة أو اضغط للاختيار</span>
                  <span className="text-[10px] text-gray-400">PNG, JPG — أبعاد مثالية: 1080×1920</span>
                </button>
              )}
            </div>
            {form.imageFile && <p className="text-xs text-green-600 mt-2 font-bold text-center">✅ {form.imageFile.name}</p>}
          </div>

          {/* Fields */}
          <div className="md:col-span-3 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">الوصف التوضيحي *</label>
              <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={4}
                placeholder="وصف مختصر يظهر في شريحة التعريف..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">النوع / الجمهور</label>
              <select value={form.type ?? 1} onChange={(e) => set("type", Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] bg-white">
                <option value={1}>👥 تطبيق المستخدمين (العملاء)</option>
                <option value={2}>🚛 تطبيق السائقين</option>
              </select>
            </div>
          </div>
        </div>

        {err && (
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm font-bold">{err}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex gap-3">
          <button type="submit" disabled={saving}
            className="flex-1 py-4 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#2A6A14] text-white font-bold text-base hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]">
            {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            {saving ? "جاري الحفظ..." : isEdit ? "اعتماد التعديلات" : "إضافة الشريحة"}
          </button>
          <button type="button" onClick={onClose} className="px-6 py-4 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors">إلغاء</button>
        </div>
      </motion.form>
    </div>
  );
}

function PhonePreview({ items, currentSlide, onSlideChange }: { items: Introduction[]; currentSlide: number; onSlideChange: (i: number) => void }) {
  const total = items.length;
  const safeIndex = total > 0 ? currentSlide % total : 0;
  const slide = total > 0 ? items[safeIndex] : {
    title: "",
    description: "امكانية النقل أصبح سهل وبين ايدك",
    image: ""
  } as Introduction;

  const handleSkip = () => {
    if (total > 0) onSlideChange((safeIndex + 1) % total);
  };

  return (
    <div className="relative max-w-[280px] mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Phone shell */}
      <div className="rounded-[40px] border-[6px] border-black bg-white overflow-hidden shadow-2xl" style={{ aspectRatio: "9/19.5" }}>
        
        {/* Notch */}
        <div className="relative w-full flex justify-center pt-2 pb-1 bg-[#F5F5F0]">
          <div className="w-[80px] h-[22px] bg-black rounded-full" />
        </div>

        {/* Screen */}
        <div className="flex flex-col h-[calc(100%-30px)] bg-[#F5F5F0]">
          
          {/* Slide counter */}
          {total > 0 && (
            <div className="flex justify-center pt-2">
              <span className="text-[9px] text-gray-400 font-semibold bg-white/70 px-2 py-0.5 rounded-full">{safeIndex + 1} / {total}</span>
            </div>
          )}

          {/* Image area */}
          <div className="flex-1 flex items-center justify-center px-4 py-2 min-h-0">
            {slide.image ? (
              <img src={getImageUrl(slide.image)} className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-center text-gray-300 flex flex-col items-center">
                <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                <span className="text-[9px] font-normal">أضف صورة</span>
              </div>
            )}
          </div>

          {/* Bottom white card - rounded top, flat bottom */}
          <div className="bg-white rounded-t-[24px] px-5 pt-8 pb-5 flex flex-col items-center text-center shrink-0 relative" style={{ minHeight: "50%" }}>
            {/* Top shadow overlay */}
            <div className="absolute -top-[20px] left-0 right-0 h-[20px] pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.06), transparent)" }} />
            
            <p className="font-semibold text-[#374151] text-[13px] leading-[1.9] mb-2">
              {slide.description || slide.title || "امكانية النقل أصبح سهل وبين ايدك"}
            </p>

            <div className="w-full flex flex-col items-center mt-4">
              <div className="flex items-center justify-center gap-[4px] mb-3">
                {total > 0 ? items.map((_, i) => (
                  <button key={i} onClick={() => onSlideChange(i)} className={`h-[3px] rounded-full transition-all duration-300 cursor-pointer ${i === safeIndex ? "w-5 bg-[#679632]" : "w-[5px] bg-[#E5E7EB] hover:bg-[#CBD5E1]"}`} />
                )) : (
                  <>
                    <div className="h-[3px] w-5 bg-[#679632] rounded-full" />
                    <div className="h-[3px] w-[5px] bg-[#E5E7EB] rounded-full" />
                    <div className="h-[3px] w-[5px] bg-[#E5E7EB] rounded-full" />
                  </>
                )}
              </div>
              <button onClick={handleSkip} className="text-[#679632] font-semibold text-[12px] hover:opacity-70 transition-opacity cursor-pointer">تخطي</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function IntroductionsManagement() {
  const [items, setItems] = useState<Introduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<FormState | null>(null);
  const [toast, setToast] = useState({ msg: "", type: "success", show: false });
  const [activeTab, setActiveTab] = useState<1 | 2>(1);
  const [previewSlide, setPreviewSlide] = useState(0);

  const load = () => {
    setLoading(true); setError("");
    getIntroductions(activeTab)
      .then((r) => setItems((r.data ?? []).map((i: any) => ({ ...i, type: activeTab }))))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [activeTab]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type, show: true }); setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  };

  const handleSave = async (form: FormState) => {
    await saveIntroduction(form);
    showToast(form.uuid ? "تم تحديث الشريحة بنجاح" : "تمت إضافة الشريحة بنجاح");
    load();
  };

  const handleDelete = async (uuid: string, title?: string, description?: string) => {
    const displayTitle = title || description?.substring(0, 15) || "هذه الشريحة";
    if (!confirm(`هل تريد حذف ${displayTitle}؟`)) return;
    try { await deleteIntroduction(uuid); showToast("تم حذف الشريحة"); load(); }
    catch (e: unknown) { showToast(e instanceof Error ? e.message : String(e), "error"); }
  };

  const filtered = items;
  const previewItems = items;

  const handlePreviewSlide = (intro: Introduction) => {
    const idx = filtered.findIndex(s => s.uuid === intro.uuid);
    if (idx >= 0) setPreviewSlide(idx);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 ${toast.type === "success" ? "bg-[#1F4A10] text-white" : "bg-red-600 text-white"}`}>
            {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{modal && <Modal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />}</AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#1F4A10]">شرائح التعريف بالتطبيق</h2>
          <p className="text-sm text-gray-500 mt-1">الشاشات الترحيبية التي تظهر للمستخدمين والسائقين عند أول استخدام</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-[#1F4A10] text-sm font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setModal({ type: activeTab, sort: filtered.length + 1 })}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#2A6A14] text-white text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95">
            <Plus className="w-5 h-5" /> إضافة شريحة
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الشرائح", value: items.length, color: "#1F4A10", bg: "#F6FAF0" },
          { label: "شرائح العملاء", value: items.filter(i => i.type === 1).length, color: "#2563eb", bg: "#dbeafe" },
          { label: "شرائح السائقين", value: items.filter(i => i.type === 2).length, color: "#16a34a", bg: "#dcfce7" },
          { label: "شرائح بصور", value: items.filter(i => i.image).length, color: "#7c3aed", bg: "#ede9fe" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: s.bg }}>
              <Layers className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-3xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-bold text-gray-500 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Cards Grid */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Navigation Tabs */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl relative mb-6">
            {/* Sliding Background */}
            <div className="absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out z-0"
              style={{ transform: activeTab === 1 ? 'translateX(0)' : 'translateX(-100%)', right: '0.375rem' }} />
              
            <button onClick={() => setActiveTab(1)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-colors relative z-10 ${activeTab === 1 ? "text-[#1F4A10]" : "text-gray-500 hover:text-gray-700"}`}>
              <Users className="w-5 h-5" /> تطبيق المستخدمين
            </button>
            <button onClick={() => setActiveTab(2)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-colors relative z-10 ${activeTab === 2 ? "text-[#1F4A10]" : "text-gray-500 hover:text-gray-700"}`}>
              <Car className="w-5 h-5" /> تطبيق السائقين
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" /></div>
          ) : error ? (
            <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-100">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-red-700 font-bold">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
              <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="font-heading font-black text-gray-700 text-xl mb-2">لا توجد شرائح</p>
              <p className="text-gray-500 text-sm mb-6">ابدأ بإضافة شرائح تعريفية لتظهر للمستخدمين عند فتح التطبيق</p>
              <button onClick={() => setModal({ type: 1, sort: 1 })} className="px-6 py-3 bg-[#1F4A10] text-white rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-md active:scale-95"><Plus className="w-5 h-5"/> إضافة شريحة</button>
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid sm:grid-cols-2 gap-5">
              {filtered.map((intro, idx) => {
                const typeInfo = TYPE_MAP[intro.type ?? 1] ?? TYPE_MAP[1];
                return (
                  <motion.div variants={itemVariants} key={intro.uuid} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#D4EDA8] transition-all duration-300 group">
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                      {intro.image ? (
                        <img src={getImageUrl(intro.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-12 h-12 text-gray-300" /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Sequence badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#1F4A10] text-white px-2.5 py-1.5 rounded-xl shadow-lg">
                        <span className="text-xs font-black">شريحة #{idx + 1}</span>
                      </div>

                      {/* Type badge */}
                      <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm`} style={{ background: typeInfo.bg, color: typeInfo.color, borderColor: typeInfo.color + '30' }}>
                        {typeInfo.label}
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                        <button onClick={() => handlePreviewSlide(intro)}
                          className="flex-1 py-2.5 rounded-xl bg-[#679632]/90 backdrop-blur-sm text-white text-xs font-bold hover:bg-[#679632] transition-colors shadow-sm flex items-center justify-center gap-1.5">
                          <Play className="w-3.5 h-3.5" /> عرض الشريحة
                        </button>
                        <button onClick={() => setModal({ ...intro })}
                          className="flex-1 py-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-[#1F4A10] text-xs font-bold hover:bg-white transition-colors shadow-sm flex items-center justify-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> تعديل
                        </button>
                        <button onClick={() => handleDelete(intro.uuid, intro.title, intro.description)}
                          className="py-2.5 px-4 rounded-xl bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center gap-1.5">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-heading font-black text-[#1F4A10] text-lg leading-tight mb-1 line-clamp-1">{intro.description || intro.title || "شريحة تعريفية"}</h3>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                        <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                        <Apple className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[10px] text-gray-400 font-bold">متزامنة على كافة المنصات</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Phone Preview Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="sticky top-6">
            <h3 className="font-heading font-black text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
              <Smartphone className="w-5 h-5 text-[#679632]" /> معاينة مباشرة
            </h3>
            <PhonePreview items={previewItems} currentSlide={previewSlide} onSlideChange={setPreviewSlide} />
          </div>
        </div>
      </div>
    </div>
  );
}
