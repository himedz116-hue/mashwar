import { useState, useEffect } from "react";
import { getCarTypes, addCarType, editCarType, deleteCarType, type CarType } from "@/lib/meshwarApi";
import { Truck, RefreshCw, Plus, Pencil, Trash2, XCircle, Check } from "lucide-react";

const empty: Partial<CarType> = { name: "", name_en: "", base_price: 0, price_per_km: 0, min_price: 0, description: "" };

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
      <form className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10] text-lg">{isEdit ? "تعديل نوع السيارة" : "إضافة نوع جديد"}</h3>
          <button type="button" onClick={onClose}><XCircle className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "الاسم بالعربي *", key: "name" as const, type: "text" },
            { label: "الاسم بالإنجليزي", key: "name_en" as const, type: "text" },
            { label: "السعر الأساسي (ريال)", key: "base_price" as const, type: "number" },
            { label: "سعر الكم (ريال/كم)", key: "price_per_km" as const, type: "number" },
            { label: "الحد الأدنى للسعر", key: "min_price" as const, type: "number" },
            { label: "أقصى وزن (طن)", key: "max_weight" as const, type: "number" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-bold text-gray-500 mb-1">{f.label}</label>
              <input
                type={f.type} value={String(form[f.key] ?? "")}
                onChange={(e) => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">الوصف</label>
          <textarea
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] resize-none"
          />
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
    try {
      await deleteCarType(uuid);
      showToast("🗑️ تم الحذف");
      load();
    } catch (e: unknown) {
      showToast("خطأ: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F4A10] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold">{toast}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">أنواع السيارات والتسعير</h2>
          <p className="text-sm text-gray-500 mt-0.5">إدارة فئات المركبات وهيكل الأسعار</p>
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

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : types.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Truck className="w-14 h-14 mx-auto mb-4 opacity-20" />
          <p className="font-bold">لا توجد أنواع سيارات</p>
          <button onClick={() => setModal(empty)} className="mt-3 text-sm text-[#679632] underline">أضف أول نوع</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {types.map((t) => (
            <div key={t.uuid} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D4EDA8] flex items-center justify-center">
                  {t.icon ? <img src={t.icon} className="w-7 h-7 object-contain" /> : <Truck className="w-6 h-6 text-[#1F4A10]" />}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setModal(t)} className="p-1.5 rounded-lg text-[#679632] hover:bg-[#F6FAF0] transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t.uuid, t.name)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h4 className="font-heading font-black text-[#1F4A10] text-lg">{t.name}</h4>
              {t.name_en && <p className="text-xs text-gray-400 mt-0.5">{t.name_en}</p>}
              {t.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{t.description}</p>}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "السعر الأساسي", value: t.base_price != null ? `${t.base_price} ر` : "—" },
                  { label: "لكل كم", value: t.price_per_km != null ? `${t.price_per_km} ر` : "—" },
                  { label: "الحد الأدنى", value: t.min_price != null ? `${t.min_price} ر` : "—" },
                ].map((p) => (
                  <div key={p.label} className="bg-[#F6FAF0] rounded-xl p-2 text-center">
                    <p className="text-[10px] text-gray-400">{p.label}</p>
                    <p className="font-bold text-[#1F4A10] text-sm mt-0.5">{p.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <Modal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
