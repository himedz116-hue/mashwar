import { motion } from "framer-motion";

export default function DownloadCTA() {
  return (
    <section id="download" className="py-24 bg-[#EFF7E8] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#99C169]/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-[#679632]/15 blur-[90px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#679632]/15"
          style={{ background: "linear-gradient(135deg, #679632 0%, #517D2E 50%, #3a5c20 100%)" }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
              backgroundSize: "30px 30px",
            }}
          />
          {/* Light glows */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#99C169]/20 rounded-full blur-[80px] translate-x-1/4 -translate-y-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[60px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-0">
            {/* Text side */}
            <div className="flex-1 p-10 md:p-16 text-right">
              <motion.span
                className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold mb-6 border border-white/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                متاح الآن على المتجرين
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-5 leading-tight">
                جاهز لتنفيذ
                <br />
                <span className="text-[#D4EDA8]">مشوارك الأول؟</span>
              </h2>
              <p className="text-white/70 text-lg mb-10 max-w-md leading-relaxed">
                حمل التطبيق، سجل حسابك في ثوانٍ، واطلب مركبتك لتبدأ رحلة النقل الذكية بكل أمان.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-end sm:justify-start">
                {/* App Store */}
                <a
                  href="#"
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white text-[#000201] hover:bg-[#D4EDA8] transition-all duration-300 shadow-xl"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <div className="text-xs opacity-60">حمل من</div>
                    <div className="font-black text-sm">App Store</div>
                  </div>
                </a>

                {/* Google Play */}
                <a
                  href="#"
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/15 border border-white/30 text-white hover:bg-white/25 transition-all duration-300"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.3.16.64.24.99.21l12.59-7.27-2.62-2.62-10.96 9.68zM.93 1.91C.35 2.46 0 3.3 0 4.37v15.26c0 1.07.35 1.91.93 2.46l.13.12 8.55-8.55v-.2L1.06 1.78l-.13.13zM19.72 10.42l-2.45-1.41-2.93 2.93 2.93 2.93 2.46-1.42c.7-.4.7-1.06-.01-1.03zM4.17.24L16.76 7.5l-2.62 2.62L3.18.44c.35-.34.65-.34.99-.2z"/>
                  </svg>
                  <div>
                    <div className="text-xs text-white/60">حمل من</div>
                    <div className="font-black text-sm">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Illustration */}
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center items-end p-6 md:pl-0 md:pr-10">
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <div className="absolute inset-0 bg-white/20 blur-3xl scale-75 rounded-full pointer-events-none" />
                <motion.img
                  src="/cta-illustration_2.png"
                  alt="مشوار"
                  className="relative w-[280px] md:w-[340px] lg:w-[400px] drop-shadow-2xl object-contain"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
