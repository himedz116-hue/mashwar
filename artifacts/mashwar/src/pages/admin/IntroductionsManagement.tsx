import { useState, useEffect } from "react";
import { getIntroductions, deleteIntroduction, type Introduction } from "@/lib/meshwarApi";
import { BookOpen, RefreshCw, Plus, Trash2, XCircle, Check } from "lucide-react";
import { getAdminToken } from "@/lib/meshwarApi";

const API_BASE = "http://meshwarsv2.meshwars.net";

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

type FormData = Partial<Introduction> & { imageFile?: File; imagePreview?: string };

function Modal({ initial, onSave, onClose }: {
  initial: FormData; onSave: (d: FormData) => Promise<void>; onClose: () => void;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const isEdit = !!initial.uuid;
  const set = (k: keyof FormData, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <form className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10] text-lg">{isEdit ? "تعديل الشريحة" : "إضافة شريحة"}</h3>
          <button type="button" onClick={onClose}><XCircle className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">العنوان *</label>
          <input value={form.title ?? ""} onChange={(e) => set("title", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">الوصف</label>
          <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)}
            rows={3} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">النوع</label>
            <select value={form.type ?? 1} onChange={(e) => set("type", Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] bg-white">
              <option value={1}>نوع 1</option>
              <option value={2}>نوع 2</option>
              <option value={3}>نوع 3</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">الترتيب</label>
            <input type="number" value={form.sort ?? ""} onChange={(e) => set("sort", Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2">الصورة</label>
          {(form.imagePreview || form.image) && (
            <img src={form.imagePreview ?? form.image} className="w-full h-32 object-cover rounded-xl mb-2" />
          )}
          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-[#679632] transition-colors">
            <Plus className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">اختر صورة</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
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

export default function IntroductionsManagement() {
  const [items, setItems] = useState<Introduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<FormData | null>(null);
  const [toast, setToast] = useState("");

  const load = () => {
    setLoading(true); setError("");
    getIntroductions().then((r) => setItems(r.data ?? [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleSave = async (form: FormData) => {
    await saveIntroduction(form);
    showToast(form.uuid ? "✅ تم التعديل" : "✅ تمت الإضافة");
    load();
  };

  const handleDelete = async (uuid: string, title: string) => {
    if (!confirm(`حذف "${title}"?`)) return;
    try { await deleteIntroduction(uuid); showToast("🗑️ تم الحذف"); load(); }
    catch (e: unknown) { showToast("خطأ: " + (e instanceof Error ? e.message : String(e))); }
  };

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F4A10] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold">{toast}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">شرائح تعريف التطبيق</h2>
          <p className="text-sm text-gray-500 mt-0.5">إدارة شاشات الترحيب والتعريف التي يراها المستخدم أول مرة</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> تحديث
          </button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14]">
            <Plus className="w-4 h-4" /> إضافة شريحة
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen className="w-14 h-14 mx-auto mb-4 opacity-20" />
          <p className="font-bold">لا توجد شرائح</p>
          <button onClick={() => setModal({})} className="mt-3 text-sm text-[#679632] underline">أضف أول شريحة</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.uuid} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              {item.image ? (
                <img src={item.image} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-[#F6FAF0] flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-[#D4EDA8]" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-black text-[#1F4A10] truncate">{item.title}</p>
                    {item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => setModal(item)} className="p-1 rounded-lg text-[#679632] hover:bg-[#F6FAF0]">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.uuid, item.title)} className="p-1 rounded-lg text-red-400 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {item.type != null && <span className="px-2 py-0.5 rounded-full bg-[#D4EDA8] text-[#1F4A10] text-xs font-bold">نوع {item.type}</span>}
                  {item.sort != null && <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">ترتيب {item.sort}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && <Modal initial={modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
