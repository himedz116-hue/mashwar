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
          className="mt-16 rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-black/30"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row min-h-[380px]">

            {/* LEFT — illustration panel */}
            <div
              className="relative flex-shrink-0 w-full md:w-[420px] lg:w-[480px] flex items-end justify-center overflow-hidden"
              style={{ background: "linear-gradient(160deg, #1e4d0a 0%, #2d6e0f 60%, #1a3d08 100%)" }}
            >
              {/* subtle dot texture */}
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              {/* corner glow */}
              <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[#99C169]/20 blur-[80px] pointer-events-none" />

              <motion.img
                src="/vehicle-app-screen.svg"
                alt="تطبيق مشوار"
                className="relative z-10 w-[300px] md:w-[350px] lg:w-[400px] object-contain"
                style={{ filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.4))" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.7 }}
                animate={{ y: [0, -10, 0] }}
              />
            </div>

            {/* Vertical divider line */}
            <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-[#99C169]/40 to-transparent flex-shrink-0" />

            {/* RIGHT — text panel */}
            <div
              className="flex-1 relative flex flex-col justify-center p-8 md:p-12 lg:p-14 text-right overflow-hidden"
              style={{ background: "linear-gradient(150deg, #0d1f06 0%, #142e08 50%, #0a1803 100%)" }}
            >
              {/* top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99C169]/50 to-transparent md:hidden" />
              {/* glow */}
              <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full bg-[#679632]/20 blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                {/* Badge */}
                <motion.span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#679632]/20 text-[#99C169] text-xs font-bold border border-[#679632]/25 mb-5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#99C169] animate-pulse" />
                  داخل التطبيق
                </motion.span>

                <motion.h3
                  className="text-3xl md:text-4xl lg:text-[2.8rem] font-heading font-black text-white mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                >
                  اختر مركبتك
                  <br />
                  <span className="text-[#99C169]">من داخل التطبيق</span>
                </motion.h3>

                <motion.p
                  className="text-white/50 text-sm md:text-base leading-relaxed mb-7 max-w-xs"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  واجهة سهلة تعرض جميع المركبات المتاحة مع أسعارها وتفاصيل السائقين في الوقت الفعلي.
                </motion.p>

                {/* Feature list */}
                <motion.div
                  className="flex flex-col gap-2.5 mb-8 items-end"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                >
                  {[
                    { icon: "🚛", text: "٤ أنواع مركبات للاختيار" },
                    { icon: "💰", text: "أسعار شفافة قبل التأكيد" },
                    { icon: "✅", text: "سائقون موثقون ومُقيَّمون" },
                  ].map((f) => (
                    <span key={f.text} className="flex items-center gap-2.5 text-white/65 text-sm">
                      <span className="text-base">{f.icon}</span>
                      {f.text}
                    </span>
                  ))}
                </motion.div>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3.5 rounded-2xl bg-[#679632] text-white font-bold text-base hover:bg-[#517D2E] transition-colors shadow-xl shadow-[#679632]/35 mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  جرب التطبيق الآن ←
                </motion.button>

                {/* Stats */}
                <motion.div
                  className="flex justify-end gap-6 pt-6 border-t border-white/[0.08]"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 }}
                >
                  {[
                    { val: "+١٠٠٠", label: "سائق" },
                    { val: "٢٤/٧", label: "خدمة" },
                    { val: "٩٨٪", label: "رضا" },
                  ].map((s, i) => (
                    <div key={s.label} className="flex items-center gap-4">
                      {i > 0 && <div className="w-px h-8 bg-white/10" />}
                      <div className="text-right">
                        <div className="text-lg font-black text-[#99C169] leading-none">{s.val}</div>
                        <div className="text-white/35 text-xs mt-1">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
