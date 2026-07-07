import { useState } from "react";
import { MessageSquare, Star, Trash2, Check, Clock, AlertCircle, ChevronDown, ChevronUp, Phone, User, Car } from "lucide-react";

interface Ticket {
  id: string; from: string; type: "customer" | "driver";
  subject: string; priority: "high" | "medium" | "low"; status: "open" | "in_progress" | "resolved";
  date: string; trip: string | null; reply?: string;
}

interface Review {
  id: number; customer: string; driver: string; rating: number;
  comment: string; trip: string; date: string; hidden?: boolean;
}

const initialTickets: Ticket[] = [
  { id: "TK-301", from: "محمد الأحمد", type: "customer", subject: "لم يصل السائق في الوقت المحدد", priority: "high", status: "open", date: "2024-07-06 14:32", trip: "T-0997" },
  { id: "TK-302", from: "خالد القحطاني", type: "driver", subject: "مشكلة في استلام الأرباح", priority: "medium", status: "in_progress", date: "2024-07-06 11:10", trip: null, reply: "تم التواصل مع المحاسبة وسيتم حل المشكلة خلال 48 ساعة." },
  { id: "TK-303", from: "نورة الزهراني", type: "customer", subject: "الدفع تم ولم تُسجَّل الرحلة", priority: "high", status: "open", date: "2024-07-05 18:45", trip: "T-1000" },
  { id: "TK-304", from: "سليمان الغامدي", type: "driver", subject: "استفسار عن شروط الاستخدام", priority: "low", status: "resolved", date: "2024-07-05 09:22", trip: null, reply: "تم شرح الشروط والأحكام. يمكن الاطلاع عليها من الإعدادات." },
  { id: "TK-305", from: "ريم الدوسري", type: "customer", subject: "السائق كان غير محترم", priority: "high", status: "in_progress", date: "2024-07-04 16:00", trip: "T-0994" },
  { id: "TK-306", from: "فهد العتيبي", type: "customer", subject: "تطبيق يتوقف عند الدفع", priority: "medium", status: "open", date: "2024-07-04 10:15", trip: null },
  { id: "TK-307", from: "طارق المالكي", type: "driver", subject: "مشكلة في تحديث موقع GPS", priority: "medium", status: "open", date: "2024-07-03 15:30", trip: "T-0990" },
];

