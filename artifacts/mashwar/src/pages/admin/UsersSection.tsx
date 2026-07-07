import { useState, useEffect } from "react";
import { getMessageUsers, getDrivers, type MsgUser, type Driver } from "@/lib/meshwarApi";
import {
  Users, RefreshCw, Search, MessageSquare, Phone, Star,
  Car, TrendingUp, UserCheck, UserX, ChevronDown, X,
} from "lucide-react";

function Avatar({ name, avatar, size = 9 }: { name?: string; avatar?: string; size?: number }) {
  const s = `w-${size} h-${size}`;
  if (avatar) return <img src={avatar} className={`${s} rounded-xl object-cover flex-shrink-0`} />;
  return (
    <div className={`${s} rounded-xl bg-gradient-to-br from-[#D4EDA8] to-[#a8d060] flex items-center justify-center flex-shrink-0`}>
      <span className="font-black text-[#1F4A10] text-sm">{(name ?? "؟")[0]}</span>
    </div>
  );
}

function UserDetailModal({ user, onClose }: { user: MsgUser | Driver; onClose: () => void }) {
  const isDriver = "status" in user && "rating" in user;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10]">تفاصيل {isDriver ? "السائق" : "المستخدم"}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-[#F6FAF0] rounded-2xl">
            <Avatar name={user.name} avatar={user.avatar} size={14} />
            <div className="flex-1">
              <p className="font-heading font-black text-[#1F4A10] text-lg">{user.name}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5" />{user.phone}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {isDriver && (user as Driver).rating != null && (
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                <p className="text-xs text-amber-500 mb-1">التقييم</p>
                <p className="font-heading font-black text-amber-600 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />{(user as Driver).rating}
                </p>
              </div>
            )}
            {isDriver && (user as Driver).trips_count != null && (
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="text-xs text-blue-400 mb-1">الرحلات</p>
                <p className="font-heading font-black text-blue-600">{(user as Driver).trips_count}</p>
              </div>
            )}
            {isDriver && (user as Driver).balance != null && (
              <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                <p className="text-xs text-green-400 mb-1">الرصيد</p>
                <p className="font-heading font-black text-green-600">{(user as Driver).balance} ريال</p>
              </div>
            )}
            {isDriver && (user as Driver).city && (
              <div className="bg-[#F6FAF0] rounded-xl p-3 border border-[#D4EDA8]">
                <p className="text-xs text-[#679632] mb-1">المدينة</p>
                <p className="font-heading font-black text-[#1F4A10]">{(user as Driver).city?.name}</p>
              </div>
            )}
          </div>
          {isDriver && (user as Driver).car && (
            <div className="bg-[#F6FAF0] rounded-2xl p-4">
              <p className="text-xs font-bold text-[#679632] mb-2 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" /> السيارة
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { label: "النوع", value: (user as Driver).car?.car_type?.name },
                  { label: "اللوحة", value: (user as Driver).car?.plate_number },
                  { label: "الموديل", value: (user as Driver).car?.model },
                  { label: "اللون", value: (user as Driver).car?.color },
                ].filter((r) => r.value).map((r) => (
                  <div key={r.label}>
                    <span className="text-gray-400 text-xs">{r.label}: </span>
                    <span className="font-bold text-[#1F4A10]">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {"last_message" in user && user.last_message && (
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">آخر رسالة</p>
              <p className="text-sm text-gray-600">{user.last_message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UsersSection() {
  const [users, setUsers] = useState<MsgUser[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"user" | "driver">("user");
  const [detail, setDetail] = useState<MsgUser | Driver | null>(null);
  const [driverFilter, setDriverFilter] = useState<"all" | "accepted" | "pending" | "rejected">("all");

  const load = () => {
    setLoading(true); setError("");
    if (type === "user") {
      getMessageUsers("user", "")
        .then((r) => setUsers(r.data ?? []))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      getDrivers()
        .then((r) => setDrivers(r.data ?? []))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  };

  // Load both for stats
  useEffect(() => {
    Promise.allSettled([
      getMessageUsers("user").then((r) => setUsers(r.data ?? [])),
      getDrivers().then((r) => setDrivers(r.data ?? [])),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [type]);

  const filteredUsers = users.filter(
    (u) => !search || u.name?.includes(search) || u.phone?.includes(search)
  );

  const filteredDrivers = drivers
    .filter((d) => driverFilter === "all" || d.status === driverFilter)
    .filter((d) => !search || d.name?.includes(search) || d.phone?.includes(search));

  const statusBadge = (status?: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      accepted: { label: "موثّق", cls: "bg-green-100 text-green-700" },
      rejected: { label: "مرفوض", cls: "bg-red-100 text-red-600" },
      pending: { label: "قيد المراجعة", cls: "bg-amber-100 text-amber-700" },
      active: { label: "نشط", cls: "bg-green-100 text-green-700" },
      blocked: { label: "محظور", cls: "bg-red-100 text-red-600" },
    };
    const s = map[status ?? ""] ?? { label: status ?? "—", cls: "bg-gray-100 text-gray-500" };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${s.cls}`}>{s.label}</span>;
  };

  const acceptedDrivers = drivers.filter((d) => d.status === "accepted").length;
  const pendingDrivers = drivers.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-5">
      {detail && <UserDetailModal user={detail} onClose={() => setDetail(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة المستخدمين</h2>
          <p className="text-sm text-gray-500 mt-0.5">قائمة العملاء والسائقين المسجلين في التطبيق</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] disabled:opacity-50 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> تحديث
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "إجمالي المستخدمين", value: users.length || "—", icon: Users, color: "#1F4A10", bg: "#D4EDA8" },
          { label: "إجمالي السائقين", value: drivers.length || "—", icon: Car, color: "#679632", bg: "#D4EDA8" },
          { label: "سائقون موثّقون", value: acceptedDrivers || "—", icon: UserCheck, color: "#16a34a", bg: "#dcfce7" },
          { label: "قيد التوثيق", value: pendingDrivers || "—", icon: TrendingUp, color: "#d97706", bg: "#fef3c7" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex gap-1 bg-[#F6FAF0] rounded-xl p-1 flex-shrink-0">
          {(["user", "driver"] as const).map((t) => (
            <button key={t} onClick={() => { setType(t); setSearch(""); setDriverFilter("all"); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${type === t ? "bg-white shadow text-[#1F4A10]" : "text-gray-400 hover:text-gray-600"}`}>
              {t === "user" ? `👤 المستخدمون` : `🚛 السائقون`}
            </button>
          ))}
        </div>

        {type === "driver" && (
          <div className="flex gap-1 bg-[#F6FAF0] rounded-xl p-1">
            {(["all", "accepted", "pending", "rejected"] as const).map((f) => {
              const labels = { all: "الكل", accepted: "موثّقون", pending: "قيد المراجعة", rejected: "مرفوضون" };
              return (
                <button key={f} onClick={() => setDriverFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${driverFilter === f ? "bg-white shadow text-[#1F4A10]" : "text-gray-400 hover:text-gray-600"}`}>
                  {labels[f]}
                </button>
              );
            })}
          </div>
        )}

        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] bg-[#F6FAF0]"
            placeholder="البحث بالاسم أو رقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
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
            <UserX className="w-12 h-12 text-red-300 mx-auto mb-3" />
            <p className="text-red-500 font-bold text-sm">{error}</p>
            <button onClick={load} className="mt-3 text-sm text-[#679632] underline">إعادة المحاولة</button>
          </div>
        ) : type === "user" ? (
          filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold">لا توجد نتائج</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F6FAF0]">
                  <tr>
                    {["المستخدم", "رقم الهاتف", "آخر رسالة", "رسائل غير مقروءة", "إجراء"].map((h) => (
                      <th key={h} className="text-right py-3 px-4 text-xs font-bold text-[#1F4A10]/60 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((u) => (
                    <tr key={u.uuid} className="hover:bg-[#F6FAF0]/60 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} avatar={u.avatar} />
                          <span className="font-bold text-[#1F4A10]">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />{u.phone}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-xs max-w-[200px] truncate">{u.last_message ?? "—"}</td>
                      <td className="py-3 px-4">
                        {u.unread_count ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#679632] text-white text-xs font-bold">{u.unread_count}</span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setDetail(u)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6FAF0] text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors text-xs font-bold">
                            عرض
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-bold">
                            <MessageSquare className="w-3.5 h-3.5" /> رسالة
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400 text-center">
                {filteredUsers.length} مستخدم
              </div>
            </div>
          )
        ) : (
          filteredDrivers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Car className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold">لا توجد نتائج</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F6FAF0]">
                  <tr>
                    {["السائق", "رقم الهاتف", "التقييم", "الرحلات", "الرصيد", "الحالة", "إجراء"].map((h) => (
                      <th key={h} className="text-right py-3 px-4 text-xs font-bold text-[#1F4A10]/60 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredDrivers.map((d) => (
                    <tr key={d.uuid} className="hover:bg-[#F6FAF0]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={d.name} avatar={d.avatar} />
                          <div>
                            <p className="font-bold text-[#1F4A10]">{d.name}</p>
                            {d.city && <p className="text-xs text-gray-400">{d.city.name}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gray-400" />{d.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        {d.rating != null ? (
                          <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />{d.rating}
                          </span>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="py-3 px-4 text-xs font-bold text-[#1F4A10]">{d.trips_count ?? "—"}</td>
                      <td className="py-3 px-4 text-xs font-bold text-green-700">
                        {d.balance != null ? `${d.balance} ريال` : "—"}
                      </td>
                      <td className="py-3 px-4">{statusBadge(d.status)}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => setDetail(d)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6FAF0] text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors text-xs font-bold">
                          عرض
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400 text-center">
                {filteredDrivers.length} سائق
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
