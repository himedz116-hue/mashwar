import { useState } from "react";
import { Tag, Plus, Send, Trash2, Copy, Check } from "lucide-react";

interface PromoCode {
  id: number;
  code: string;
  discount: number;
  type: "fixed" | "percent";
  maxUses: number;
  used: number;
  expiry: string;
  active: boolean;
}

const initialCodes: PromoCode[] = [
  { id: 1, code: "MASHWAR20", discount: 20, type: "percent", maxUses: 500, used: 213, expiry: "2024-08-31", active: true },
  { id: 2, code: "WELCOME15", discount: 15, type: "fixed", maxUses: 100, used: 87, expiry: "2024-07-31", active: true },
  { id: 3, code: "SUMMER10", discount: 10, type: "percent", maxUses: 200, used: 200, expiry: "2024-07-01", active: false },
  { id: 4, code: "NEWUSER50", discount: 50, type: "fixed", maxUses: 50, used: 12, expiry: "2024-09-30", active: true },
];

const notifTemplates = [
  { label: "عرض خاص", text: "🎉 احصل على خصم 20% على رحلتك القادمة مع مشوار! استخدم الكود: MASHWAR20" },
  { label: "تذكير", text: "🚛 مشوار - خدمة النقل الأسرع في القصيم. اطلب الآن!" },
  { label: "تحديث التطبيق", text: "📲 تحديث جديد متاح! حدّث تطبيق مشوار للحصول على أفضل تجربة." },
];

