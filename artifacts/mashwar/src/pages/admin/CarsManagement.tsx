import { useState, useEffect } from "react";
import {
  getCars, showCar, addCar, editCar, deleteCar, getCarTypes, addCarType,
  getImageUrl, type Car, type CarType, type CarPriceRule, type CarPrices
} from "@/lib/meshwarApi";
import {
  Car as CarIcon, RefreshCw, Plus, X,
  AlertCircle, Image as ImageIcon, ChevronDown, Trash, Search, Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 }
};

const defaultPrices: CarPrices = { inside: [], outside: [] };

// ── Mini modal to add a new car type inline ────────────────
function AddCarTypeModal({ onClose, onAdded }: { onClose: () => void; onAdded: (t: CarType) => void }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr("اسم النوع مطلوب"); return; }
    setSaving(true); setErr("");
    try {
      const res = await addCarType({ name: name.trim() }) as { data: CarType };
      onAdded(res?.data ?? ({ uuid: Date.now().toString(), name: name.trim() } as CarType));
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally { setSaving(false); }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4 border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10] text-xl">إضافة نوع جديد</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {err && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {err}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">اسم النوع</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: مغطاة"
            autoFocus
            className="w-full px-4 py-3 rounded-xl border border-[#679632] text-sm font-bold text-gray-800 outline-none focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-white text-right"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-[#679632] text-white font-bold text-sm hover:bg-[#1F4A10] transition-colors disabled:opacity-50"
          >
            {saving ? "جاري الإضافة..." : "إضافة"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </motion.form>
    </div>
  );
}

