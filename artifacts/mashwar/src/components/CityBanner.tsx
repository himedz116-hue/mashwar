import { motion } from "framer-motion";

export default function CityBanner() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #517D2E 0%, #679632 50%, #4A7228 100%)" }}>
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#99C169]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-end justify-between" style={{ minHeight: "280px" }}>

        {/* Building A */}
        <motion.div
          className="flex-shrink-0 self-end"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img
            src="/city-building-a.svg"
            alt=""
            aria-hidden="true"
            style={{
              height: "230px",
              width: "auto",
              display: "block",
              filter: "brightness(10) opacity(0.85)",
            }}
          />
        </motion.div>

        {/* Center content */}
        <motion.div
          className="flex-1 text-center text-white py-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="text-xs font-bold tracking-widest text-[#99C169] uppercase mb-3">تغطية شاملة</div>
          <h2 className="text-3xl md:text-4xl font-heading font-black mb-3">
            نصل لكل حي في المدينة
          </h2>
          <p className="text-white/70 text-base max-w-sm mx-auto">
            سائقو مشوار منتشرون في جميع الأحياء، جاهزون على مدار الساعة لخدمتك.
          </p>
          <div className="flex justify-center gap-8 mt-6">
            <div>
              <div className="text-2xl font-black text-[#99C169]">+٢٠</div>
              <div className="text-white/60 text-xs mt-0.5">حي مغطى</div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-2xl font-black text-[#99C169]">٢٤/٧</div>
              <div className="text-white/60 text-xs mt-0.5">خدمة مستمرة</div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-2xl font-black text-[#99C169]">١٥ دق</div>
              <div className="text-white/60 text-xs mt-0.5">متوسط الوصول</div>
            </div>
          </div>
        </motion.div>

        {/* Building B */}
        <motion.div
          className="flex-shrink-0 self-end"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img
            src="/city-building-b.svg"
            alt=""
            aria-hidden="true"
            style={{
              height: "230px",
              width: "auto",
              display: "block",
              filter: "brightness(10) opacity(0.85)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
