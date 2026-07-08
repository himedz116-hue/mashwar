import { useState } from "react";
import {
  HeadphonesIcon, Star, AlertCircle, CheckCircle, Clock, RefreshCw,
  Search, X, Filter, ChevronDown, MessageSquare, User, Car, Phone,
  TrendingUp, Smile, Frown, Meh, Flag, BarChart2, ThumbsUp, ThumbsDown,
  Smartphone, Apple, Hash, CheckCircle2, Eye, FileText, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
type TicketType = "complaint" | "suggestion" | "technical" | "financial" | "other";

interface Ticket {
  id: string; title: string; description: string;
  status: TicketStatus; type: TicketType;
  submitter: string; submitterPhone: string; submitterType: "user" | "driver";
  platform: "android" | "ios";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string; updatedAt: string;
  tripId?: string; rating?: number;
  adminNote?: string;
}

interface Review {
  id: string; user: string; userType: "user" | "driver";
  platform: "android" | "ios";
  rating: number; comment: string; tripId?: string;
  createdAt: string; helpful: number; unhelpful: number;
}

const STATUS_LABELS: Record<TicketStatus, { label: string; cls: string; dot: string }> = {
  open:        { label: "مفتوح",       cls: "bg-red-100 text-red-600 border-red-200",       dot: "bg-red-500 animate-pulse" },
  in_progress: { label: "قيد المعالجة", cls: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  resolved:    { label: "تم الحل",     cls: "bg-green-100 text-green-700 border-green-200",  dot: "bg-green-500" },
  closed:      { label: "مغلق",        cls: "bg-gray-100 text-gray-500 border-gray-200",    dot: "bg-gray-400" },
};

const TYPE_LABELS: Record<TicketType, { label: string; cls: string }> = {
  complaint:  { label: "شكوى",    cls: "bg-red-50 text-red-600 border-red-100" },
  suggestion: { label: "اقتراح",  cls: "bg-blue-50 text-blue-700 border-blue-100" },
  technical:  { label: "تقني",    cls: "bg-purple-50 text-purple-700 border-purple-100" },
  financial:  { label: "مالي",    cls: "bg-orange-50 text-orange-700 border-orange-100" },
  other:      { label: "أخرى",    cls: "bg-gray-50 text-gray-600 border-gray-200" },
};

const PRIORITY_LABELS: Record<string, { label: string; cls: string; dot: string }> = {
  low:    { label: "منخفض", cls: "bg-gray-100 text-gray-500",    dot: "bg-gray-400" },
  medium: { label: "متوسط", cls: "bg-blue-100 text-blue-600",    dot: "bg-blue-500" },
  high:   { label: "مرتفع", cls: "bg-orange-100 text-orange-600", dot: "bg-orange-500" },
  urgent: { label: "عاجل",  cls: "bg-red-100 text-red-600",      dot: "bg-red-500 animate-pulse" },
};

const SAMPLE_TICKETS: Ticket[] = [
  { id: "T001", title: "السائق لم يصل للوجهة المحددة", description: "طلبت رحلة من الرياض إلى جدة لكن السائق توقف في منتصف الطريق وطلب مبلغاً إضافياً.", status: "open", type: "complaint", submitter: "محمد العتيبي", submitterPhone: "0512345678", submitterType: "user", platform: "android", priority: "high", createdAt: "2026-07-05T10:30:00Z", updatedAt: "2026-07-05T10:30:00Z", tripId: "TR-5521" },
  { id: "T002", title: "مشكلة في استرداد المبلغ", description: "أُلغيت الرحلة لكن المبلغ لم يُسترد حتى الآن مضى عليه 3 أيام.", status: "in_progress", type: "financial", submitter: "سارة الدوسري", submitterPhone: "0598765432", submitterType: "user", platform: "ios", priority: "urgent", createdAt: "2026-07-04T14:20:00Z", updatedAt: "2026-07-05T09:15:00Z", tripId: "TR-5498" },
  { id: "T003", title: "اقتراح بإضافة خاصية التتبع", description: "أقترح إضافة خاصية تتبع الشحنة في الوقت الفعلي للمستخدم.", status: "resolved", type: "suggestion", submitter: "أحمد القحطاني", submitterPhone: "0567891234", submitterType: "user", platform: "ios", priority: "low", createdAt: "2026-07-03T08:00:00Z", updatedAt: "2026-07-05T11:00:00Z" },
  { id: "T004", title: "التطبيق يتوقف عند اختيار المركبة", description: "كلما أحاول اختيار نوع المركبة يُغلق التطبيق فجأة على هاتف Samsung S23.", status: "in_progress", type: "technical", submitter: "فيصل الشمري", submitterPhone: "0543210987", submitterType: "driver", platform: "android", priority: "high", createdAt: "2026-07-05T07:45:00Z", updatedAt: "2026-07-05T12:00:00Z" },
  { id: "T005", title: "السائق سيء الأخلاق", description: "السائق كان غير محترم وترك البضاعة في الشارع.", status: "open", type: "complaint", submitter: "نورة السالم", submitterPhone: "0511223344", submitterType: "user", platform: "android", priority: "urgent", createdAt: "2026-07-06T16:30:00Z", updatedAt: "2026-07-06T16:30:00Z", tripId: "TR-5540" },
  { id: "T006", title: "رصيدي لم يُحوَّل", description: "انتهيت من 5 رحلات هذا الأسبوع لكن الرصيد لم يُضف لحسابي.", status: "open", type: "financial", submitter: "خالد البلوي", submitterPhone: "0502233445", submitterType: "driver", platform: "ios", priority: "medium", createdAt: "2026-07-06T09:00:00Z", updatedAt: "2026-07-06T09:00:00Z" },
];

const SAMPLE_REVIEWS: Review[] = [
  { id: "R001", user: "محمد العتيبي", userType: "user", platform: "android", rating: 5, comment: "خدمة ممتازة، السائق كان محترماً والبضاعة وصلت سليمة.", tripId: "TR-5510", createdAt: "2026-07-04T15:20:00Z", helpful: 12, unhelpful: 0 },
  { id: "R002", user: "نورة السالم", userType: "user", platform: "ios", rating: 2, comment: "تأخر السائق كثيراً ولم يرد على الهاتف.", tripId: "TR-5480", createdAt: "2026-07-03T18:45:00Z", helpful: 5, unhelpful: 1 },
  { id: "R003", user: "سارة الدوسري", userType: "user", platform: "ios", rating: 4, comment: "جيد بشكل عام، فقط الشاحنة كانت صغيرة قليلاً.", createdAt: "2026-07-03T10:15:00Z", helpful: 8, unhelpful: 2 },
  { id: "R004", user: "فيصل الشمري", userType: "driver", platform: "android", rating: 5, comment: "التطبيق سهل الاستخدام والطلبات منتظمة. أنصح به.", createdAt: "2026-07-02T14:30:00Z", helpful: 20, unhelpful: 1 },
  { id: "R005", user: "أحمد القحطاني", userType: "user", platform: "ios", rating: 3, comment: "متوسط، يحتاج تحسينات في التطبيق.", createdAt: "2026-07-01T12:00:00Z", helpful: 3, unhelpful: 0 },
  { id: "R006", user: "خالد البلوي", userType: "driver", platform: "android", rating: 1, comment: "المشاكل التقنية كثيرة والدعم بطيء.", createdAt: "2026-06-30T09:30:00Z", helpful: 7, unhelpful: 3 },
];

function StarRating({ rating, max = 5, size = "sm" }: { rating: number; max?: number; size?: "sm" | "md" }) {
  const w = size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) => (
        <Star key={i} className={`${w} ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

export default function Support() {
  const [tickets, setTickets] = useState(SAMPLE_TICKETS);
  const [reviews] = useState(SAMPLE_REVIEWS);
  const [tab, setTab] = useState<"tickets" | "reviews" | "analytics">("tickets");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TicketType | "all">("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg: string) => { setToast({ msg, show: true }); setTimeout(() => setToast(p => ({ ...p, show: false })), 3000); };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));
    setSelectedTicket(prev => prev?.id === id ? { ...prev, status, updatedAt: new Date().toISOString() } : prev);
    showToast("تم تحديث حالة التذكرة بنجاح");
  };

  const filteredTickets = tickets.filter(t => {
    const matchSearch = !search || t.title.includes(search) || t.submitter.includes(search) || t.id.includes(search);
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchType = typeFilter === "all" || t.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";
  const openCount = tickets.filter(t => t.status === "open").length;
  const urgentCount = tickets.filter(t => t.priority === "urgent" && t.status !== "resolved" && t.status !== "closed").length;

  return (
    <div className="space-y-6" dir="rtl">
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 bg-[#1F4A10] text-white">
            <CheckCircle2 className="w-5 h-5" /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#1F4A10]">الدعم الفني والشكاوى</h2>
          <p className="text-sm text-gray-500 mt-1">إدارة تذاكر الدعم ومراجعات العملاء والسائقين</p>
        </div>
        {urgentCount > 0 && (
          <span className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-bold animate-pulse border border-red-200 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> {urgentCount} تذاكر عاجلة تحتاج اهتمام
          </span>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "تذاكر مفتوحة", value: openCount, icon: AlertCircle, color: "#dc2626", bg: "#fef2f2" },
          { label: "قيد المعالجة", value: tickets.filter(t => t.status === "in_progress").length, icon: Clock, color: "#d97706", bg: "#fef3c7" },
          { label: "تم حلها", value: tickets.filter(t => t.status === "resolved").length, icon: CheckCircle, color: "#16a34a", bg: "#dcfce7" },
          { label: "متوسط التقييم", value: avgRating, icon: Star, color: "#f59e0b", bg: "#fef3c7" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: s.bg }}>
              <s.icon className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-3xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-bold text-gray-500 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden" style={{ minHeight: "500px" }}>
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          {([
            { key: "tickets", label: `التذاكر (${tickets.length})`, icon: HeadphonesIcon },
            { key: "reviews", label: `المراجعات (${reviews.length})`, icon: Star },
            { key: "analytics", label: "التحليلات", icon: BarChart2 },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all flex-1 md:flex-none md:w-48 ${
                tab === t.key ? "border-[#679632] text-[#1F4A10] bg-white" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <t.icon className={`w-4 h-4 ${tab === t.key ? "text-[#679632]" : ""}`} /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-4 md:p-6">
          {/* TICKETS TAB */}
          {tab === "tickets" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث بالعنوان أو الاسم أو رقم التذكرة..."
                    className="w-full pr-12 pl-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none bg-white focus:border-[#679632]">
                  <option value="all">كل الحالات</option>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none bg-white focus:border-[#679632]">
                  <option value="all">كل الأنواع</option>
                  {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>

              {/* Tickets List */}
              <div className="space-y-3">
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <HeadphonesIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="font-bold text-lg text-gray-600">لا توجد تذاكر مطابقة</p>
                  </div>
                ) : filteredTickets.map((ticket) => {
                  const status = STATUS_LABELS[ticket.status];
                  const type = TYPE_LABELS[ticket.type];
                  const priority = PRIORITY_LABELS[ticket.priority];
                  return (
                    <motion.div key={ticket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      onClick={() => { setSelectedTicket(ticket); setAdminNote(ticket.adminNote ?? ""); }}
                      className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#D4EDA8] hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                      
                      {/* Priority stripe */}
                      <div className={`absolute top-0 right-0 bottom-0 w-1 ${priority.dot}`} />
                      
                      <div className="flex items-start gap-4 pr-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">{ticket.id}</span>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${status.cls}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span> {status.label}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${type.cls}`}>{type.label}</span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${priority.cls}`}>{priority.label}</span>
                          </div>
                          <h4 className="font-bold text-gray-800 text-base mb-1 group-hover:text-[#1F4A10] transition-colors">{ticket.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-1 mb-3">{ticket.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1.5 font-bold">
                              {ticket.submitterType === "driver" ? <Car className="w-3.5 h-3.5 text-green-500" /> : <User className="w-3.5 h-3.5 text-blue-500" />}
                              {ticket.submitter}
                            </span>
                            <span className="flex items-center gap-1 font-mono"><Phone className="w-3 h-3" />{ticket.submitterPhone}</span>
                            <span className="flex items-center gap-1">
                              {ticket.platform === "android" ? <Smartphone className="w-3 h-3 text-green-600" /> : <Apple className="w-3 h-3 text-gray-600" />}
                              {ticket.platform}
                            </span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ticket.createdAt).toLocaleDateString("ar-SA")}</span>
                            {ticket.tripId && <span className="flex items-center gap-1 text-[#679632] font-bold"><Hash className="w-3 h-3" />{ticket.tripId}</span>}
                          </div>
                        </div>
                        <Eye className="w-5 h-5 text-gray-300 group-hover:text-[#679632] transition-colors flex-shrink-0 mt-2" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {tab === "reviews" && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-100 text-center">
                  <StarRating rating={parseFloat(avgRating)} size="md" />
                  <p className="text-4xl font-heading font-black text-amber-600 mt-2">{avgRating}</p>
                  <p className="text-xs text-gray-500 mt-1">من 5.0 — {reviews.length} تقييم</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-700 text-sm mb-3">توزيع التقييمات</h4>
                  {[5,4,3,2,1].map(star => {
                    const count = reviews.filter(r => Math.round(r.rating) === star).length;
                    const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-gray-500 w-4">{star}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} /></div>
                        <span className="text-[10px] font-bold text-gray-400 w-5">{count}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-700 text-sm mb-3">مؤشر الرضا</h4>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="text-center">
                      <Smile className="w-8 h-8 text-green-500 mx-auto" />
                      <p className="text-lg font-black text-green-600 mt-1">{reviews.filter(r => r.rating >= 4).length}</p>
                      <p className="text-[10px] text-gray-500">إيجابي</p>
                    </div>
                    <div className="text-center">
                      <Meh className="w-8 h-8 text-amber-500 mx-auto" />
                      <p className="text-lg font-black text-amber-600 mt-1">{reviews.filter(r => r.rating === 3).length}</p>
                      <p className="text-[10px] text-gray-500">محايد</p>
                    </div>
                    <div className="text-center">
                      <Frown className="w-8 h-8 text-red-500 mx-auto" />
                      <p className="text-lg font-black text-red-600 mt-1">{reviews.filter(r => r.rating <= 2).length}</p>
                      <p className="text-[10px] text-gray-500">سلبي</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#D4EDA8] hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${review.userType === 'driver' ? 'bg-green-100' : 'bg-blue-100'}`}>
                          {review.userType === 'driver' ? <Car className="w-5 h-5 text-green-600" /> : <User className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{review.user}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={review.rating} />
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${review.platform === 'android' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {review.platform === 'android' ? 'Android' : 'iOS'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{new Date(review.createdAt).toLocaleDateString("ar-SA")}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl mb-3">{review.comment}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-green-500" /> {review.helpful} مفيد</span>
                      <span className="flex items-center gap-1"><ThumbsDown className="w-3.5 h-3.5 text-red-400" /> {review.unhelpful}</span>
                      {review.tripId && <span className="flex items-center gap-1 text-[#679632] font-bold"><Hash className="w-3 h-3" />{review.tripId}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {tab === "analytics" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-heading font-black text-[#1F4A10] mb-5">توزيع التذاكر حسب الحالة</h3>
                <div className="space-y-4">
                  {(["open","in_progress","resolved","closed"] as TicketStatus[]).map(status => {
                    const count = tickets.filter(t => t.status === status).length;
                    const pct = tickets.length ? (count / tickets.length) * 100 : 0;
                    const info = STATUS_LABELS[status];
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-bold text-gray-700">{info.label}</span>
                          <span className="font-black text-gray-800">{count}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${info.dot.replace('animate-pulse','')}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-heading font-black text-[#1F4A10] mb-5">توزيع التذاكر حسب النوع</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(TYPE_LABELS) as [TicketType, typeof TYPE_LABELS[TicketType]][]).map(([key, info]) => {
                    const count = tickets.filter(t => t.type === key).length;
                    return (
                      <div key={key} className={`rounded-2xl p-4 text-center border ${info.cls}`}>
                        <p className="text-2xl font-heading font-black">{count}</p>
                        <p className="text-xs font-bold mt-1">{info.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-heading font-black text-[#1F4A10] mb-5">حسب المنصة</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-2xl p-5 text-center border border-green-100">
                    <Smartphone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-3xl font-heading font-black text-green-700">{tickets.filter(t => t.platform === "android").length}</p>
                    <p className="text-xs font-bold text-green-600 mt-1">Android</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-200">
                    <Apple className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                    <p className="text-3xl font-heading font-black text-gray-800">{tickets.filter(t => t.platform === "ios").length}</p>
                    <p className="text-xs font-bold text-gray-600 mt-1">iOS</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-heading font-black text-[#1F4A10] mb-5">حسب الأولوية</h3>
                <div className="space-y-3">
                  {(["urgent","high","medium","low"] as const).map(p => {
                    const count = tickets.filter(t => t.priority === p).length;
                    const info = PRIORITY_LABELS[p];
                    return (
                      <div key={p} className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${info.dot}`}></span>
                        <span className="text-sm font-bold text-gray-700 flex-1">{info.label}</span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${info.cls}`}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedTicket(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scroll border border-gray-100" onClick={(e) => e.stopPropagation()}>
              
              <div className="p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">{selectedTicket.id}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${STATUS_LABELS[selectedTicket.status].cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_LABELS[selectedTicket.status].dot}`}></span>
                        {STATUS_LABELS[selectedTicket.status].label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${PRIORITY_LABELS[selectedTicket.priority].cls}`}>{PRIORITY_LABELS[selectedTicket.priority].label}</span>
                    </div>
                    <h3 className="font-heading font-black text-[#1F4A10] text-2xl">{selectedTicket.title}</h3>
                  </div>
                  <button onClick={() => setSelectedTicket(null)} className="p-2 bg-gray-50 hover:bg-red-50 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedTicket.description}</p>
                </div>

                {/* Submitter Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
                    <h4 className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2"><User className="w-4 h-4"/> معلومات المرسل</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between"><span className="text-gray-500">الاسم:</span><span className="font-bold text-gray-800">{selectedTicket.submitter}</span></p>
                      <p className="flex justify-between"><span className="text-gray-500">الهاتف:</span><span className="font-bold font-mono text-gray-800">{selectedTicket.submitterPhone}</span></p>
                      <p className="flex justify-between"><span className="text-gray-500">النوع:</span><span className="font-bold text-gray-800">{selectedTicket.submitterType === "driver" ? "سائق" : "عميل"}</span></p>
                      <p className="flex justify-between"><span className="text-gray-500">المنصة:</span><span className="font-bold text-gray-800 flex items-center gap-1">{selectedTicket.platform === "android" ? <><Smartphone className="w-3.5 h-3.5 text-green-600"/>Android</> : <><Apple className="w-3.5 h-3.5"/>iOS</>}</span></p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h4 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2"><Clock className="w-4 h-4"/> الجدول الزمني</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between"><span className="text-gray-500">تاريخ الإنشاء:</span><span className="font-bold text-gray-800">{new Date(selectedTicket.createdAt).toLocaleString("ar-SA")}</span></p>
                      <p className="flex justify-between"><span className="text-gray-500">آخر تحديث:</span><span className="font-bold text-gray-800">{new Date(selectedTicket.updatedAt).toLocaleString("ar-SA")}</span></p>
                      {selectedTicket.tripId && <p className="flex justify-between"><span className="text-gray-500">رقم الرحلة:</span><span className="font-bold text-[#679632]">{selectedTicket.tripId}</span></p>}
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-[#F6FAF0] rounded-2xl p-5 border border-[#D4EDA8]/50">
                  <h4 className="font-bold text-[#1F4A10] text-sm mb-3">تحديث حالة التذكرة</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Object.entries(STATUS_LABELS) as [TicketStatus, typeof STATUS_LABELS[TicketStatus]][]).map(([key, info]) => (
                      <button key={key} onClick={() => updateTicketStatus(selectedTicket.id, key)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedTicket.status === key ? info.cls + " ring-2 ring-offset-1" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                        {info.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Note */}
                <div>
                  <h4 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-2"><FileText className="w-4 h-4"/> ملاحظة إدارية</h4>
                  <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={3} placeholder="أضف ملاحظة داخلية عن هذه التذكرة..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all resize-none bg-gray-50 focus:bg-white" />
                  <button onClick={() => { setTickets(prev => prev.map(t => t.id === selectedTicket.id ? {...t, adminNote} : t)); showToast("تم حفظ الملاحظة"); }}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-xs font-bold hover:opacity-90 transition-colors">حفظ الملاحظة</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