// ── Car detail / edit modal ────────────────────────────────
function EditModal({
  initial, carTypes: initialCarTypes, onSave, onDelete, onClose
}: {
  initial: Partial<Car>;
  carTypes: CarType[];
  onSave: (data: FormData) => Promise<void>;
  onDelete?: (uuid: string) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<{ name: string; is_active: boolean; imageFile?: File; imagePreview?: string }>(() => ({
    name: initial.name || "",
    is_active: initial.is_active ?? true,
    imagePreview: initial.image ? getImageUrl(initial.image) : undefined,
  }));
  const [prices, setPrices] = useState<CarPrices>(initial.carPrices || defaultPrices);
  const [activeTab, setActiveTab] = useState<"inside" | "outside">("inside");
  const [carTypes, setCarTypes] = useState<CarType[]>(initialCarTypes);
  const [selectedTypeUuid, setSelectedTypeUuid] = useState<string>(initialCarTypes[0]?.uuid || "");
  const [showAddType, setShowAddType] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState("");
  const isEdit = !!initial.uuid;

  useEffect(() => {
    if (carTypes.length > 0 && !selectedTypeUuid) {
      setSelectedTypeUuid(carTypes[0].uuid);
    }
  }, [carTypes, selectedTypeUuid]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setForm((p) => ({ ...p, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    }
  };

  // Pure helper — no closure over component state.
  // Priority: exact UUID match → null/undefined group (shared prices).
  const findGroupIdx = (
    groups: { car_type_uuid: string | null; prices: CarPriceRule[] }[],
    typeUuid: string
  ): number => {
    const exact = groups.findIndex((g) => g.car_type_uuid === typeUuid);
    if (exact !== -1) return exact;
    // Fall back to null/empty-uuid group (prices not tied to a type)
    return groups.findIndex((g) => !g.car_type_uuid);
  };

  const getActiveTypePrices = (): CarPriceRule[] => {
    const groups = (prices[activeTab] || []) as { car_type_uuid: string | null; prices: CarPriceRule[] }[];
    const idx = findGroupIdx(groups, selectedTypeUuid);
    return idx !== -1 ? groups[idx].prices : [];
  };

  // Returns a new CarPrices object with the group guaranteed to exist.
  const ensureGroup = (
    prev: CarPrices,
    tab: "inside" | "outside",
    typeUuid: string
  ): [CarPrices, number] => {
    const groups = [...(prev[tab] || [])] as { car_type_uuid: string | null; prices: CarPriceRule[] }[];
    let idx = findGroupIdx(groups, typeUuid);
    if (idx === -1) {
      groups.push({ car_type_uuid: typeUuid, prices: [] });
      idx = groups.length - 1;
    }
    return [{ ...prev, [tab]: groups }, idx];
  };

  const updatePriceRule = (index: number, key: keyof CarPriceRule, value: unknown) => {
    setPrices((prev) => {
      const [next, idx] = ensureGroup(prev, activeTab, selectedTypeUuid);
      const newPrices = [...next[activeTab][idx].prices];
      newPrices[index] = { ...newPrices[index], [key]: value };
      next[activeTab] = next[activeTab].map((g, i) =>
        i === idx ? { ...g, prices: newPrices } : g
      );
      return next;
    });
  };

  const addPriceRule = () => {
    setPrices((prev) => {
      const [next, idx] = ensureGroup(prev, activeTab, selectedTypeUuid);
      const newPrices = [
        ...next[activeTab][idx].prices,
        {
          car_type_uuid: selectedTypeUuid || null,
          place_type: activeTab,
          distance_scale: "bigger",
          max_distance: "20",
          price: "",
          commission: "",
          name: "",
        } as unknown as CarPriceRule,
      ];
      next[activeTab] = next[activeTab].map((g, i) =>
        i === idx ? { ...g, prices: newPrices } : g
      );
      return next;
    });
  };

  const removePriceRule = (index: number) => {
    setPrices((prev) => {
      const [next, idx] = ensureGroup(prev, activeTab, selectedTypeUuid);
      const newPrices = [...next[activeTab][idx].prices];
      newPrices.splice(index, 1);
      next[activeTab] = next[activeTab].map((g, i) =>
        i === idx ? { ...g, prices: newPrices } : g
      );
      return next;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setErr("اسم السيارة مطلوب"); return; }
    if (!isEdit && !form.imageFile) { setErr("صورة السيارة مطلوبة"); return; }

    setSaving(true); setErr("");
    try {
      const formData = new FormData();
      if (isEdit && initial.uuid) formData.append("uuid", initial.uuid);
      formData.append("name", form.name);
      formData.append("is_active", form.is_active ? "1" : "0");
      if (form.imageFile) formData.append("image", form.imageFile);
      formData.append("carPrices", JSON.stringify(prices));

      await onSave(formData);
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !initial.uuid || !onDelete) return;
    if (!confirm("هل أنت متأكد من حذف هذه السيارة بشكل نهائي؟")) return;
    setDeleting(true); setErr("");
    try { await onDelete(initial.uuid); onClose(); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); setDeleting(false); }
  };

  const activePrices = getActiveTypePrices();

  return (
    <>
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-heading font-black text-[#1F4A10] text-2xl">تفاصيل السيارة</h3>
            <button type="button" onClick={onClose} className="p-2 bg-white hover:bg-red-50 hover:text-red-500 rounded-full shadow-sm transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={submit} className="overflow-y-auto custom-scroll p-6 space-y-6 flex-1">
            {err && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 font-bold border border-red-100">
                <AlertCircle className="w-5 h-5" /> {err}
              </div>
            )}


            {/* Image & Name */}
            <div className="flex flex-col items-center gap-4">
              <label className="relative cursor-pointer group">
                <div className="w-32 h-32 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#679632] group-hover:bg-[#F6FAF0]">
                  {form.imagePreview ? (
                    <img src={form.imagePreview} className="w-full h-full object-cover" alt="vehicle" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-300 group-hover:text-[#679632]" />
                  )}
                </div>
                <div className="mt-3 text-center text-sm font-bold text-gray-600 group-hover:text-[#679632]">
                  ادخل صورة السيارة
                </div>
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>

              <div className="w-full max-w-sm mt-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">اسم السيارة</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="سطحة"
                  className="w-full px-4 py-3 rounded-xl border border-[#679632] text-sm font-bold text-gray-800 outline-none focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-white text-center"
                />
              </div>
            </div>

            {/* Inside / Outside tabs */}
            <div className="flex items-center justify-center border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab("outside")}
                className={`px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-px ${
                  activeTab === "outside"
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                خارج المدينة
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("inside")}
                className={`px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-px ${
                  activeTab === "inside"
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                داخل المدينة
              </button>
            </div>

            {/* Car type selector */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">اختار النوع</label>
              <div className="relative">
                <select
                  value={selectedTypeUuid}
                  onChange={(e) => setSelectedTypeUuid(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#679632] text-sm font-bold text-gray-800 outline-none focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-white appearance-none"
                >
                  {carTypes.length === 0 && (
                    <option value="">— لا توجد أنواع —</option>
                  )}
                  {carTypes.map((c) => (
                    <option key={c.uuid} value={c.uuid}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#679632] pointer-events-none" />
              </div>
            </div>

            {/* Price rules */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={addPriceRule}
                  disabled={!selectedTypeUuid}
                  className="flex items-center gap-1.5 text-sm font-bold text-[#1F4A10] hover:text-[#679632] transition-colors disabled:opacity-40"
                >
                  <Plus className="w-5 h-5 bg-[#679632] text-white rounded-full p-0.5" />
                  اكتب السعر
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {activePrices.map((rule, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border border-[#679632] rounded-xl overflow-hidden bg-white"
                    >
                      {/* Row 1: commission | price | description */}
                      <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#679632] border-b border-[#679632]">
                        <div className="p-2 flex items-center justify-center">
                          <input
                            type="text"
                            value={String(rule.commission)}
                            onChange={(e) => updatePriceRule(idx, "commission", e.target.value)}
                            placeholder="0.00"
                            className="w-full text-center outline-none font-bold text-sm"
                          />
                        </div>
                        <div className="p-2 flex items-center justify-center">
                          <input
                            type="text"
                            value={String(rule.price)}
                            onChange={(e) => updatePriceRule(idx, "price", e.target.value)}
                            placeholder="0.00"
                            className="w-full text-center outline-none font-bold text-sm"
                          />
                        </div>
                        <div className="p-2 flex items-center justify-center bg-gray-50">
                          <input
                            type="text"
                            value={rule.name || ""}
                            onChange={(e) => updatePriceRule(idx, "name", e.target.value)}
                            placeholder="الوصف"
                            className="w-full text-right bg-transparent outline-none text-sm text-gray-500"
                          />
                        </div>
                      </div>
                      {/* Row 2: km | distance | scale | delete */}
                      <div className="grid grid-cols-4 divide-x divide-x-reverse divide-[#679632]">
                        <div className="col-span-1 p-2 flex items-center justify-center border-l border-[#679632]">
                          <span className="text-sm font-bold">كم</span>
                        </div>
                        <div className="col-span-1 p-2 flex items-center justify-center border-l border-[#679632]">
                          <input
                            type="text"
                            value={String(rule.max_distance)}
                            onChange={(e) => updatePriceRule(idx, "max_distance", e.target.value)}
                            placeholder="20"
                            className="w-full text-center outline-none font-bold text-sm"
                          />
                        </div>
                        <div className="col-span-2 p-2 relative flex items-center bg-white">
                          <select
                            value={rule.distance_scale}
                            onChange={(e) => updatePriceRule(idx, "distance_scale", e.target.value)}
                            className="w-full appearance-none outline-none text-sm font-bold text-right pr-2 pl-8"
                          >
                            <option value="bigger">أكبر من</option>
                            <option value="less_or_equal">أقل من أو يساوي</option>
                          </select>
                          <ChevronDown className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-[#679632] pointer-events-none" />
                          <button
                            type="button"
                            onClick={() => removePriceRule(idx)}
                            className="absolute left-1 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 p-1"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {activePrices.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm font-bold border-2 border-dashed border-gray-200 rounded-xl">
                    لا توجد تسعيرات لهذا النوع
                  </div>
                )}
              </div>

              {/* Add new car type button — matches screenshot */}
              <button
                type="button"
                onClick={() => setShowAddType(true)}
                className="flex items-center gap-2 text-sm font-bold text-[#679632] hover:text-[#1F4A10] transition-colors mt-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#679632] text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                أضف نوع جديد
              </button>
            </div>

            {/* Action buttons */}
            <div className="pt-4 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, is_active: !p.is_active }))}
                className={`py-3.5 rounded-xl font-bold text-sm transition-colors ${
                  !form.is_active ? "bg-gray-200 text-gray-700" : "bg-[#2A3642] text-white hover:opacity-90"
                }`}
              >
                {form.is_active ? "تعطيل" : "تفعيل"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!isEdit || deleting}
                className="py-3.5 rounded-xl bg-[#FF4B4B] text-white font-bold text-sm hover:opacity-90 transition-colors disabled:opacity-40"
              >
                {deleting ? "جاري الحذف..." : "حذف السيارة"}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="py-3.5 rounded-xl bg-[#679632] text-white font-bold text-sm hover:bg-[#1F4A10] transition-colors disabled:opacity-50"
              >
                {saving ? "جاري التحديث..." : "تحديث"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Add car type inline modal */}
      <AnimatePresence>
        {showAddType && (
          <AddCarTypeModal
            onClose={() => setShowAddType(false)}
            onAdded={(newType) => {
              setCarTypes((prev) => [...prev, newType]);
              setSelectedTypeUuid(newType.uuid);
              setShowAddType(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function CarsManagement() {
  const [items, setItems] = useState<Car[]>([]);
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [modal, setModal] = useState<{ show: boolean; data?: Partial<Car> }>({ show: false });
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true); setErr("");
    try {
      const [carsRes, typesRes] = await Promise.all([getCars(), getCarTypes()]);
      setItems(carsRes.data ?? []);
      setCarTypes(typesRes.data ?? []);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "فشل جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleEdit = async (c: Car) => {
    try {
      setLoading(true);
      const res = await showCar(c.uuid);
      setModal({ show: true, data: res.data });
    } catch {
      alert("فشل جلب تفاصيل السيارة");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: FormData) => {
    if (modal.data?.uuid) await editCar(data);
    else await addCar(data);
    await loadData();
  };

  const handleDelete = async (uuid: string) => {
    await deleteCar(uuid);
    await loadData();
  };

  const filtered = items.filter((c) => !search || c.name?.includes(search));

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#1F4A10]">إدارة فئات السيارات وتسعيرها</h2>
          <p className="text-sm text-gray-500 mt-1">
            إضافة وتعديل فئات المركبات المتاحة (سطحة، دباب...) وإدارة تسعيرتها حسب النوع
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#1F4A10] hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setModal({ show: true, data: {} })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#679632] text-white text-sm font-bold hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> إضافة فئة مركبة
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث باسم المركبة..."
          className="flex-1 bg-transparent border-none text-sm font-bold outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      {err ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 font-bold border border-red-100">
          <AlertCircle className="w-5 h-5" /> {err}
        </div>
      ) : loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <CarIcon className="w-16 h-16 mb-4 opacity-20" />
          <p className="font-bold text-lg text-gray-500">لا توجد سيارات</p>
          <p className="text-sm mt-1">قم بإضافة فئات السيارات مثل سطحة لتظهر هنا</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filtered.map((c) => (
              <motion.div
                key={c.uuid}
                variants={itemVariants}
                layout
                onClick={() => handleEdit(c)}
                className="bg-white rounded-[2rem] border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden flex flex-col items-center"
              >
                <div className="aspect-square w-full rounded-2xl bg-gray-50 flex items-center justify-center p-4 mb-4 relative overflow-hidden group-hover:bg-[#F6FAF0] transition-colors">
                  {c.image
                    ? <img src={getImageUrl(c.image)} className="w-full h-full object-contain mix-blend-multiply" alt={c.name} />
                    : <CarIcon className="w-12 h-12 text-gray-300" />}
                  <div className={`absolute top-3 left-3 w-3 h-3 rounded-full border-2 border-white shadow-sm ${c.is_active ? "bg-green-500" : "bg-red-500"}`} />
                </div>
                <h3 className="text-lg font-black font-heading text-center text-[#1F4A10]">{c.name}</h3>
                <div className="flex justify-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-bold text-[#679632] bg-[#D4EDA8]/50 px-3 py-1 rounded-full">
                    تعديل التسعير والتفاصيل
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {modal.show && (
          <EditModal
            initial={modal.data || {}}
            carTypes={carTypes}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={() => setModal({ show: false })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
