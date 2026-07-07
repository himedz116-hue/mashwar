import { useState, useEffect } from "react";
import { getCarTypes, addCarType, editCarType, deleteCarType, type CarType } from "@/lib/meshwarApi";
import { Truck, RefreshCw, Plus, Pencil, Trash2, XCircle, Check, DollarSign, Ruler, Weight } from "lucide-react";

const empty: Partial<CarType> = { name: "", name_en: "", base_price: 0, price_per_km: 0, min_price: 0, max_weight: 0, description: "" };

function Modal({ initial, onSave, onClose }: {
  initial: Partial<CarType>; onSave: (d: Partial<CarType>) => Promise<void>; onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<CarType>>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const isEdit = !!initial.uuid;
  const set = (k: keyof CarType, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setErr("اسم النوع مطلوب"); return; }
    setSaving(true); setErr("");
    try { await onSave(form); onClose(); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <form className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10] text-lg">{isEdit ? "تعديل نوع المركبة" : "إضافة نوع جديد"}</h3>
          <button type="button" onClick={onClose}><XCircle className="w-5 h-5 text-gray-400" /></button>
        </div>

        {/* Platform badges */}
        <div className="flex gap-2 p-3 bg-[#F6FAF0] rounded-xl">
          <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg">🤖 Android</span>
          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">🍎 iOS</span>
          <span className="text-xs text-gray-400">يظهر في كلا المنصتين</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "الاسم بالعربي *", key: "name" as const, type: "text", placeholder: "مثال: وانيت" },
            { label: "الاسم بالإنجليزي", key: "name_en" as const, type: "text", placeholder: "Pickup Truck" },
            { label: "السعر الأساسي (ريال)", key: "base_price" as const, type: "number", placeholder: "0" },
            { label: "سعر الكم (ريال/كم)", key: "price_per_km" as const, type: "number", placeholder: "0" },
            { label: "الحد الأدنى للسعر", key: "min_price" as const, type: "number", placeholder: "0" },
            { label: "أقصى وزن (طن)", key: "max_weight" as const, type: "number", placeholder: "0" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-bold text-gray-500 mb-1">{f.label}</label>
              <input type={f.type} value={String(form[f.key] ?? "")} placeholder={f.placeholder}
                onChange={(e) => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">أيقونة (رابط URL)</label>
          <input type="url" value={form.icon ?? ""} onChange={(e) => set("icon", e.target.value)} placeholder="https://..."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">الوصف</label>
          <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)}
            rows={2} placeholder="وصف نوع المركبة..."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] resize-none" />
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

export default function CarTypesManagement() {
  const [types, setTypes] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Partial<CarType> | null>(null);
  const [toast, setToast] = useState("");

  const load = () => {
    setLoading(true); setError("");
    getCarTypes().then((r) => setTypes(r.data ?? [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleSave = async (form: Partial<CarType>) => {
    if (form.uuid) await editCarType(form);
    else await addCarType(form);
    showToast(form.uuid ? "✅ تم التعديل بنجاح" : "✅ تمت الإضافة بنجاح");
    load();
  };

  const handleDelete = async (uuid: string, name: string) => {
    if (!confirm(`هل تريد حذف "${name}"؟`)) return;
    try { await deleteCarType(uuid); showToast("🗑️ تم الحذف"); load(); }
    catch (e: unknown) { showToast("خطأ: " + (e instanceof Error ? e.message : String(e))); }
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F4A10] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold animate-bounce">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">أنواع المركبات والتسعير</h2>
          <p className="text-sm text-gray-500 mt-0.5">إدارة فئات المركبات المتاحة على Android و iOS</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" /> تحديث
          </button>
          <button onClick={() => setModal(empty)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors">
            <Plus className="w-4 h-4" /> إضافة نوع
          </button>
        </div>
      </div>

      {/* Summary banner */}
      <div className="bg-gradient-to-l from-[#1F4A10] to-[#2A5A14] rounded-2xl p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            <Truck className="w-7 h-7 text-[#D4EDA8]" />
          </div>
          <div>
            <p className="text-3xl font-heading font-black text-[#D4EDA8]">{types.length}</p>
            <p className="text-white/70 text-sm">نوع مركبة مسجّل</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold text-[#D4EDA8]">🤖 Android</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold text-[#D4EDA8]">🍎 iOS</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : types.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Truck className="w-14 h-14 mx-auto mb-4 opacity-20" />
          <p className="font-bold">لا توجد أنواع مركبات</p>
          <button onClick={() => setModal(empty)} className="mt-3 text-sm text-[#679632] underline">أضف أول نوع</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {types.map((t) => (
            <div key={t.uuid} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4EDA8] to-[#a8d060] flex items-center justify-center shadow-sm">
                  {t.icon ? (
                    <img src={t.icon} className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <Truck className="w-7 h-7 text-[#1F4A10]" />
                  )}
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal(t)} className="p-1.5 rounded-lg text-[#679632] hover:bg-[#F6FAF0] transition-colors" title="تعديل">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t.uuid, t.name)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="حذف">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h4 className="font-heading font-black text-[#1F4A10] text-lg">{t.name}</h4>
              {t.name_en && <p className="text-xs text-gray-400 mt-0.5">{t.name_en}</p>}
              {t.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{t.description}</p>}

              {/* Platform badges */}
              <div className="flex gap-1.5 mt-3">
                <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">🤖 Android</span>
                <span className="text-[10px] font-bold bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100">🍎 iOS</span>
              </div>

              {/* Pricing */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "أساسي", value: t.base_price != null ? `${t.base_price} ر` : "—", icon: DollarSign, color: "#1F4A10" },
                  { label: "لكل كم", value: t.price_per_km != null ? `${t.price_per_km} ر` : "—", icon: Ruler, color: "#679632" },
                  { label: "أدنى", value: t.min_price != null ? `${t.min_price} ر` : "—", icon: DollarSign, color: "#d97706" },
                ].map((p) => (
                  <div key={p.label} className="bg-[#F6FAF0] rounded-xl p-2 text-center">
                    <p.icon className="w-3 h-3 mx-auto mb-1" style={{ color: p.color }} />
                    <p className="text-[10px] text-gray-400">{p.label}</p>
                    <p className="font-bold text-[#1F4A10] text-xs mt-0.5">{p.value}</p>
                  </div>
                ))}
              </div>

              {t.max_weight != null && t.max_weight > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                  <Weight className="w-3 h-3" /> أقصى وزن: {t.max_weight} طن
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button onClick={() => setModal(t)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#F6FAF0] text-[#1F4A10] text-xs font-bold hover:bg-[#D4EDA8] transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> تعديل
                </button>
                <button onClick={() => handleDelete(t.uuid, t.name)}
                  className="py-2 px-3 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <Modal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
