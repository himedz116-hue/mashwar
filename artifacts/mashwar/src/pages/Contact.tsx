import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const contactDetails = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "البريد الإلكتروني",
    value: "mshwarsh@gmail.com",
    href: "mailto:mshwarsh@gmail.com",
    sub: "نرد خلال ٢٤ ساعة",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "رقم الجوال",
    value: "‎+966 50 219 9098",
    href: "tel:+966502199098",
    sub: "الأحد – الخميس، ٨ص – ١٠م",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "العنوان",
    value: "بريدة، حي الفلاح",
    href: "https://maps.google.com/?q=بريدة+حي+الفلاح",
    sub: "شارع عزيزة بنت مشرف",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    label: "الجهة المالكة",
    value: "مؤسسة عبدالعزيز لويفي الحربي",
    sub: "رقم موحد: 7054680967",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.phone.trim()) e.phone = "رقم الجوال مطلوب";
    else if (!/^\d{9,12}$/.test(form.phone.trim())) e.phone = "أدخل رقماً صحيحاً (٩–١٢ رقم)";
    if (!form.message.trim()) e.message = "الرسالة مطلوبة";
    else if (form.message.trim().length < 10) e.message = "الرسالة قصيرة جداً (١٠ أحرف على الأقل)";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    // Open mailto with pre-filled content
    const subject = encodeURIComponent(`رسالة من ${form.name} — مشوار`);
    const body = encodeURIComponent(
      `الاسم: ${form.name}\nرقم الجوال: +966${form.phone}\n\nالرسالة:\n${form.message}`
    );
    window.open(`mailto:mshwarsh@gmail.com?subject=${subject}&body=${body}`, "_blank");
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 600);
  };

  const handlePhone = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 12);
    setForm((f) => ({ ...f, phone: digits }));
    if (errors.phone) setErrors((e) => ({ ...e, phone: "" }));
  };

  return (
    <div className="min-h-screen bg-[#F6FAF0] font-body" dir="rtl">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-[#1F4A10] overflow-hidden pt-24 pb-28">
        {/* Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#679632]/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#D4EDA8]/8 blur-3xl" />
          {/* Dots grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
          <svg className="absolute bottom-0 left-0 right-0 w-full opacity-15" viewBox="0 0 1440 80" fill="none">
            <path d="M0 80L1440 0V80H0Z" fill="white" />
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-[#D4EDA8]/70 hover:text-[#D4EDA8] text-sm mb-10 transition-colors group">
            <svg className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            العودة للرئيسية
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4EDA8]/15 border border-[#D4EDA8]/25 text-[#D4EDA8] text-xs font-bold mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4EDA8] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4EDA8]" />
              </span>
              نرد على رسائلكم خلال ٢٤ ساعة
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight mb-4">
              تواصل <span className="text-[#D4EDA8]">معنا</span>
            </h1>
            <p className="text-white/60 text-lg max-w-lg leading-8">
              فريقنا مستعد للإجابة على جميع استفساراتكم. أرسل لنا رسالتك وسنتواصل معك في أقرب وقت.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="container mx-auto px-4 md:px-8 -mt-16 pb-20 relative z-10">
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── Contact details sidebar ── */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Info cards */}
            {contactDetails.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#3D6B2C]/10 p-5 shadow-sm hover:shadow-md hover:border-[#3D6B2C]/25 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#D4EDA8] text-[#1F4A10] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#4A5568]/60 text-xs mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                        className="font-bold text-[#1F4A10] hover:text-[#679632] transition-colors block truncate">
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-bold text-[#1F4A10] truncate">{item.value}</p>
                    )}
                    <p className="text-[#4A5568]/50 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Saudi Arabia visual card */}
            <div className="bg-[#1F4A10] rounded-2xl p-6 text-white overflow-hidden relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-[#679632]/20 blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  {/* Saudi flag */}
                  <div className="w-10 h-7 rounded-md overflow-hidden border border-white/20 flex-shrink-0 shadow-lg">
                    <div className="w-full h-full bg-[#006C35] flex items-center justify-center">
                      {/* Simplified Saudi emblem */}
                      <svg viewBox="0 0 30 20" className="w-full h-full">
                        <rect width="30" height="20" fill="#006C35"/>
                        <text x="15" y="14" textAnchor="middle" fontSize="9" fill="white" fontFamily="serif">☪</text>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-sm">المملكة العربية السعودية</p>
                    <p className="text-[#D4EDA8]/70 text-xs">Kingdom of Saudi Arabia</p>
                  </div>
                </div>
                <div className="h-px bg-white/10 mb-4" />
                <p className="text-[#D4EDA8] font-bold text-sm mb-1">مقرنا الرئيسي</p>
                <p className="text-white/70 text-xs leading-6">بريدة، منطقة القصيم<br />حي الفلاح، شارع عزيزة بنت مشرف</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-lg">📞</span>
                  <div>
                    <p className="text-[#D4EDA8]/60 text-[10px]">رمز الدولة</p>
                    <p className="font-black text-[#D4EDA8] text-lg tracking-wider">+٩٦٦</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Form card ── */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <div className="bg-white rounded-3xl border border-[#3D6B2C]/10 shadow-xl overflow-hidden">
              {/* Card header */}
              <div className="bg-gradient-to-l from-[#2A5A14] to-[#1F4A10] px-8 py-6">
                <h2 className="text-white font-heading font-black text-xl">أرسل رسالتك</h2>
                <p className="text-white/60 text-sm mt-1">جميع الحقول مطلوبة</p>
              </div>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    /* ── Success state ── */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-[#D4EDA8] flex items-center justify-center mb-6"
                      >
                        <svg className="w-10 h-10 text-[#1F4A10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <h3 className="text-2xl font-heading font-black text-[#1F4A10] mb-2">تم إرسال رسالتك!</h3>
                      <p className="text-[#4A5568]/70 text-sm leading-7 max-w-xs mb-8">
                        شكراً <strong className="text-[#1F4A10]">{form.name}</strong> على تواصلك معنا.
                        سيتواصل معك فريقنا على الرقم <strong className="text-[#679632] dir-ltr inline-block">‎+966 {form.phone}</strong> في أقرب وقت.
                      </p>
                      <button
                        onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", message: "" }); }}
                        className="px-6 py-3 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] transition-colors"
                      >
                        إرسال رسالة جديدة
                      </button>
                    </motion.div>
                  ) : (
                    /* ── Form ── */
                    <motion.form key="form" onSubmit={handleSubmit} noValidate className="space-y-6">
                      {/* Name */}
                      <div>
                        <label className="block text-[#1F4A10] font-bold text-sm mb-2">
                          الاسم الكامل
                          <span className="text-red-400 mr-1">*</span>
                        </label>
                        <div className={`relative flex items-center rounded-xl border-2 bg-[#F6FAF0] transition-all ${
                          errors.name ? "border-red-300" : form.name ? "border-[#679632]" : "border-[#3D6B2C]/15 focus-within:border-[#679632]"
                        }`}>
                          <span className="pr-4 text-[#4A5568]/40">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            placeholder="محمد عبدالله الأحمد"
                            value={form.name}
                            onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); if (errors.name) setErrors((er) => ({ ...er, name: "" })); }}
                            className="flex-1 bg-transparent py-3.5 pl-4 text-sm text-[#1F4A10] placeholder-[#4A5568]/30 outline-none"
                          />
                          {form.name && (
                            <span className="pl-4 text-[#679632]">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                        {errors.name && <p className="mt-1.5 text-red-500 text-xs flex items-center gap-1"><span>⚠</span>{errors.name}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-[#1F4A10] font-bold text-sm mb-2">
                          رقم الجوال
                          <span className="text-red-400 mr-1">*</span>
                        </label>
                        <div className={`relative flex items-stretch rounded-xl border-2 bg-[#F6FAF0] overflow-hidden transition-all ${
                          errors.phone ? "border-red-300" : form.phone.length >= 9 ? "border-[#679632]" : "border-[#3D6B2C]/15 focus-within:border-[#679632]"
                        }`}>
                          {/* Country code block */}
                          <div className="flex items-center gap-2 px-3 bg-[#1F4A10]/6 border-l-2 border-[#3D6B2C]/15 flex-shrink-0 select-none">
                            {/* Saudi flag SVG */}
                            <div className="w-7 h-5 rounded-sm overflow-hidden shadow-sm flex-shrink-0">
                              <svg viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                <rect width="28" height="20" fill="#006C35"/>
                                {/* Shahada text (simplified) */}
                                <text x="14" y="11" textAnchor="middle" fontSize="5.5" fill="white" fontFamily="Arial">لا إله إلا الله</text>
                                {/* Sword */}
                                <line x1="5" y1="14" x2="23" y2="14" stroke="white" strokeWidth="1.2" />
                                <polygon points="5,14 7,13 7,15" fill="white"/>
                              </svg>
                            </div>
                            <span className="font-black text-[#1F4A10] text-sm tracking-wide whitespace-nowrap" dir="ltr">+966</span>
                          </div>
                          {/* Input */}
                          <input
                            type="tel"
                            inputMode="numeric"
                            placeholder="5XXXXXXXX"
                            value={form.phone}
                            onChange={(e) => handlePhone(e.target.value)}
                            maxLength={12}
                            dir="ltr"
                            className="flex-1 bg-transparent py-3.5 px-4 text-sm text-[#1F4A10] placeholder-[#4A5568]/30 outline-none tracking-widest"
                          />
                          {/* Digit counter */}
                          <div className="flex items-center pl-3 pr-2">
                            <span className={`text-xs font-bold tabular-nums transition-colors ${
                              form.phone.length === 0 ? "text-[#4A5568]/30"
                              : form.phone.length < 9 ? "text-amber-400"
                              : "text-[#679632]"
                            }`}>
                              {form.phone.length}/12
                            </span>
                          </div>
                        </div>
                        {errors.phone && <p className="mt-1.5 text-red-500 text-xs flex items-center gap-1"><span>⚠</span>{errors.phone}</p>}
                        <p className="mt-1.5 text-[#4A5568]/50 text-xs">مثال: 05XXXXXXXX ← أدخل الأرقام بعد +966 مباشرةً</p>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-[#1F4A10] font-bold text-sm mb-2">
                          الرسالة
                          <span className="text-red-400 mr-1">*</span>
                        </label>
                        <div className={`relative rounded-xl border-2 bg-[#F6FAF0] transition-all ${
                          errors.message ? "border-red-300" : form.message.length >= 10 ? "border-[#679632]" : "border-[#3D6B2C]/15 focus-within:border-[#679632]"
                        }`}>
                          <textarea
                            rows={5}
                            placeholder="اكتب رسالتك هنا... نسعد بالإجابة على جميع استفساراتك"
                            value={form.message}
                            onChange={(e) => { setForm((f) => ({ ...f, message: e.target.value })); if (errors.message) setErrors((er) => ({ ...er, message: "" })); }}
                            className="w-full bg-transparent py-3.5 px-4 text-sm text-[#1F4A10] placeholder-[#4A5568]/30 outline-none resize-none leading-7"
                          />
                          <div className="flex justify-between items-center px-4 pb-3">
                            <span className={`text-xs font-bold ${form.message.length < 10 ? "text-[#4A5568]/30" : "text-[#679632]"}`}>
                              {form.message.length} حرف
                            </span>
                            {form.message.length >= 10 && (
                              <span className="text-[#679632] text-xs flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                ممتاز
                              </span>
                            )}
                          </div>
                        </div>
                        {errors.message && <p className="mt-1.5 text-red-500 text-xs flex items-center gap-1"><span>⚠</span>{errors.message}</p>}
                      </div>

                      {/* Privacy note */}
                      <div className="flex items-start gap-3 p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/10">
                        <svg className="w-4 h-4 text-[#679632] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <p className="text-[#4A5568]/70 text-xs leading-6">
                          بياناتك محمية لدينا ولن تُشارَك مع أي طرف ثالث.
                          اطّلع على{" "}
                          <Link href="/privacy" className="text-[#679632] font-bold hover:underline">سياسة الخصوصية</Link>.
                        </p>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-[#1F4A10] text-white font-heading font-black text-base hover:bg-[#2A5A14] active:scale-[0.99] transition-all shadow-lg shadow-[#1F4A10]/20 disabled:opacity-70 flex items-center justify-center gap-3"
                      >
                        {loading ? (
                          <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            جاري الإرسال...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            إرسال الرسالة
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
