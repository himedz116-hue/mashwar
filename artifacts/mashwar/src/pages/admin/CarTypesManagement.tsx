import { useState, useEffect, useRef } from "react";
import { getCarTypes, addCarType, editCarType, deleteCarType, getImageUrl, type CarType } from "@/lib/meshwarApi";
import {
  Truck, RefreshCw, Plus, Pencil, Trash2, X, CheckCircle2,
  DollarSign, Weight, Upload, ImageIcon, Smartphone, Apple,
  AlertCircle, Edit3, Image as ImageIcon2, Tag, Box, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const empty: Partial<CarType> = {
  name: "", name_en: "", base_price: 0, price_per_km: 0,
  min_price: 0, max_weight: 0, description: "", icon: "",
};

function Modal({ initial, onSave, onClose }: {
  initial: Partial<CarType>; onSave: (d: Partial<CarType>) => Promise<void>; onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<CarType>>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [iconMode, setIconMode] = useState<"url" | "file">(initial.icon ? "url" : "file");
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initial.uuid;
  const set = (k: keyof CarType, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      set("iconFile", file);
      set("iconPreview", URL.createObjectURL(file));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setErr("اسم نوع المركبة مطلوب"); return; }
    setSaving(true); setErr("");
    try { await onSave(form); onClose(); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setSaving(false); }
  };

  const previewSrc = form.iconPreview ?? form.icon;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <motion.form initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scroll border border-gray-100" 
        onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F6FAF0] to-[#D4EDA8] flex items-center justify-center shadow-sm border border-[#D4EDA8]">
              <Truck className="w-6 h-6 text-[#1F4A10]" />
            </div>
            <div>
              <h3 className="font-heading font-black text-[#1F4A10] text-2xl">{isEdit ? "تحديث فئة المركبة" : "إضافة فئة مركبات جديدة"}</h3>
              <p className="text-sm text-gray-500 mt-0.5">ستظهر هذه الفئة للعملاء في تطبيقي Android و iOS</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          
          {/* Left Column - Image Upload */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 h-full flex flex-col items-center justify-center relative overflow-hidden group">
              <h4 className="font-bold text-gray-700 flex items-center gap-2 absolute top-4 left-4 right-4 z-10 justify-center"><ImageIcon2 className="w-4 h-4 text-[#679632]"/> أيقونة المركبة</h4>
              
              <div className="mt-10 mb-4 w-32 h-32 relative">
                {previewSrc ? (
                  <div className="relative w-full h-full">
                    <img src={getImageUrl(previewSrc)} className="w-full h-full object-contain drop-shadow-xl" />
                    <button type="button" onClick={() => { set("iconFile", undefined); set("iconPreview", ""); set("icon", ""); setIconMode("file"); }}
                      className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-white group-hover:border-[#679632] group-hover:bg-[#F6FAF0] transition-colors">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-xs font-bold text-center px-2">ارفع أيقونة شفافة (PNG)</span>
                  </div>
                )}
              </div>

              <div className="w-full space-y-3 z-10 mt-auto">
                <div className="flex bg-gray-200/50 p-1 rounded-xl w-full">
                  <button type="button" onClick={() => setIconMode("file")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${iconMode === 'file' ? 'bg-white shadow text-[#1F4A10]' : 'text-gray-500 hover:text-gray-700'}`}>رفع ملف</button>
                  <button type="button" onClick={() => setIconMode("url")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${iconMode === 'url' ? 'bg-white shadow text-[#1F4A10]' : 'text-gray-500 hover:text-gray-700'}`}>رابط مباشر</button>
                </div>
                
                {iconMode === "file" ? (
                  <>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                    <button type="button" onClick={() => fileRef.current?.click()} className="w-full py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-[#679632] transition-colors shadow-sm">
                      تصفح الملفات
                    </button>
                  </>
                ) : (
                  <input type="url" value={form.icon ?? ""} onChange={(e) => { set("icon", e.target.value); set("iconPreview", e.target.value); }}
                    placeholder="https://example.com/icon.png"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#679632] focus:ring-2 focus:ring-[#D4EDA8]/30 transition-all bg-white text-left" dir="ltr" />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Inputs */}
          <div className="md:col-span-8 space-y-6">
            
            {/* General Info */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
              <h4 className="font-bold text-gray-700 flex items-center gap-2"><Info className="w-4 h-4 text-[#679632]"/> التسمية والوصف</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">الاسم باللغة العربية *</label>
                  <input type="text" value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="مثال: سطحة هيدروليك"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">الاسم باللغة الإنجليزية</label>
                  <input type="text" value={form.name_en ?? ""} onChange={(e) => set("name_en", e.target.value)} placeholder="Hydraulic Tow Truck" dir="ltr"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-white text-left" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-2">وصف الفئة للعميل</label>
                  <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={2} placeholder="تستخدم لنقل السيارات المنخفضة والرياضية بأمان عالي..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-white resize-none" />
                </div>
              </div>
            </div>

            {/* Pricing Options */}
            <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100/50 space-y-4">
              <h4 className="font-bold text-green-800 flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-600"/> إعدادات التسعير</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-green-700/70 mb-2">تكلفة الفتح (الأساسي)</label>
                  <div className="relative">
                    <input type="number" min="0" step="0.5" value={String(form.base_price ?? "")} onChange={(e) => set("base_price", Number(e.target.value))} placeholder="50"
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-green-200/50 text-sm font-bold text-green-900 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all bg-white" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-green-700/50">ر.س</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-green-700/70 mb-2">التكلفة لكل كم</label>
                  <div className="relative">
                    <input type="number" min="0" step="0.5" value={String(form.price_per_km ?? "")} onChange={(e) => set("price_per_km", Number(e.target.value))} placeholder="3.5"
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-green-200/50 text-sm font-bold text-green-900 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all bg-white" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-green-700/50">ر.س</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-green-700/70 mb-2">الحد الأدنى للرحلة</label>
                  <div className="relative">
                    <input type="number" min="0" step="0.5" value={String(form.min_price ?? "")} onChange={(e) => set("min_price", Number(e.target.value))} placeholder="70"
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-green-200/50 text-sm font-bold text-green-900 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all bg-white" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-green-700/50">ر.س</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100/50 space-y-4">
              <h4 className="font-bold text-orange-800 flex items-center gap-2"><Weight className="w-4 h-4 text-orange-500"/> المواصفات الفنية</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-orange-700/70 mb-2">أقصى حمولة / وزن</label>
                  <div className="relative">
                    <input type="number" min="0" step="0.1" value={String(form.max_weight ?? "")} onChange={(e) => set("max_weight", Number(e.target.value))} placeholder="5.0"
                      className="w-full px-4 py-3 pl-12 rounded-xl border border-orange-200/50 text-sm font-bold text-orange-900 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all bg-white" />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-700/50">طن</span>
                  </div>
                </div>
              </div>
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
            className="flex-1 py-4 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#2A6A14] text-white font-bold text-base hover:opacity-90 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1F4A10]/20 active:scale-[0.98]">
            {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            {saving ? "جاري الحفظ..." : isEdit ? "اعتماد التعديلات" : "إضافة فئة المركبات"}
          </button>
          <button type="button" onClick={onClose}
            className="px-8 py-4 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors active:scale-[0.98]">
            إلغاء
          </button>
        </div>
      </motion.form>
    </div>
  );
}

function TypeCard({ type, onEdit, onDelete }: { type: CarType; onEdit: () => void; onDelete: () => void }) {
  return (
    <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#D4EDA8] transition-all duration-300 group flex flex-col h-full">
      
      {/* Visual Header */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white h-48 flex items-center justify-center p-6 border-b border-gray-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#D4EDA8]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {type.icon ? (
          <motion.img whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }} src={type.icon} alt={type.name} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#F6FAF0] to-[#D4EDA8] flex items-center justify-center shadow-inner relative z-10">
            <Truck className="w-12 h-12 text-[#1F4A10]" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-100 shadow-sm flex items-center gap-1.5" title="مدعوم في أندرويد">
            <Smartphone className="w-3.5 h-3.5 text-green-600" />
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-100 shadow-sm flex items-center gap-1.5" title="مدعوم في iOS">
            <Apple className="w-3.5 h-3.5 text-gray-700" />
          </div>
        </div>

        {/* Hover Actions */}
        <div className="absolute top-4 left-4 flex gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0">
          <button onClick={onEdit} className="p-2.5 rounded-xl bg-white text-[#679632] hover:bg-[#F6FAF0] shadow-lg border border-gray-100 transition-colors tooltip" title="تعديل">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2.5 rounded-xl bg-white text-red-500 hover:bg-red-50 shadow-lg border border-gray-100 transition-colors tooltip" title="حذف">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-5 text-center">
          <h3 className="font-heading font-black text-[#1F4A10] text-xl mb-1">{type.name}</h3>
          {type.name_en && <p className="text-xs font-bold text-gray-400 font-mono tracking-wider">{type.name_en.toUpperCase()}</p>}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-[#F6FAF0] rounded-2xl p-3 text-center border border-[#D4EDA8]/30">
            <p className="text-[10px] font-bold text-[#679632] mb-1">فتح العداد</p>
            <p className="font-black text-[#1F4A10] text-lg">{type.base_price}<span className="text-[10px] ml-0.5 text-[#1F4A10]/60">ر.س</span></p>
          </div>
          <div className="bg-blue-50/50 rounded-2xl p-3 text-center border border-blue-100/50">
            <p className="text-[10px] font-bold text-blue-600 mb-1">لكل كم</p>
            <p className="font-black text-blue-900 text-lg">{type.price_per_km}<span className="text-[10px] ml-0.5 text-blue-900/60">ر.س</span></p>
          </div>
          <div className="bg-orange-50/50 rounded-2xl p-3 text-center border border-orange-100/50">
            <p className="text-[10px] font-bold text-orange-600 mb-1">أدنى سعر</p>
            <p className="font-black text-orange-900 text-lg">{type.min_price}<span className="text-[10px] ml-0.5 text-orange-900/60">ر.س</span></p>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          {type.max_weight != null && type.max_weight > 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><Weight className="w-4 h-4"/> أقصى حمولة مقدرة</span>
              <span className="text-sm font-black text-gray-800">{type.max_weight} طن</span>
            </div>
          )}
          {type.description && (
            <p className="text-xs text-gray-500 leading-relaxed text-center line-clamp-2 px-2 bg-gray-50/50 py-2 rounded-lg">{type.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CarTypesManagement() {
  const [types, setTypes] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Partial<CarType> | null>(null);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const load = () => {
    setLoading(true); setError("");
    getCarTypes().then((r) => setTypes(r.data ?? [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type }); setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
  };

  const handleSave = async (form: Partial<CarType>) => {
    if (form.uuid) await editCarType(form);
    else await addCarType(form);
    showToast(form.uuid ? "تم تحديث فئة المركبة بنجاح" : "تم إضافة الفئة الجديدة بنجاح");
    load();
  };

  const handleDelete = async (uuid: string, name: string) => {
    if (!confirm(`تحذير: هل أنت متأكد من حذف فئة "${name}"؟\nسيؤدي هذا إلى التأثير على تسعير وطلب السيارات المرتبطة بهذه الفئة.`)) return;
    try { await deleteCarType(uuid); showToast("تم حذف الفئة نهائياً"); load(); }
    catch (e: unknown) { showToast(e instanceof Error ? e.message : String(e), "error"); }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <AnimatePresence>
        {toast.msg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 ${toast.type === "success" ? "bg-[#1F4A10] text-white" : "bg-red-600 text-white"}`}>
            {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && <Modal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#1F4A10]">فئات المركبات وتسعيرها</h2>
          <p className="text-sm text-gray-500 mt-1">التحكم الكامل بأنواع السطحات وأسعار الخدمات المقدمة للعملاء</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-[#1F4A10] text-sm font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setModal(empty)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#2A6A14] text-white text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95">
            <Plus className="w-5 h-5" /> إضافة فئة جديدة
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "الفئات المتاحة", value: types.length, icon: Box, color: "#1F4A10", bg: "#F6FAF0" },
          { label: "فئات موثقة بصور", value: types.filter((t) => t.icon).length, icon: ImageIcon2, color: "#2563eb", bg: "#dbeafe" },
          { label: "متوسط التسعير (للكيلومتر)", value: types.length ? (types.reduce((s, t) => s + (t.price_per_km ?? 0), 0) / types.length).toFixed(2) + " ر.س" : "—", icon: Tag, color: "#16a34a", bg: "#dcfce7" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ background: s.bg, color: s.color }}>
              <s.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-3xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-bold text-gray-500 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex justify-center items-center py-32"><div className="w-12 h-12 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="bg-red-50 rounded-3xl p-12 text-center border border-red-100 shadow-sm max-w-lg mx-auto mt-10">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-700 font-bold text-lg mb-2">تعذر جلب البيانات</p>
          <p className="text-red-500 text-sm mb-6">{error}</p>
          <button onClick={load} className="px-6 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition-colors">إعادة المحاولة</button>
        </div>
      ) : types.length === 0 ? (
        <div className="bg-white rounded-3xl p-24 text-center border border-gray-100 shadow-sm mt-10">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
            <Truck className="w-10 h-10 text-gray-300" />
          </div>
          <p className="font-heading font-black text-gray-800 text-2xl mb-2">لا توجد فئات مركبات</p>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">النظام حالياً لا يحتوي على أي فئات مركبات مسجلة. يجب عليك إضافة فئة واحدة على الأقل ليتمكن السائقون من التسجيل والتسعير.</p>
          <button onClick={() => setModal(empty)} className="px-6 py-3 bg-[#1F4A10] hover:bg-[#2A5A14] text-white font-bold rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-2"><Plus className="w-5 h-5"/> إعداد أول فئة</button>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
          {types.map((t) => (
            <TypeCard key={t.uuid} type={t} onEdit={() => setModal({ ...t })} onDelete={() => handleDelete(t.uuid, t.name)} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
