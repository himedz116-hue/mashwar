import { motion } from "framer-motion";

export default function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-white">
      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#679632 1px, transparent 1px), linear-gradient(90deg, #679632 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#99C169]/25 blur-[130px]" />
        <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#679632]/12 blur-[100px]" />
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#99C169] via-[#679632] to-[#517D2E]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-24 pb-12 md:pt-36 md:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

          {/* ── MOBILE: image first (top), then text ── */}
          {/* ── DESKTOP: text left, image right ── */}

          {/* Phone mockup */}
          <div className="flex-1 order-1 lg:order-2 w-full flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              {/* Glow behind phones */}
              <div className="absolute inset-0 bg-[#99C169]/30 blur-3xl rounded-full scale-90 translate-y-8" />

              <motion.img
                src="/app-mockup.png"
                alt="تطبيق مشوار"
                className="relative z-10 w-[260px] sm:w-[310px] md:w-[380px] lg:w-[460px] drop-shadow-2xl mx-auto"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              />

              {/* Floating badge: order confirmed */}
              <motion.div
                className="absolute right-0 top-10 sm:top-14 z-20 bg-white rounded-2xl shadow-xl shadow-[#679632]/15 border border-[#679632]/10 px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#679632] flex items-center justify-center text-white font-bold text-base sm:text-lg shrink-0">✓</div>
                <div>
                  <div className="text-[10px] sm:text-xs text-[#000201]/50">تم تأكيد الطلب</div>
                  <div className="text-xs sm:text-sm font-bold text-[#000201]">وانيت في الطريق</div>
                </div>
              </motion.div>

              {/* Floating badge: rating */}
              <motion.div
                className="absolute left-0 bottom-16 sm:bottom-24 z-20 bg-[#679632] rounded-2xl shadow-xl shadow-[#679632]/40 px-3 py-2 sm:px-4 sm:py-3 text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="text-xl sm:text-2xl font-black">٤.٩</div>
                <div className="flex gap-0.5 text-[#FFD700] text-[10px] sm:text-xs">★★★★★</div>
                <div className="text-white/70 text-[10px] sm:text-xs mt-0.5">تقييم السائقين</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Text content */}
          <div className="flex-1 text-right order-2 lg:order-1 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#679632]/10 border border-[#679632]/25 mb-5 md:mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#679632] animate-pulse" />
              <span className="text-[#679632] text-xs sm:text-sm font-bold">منصة النقل الأولى في الخليج</span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-[#000201] leading-[1.1] mb-4 md:mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              انقل أغراضك
              <br />
              <span className="text-[#679632]">بسرعة وأمان</span>
            </motion.h1>

            <motion.p
              className="text-[#000201]/60 text-base md:text-xl leading-relaxed mb-7 md:mb-10 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              سواء كنت فرداً أو شركة، مشوار يوفر لك وانيت، سطحة، ودينا بضغطة زر. تتبع مسار شحنتك وأسعار واضحة ومضمونة.
            </motion.p>

            {/* CTA Buttons — stacked on mobile, row on sm+ */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 mb-8 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button
                onClick={() => scrollTo("#download")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#679632] hover:bg-[#517D2E] text-white text-base sm:text-lg font-black transition-all duration-300 shadow-2xl shadow-[#679632]/30 hover:scale-105 active:scale-95"
              >
                حمل التطبيق الآن
              </button>
              <button
                onClick={() => scrollTo("#how-it-works")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-[#679632]/35 text-[#679632] hover:bg-[#679632]/5 text-base sm:text-lg font-bold transition-all duration-300 active:scale-95"
              >
                كيف يعمل التطبيق؟
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="flex gap-0 sm:gap-10 justify-between sm:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {[
                { value: "+١٠٠٠", label: "سائق موثق" },
                { value: "+٥٠٠٠", label: "طلب مكتمل" },
                { value: "٤.٩", label: "تقييم العملاء" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex-1 sm:flex-none text-center sm:text-right">
                  {/* Mobile divider between stats */}
                  {i > 0 && (
                    <div className="hidden sm:block" />
                  )}
                  <div className="relative">
                    {i > 0 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-3 w-px h-8 bg-[#679632]/15 sm:hidden" />
                    )}
                    <div className="text-xl sm:text-2xl md:text-3xl font-heading font-black text-[#679632]">
                      {stat.value}
                    </div>
                    <div className="text-[#000201]/45 text-xs sm:text-sm mt-0.5">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Mobile: Download store badges */}
            <motion.div
              className="flex gap-3 mt-6 sm:hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold flex-1 justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#679632] text-white text-xs font-bold flex-1 justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.16.64.24.99.21l12.59-7.27-2.62-2.62-10.96 9.68zM.93 1.91C.35 2.46 0 3.3 0 4.37v15.26c0 1.07.35 1.91.93 2.46l.13.12 8.55-8.55v-.2L1.06 1.78l-.13.13zM19.72 10.42l-2.45-1.41-2.93 2.93 2.93 2.93 2.46-1.42c.7-.4.7-1.06-.01-1.03zM4.17.24L16.76 7.5l-2.62 2.62L3.18.44c.35-.34.65-.34.99-.2z"/>
                </svg>
                Google Play
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom wave */}
      <svg
        viewBox="0 0 1440 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "50px" }}
      >
        <path
          d="M0 50L1440 50L1440 20C1200 0 960 50 720 20C480 0 240 50 0 20L0 50Z"
          fill="#517D2E"
        />
      </svg>
    </section>
  );
}
