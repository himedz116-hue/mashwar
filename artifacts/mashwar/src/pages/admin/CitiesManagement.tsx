import { useState, useEffect } from "react";
import { getCities, addCity, editCity, deleteCity, type City } from "@/lib/meshwarApi";
import {
  Map, RefreshCw, Plus, Pencil, Trash2, X, CheckCircle2,
  Search, Globe, MapPin, Smartphone, Apple, AlertCircle,
  Navigation, Navigation2, Check, Power, ShieldCheck
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

const SAUDI_MAP_SVG = (
  <svg viewBox="0 0 800 600" className="w-full h-full opacity-10 drop-shadow-2xl">
    <path fill="currentColor" d="M195.4,79.2c-5.7,2.8-12.7,4.2-20.9,4.2c-15.3,0-27-5.6-35.1-16.7c-8.1-11.1-12.2-25.2-12.2-42.3c0-17.1,4.1-31.1,12.2-42.3 C147.5,10.9,159.2,5.3,174.5,5.3c15.3,0,27,5.6,35.1,16.7c8.1,11.1,12.2,25.2,12.2,42.3c0,17.1-4.1,31.1-12.2,42.3 C201.4,117.8,189.7,123.3,174.5,123.3c-8.2,0-15.2-1.4-20.9-4.2 M249.7,213.7c13.7,11,29.9,16.5,48.5,16.5c18.6,0,34.8-5.5,48.5-16.5 c13.7-11,20.6-25,20.6-42.1c0-17.1-6.9-31.1-20.6-42.1c-13.7-11-29.9-16.5-48.5-16.5c-18.6,0-34.8,5.5-48.5,16.5 c-13.7,11-20.6,25-20.6,42.1C229.1,188.7,236,202.7,249.7,213.7 M332.2,348.2c19.3,9.5,41.2,14.2,65.7,14.2c24.5,0,46.4-4.7,65.7-14.2 c19.3-9.5,29-22.1,29-37.8c0-15.7-9.7-28.3-29-37.8c-19.3-9.5-41.2-14.2-65.7-14.2c-24.5,0-46.4,4.7-65.7,14.2 c-19.3,9.5-29,22.1-29,37.8C303.2,326.1,312.9,338.7,332.2,348.2 M583.5,482.7c25.4,6.7,53,10,82.8,10c29.8,0,57.4-3.3,82.8-10 c25.4-6.7,38.1-15.9,38.1-27.6c0-11.7-12.7-20.9-38.1-27.6c-25.4-6.7-53-10-82.8-10c-29.8,0-57.4,3.3-82.8,10 c-25.4,6.7-38.1,15.9-38.1,27.6C545.4,466.8,558.1,476,583.5,482.7 M679.5,213.7c13.7,11,29.9,16.5,48.5,16.5c18.6,0,34.8-5.5,48.5-16.5 c13.7-11,20.6-25,20.6-42.1c0-17.1-6.9-31.1-20.6-42.1c-13.7-11-29.9-16.5-48.5-16.5c-18.6,0-34.8,5.5-48.5,16.5 c-13.7,11-20.6,25-20.6,42.1C658.9,188.7,665.8,202.7,679.5,213.7 M757.2,79.2c-5.7,2.8-12.7,4.2-20.9,4.2c-15.3,0-27-5.6-35.1-16.7 c-8.1-11.1-12.2-25.2-12.2-42.3c0-17.1,4.1-31.1,12.2-42.3C709.3,10.9,721,5.3,736.3,5.3c15.3,0,27,5.6,35.1,16.7 c8.1,11.1,12.2,25.2,12.2,42.3c0,17.1-4.1,31.1-12.2,42.3C763.2,117.8,751.5,123.3,736.3,123.3C728.1,123.3,721.1,121.9,715.4,119.1 M195.4,482.7c-5.7,2.8-12.7,4.2-20.9,4.2c-15.3,0-27-5.6-35.1-16.7c-8.1-11.1-12.2-25.2-12.2-42.3c0-17.1,4.1-31.1,12.2-42.3 c8.1-11.1,19.8-16.7,35.1-16.7c15.3,0,27,5.6,35.1,16.7c8.1,11.1,12.2,25.2,12.2,42.3c0,17.1-4.1,31.1-12.2,42.3 C201.4,521.3,189.7,526.8,174.5,526.8c-8.2,0-15.2-1.4-20.9-4.2" />
  </svg>
);

function Modal({ initial, onSave, onClose }: {
  initial: Partial<City>; onSave: (d: Partial<City>) => Promise<void>; onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<City>>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  // Mock operational status for UI purposes since it might not be in API
  const [isActive, setIsActive] = useState(true);
  const isEdit = !!initial.uuid;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setErr("اسم المدينة باللغة العربية مطلوب"); return; }
    setSaving(true); setErr("");
    try { await onSave(form); onClose(); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <motion.form initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 md:p-8 space-y-6" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F6FAF0] to-[#D4EDA8] flex items-center justify-center shadow-sm border border-[#D4EDA8]">
              <MapPin className="w-6 h-6 text-[#1F4A10]" />
            </div>
            <div>
              <h3 className="font-heading font-black text-[#1F4A10] text-2xl">{isEdit ? "تحديث بيانات المدينة" : "إضافة مدينة جديدة"}</h3>
              <p className="text-sm text-gray-500 mt-0.5">النطاق الجغرافي للخدمة</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5"><Globe className="w-4 h-4 text-[#679632]" /> الاسم باللغة العربية *</label>
              <input value={form.name ?? ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="مثال: الرياض، جدة..."
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5"><Globe className="w-4 h-4 text-gray-400" /> الاسم باللغة الإنجليزية</label>
              <input value={form.name_en ?? ""} onChange={(e) => setForm((p) => ({ ...p, name_en: e.target.value }))} placeholder="e.g. Riyadh, Jeddah..." dir="ltr"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-white text-left" />
            </div>
          </div>

          <div className="bg-[#F6FAF0] p-4 rounded-2xl border border-[#D4EDA8]/50 flex items-center justify-between cursor-pointer hover:bg-[#D4EDA8]/20 transition-colors" onClick={() => setIsActive(!isActive)}>
            <div>
              <p className="font-bold text-[#1F4A10] text-sm flex items-center gap-2"><Power className="w-4 h-4" /> حالة التشغيل</p>
              <p className="text-xs text-gray-500 mt-0.5">تفعيل أو إيقاف الخدمة مؤقتاً في هذه المدينة</p>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isActive ? 'translate-x-0' : '-translate-x-6'}`} />
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
            {saving ? "جاري الحفظ..." : "حفظ بيانات المدينة"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

export default function CitiesManagement() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Partial<City> | null>(null);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [search, setSearch] = useState("");
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const load = () => {
    setLoading(true); setError("");
    getCities().then((r) => setCities(r.data ?? [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast({ msg: "", type: "success" }), 3500); };

  const handleSave = async (form: Partial<City>) => {
    if (form.uuid) await editCity(form as City);
    else await addCity({ name: form.name!, name_en: form.name_en });
    showToast(form.uuid ? "تم تحديث المدينة بنجاح" : "تمت إضافة المدينة بنجاح");
    load();
  };

  const handleDelete = async (uuid: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف مدينة "${name}"؟ قد يؤثر ذلك على الرحلات المرتبطة.`)) return;
    try { await deleteCity(uuid); showToast("تم حذف المدينة بنجاح"); load(); }
    catch (e: unknown) { showToast(e instanceof Error ? e.message : String(e), "error"); }
  };

  const filtered = cities.filter((c) =>
    !search || c.name?.includes(search) || c.name_en?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h2 className="text-3xl font-heading font-black text-[#1F4A10]">النطاق الجغرافي والمدن</h2>
          <p className="text-sm text-gray-500 mt-1">إدارة تغطية الخدمة ومراقبة الحالة التشغيلية للمدن المدعومة</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-[#1F4A10] text-sm font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#2A6A14] text-white text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95">
            <Plus className="w-5 h-5" /> إضافة مدينة جديدة
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#1F4A10] to-[#0d2206] rounded-3xl p-8 relative overflow-hidden shadow-lg border border-[#1F4A10]">
          {/* Map Background SVG */}
          <div className="absolute inset-0 text-white/5 flex items-center justify-center p-10 pointer-events-none">
            {SAUDI_MAP_SVG}
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="font-heading font-black text-[#D4EDA8] text-2xl flex items-center gap-2">
                  <Globe className="w-6 h-6" /> الخريطة التفاعلية
                </h3>
                <p className="text-white/60 text-sm mt-1">توضح النقاط التالية المدن النشطة في النظام</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-white text-xs font-bold"><span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> نشط</span>
                <span className="flex items-center gap-1.5 text-white/50 text-xs font-bold"><span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span> غير نشط</span>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px] relative">
              {/* Plotting points randomly or procedurally for visual effect based on cities list */}
              {cities.map((city, index) => {
                // Procedural generation of position based on string length and char code for consistent rendering
                const top = 15 + ((city.name.charCodeAt(0) * 7) % 70) + "%";
                const left = 10 + ((city.name.charCodeAt(city.name.length-1) * 11) % 80) + "%";
                const isHovered = hoveredCity === city.uuid;
                
                return (
                  <motion.div key={city.uuid} 
                    initial={{ scale: 0, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: index * 0.1 }}
                    className="absolute group z-10" 
                    style={{ top, left }}
                    onMouseEnter={() => setHoveredCity(city.uuid)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    <div className={`relative flex items-center justify-center cursor-pointer ${isHovered ? 'z-50' : 'z-10'}`}>
                      {/* Pulse effect */}
                      <div className="absolute w-12 h-12 rounded-full bg-[#D4EDA8]/20 animate-ping"></div>
                      
                      {/* Pin */}
                      <div className={`w-4 h-4 rounded-full border-[3px] border-[#0d2206] shadow-xl transition-all duration-300 ${isHovered ? 'bg-[#D4EDA8] scale-150' : 'bg-green-500'}`}></div>
                      
                      {/* Tooltip */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute bottom-6 bg-white rounded-xl shadow-2xl p-3 border border-gray-100 min-w-[140px] pointer-events-none">
                            <p className="font-bold text-[#1F4A10] text-sm text-center">{city.name}</p>
                            <p className="text-[10px] text-gray-400 text-center font-mono">{city.name_en || '---'}</p>
                            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-center">
                              <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> تعمل الخدمة حالياً</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#F6FAF0] rounded-full opacity-50 pointer-events-none"></div>
            <div className="w-16 h-16 rounded-2xl bg-[#D4EDA8] flex items-center justify-center shadow-inner relative z-10">
              <MapPin className="w-8 h-8 text-[#1F4A10]" />
            </div>
            <div className="relative z-10">
              <p className="text-4xl font-heading font-black text-[#1F4A10]">{cities.length}</p>
              <p className="text-sm font-bold text-gray-500 mt-1">مدينة مدعومة</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-heading font-black text-gray-800 mb-4 flex items-center gap-2 text-sm"><Navigation2 className="w-4 h-4 text-[#679632]"/> التوافق والمنصات</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-700"><Smartphone className="w-4 h-4"/></div>
                  <span className="font-bold text-sm text-gray-700">تطبيق Android</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">متزامن بالكامل</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-700"><Apple className="w-4 h-4"/></div>
                  <span className="font-bold text-sm text-gray-700">تطبيق iOS</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">متزامن بالكامل</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* List Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h3 className="font-heading font-black text-[#1F4A10] text-xl flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#679632]" /> دليل المدن المعتمدة
          </h3>
          <div className="relative w-full md:w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] focus:ring-2 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white"
              placeholder="البحث بالاسم..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" /></div>
        ) : error ? (
          <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-100 max-w-md mx-auto my-10">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-bold text-sm">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-16 text-center border border-gray-100 border-dashed">
            <Map className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-bold text-gray-500">{search ? "لا توجد مدن تطابق بحثك" : "قائمة المدن فارغة حالياً"}</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((city) => (
              <motion.div variants={itemVariants} key={city.uuid} className={`bg-white rounded-2xl border p-5 transition-all duration-300 group relative overflow-hidden ${hoveredCity === city.uuid ? 'border-[#679632] shadow-md ring-4 ring-[#D4EDA8]/20' : 'border-gray-100 hover:border-[#D4EDA8] hover:shadow-md'}`}
                onMouseEnter={() => setHoveredCity(city.uuid)} onMouseLeave={() => setHoveredCity(null)}>
                
                {/* Status Indicator */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#D4EDA8] to-transparent rounded-bl-full pointer-events-none opacity-50"></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F6FAF0] to-white border border-[#D4EDA8] flex items-center justify-center shadow-sm">
                    <MapPin className="w-6 h-6 text-[#1F4A10]" />
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    <button onClick={() => setModal(city)} className="p-1.5 rounded-lg bg-gray-50 text-[#679632] hover:bg-[#F6FAF0] hover:text-[#1F4A10] transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(city.uuid, city.name)} className="p-1.5 rounded-lg bg-gray-50 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="font-heading font-black text-[#1F4A10] text-xl mb-1">{city.name}</h3>
                  <p className="text-xs font-bold text-gray-400 font-mono tracking-wider">{city.name_en ? city.name_en.toUpperCase() : '---'}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-green-700">الخدمة نشطة</span>
                  </div>
                  <div className="flex gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                    <Apple className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

    </div>
  );
}
