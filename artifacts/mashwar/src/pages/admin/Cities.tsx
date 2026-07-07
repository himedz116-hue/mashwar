import { useState } from "react";
import { MapPin, Plus, Pencil, Check, X, Globe } from "lucide-react";

interface City {
  id: number;
  name: string;
  region: string;
  active: boolean;
  drivers: number;
  trips: number;
  surcharge: number;
}

const initialCities: City[] = [
  { id: 1, name: "بريدة", region: "منطقة القصيم", active: true, drivers: 41, trips: 547, surcharge: 0 },
  { id: 2, name: "عنيزة", region: "منطقة القصيم", active: true, drivers: 14, trips: 123, surcharge: 0 },
  { id: 3, name: "الرياض", region: "منطقة الرياض", active: true, drivers: 0, trips: 0, surcharge: 0 },
  { id: 4, name: "جدة", region: "منطقة مكة المكرمة", active: false, drivers: 0, trips: 0, surcharge: 0 },
  { id: 5, name: "الدمام", region: "المنطقة الشرقية", active: false, drivers: 0, trips: 0, surcharge: 0 },
  { id: 6, name: "المذنب", region: "منطقة القصيم", active: true, drivers: 5, trips: 38, surcharge: 10 },
  { id: 7, name: "الرس", region: "منطقة القصيم", active: true, drivers: 7, trips: 62, surcharge: 0 },
];

const geofences = [
  { id: 1, name: "منطقة الصناعية - بريدة", type: "zone", surcharge: 0, city: "بريدة" },
  { id: 2, name: "منطقة بعيدة - شمال بريدة", type: "remote", surcharge: 20, city: "بريدة" },
  { id: 3, name: "مطار الرياض - الملك خالد", type: "zone", surcharge: 15, city: "الرياض" },
];

