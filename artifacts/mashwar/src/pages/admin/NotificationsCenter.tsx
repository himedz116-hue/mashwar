import { useState } from "react";
import { sendDriverNotification } from "@/lib/meshwarApi";
import { Bell, Send, Users, User, CheckCircle } from "lucide-react";

const templates = [
  { title: "تحديث جديد متاح", body: "تم إصدار تحديث جديد للتطبيق. حدّث الآن للاستمتاع بأفضل تجربة." },
  { title: "عرض خاص", body: "استمتع بعرض خاص اليوم! خصم على رحلتك القادمة." },
  { title: "تذكير بإكمال الملف", body: "ملفك الشخصي غير مكتمل. أكمل بياناتك للحصول على أفضل فرص." },
  { title: "رسالة ترحيب", body: "مرحباً بك في مشوار! نحن سعداء بانضمامك لعائلتنا." },
];

export default function NotificationsCenter() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [uuid, setUuid] = useState("");
  const [sendToAll, setSendToAll] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) { setError("العنوان والمحتوى مطلوبان"); return; }
    setSending(true); setError(""); setSent(false);
    try {
      await sendDriverNotification({ title, body, uuid: !sendToAll ? uuid : undefined });
      setSent(true);
      setTitle(""); setBody(""); setUuid("");
      setTimeout(() => setSent(false), 4000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">مركز الإشعارات</h2>
        <p className="text-sm text-gray-500 mt-0.5">إرسال إشعارات فورية للسائقين والمستخدمين</p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {[
          { label: "مرسلة اليوم", value: "—", icon: Bell, color: "#1F4A10", bg: "#D4EDA8" },
          { label: "إجمالي المستلمين", value: "—", icon: Users, color: "#679632", bg: "#D4EDA8" },
          { label: "معدل الفتح", value: "—", icon: CheckCircle, color: "#2563eb", bg: "#dbeafe" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-5">
        {/* Form */}
        <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-heading font-black text-[#1F4A10] mb-5 flex items-center gap-2">
            <Send className="w-5 h-5 text-[#679632]" /> إرسال إشعار جديد
          </h3>
          <form onSubmit={handleSend} className="space-y-4">
            {/* Target */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">المستهدف</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setSendToAll(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${sendToAll ? "border-[#1F4A10] bg-[#F6FAF0] text-[#1F4A10]" : "border-gray-200 text-gray-400"}`}>
                  <Users className="w-4 h-4" /> جميع السائقين
                </button>
                <button type="button" onClick={() => setSendToAll(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${!sendToAll ? "border-[#1F4A10] bg-[#F6FAF0] text-[#1F4A10]" : "border-gray-200 text-gray-400"}`}>
                  <User className="w-4 h-4" /> سائق محدد
                </button>
              </div>
            </div>

            {!sendToAll && (
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">UUID السائق</label>
                <input value={uuid} onChange={(e) => setUuid(e.target.value)}
                  placeholder="أدخل UUID السائق..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] font-mono" />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">عنوان الإشعار *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="أدخل عنوان الإشعار..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">محتوى الإشعار *</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)}
                rows={4} placeholder="اكتب محتوى الإشعار..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] resize-none" />
            </div>

            {error && <p className="text-red-500 text-xs bg-red-50 p-2.5 rounded-xl">{error}</p>}

            {sent && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-bold">
                <CheckCircle className="w-4 h-4" /> تم إرسال الإشعار بنجاح!
              </div>
            )}

            <button type="submit" disabled={sending || !title.trim() || !body.trim()}
              className="w-full py-3 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> {sending ? "جاري الإرسال..." : "إرسال الإشعار"}
            </button>
          </form>
        </div>

        {/* Templates */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-heading font-black text-[#1F4A10] mb-4 text-sm">قوالب جاهزة</h3>
          <div className="space-y-2.5">
            {templates.map((t, i) => (
              <button key={i} onClick={() => { setTitle(t.title); setBody(t.body); }}
                className="w-full text-right p-3.5 rounded-xl border border-gray-100 hover:border-[#D4EDA8] hover:bg-[#F6FAF0] transition-all group">
                <p className="font-bold text-[#1F4A10] text-sm group-hover:text-[#679632] transition-colors">{t.title}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.body}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
