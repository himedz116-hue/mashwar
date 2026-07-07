import { useState, useEffect, useRef } from "react";
import { getCarTypes, addCarType, editCarType, deleteCarType, type CarType } from "@/lib/meshwarApi";
import {
  Truck, RefreshCw, Plus, Pencil, Trash2, XCircle, Check,
  DollarSign, Ruler, Weight, Upload, ImageIcon, Smartphone, Apple,
} from "lucide-react";

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
    if (!form.name) { setErr("اسم النوع مطلوب"); return; }
    setSaving(true); setErr("");
    try { await onSave(form); onClose(); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setSaving(false); }
  };

  const previewSrc = form.iconPreview ?? form.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <form className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-5 max-h-[92vh] overflow-y-auto" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-[#1F4A10] text-xl">{isEdit ? "تعديل نوع المركبة" : "إضافة نوع جديد"}</h3>
            <p className="text-xs text-gray-400 mt-0.5">يظهر في تطبيق Android و iOS</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <XCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Platform badges */}
        <div className="flex gap-2 p-3 bg-[#F6FAF0] rounded-2xl border border-[#D4EDA8]">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-lg">
            <Smartphone className="w-3.5 h-3.5 text-green-700" />
            <span className="text-xs font-bold text-green-700">Android</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg">
            <Apple className="w-3.5 h-3.5 text-gray-700" />
            <span className="text-xs font-bold text-gray-700">iOS</span>
          </div>
          <span className="text-xs text-gray-400 self-center">يظهر في كلا المنصتين</span>
        </div>

        {/* Icon upload */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">أيقونة / صورة المركبة</label>
          <div className="flex gap-2 mb-3">
            {(["file", "url"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setIconMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${iconMode === m ? "bg-[#1F4A10] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {m === "file" ? "📁 رفع صورة" : "🔗 رابط URL"}
              </button>
            ))}
          </div>

          {iconMode === "file" ? (
            <div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              {previewSrc ? (
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <img src={previewSrc} className="w-24 h-24 object-contain rounded-2xl border-2 border-[#D4EDA8]" />
                  <button type="button" onClick={() => { set("iconFile", undefined); set("iconPreview", ""); set("icon", ""); }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#D4EDA8] rounded-2xl p-4 text-[#679632] hover:border-[#679632] hover:bg-[#F6FAF0] transition-all">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-bold">{previewSrc ? "تغيير الصورة" : "اختر صورة"}</span>
              </button>
            </div>
          ) : (
            <div>
              {previewSrc && (
                <div className="flex justify-center mb-3">
                  <img src={previewSrc} className="w-24 h-24 object-contain rounded-2xl border-2 border-[#D4EDA8]"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              <input type="url" value={form.icon ?? ""} onChange={(e) => { set("icon", e.target.value); set("iconPreview", e.target.value); }}
                placeholder="https://example.com/truck-icon.png"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
            </div>
          )}
        </div>

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">الاسم بالعربي *</label>
            <input type="text" value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="مثال: وانيت"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">الاسم بالإنجليزي</label>
            <input type="text" value={form.name_en ?? ""} onChange={(e) => set("name_en", e.target.value)} placeholder="Pickup Truck"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" dir="ltr" />
          </div>
        </div>

        {/* Pricing fields */}
        <div className="bg-[#F6FAF0] rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-[#679632] flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> إعدادات التسعير</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "السعر الأساسي (ريال)", key: "base_price" as const, placeholder: "20" },
              { label: "سعر/كم (ريال)", key: "price_per_km" as const, placeholder: "5" },
              { label: "الحد الأدنى (ريال)", key: "min_price" as const, placeholder: "15" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-bold text-gray-500 mb-1">{f.label}</label>
                <input type="number" min="0" step="0.01" value={String(form[f.key] ?? "")} placeholder={f.placeholder}
                  onChange={(e) => set(f.key, Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] bg-white" />
              </div>
            ))}
          </div>
        </div>

        {/* Weight */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1">
              <Weight className="w-3.5 h-3.5" /> أقصى وزن (طن)
            </label>
            <input type="number" min="0" step="0.1" value={String(form.max_weight ?? "")} placeholder="5"
              onChange={(e) => set("max_weight", Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">الوصف</label>
          <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)}
            rows={2} placeholder="وصف مختصر لنوع المركبة..."
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] resize-none" />
        </div>

        {err && <p className="text-red-500 text-xs bg-red-50 p-3 rounded-xl">{err}</p>}

        <button type="submit" disabled={saving}
          className="w-full py-3.5 rounded-xl bg-gradient-to-l from-[#679632] to-[#1F4A10] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1F4A10]/20">
          <Check className="w-4 h-4" /> {saving ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة النوع"}
        </button>
      </form>
    </div>
  );
}

function TypeCard({ type, onEdit, onDelete }: { type: CarType; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
      {/* Icon area */}
      <div className="relative bg-gradient-to-br from-[#F6FAF0] to-[#D4EDA8]/30 h-32 flex items-center justify-center border-b border-gray-100">
        {type.icon ? (
          <img src={type.icon} className="h-20 w-20 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-[#D4EDA8] flex items-center justify-center">
            <Truck className="w-8 h-8 text-[#1F4A10]" />
          </div>
        )}
        {/* Platform badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          <span className="px-1.5 py-0.5 rounded-md bg-green-500/90 text-white text-[10px] font-bold">🤖</span>
          <span className="px-1.5 py-0.5 rounded-md bg-gray-800/80 text-white text-[10px] font-bold">🍎</span>
        </div>
        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button onClick={onEdit} className="w-9 h-9 rounded-xl bg-white shadow-lg text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors flex items-center justify-center">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="w-9 h-9 rounded-xl bg-white shadow-lg text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-heading font-black text-[#1F4A10] text-lg leading-tight">{type.name}</h3>
          {type.name_en && <p className="text-xs text-gray-400 font-medium" dir="ltr">{type.name_en}</p>}
          {type.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{type.description}</p>}
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "أساسي", value: type.base_price, suffix: "ر" },
            { label: "كم/ر", value: type.price_per_km, suffix: "" },
            { label: "أدنى", value: type.min_price, suffix: "ر" },
          ].map((p) => (
            <div key={p.label} className="bg-[#F6FAF0] rounded-xl p-2 text-center">
              <p className="text-xs text-gray-400">{p.label}</p>
              <p className="font-heading font-black text-[#1F4A10] text-sm">{p.value ?? "—"}{p.value != null ? p.suffix : ""}</p>
            </div>
          ))}
        </div>

        {type.max_weight != null && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Weight className="w-3.5 h-3.5 text-[#679632]" />
            <span>أقصى وزن: <strong className="text-[#1F4A10]">{type.max_weight} طن</strong></span>
          </div>
        )}

        {/* Edit/Delete buttons */}
        <div className="flex gap-2 pt-1">
          <button onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#F6FAF0] text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors text-xs font-bold">
            <Pencil className="w-3.5 h-3.5" /> تعديل
          </button>
          <button onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-xs font-bold">
            <Trash2 className="w-3.5 h-3.5" /> حذف
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CarTypesManagement() {
  const [types, setTypes] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Partial<CarType> | null>(null);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const load = () => {
    setLoading(true); setError("");
    getCarTypes().then((r) => setTypes(r.data ?? [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast(msg); setToastType(type); setTimeout(() => setToast(""), 3500);
  };

  const handleSave = async (form: Partial<CarType>) => {
    if (form.uuid) await editCarType(form);
    else await addCarType(form);
    showToast(form.uuid ? "✅ تم التعديل بنجاح" : "✅ تمت الإضافة بنجاح");
    load();
  };

  const handleDelete = async (uuid: string, name: string) => {
    if (!confirm(`هل تريد حذف نوع "${name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    try { await deleteCarType(uuid); showToast("🗑️ تم الحذف بنجاح"); load(); }
    catch (e: unknown) { showToast("خطأ: " + (e instanceof Error ? e.message : String(e)), "error"); }
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold transition-all ${toastType === "success" ? "bg-[#1F4A10] text-white" : "bg-red-600 text-white"}`}>
          {toast}
        </div>
      )}

      {modal && <Modal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">أنواع المركبات والتسعير</h2>
          <p className="text-sm text-gray-500 mt-0.5">إدارة فئات المركبات على 🤖 Android و 🍎 iOS مع إمكانية رفع الصور</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> تحديث
          </button>
          <button onClick={() => setModal(empty)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors shadow-md shadow-[#1F4A10]/20">
            <Plus className="w-4 h-4" /> إضافة نوع
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "أنواع مسجّلة", value: types.length, icon: Truck, color: "#1F4A10", bg: "#D4EDA8" },
          { label: "مع أيقونة", value: types.filter((t) => t.icon).length, icon: ImageIcon, color: "#679632", bg: "#D4EDA8" },
          { label: "متوسط السعر/كم", value: types.length ? (types.reduce((s, t) => s + (t.price_per_km ?? 0), 0) / types.length).toFixed(1) : "—", icon: DollarSign, color: "#2563eb", bg: "#dbeafe" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-100">
          <p className="text-red-500 font-bold">{error}</p>
          <button onClick={load} className="mt-3 text-sm text-red-500 underline">إعادة المحاولة</button>
        </div>
      ) : types.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
          <Truck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="font-heading font-black text-gray-400 text-lg">لا توجد أنواع مركبات</p>
          <p className="text-sm text-gray-400 mt-1">ابدأ بإضافة أول نوع من المركبات</p>
          <button onClick={() => setModal(empty)}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors mx-auto">
            <Plus className="w-4 h-4" /> إضافة نوع
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {types.map((t) => (
            <TypeCard key={t.uuid} type={t}
              onEdit={() => setModal({ ...t })}
              onDelete={() => handleDelete(t.uuid, t.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
