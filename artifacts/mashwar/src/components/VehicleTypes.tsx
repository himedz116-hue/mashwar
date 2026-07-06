import { motion } from "framer-motion";

const vehicles = [
  {
    id: "wanette",
    name: "وانيت",
    en: "Pickup Truck",
    desc: "مناسب لنقل الأغراض الخفيفة والطرود والمشاوير السريعة داخل المدينة.",
    capacity: "حتى ١ طن",
    img: "/vehicle-pickup.png",
    accent: "#99C169",
    cardBg: "from-[#f4fbec] to-white",
  },
  {
    id: "satha",
    name: "سطحة",
    en: "Flatbed",
    desc: "لنقل السيارات المعطلة، المركبات الجديدة، والمعدات الثقيلة بأمان تام.",
    capacity: "حتى ٣ أطنان",
    img: "/vehicle-flatbed.png",
    accent: "#679632",
    cardBg: "from-[#eef7e4] to-white",
  },
  {
    id: "dina",
    name: "دينا",
    en: "Medium Truck",
    desc: "الخيار الأمثل لنقل أثاث المنازل وبضائع المستودعات والمواد الكبيرة.",
    capacity: "حتى ٥ أطنان",
    img: "/vehicle-dina.png",
    accent: "#517D2E",
    cardBg: "from-[#e8f5da] to-white",
  },
  {
    id: "dina-winch",
    name: "دينا ونش",
    en: "Crane Truck",
    desc: "مجهزة برافعة لرفع ونقل المعدات الثقيلة التي تحتاج إلى جهد إضافي.",
    capacity: "حتى ٨ أطنان",
    img: "/vehicle-crane.png",
    accent: "#3a5c1e",
    cardBg: "from-[#e2f0d6] to-white",
  },
];

export default function VehicleTypes() {
  return (
    <section id="vehicles" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-[#679632]/10 text-[#679632] text-sm font-bold mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            أسطولنا المتنوع
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-heading font-black text-[#000201] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            المركبة المناسبة
            <span className="text-[#679632]"> لكل حاجة</span>
          </motion.h2>
          <motion.p
            className="text-[#000201]/55 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            مهما كان حجم شحنتك، لدينا المركبة المناسبة بسائق موثق وسعر واضح.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {vehicles.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover="hover"
              className="group relative rounded-[2rem] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_60px_rgba(103,150,50,0.18)] transition-shadow duration-500 cursor-pointer"
            >
              {/* Card gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-b ${v.cardBg} transition-all duration-500`} />
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at 60% 0%, ${v.accent}22 0%, transparent 70%)` }}
              />

              {/* Top accent line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem]"
                style={{ background: `linear-gradient(90deg, transparent, ${v.accent}, transparent)` }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.12 + 0.3 }}
              />

              <div className="relative z-10 p-6 flex flex-col h-full">
                {/* Vehicle image */}
                <div className="flex items-end justify-center h-[140px] mb-5">
                  <motion.img
                    src={v.img}
                    alt={v.name}
                    className="w-full max-w-[210px] object-contain"
                    variants={{
                      hover: { scale: 1.08, y: -8, transition: { duration: 0.4, ease: "easeOut" } },
                    }}
                    style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))" }}
                  />
                </div>

                {/* Badge */}
                <motion.div
                  className="self-end mb-3"
                  variants={{
                    hover: { x: -4, transition: { duration: 0.3 } },
                  }}
                >
                  <span
                    className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ backgroundColor: v.accent + "18", color: v.accent }}
                  >
                    {v.en}
                  </span>
                </motion.div>

                {/* Text */}
                <div className="text-right flex-1">
                  <h3 className="text-2xl font-heading font-black text-[#000201] mb-2">{v.name}</h3>
                  <p className="text-[#000201]/55 text-sm leading-relaxed mb-5">{v.desc}</p>
                </div>

                {/* Capacity footer */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/[0.05]">
                  <motion.div
                    className="flex items-center gap-1.5"
                    variants={{
                      hover: { x: 4, transition: { duration: 0.3 } },
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={v.accent} strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-bold" style={{ color: v.accent }}>{v.capacity}</span>
                  </motion.div>
                  <motion.div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: v.accent + "15" }}
                    variants={{
                      hover: { scale: 1.2, backgroundColor: v.accent, transition: { duration: 0.3 } },
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke={v.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <motion.div
          className="mt-16 rounded-[2rem] overflow-hidden bg-[#000201] shadow-2xl shadow-black/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 p-8 md:p-14 text-right">
              <h3 className="text-3xl md:text-4xl font-heading font-black text-white mb-4">
                اختر مركبتك
                <br />
                <span className="text-[#99C169]">من داخل التطبيق</span>
              </h3>
              <p className="text-white/55 text-lg leading-relaxed mb-8">
                واجهة سهلة تعرض لك جميع المركبات المتاحة مع أسعارها وتفاصيلها في الوقت الفعلي.
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 rounded-xl bg-[#679632] text-white font-bold hover:bg-[#517D2E] transition-colors shadow-lg shadow-[#679632]/30"
              >
                جرب التطبيق الآن
              </motion.button>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end p-6 md:p-0">
              <img
                src="/vehicles.png"
                alt="مركبات مشوار"
                className="w-full max-w-[220px] md:max-w-[260px] rounded-2xl shadow-2xl"
                style={{ objectFit: "cover", objectPosition: "top", maxHeight: "400px" }}
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
