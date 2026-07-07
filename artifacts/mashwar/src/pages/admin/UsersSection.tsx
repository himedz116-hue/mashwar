import { useState, useEffect } from "react";
import { getMessageUsers, type MsgUser } from "@/lib/meshwarApi";
import { Users, RefreshCw, Search, MessageSquare, Phone, ChevronDown } from "lucide-react";

export default function UsersSection() {
  const [users, setUsers] = useState<MsgUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"user" | "driver">("user");

  const load = () => {
    setLoading(true); setError("");
    getMessageUsers(type, search)
      .then((r) => setUsers(r.data ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [type]);

  const filtered = users.filter(
    (u) => !search || u.name?.includes(search) || u.phone?.includes(search)
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">إدارة المستخدمين</h2>
          <p className="text-sm text-gray-500 mt-0.5">قائمة العملاء والسائقين المسجلين في التطبيق</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors">
          <RefreshCw className="w-4 h-4" /> تحديث
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "إجمالي المستخدمين", value: users.filter((u) => type === "user").length || users.length, icon: Users, color: "#1F4A10", bg: "#D4EDA8" },
          { label: "إجمالي السائقين", value: "—", icon: Users, color: "#679632", bg: "#D4EDA8" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-[#F6FAF0] rounded-xl p-1">
          {(["user", "driver"] as const).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${type === t ? "bg-white shadow text-[#1F4A10]" : "text-gray-400"}`}>
              {t === "user" ? "المستخدمون" : "السائقون"}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
            placeholder="البحث بالاسم أو رقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
        </div>
        <button onClick={load} className="px-4 py-2.5 rounded-xl bg-[#F6FAF0] text-[#1F4A10] text-sm font-bold hover:bg-[#D4EDA8] transition-colors">
          بحث
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-bold">{error}</p>
            <button onClick={load} className="mt-3 text-sm text-[#679632] underline">إعادة المحاولة</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-bold">لا توجد نتائج</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F6FAF0]">
                <tr>
                  {["المستخدم", "رقم الهاتف", "آخر رسالة", "الرسائل غير المقروءة", ""].map((h) => (
                    <th key={h} className="text-right py-3 px-4 text-xs font-bold text-[#1F4A10]/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u.uuid} className="hover:bg-[#F6FAF0]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#D4EDA8] flex items-center justify-center flex-shrink-0">
                          {u.avatar
                            ? <img src={u.avatar} className="w-9 h-9 rounded-xl object-cover" />
                            : <span className="font-black text-[#1F4A10] text-sm">{u.name?.[0] ?? "?"}</span>}
                        </div>
                        <span className="font-bold text-[#1F4A10]">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Phone className="w-3.5 h-3.5" />{u.phone}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs max-w-xs truncate">{u.last_message ?? "—"}</td>
                    <td className="py-3 px-4">
                      {u.unread_count ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#679632] text-white text-xs font-bold">{u.unread_count}</span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <a href="#messages" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6FAF0] text-[#1F4A10] hover:bg-[#D4EDA8] transition-colors text-xs font-bold">
                        <MessageSquare className="w-3.5 h-3.5" /> رسالة
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
