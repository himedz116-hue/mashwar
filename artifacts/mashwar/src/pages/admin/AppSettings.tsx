import { useState, useEffect } from "react";
import { getTerms, editTerms, getMaxDistance, updateMaxDistance } from "@/lib/meshwarApi";
import {
  Settings, RefreshCw, Check, AlertCircle, Smartphone, Apple,
  Link, Globe, Shield, Info, Phone, Mail, MapPin, ExternalLink,
  Star, Download,
} from "lucide-react";

interface AppLink {
  android: string;
  ios: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  website: string;
}

function SectionCard({ title, description, icon: Icon, children }: {
  title: string; description: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-[#1F4A10]" />
        </div>
        <div>
          <h3 className="font-heading font-black text-[#1F4A10]">{title}</h3>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function AppSettings() {
  // Terms
  const [terms, setTerms] = useState("");
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [savingTerms, setSavingTerms] = useState(false);
  const [toastTerms, setToastTerms] = useState("");
  const [errTerms, setErrTerms] = useState("");

  // Privacy policy (separate text)
  const [privacy, setPrivacy] = useState("");
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [toastPrivacy, setToastPrivacy] = useState("");

  // Max distance (inside city)
  const [insideMaxKm, setInsideMaxKm] = useState<number | "">("");
  const [loadingDist, setLoadingDist] = useState(true);
  const [savingDist, setSavingDist] = useState(false);
  const [toastDist, setToastDist] = useState("");
  const [errDist, setErrDist] = useState("");

  // App links
  const [appLinks, setAppLinks] = useState<AppLink>({
    android: "https://play.google.com/store/apps/details?id=com.meshwar.app",
    ios: "https://apps.apple.com/app/meshwar/id123456789",
  });
  const [savingLinks, setSavingLinks] = useState(false);
  const [toastLinks, setToastLinks] = useState("");

  // Contact info
  const [contact, setContact] = useState<ContactInfo>({
    email: "support@meshwars.net",
    phone: "+966500000000",
    address: "المملكة العربية السعودية، الرياض",
    website: "https://meshwars.net",
  });
  const [savingContact, setSavingContact] = useState(false);
  const [toastContact, setToastContact] = useState("");

  const showToast = (setter: (v: string) => void, msg: string) => {
    setter(msg);
    setTimeout(() => setter(""), 3000);
  };

  useEffect(() => {
    getTerms()
      .then((r) => {
        const t = r.data?.terms ?? "";
        // Try to split if privacy policy is embedded with a separator
        const parts = t.split("\n---PRIVACY---\n");
        setTerms(parts[0] ?? "");
        setPrivacy(parts[1] ?? "");
      })
      .catch(() => setErrTerms("تعذّر تحميل الشروط"))
      .finally(() => setLoadingTerms(false));

    getMaxDistance()
      .then((r) => setInsideMaxKm(Number(r.data?.inside_max_km) || ""))
      .catch(() => setErrDist("تعذّر تحميل الإعداد"))
      .finally(() => setLoadingDist(false));

    // Load app links & contact from localStorage (persisted locally — no backend endpoint for these)
    try {
      const savedLinks = localStorage.getItem("meshwar_app_links");
      if (savedLinks) setAppLinks({ ...appLinks, ...JSON.parse(savedLinks) });
    } catch { /* ignore malformed value */ }
    try {
      const savedContact = localStorage.getItem("meshwar_contact");
      if (savedContact) setContact({ ...contact, ...JSON.parse(savedContact) });
    } catch { /* ignore malformed value */ }
  }, []);

  const saveTerms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTerms(true); setErrTerms("");
    try {
      const combined = privacy ? `${terms}\n---PRIVACY---\n${privacy}` : terms;
      await editTerms(combined);
      showToast(setToastTerms, "✅ تم حفظ الشروط بنجاح");
    } catch (e: unknown) {
      setErrTerms(e instanceof Error ? e.message : String(e));
    } finally { setSavingTerms(false); }
  };

  const savePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrivacy(true);
    try {
      const combined = privacy ? `${terms}\n---PRIVACY---\n${privacy}` : terms;
      await editTerms(combined);
      showToast(setToastPrivacy, "✅ تم حفظ سياسة الخصوصية");
    } catch { /* ignore */ }
    finally { setSavingPrivacy(false); }
  };

  const saveMaxDist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insideMaxKm) return;
    setSavingDist(true); setErrDist("");
    try {
      await updateMaxDistance(Number(insideMaxKm));
      showToast(setToastDist, "✅ تم حفظ الإعداد بنجاح");
    } catch (e: unknown) {
      setErrDist(e instanceof Error ? e.message : String(e));
    } finally { setSavingDist(false); }
  };

  const saveLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLinks(true);
    await new Promise((r) => setTimeout(r, 600));
    localStorage.setItem("meshwar_app_links", JSON.stringify(appLinks));
    showToast(setToastLinks, "✅ تم حفظ روابط التطبيق");
    setSavingLinks(false);
  };

  const saveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    await new Promise((r) => setTimeout(r, 600));
    localStorage.setItem("meshwar_contact", JSON.stringify(contact));
    showToast(setToastContact, "✅ تم حفظ معلومات التواصل");
    setSavingContact(false);
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-black text-[#1F4A10]">الإعدادات العامة</h2>
          <p className="text-sm text-gray-500 mt-0.5">ضبط إعدادات التطبيق على Android و iOS</p>
        </div>
        {/* Platform badges */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 border border-green-200">
            <Smartphone className="w-4 h-4 text-green-700" />
            <span className="text-xs font-bold text-green-700">Android</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
            <Apple className="w-4 h-4 text-gray-700" />
            <span className="text-xs font-bold text-gray-700">iOS</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Max Distance — matches mobile app "الحد الأقصى" screen */}
        <SectionCard title="الحد الأقصى للمسافة" description="الحد الأقصى لمسافة داخل المدينة" icon={MapPin}>
          {loadingDist ? (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={saveMaxDist} className="space-y-4">
              {/* Field row: label on right, "كيلو متر" unit badge on left — mirrors mobile screenshot */}
              <div className="flex items-stretch border border-[#679632] rounded-xl overflow-hidden">
                <div className="flex-1 px-4 py-4">
                  <label className="block text-xs text-gray-400 mb-1">الحد الأقصى للمسافة داخل المدينة</label>
                  <input
                    type="number" min={1} max={999} value={insideMaxKm}
                    onChange={(e) => {
                      const v = e.target.value;
                      setInsideMaxKm(v === "" ? "" : Number(v));
                    }}
                    className="w-full text-base font-bold text-[#1F4A10] outline-none bg-transparent"
                    placeholder="40"
                  />
                </div>
                <div className="flex items-center justify-center px-4 border-r border-[#679632] bg-[#F6FAF0]">
                  <span className="text-sm font-bold text-[#1F4A10] whitespace-nowrap">كيلو متر</span>
                </div>
              </div>

              {errDist && (
                <div className="flex items-center gap-2 text-red-500 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errDist}
                </div>
              )}
              {toastDist && <p className="text-green-600 text-xs font-bold text-center">{toastDist}</p>}

              <button
                type="submit"
                disabled={savingDist || !insideMaxKm}
                className="w-full py-3.5 rounded-xl bg-[#679632] text-white font-bold text-base hover:bg-[#4f7226] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {savingDist ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> جاري الحفظ...</>
                ) : "تغيير"}
              </button>
            </form>
          )}
        </SectionCard>

        {/* App Store Links */}
        <SectionCard title="روابط متجر التطبيق" description="روابط تنزيل التطبيق على المنصتين" icon={Link}>
          <form onSubmit={saveLinks} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-green-600" /> رابط Google Play (Android)
              </label>
              <input
                type="url" value={appLinks.android}
                onChange={(e) => setAppLinks((p) => ({ ...p, android: e.target.value }))}
                placeholder="https://play.google.com/store/apps/details?id=..."
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
              />
              {appLinks.android && (
                <a href={appLinks.android} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#679632] hover:underline mt-1">
                  <ExternalLink className="w-3 h-3" /> فتح الرابط
                </a>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-gray-600" /> رابط App Store (iOS)
              </label>
              <input
                type="url" value={appLinks.ios}
                onChange={(e) => setAppLinks((p) => ({ ...p, ios: e.target.value }))}
                placeholder="https://apps.apple.com/app/meshwar/..."
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
              />
              {appLinks.ios && (
                <a href={appLinks.ios} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#679632] hover:underline mt-1">
                  <ExternalLink className="w-3 h-3" /> فتح الرابط
                </a>
              )}
            </div>

            {/* Preview badges */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#F6FAF0] rounded-xl border border-[#D4EDA8]">
              <div className="flex items-center gap-2 bg-black text-white rounded-xl px-3 py-2">
                <Download className="w-4 h-4" />
                <div>
                  <p className="text-[9px] opacity-70">تنزيل من</p>
                  <p className="text-xs font-bold">Google Play</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black text-white rounded-xl px-3 py-2">
                <Apple className="w-4 h-4" />
                <div>
                  <p className="text-[9px] opacity-70">تنزيل من</p>
                  <p className="text-xs font-bold">App Store</p>
                </div>
              </div>
            </div>

            {toastLinks && <p className="text-green-600 text-xs font-bold">{toastLinks}</p>}
            <button type="submit" disabled={savingLinks}
              className="w-full py-3 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> {savingLinks ? "جاري الحفظ..." : "حفظ الروابط"}
            </button>
          </form>
        </SectionCard>

        {/* Contact Info */}
        <SectionCard title="معلومات التواصل" description="بيانات الدعم والتواصل الظاهرة في التطبيق" icon={Phone}>
          <form onSubmit={saveContact} className="space-y-3">
            {[
              { label: "البريد الإلكتروني للدعم", key: "email" as const, type: "email", icon: Mail, placeholder: "support@meshwars.net" },
              { label: "رقم الهاتف", key: "phone" as const, type: "tel", icon: Phone, placeholder: "+966500000000" },
              { label: "الموقع الإلكتروني", key: "website" as const, type: "url", icon: Globe, placeholder: "https://meshwars.net" },
              { label: "العنوان", key: "address" as const, type: "text", icon: MapPin, placeholder: "المملكة العربية السعودية..." },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1.5">
                  <f.icon className="w-3.5 h-3.5 text-[#679632]" /> {f.label}
                </label>
                <input
                  type={f.type} value={contact[f.key]}
                  onChange={(e) => setContact((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]"
                />
              </div>
            ))}
            {toastContact && <p className="text-green-600 text-xs font-bold">{toastContact}</p>}
            <button type="submit" disabled={savingContact}
              className="w-full py-3 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> {savingContact ? "جاري الحفظ..." : "حفظ معلومات التواصل"}
            </button>
          </form>
        </SectionCard>

        {/* App Info */}
        <SectionCard title="معلومات التطبيق" description="بيانات الإصدار والنسخة" icon={Info}>
          <div className="space-y-3">
            {[
              { label: "اسم التطبيق", value: "مشوار - خدمة نقل البضائع" },
              { label: "الإصدار الحالي", value: "v2.0.0" },
              { label: "منصة Android", value: "مدعوم ✅" },
              { label: "منصة iOS", value: "مدعوم ✅" },
              { label: "الخادم", value: "meshwarsv2.meshwars.net" },
              { label: "البيئة", value: "Production" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-400 font-medium">{row.label}</span>
                <span className="text-xs font-bold text-[#1F4A10]">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Platform rating */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-3 text-white text-center">
              <Smartphone className="w-6 h-6 mx-auto mb-1" />
              <p className="font-black text-sm">Android</p>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3 fill-white text-white" />)}
              </div>
              <p className="text-[10px] opacity-80 mt-0.5">Google Play Store</p>
            </div>
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-3 text-white text-center">
              <Apple className="w-6 h-6 mx-auto mb-1" />
              <p className="font-black text-sm">iOS</p>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3 fill-white text-white" />)}
              </div>
              <p className="text-[10px] opacity-80 mt-0.5">Apple App Store</p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Terms */}
      <SectionCard title="الشروط والأحكام" description="نص الشروط الظاهر للمستخدمين عند التسجيل" icon={Shield}>
        {loadingTerms ? (
          <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <form onSubmit={saveTerms} className="space-y-4">
            <textarea
              value={terms} onChange={(e) => setTerms(e.target.value)}
              rows={10}
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
      </SectionCard>

      {/* Privacy Policy */}
      <SectionCard title="سياسة الخصوصية" description="نص سياسة الخصوصية الظاهر في التطبيق على Android و iOS" icon={Shield}>
        <form onSubmit={savePrivacy} className="space-y-4">
          <textarea
            value={privacy} onChange={(e) => setPrivacy(e.target.value)}
            rows={10}
            placeholder="اكتب سياسة الخصوصية هنا..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] resize-none leading-relaxed"
          />
          <div className="flex items-center gap-3 justify-between">
            <p className="text-xs text-gray-400">{privacy.length} حرف</p>
            <div className="flex items-center gap-3">
              {toastPrivacy && <p className="text-green-600 text-xs font-bold">{toastPrivacy}</p>}
              <button type="submit" disabled={savingPrivacy}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] disabled:opacity-50 transition-colors">
                <Check className="w-4 h-4" /> {savingPrivacy ? "جاري الحفظ..." : "حفظ السياسة"}
              </button>
            </div>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
