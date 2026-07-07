import { useState, useEffect } from "react";
import { getCities, addCity, editCity, deleteCity, type City } from "@/lib/meshwarApi";
import {
  Map, RefreshCw, Plus, Pencil, Trash2, XCircle, Check,
  Search, X, Globe, MapPin, Smartphone, Apple,
} from "lucide-react";

function Modal({ initial, onSave, onClose }: {
  initial: Partial<City>; onSave: (d: Partial<City>) => Promise<void>; onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<City>>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const isEdit = !!initial.uuid;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setErr("اسم المدينة مطلوب"); return; }
    setSaving(true); setErr("");
    try { await onSave(form); onClose(); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <form className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#1F4A10]" />
            </div>
            <h3 className="font-heading font-black text-[#1F4A10] text-lg">{isEdit ? "تعديل المدينة" : "إضافة مدينة"}</h3>
          </div>
          <button type="button" onClick={onClose}><XCircle className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-[#679632]" /> اسم المدينة (عربي) *
            </label>
            <input
              value={form.name ?? ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="مثال: الرياض، جدة..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-[#679632]" /> اسم المدينة (إنجليزي)
            </label>
            <input
              value={form.name_en ?? ""} onChange={(e) => setForm((p) => ({ ...p, name_en: e.target.value }))}
              placeholder="e.g. Riyadh, Jeddah..."
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
            />
          </div>
        </div>
        {/* Platform note */}
        <div className="flex items-center gap-2 p-3 bg-[#F6FAF0] rounded-xl text-xs text-gray-500">
          <Smartphone className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
          <Apple className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
          ستظهر المدينة للمستخدمين على Android و iOS
        </div>
        {err && <p className="text-red-500 text-xs">{err}</p>}
        <button type="submit" disabled={saving}
          className="w-full py-3 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> {saving ? "جاري الحفظ..." : "حفظ المدينة"}
        </button>
      </form>
    </div>
  );
}

// Decorative map pins with different shades for visual variety
const PIN_COLORS = [
  "#1F4A10", "#679632", "#2A5A14", "#3a6b1a", "#4e7c22",
  "#5d8e2d", "#71a038", "#85b243", "#3f6516", "#2e5211",
];

export default function CitiesManagement() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Partial<City> | null>(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true); setError("");
    getCities().then((r) => setCities(r.data ?? [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleSave = async (form: Partial<City>) => {
    if (form.uuid) await editCity(form as City);
    else await addCity({ name: form.name!, name_en: form.name_en });
    showToast(form.uuid ? "✅ تم تعديل المدينة" : "✅ تمت إضافة المدينة");
    load();
  };

  const handleDelete = async (uuid: string, name: string) => {
    if (!confirm(`حذف مدينة "${name}"؟`)) return;
    try { await deleteCity(uuid); showToast("🗑️ تم حذف المدينة"); load(); }
    catch (e: unknown) { showToast("خطأ: " + (e instanceof Error ? e.message : String(e))); }
  };

  const filtered = cities.filter((c) =>
    !search || c.name?.includes(search) || c.name_en?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5" dir="rtl">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F4A10] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">المدن والنطاق الجغرافي</h2>
          <p className="text-sm text-gray-500 mt-0.5">المدن المتاحة لخدمة مشوار على Android و iOS</p>
        </div>
        <div className="flex gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6FAF0] border border-[#D4EDA8]">
            <Smartphone className="w-3.5 h-3.5 text-green-600" />
            <Apple className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-xs font-bold text-[#679632]">متزامن</span>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" /> تحديث
          </button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors">
            <Plus className="w-4 h-4" /> إضافة مدينة
          </button>
        </div>
      </div>

      {/* Hero stats banner */}
      <div className="bg-gradient-to-l from-[#1F4A10] to-[#2A6A14] rounded-2xl p-6 text-white overflow-hidden relative">
        {/* Decorative pins */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <MapPin key={i} className="absolute w-8 h-8"
              style={{ top: `${(i * 37) % 90}%`, left: `${(i * 53) % 85}%`, transform: `rotate(${(i * 22) % 45}deg)` }} />
          ))}
        </div>
        <div className="relative flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
            <Map className="w-8 h-8 text-[#D4EDA8]" />
          </div>
          <div>
            <p className="text-4xl font-heading font-black text-[#D4EDA8]">{cities.length}</p>
            <p className="text-white/70">مدينة مفعّلة في خدمة مشوار</p>
          </div>
          <div className="mr-auto hidden sm:flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white/90 text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5" /> Android
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white/90 text-xs font-bold">
              <Apple className="w-3.5 h-3.5" /> iOS
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pr-10 pl-10 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
            placeholder="البحث بالاسم العربي أو الإنجليزي..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        {search && <p className="text-xs text-gray-400 mt-2">{filtered.length} نتيجة من {cities.length}</p>}
      </div>

      {/* Cities grid */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-500 font-bold text-sm">{error}</p>
          <button onClick={load} className="mt-3 text-sm text-[#679632] underline">إعادة المحاولة</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <Map className="w-14 h-14 mx-auto mb-4 text-gray-200" />
          <p className="font-bold text-gray-400">{search ? "لا توجد نتائج مطابقة" : "لا توجد مدن"}</p>
          {!search && (
            <button onClick={() => setModal({})} className="mt-3 text-sm text-[#679632] underline font-bold">
              أضف أول مدينة
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((city, i) => (
            <div key={city.uuid} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all group relative overflow-hidden">
              {/* Decorative colored top border */}
              <div className="absolute top-0 right-0 left-0 h-1 rounded-t-2xl" style={{ background: PIN_COLORS[i % PIN_COLORS.length] }} />

              <div className="pt-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: PIN_COLORS[i % PIN_COLORS.length] + "20" }}>
                    <MapPin className="w-5 h-5" style={{ color: PIN_COLORS[i % PIN_COLORS.length] }} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal(city)} className="p-1.5 rounded-lg text-[#679632] hover:bg-[#F6FAF0] transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(city.uuid, city.name)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="font-heading font-black text-[#1F4A10] text-lg">{city.name}</p>
                {city.name_en && <p className="text-xs text-gray-400 mt-0.5">{city.name_en}</p>}
                {city.created_at && (
                  <p className="text-[10px] text-gray-300 mt-2">
                    أُضيفت {new Date(city.created_at).toLocaleDateString("ar-SA")}
                  </p>
                )}
                <div className="flex gap-1 mt-3">
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-md">
                    <Smartphone className="w-2 h-2" /> Android
                  </span>
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-md">
                    <Apple className="w-2 h-2" /> iOS
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Add city card */}
          <button onClick={() => setModal({})}
            className="bg-[#F6FAF0] border-2 border-dashed border-[#D4EDA8] rounded-2xl p-4 hover:bg-[#D4EDA8]/30 hover:border-[#679632] transition-all flex flex-col items-center justify-center gap-2 min-h-[120px]">
            <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
              <Plus className="w-5 h-5 text-[#1F4A10]" />
            </div>
            <p className="text-sm font-bold text-[#679632]">إضافة مدينة</p>
          </button>
        </div>
      )}

      {modal && <Modal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
