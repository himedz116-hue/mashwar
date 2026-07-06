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

      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text */}
          <div className="flex-1 text-right order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#679632]/10 border border-[#679632]/25 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#679632] animate-pulse" />
              <span className="text-[#679632] text-sm font-bold">منصة النقل الأولى في الخليج</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-[#000201] leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              انقل أغراضك
              <br />
              <span className="text-[#679632]">بسرعة وأمان</span>
            </motion.h1>

            <motion.p
              className="text-[#000201]/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              سواء كنت فرداً أو شركة، مشوار يوفر لك وانيت، سطحة، ودينا بضغطة زر. تتبع مسار شحنتك وأسعار واضحة ومضمونة.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button
                onClick={() => scrollTo("#download")}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#679632] hover:bg-[#517D2E] text-white text-lg font-black transition-all duration-300 shadow-2xl shadow-[#679632]/30 hover:scale-105"
              >
                حمل التطبيق الآن
              </button>
              <button
                onClick={() => scrollTo("#how-it-works")}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-[#679632]/35 text-[#679632] hover:bg-[#679632]/5 text-lg font-bold transition-all duration-300"
              >
                كيف يعمل التطبيق؟
              </button>
            </motion.div>

            <motion.div
              className="flex gap-10 justify-end sm:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {[
                { value: "+١٠٠٠", label: "سائق موثق" },
                { value: "+٥٠٠٠", label: "طلب مكتمل" },
                { value: "٤.٩", label: "تقييم العملاء" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-heading font-black text-[#679632]">
                    {stat.value}
                  </div>
                  <div className="text-[#000201]/45 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Phone mockup image */}
          <div className="flex-1 order-1 lg:order-2 w-full max-w-md mx-auto lg:max-w-none flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Glow behind phones */}
              <div className="absolute inset-0 bg-[#99C169]/30 blur-3xl rounded-full scale-90 translate-y-8" />

              <motion.img
                src="/app-mockup.png"
                alt="تطبيق مشوار"
                className="relative z-10 w-[340px] md:w-[420px] lg:w-[460px] drop-shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              />

              {/* Floating badge: order confirmed */}
              <motion.div
                className="absolute right-0 top-16 z-20 bg-white rounded-2xl shadow-xl shadow-[#679632]/15 border border-[#679632]/10 px-4 py-3 flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="w-10 h-10 rounded-full bg-[#679632] flex items-center justify-center text-white font-bold text-lg">✓</div>
                <div>
                  <div className="text-xs text-[#000201]/50">تم تأكيد الطلب</div>
                  <div className="text-sm font-bold text-[#000201]">وانيت في الطريق</div>
                </div>
              </motion.div>

              {/* Floating badge: rating */}
              <motion.div
                className="absolute left-0 bottom-24 z-20 bg-[#679632] rounded-2xl shadow-xl shadow-[#679632]/40 px-4 py-3 text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="text-2xl font-black">٤.٩</div>
                <div className="flex gap-0.5 text-[#FFD700] text-xs">★★★★★</div>
                <div className="text-white/70 text-xs mt-0.5">تقييم السائقين</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom wave into CityBanner */}
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
