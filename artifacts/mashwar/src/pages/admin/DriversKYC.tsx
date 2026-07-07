import { useState, useEffect } from "react";
import { getDrivers, acceptDriver, type Driver } from "@/lib/meshwarApi";
import { ShieldCheck, RefreshCw, CheckCircle, XCircle, Clock, Phone, Eye, X } from "lucide-react";

function DocLink({ label, url }: { label: string; url?: string }) {
  if (!url) return <div className="bg-gray-50 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">{label}</p><p className="text-xs text-gray-300 mt-1">غير متوفر</p></div>;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="block bg-[#F6FAF0] rounded-xl p-3 text-center hover:bg-[#D4EDA8] transition-colors border border-[#D4EDA8]/50">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xs text-[#679632] font-bold mt-1">عرض الوثيقة ↗</p>
    </a>
  );
}

function KYCCard({ driver, onAction }: { driver: Driver; onAction: (uuid: string, action: "accepted" | "rejected", reason?: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [rejReason, setRejReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (action: "accepted" | "rejected") => {
    setLoading(true);
    await onAction(driver.uuid, action, action === "rejected" ? rejReason : undefined);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#D4EDA8] flex items-center justify-center flex-shrink-0">
            <span className="font-black text-[#1F4A10]">{driver.name?.[0] ?? "?"}</span>
          </div>
          <div className="min-w-0">
            <p className="font-heading font-black text-[#1F4A10] truncate">{driver.name}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{driver.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 flex items-center gap-1">
            <Clock className="w-3 h-3" /> قيد المراجعة
          </span>
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <DocLink label="الهوية الوطنية" url={driver.national_id} />
            <DocLink label="رخصة القيادة" url={driver.driving_license} />
            <DocLink label="رخصة السيارة" url={driver.car_license} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "المدينة", value: driver.city?.name },
              { label: "نوع السيارة", value: driver.car?.car_type?.name },
              { label: "رقم اللوحة", value: driver.car?.plate_number },
              { label: "الموديل", value: driver.car?.model },
            ].map((row) => (
              <div key={row.label} className="bg-[#F6FAF0] rounded-xl p-3">
                <p className="text-xs text-gray-400">{row.label}</p>
                <p className="font-bold text-[#1F4A10] mt-0.5">{row.value ?? "—"}</p>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">سبب الرفض (اختياري)</label>
            <input
              value={rejReason} onChange={(e) => setRejReason(e.target.value)}
              placeholder="اكتب سبب الرفض إن وجد..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handle("accepted")} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> قبول التوثيق
            </button>
            <button
              onClick={() => handle("rejected")} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" /> رفض
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DriversKYC() {
  const [pending, setPending] = useState<Driver[]>([]);
  const [done, setDone] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"pending" | "done">("pending");
  const [toast, setToast] = useState("");

  const load = () => {
    setLoading(true); setError("");
    getDrivers()
      .then((r) => {
        const all = r.data ?? [];
        setPending(all.filter((d) => d.status === "pending" || !d.is_verified));
        setDone(all.filter((d) => d.status === "accepted" || d.status === "rejected"));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (uuid: string, action: "accepted" | "rejected", reason?: string) => {
    try {
      await acceptDriver({ uuid, status: action, reason });
      setToast(action === "accepted" ? "✅ تم قبول السائق بنجاح" : "❌ تم رفض السائق");
      setTimeout(() => setToast(""), 3000);
      load();
    } catch (e: unknown) {
      setToast("حدث خطأ: " + (e instanceof Error ? e.message : String(e)));
      setTimeout(() => setToast(""), 4000);
    }
  };

  const list = tab === "pending" ? pending : done;

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F4A10] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold animate-fade-in">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">توثيق السائقين (KYC)</h2>
          <p className="text-sm text-gray-500 mt-0.5">مراجعة وثائق السائقين وقبول أو رفض طلبات التسجيل</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors">
          <RefreshCw className="w-4 h-4" /> تحديث
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "قيد المراجعة", val: pending.length, color: "#d97706", bg: "#FEF3C7", icon: Clock },
          { label: "مقبولون", val: done.filter((d) => d.status === "accepted").length, color: "#16a34a", bg: "#dcfce7", icon: CheckCircle },
          { label: "مرفوضون", val: done.filter((d) => d.status === "rejected").length, color: "#dc2626", bg: "#fee2e2", icon: XCircle },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-heading font-black" style={{ color: s.color }}>{s.val}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(["pending", "done"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-2.5 px-4 text-sm font-bold border-b-2 transition-colors ${tab === t ? "border-[#679632] text-[#1F4A10]" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            {t === "pending" ? `قيد المراجعة (${pending.length})` : `مكتملة (${done.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-bold">لا توجد طلبات {tab === "pending" ? "معلقة" : "مكتملة"}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {list.map((d) => (
            tab === "pending"
              ? <KYCCard key={d.uuid} driver={d} onAction={handleAction} />
              : (
                <div key={d.uuid} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center flex-shrink-0">
                    <span className="font-black text-[#1F4A10]">{d.name?.[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1F4A10] truncate">{d.name}</p>
                    <p className="text-xs text-gray-500">{d.phone}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${d.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {d.status === "accepted" ? "مقبول" : "مرفوض"}
                  </span>
                </div>
              )
          ))}
        </div>
      )}
    </div>
  );
}
