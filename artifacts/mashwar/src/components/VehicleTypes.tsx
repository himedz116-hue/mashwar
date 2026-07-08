import { motion } from "framer-motion";
import { useRef, useState, useCallback } from "react";

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

/** Mobile-only horizontal snap carousel with live dot indicators */
function MobileCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / vehicles.length;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.max(0, Math.min(idx, vehicles.length - 1)));
  }, []);

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / vehicles.length;
    el.scrollTo({ left: cardWidth * i, behavior: "smooth" });
  };

  return (
    <div className="md:hidden -mx-4 px-4">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {vehicles.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="snap-start shrink-0 w-[72vw] max-w-[280px] relative rounded-[2rem] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.09)] cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-b ${v.cardBg}`} />
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem]"
              style={{ background: `linear-gradient(90deg, transparent, ${v.accent}, transparent)` }}
            />
            <div className="relative z-10 p-5 flex flex-col min-h-[300px]">
              <div className="flex items-end justify-center h-[120px] mb-4">
                <motion.img
                  src={v.img}
                  alt={v.name}
                  className="w-full max-w-[190px] object-contain"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4 + i * 0.5, ease: "easeInOut" }}
                  style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.15))" }}
                />
              </div>
              <div className="self-end mb-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ backgroundColor: v.accent + "18", color: v.accent }}
                >
                  {v.en}
                </span>
              </div>
              <div className="text-right flex-1">
                <h3 className="text-xl font-heading font-black text-[#000201] mb-1.5">{v.name}</h3>
                <p className="text-[#000201]/55 text-xs leading-relaxed">{v.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/[0.05]">
                <div className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={v.accent} strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs font-bold" style={{ color: v.accent }}>{v.capacity}</span>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: v.accent + "20" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke={v.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        <div className="shrink-0 w-4" />
      </div>

      {/* Live dot indicators */}
      <div className="flex justify-center gap-2 mt-3">
        {vehicles.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full bg-[#679632] transition-all duration-300 ${
              i === activeIndex ? "w-5 opacity-100" : "w-1.5 opacity-25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function VehicleTypes() {
  return (
    <section id="vehicles" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-10 md:mb-20">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-[#679632]/10 text-[#679632] text-sm font-bold mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            أسطولنا المتنوع
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#000201] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            المركبة المناسبة
            <span className="text-[#679632]"> لكل حاجة</span>
          </motion.h2>
          <motion.p
            className="text-[#000201]/55 text-base md:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            مهما كان حجم شحنتك، لدينا المركبة المناسبة بسائق موثق وسعر واضح.
          </motion.p>
        </div>

        {/* Mobile carousel */}
        <MobileCarousel />

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-6">
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
              <div className={`absolute inset-0 bg-gradient-to-b ${v.cardBg} transition-all duration-500`} />
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at 60% 0%, ${v.accent}22 0%, transparent 70%)` }}
              />
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem]"
                style={{ background: `linear-gradient(90deg, transparent, ${v.accent}, transparent)` }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.12 + 0.3 }}
              />
              <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="flex items-end justify-center h-[140px] mb-5">
                  <motion.img
                    src={v.img}
                    alt={v.name}
                    className="w-full max-w-[210px] object-contain"
                    variants={{ hover: { scale: 1.08, y: -8, transition: { duration: 0.4, ease: "easeOut" } } }}
                    style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))" }}
                  />
                </div>
                <motion.div className="self-end mb-3" variants={{ hover: { x: -4, transition: { duration: 0.3 } } }}>
                  <span
                    className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ backgroundColor: v.accent + "18", color: v.accent }}
                  >
                    {v.en}
                  </span>
                </motion.div>
                <div className="text-right flex-1">
                  <h3 className="text-2xl font-heading font-black text-[#000201] mb-2">{v.name}</h3>
                  <p className="text-[#000201]/55 text-sm leading-relaxed mb-5">{v.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/[0.05]">
                  <motion.div className="flex items-center gap-1.5" variants={{ hover: { x: 4, transition: { duration: 0.3 } } }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={v.accent} strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-bold" style={{ color: v.accent }}>{v.capacity}</span>
                  </motion.div>
                  <motion.div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: v.accent + "15" }}
                    variants={{ hover: { scale: 1.2, backgroundColor: v.accent, transition: { duration: 0.3 } } }}
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
          className="mt-10 md:mt-16 rounded-[2rem] overflow-hidden relative border border-[#679632]/15 shadow-xl shadow-[#679632]/10"
          style={{ background: "#ffffff" }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "linear-gradient(#679632 1px, transparent 1px), linear-gradient(90deg, #679632 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.05,
          }} />
          <div className="absolute -top-10 -right-10 w-[300px] h-[300px] rounded-full bg-[#679632]/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center min-h-[280px] md:min-h-[320px]">
            <motion.div
              className="flex-shrink-0 flex items-center self-center justify-center px-6 pt-8 md:pt-0 md:pl-12"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <motion.div
                className="rounded-2xl overflow-hidden shadow-lg shadow-[#679632]/15 border border-[#679632]/10"
                style={{ background: "linear-gradient(160deg, #f2fae8 0%, #e5f5d0 100%)" }}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              >
                <img
                  src="/vehicle-app-screen.svg"
                  alt="تطبيق مشوار"
                  className="w-[180px] md:w-[220px] lg:w-[300px] block"
                />
              </motion.div>
            </motion.div>

            <div className="flex-1 flex flex-col justify-center items-start text-right p-6 md:p-10 lg:p-14">
              <motion.span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#679632]/10 text-[#517D2E] text-xs font-bold border border-[#679632]/20 mb-4"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#679632] animate-pulse" />
                داخل التطبيق
              </motion.span>

              <motion.h3
                className="text-2xl md:text-4xl lg:text-5xl font-heading font-black text-[#000201] leading-tight mb-3"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
              >
                اختر مركبتك
                <br />
                <span className="text-[#679632]">من داخل التطبيق</span>
              </motion.h3>

              <motion.p
                className="text-[#000201]/50 text-sm md:text-base leading-relaxed mb-5 max-w-sm"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              >
                واجهة بسيطة تعرض كل المركبات بأسعارها وتقييمات السائقين لحظةً بلحظة.
              </motion.p>

              <motion.div
                className="flex flex-col gap-2.5 mb-6 w-full"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.25 }}
              >
                {["٤ أنواع مركبات للاختيار", "أسعار شفافة قبل التأكيد", "سائقون موثقون ومُقيَّمون"].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-[#000201]/60 text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#679632]/15 flex items-center justify-center flex-shrink-0">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#679632" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap"
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  {[{ v: "+١٠٠٠", l: "سائق" }, { v: "٩٨٪", l: "رضا" }, { v: "٢٤/٧", l: "خدمة" }].map((s, i) => (
                    <div key={s.l} className="flex items-center gap-4">
                      {i > 0 && <div className="w-px h-7 bg-black/10" />}
                      <div className="text-right">
                        <div className="text-base font-black text-[#679632] leading-none">{s.v}</div>
                        <div className="text-[#000201]/35 text-xs mt-0.5">{s.l}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#679632] hover:bg-[#517D2E] text-white font-bold text-sm transition-colors shadow-lg shadow-[#679632]/25"
                >
                  جرب التطبيق الآن
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
