import { useState, useEffect } from "react";
import {
  getUsers, getDrivers, blockUser, deleteUser,
  getImageUrl, type User, type Driver
} from "@/lib/meshwarApi";
import {
  Users, RefreshCw, Search, Phone, Star, Car, TrendingUp,
  UserCheck, UserX, X, Trash2, Ban, CheckCircle, Eye,
  Smartphone, Apple, Mail, Calendar, Shield, MoreHorizontal,
  MessageSquare,
} from "lucide-react";

function detectOS(device?: string, osVersion?: string): "ios" | "android" | "unknown" {
  const raw = `${device ?? ""} ${osVersion ?? ""}`.toLowerCase().trim();
  if (!raw) return "unknown";
  if (raw.includes("ios") || raw.includes("iphone") || raw.includes("ipad") || raw.includes("apple")) return "ios";
  if (raw.includes("android")) return "android";
  return "unknown";
}

function PlatformBadge({ device, osVersion }: { device?: string; osVersion?: string }) {
  const os = detectOS(device, osVersion);
  if (os === "ios") return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg">
      <Apple className="w-3.5 h-3.5 text-gray-700" />
      <span className="text-xs font-bold text-gray-700">iOS</span>
      {osVersion && <span className="text-[10px] text-gray-400 font-mono">{osVersion}</span>}
    </div>
  );
  if (os === "android") return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 rounded-lg">
      <Smartphone className="w-3.5 h-3.5 text-green-700" />
      <span className="text-xs font-bold text-green-700">Android</span>
      {osVersion && <span className="text-[10px] text-green-600 font-mono">{osVersion}</span>}
    </div>
  );
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg">
      <Smartphone className="w-3.5 h-3.5 text-gray-400" />
      <span className="text-xs font-bold text-gray-400">غير معروف</span>
    </div>
  );
}