const initialReviews: Review[] = [
  { id: 1, customer: "محمد الأحمد", driver: "خالد القحطاني", rating: 5, comment: "خدمة ممتازة والسائق محترم جداً، شكراً!", trip: "T-0998", date: "2024-07-06" },
  { id: 2, customer: "فهد العتيبي", driver: "سليمان الغامدي", rating: 2, comment: "جاء متأخر جداً وكان غير منتبه للطريق", trip: "T-0996", date: "2024-07-05" },
  { id: 3, customer: "هنا العمري", driver: "حمد المطيري", rating: 4, comment: "الخدمة كويسة لكن السعر كان غالي شوي", trip: "T-0995", date: "2024-07-05" },
  { id: 4, customer: "عبدالله الفيفي", driver: "طارق المالكي", rating: 5, comment: "ممتاز وسريع، سأستخدم الخدمة مرة أخرى", trip: "T-0993", date: "2024-07-04" },
  { id: 5, customer: "سارة المطيري", driver: "إبراهيم الحربي", rating: 3, comment: "متوسط، يحتاج تحسين في الالتزام بالوقت", trip: "T-0992", date: "2024-07-03" },
  { id: 6, customer: "أحمد الشهري", driver: "عمر البقمي", rating: 5, comment: "رائع! سريع واحترافي جداً", trip: "T-0991", date: "2024-07-03" },
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

const priorityConfig: Record<string, { label: string; cls: string }> = {
  high: { label: "عالية", cls: "bg-red-100 text-red-600" },
  medium: { label: "متوسطة", cls: "bg-amber-100 text-amber-700" },
  low: { label: "منخفضة", cls: "bg-green-100 text-green-700" },
};

const statusConfig: Record<string, { label: string; icon: typeof Clock; cls: string }> = {
  open: { label: "مفتوحة", icon: AlertCircle, cls: "bg-red-50 text-red-500 border-red-100" },
  in_progress: { label: "قيد الحل", icon: Clock, cls: "bg-amber-50 text-amber-600 border-amber-100" },
  resolved: { label: "محلولة", icon: Check, cls: "bg-green-50 text-green-600 border-green-100" },
};

function TicketCard({ ticket, onUpdate, onDelete }: {
  ticket: Ticket;
  onUpdate: (id: string, updates: Partial<Ticket>) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [reply, setReply] = useState(ticket.reply ?? "");
  const [saving, setSaving] = useState(false);

  const sc = statusConfig[ticket.status];
  const pc = priorityConfig[ticket.priority];

  const handleReply = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate save
    onUpdate(ticket.id, { reply, status: "in_progress" });
    setSaving(false);
  };

  const handleResolve = () => onUpdate(ticket.id, { status: "resolved" });

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md ${ticket.status === "resolved" ? "opacity-70" : ""}`}>
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ticket.type === "customer" ? "bg-blue-50" : "bg-[#F6FAF0]"}`}>
          {ticket.type === "customer" ? <User className="w-4 h-4 text-blue-500" /> : <Car className="w-4 h-4 text-[#679632]" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-[#1F4A10] text-sm">{ticket.from}</p>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ticket.type === "customer" ? "bg-blue-50 text-blue-600" : "bg-[#F6FAF0] text-[#679632]"}`}>
              {ticket.type === "customer" ? "عميل" : "سائق"}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${pc.cls}`}>{pc.label}</span>
          </div>
          <p className="text-sm text-[#1F4A10] font-medium mt-0.5">{ticket.subject}</p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-gray-400">{ticket.date}</p>
            {ticket.trip && <span className="text-xs font-mono text-gray-400">{ticket.trip}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.cls}`}>
            <sc.icon className="w-3 h-3" />{sc.label}
          </span>
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-3 bg-[#F6FAF0]/50">
          {ticket.reply && (
            <div className="bg-green-50 rounded-xl p-3 border border-green-100">
              <p className="text-xs font-bold text-green-700 mb-1">✅ الرد المسجّل</p>
              <p className="text-sm text-green-800">{ticket.reply}</p>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">الرد / الملاحظة</label>
            <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3}
              placeholder="اكتب ردك على الشكوى..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleReply} disabled={saving || !reply.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-xs font-bold hover:bg-[#2A5A14] disabled:opacity-50 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" /> {saving ? "جاري الحفظ..." : "حفظ الرد"}
            </button>
            {ticket.status !== "resolved" && (
              <button onClick={handleResolve}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors">
                <Check className="w-3.5 h-3.5" /> تعيين كمحلولة
              </button>
            )}
            <button onClick={() => { if (confirm("حذف هذه التذكرة؟")) onDelete(ticket.id); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors mr-auto">
              <Trash2 className="w-3.5 h-3.5" /> حذف
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Support() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [tab, setTab] = useState<"tickets" | "reviews">("tickets");
  const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "customer" | "driver">("all");

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets((p) => p.map((t) => t.id === id ? { ...t, ...updates } : t));
  };
  const deleteTicket = (id: string) => setTickets((p) => p.filter((t) => t.id !== id));
  const toggleReview = (id: number) => setReviews((p) => p.map((r) => r.id === id ? { ...r, hidden: !r.hidden } : r));
  const deleteReview = (id: number) => { if (confirm("حذف هذا التقييم؟")) setReviews((p) => p.filter((r) => r.id !== id)); };

  const filtered = tickets
    .filter((t) => filter === "all" || t.status === filter)
    .filter((t) => typeFilter === "all" || t.type === typeFilter);

  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">الدعم الفني والشكاوى</h2>
        <p className="text-[#4A5568]/60 text-sm mt-1">متابعة تذاكر الدعم وإدارة تقييمات المستخدمين</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <div>
            <p className="text-2xl font-heading font-black text-red-500">{open}</p>
            <p className="text-xs text-red-400">مفتوحة</p>
          </div>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-center gap-3">
          <Clock className="w-8 h-8 text-amber-400" />
          <div>
            <p className="text-2xl font-heading font-black text-amber-600">{inProgress}</p>
            <p className="text-xs text-amber-500">قيد الحل</p>
          </div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex items-center gap-3">
          <Check className="w-8 h-8 text-green-400" />
          <div>
            <p className="text-2xl font-heading font-black text-green-600">{resolved}</p>
            <p className="text-xs text-green-500">محلولة</p>
          </div>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-center gap-3">
          <Star className="w-8 h-8 text-amber-400 fill-amber-300" />
          <div>
            <p className="text-2xl font-heading font-black text-amber-600">{avgRating}</p>
            <p className="text-xs text-amber-500">متوسط التقييم</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: "tickets", label: `🎫 تذاكر الدعم (${tickets.length})` },
          { key: "reviews", label: `⭐ التقييمات (${reviews.length})` },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className={`px-5 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${tab === t.key ? "text-[#1F4A10] border-[#1F4A10]" : "text-gray-400 border-transparent hover:text-[#1F4A10]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tickets */}
      {tab === "tickets" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {(["all", "open", "in_progress", "resolved"] as const).map((f) => {
                const labels = { all: "الكل", open: "مفتوحة", in_progress: "قيد الحل", resolved: "محلولة" };
                return (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? "bg-[#1F4A10] text-white shadow" : "text-gray-400 hover:text-gray-600"}`}>
                    {labels[f]}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {(["all", "customer", "driver"] as const).map((f) => {
                const labels = { all: "الكل", customer: "عملاء", driver: "سائقون" };
                return (
                  <button key={f} onClick={() => setTypeFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${typeFilter === f ? "bg-[#1F4A10] text-white shadow" : "text-gray-400 hover:text-gray-600"}`}>
                    {labels[f]}
                  </button>
                );
              })}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold">لا توجد تذاكر</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((t) => (
                <TicketCard key={t.id} ticket={t} onUpdate={updateTicket} onDelete={deleteTicket} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviews */}
      {tab === "reviews" && (
        <div className="space-y-3">
          {/* Rating summary */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-5xl font-heading font-black text-amber-500">{avgRating}</p>
                <StarDisplay rating={Math.round(Number(avgRating))} />
                <p className="text-xs text-gray-400 mt-1">{reviews.length} تقييم</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 w-4">{star}</span>
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 w-6 text-left">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {reviews.map((r) => (
            <div key={r.id} className={`bg-white rounded-2xl p-4 border border-gray-100 shadow-sm transition-all ${r.hidden ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-[#1F4A10] text-sm">{r.customer}</span>
                    <span className="text-gray-300 text-xs">→</span>
                    <span className="text-sm text-gray-500">{r.driver}</span>
                    <span className="text-xs font-mono text-gray-400">{r.trip}</span>
                  </div>
                  <StarDisplay rating={r.rating} />
                  <p className="text-sm text-gray-600 mt-2">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{r.date}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => toggleReview(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${r.hidden ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {r.hidden ? "إظهار" : "إخفاء"}
                  </button>
                  <button onClick={() => deleteReview(r.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {r.rating <= 2 && (
                <div className="mt-3 bg-red-50 rounded-xl p-2.5 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-600">تقييم منخفض - يستحق المراجعة</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
