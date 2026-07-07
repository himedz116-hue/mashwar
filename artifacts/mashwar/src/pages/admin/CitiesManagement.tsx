import { useState, useEffect } from "react";
import { getCities, addCity, editCity, deleteCity, type City } from "@/lib/meshwarApi";
import { Map, RefreshCw, Plus, Pencil, Trash2, XCircle, Check } from "lucide-react";

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
          <h3 className="font-heading font-black text-[#1F4A10] text-lg">{isEdit ? "تعديل المدينة" : "إضافة مدينة"}</h3>
          <button type="button" onClick={onClose}><XCircle className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">اسم المدينة (عربي) *</label>
            <input value={form.name ?? ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">اسم المدينة (إنجليزي)</label>
            <input value={form.name_en ?? ""} onChange={(e) => setForm((p) => ({ ...p, name_en: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
          </div>
        </div>
        {err && <p className="text-red-500 text-xs">{err}</p>}
        <button type="submit" disabled={saving}
          className="w-full py-3 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> {saving ? "جاري الحفظ..." : "حفظ"}
        </button>
      </form>
    </div>
  );
}

export default function CitiesManagement() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Partial<City> | null>(null);
  const [toast, setToast] = useState("");

  const load = () => {
    setLoading(true); setError("");
    getCities().then((r) => setCities(r.data ?? [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleSave = async (form: Partial<City>) => {
    if (form.uuid) await editCity(form as City);
    else await addCity({ name: form.name!, name_en: form.name_en });
    showToast(form.uuid ? "✅ تم التعديل" : "✅ تمت الإضافة");
    load();
  };

  const handleDelete = async (uuid: string, name: string) => {
    if (!confirm(`حذف "${name}"?`)) return;
    try { await deleteCity(uuid); showToast("🗑️ تم الحذف"); load(); }
    catch (e: unknown) { showToast("خطأ: " + (e instanceof Error ? e.message : String(e))); }
  };

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F4A10] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold">{toast}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">المدن والنطاق الجغرافي</h2>
          <p className="text-sm text-gray-500 mt-0.5">إدارة المدن المتاحة لخدمة مشوار</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> تحديث
          </button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14]">
            <Plus className="w-4 h-4" /> إضافة مدينة
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-l from-[#1F4A10] to-[#2A5A14] rounded-2xl p-5 text-white flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
          <Map className="w-7 h-7 text-[#D4EDA8]" />
        </div>
        <div>
          <p className="text-3xl font-heading font-black text-[#D4EDA8]">{cities.length}</p>
          <p className="text-white/70 text-sm">مدينة مفعّلة</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : cities.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Map className="w-14 h-14 mx-auto mb-4 opacity-20" />
          <p className="font-bold">لا توجد مدن</p>
          <button onClick={() => setModal({})} className="mt-3 text-sm text-[#679632] underline">أضف أول مدينة</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {cities.map((city) => (
            <div key={city.uuid} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center mb-3">
                  <Map className="w-5 h-5 text-[#1F4A10]" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal(city)} className="p-1 rounded-lg text-[#679632] hover:bg-[#F6FAF0]"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(city.uuid, city.name)} className="p-1 rounded-lg text-red-400 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="font-heading font-black text-[#1F4A10]">{city.name}</p>
              {city.name_en && <p className="text-xs text-gray-400 mt-0.5">{city.name_en}</p>}
            </div>
          ))}
        </div>
      )}
      {modal && <Modal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
