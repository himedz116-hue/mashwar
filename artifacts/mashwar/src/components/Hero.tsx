import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 opacity-10">
          <img src="/building-1.svg" alt="" className="w-[325px] h-[315px]" aria-hidden="true" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-right">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
                الخيار الأول للنقل في الخليج
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-foreground leading-[1.2] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              انقل أغراضك 
              <br/>
              <span className="text-primary">بسرعة وأمان</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              سواء كنت فرداً، متجراً، أو شركة، مشوار يوفر لك وانيت، سطحة، ودينا بضغطة زر. تتبع مسار شحنتك وأسعار واضحة ومضمونة.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 rounded-xl">
                حمل التطبيق الآن
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-xl">
                تعرف على المزيد
              </Button>
            </motion.div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 w-full max-w-lg mx-auto md:max-w-none relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="relative mx-auto w-[280px] sm:w-[320px] lg:w-[380px]">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full transform -translate-y-10 scale-90" />
                <motion.img 
                  src="/app-screens.svg" 
                  alt="تطبيق مشوار" 
                  className="relative z-10 w-full drop-shadow-2xl"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