function Avatar({ name, avatar, size = 9 }: { name?: string; avatar?: string; size?: number }) {
  const [err, setErr] = useState(false);
  const letter = ((name ?? "؟")[0] ?? "؟").toUpperCase();
  const showImg = avatar && !err && !avatar.toLowerCase().includes("placeholder");
  const px = size * 4;
  if (showImg) {
    return (
      <img
        src={getImageUrl(avatar!)}
        className={`w-${size} h-${size} rounded-full object-cover ring-2 ring-white shadow-md flex-shrink-0`}
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-md`}
      style={{ background: "linear-gradient(135deg, #5aa526 0%, #1F4A10 100%)" }}
    >
      <span className="font-black text-white select-none" style={{ fontSize: `${px * 0.42}px`, lineHeight: 1 }}>{letter}</span>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    active:    { label: "نشط",            cls: "bg-green-100 text-green-700" },
    blocked:   { label: "محظور",          cls: "bg-red-100 text-red-600" },
    accepted:  { label: "موثّق",          cls: "bg-green-100 text-green-700" },
    rejected:  { label: "مرفوض",          cls: "bg-red-100 text-red-600" },
    pending:   { label: "قيد المراجعة",   cls: "bg-amber-100 text-amber-700" },
  };
  const s = map[status ?? ""] ?? { label: status ?? "—", cls: "bg-gray-100 text-gray-500" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${s.cls}`}>{s.label}</span>;
}

function UserDetailModal({ user, onClose, onBlock, onDelete }: {
  user: User; onClose: () => void;
  onBlock: (uuid: string, status: "active" | "blocked") => Promise<void>;
  onDelete: (uuid: string) => Promise<void>;
}) {
  const [blocking, setBlocking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isBlocked = user.status === "blocked";

  const handleBlock = async () => {
    setBlocking(true);
    try { await onBlock(user.uuid, isBlocked ? "active" : "blocked"); onClose(); }
    catch { /* ignore */ } finally { setBlocking(false); }
  };
  const handleDelete = async () => {
    if (!confirm(`هل تريد حذف المستخدم "${user.name}" نهائياً؟ لا يمكن التراجع.`)) return;
    setDeleting(true);
    try { await onDelete(user.uuid); onClose(); }
    catch { /* ignore */ } finally { setDeleting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10]">تفاصيل المستخدم</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-4 p-4 bg-[#F6FAF0] rounded-2xl">
            <Avatar name={user.name} avatar={user.avatar} size={16} />
            <div className="flex-1">
              <p className="font-heading font-black text-[#1F4A10] text-xl">{user.name}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5" />{user.phone}
              </p>
              {user.email && (
                <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3 h-3" />{user.email}
                </p>
              )}
            </div>
            <StatusBadge status={user.status} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "الرحلات", value: user.trips_count ?? "—", icon: Car, color: "#1F4A10", bg: "#D4EDA8" },
              { label: "التقييم", value: user.rating ? `⭐ ${user.rating}` : "—", icon: Star, color: "#d97706", bg: "#fef3c7" },
              { label: "تاريخ التسجيل", value: user.created_at ? new Date(user.created_at).toLocaleDateString("ar-SA") : "—", icon: Calendar, color: "#2563eb", bg: "#dbeafe" },
              { label: "المنصة", value: detectOS(user.device, user.os_version) === "ios" ? "iOS" : detectOS(user.device, user.os_version) === "android" ? "Android" : "غير معروف", icon: detectOS(user.device, user.os_version) === "ios" ? Apple : Smartphone, color: detectOS(user.device, user.os_version) === "ios" ? "#374151" : "#679632", bg: detectOS(user.device, user.os_version) === "ios" ? "#f3f4f6" : "#D4EDA8" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 flex items-center gap-2.5" style={{ background: s.bg + "40", border: `1px solid ${s.bg}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="font-bold text-sm text-[#1F4A10]">{String(s.value)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Platform badge */}
          <div className="flex items-center gap-2 p-3 bg-[#F6FAF0] rounded-xl border border-[#D4EDA8]">
            <PlatformBadge device={user.device} osVersion={user.os_version} />
            {user.device && <span className="text-xs text-gray-400 font-mono">{user.device}</span>}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleBlock} disabled={blocking}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 ${
                isBlocked
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              {isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
              {blocking ? "جارٍ..." : isBlocked ? "إلغاء الحظر" : "حظر المستخدم"}
            </button>
            <button
              onClick={handleDelete} disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "جارٍ الحذف..." : "حذف نهائي"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriverDetailModal({ driver, onClose }: { driver: Driver; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading font-black text-[#1F4A10]">تفاصيل السائق</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-[#F6FAF0] rounded-2xl">
            <Avatar name={driver.name} avatar={driver.avatar} size={14} />
            <div className="flex-1">
              <p className="font-heading font-black text-[#1F4A10] text-lg">{driver.name}</p>
              <p className="text-sm text-gray-500">{driver.phone}</p>
            </div>
            <StatusBadge status={driver.status} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "التقييم", value: driver.rating ? `⭐ ${driver.rating}` : "—" },
              { label: "الرحلات", value: driver.trips_count ?? "—" },
              { label: "الرصيد", value: driver.balance != null ? `${driver.balance} ريال` : "—" },
              { label: "المدينة", value: driver.city?.name ?? "—" },
              { label: "نوع السيارة", value: driver.car?.car_type?.name ?? "—" },
              { label: "رقم اللوحة", value: driver.car?.plate_number ?? "—" },
            ].map((r) => (
              <div key={r.label} className="bg-[#F6FAF0] rounded-xl p-3">
                <p className="text-xs text-gray-400">{r.label}</p>
                <p className="font-bold text-[#1F4A10] text-sm mt-0.5">{String(r.value)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"users" | "drivers">("users");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [toast, setToast] = useState({ msg: "", ok: true });

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: "", ok: true }), 3500);
  };

  const loadAll = () => {
    setLoading(true); setError("");
    Promise.allSettled([
      getUsers().then((r) => setUsers(r.data ?? [])),
      getDrivers().then((r) => setDrivers(r.data ?? [])),
    ]).then((results) => {
      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length === 2) setError("تعذّر تحميل البيانات");
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, []);

  const handleBlock = async (uuid: string, status: "active" | "blocked") => {
    await blockUser({ uuid, status });
    showToast(status === "blocked" ? "🚫 تم حظر المستخدم" : "✅ تم إلغاء الحظر");
    loadAll();
  };

  const handleDelete = async (uuid: string) => {
    await deleteUser(uuid);
    showToast("🗑️ تم حذف المستخدم");
    loadAll();
  };

  const filteredUsers = users
    .filter((u) => statusFilter === "all" || u.status === statusFilter)
    .filter((u) => !search || u.name?.includes(search) || u.phone?.includes(search));

  const filteredDrivers = drivers
    .filter((d) => statusFilter === "all" || d.status === statusFilter)
    .filter((d) => !search || d.name?.includes(search) || d.phone?.includes(search));

  const acceptedDrivers = drivers.filter((d) => d.status === "accepted").length;
  const blockedUsers = users.filter((u) => u.status === "blocked").length;
  const pendingDrivers = drivers.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-5" dir="rtl">
      {/* Toast */}
      {toast.msg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold transition-all ${toast.ok ? "bg-[#1F4A10] text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onBlock={handleBlock}
          onDelete={handleDelete}
        />
      )}
      {selectedDriver && (
        <DriverDetailModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة المستخدمين</h2>
          <p className="text-sm text-gray-500 mt-0.5">قائمة العملاء والسائقين المسجلين على Android و iOS</p>
        </div>
        <div className="flex gap-2">
          {/* Platform badges */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6FAF0] border border-[#D4EDA8]">
            <Smartphone className="w-3.5 h-3.5 text-green-600" />
            <Apple className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-xs font-bold text-[#679632]">متزامن</span>
          </div>
          <button onClick={loadAll} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] disabled:opacity-50 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> تحديث
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "إجمالي العملاء", value: users.length, icon: Users, color: "#1F4A10", bg: "#D4EDA8" },
          { label: "إجمالي السائقين", value: drivers.length, icon: Car, color: "#679632", bg: "#D4EDA8" },
          { label: "سائقون موثّقون", value: acceptedDrivers, icon: UserCheck, color: "#16a34a", bg: "#dcfce7" },
          { label: "حسابات محظورة", value: blockedUsers, icon: UserX, color: "#dc2626", bg: "#fee2e2" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <s.icon className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
        {/* Tab toggle */}
        <div className="flex gap-2">
          <div className="flex gap-1 bg-[#F6FAF0] rounded-xl p-1">
            {(["users", "drivers"] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setSearch(""); setStatusFilter("all"); }}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === t ? "bg-white shadow text-[#1F4A10]" : "text-gray-400 hover:text-gray-600"}`}>
                {t === "users" ? `👤 العملاء (${users.length})` : `🚛 السائقون (${drivers.length})`}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex gap-1 bg-[#F6FAF0] rounded-xl p-1">
            {tab === "users"
              ? (["all", "active", "blocked"] as const).map((f) => {
                  const labels = { all: "الكل", active: "نشط", blocked: "محظور" };
                  return (
                    <button key={f} onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === f ? "bg-white shadow text-[#1F4A10]" : "text-gray-400 hover:text-gray-600"}`}>
                      {labels[f]}
                    </button>
                  );
                })
              : (["all", "accepted", "pending", "rejected"] as const).map((f) => {
                  const labels = { all: "الكل", accepted: "موثّقون", pending: "معلّقون", rejected: "مرفوضون" };
                  return (
                    <button key={f} onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === f ? "bg-white shadow text-[#1F4A10]" : "text-gray-400 hover:text-gray-600"}`}>
                      {labels[f]}
                    </button>
                  );
                })
            }
          </div>
        </div>

        {/* Search */}
        <div className="relative">
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
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <UserX className="w-12 h-12 text-red-300 mx-auto mb-3" />
            <p className="text-red-500 font-bold text-sm">{error}</p>
            <button onClick={loadAll} className="mt-3 text-sm text-[#679632] underline">إعادة المحاولة</button>
          </div>
        ) : tab === "users" ? (
          filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold">لا توجد نتائج</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F6FAF0]">
                    <tr>
                      {["المستخدم", "رقم الهاتف", "الرحلات", "التقييم", "تاريخ التسجيل", "الحالة", "إجراءات"].map((h) => (
                        <th key={h} className="text-right py-3.5 px-4 text-xs font-bold text-[#1F4A10]/60 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((u) => (
                      <tr key={u.uuid} className="hover:bg-[#F6FAF0]/60 transition-colors group">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name} avatar={u.avatar} />
                            <div>
                              <p className="font-bold text-[#1F4A10]">{u.name}</p>
                              {u.email && <p className="text-xs text-gray-400 truncate max-w-[140px]">{u.email}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />{u.phone}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold text-[#1F4A10]">{u.trips_count ?? "—"}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          {u.rating ? (
                            <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />{u.rating}
                            </span>
                          ) : <span className="text-gray-300 text-xs">—</span>}
                        </td>
                        <td className="py-3.5 px-4 text-gray-400 text-xs">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString("ar-SA") : "—"}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={u.status} />
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setSelectedUser(u)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F6FAF0] text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors text-xs font-bold">
                              <Eye className="w-3.5 h-3.5" /> عرض
                            </button>
                            <button
                              onClick={async () => {
                                await handleBlock(u.uuid, u.status === "blocked" ? "active" : "blocked");
                              }}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                u.status === "blocked"
                                  ? "bg-green-50 text-green-600 hover:bg-green-100"
                                  : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                              }`}>
                              {u.status === "blocked" ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                              {u.status === "blocked" ? "رفع الحظر" : "حظر"}
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm(`حذف "${u.name}"؟`)) return;
                                await handleDelete(u.uuid);
                              }}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400 text-center">
                عرض {filteredUsers.length} من {users.length} مستخدم
              </div>
            </>
          )
        ) : (
          filteredDrivers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Car className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold">لا توجد نتائج</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F6FAF0]">
                    <tr>
                      {["السائق", "رقم الهاتف", "المدينة", "نوع السيارة", "الرحلات", "التقييم", "الرصيد", "الحالة", "عرض"].map((h) => (
                        <th key={h} className="text-right py-3.5 px-4 text-xs font-bold text-[#1F4A10]/60 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredDrivers.map((d) => (
                      <tr key={d.uuid} className="hover:bg-[#F6FAF0]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={d.name} avatar={d.avatar} />
                            <div>
                              <p className="font-bold text-[#1F4A10]">{d.name}</p>
                              {d.email && <p className="text-xs text-gray-400 truncate max-w-[120px]">{d.email}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-600">{d.phone}</td>
                        <td className="py-3.5 px-4 text-xs text-gray-600">{d.city?.name ?? "—"}</td>
                        <td className="py-3.5 px-4 text-xs text-gray-600">{d.car?.car_type?.name ?? "—"}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-[#1F4A10] text-xs">{d.trips_count ?? "—"}</td>
                        <td className="py-3.5 px-4">
                          {d.rating ? (
                            <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />{d.rating}
                            </span>
                          ) : <span className="text-gray-300 text-xs">—</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          {d.balance != null ? (
                            <span className={`font-bold text-xs ${d.balance > 0 ? "text-green-600" : "text-gray-400"}`}>
                              {d.balance} ريال
                            </span>
                          ) : "—"}
                        </td>
                        <td className="py-3.5 px-4"><StatusBadge status={d.status} /></td>
                        <td className="py-3.5 px-4">
                          <button onClick={() => setSelectedDriver(d)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F6FAF0] text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors text-xs font-bold">
                            <Eye className="w-3.5 h-3.5" /> عرض
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400 text-center">
                عرض {filteredDrivers.length} من {drivers.length} سائق
                {pendingDrivers > 0 && (
                  <span className="mr-3 text-amber-600 font-bold">• {pendingDrivers} بانتظار التوثيق</span>
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
