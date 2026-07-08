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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#99C169]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full py-10 md:py-20">
        <motion.div
          className="text-center text-white max-w-lg mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="text-xs font-bold tracking-widest text-[#99C169] uppercase mb-2 md:mb-3">تغطية شاملة</div>
          <h2 className="text-2xl md:text-4xl font-heading font-black mb-2 md:mb-3">
            نصل لكل حي في المدينة
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 md:mb-8">
            سائقو مشوار منتشرون في جميع الأحياء، جاهزون على مدار الساعة لخدمتك.
          </p>

          {/* Stats — 3 cols on all sizes, tighter on mobile */}
          <div className="flex justify-center items-center gap-4 md:gap-8">
            {[
              { v: "+٢٠", l: "حي مغطى" },
              { v: "٢٤/٧", l: "خدمة مستمرة" },
              { v: "١٥ دق", l: "متوسط الوصول" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 md:gap-8">
                {i > 0 && <div className="w-px h-8 md:h-10 bg-white/20" />}
                <div>
                  <div className="text-xl md:text-2xl font-black text-[#99C169]">{s.v}</div>
                  <div className="text-white/60 text-[10px] md:text-xs mt-0.5">{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
