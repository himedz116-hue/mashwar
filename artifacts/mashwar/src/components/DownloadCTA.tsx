import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function DownloadCTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />

          <div className="md:w-1/2 relative z-10 text-center md:text-right mb-10 md:mb-0">
            <h2 className="text-3xl md:text-5xl font-heading font-black mb-6 leading-tight">
              جاهز لتنفيذ مشوارك الأول؟
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-md mx-auto md:mx-0">
              حمل التطبيق الآن، سجل حسابك في ثوانٍ معدودة، واطلب مركبتك لتبدأ رحلة النقل بكل أمان وسهولة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold rounded-xl text-primary bg-white hover:bg-white/90">
                متجر آبل
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-xl border-white text-white hover:bg-white/10 hover:text-white">
                جوجل بلاي
              </Button>
            </div>
          </div>

          <div className="md:w-1/2 relative z-10 flex justify-center md:justify-end">
            <img 
              src="/app-screens.svg" 
              alt="تطبيق مشوار على الهاتف" 
              className="w-[250px] md:w-[320px] drop-shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
