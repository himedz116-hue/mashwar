import { useState, useEffect } from "react";
import { getDrivers, showDriver, type Driver } from "@/lib/meshwarApi";
import {
  Search, RefreshCw, Star, Phone, MapPin, Car, CheckCircle,
  XCircle, Clock, Eye, ChevronDown,
} from "lucide-react";

const statusMap: Record<string, { label: string; cls: string }> = {
  accepted: { label: "موثّق", cls: "bg-green-100 text-green-700" },
  rejected:  { label: "مرفوض", cls: "bg-red-100 text-red-600" },
  pending:   { label: "قيد المراجعة", cls: "bg-amber-100 text-amber-700" },
  online:    { label: "متصل", cls: "bg-emerald-100 text-emerald-700" },
  offline:   { label: "غير متصل", cls: "bg-gray-100 text-gray-500" },
};

function Badge({ status }: { status?: string }) {
  const s = statusMap[status ?? ""] ?? { label: status ?? "—", cls: "bg-gray-100 text-gray-500" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${s.cls}`}>{s.label}</span>;
}

function Avatar({ name, avatar }: { name?: string; avatar?: string }) {
  if (avatar) return <img src={avatar} className="w-9 h-9 rounded-xl object-cover" />;
  return (
    <div className="w-9 h-9 rounded-xl bg-[#D4EDA8] flex items-center justify-center flex-shrink-0">
      <span className="font-black text-[#1F4A10] text-sm">{(name ?? "?")[0]}</span>
    </div>
  );
}

function DriverModal({ uuid, onClose }: { uuid: string; onClose: () => void }) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    showDriver(uuid)
      .then((r) => setDriver(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [uuid]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10] text-lg">تفاصيل السائق</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          {loading && <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {driver && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar name={driver.name} avatar={driver.avatar} />
                <div>
                  <p className="font-heading font-black text-[#1F4A10] text-lg">{driver.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{driver.phone}</p>
                </div>
                <div className="mr-auto"><Badge status={driver.status} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "التقييم", value: driver.rating ? `⭐ ${driver.rating}` : "—" },
                  { label: "عدد الرحلات", value: driver.trips_count ?? "—" },
                  { label: "الرصيد", value: driver.balance != null ? `${driver.balance} ريال` : "—" },
                  { label: "المدينة", value: driver.city?.name ?? "—" },
                  { label: "نوع السيارة", value: driver.car?.car_type?.name ?? "—" },
                  { label: "رقم اللوحة", value: driver.car?.plate_number ?? "—" },
                ].map((row) => (
                  <div key={row.label} className="bg-[#F6FAF0] rounded-xl p-3">
                    <p className="text-xs text-gray-500">{row.label}</p>
                    <p className="font-bold text-[#1F4A10] mt-0.5">{String(row.value)}</p>
                  </div>
                ))}
              </div>
              {(driver.national_id || driver.driving_license || driver.car_license) && (
                <div>
                  <p className="font-bold text-[#1F4A10] text-sm mb-3">وثائق التوثيق</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "الهوية", url: driver.national_id },
                      { label: "رخصة القيادة", url: driver.driving_license },
                      { label: "رخصة السيارة", url: driver.car_license },
                    ].filter((d) => d.url).map((doc) => (
                      <a key={doc.label} href={doc.url} target="_blank" rel="noreferrer"
                        className="block bg-gray-100 rounded-xl p-3 text-center hover:bg-[#D4EDA8] transition-colors">
                        <p className="text-xs text-gray-500">{doc.label}</p>
                        <p className="text-xs text-[#679632] font-bold mt-1">عرض ↗</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DriversManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError("");
    getDrivers()
      .then((r) => setDrivers(r.data ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = drivers.filter((d) => {
    const matchSearch = !search || d.name?.includes(search) || d.phone?.includes(search);
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: drivers.length,
    accepted: drivers.filter((d) => d.status === "accepted").length,
    pending: drivers.filter((d) => d.status === "pending").length,
    rejected: drivers.filter((d) => d.status === "rejected").length,
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة السائقين</h2>
          <p className="text-sm text-gray-500 mt-0.5">قائمة جميع السائقين المسجلين في التطبيق</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors">
          <RefreshCw className="w-4 h-4" /> تحديث
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "الكل", val: counts.all, icon: Car, color: "#1F4A10" },
          { label: "موثّقون", val: counts.accepted, icon: CheckCircle, color: "#16a34a" },
          { label: "قيد المراجعة", val: counts.pending, icon: Clock, color: "#d97706" },
          { label: "مرفوضون", val: counts.rejected, icon: XCircle, color: "#dc2626" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
            <p className="text-2xl font-heading font-black" style={{ color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
            placeholder="البحث بالاسم أو الهاتف..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none pr-4 pl-9 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] bg-white"
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">كل الحالات</option>
            <option value="accepted">موثّق</option>
            <option value="pending">قيد المراجعة</option>
            <option value="rejected">مرفوض</option>
            <option value="online">متصل</option>
            <option value="offline">غير متصل</option>
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-500 font-bold">{error}</p>
            <button onClick={load} className="mt-3 text-sm text-[#679632] underline">إعادة المحاولة</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>لا توجد نتائج</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F6FAF0]">
                <tr>
                  {["السائق", "الهاتف", "المدينة", "السيارة", "الرحلات", "التقييم", "الحالة", ""].map((h) => (
                    <th key={h} className="text-right py-3 px-4 text-xs font-bold text-[#1F4A10]/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((d) => (
                  <tr key={d.uuid} className="hover:bg-[#F6FAF0]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={d.name} avatar={d.avatar} />
                        <span className="font-bold text-[#1F4A10]">{d.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{d.phone}</td>
                    <td className="py-3 px-4 text-gray-600">{d.city?.name ?? "—"}</td>
                    <td className="py-3 px-4 text-gray-600">{d.car?.car_type?.name ?? "—"}</td>
                    <td className="py-3 px-4 text-gray-600">{d.trips_count ?? "—"}</td>
                    <td className="py-3 px-4">
                      {d.rating ? (
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-bold">{d.rating}</span>
                        </span>
                      ) : "—"}
                    </td>
                    <td className="py-3 px-4"><Badge status={d.status} /></td>
                    <td className="py-3 px-4">
                      <button onClick={() => setSelectedUuid(d.uuid)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6FAF0] text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors text-xs font-bold">
                        <Eye className="w-3.5 h-3.5" /> عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUuid && <DriverModal uuid={selectedUuid} onClose={() => setSelectedUuid(null)} />}
    </div>
  );
}
