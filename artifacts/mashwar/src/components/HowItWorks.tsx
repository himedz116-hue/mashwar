import { motion } from "framer-motion";

const steps = [
  {
    num: "١",
    title: "حدد موقعك",
    desc: "افتح التطبيق وحدد نقطة الاستلام والتسليم على الخريطة التفاعلية بدقة متناهية.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#679632" fillOpacity="0.2" stroke="#679632" strokeWidth="1.5"/>
        <circle cx="12" cy="9" r="2.5" fill="#679632"/>
      </svg>
    ),
  },
  {
    num: "٢",
    title: "اختر مركبتك",
    desc: "حدد نوع المركبة المناسب لحمولتك وشاهد السعر التقديري مباشرة قبل التأكيد.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="7" width="13" height="9" rx="1" fill="#679632" fillOpacity="0.2" stroke="#679632" strokeWidth="1.5"/>
        <path d="M14 10h4l3 4v2h-7V10z" fill="#679632" fillOpacity="0.2" stroke="#679632" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="5.5" cy="17.5" r="1.5" fill="#679632"/>
        <circle cx="18.5" cy="17.5" r="1.5" fill="#679632"/>
      </svg>
    ),
  },
  {
    num: "٣",
    title: "تتبع شحنتك",
    desc: "تابع مسار السائق لحظة بلحظة حتى وصول شحنتك بسلام إلى وجهتها.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#679632" fillOpacity="0.2" stroke="#679632" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#679632" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#EFF7E8] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full bg-[#99C169]/20 blur-[80px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#679632]/15 blur-[70px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-[#679632]/15 text-[#679632] text-sm font-bold mb-4 border border-[#679632]/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            سهل وسريع
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#000201] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            ثلاث خطوات فقط
            <span className="text-[#679632]"> للنقل</span>
          </motion.h2>
          <motion.p
            className="text-[#000201]/55 text-base md:text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            صممنا التجربة لتكون الأسهل والأسرع حتى تُنجز مهامك بدون أي تعقيد.
          </motion.p>
        </div>

        {/* ── Mobile: vertical timeline ── */}
        <div className="md:hidden flex flex-col gap-0 relative">
          {/* Vertical connecting line */}
          <div className="absolute right-[38px] top-14 bottom-14 w-0.5 bg-gradient-to-b from-[#679632]/40 via-[#679632]/25 to-transparent pointer-events-none" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex items-start gap-5 relative pb-8 last:pb-0"
            >
              {/* Step circle on the right (RTL) */}
              <div className="flex flex-col items-center relative z-10 shrink-0">
                <div className="w-[76px] h-[76px] rounded-2xl bg-white border-2 border-[#679632]/25 flex flex-col items-center justify-center shadow-lg shadow-[#679632]/10">
                  <div className="mb-1">{step.icon}</div>
                  <span className="text-[#679632] text-xs font-black">{step.num}</span>
                </div>
              </div>

              {/* Text block */}
              <div className="flex-1 pt-3 text-right">
                <h3 className="text-xl font-heading font-black text-[#000201] mb-1.5">{step.title}</h3>
                <p className="text-[#000201]/55 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Desktop: horizontal grid ── */}
        <div className="hidden md:block relative">
          {/* Horizontal dashed line */}
          <div className="absolute top-14 right-[20%] left-[20%] h-px border-t-2 border-dashed border-[#679632]/30 z-0" />
          <div className="grid grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 rounded-full bg-white border-2 border-[#679632]/30 flex flex-col items-center justify-center mb-6 shadow-lg shadow-[#679632]/10">
                  <div className="mb-1">{step.icon}</div>
                  <span className="text-[#679632] text-sm font-bold">{step.num}</span>
                </div>
                <h3 className="text-2xl font-heading font-black text-[#000201] mb-3">{step.title}</h3>
                <p className="text-[#000201]/55 leading-relaxed text-sm max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
