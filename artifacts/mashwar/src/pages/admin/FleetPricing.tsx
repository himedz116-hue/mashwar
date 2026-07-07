import { useState } from "react";
import { Pencil, Check, X, Plus, Truck } from "lucide-react";

interface Vehicle {
  id: number;
  name: string;
  nameEn: string;
  emoji: string;
  startFee: number;
  perKm: number;
  perMinWait: number;
  minFare: number;
  active: boolean;
  trips: number;
}

const initialVehicles: Vehicle[] = [
  { id: 1, name: "وانيت", nameEn: "Pickup", emoji: "🛻", startFee: 15, perKm: 4.5, perMinWait: 0.75, minFare: 35, active: true, trips: 312 },
  { id: 2, name: "دينا", nameEn: "Small Truck", emoji: "🚛", startFee: 25, perKm: 6.0, perMinWait: 1.0, minFare: 60, active: true, trips: 215 },
  { id: 3, name: "دينا ونش", nameEn: "Crane Truck", emoji: "🏗️", startFee: 40, perKm: 8.5, perMinWait: 1.5, minFare: 90, active: true, trips: 98 },
  { id: 4, name: "سطحة", nameEn: "Flatbed", emoji: "🚚", startFee: 50, perKm: 10.0, perMinWait: 2.0, minFare: 120, active: true, trips: 145 },
];

function EditRow({ v, onSave, onCancel }: { v: Vehicle; onSave: (v: Vehicle) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(v);
  const f = (field: keyof Vehicle, val: string) => setDraft((d) => ({ ...d, [field]: parseFloat(val) || 0 }));
  return (
    <div className="border-2 border-[#679632] rounded-2xl p-4 bg-[#F6FAF0] space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{v.emoji}</span>
        <div>
          <p className="font-heading font-black text-[#1F4A10]">{v.name}</p>
          <p className="text-xs text-[#4A5568]/60">{v.nameEn}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "سعر البداية (ريال)", field: "startFee" as const },
          { label: "سعر الكيلومتر", field: "perKm" as const },
          { label: "دقيقة الانتظار", field: "perMinWait" as const },
          { label: "الحد الأدنى للرحلة", field: "minFare" as const },
        ].map((fi) => (
          <div key={fi.field}>
            <label className="text-xs text-[#4A5568]/60 mb-1 block">{fi.label}</label>
            <input
              type="number"
              value={draft[fi.field] as number}
              onChange={(e) => f(fi.field, e.target.value)}
              className="w-full py-2 px-3 border border-[#679632] rounded-xl text-sm font-bold text-[#1F4A10] outline-none focus:ring-2 focus:ring-[#679632]/20"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(draft)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors">
          <Check className="w-4 h-4" /> حفظ
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-colors">
          <X className="w-4 h-4" /> إلغاء
        </button>
      </div>
    </div>
  );
}

export default function FleetPricing() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [editing, setEditing] = useState<number | null>(null);

  const save = (updated: Vehicle) => {
    setVehicles((prev) => prev.map((v) => v.id === updated.id ? updated : v));
    setEditing(null);
  };

  const toggle = (id: number) => {
    setVehicles((prev) => prev.map((v) => v.id === id ? { ...v, active: !v.active } : v));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة الأسطول والتسعير</h2>
          <p className="text-[#4A5568]/60 text-sm mt-1">التحكم في أنواع المركبات وأسعار الرحلات</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors shadow-lg shadow-[#1F4A10]/20">
          <Plus className="w-4 h-4" /> إضافة نوع مركبة
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <span className="text-3xl">{v.emoji}</span>
            <p className="font-heading font-black text-[#1F4A10] mt-2">{v.name}</p>
            <p className="text-xs text-[#4A5568]/60">{v.trips} رحلة هذا الشهر</p>
            <div className={`mt-2 inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${v.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
              {v.active ? "مفعّل" : "معطّل"}
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle cards */}
      <div className="space-y-4">
        {vehicles.map((v) =>
          editing === v.id ? (
            <EditRow key={v.id} v={v} onSave={save} onCancel={() => setEditing(null)} />
          ) : (
            <div key={v.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${v.active ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
              <div className="flex items-center justify-between p-5 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{v.emoji}</span>
                  <div>
                    <h3 className="font-heading font-black text-[#1F4A10] text-lg">{v.name}</h3>
                    <p className="text-xs text-[#4A5568]/50">{v.nameEn} · {v.trips} رحلة هذا الشهر</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggle(v.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      v.active ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {v.active ? "تعطيل" : "تفعيل"}
                  </button>
                  <button
                    onClick={() => setEditing(v.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6FAF0] text-[#679632] text-xs font-bold hover:bg-[#D4EDA8] transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> تعديل الأسعار
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
                {[
                  { label: "سعر البداية", value: `${v.startFee} ريال` },
                  { label: "سعر الكيلومتر", value: `${v.perKm} ريال/كم` },
                  { label: "دقيقة الانتظار", value: `${v.perMinWait} ريال/د` },
                  { label: "الحد الأدنى", value: `${v.minFare} ريال` },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-4">
                    <p className="text-xs text-[#4A5568]/50 mb-1">{item.label}</p>
                    <p className="font-heading font-black text-[#1F4A10]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* Pricing note */}
      <div className="bg-[#F6FAF0] border border-[#3D6B2C]/15 rounded-2xl p-4 flex gap-3">
        <Truck className="w-5 h-5 text-[#679632] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#4A5568]/70 leading-6">
          أسعار الرحلات تُحسب تلقائياً: <strong className="text-[#1F4A10]">سعر البداية + (المسافة × سعر الكيلومتر) + (وقت الانتظار × سعر الدقيقة)</strong>، ولا تقل عن الحد الأدنى المحدد.
        </p>
      </div>
    </div>
  );
}
