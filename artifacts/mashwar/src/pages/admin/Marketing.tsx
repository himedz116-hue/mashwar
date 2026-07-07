import { useState, useEffect } from "react";
import { Tag, Plus, Send, Trash2, Copy, Check, RefreshCw, Users, Bell, Smartphone } from "lucide-react";
import { sendDriverNotification, getDrivers, type Driver } from "@/lib/meshwarApi";

interface PromoCode {
  id: number; code: string; discount: number; type: "fixed" | "percent";
  maxUses: number; used: number; expiry: string; active: boolean;
}

const initialCodes: PromoCode[] = [
  { id: 1, code: "MASHWAR20", discount: 20, type: "percent", maxUses: 500, used: 213, expiry: "2024-08-31", active: true },
  { id: 2, code: "WELCOME15", discount: 15, type: "fixed", maxUses: 100, used: 87, expiry: "2024-07-31", active: true },
  { id: 3, code: "SUMMER10", discount: 10, type: "percent", maxUses: 200, used: 200, expiry: "2024-07-01", active: false },
  { id: 4, code: "NEWUSER50", discount: 50, type: "fixed", maxUses: 50, used: 12, expiry: "2024-09-30", active: true },
];

const notifTemplates = [
  { label: "عرض خاص 🎉", text: "احصل على خصم 20% على رحلتك القادمة مع مشوار! استخدم الكود: MASHWAR20" },
  { label: "تذكير 🚛", text: "مشوار - خدمة النقل الأسرع في المنطقة. اطلب الآن من التطبيق!" },
  { label: "تحديث 📲", text: "تحديث جديد متاح! حدّث تطبيق مشوار على Android أو iOS للحصول على أفضل تجربة." },
  { label: "ترحيب جديد 👋", text: "مرحباً بك في مشوار! نحن سعداء بانضمامك. ابدأ أول رحلة الآن." },
];

