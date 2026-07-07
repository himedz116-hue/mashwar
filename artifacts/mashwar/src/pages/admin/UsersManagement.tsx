import { useState } from "react";
import { Search, UserCheck, UserX, Phone, Calendar, Star } from "lucide-react";

const customers = [
  { id: 1, name: "محمد عبدالله الأحمد", phone: "+966 50 123 4567", email: "m.ahmed@email.com", joined: "2024-01-15", trips: 12, status: "active", rating: 4.8 },
  { id: 2, name: "سارة خالد المطيري", phone: "+966 55 987 6543", email: "sara.m@email.com", joined: "2024-02-20", trips: 5, status: "active", rating: 4.5 },
  { id: 3, name: "فهد سعد العتيبي", phone: "+966 53 456 7890", email: "fahad.s@email.com", joined: "2024-01-05", trips: 28, status: "blocked", rating: 3.9 },
  { id: 4, name: "نورة يوسف الزهراني", phone: "+966 50 321 0987", email: "noura.y@email.com", joined: "2024-03-10", trips: 8, status: "active", rating: 5.0 },
  { id: 5, name: "عبدالرحمن حمد الشمري", phone: "+966 56 654 3210", email: "abdo.h@email.com", joined: "2024-02-28", trips: 3, status: "active", rating: 4.2 },
  { id: 6, name: "ريم فيصل الدوسري", phone: "+966 59 111 2233", email: "reem.f@email.com", joined: "2024-04-01", trips: 1, status: "active", rating: 4.7 },
];

const drivers = [
  { id: 1, name: "خالد راشد القحطاني", phone: "+966 50 555 1234", vehicle: "وانيت", plate: "أ-ب-ج 1234", status: "online", trips: 234, rating: 4.9, earnings: "18,400 ريال" },
  { id: 2, name: "سليمان ناصر الغامدي", phone: "+966 55 444 5678", vehicle: "دينا", plate: "د-هـ-و 5678", status: "busy", trips: 187, rating: 4.7, earnings: "21,200 ريال" },
  { id: 3, name: "إبراهيم محمد الحربي", phone: "+966 53 333 9012", vehicle: "سطحة", plate: "ز-ح-ط 9012", status: "offline", trips: 95, rating: 4.4, earnings: "9,800 ريال" },
  { id: 4, name: "عمر فواز البقمي", phone: "+966 56 222 3456", vehicle: "دينا ونش", plate: "ي-ك-ل 3456", status: "online", trips: 312, rating: 4.8, earnings: "34,600 ريال" },
  { id: 5, name: "طارق وليد المالكي", phone: "+966 54 111 7890", vehicle: "وانيت", plate: "م-ن-ع 7890", status: "busy", trips: 156, rating: 4.6, earnings: "14,200 ريال" },
];

const statusBadge = (s: string) => {
  const map: Record<string, { label: string; cls: string }> = {
    active:   { label: "نشط", cls: "bg-green-100 text-green-700" },
    blocked:  { label: "محظور", cls: "bg-red-100 text-red-600" },
    online:   { label: "متصل", cls: "bg-green-100 text-green-700" },
    busy:     { label: "في رحلة", cls: "bg-amber-100 text-amber-700" },
    offline:  { label: "غير متصل", cls: "bg-gray-100 text-gray-500" },
  };
  const m = map[s] || { label: s, cls: "bg-gray-100 text-gray-500" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${m.cls}`}>{m.label}</span>;
};

export default function UsersManagement() {
  const [tab, setTab] = useState<"customers" | "drivers">("customers");
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter(
    (c) => c.name.includes(search) || c.phone.includes(search)
  );
  const filteredDrivers = drivers.filter(
    (d) => d.name.includes(search) || d.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة المستخدمين</h2>
        <p className="text-[#4A5568]/60 text-sm mt-1">إدارة العملاء والسائقين المسجلين</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "إجمالي العملاء", value: "1,248", color: "#1F4A10" },
          { label: "عملاء نشطون", value: "1,141", color: "#679632" },
          { label: "إجمالي السائقين", value: "86", color: "#1F4A10" },
          { label: "سائقون متصلون", value: "41", color: "#3B82F6" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#4A5568]/60 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {(["customers", "drivers"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${
                tab === t ? "text-[#1F4A10] border-b-2 border-[#1F4A10] bg-[#F6FAF0]" : "text-[#4A5568]/60 hover:text-[#1F4A10]"
              }`}
            >
              {t === "customers" ? `العملاء (${customers.length})` : `السائقون (${drivers.length})`}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568]/40" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو رقم الجوال..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#679632] bg-[#F6FAF0]"
            />
          </div>

          {/* Customers Table */}
          {tab === "customers" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["الاسم", "الجوال", "تاريخ التسجيل", "الرحلات", "التقييم", "الحالة", "إجراء"].map((h) => (
                      <th key={h} className="text-right py-2 px-3 text-[#4A5568]/60 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-[#F6FAF0] transition-colors">
                      <td className="py-3 px-3 font-bold text-[#1F4A10]">{c.name}</td>
                      <td className="py-3 px-3 text-[#4A5568] dir-ltr">{c.phone}</td>
                      <td className="py-3 px-3 text-[#4A5568]">{c.joined}</td>
                      <td className="py-3 px-3 text-[#4A5568]">{c.trips}</td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />{c.rating}
                        </span>
                      </td>
                      <td className="py-3 px-3">{statusBadge(c.status)}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                            <UserX className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Drivers Table */}
          {tab === "drivers" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["السائق", "الجوال", "المركبة", "لوحة السيارة", "الرحلات", "الأرباح", "التقييم", "الحالة", "إجراء"].map((h) => (
                      <th key={h} className="text-right py-2 px-3 text-[#4A5568]/60 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((d) => (
                    <tr key={d.id} className="border-b border-gray-50 hover:bg-[#F6FAF0] transition-colors">
                      <td className="py-3 px-3 font-bold text-[#1F4A10]">{d.name}</td>
                      <td className="py-3 px-3 text-[#4A5568] dir-ltr">{d.phone}</td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D4EDA8] text-[#1F4A10]">{d.vehicle}</span>
                      </td>
                      <td className="py-3 px-3 text-[#4A5568] font-mono">{d.plate}</td>
                      <td className="py-3 px-3 text-[#4A5568]">{d.trips}</td>
                      <td className="py-3 px-3 font-bold text-[#1F4A10]">{d.earnings}</td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />{d.rating}
                        </span>
                      </td>
                      <td className="py-3 px-3">{statusBadge(d.status)}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
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
