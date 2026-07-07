import { useState, useEffect } from "react";
import { sendDriverNotification, getDrivers, type Driver } from "@/lib/meshwarApi";
import { Bell, Send, Users, User, CheckCircle, RefreshCw, Search, Smartphone, Apple } from "lucide-react";

const templates = [
  { title: "تحديث جديد متاح", body: "تم إصدار تحديث جديد لتطبيق مشوار. حدّث الآن للاستمتاع بأفضل تجربة على Android و iOS." },
  { title: "عرض خاص اليوم", body: "🎉 استمتع بعرض خاص اليوم! خصم مميز على رحلتك القادمة مع مشوار." },
  { title: "تذكير بإكمال الملف", body: "ملفك الشخصي غير مكتمل. أكمل بياناتك للحصول على أفضل الفرص." },
  { title: "رسالة ترحيب", body: "مرحباً بك في مشوار! نحن سعداء بانضمامك. ابدأ أول رحلة الآن 🚛" },
  { title: "تنبيه أمني", body: "نذكّرك بمراجعة بيانات حسابك وتحديث كلمة المرور بشكل دوري لحماية حسابك." },
  { title: "تقييم رحلتك", body: "شكراً على استخدامك مشوار! كيف كانت تجربتك؟ قيّم السائق لمساعدة الآخرين." },
];

