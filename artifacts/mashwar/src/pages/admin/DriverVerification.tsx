import { useState } from "react";
import { CheckCircle, XCircle, Clock, FileText, Car, CreditCard, Shield } from "lucide-react";

const requests = [
  { id: 1, name: "عبدالعزيز محمد السلمي", phone: "+966 50 781 2345", vehicle: "وانيت", date: "2024-07-05", docs: ["هوية وطنية", "رخصة قيادة", "استمارة المركبة", "تأمين المركبة"], status: "pending", note: "" },
  { id: 2, name: "حسن علي القرني", phone: "+966 55 432 1098", vehicle: "دينا", date: "2024-07-04", docs: ["هوية وطنية", "رخصة قيادة", "استمارة المركبة"], status: "pending", note: "" },
  { id: 3, name: "مازن سعود العمري", phone: "+966 53 987 6543", vehicle: "سطحة", date: "2024-07-03", docs: ["هوية وطنية", "رخصة قيادة", "استمارة المركبة", "تأمين المركبة", "صور المركبة"], status: "approved", note: "" },
  { id: 4, name: "بدر خالد الجهني", phone: "+966 56 123 4560", vehicle: "دينا ونش", date: "2024-07-02", docs: ["هوية وطنية", "رخصة قيادة"], status: "rejected", note: "استمارة المركبة غير واضحة، يرجى إعادة الرفع" },
  { id: 5, name: "وليد فارس العسيري", phone: "+966 54 567 8900", vehicle: "وانيت", date: "2024-07-01", docs: ["هوية وطنية", "رخصة قيادة", "استمارة المركبة", "تأمين المركبة", "صور المركبة"], status: "pending", note: "" },
];

const docIcons: Record<string, typeof FileText> = {
  "هوية وطنية": CreditCard,
  "رخصة قيادة": CreditCard,
  "استمارة المركبة": Car,
  "تأمين المركبة": Shield,
  "صور المركبة": FileText,
};

export default function DriverVerification() {
  const [items, setItems] = useState(requests);
  const [selected, setSelected] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const pending = items.filter((r) => r.status === "pending").length;
  const approved = items.filter((r) => r.status === "approved").length;
  const rejected = items.filter((r) => r.status === "rejected").length;

  const approve = (id: number) => {
    setItems((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" } : r));
    setSelected(null);
  };

  const reject = (id: number) => {
    if (!rejectNote.trim()) return;
    setItems((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected", note: rejectNote } : r));
    setSelected(null);
    setRejectNote("");
    setShowRejectForm(false);
  };

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; icon: typeof Clock; cls: string }> = {
      pending:  { label: "قيد المراجعة", icon: Clock, cls: "bg-amber-100 text-amber-700" },
      approved: { label: "مقبول", icon: CheckCircle, cls: "bg-green-100 text-green-700" },
      rejected: { label: "مرفوض", icon: XCircle, cls: "bg-red-100 text-red-600" },
    };
    const m = map[s];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${m.cls}`}>
        <m.icon className="w-3.5 h-3.5" />
        {m.label}
      </span>
    );
  };

  const current = selected !== null ? items.find((r) => r.id === selected) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">توثيق السائقين (KYC)</h2>
        <p className="text-[#4A5568]/60 text-sm mt-1">مراجعة طلبات تسجيل السائقين الجدد والمستندات</p>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center">
          <p className="text-3xl font-heading font-black text-amber-600">{pending}</p>
          <p className="text-xs text-amber-600/70 mt-0.5">طلبات معلقة</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100 text-center">
          <p className="text-3xl font-heading font-black text-green-600">{approved}</p>
          <p className="text-xs text-green-600/70 mt-0.5">مقبولة</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100 text-center">
          <p className="text-3xl font-heading font-black text-red-500">{rejected}</p>
          <p className="text-xs text-red-500/70 mt-0.5">مرفوضة</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Requests list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-heading font-bold text-[#1F4A10]">قائمة الطلبات</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map((req) => (
              <button
                key={req.id}
                onClick={() => { setSelected(req.id); setShowRejectForm(false); setRejectNote(""); }}
                className={`w-full text-right p-4 hover:bg-[#F6FAF0] transition-colors ${selected === req.id ? "bg-[#F6FAF0] border-r-2 border-[#679632]" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-[#1F4A10] text-sm">{req.name}</p>
                    <p className="text-xs text-[#4A5568]/60 mt-0.5">{req.vehicle} · {req.date}</p>
                  </div>
                  {statusBadge(req.status)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {current ? (
            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-heading font-bold text-[#1F4A10] text-lg">{current.name}</h3>
                <p className="text-sm text-[#4A5568]/60">{current.phone} · {current.vehicle}</p>
              </div>

              {/* Documents */}
              <div>
                <p className="text-xs font-bold text-[#4A5568]/60 mb-2 uppercase tracking-wider">المستندات المرفوعة</p>
                <div className="grid grid-cols-2 gap-2">
                  {current.docs.map((doc, i) => {
                    const Icon = docIcons[doc] || FileText;
                    return (
                      <div key={i} className="flex items-center gap-2.5 p-3 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/10">
                        <div className="w-8 h-8 rounded-lg bg-[#D4EDA8] flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#1F4A10]" />
                        </div>
                        <span className="text-xs font-medium text-[#1F4A10]">{doc}</span>
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-auto" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {current.note && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-xs text-red-600 font-medium">سبب الرفض: {current.note}</p>
                </div>
              )}

              {/* Actions */}
              {current.status === "pending" && (
                <div className="space-y-2 pt-2">
                  {!showRejectForm ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approve(current.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" /> قبول الطلب
                      </button>
                      <button
                        onClick={() => setShowRejectForm(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> رفض الطلب
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        placeholder="اكتب سبب الرفض (سيُرسَل للسائق)..."
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-xl p-3 outline-none focus:border-red-400 resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => reject(current.id)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">تأكيد الرفض</button>
                        <button onClick={() => setShowRejectForm(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-colors">إلغاء</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-[#4A5568]/40">
              <FileText className="w-10 h-10 mb-2" />
              <p className="text-sm">اختر طلباً لعرض تفاصيله</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
