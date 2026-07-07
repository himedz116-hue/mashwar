import { useState } from "react";
import { MessageSquare, Star, Trash2, Check, Clock, AlertCircle, ChevronDown } from "lucide-react";

const tickets = [
  { id: "TK-301", from: "محمد الأحمد", type: "customer", subject: "لم يصل السائق في الوقت المحدد", priority: "high", status: "open", date: "2024-07-06 14:32", trip: "T-0997" },
  { id: "TK-302", from: "خالد القحطاني", type: "driver", subject: "مشكلة في استلام الأرباح", priority: "medium", status: "in_progress", date: "2024-07-06 11:10", trip: null },
  { id: "TK-303", from: "نورة الزهراني", type: "customer", subject: "الدفع تم ولم تُسجَّل الرحلة", priority: "high", status: "open", date: "2024-07-05 18:45", trip: "T-1000" },
  { id: "TK-304", from: "سليمان الغامدي", type: "driver", subject: "استفسار عن شروط الاستخدام", priority: "low", status: "resolved", date: "2024-07-05 09:22", trip: null },
  { id: "TK-305", from: "ريم الدوسري", type: "customer", subject: "السائق كان غير محترم", priority: "high", status: "in_progress", date: "2024-07-04 16:00", trip: "T-0994" },
];

const reviews = [
  { id: 1, customer: "محمد الأحمد", driver: "خالد القحطاني", rating: 5, comment: "خدمة ممتازة والسائق محترم جداً، شكراً!", trip: "T-0998", date: "2024-07-06" },
  { id: 2, customer: "فهد العتيبي", driver: "سليمان الغامدي", rating: 2, comment: "جاء متأخر جداً وكان غير منتبه للطريق", trip: "T-0996", date: "2024-07-05" },
  { id: 3, customer: "هنا العمري", driver: "حمد المطيري", rating: 4, comment: "الخدمة كويسة لكن السعر كان غالي شوي", trip: "T-0995", date: "2024-07-05" },
  { id: 4, customer: "عبدالله الفيفي", driver: "طارق المالكي", rating: 5, comment: "ممتاز وسريع، سأستخدم الخدمة مرة أخرى", trip: "T-0993", date: "2024-07-04" },
];

const priorityBadge = (p: string) => {
  const map: Record<string, string> = {
    high: "bg-red-100 text-red-600",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-green-100 text-green-700",
  };
  const labels: Record<string, string> = { high: "عالية", medium: "متوسطة", low: "منخفضة" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${map[p]}`}>{labels[p]}</span>;
};

const statusBadge = (s: string) => {
  const map: Record<string, { label: string; icon: typeof Clock; cls: string }> = {
    open: { label: "مفتوحة", icon: AlertCircle, cls: "bg-red-50 text-red-500" },
    in_progress: { label: "قيد الحل", icon: Clock, cls: "bg-amber-50 text-amber-600" },
    resolved: { label: "محلولة", icon: Check, cls: "bg-green-50 text-green-600" },
  };
  const m = map[s];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${m.cls}`}>
      <m.icon className="w-3 h-3" />{m.label}
    </span>
  );
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

export default function Support() {
  const [tab, setTab] = useState<"tickets" | "reviews">("tickets");
  const [expanded, setExpanded] = useState<string | null>(null);

  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">الدعم الفني والشكاوى</h2>
        <p className="text-[#4A5568]/60 text-sm mt-1">متابعة تذاكر الدعم وإدارة تقييمات المستخدمين</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100 text-center">
          <p className="text-3xl font-heading font-black text-red-500">{open}</p>
          <p className="text-xs text-red-500/70 mt-0.5">تذاكر مفتوحة</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center">
          <p className="text-3xl font-heading font-black text-amber-600">{inProgress}</p>
          <p className="text-xs text-amber-600/70 mt-0.5">قيد الحل</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100 text-center">
          <p className="text-3xl font-heading font-black text-green-600">{resolved}</p>
          <p className="text-xs text-green-600/70 mt-0.5">محلولة</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { key: "tickets", label: `تذاكر الدعم (${tickets.length})` },
            { key: "reviews", label: `التقييمات (${reviews.length})` },
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
          {tab === "tickets" && (
            <div className="space-y-2">
              {tickets.map((tk) => (
                <div key={tk.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === tk.id ? null : tk.id)}
                    className="w-full flex items-center gap-3 p-4 text-right hover:bg-[#F6FAF0] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F6FAF0] flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-[#679632]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-[#679632] font-bold">{tk.id}</span>
                        {priorityBadge(tk.priority)}
                        {statusBadge(tk.status)}
                        <span className="text-xs text-[#4A5568]/40 hidden md:block">{tk.date}</span>
                      </div>
                      <p className="font-bold text-[#1F4A10] text-sm mt-0.5">{tk.subject}</p>
                      <p className="text-xs text-[#4A5568]/60">{tk.from} ({tk.type === "customer" ? "عميل" : "سائق"})</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#4A5568]/40 transition-transform ${expanded === tk.id ? "rotate-180" : ""}`} />
                  </button>
                  {expanded === tk.id && (
                    <div className="border-t border-gray-100 p-4 bg-[#F6FAF0] space-y-3">
                      {tk.trip && (
                        <p className="text-xs text-[#4A5568]/60">رحلة مرتبطة: <span className="font-mono font-bold text-[#679632]">{tk.trip}</span></p>
                      )}
                      <textarea
                        rows={3}
                        placeholder="اكتب ردك على التذكرة..."
                        className="w-full text-sm border border-gray-200 rounded-xl p-3 outline-none focus:border-[#679632] resize-none bg-white"
                      />
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-xs font-bold hover:bg-[#2A5A14] transition-colors">إرسال الرد</button>
                        <button className="px-4 py-2 rounded-xl bg-green-100 text-green-700 text-xs font-bold hover:bg-green-200 transition-colors">تحديد كمحلولة</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "reviews" && (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-[#1F4A10] text-sm">{r.customer}</p>
                      <p className="text-xs text-[#4A5568]/50">السائق: {r.driver} · {r.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={r.rating} />
                      <span className="font-bold text-amber-500 text-sm">{r.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#4A5568] bg-[#F6FAF0] rounded-xl p-3">{r.comment}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono text-xs text-[#679632]">{r.trip}</span>
                    {r.rating <= 2 && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> حذف
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
