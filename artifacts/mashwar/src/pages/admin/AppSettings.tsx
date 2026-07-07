import { useState, useEffect } from "react";
import { getTerms, editTerms, getMaxDistance, updateMaxDistance } from "@/lib/meshwarApi";
import { Settings, RefreshCw, Check, AlertCircle } from "lucide-react";

export default function AppSettings() {
  const [terms, setTerms] = useState("");
  const [maxDist, setMaxDist] = useState<number | "">("");
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [loadingDist, setLoadingDist] = useState(true);
  const [savingTerms, setSavingTerms] = useState(false);
  const [savingDist, setSavingDist] = useState(false);
  const [toastTerms, setToastTerms] = useState("");
  const [toastDist, setToastDist] = useState("");
  const [errTerms, setErrTerms] = useState("");
  const [errDist, setErrDist] = useState("");

  const showToast = (setter: (v: string) => void, msg: string) => {
    setter(msg);
    setTimeout(() => setter(""), 3000);
  };

  useEffect(() => {
    getTerms()
      .then((r) => setTerms(r.data?.terms ?? ""))
      .catch(() => setErrTerms("تعذّر تحميل الشروط"))
      .finally(() => setLoadingTerms(false));

    getMaxDistance()
      .then((r) => setMaxDist(r.data?.max_distance ?? ""))
      .catch(() => setErrDist("تعذّر تحميل الإعداد"))
      .finally(() => setLoadingDist(false));
  }, []);

  const saveTerms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTerms(true); setErrTerms("");
    try {
      await editTerms(terms);
      showToast(setToastTerms, "✅ تم حفظ الشروط بنجاح");
    } catch (e: unknown) {
      setErrTerms(e instanceof Error ? e.message : String(e));
    } finally {
      setSavingTerms(false);
    }
  };

  const saveMaxDist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maxDist) return;
    setSavingDist(true); setErrDist("");
    try {
      await updateMaxDistance(Number(maxDist));
      showToast(setToastDist, "✅ تم حفظ الإعداد بنجاح");
    } catch (e: unknown) {
      setErrDist(e instanceof Error ? e.message : String(e));
    } finally {
      setSavingDist(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">الإعدادات العامة</h2>
        <p className="text-sm text-gray-500 mt-0.5">ضبط إعدادات التطبيق والسياسات</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Max Distance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#1F4A10]" />
            </div>
            <div>
              <h3 className="font-heading font-black text-[#1F4A10]">أقصى مسافة للسيارات</h3>
              <p className="text-xs text-gray-400">الحد الأقصى لنطاق البحث عن السائقين</p>
            </div>
          </div>

          {loadingDist ? (
            <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <form onSubmit={saveMaxDist} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">المسافة بالكيلومترات</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number" min={1} max={500} value={maxDist}
                    onChange={(e) => setMaxDist(Number(e.target.value))}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-lg font-heading font-black text-[#1F4A10] outline-none focus:border-[#679632]"
                  />
                  <span className="text-gray-400 text-sm font-bold">كم</span>
                </div>
              </div>

              <div className="bg-[#F6FAF0] rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#679632] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-500">سيؤثر هذا الإعداد على نطاق البحث عن السائقين المتاحين عند طلب رحلة جديدة.</p>
              </div>

              {errDist && <p className="text-red-500 text-xs">{errDist}</p>}
              {toastDist && <p className="text-green-600 text-xs font-bold">{toastDist}</p>}

              <button type="submit" disabled={savingDist || !maxDist}
                className="w-full py-3 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> {savingDist ? "جاري الحفظ..." : "حفظ الإعداد"}
              </button>
            </form>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-heading font-black text-[#1F4A10] mb-4">إجراءات سريعة</h3>
          <div className="space-y-3">
            {[
              { label: "مسح ذاكرة التخزين المؤقت", desc: "إعادة تحميل البيانات من الخادم", color: "text-amber-600 bg-amber-50 hover:bg-amber-100" },
              { label: "تقرير الأداء اليومي", desc: "تصدير إحصائيات اليوم", color: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
              { label: "نسخ احتياطي", desc: "إنشاء نسخة احتياطية للبيانات", color: "text-purple-600 bg-purple-50 hover:bg-purple-100" },
            ].map((a) => (
              <button key={a.label} className={`w-full text-right p-3.5 rounded-xl ${a.color} transition-colors`}>
                <p className="font-bold text-sm">{a.label}</p>
                <p className="text-xs opacity-70 mt-0.5">{a.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-[#1F4A10]" />
          </div>
          <div>
            <h3 className="font-heading font-black text-[#1F4A10]">الشروط والأحكام</h3>
            <p className="text-xs text-gray-400">نص الشروط الظاهر للمستخدمين عند التسجيل</p>
          </div>
        </div>

        {loadingTerms ? (
          <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <form onSubmit={saveTerms} className="space-y-4">
            <textarea
              value={terms} onChange={(e) => setTerms(e.target.value)}
              rows={12}
              placeholder="اكتب الشروط والأحكام هنا..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] resize-none leading-relaxed"
            />
            <div className="flex items-center gap-3 justify-between">
              <p className="text-xs text-gray-400">{terms.length} حرف</p>
              <div className="flex items-center gap-3">
                {errTerms && <p className="text-red-500 text-xs">{errTerms}</p>}
                {toastTerms && <p className="text-green-600 text-xs font-bold">{toastTerms}</p>}
                <button type="submit" disabled={savingTerms}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] disabled:opacity-50 transition-colors">
                  <Check className="w-4 h-4" /> {savingTerms ? "جاري الحفظ..." : "حفظ الشروط"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
