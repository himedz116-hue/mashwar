import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "حدد الموقع",
    desc: "افتح التطبيق وحدد موقع الاستلام والتسليم على الخريطة بكل دقة.",
  },
  {
    num: "02",
    title: "اختر المركبة",
    desc: "اختر نوع المركبة المناسبة لحمولتك وشاهد السعر التقديري مباشرة.",
  },
  {
    num: "03",
    title: "تتبع طلبك",
    desc: "تواصل مع السائق وتتبع مسار شحنتك لحظة بلحظة حتى وصولها بأمان.",
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-foreground text-background overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 bg-[url('/banner-icons.svg')] bg-[length:400px_400px] bg-center bg-repeat pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-background">
            ثلاث خطوات فقط
          </h2>
          <p className="text-background/70 text-lg max-w-2xl mx-auto">
            لقد صممنا تجربة الحجز لتكون الأسهل والأسرع، لتتمكن من إنجاز مهامك بدون تعقيد.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-primary/30 z-0" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-sm border-2 border-primary flex items-center justify-center mb-6 relative">
                <span className="text-3xl font-heading font-black text-primary">{step.num}</span>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4 text-background">{step.title}</h3>
              <p className="text-background/70 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
