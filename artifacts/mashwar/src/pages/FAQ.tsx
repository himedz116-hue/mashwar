import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  {
    id: "general",
    label: "عام",
    icon: "💬",
    questions: [
      {
        q: "ما هي منصة مشوار؟",
        a: "مشوار هي منصة تقنية سعودية رائدة تربط بين العملاء الراغبين في نقل الأثاث والبضائع وبين السائقين المحترفين المعتمدين. نقدم تجربة نقل سلسة وموثوقة وآمنة من خلال تطبيق ذكي متاح على iOS و Android.",
      },
      {
        q: "في أي مناطق تعمل مشوار حالياً؟",
        a: "تعمل مشوار حالياً في بريدة والقصيم، ونعمل بسرعة على التوسع لتغطية مدن المملكة العربية السعودية الكبرى. تابعنا على وسائل التواصل الاجتماعي لمعرفة آخر أخبار التوسع.",
      },
      {
        q: "هل مشوار شركة نقل مباشرة؟",
        a: "لا. مشوار منصة تقنية وسيطة فقط، دورها ربط العملاء بالسائقين المستقلين وتنسيق العملية. السائقون مستقلون ويتحملون المسؤولية المباشرة عن تقديم خدمة النقل.",
      },
      {
        q: "كيف أتحقق من مصداقية مشوار؟",
        a: "مشوار مملوكة لمؤسسة عبدالعزيز لويفي الحربي، المسجلة في المملكة العربية السعودية برقم موحد: 7054680967. العنوان الرسمي: بريدة، حي الفلاح، شارع عزيزة بنت مشرف.",
      },
    ],
  },
  {
    id: "customer",
    label: "العملاء",
    icon: "👤",
    questions: [
      {
        q: "كيف أحجز مركبة عبر مشوار؟",
        a: "الأمر بسيط جداً: حمّل التطبيق ← سجّل حسابك ← حدد نقطة الاستلام والتسليم ← اختر المركبة المناسبة لحجم شحنتك ← أكّد الطلب وتابع السائق مباشرة. العملية تستغرق أقل من دقيقتين.",
      },
      {
        q: "ما أنواع المركبات المتاحة؟",
        a: "نوفر مجموعة متنوعة تشمل: الدباب (للطرود الصغيرة)، الونيت الصغير، الونيت الكبير، الشاحنة المتوسطة، والشاحنة الكبيرة — لتناسب كل احتياجات النقل.",
      },
      {
        q: "كيف يتم احتساب سعر الرحلة؟",
        a: "يُحتسب السعر تلقائياً بناءً على: نوع المركبة المختارة، المسافة بين الموقعين، حجم ووزن الشحنة، وطبيعة الطلب. ستظهر لك التكلفة الإجمالية قبل تأكيد الطلب دون أي رسوم مخفية.",
      },
      {
        q: "هل يمكنني تتبع سائقي في الوقت الفعلي؟",
        a: "نعم، بمجرد قبول السائق للطلب ستتمكن من متابعة موقعه بدقة على الخريطة في الوقت الفعلي حتى وصوله إليك وإتمام التسليم.",
      },
      {
        q: "ما طرق الدفع المتاحة؟",
        a: "ندعم الدفع النقدي، وبطاقات الصراف والائتمان (فيزا/ماستركارد)، إضافةً إلى المحافظ الرقمية المعتمدة. اختر الأنسب لك عند تأكيد الطلب.",
      },
      {
        q: "ماذا أفعل إذا تضررت بضاعتي أثناء النقل؟",
        a: "تواصل فوراً مع فريق الدعم عبر التطبيق أو الاتصال على الرقم الموضح. ننصحك بتوثيق حالة البضاعة بالصور قبل وأثناء تحميلها لتسريع مراجعة الحالة.",
      },
    ],
  },
  {
    id: "driver",
    label: "السائقون",
    icon: "🚛",
    questions: [
      {
        q: "كيف أسجل كسائق في مشوار؟",
        a: "حمّل التطبيق، اختر 'سجّل كسائق'، وارفع: الهوية الوطنية، رخصة القيادة، استمارة المركبة. سيراجع فريقنا طلبك خلال ٢-٣ أيام عمل ويُخبرك بالنتيجة.",
      },
      {
        q: "ما الحد الأدنى للعمر للتسجيل كسائق؟",
        a: "يجب أن يكون عمر السائق 21 عاماً أو أكثر، ويحمل رخصة قيادة سارية تتناسب مع نوع المركبة.",
      },
      {
        q: "كم أكسب من العمل على مشوار؟",
        a: "الأرباح متغيرة وتعتمد على عدد الرحلات المنفذة، نوع المركبة، المسافة، وتقييماتك. السائقون الأعلى تقييماً يحظون بأولوية في الطلبات ومضاعفات في أوقات الذروة.",
      },
      {
        q: "متى تُحوَّل أرباحي؟",
        a: "تُجمَع أرباحك وتُحوَّل إلى حسابك البنكي بشكل دوري وفق الجدول الزمني الموضح في التطبيق. يمكنك متابعة رصيدك ومعاملاتك بتفاصيل كاملة في لوحة تحكم السائق.",
      },
      {
        q: "هل يمكنني العمل بمركبة مستأجرة أو مملوكة لجهة أخرى؟",
        a: "نعم، يمكن العمل بمركبة مستأجرة بشرط تقديم وثيقة تفيد بأحقية استخدامها تجارياً. راجع قسم 'شروط السائقين' لمزيد من التفاصيل.",
      },
    ],
  },
  {
    id: "technical",
    label: "تقني",
    icon: "⚙️",
    questions: [
      {
        q: "على أي أجهزة يعمل تطبيق مشوار؟",
        a: "التطبيق متاح على iOS (آيفون) و Android بأحدث إصداراتهما. ننصح بتحديث التطبيق باستمرار للحصول على أفضل أداء وأحدث الميزات.",
      },
      {
        q: "لماذا يطلب التطبيق صلاحية الموقع في الخلفية؟",
        a: "صلاحية الموقع الجغرافي في الخلفية ضرورية للسائقين فقط لتتبع الرحلة بدقة وتحديث الموقع في الوقت الفعلي. العملاء يحتاجون الموقع أثناء استخدام التطبيق فقط لتحديد نقطة الاستلام.",
      },
      {
        q: "نسيت كلمة المرور. ماذا أفعل؟",
        a: "في شاشة تسجيل الدخول، اضغط على 'نسيت كلمة المرور'، وستصلك رسالة على رقم جوالك المسجل لإعادة تعيينها فوراً.",
      },
      {
        q: "كيف أحذف حسابي؟",
        a: "ادخل إلى الإعدادات > إدارة الحساب > حذف الحساب. يمكنك أيضاً إرسال طلب الحذف إلى mshwarsh@gmail.com مع ذكر بريدك ورقم جوالك المسجل.",
      },
    ],
  },
];

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen ? "border-[#3D6B2C]/30 shadow-md" : "border-[#3D6B2C]/10 hover:border-[#3D6B2C]/20"
      }`}
    >
      <button
        className="w-full flex items-center justify-between gap-4 p-5 text-right bg-white hover:bg-[#F6FAF0] transition-colors"
        onClick={onToggle}
      >
        <span className="font-bold text-[#1F4A10] text-sm leading-7 flex-1">{q}</span>
        <span
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isOpen ? "bg-[#1F4A10] text-[#D4EDA8] rotate-45" : "bg-[#F6FAF0] text-[#679632]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 bg-white border-t border-[#3D6B2C]/8">
              <p className="text-[#4A5568] text-sm leading-8 mt-4">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const current = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-[#F6FAF0] font-body" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#1F4A10] overflow-hidden pt-24 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#679632]/20 blur-3xl" />
          <div className="absolute -bottom-12 left-0 w-80 h-80 rounded-full bg-[#D4EDA8]/10 blur-3xl" />
          <svg className="absolute bottom-0 left-0 right-0 w-full opacity-10" viewBox="0 0 1440 80" fill="none">
            <path d="M0 80L1440 0V80H0Z" fill="white" />
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#D4EDA8]/70 hover:text-[#D4EDA8] text-sm mb-8 transition-colors group"
          >
            <svg className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            العودة للرئيسية
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#D4EDA8]/15 border border-[#D4EDA8]/25 flex items-center justify-center text-[#D4EDA8] flex-shrink-0">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4EDA8]/15 border border-[#D4EDA8]/25 text-[#D4EDA8] text-xs font-bold mb-3">
                مركز المساعدة
              </span>
              <h1 className="text-3xl md:text-5xl font-heading font-black text-white leading-tight mb-2">
                الأسئلة الشائعة
              </h1>
              <p className="text-white/60 text-sm">إجابات واضحة لكل استفساراتك حول مشوار</p>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-4">
            {[
              { label: "سؤال مُجاب", value: `${categories.reduce((acc, c) => acc + c.questions.length, 0)}+` },
              { label: "فئة", value: `${categories.length}` },
              { label: "وقت الرد", value: "< ٢٤ ساعة" },
            ].map((item, i) => (
              <div key={i} className="px-5 py-3 rounded-xl bg-white/8 border border-white/12 text-center">
                <p className="text-xl font-black text-[#D4EDA8]">{item.value}</p>
                <p className="text-white/50 text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Category sidebar */}
          <aside className="lg:w-64 flex-shrink-0 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-[#3D6B2C]/12 p-4 shadow-sm">
              <p className="text-[#1F4A10] font-heading font-black text-sm px-2 mb-3">التصنيفات</p>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all text-right ${
                      activeCategory === cat.id
                        ? "bg-[#1F4A10] text-white"
                        : "text-[#4A5568] hover:bg-[#D4EDA8]/30 hover:text-[#1F4A10]"
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className={`mr-auto text-xs px-2 py-0.5 rounded-full ${
                      activeCategory === cat.id ? "bg-white/20 text-white" : "bg-[#D4EDA8] text-[#1F4A10]"
                    }`}>
                      {cat.questions.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Still need help */}
            <div className="bg-[#1F4A10] rounded-2xl p-5 mt-5 text-white">
              <p className="text-lg mb-1">💬</p>
              <p className="font-heading font-black text-sm mb-1">لم تجد إجابتك؟</p>
              <p className="text-white/60 text-xs mb-4 leading-6">تواصل مع فريق الدعم وسنجيبك خلال ٢٤ ساعة</p>
              <a
                href="mailto:mshwarsh@gmail.com"
                className="block text-center bg-[#D4EDA8] text-[#1F4A10] rounded-xl py-2.5 text-sm font-black hover:bg-white transition-colors"
              >
                راسلنا
              </a>
              <a
                href="tel:+966502199098"
                className="mt-2 block text-center bg-white/10 border border-white/20 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-white/20 transition-colors"
              >
                اتصل بنا
              </a>
            </div>
          </aside>

          {/* Questions */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{current.icon}</span>
                <h2 className="text-xl font-heading font-black text-[#1F4A10]">{current.label}</h2>
                <span className="text-xs px-3 py-1 rounded-full bg-[#D4EDA8] text-[#1F4A10] font-bold">
                  {current.questions.length} أسئلة
                </span>
              </div>

              <div className="space-y-3">
                {current.questions.map((item, i) => (
                  <FAQItem
                    key={i}
                    q={item.q}
                    a={item.a}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
