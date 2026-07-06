import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "أحمد العتيبي",
    role: "صاحب متجر أثاث",
    content: "اعتمدت على مشوار لتوصيل بضائع متجري للعملاء. خدمة ممتازة، السائقين محترفين، والتتبع المباشر يريح بالي وبال العميل."
  },
  {
    name: "سارة خالد",
    role: "عميل",
    content: "نقلت عفش بيتي بالكامل عن طريق مشوار. دينا كانت كبيرة ونظيفة والسعر كان الأفضل مقارنة بالسوق. تجربة رائعة!"
  },
  {
    name: "محمد الدوسري",
    role: "مقاول",
    content: "تطبيق فك أزمة! أطلب الدينا ونش في أي وقت للموقع وتوصل بسرعة. التسعيرة الواضحة قبل الطلب ميزة قوية جداً."
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            ماذا يقولون عنا؟
          </h2>
          <p className="text-muted-foreground text-lg">
            آلاف المستخدمين يعتمدون على مشوار يومياً لإنجاز مهامهم.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card p-8 rounded-2xl shadow-sm border border-border"
            >
              <div className="flex gap-1 text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="fill-current w-5 h-5" />
                ))}
              </div>
              <p className="text-foreground text-lg leading-relaxed mb-8 italic">
                "{test.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold">{test.name}</h4>
                  <p className="text-sm text-muted-foreground">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
