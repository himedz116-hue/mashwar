import { useState, useEffect } from "react";
import { getCars, addCar, editCar, deleteCar, getCarTypes, type Car, type CarType } from "@/lib/meshwarApi";
import {
  Car as CarIcon, RefreshCw, Plus, Pencil, Trash2, XCircle,
  Check, Search, X, Smartphone, Apple, User, Shield,
} from "lucide-react";

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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
              <CarIcon className="w-5 h-5 text-[#1F4A10]" />
            </div>
            <h3 className="font-heading font-black text-[#1F4A10] text-lg">{isEdit ? "تعديل السيارة" : "إضافة سيارة"}</h3>
          </div>
          <button type="button" onClick={onClose}><XCircle className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "اسم السيارة *", key: "name" as const, type: "text", col: 2 },
            { label: "رقم اللوحة", key: "plate_number" as const, type: "text", col: 1 },
            { label: "الموديل", key: "model" as const, type: "text", col: 1 },
            { label: "السنة", key: "year" as const, type: "number", col: 1 },
            { label: "اللون", key: "color" as const, type: "text", col: 1 },
          ].map((f) => (
            <div key={f.key} className={f.col === 2 ? "col-span-2" : ""}>
              <label className="block text-xs font-bold text-gray-500 mb-1">{f.label}</label>
              <input
                type={f.type} value={String(form[f.key] ?? "")}
                onChange={(e) => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-500 mb-1">نوع السيارة</label>
            <select
              value={(form.car_type as CarType)?.uuid ?? ""}
              onChange={(e) => set("car_type", carTypes.find((c) => c.uuid === e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] bg-white"
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

function CarCard({ car, onEdit, onDelete }: { car: Car; onEdit: () => void; onDelete: () => void }) {
  const colors: Record<string, string> = {
    أحمر: "#ef4444", أبيض: "#f3f4f6", أسود: "#1f2937", فضي: "#94a3b8",
    رمادي: "#6b7280", أزرق: "#3b82f6", أخضر: "#22c55e", ذهبي: "#f59e0b",
  };
  const colorHex = car.color ? colors[car.color] ?? "#6b7280" : "#6b7280";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all group relative overflow-hidden">
      {/* Color stripe */}
      <div className="absolute top-0 right-0 left-0 h-1 rounded-t-2xl" style={{ background: colorHex }} />

      <div className="pt-1 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
              <CarIcon className="w-6 h-6 text-[#1F4A10]" />
            </div>
            <div>
              <p className="font-heading font-black text-[#1F4A10]">{car.name}</p>
              {car.plate_number && (
                <p className="text-xs font-mono bg-[#F6FAF0] px-2 py-0.5 rounded-lg text-[#679632] font-bold mt-0.5">
                  {car.plate_number}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 rounded-lg text-[#679632] hover:bg-[#F6FAF0]">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "النوع", value: car.car_type?.name },
            { label: "الموديل", value: car.model },
            { label: "السنة", value: car.year },
            { label: "اللون", value: car.color },
          ].map((r) => r.value ? (
            <div key={r.label} className="bg-[#F6FAF0] rounded-xl px-3 py-2">
              <p className="text-[10px] text-gray-400">{r.label}</p>
              <p className="font-bold text-[#1F4A10] text-xs mt-0.5">{String(r.value)}</p>
            </div>
          ) : null)}
        </div>

        {car.driver && (
          <div className="flex items-center gap-2 p-2.5 bg-[#F6FAF0] rounded-xl border border-[#D4EDA8]/50">
            <User className="w-4 h-4 text-[#679632] flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400">السائق</p>
              <p className="font-bold text-[#1F4A10] text-xs">{car.driver.name}</p>
            </div>
            <Shield className="w-3.5 h-3.5 text-green-500 mr-auto" />
          </div>
        )}

        {/* Platform badges */}
        <div className="flex gap-1.5">
          <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-lg">
            <Smartphone className="w-2.5 h-2.5" /> Android
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-lg">
            <Apple className="w-2.5 h-2.5" /> iOS
          </span>
        </div>
      </div>
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
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [view, setView] = useState<"grid" | "table">("grid");

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

  const filtered = cars.filter((c) => {
    const matchSearch = !search || c.name?.includes(search) || c.plate_number?.includes(search) || c.driver?.name?.includes(search);
    const matchType = typeFilter === "all" || c.car_type?.uuid === typeFilter;
    return matchSearch && matchType;
  });

  const withDriverCount = cars.filter((c) => c.driver).length;

  return (
    <div className="space-y-5" dir="rtl">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F4A10] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold z-50">{toast}</div>}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة السيارات</h2>
          <p className="text-sm text-gray-500 mt-0.5">جميع المركبات المسجلة على منصة مشوار</p>
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
            <Plus className="w-4 h-4" /> إضافة سيارة
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "إجمالي السيارات", value: cars.length, color: "#1F4A10", bg: "#D4EDA8" },
          { label: "مربوطة بسائقين", value: withDriverCount, color: "#16a34a", bg: "#dcfce7" },
          { label: "بدون سائق", value: cars.length - withDriverCount, color: "#d97706", bg: "#fef3c7" },
          { label: "أنواع السيارات", value: carTypes.length, color: "#7c3aed", bg: "#ede9fe" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-3xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            <div className="h-1 rounded-full mt-3" style={{ background: s.bg }} />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
            placeholder="البحث بالاسم، رقم اللوحة، أو السائق..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        <select
          value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] bg-white min-w-[160px]"
        >
          <option value="all">كل الأنواع</option>
          {carTypes.map((t) => <option key={t.uuid} value={t.uuid}>{t.name}</option>)}
        </select>
        {/* View toggle */}
        <div className="flex gap-1 bg-[#F6FAF0] rounded-xl p-1">
          <button onClick={() => setView("grid")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === "grid" ? "bg-white shadow text-[#1F4A10]" : "text-gray-400"}`}>
            ⊞ شبكة
          </button>
          <button onClick={() => setView("table")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === "table" ? "bg-white shadow text-[#1F4A10]" : "text-gray-400"}`}>
            ≡ جدول
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-500 font-bold text-sm">{error}</p>
          <button onClick={load} className="mt-3 text-sm text-[#679632] underline">إعادة المحاولة</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <CarIcon className="w-14 h-14 mx-auto mb-4 text-gray-200" />
          <p className="font-bold text-gray-400">لا توجد سيارات</p>
          {!search && <button onClick={() => setModal({})} className="mt-3 text-sm text-[#679632] underline font-bold">أضف أول سيارة</button>}
        </div>
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CarCard key={c.uuid} car={c} onEdit={() => setModal(c)} onDelete={() => handleDelete(c.uuid, c.name)} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F6FAF0]">
                <tr>
                  {["السيارة", "رقم اللوحة", "النوع", "الموديل", "السنة", "اللون", "السائق", ""].map((h) => (
                    <th key={h} className="text-right py-3.5 px-4 text-xs font-bold text-[#1F4A10]/60 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c.uuid} className="hover:bg-[#F6FAF0]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#D4EDA8] flex items-center justify-center flex-shrink-0">
                          <CarIcon className="w-4 h-4 text-[#1F4A10]" />
                        </div>
                        <span className="font-bold text-[#1F4A10]">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600 text-xs">{c.plate_number ?? "—"}</td>
                    <td className="py-3.5 px-4 text-gray-600 text-xs">{c.car_type?.name ?? "—"}</td>
                    <td className="py-3.5 px-4 text-gray-600 text-xs">{c.model ?? "—"}</td>
                    <td className="py-3.5 px-4 text-gray-600 text-xs">{c.year ?? "—"}</td>
                    <td className="py-3.5 px-4 text-xs">
                      {c.color ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full" style={{ background: "#6b7280" }} />
                          {c.color}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 text-xs">{c.driver?.name ?? <span className="text-gray-300">بدون سائق</span>}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setModal(c)} className="p-1.5 rounded-lg text-[#679632] hover:bg-[#F6FAF0] transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(c.uuid, c.name)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400 text-center">
            عرض {filtered.length} من {cars.length} سيارة
          </div>
        </div>
      )}

      {modal && <Modal initial={modal} carTypes={carTypes} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