export default function Cities() {
  const [cities, setCities] = useState(initialCities);
  const [editId, setEditId] = useState<number | null>(null);
  const [editSurcharge, setEditSurcharge] = useState(0);
  const [tab, setTab] = useState<"cities" | "geofences">("cities");

  const toggleCity = (id: number) => {
    setCities((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  };

  const startEdit = (c: City) => {
    setEditId(c.id);
    setEditSurcharge(c.surcharge);
  };

  const saveEdit = (id: number) => {
    setCities((prev) => prev.map((c) => c.id === id ? { ...c, surcharge: editSurcharge } : c));
    setEditId(null);
  };

  const activeCount = cities.filter((c) => c.active).length;
  const totalDrivers = cities.reduce((s, c) => s + c.drivers, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة النطاق الجغرافي والمدن</h2>
        <p className="text-[#4A5568]/60 text-sm mt-1">تحديد المدن النشطة والنطاقات الجغرافية الخاصة</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "مدن نشطة", value: activeCount, color: "#1F4A10", bg: "#D4EDA8" },
          { label: "إجمالي السائقين", value: totalDrivers, color: "#679632", bg: "#D4EDA8" },
          { label: "نطاقات جغرافية", value: geofences.length, color: "#3B82F6", bg: "#DBEAFE" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#4A5568]/60 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: 220 }}>
        <div className="w-full h-full bg-gradient-to-br from-[#F6FAF0] to-[#D4EDA8]/40 flex flex-col items-center justify-center gap-3 relative">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 800 220" className="w-full h-full">
              {[...Array(12)].map((_, i) => (
                <line key={i} x1={i * 70} y1="0" x2={i * 70} y2="220" stroke="#1F4A10" strokeWidth="0.5" />
              ))}
              {[...Array(6)].map((_, i) => (
                <line key={i} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#1F4A10" strokeWidth="0.5" />
              ))}
            </svg>
          </div>
          <Globe className="w-10 h-10 text-[#679632]" />
          <p className="font-heading font-bold text-[#1F4A10]">خريطة النطاق الجغرافي</p>
          <p className="text-xs text-[#4A5568]/50">يتطلب تكامل خرائط جوجل أو Mapbox</p>
          <div className="flex gap-2">
            {cities.filter((c) => c.active).map((c) => (
              <span key={c.id} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1F4A10] text-[#D4EDA8] text-xs font-bold">
                <MapPin className="w-3 h-3" />{c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { key: "cities", label: "المدن والمناطق" },
            { key: "geofences", label: "النطاقات الجغرافية الخاصة" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                tab === t.key ? "text-[#1F4A10] border-b-2 border-[#1F4A10] bg-[#F6FAF0]" : "text-[#4A5568]/60 hover:text-[#1F4A10]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "cities" && (
            <div className="space-y-2">
              {cities.map((c) => (
                <div key={c.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${c.active ? "border-[#3D6B2C]/15 bg-[#F6FAF0]" : "border-gray-100 bg-gray-50 opacity-60"}`}>
                  <MapPin className={`w-5 h-5 flex-shrink-0 ${c.active ? "text-[#679632]" : "text-gray-300"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1F4A10] text-sm">{c.name}</p>
                    <p className="text-xs text-[#4A5568]/50">{c.region}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-6 text-xs text-[#4A5568]/60">
                    <span>{c.drivers} سائق</span>
                    <span>{c.trips} رحلة</span>
                  </div>
                  {/* Surcharge edit */}
                  <div className="flex items-center gap-2">
                    {editId === c.id ? (
                      <>
                        <input
                          type="number"
                          value={editSurcharge}
                          onChange={(e) => setEditSurcharge(parseFloat(e.target.value) || 0)}
                          className="w-16 py-1 px-2 border border-[#679632] rounded-lg text-xs text-center outline-none"
                          placeholder="ريال"
                        />
                        <span className="text-xs text-[#4A5568]/60">ريال إضافي</span>
                        <button onClick={() => saveEdit(c.id)} className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditId(null)} className="p-1 rounded bg-gray-100 text-gray-400 hover:bg-gray-200"><X className="w-3.5 h-3.5" /></button>
                      </>
                    ) : (
                      <>
                        {c.surcharge > 0 && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-lg">+{c.surcharge} ريال</span>
                        )}
                        <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg bg-[#F6FAF0] text-[#679632] hover:bg-[#D4EDA8] transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => toggleCity(c.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${c.active ? "bg-[#679632]" : "bg-gray-200"}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${c.active ? "translate-x-1" : "translate-x-6"}`} />
                  </button>
                </div>
              ))}
              <button className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#3D6B2C]/20 text-[#679632] text-sm font-bold hover:border-[#679632] hover:bg-[#F6FAF0] transition-all">
                <Plus className="w-4 h-4" /> إضافة مدينة جديدة
              </button>
            </div>
          )}

          {tab === "geofences" && (
            <div className="space-y-3">
              {geofences.map((g) => (
                <div key={g.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-[#F6FAF0]">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${g.type === "remote" ? "bg-amber-100" : "bg-blue-100"}`}>
                    <MapPin className={`w-5 h-5 ${g.type === "remote" ? "text-amber-600" : "text-blue-500"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1F4A10] text-sm">{g.name}</p>
                    <p className="text-xs text-[#4A5568]/50">{g.city} · {g.type === "remote" ? "منطقة بعيدة" : "نطاق خاص"}</p>
                  </div>
                  {g.surcharge > 0 && (
                    <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-xl">رسوم إضافية: {g.surcharge} ريال</span>
                  )}
                  <button className="p-1.5 rounded-lg bg-white text-[#679632] border border-gray-100 hover:bg-[#D4EDA8] transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#3D6B2C]/20 text-[#679632] text-sm font-bold hover:border-[#679632] hover:bg-[#F6FAF0] transition-all">
                <Plus className="w-4 h-4" /> رسم نطاق جغرافي جديد
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
