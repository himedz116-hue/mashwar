import { motion } from "framer-motion";

export default function DownloadCTA() {
  return (
    <section id="download" className="py-24 bg-[#F7FAF4] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="relative rounded-3xl overflow-hidden bg-[#000201] shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Background glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#679632]/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#99C169]/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#99C169 1px, transparent 1px), linear-gradient(90deg, #99C169 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-0">
            {/* Text side */}
            <div className="flex-1 p-10 md:p-16 text-right">
              <motion.span
                className="inline-block px-4 py-1.5 rounded-full bg-[#679632]/20 text-[#99C169] text-sm font-bold mb-6 border border-[#679632]/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                متاح الآن
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-5 leading-tight">
                جاهز لتنفيذ
                <br />
                <span className="text-[#99C169]">مشوارك الأول؟</span>
              </h2>
              <p className="text-white/55 text-lg mb-10 max-w-md leading-relaxed">
                حمل التطبيق، سجل حسابك في ثوانٍ، واطلب مركبتك لتبدأ رحلة النقل الذكية بكل أمان.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-end sm:justify-start">
                {/* App Store */}
                <a
                  href="#"
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white text-[#000201] hover:bg-[#99C169] transition-all duration-300 shadow-xl group"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <div className="text-xs opacity-70">حمل من</div>
                    <div className="font-black text-sm">App Store</div>
                  </div>
                </a>

                {/* Google Play */}
                <a
                  href="#"
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#679632] text-white hover:bg-[#517D2E] transition-all duration-300 shadow-xl shadow-[#679632]/30"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.3.16.64.24.99.21l12.59-7.27-2.62-2.62-10.96 9.68zM.93 1.91C.35 2.46 0 3.3 0 4.37v15.26c0 1.07.35 1.91.93 2.46l.13.12 8.55-8.55v-.2L1.06 1.78l-.13.13zM19.72 10.42l-2.45-1.41-2.93 2.93 2.93 2.93 2.46-1.42c.7-.4.7-1.06-.01-1.03zM4.17.24L16.76 7.5l-2.62 2.62L3.18.44c.35-.34.65-.34.99-.2z"/>
                  </svg>
                  <div>
                    <div className="text-xs text-white/70">حمل من</div>
                    <div className="font-black text-sm">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Image side */}
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center p-8 md:pl-0 md:pr-12">
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <div className="absolute inset-0 bg-[#679632]/30 blur-3xl scale-75 rounded-full" />
                <div className="relative bg-[#0D1A0A] rounded-[2rem] p-2 border border-white/10 shadow-2xl w-[200px] md:w-[220px]">
                  <div className="bg-[#111] rounded-[1.6rem] overflow-hidden">
                    <div className="flex justify-between items-center px-4 pt-2 pb-1">
                      <span className="text-white/40 text-xs">9:41</span>
                      <div className="w-16 h-4 bg-black rounded-full mx-auto" />
                      <span className="text-white/40 text-xs">...</span>
                    </div>
                    <motion.img
                      src="/vehicles.png"
                      alt="تطبيق مشوار"
                      className="w-full object-cover object-top"
                      style={{ maxHeight: "380px" }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