export default function NotificationsCenter() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sendToAll, setSendToAll] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [driverSearch, setDriverSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sentCount, setSentCount] = useState(0);
  const [platform, setPlatform] = useState<"both" | "android" | "ios">("both");

  const loadDrivers = () => {
    setLoadingDrivers(true);
    getDrivers()
      .then((r) => setDrivers(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingDrivers(false));
  };

  useEffect(() => { loadDrivers(); }, []);

  const filteredDrivers = drivers.filter((d) =>
    !driverSearch || d.name?.includes(driverSearch) || d.phone?.includes(driverSearch)
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) { setError("العنوان والمحتوى مطلوبان"); return; }
    if (!sendToAll && !selectedDriver) { setError("اختر سائقاً أو اختر إرسال للجميع"); return; }
    setSending(true); setError(""); setSent(false);
    try {
      await sendDriverNotification({
        title,
        body,
        uuid: !sendToAll && selectedDriver ? selectedDriver.uuid : undefined,
      });
      setSent(true);
      setSentCount((p) => p + 1);
      setTitle(""); setBody("");
      if (!sendToAll) setSelectedDriver(null);
      setTimeout(() => setSent(false), 5000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">مركز الإشعارات</h2>
          <p className="text-sm text-gray-500 mt-0.5">إرسال إشعارات فورية للسائقين على Android و iOS</p>
        </div>
        <button onClick={loadDrivers} disabled={loadingDrivers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50">
          <RefreshCw className={`w-4 h-4 ${loadingDrivers ? "animate-spin" : ""}`} /> تحديث السائقين
        </button>
      </div>

      {/* Platform + Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-4 text-white flex items-center gap-3">
          <span className="text-3xl">🤖</span>
          <div>
            <p className="font-heading font-black text-lg">Android</p>
            <p className="text-white/70 text-xs">متوافق</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-4 text-white flex items-center gap-3">
          <span className="text-3xl">🍎</span>
          <div>
            <p className="font-heading font-black text-lg">iOS / iPhone</p>
            <p className="text-white/70 text-xs">متوافق</p>
          </div>
        </div>
        {[
          { label: "السائقون الكلي", value: drivers.length, icon: Users, color: "#1F4A10", bg: "#D4EDA8" },
          { label: "إشعارات أُرسلت", value: sentCount, icon: Bell, color: "#679632", bg: "#D4EDA8" },
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
        <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h3 className="font-heading font-black text-[#1F4A10] flex items-center gap-2">
            <Send className="w-5 h-5 text-[#679632]" /> إرسال إشعار جديد
          </h3>

          <form onSubmit={handleSend} className="space-y-4">
            {/* Target */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">المستهدف</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setSendToAll(true); setSelectedDriver(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${sendToAll ? "border-[#1F4A10] bg-[#F6FAF0] text-[#1F4A10]" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}>
                  <Users className="w-4 h-4" /> جميع السائقين
                </button>
                <button type="button" onClick={() => setSendToAll(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${!sendToAll ? "border-[#1F4A10] bg-[#F6FAF0] text-[#1F4A10]" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}>
                  <User className="w-4 h-4" /> سائق محدد
                </button>
              </div>
            </div>

            {/* Platform toggle */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">المنصة</label>
              <div className="flex gap-2">
                {[
                  { val: "both", label: "🌐 الكل" },
                  { val: "android", label: "🤖 Android" },
                  { val: "ios", label: "🍎 iOS" },
                ].map((p) => (
                  <button key={p.val} type="button" onClick={() => setPlatform(p.val as typeof platform)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${platform === p.val ? "border-[#1F4A10] bg-[#F6FAF0] text-[#1F4A10]" : "border-gray-200 text-gray-400"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Driver picker */}
            {!sendToAll && (
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">اختر السائق</label>
                {selectedDriver ? (
                  <div className="flex items-center gap-3 p-3 bg-[#F6FAF0] rounded-xl border border-[#D4EDA8]">
                    <div className="w-9 h-9 rounded-xl bg-[#D4EDA8] flex items-center justify-center flex-shrink-0">
                      {selectedDriver.avatar
                        ? <img src={selectedDriver.avatar} className="w-9 h-9 rounded-xl object-cover" />
                        : <span className="font-black text-[#1F4A10] text-sm">{selectedDriver.name?.[0]}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1F4A10] text-sm">{selectedDriver.name}</p>
                      <p className="text-xs text-gray-400">{selectedDriver.phone}</p>
                    </div>
                    <button type="button" onClick={() => setSelectedDriver(null)}
                      className="text-xs text-red-400 hover:text-red-600 font-bold px-2 py-1 rounded-lg hover:bg-red-50">
                      تغيير
                    </button>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input value={driverSearch} onChange={(e) => setDriverSearch(e.target.value)}
                          placeholder="ابحث عن سائق..."
                          className="w-full pr-9 pl-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#679632] rounded-lg" />
                      </div>
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {loadingDrivers ? (
                        <div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
                      ) : filteredDrivers.length === 0 ? (
                        <p className="text-center py-4 text-xs text-gray-400">لا توجد نتائج</p>
                      ) : filteredDrivers.map((d) => (
                        <button key={d.uuid} type="button" onClick={() => setSelectedDriver(d)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-right hover:bg-[#F6FAF0] transition-colors border-b border-gray-50 last:border-0">
                          <div className="w-8 h-8 rounded-lg bg-[#D4EDA8] flex items-center justify-center flex-shrink-0 text-xs font-black text-[#1F4A10]">
                            {d.name?.[0]}
                          </div>
                          <div className="flex-1 min-w-0 text-right">
                            <p className="font-bold text-[#1F4A10] text-xs truncate">{d.name}</p>
                            <p className="text-[10px] text-gray-400">{d.phone}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">عنوان الإشعار *</label>
              <input value={title} onChange={(e) => { setTitle(e.target.value); setError(""); }}
                placeholder="مثال: تحديث جديد متاح..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">محتوى الإشعار *</label>
              <textarea value={body} onChange={(e) => { setBody(e.target.value); setError(""); }}
                rows={4} placeholder="اكتب محتوى الإشعار..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] resize-none" />
              <p className="text-xs text-gray-400 mt-1">{body.length} حرف</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-xs font-bold">
                ⚠️ {error}
              </div>
            )}

            {sent && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-bold">
                <CheckCircle className="w-4 h-4" /> تم إرسال الإشعار بنجاح! 🎉
              </div>
            )}

            {/* Preview */}
            {(title || body) && (
              <div className="bg-gray-900 rounded-2xl p-4 text-white">
                <p className="text-[10px] text-gray-500 mb-2 flex items-center gap-1.5">
                  <Smartphone className="w-3 h-3" /> معاينة على الجهاز
                </p>
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded bg-[#679632] flex items-center justify-center">
                      <span className="text-[8px] font-black text-white">م</span>
                    </div>
                    <span className="text-xs text-gray-400">مشوار</span>
                    <span className="text-[10px] text-gray-600 mr-auto">الآن</span>
                  </div>
                  {title && <p className="text-xs font-bold text-white">{title}</p>}
                  {body && <p className="text-[11px] text-gray-300 mt-0.5 line-clamp-2">{body}</p>}
                </div>
              </div>
            )}

            <button type="submit" disabled={sending || !title.trim() || !body.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#2A5A14] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1F4A10]/20">
              <Send className="w-4 h-4" />
              {sending ? "جاري الإرسال..." : sendToAll ? `إرسال للجميع (${drivers.length} سائق)` : `إرسال لـ ${selectedDriver?.name ?? "السائق"}`}
            </button>
          </form>
        </div>

        {/* Templates */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-heading font-black text-[#1F4A10] mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#679632]" /> قوالب جاهزة
          </h3>
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