export default function Marketing() {
  const [codes, setCodes] = useState(initialCodes);
  const [tab, setTab] = useState<"promo" | "notifications">("promo");
  const [showNewCode, setShowNewCode] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [notifText, setNotifText] = useState("");
  const [notifTarget, setNotifTarget] = useState("all");
  const [newCode, setNewCode] = useState({ code: "", discount: "", type: "percent", maxUses: "", expiry: "" });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleCode = (id: number) => {
    setCodes((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCode = (id: number) => {
    setCodes((prev) => prev.filter((c) => c.id !== id));
  };

  const addCode = () => {
    if (!newCode.code || !newCode.discount) return;
    setCodes((prev) => [...prev, {
      id: Date.now(), code: newCode.code.toUpperCase(), discount: parseFloat(newCode.discount),
      type: newCode.type as "fixed" | "percent", maxUses: parseInt(newCode.maxUses) || 100,
      used: 0, expiry: newCode.expiry, active: true,
    }]);
    setNewCode({ code: "", discount: "", type: "percent", maxUses: "", expiry: "" });
    setShowNewCode(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">التسويق والعروض</h2>
        <p className="text-[#4A5568]/60 text-sm mt-1">إدارة أكواد الخصم وإرسال الإشعارات للمستخدمين</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "أكواد نشطة", value: codes.filter((c) => c.active).length, color: "#1F4A10" },
          { label: "إجمالي الاستخدامات", value: codes.reduce((s, c) => s + c.used, 0), color: "#679632" },
          { label: "قيمة الخصومات (ريال)", value: "2,180", color: "#F59E0B" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#4A5568]/60 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { key: "promo", label: "أكواد الخصم" },
            { key: "notifications", label: "الإشعارات الجماعية" },
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
          {tab === "promo" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#4A5568]/60">{codes.length} كود مسجّل</p>
                <button
                  onClick={() => setShowNewCode(!showNewCode)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors"
                >
                  <Plus className="w-4 h-4" /> إنشاء كود
                </button>
              </div>

              {showNewCode && (
                <div className="bg-[#F6FAF0] border border-[#3D6B2C]/15 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-[#1F4A10] text-sm">كود خصم جديد</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-[#4A5568]/60 mb-1 block">الكود</label>
                      <input value={newCode.code} onChange={(e) => setNewCode((p) => ({ ...p, code: e.target.value }))}
                        placeholder="MASHWAR50" className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#679632] uppercase" />
                    </div>
                    <div>
                      <label className="text-xs text-[#4A5568]/60 mb-1 block">قيمة الخصم</label>
                      <input type="number" value={newCode.discount} onChange={(e) => setNewCode((p) => ({ ...p, discount: e.target.value }))}
                        placeholder="20" className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#679632]" />
                    </div>
                    <div>
                      <label className="text-xs text-[#4A5568]/60 mb-1 block">نوع الخصم</label>
                      <select value={newCode.type} onChange={(e) => setNewCode((p) => ({ ...p, type: e.target.value }))}
                        className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#679632] bg-white">
                        <option value="percent">نسبة مئوية (%)</option>
                        <option value="fixed">مبلغ ثابت (ريال)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#4A5568]/60 mb-1 block">أقصى استخدامات</label>
                      <input type="number" value={newCode.maxUses} onChange={(e) => setNewCode((p) => ({ ...p, maxUses: e.target.value }))}
                        placeholder="100" className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#679632]" />
                    </div>
                    <div>
                      <label className="text-xs text-[#4A5568]/60 mb-1 block">تاريخ الانتهاء</label>
                      <input type="date" value={newCode.expiry} onChange={(e) => setNewCode((p) => ({ ...p, expiry: e.target.value }))}
                        className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#679632]" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addCode} className="px-4 py-2 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-colors">إنشاء</button>
                    <button onClick={() => setShowNewCode(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-bold hover:bg-gray-200 transition-colors">إلغاء</button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {codes.map((c) => (
                  <div key={c.id} className={`border rounded-2xl p-4 transition-all ${c.active ? "border-[#3D6B2C]/15 bg-white" : "border-gray-100 bg-gray-50 opacity-60"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
                          <Tag className="w-4 h-4 text-[#1F4A10]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-[#1F4A10]">{c.code}</span>
                            <button onClick={() => copyCode(c.code)} className="p-1 rounded text-[#4A5568]/40 hover:text-[#679632] transition-colors">
                              {copied === c.code ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <p className="text-xs text-[#4A5568]/50">ينتهي: {c.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-xl text-sm font-black ${c.type === "percent" ? "bg-[#D4EDA8] text-[#1F4A10]" : "bg-blue-100 text-blue-700"}`}>
                          {c.type === "percent" ? `${c.discount}%` : `${c.discount} ريال`}
                        </span>
                      </div>
                    </div>
                    {/* Usage bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-[#4A5568]/60 mb-1">
                        <span>الاستخدام: {c.used} / {c.maxUses}</span>
                        <span>{Math.round((c.used / c.maxUses) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#679632]" style={{ width: `${Math.min((c.used / c.maxUses) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleCode(c.id)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${c.active ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                        {c.active ? "تعطيل" : "تفعيل"}
                      </button>
                      <button onClick={() => deleteCode(c.id)} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-bold text-[#1F4A10] mb-2">المستهدفون</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "all", label: "الجميع" },
                    { value: "customers", label: "العملاء فقط" },
                    { value: "drivers", label: "السائقون فقط" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setNotifTarget(opt.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                        notifTarget === opt.value ? "bg-[#1F4A10] text-white" : "bg-[#F6FAF0] text-[#679632] hover:bg-[#D4EDA8]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1F4A10] mb-2">قوالب جاهزة</label>
                <div className="space-y-2">
                  {notifTemplates.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setNotifText(t.text)}
                      className="w-full text-right px-4 py-3 rounded-xl border border-gray-100 bg-[#F6FAF0] hover:border-[#679632] hover:bg-[#D4EDA8]/30 transition-all text-sm text-[#4A5568]"
                    >
                      <span className="font-bold text-[#679632] block text-xs mb-0.5">{t.label}</span>
                      {t.text}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1F4A10] mb-2">نص الإشعار</label>
                <textarea
                  rows={4}
                  value={notifText}
                  onChange={(e) => setNotifText(e.target.value)}
                  placeholder="اكتب نص الإشعار الذي سيُرسَل للمستخدمين..."
                  className="w-full text-sm border border-gray-200 rounded-xl p-3 outline-none focus:border-[#679632] resize-none"
                />
                <p className="text-xs text-[#4A5568]/40 mt-1">{notifText.length} حرف</p>
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-l from-[#1F4A10] to-[#2A5A14] text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#1F4A10]/20"
                disabled={!notifText.trim()}
              >
                <Send className="w-4 h-4" /> إرسال الإشعار
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
