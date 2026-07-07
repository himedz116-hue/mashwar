import { useState, useEffect } from "react";
import { getCars, addCar, editCar, deleteCar, getCarTypes, type Car, type CarType } from "@/lib/meshwarApi";
import { Car as CarIcon, RefreshCw, Plus, Pencil, Trash2, XCircle, Check } from "lucide-react";

function Modal({ initial, carTypes, onSave, onClose }: {
  initial: Partial<Car>; carTypes: CarType[];
  onSave: (d: Partial<Car>) => Promise<void>; onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Car>>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const isEdit = !!initial.uuid;
  const set = (k: keyof Car, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setErr("اسم السيارة مطلوب"); return; }
    setSaving(true); setErr("");
    try { await onSave(form); onClose(); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <form className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10] text-lg">{isEdit ? "تعديل السيارة" : "إضافة سيارة"}</h3>
          <button type="button" onClick={onClose}><XCircle className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "اسم السيارة *", key: "name" as const, type: "text" },
            { label: "رقم اللوحة", key: "plate_number" as const, type: "text" },
            { label: "الموديل", key: "model" as const, type: "text" },
            { label: "السنة", key: "year" as const, type: "number" },
            { label: "اللون", key: "color" as const, type: "text" },
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
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">نوع السيارة</label>
            <select
              value={(form.car_type as CarType)?.uuid ?? ""}
              onChange={(e) => set("car_type", carTypes.find((c) => c.uuid === e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] bg-white"
            >
              <option value="">اختر النوع</option>
              {carTypes.map((c) => <option key={c.uuid} value={c.uuid}>{c.name}</option>)}
            </select>
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

export default function CarsManagement() {
  const [cars, setCars] = useState<Car[]>([]);
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Partial<Car> | null>(null);
  const [toast, setToast] = useState("");

  const load = () => {
    setLoading(true); setError("");
    Promise.all([getCars(), getCarTypes()])
      .then(([c, t]) => { setCars(c.data ?? []); setCarTypes(t.data ?? []); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleSave = async (form: Partial<Car>) => {
    if (form.uuid) await editCar(form);
    else await addCar(form);
    showToast(form.uuid ? "✅ تم التعديل" : "✅ تمت الإضافة");
    load();
  };

  const handleDelete = async (uuid: string, name: string) => {
    if (!confirm(`حذف "${name}"?`)) return;
    try { await deleteCar(uuid); showToast("🗑️ تم الحذف"); load(); }
    catch (e: unknown) { showToast("خطأ: " + (e instanceof Error ? e.message : String(e))); }
  };

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F4A10] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold">{toast}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة السيارات</h2>
          <p className="text-sm text-gray-500 mt-0.5">قائمة جميع المركبات المسجلة في المنصة</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> تحديث
          </button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14]">
            <Plus className="w-4 h-4" /> إضافة سيارة
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {cars.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <CarIcon className="w-14 h-14 mx-auto mb-4 opacity-20" />
              <p className="font-bold">لا توجد سيارات</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F6FAF0]">
                  <tr>
                    {["السيارة", "رقم اللوحة", "النوع", "الموديل", "السنة", "اللون", "السائق", ""].map((h) => (
                      <th key={h} className="text-right py-3 px-4 text-xs font-bold text-[#1F4A10]/60">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cars.map((c) => (
                    <tr key={c.uuid} className="hover:bg-[#F6FAF0]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#D4EDA8] flex items-center justify-center">
                            <CarIcon className="w-4 h-4 text-[#1F4A10]" />
                          </div>
                          <span className="font-bold text-[#1F4A10]">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600">{c.plate_number ?? "—"}</td>
                      <td className="py-3 px-4 text-gray-600">{c.car_type?.name ?? "—"}</td>
                      <td className="py-3 px-4 text-gray-600">{c.model ?? "—"}</td>
                      <td className="py-3 px-4 text-gray-600">{c.year ?? "—"}</td>
                      <td className="py-3 px-4 text-gray-600">{c.color ?? "—"}</td>
                      <td className="py-3 px-4 text-gray-600">{c.driver?.name ?? "—"}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setModal(c)} className="p-1.5 rounded-lg text-[#679632] hover:bg-[#F6FAF0]"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(c.uuid, c.name)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {modal && <Modal initial={modal} carTypes={carTypes} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
