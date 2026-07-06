import { motion } from "framer-motion";

export default function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#000201]"
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#517D2E]/25 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#99C169]/15 blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#679632]/10 blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#99C169 1px, transparent 1px), linear-gradient(90deg, #99C169 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text */}
          <div className="flex-1 text-right order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#679632]/20 border border-[#679632]/30 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#99C169] animate-pulse" />
              <span className="text-[#99C169] text-sm font-bold">منصة النقل الأولى في الخليج</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-white leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              انقل أغراضك
              <br />
              <span className="text-[#99C169]">بسرعة وأمان</span>
            </motion.h1>

            <motion.p
              className="text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              سواء كنت فرداً أو شركة، مشوار يوفر لك وانيت، سطحة، ودينا بضغطة زر. تتبع مسار شحنتك وأسعار واضحة ومضمونة.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-14"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button
                onClick={() => scrollTo("#download")}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#679632] hover:bg-[#517D2E] text-white text-lg font-black transition-all duration-300 shadow-2xl shadow-[#679632]/40 hover:scale-105"
              >
                حمل التطبيق الآن
              </button>
              <button
                onClick={() => scrollTo("#how-it-works")}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 text-lg font-bold transition-all duration-300"
              >
                كيف يعمل التطبيق؟
              </button>
            </motion.div>

            {/* Stats */}
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
                  <div className="text-2xl md:text-3xl font-heading font-black text-[#99C169]">{stat.value}</div>
                  <div className="text-white/50 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Visual */}
          <div className="flex-1 order-1 lg:order-2 w-full max-w-sm mx-auto lg:max-w-none flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-[#679632]/30 blur-3xl rounded-full scale-75" />

              {/* Phone frame */}
              <div className="relative z-10 w-[260px] md:w-[300px]">
                <div className="bg-[#0D1A0A] rounded-[2.5rem] p-2 shadow-2xl border border-white/10">
                  <div className="bg-[#111] rounded-[2rem] overflow-hidden">
                    {/* Status bar */}
                    <div className="flex justify-between items-center px-5 pt-3 pb-1">
                      <span className="text-white/50 text-xs">9:41</span>
                      <div className="w-20 h-5 bg-black rounded-full mx-auto" />
                      <span className="text-white/50 text-xs">...</span>
                    </div>
                    {/* Vehicles image */}
                    <motion.img
                      src="/vehicles.png"
                      alt="تطبيق مشوار"
                      className="w-full object-cover object-top"
                      style={{ maxHeight: "520px" }}
                      animate={{ y: [0, -12, 0] }}
                      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -right-4 top-12 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="w-10 h-10 rounded-full bg-[#679632] flex items-center justify-center text-white font-bold text-lg">
                  ✓
                </div>
                <div>
                  <div className="text-xs text-gray-500">تم تأكيد الطلب</div>
                  <div className="text-sm font-bold text-[#000201]">وانيت في الطريق</div>
                </div>
              </motion.div>

              {/* Floating rating badge */}
              <motion.div
                className="absolute -left-4 bottom-20 bg-[#679632] rounded-2xl shadow-xl px-4 py-3 text-white"
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

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 80L1440 80L1440 40C1200 0 960 80 720 40C480 0 240 80 0 40L0 80Z" fill="#F7FAF4"/>
        </svg>
      </div>
    </section>
  );
}
