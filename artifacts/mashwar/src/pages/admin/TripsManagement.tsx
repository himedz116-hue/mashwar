import { useState } from "react";
import { MapPin, Clock, CheckCircle, XCircle, Truck, User } from "lucide-react";

const activeTrips = [
  { id: "T-1001", customer: "محمد الأحمد", driver: "خالد القحطاني", vehicle: "وانيت", from: "حي الفلاح، بريدة", to: "حي العليا، بريدة", price: "85 ريال", started: "13:24", progress: 65 },
  { id: "T-1002", customer: "نورة الزهراني", driver: "عمر البقمي", vehicle: "دينا ونش", from: "الرياض - حي النزهة", to: "بريدة - حي الورود", price: "420 ريال", started: "12:55", progress: 40 },
  { id: "T-1003", customer: "فهد العتيبي", driver: "سليمان الغامدي", vehicle: "دينا", from: "القصيم مول", to: "مستودعات الصناعية", price: "210 ريال", started: "13:10", progress: 80 },
];

const pendingTrips = [
  { id: "T-1004", customer: "سارة المطيري", vehicle: "وانيت", from: "حي الملك فهد", to: "حي الربوة", price: "65 ريال", scheduledAt: "اليوم 15:00" },
  { id: "T-1005", customer: "عبدالرحمن الشمري", vehicle: "سطحة", from: "شارع الملك عبدالعزيز", to: "ميناء الملك عبدالله", price: "780 ريال", scheduledAt: "غداً 09:00" },
];

const historyTrips = [
  { id: "T-0998", customer: "ريم الدوسري", driver: "إبراهيم الحربي", vehicle: "سطحة", price: "340 ريال", date: "2024-07-06", status: "completed", duration: "48 دقيقة" },
  { id: "T-0997", customer: "محمد الأحمد", driver: "طارق المالكي", vehicle: "وانيت", price: "90 ريال", date: "2024-07-06", status: "completed", duration: "22 دقيقة" },
  { id: "T-0996", customer: "خالد السعيد", driver: "خالد القحطاني", vehicle: "وانيت", price: "110 ريال", date: "2024-07-05", status: "cancelled_customer", duration: "—" },
  { id: "T-0995", customer: "هنا العمري", driver: "حمد المطيري", vehicle: "دينا", price: "180 ريال", date: "2024-07-05", status: "completed", duration: "35 دقيقة" },
  { id: "T-0994", customer: "عبدالله الفيفي", driver: "—", vehicle: "وانيت", price: "70 ريال", date: "2024-07-04", status: "cancelled_driver", duration: "—" },
];

const statusBadge = (s: string) => {
  const map: Record<string, { label: string; cls: string }> = {
    completed: { label: "مكتملة", cls: "bg-green-100 text-green-700" },
    cancelled_customer: { label: "ملغاة (العميل)", cls: "bg-gray-100 text-gray-500" },
    cancelled_driver: { label: "ملغاة (السائق)", cls: "bg-red-100 text-red-500" },
  };
  const m = map[s] || { label: s, cls: "bg-gray-100 text-gray-400" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${m.cls}`}>{m.label}</span>;
};

const vehicleBadge = (v: string) => (
  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D4EDA8] text-[#1F4A10]">{v}</span>
);

export default function TripsManagement() {
  const [tab, setTab] = useState<"active" | "pending" | "history">("active");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة الرحلات والطلبات</h2>
        <p className="text-[#4A5568]/60 text-sm mt-1">متابعة جميع عمليات النقل الحية والمجدولة</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "رحلات نشطة", value: activeTrips.length, color: "#1F4A10", bg: "#D4EDA8" },
          { label: "رحلات معلقة", value: pendingTrips.length, color: "#F59E0B", bg: "#FEF3C7" },
          { label: "رحلات اليوم", value: 47, color: "#3B82F6", bg: "#DBEAFE" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#4A5568]/60 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { key: "active", label: `نشطة (${activeTrips.length})` },
            { key: "pending", label: `معلقة / مجدولة (${pendingTrips.length})` },
            { key: "history", label: `سجل الرحلات` },
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
          {/* Active trips */}
          {tab === "active" && (
            <div className="space-y-3">
              {activeTrips.map((trip) => (
                <div key={trip.id} className="border border-[#3D6B2C]/10 rounded-2xl p-4 bg-[#F6FAF0]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#679632] bg-[#D4EDA8] px-2 py-0.5 rounded-lg">{trip.id}</span>
                      {vehicleBadge(trip.vehicle)}
                    </div>
                    <span className="text-xs text-[#4A5568]/60 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> بدأت {trip.started}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#679632]" />
                      <div>
                        <p className="text-[#4A5568]/60 text-xs">العميل</p>
                        <p className="font-bold text-[#1F4A10]">{trip.customer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#679632]" />
                      <div>
                        <p className="text-[#4A5568]/60 text-xs">السائق</p>
                        <p className="font-bold text-[#1F4A10]">{trip.driver}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#679632]" />
                      <div>
                        <p className="text-[#4A5568]/60 text-xs">القيمة</p>
                        <p className="font-bold text-[#1F4A10]">{trip.price}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#4A5568]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-green-500" />
                      <span>من: {trip.from}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>إلى: {trip.to}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-[#4A5568]/60 mb-1">
                      <span>تقدم الرحلة</span>
                      <span>{trip.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-l from-[#679632] to-[#1F4A10] transition-all" style={{ width: `${trip.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending trips */}
          {tab === "pending" && (
            <div className="space-y-3">
              {pendingTrips.map((trip) => (
                <div key={trip.id} className="border border-amber-200 rounded-2xl p-4 bg-amber-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-lg">{trip.id}</span>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{trip.scheduledAt}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-[#4A5568]/60">العميل</p>
                      <p className="font-bold text-[#1F4A10]">{trip.customer}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4A5568]/60">نوع المركبة</p>
                      {vehicleBadge(trip.vehicle)}
                    </div>
                    <div>
                      <p className="text-xs text-[#4A5568]/60">من</p>
                      <p className="text-sm text-[#4A5568]">{trip.from}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4A5568]/60">إلى</p>
                      <p className="text-sm text-[#4A5568]">{trip.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-200">
                    <span className="font-bold text-[#1F4A10]">{trip.price}</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-bold hover:bg-red-200 transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> إلغاء
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* History */}
          {tab === "history" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["رقم الرحلة", "العميل", "السائق", "المركبة", "القيمة", "التاريخ", "المدة", "الحالة"].map((h) => (
                      <th key={h} className="text-right py-2.5 px-3 text-[#4A5568]/60 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyTrips.map((t) => (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-[#F6FAF0] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#679632] text-xs">{t.id}</td>
                      <td className="py-3 px-3 font-medium text-[#1F4A10]">{t.customer}</td>
                      <td className="py-3 px-3 text-[#4A5568]">{t.driver}</td>
                      <td className="py-3 px-3">{vehicleBadge(t.vehicle)}</td>
                      <td className="py-3 px-3 font-bold text-[#1F4A10]">{t.price}</td>
                      <td className="py-3 px-3 text-[#4A5568]/70">{t.date}</td>
                      <td className="py-3 px-3 text-[#4A5568]/70">{t.duration}</td>
                      <td className="py-3 px-3">{statusBadge(t.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
