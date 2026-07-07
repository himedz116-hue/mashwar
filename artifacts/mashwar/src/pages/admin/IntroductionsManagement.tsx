import { useState, useEffect, useRef } from "react";
import { getIntroductions, addIntroduction, editIntroduction, deleteIntroduction, getAdminToken, type Introduction } from "@/lib/meshwarApi";
import { BookOpen, RefreshCw, Plus, Trash2, XCircle, Check, Upload, Smartphone, Apple, GripVertical, Eye } from "lucide-react";

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
    if (file) {
      set("imageFile", file);
      set("imagePreview", URL.createObjectURL(file));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { setErr("العنوان مطلوب"); return; }
    setSaving(true); setErr("");
    try { await onSave(form); onClose(); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setSaving(false); }
  };

  const previewSrc = form.imagePreview ?? form.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <form className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 max-h-[92vh] overflow-y-auto" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-[#1F4A10] text-xl">{isEdit ? "تعديل الشريحة" : "إضافة شريحة تعريفية"}</h3>
            <p className="text-xs text-gray-400 mt-0.5">تظهر في تطبيق Android و iOS عند التشغيل الأول</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <XCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Platform badges */}
        <div className="flex gap-2 p-3 bg-[#F6FAF0] rounded-xl border border-[#D4EDA8]">
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-lg">
            <Smartphone className="w-3.5 h-3.5 text-green-700" />
            <span className="text-xs font-bold text-green-700">Android</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
            <Apple className="w-3.5 h-3.5 text-gray-700" />
            <span className="text-xs font-bold text-gray-700">iOS</span>
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2">صورة الشريحة</label>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          {previewSrc ? (
            <div className="relative mb-3">
              <img src={previewSrc} className="w-full h-40 object-cover rounded-2xl border-2 border-[#D4EDA8]" />
              <div className="absolute inset-0 rounded-2xl bg-black/0 hover:bg-black/10 transition-all flex items-center justify-center">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="bg-white/90 text-[#1F4A10] text-xs font-bold px-3 py-1.5 rounded-xl opacity-0 hover:opacity-100 transition-opacity">
                  تغيير الصورة
                </button>
              </div>
              <button type="button" onClick={() => { set("imageFile", undefined); set("imagePreview", ""); set("image", ""); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ) : null}
          <button type="button" onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#D4EDA8] rounded-2xl p-4 text-[#679632] hover:border-[#679632] hover:bg-[#F6FAF0] transition-all">
            <Upload className="w-5 h-5" />
            <span className="text-sm font-bold">{previewSrc ? "تغيير الصورة" : "اختر صورة للشريحة"}</span>
          </button>
          {form.imageFile && (
            <p className="text-xs text-green-600 mt-1 font-bold">✅ {form.imageFile.name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">العنوان *</label>
          <input value={form.title ?? ""} onChange={(e) => set("title", e.target.value)}
            placeholder="عنوان الشريحة..."
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">الوصف</label>
          <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)}
            rows={3} placeholder="وصف مختصر يظهر تحت العنوان..."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">النوع</label>
            <select value={form.type ?? 1} onChange={(e) => set("type", Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] bg-white">
              <option value={1}>نوع 1 - للمستخدم</option>
              <option value={2}>نوع 2 - للسائق</option>
              <option value={3}>نوع 3 - عام</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">الترتيب</label>
            <input type="number" min="1" value={form.sort ?? ""} onChange={(e) => set("sort", Number(e.target.value))}
              placeholder="1"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
          </div>
        </div>

        {err && <p className="text-red-500 text-xs bg-red-50 p-3 rounded-xl">{err}</p>}

        <button type="submit" disabled={saving}
          className="w-full py-3.5 rounded-xl bg-gradient-to-l from-[#679632] to-[#1F4A10] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1F4A10]/20">
          <Check className="w-4 h-4" /> {saving ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة الشريحة"}
        </button>
      </form>
    </div>
  );
}

function SlideCard({ intro, onEdit, onDelete }: { intro: Introduction; onEdit: () => void; onDelete: () => void }) {
  const typeLabels: Record<number, string> = { 1: "مستخدم", 2: "سائق", 3: "عام" };
  const typeColors: Record<number, string> = { 1: "bg-blue-100 text-blue-700", 2: "bg-green-100 text-green-700", 3: "bg-purple-100 text-purple-600" };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-[#F6FAF0] to-[#D4EDA8]/30 overflow-hidden">
        {intro.image ? (
          <img src={intro.image} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-[#D4EDA8]" />
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button onClick={onEdit} className="w-9 h-9 rounded-xl bg-white shadow text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="w-9 h-9 rounded-xl bg-white shadow text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        {/* Sort badge */}
        <div className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-[#1F4A10] text-white text-xs font-black flex items-center justify-center shadow">
          {intro.sort ?? "—"}
        </div>
        {/* Type badge */}
        {intro.type != null && (
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs font-bold ${typeColors[intro.type] ?? "bg-gray-100 text-gray-500"}`}>
            {typeLabels[intro.type] ?? intro.type}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-black text-[#1F4A10] leading-tight line-clamp-1">{intro.title}</h3>
        {intro.description && (
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{intro.description}</p>
        )}
        <div className="flex gap-2 mt-3">
          <button onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#F6FAF0] text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors text-xs font-bold">
            تعديل
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

export default function IntroductionsManagement() {
  const [items, setItems] = useState<Introduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<FormState | null>(null);
  const [toast, setToast] = useState("");
  const [typeFilter, setTypeFilter] = useState<number | "all">("all");

  const load = () => {
    setLoading(true); setError("");
    getIntroductions()
      .then((r) => setItems(r.data ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const handleSave = async (form: FormState) => {
    await saveIntroduction(form);
    showToast(form.uuid ? "✅ تم التعديل بنجاح" : "✅ تمت الإضافة بنجاح");
    load();
  };

  const handleDelete = async (uuid: string, title: string) => {
    if (!confirm(`حذف شريحة "${title}"؟`)) return;
    try { await deleteIntroduction(uuid); showToast("🗑️ تم الحذف"); load(); }
    catch (e: unknown) { showToast("خطأ: " + (e instanceof Error ? e.message : String(e))); }
  };

  const filtered = items.filter((i) => typeFilter === "all" || i.type === typeFilter);

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F4A10] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold">
          {toast}
        </div>
      )}
      {modal && <Modal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">شرائح تعريف التطبيق</h2>
          <p className="text-sm text-gray-500 mt-0.5">إدارة الشرائح التعريفية على 🤖 Android و 🍎 iOS مع رفع الصور</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> تحديث
          </button>
          <button onClick={() => setModal({ type: 1, sort: items.length + 1 })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors shadow-md shadow-[#1F4A10]/20">
            <Plus className="w-4 h-4" /> إضافة شريحة
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "إجمالي الشرائح", value: items.length, color: "#1F4A10", bg: "#D4EDA8" },
          { label: "للمستخدمين", value: items.filter((i) => i.type === 1).length, color: "#2563eb", bg: "#dbeafe" },
          { label: "للسائقين", value: items.filter((i) => i.type === 2).length, color: "#679632", bg: "#D4EDA8" },
          { label: "مع صور", value: items.filter((i) => i.image).length, color: "#7c3aed", bg: "#ede9fe" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {([["all", "الكل"], [1, "مستخدمون"], [2, "سائقون"], [3, "عام"]] as [number | "all", string][]).map(([v, l]) => (
          <button key={v} onClick={() => setTypeFilter(v)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${typeFilter === v ? "bg-[#1F4A10] text-white shadow" : "bg-white border border-gray-200 text-gray-500 hover:border-[#D4EDA8]"}`}>
            {l}
          </button>
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
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
          <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="font-heading font-black text-gray-400 text-lg">لا توجد شرائح</p>
          <p className="text-sm text-gray-400 mt-1">ابدأ بإضافة أول شريحة تعريفية للتطبيق</p>
          <button onClick={() => setModal({ type: 1, sort: 1 })}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors mx-auto">
            <Plus className="w-4 h-4" /> إضافة شريحة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered
            .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
            .map((intro) => (
              <SlideCard key={intro.uuid} intro={intro}
                onEdit={() => setModal({ ...intro })}
                onDelete={() => handleDelete(intro.uuid, intro.title)}
              />
            ))}
        </div>
      )}
    </div>
  );
}
