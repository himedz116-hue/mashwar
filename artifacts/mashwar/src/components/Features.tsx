import { motion } from "framer-motion";

const features = [
  {
    title: "تتبع مباشر",
    desc: "شاهد مسار مركبتك على الخريطة لحظة بلحظة من الانطلاق حتى الوصول.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: "سائقون موثقون",
    desc: "جميع السائقين مسجلون رسمياً وتم التحقق الكامل من هوياتهم وخلفياتهم.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "أسعار شفافة",
    desc: "لا مفاجآت ولا مزايدات. السعر النهائي يظهر لك قبل تأكيد الحجز بثوانٍ.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 15h4M14 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "دفع إلكتروني",
    desc: "بطاقات بنكية، مدى، آبل باي، أو نقداً — ادفع بالطريقة التي تفضلها.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 6v2m0 8v2M8.5 9.5a3.5 3.5 0 017 0c0 2-3.5 3-3.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "تقييم السائق",
    desc: "نظام تقييم شفاف يضمن لك أفضل سائق في كل رحلة، ويحفز التميز المستمر.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "دعم ٢٤/٧",
    desc: "فريق خدمة عملاء متواجد على مدار الساعة عبر المحادثة المباشرة لمساعدتك.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#F7FAF4] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-[#679632]/10 text-[#679632] text-sm font-bold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            لماذا مشوار؟
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-heading font-black text-[#000201] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            تجربة نقل
            <span className="text-[#679632]"> لا مثيل لها</span>
          </motion.h2>
          <motion.p
            className="text-[#000201]/55 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            كل تفصيلة في مشوار صُممت لتمنحك راحة البال من لحظة الحجز حتى التسليم.
          </motion.p>
        </div>

        {/* City buildings banner above the grid */}
        <motion.div
          className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-b from-[#EFF7E8] to-white border border-[#679632]/10 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-end justify-between px-8 md:px-16 pt-10 gap-6">
            {/* Building B on the left */}
            <div className="flex-shrink-0">
              <img
                src="/city-building-b.svg"
                alt=""
                aria-hidden="true"
                className="h-40 md:h-52 w-auto"
                style={{ filter: "saturate(0.5) brightness(0.9)" }}
              />
            </div>

            {/* Center text */}
            <div className="flex-1 text-center pb-10">
              <div className="text-4xl md:text-5xl font-heading font-black text-[#679632] mb-2">
                نصل لكل مكان
              </div>
              <p className="text-[#000201]/55 text-base md:text-lg max-w-sm mx-auto">
                سائقو مشوار منتشرون في جميع أحياء المدينة، دائماً قريبون منك.
              </p>
            </div>

            {/* Building A on the right */}
            <div className="flex-shrink-0">
              <img
                src="/city-building-a.svg"
                alt=""
                aria-hidden="true"
                className="h-40 md:h-52 w-auto"
                style={{ filter: "saturate(0.5) brightness(0.9)" }}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-7 border border-[#679632]/10 shadow-sm hover:shadow-lg hover:shadow-[#679632]/10 hover:border-[#679632]/25 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#679632]/10 text-[#679632] flex items-center justify-center mb-5 group-hover:bg-[#679632] group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-black text-[#000201] mb-3">{feature.title}</h3>
              <p className="text-[#000201]/55 leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
