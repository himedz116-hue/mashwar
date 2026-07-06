import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Banknote, CreditCard, Star, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: "تتبع مباشر",
    desc: "شاهد مسار مركبتك على الخريطة لحظة بلحظة منذ انطلاقها وحتى وصولها."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "سائقون موثقون",
    desc: "جميع السائقين مسجلون رسمياً وتم التحقق من هوياتهم لضمان أعلى معايير الأمان."
  },
  {
    icon: <Banknote className="w-6 h-6" />,
    title: "أسعار واضحة",
    desc: "لا مزايدات ولا مفاجآت، السعر التقديري يظهر لك قبل تأكيد الحجز."
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "دفع إلكتروني",
    desc: "خيارات دفع متعددة وآمنة عبر البطاقات البنكية، مدى، آبل باي، أو نقداً."
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "تقييم السائق",
    desc: "نظام تقييم شفاف لضمان جودة الخدمة واستمرارية تميز السائقين."
  },
  {
    icon: <HeadphonesIcon className="w-6 h-6" />,
    title: "دعم فني",
    desc: "فريق خدمة عملاء متواجد على مدار الساعة لحل أي مشكلة قد تواجهك."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Decor */}
      <div className="absolute left-0 bottom-0 opacity-10 pointer-events-none transform -scale-x-100">
        <img src="/building-2.svg" alt="" className="w-[400px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            لماذا تختار مشوار؟
          </h2>
          <p className="text-muted-foreground text-lg">
            نحن لا نوفر فقط مركبة نقل، بل نقدم تجربة متكاملة تركز على الأمان، السرعة، والموثوقية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:border-primary/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
