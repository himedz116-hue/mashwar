import { motion } from "framer-motion";

const steps = [
  {
    num: "١",
    title: "حدد موقعك",
    desc: "افتح التطبيق وحدد نقطة الاستلام والتسليم على الخريطة التفاعلية بدقة متناهية.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#99C169" fillOpacity="0.3" stroke="#99C169" strokeWidth="1.5"/>
        <circle cx="12" cy="9" r="2.5" fill="#99C169"/>
      </svg>
    ),
  },
  {
    num: "٢",
    title: "اختر مركبتك",
    desc: "حدد نوع المركبة المناسب لحمولتك وشاهد السعر التقديري مباشرة قبل التأكيد.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M1 17l2-8h18l2 8H1z" fill="#99C169" fillOpacity="0.3" stroke="#99C169" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="6" cy="17" r="2" fill="#99C169"/>
        <circle cx="18" cy="17" r="2" fill="#99C169"/>
        <path d="M5 9V5h14v4" stroke="#99C169" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    num: "٣",
    title: "تتبع شحنتك",
    desc: "تابع مسار السائق لحظة بلحظة حتى وصول شحنتك بسلام إلى وجهتها.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#99C169" fillOpacity="0.3" stroke="#99C169" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#99C169" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#000201] relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#99C169 1px, transparent 1px), linear-gradient(90deg, #99C169 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#679632]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-[#679632]/20 text-[#99C169] text-sm font-bold mb-4 border border-[#679632]/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            سهل وسريع
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-heading font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            ثلاث خطوات فقط
            <span className="text-[#99C169]"> للنقل</span>
          </motion.h2>
          <motion.p
            className="text-white/50 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            صممنا التجربة لتكون الأسهل والأسرع حتى تُنجز مهامك بدون أي تعقيد.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting dashed line */}
          <div className="hidden md:block absolute top-14 right-[20%] left-[20%] h-px border-t-2 border-dashed border-[#99C169]/20 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <div className="w-28 h-28 rounded-full bg-[#0D1A0A] border-2 border-[#679632]/40 flex flex-col items-center justify-center mb-6 shadow-xl shadow-[#679632]/10">
                  <div className="mb-1">{step.icon}</div>
                  <span className="text-[#99C169] text-sm font-bold">{step.num}</span>
                </div>

                <h3 className="text-2xl font-heading font-black text-white mb-3">{step.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