export default function Marketing() {
  const [codes, setCodes] = useState(initialCodes);
  const [tab, setTab] = useState<"promo" | "notifications">("promo");
  const [showNewCode, setShowNewCode] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifText, setNotifText] = useState("");
  const [notifTarget, setNotifTarget] = useState<"all" | "specific">("all");
  const [selectedDrivers, setSelectedDrivers] = useState<Driver[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendErr, setSendErr] = useState("");
  const [newCode, setNewCode] = useState({ code: "", discount: "", type: "percent", maxUses: "", expiry: "" });

  useEffect(() => {
    setLoadingDrivers(true);
    getDrivers().then((r) => setDrivers(r.data ?? [])).catch(() => {}).finally(() => setLoadingDrivers(false));
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code); setTimeout(() => setCopied(null), 2000);
  };

  const toggleCode = (id: number) => setCodes((p) => p.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  const deleteCode = (id: number) => { if (confirm("حذف الكود؟")) setCodes((p) => p.filter((c) => c.id !== id)); };

  const addCode = () => {
    if (!newCode.code || !newCode.discount) return;
    setCodes((p) => [...p, {
      id: Date.now(), code: newCode.code.toUpperCase(), discount: parseFloat(newCode.discount),
      type: newCode.type as "fixed" | "percent", maxUses: parseInt(newCode.maxUses) || 100,
      used: 0, expiry: newCode.expiry, active: true,
    }]);
    setNewCode({ code: "", discount: "", type: "percent", maxUses: "", expiry: "" });
    setShowNewCode(false);
  };

  const sendNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifText.trim()) { setSendErr("العنوان والمحتوى مطلوبان"); return; }
    setSending(true); setSendErr(""); setSent(false);
    try {
      if (notifTarget === "all" || selectedDrivers.length === 0) {
        await sendDriverNotification({ title: notifTitle, body: notifText });
      } else {
        await Promise.all(selectedDrivers.map((d) =>
          sendDriverNotification({ title: notifTitle, body: notifText, uuid: d.uuid })
        ));
      }
      setSent(true);
      setNotifTitle(""); setNotifText(""); setSelectedDrivers([]);
      setTimeout(() => setSent(false), 5000);
    } catch (e: unknown) {
      setSendErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">التسويق والعروض</h2>
        <p className="text-[#4A5568]/60 text-sm mt-1">إدارة أكواد الخصم وإرسال الإشعارات على Android و iOS</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "أكواد نشطة", value: codes.filter((c) => c.active).length, color: "#1F4A10", bg: "#D4EDA8" },
          { label: "إجمالي الاستخدامات", value: codes.reduce((s, c) => s + c.used, 0), color: "#679632", bg: "#D4EDA8" },
          { label: "السائقون في النظام", value: drivers.length, color: "#2563eb", bg: "#dbeafe" },
          { label: "أكواد منتهية", value: codes.filter((c) => !c.active).length, color: "#d97706", bg: "#fef3c7" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: s.bg }}>
              <Tag className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#4A5568]/60 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { key: "promo", label: "أكواد الخصم", icon: Tag },
            { key: "notifications", label: "إشعارات تسويقية", icon: Bell },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors ${tab === t.key ? "text-[#1F4A10] border-b-2 border-[#1F4A10] bg-[#F6FAF0]" : "text-[#4A5568]/60 hover:text-[#1F4A10]"}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Promo Codes */}
          {tab === "promo" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#4A5568]/60">{codes.length} كود مسجّل</p>
                <button onClick={() => setShowNewCode(!showNewCode)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors">
                  <Plus className="w-4 h-4" /> إنشاء كود
                </button>
              </div>

              {showNewCode && (
                <div className="bg-[#F6FAF0] border border-[#D4EDA8] rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-[#1F4A10]">كود خصم جديد</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: "الكود", key: "code", type: "text", placeholder: "MASHWAR50", upper: true },
                      { label: "قيمة الخصم", key: "discount", type: "number", placeholder: "20" },
                      { label: "أقصى استخدامات", key: "maxUses", type: "number", placeholder: "100" },
                      { label: "تاريخ الانتهاء", key: "expiry", type: "date", placeholder: "" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="text-xs text-gray-500 mb-1 block font-bold">{f.label}</label>
                        <input type={f.type} value={(newCode as Record<string, string>)[f.key]}
                          onChange={(e) => setNewCode((p) => ({ ...p, [f.key]: f.upper ? e.target.value.toUpperCase() : e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#679632]" />
                      </div>
                    ))}
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block font-bold">نوع الخصم</label>
                      <select value={newCode.type} onChange={(e) => setNewCode((p) => ({ ...p, type: e.target.value }))}
                        className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#679632] bg-white">
                        <option value="percent">نسبة مئوية (%)</option>
                        <option value="fixed">مبلغ ثابت (ريال)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addCode} className="px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14]">إنشاء</button>
                    <button onClick={() => setShowNewCode(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-bold">إلغاء</button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {codes.map((c) => (
                  <div key={c.id} className={`border rounded-2xl p-4 transition-all ${c.active ? "border-[#D4EDA8] bg-white" : "border-gray-100 bg-gray-50 opacity-60"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
                          <Tag className="w-4 h-4 text-[#1F4A10]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-[#1F4A10] text-lg">{c.code}</span>
                            <button onClick={() => copyCode(c.code)} className="p-1 rounded text-[#4A5568]/40 hover:text-[#679632]">
                              {copied === c.code ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <p className="text-xs text-gray-400">ينتهي: {c.expiry}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-sm font-black ${c.type === "percent" ? "bg-[#D4EDA8] text-[#1F4A10]" : "bg-blue-100 text-blue-700"}`}>
                        {c.type === "percent" ? `${c.discount}%` : `${c.discount} ريال`}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>الاستخدام: {c.used} / {c.maxUses}</span>
                        <span>{Math.round((c.used / c.maxUses) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-gradient-to-l from-[#1F4A10] to-[#679632]"
                          style={{ width: `${Math.min((c.used / c.maxUses) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleCode(c.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${c.active ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                        {c.active ? "تعطيل" : "تفعيل"}
                      </button>
                      <button onClick={() => deleteCode(c.id)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          {tab === "notifications" && (
            <div className="grid md:grid-cols-5 gap-5">
              <div className="md:col-span-3 space-y-4">
                <div className="flex gap-2 p-3 bg-[#F6FAF0] rounded-xl">
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg">🤖 Android</span>
                  <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">🍎 iOS</span>
                  <span className="text-xs text-gray-500 my-auto">إشعارات تصل للمنصتين</span>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1F4A10] mb-2">المستهدفون</label>
                  <div className="flex gap-2">
                    <button onClick={() => { setNotifTarget("all"); setSelectedDrivers([]); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${notifTarget === "all" ? "border-[#1F4A10] bg-[#F6FAF0] text-[#1F4A10]" : "border-gray-200 text-gray-400"}`}>
                      <Users className="w-4 h-4" /> جميع السائقين
                    </button>
                    <button onClick={() => setNotifTarget("specific")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${notifTarget === "specific" ? "border-[#1F4A10] bg-[#F6FAF0] text-[#1F4A10]" : "border-gray-200 text-gray-400"}`}>
                      <Smartphone className="w-4 h-4" /> سائقون محددون
                    </button>
                  </div>
                </div>

                {notifTarget === "specific" && (
                  <div>
                    <label className="block text-sm font-bold text-[#1F4A10] mb-2">اختر السائقين</label>
                    <div className="border border-gray-200 rounded-xl max-h-40 overflow-y-auto">
                      {loadingDrivers ? (
                        <div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
                      ) : drivers.map((d) => {
                        const isSelected = selectedDrivers.some((s) => s.uuid === d.uuid);
                        return (
                          <label key={d.uuid} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#F6FAF0] border-b border-gray-50 last:border-0 ${isSelected ? "bg-[#F0F9E8]" : ""}`}>
                            <input type="checkbox" checked={isSelected}
                              onChange={() => setSelectedDrivers((p) => isSelected ? p.filter((s) => s.uuid !== d.uuid) : [...p, d])}
                              className="accent-[#679632]" />
                            <div className="w-7 h-7 rounded-lg bg-[#D4EDA8] flex items-center justify-center text-xs font-black text-[#1F4A10]">{d.name?.[0]}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#1F4A10] truncate">{d.name}</p>
                              <p className="text-xs text-gray-400">{d.phone}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    {selectedDrivers.length > 0 && (
                      <p className="text-xs text-[#679632] font-bold mt-1">تم اختيار {selectedDrivers.length} سائق</p>
                    )}
                  </div>
                )}

                <form onSubmit={sendNotif} className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold text-[#1F4A10] mb-1.5">عنوان الإشعار *</label>
                    <input value={notifTitle} onChange={(e) => { setNotifTitle(e.target.value); setSendErr(""); }}
                      placeholder="مثال: عرض خاص اليوم فقط..."
                      className="w-full text-sm border border-gray-200 rounded-xl p-3 outline-none focus:border-[#679632]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1F4A10] mb-1.5">نص الإشعار *</label>
                    <textarea rows={4} value={notifText} onChange={(e) => { setNotifText(e.target.value); setSendErr(""); }}
                      placeholder="اكتب نص الإشعار التسويقي..."
                      className="w-full text-sm border border-gray-200 rounded-xl p-3 outline-none focus:border-[#679632] resize-none" />
                    <p className="text-xs text-gray-400 mt-1">{notifText.length} حرف</p>
                  </div>

                  {sendErr && <p className="text-red-500 text-xs bg-red-50 p-2.5 rounded-xl">{sendErr}</p>}
                  {sent && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-bold">
                      <Check className="w-4 h-4" /> تم إرسال الإشعار بنجاح! 🎉
                    </div>
                  )}

                  <button type="submit" disabled={!notifText.trim() || !notifTitle.trim() || sending}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#2A5A14] text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#1F4A10]/20 disabled:opacity-50">
                    <Send className="w-4 h-4" />
                    {sending ? "جاري الإرسال..." : notifTarget === "all" ? `إرسال للجميع (${drivers.length} سائق)` : `إرسال لـ ${selectedDrivers.length} سائق`}
                  </button>
                </form>
              </div>

              {/* Templates */}
              <div className="md:col-span-2 space-y-3">
                <p className="font-bold text-[#1F4A10] text-sm">قوالب تسويقية جاهزة</p>
                {notifTemplates.map((t, i) => (
                  <button key={i} onClick={() => { setNotifTitle(t.label.replace(/[🎉🚛📲👋]/g, "").trim()); setNotifText(t.text); }}
                    className="w-full text-right px-4 py-3 rounded-xl border border-gray-100 bg-[#F6FAF0] hover:border-[#679632] hover:bg-[#D4EDA8]/30 transition-all text-sm text-[#4A5568]">
                    <span className="font-bold text-[#679632] block text-xs mb-0.5">{t.label}</span>
                    {t.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
