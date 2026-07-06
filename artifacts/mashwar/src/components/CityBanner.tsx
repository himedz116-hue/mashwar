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

      {/* Decorative dots pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${0.4 + i * 0.2})`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full py-20 md:py-24">
        <motion.div
          className="text-center text-white max-w-2xl mx-auto px-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Label */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-widest text-[#c8e89a] uppercase mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#99C169] animate-pulse" />
            تغطية شاملة
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-5xl font-heading font-black mb-4 leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            نصل لكل حي في المدينة
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-white/65 text-lg leading-relaxed mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            سائقو مشوار منتشرون في جميع الأحياء، جاهزون على مدار الساعة لخدمتك.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex justify-center items-center gap-0"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {[
              { value: "+٢٠", label: "حي مغطى" },
              { value: "٢٤/٧", label: "خدمة مستمرة" },
              { value: "١٥ دق", label: "متوسط الوصول" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center">
                <div className="px-8 py-4 text-center">
                  <div className="text-3xl font-black text-[#99C169] mb-1">{stat.value}</div>
                  <div className="text-white/55 text-xs tracking-wide">{stat.label}</div>
                </div>
                {i < 2 && <div className="w-px h-12 bg-white/15" />}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
