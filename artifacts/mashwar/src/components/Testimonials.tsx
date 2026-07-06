import { motion } from "framer-motion";

const testimonials = [
  {
    name: "أحمد العتيبي",
    role: "صاحب متجر أثاث، الرياض",
    content: "اعتمدت على مشوار لتوصيل بضائع متجري للعملاء. خدمة ممتازة والسائقين محترفين، والتتبع المباشر يريح بالي وبال عميلي.",
    initial: "أ",
    stars: 5,
  },
  {
    name: "سارة المطيري",
    role: "عميلة، جدة",
    content: "نقلت عفش بيتي بالكامل عن طريق مشوار. الدينا كانت كبيرة ونظيفة والسعر الأفضل مقارنة بالسوق. تجربة رائعة من البداية للنهاية!",
    initial: "س",
    stars: 5,
  },
  {
    name: "محمد الدوسري",
    role: "مقاول، الدمام",
    content: "تطبيق فك أزمة! أطلب الدينا ونش في أي وقت للموقع وتوصل بسرعة. التسعيرة الواضحة قبل الطلب ميزة قوية جداً.",
    initial: "م",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#F7FAF4] relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-[#679632]/10 text-[#679632] text-sm font-bold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            آراء عملائنا
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-heading font-black text-[#000201] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            ماذا يقولون
            <span className="text-[#679632]"> عن مشوار؟</span>
          </motion.h2>
          <motion.p
            className="text-[#000201]/55 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            آلاف المستخدمين يعتمدون علينا يومياً لإنجاز مهامهم.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-8 border border-[#679632]/10 shadow-sm hover:shadow-xl hover:shadow-[#679632]/10 hover:border-[#679632]/25 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 text-[#F4C542] mb-5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j} className="text-lg">★</span>
                ))}
              </div>

              <p className="text-[#000201]/75 text-base leading-relaxed mb-8 relative">
                <span className="text-[#679632] text-4xl font-serif leading-none absolute -top-2 -right-1 opacity-30">"</span>
                {t.content}
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#679632] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {t.initial}
                </div>
                <div>
                  <div className="font-heading font-black text-[#000201]">{t.name}</div>
                  <div className="text-sm text-[#000201]/50">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
