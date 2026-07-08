import { motion } from "framer-motion";
import { useRef, useState, useCallback } from "react";

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

const avatarColors = ["#679632", "#517D2E", "#3a5c1e"];

/** Mobile-only testimonials snap carousel with live dot indicators */
function MobileTestimonialsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / testimonials.length;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.max(0, Math.min(idx, testimonials.length - 1)));
  }, []);

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / testimonials.length;
    el.scrollTo({ left: cardWidth * i, behavior: "smooth" });
  };

  return (
    <div className="md:hidden -mx-4 px-4">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="snap-start shrink-0 w-[85vw] max-w-[320px] bg-[#F7FAF4] rounded-2xl p-6 border border-[#679632]/10"
          >
            {/* Stars */}
            <div className="flex gap-1 text-[#F4C542] mb-4">
              {Array.from({ length: t.stars }).map((_, j) => (
                <span key={j} className="text-base">★</span>
              ))}
            </div>

            {/* Quote */}
            <p className="text-[#000201]/70 text-sm leading-relaxed mb-6 relative">
              <span className="text-[#99C169] text-3xl font-serif leading-none absolute -top-1 -right-1 opacity-40">"</span>
              {t.content}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${avatarColors[i]}, ${avatarColors[i]}cc)` }}
              >
                {t.initial}
              </div>
              <div>
                <div className="font-heading font-black text-[#000201] text-sm">{t.name}</div>
                <div className="text-xs text-[#000201]/45">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
        <div className="shrink-0 w-4" />
      </div>

      {/* Live dot indicators */}
      <div className="flex justify-center gap-2 mt-3">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full bg-[#679632] transition-all duration-300 ${
              i === activeIndex ? "w-5 opacity-100" : "w-1.5 opacity-25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#679632]/20 to-transparent" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-10 md:mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-[#679632]/10 text-[#679632] text-sm font-bold mb-4 border border-[#679632]/15"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            آراء عملائنا
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#000201] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            ماذا يقولون
            <span className="text-[#679632]"> عن مشوار؟</span>
          </motion.h2>
          <motion.p
            className="text-[#000201]/55 text-base md:text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            آلاف المستخدمين يعتمدون علينا يومياً لإنجاز مهامهم.
          </motion.p>
        </div>

        {/* Mobile: snap carousel */}
        <MobileTestimonialsCarousel />

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-[#F7FAF4] rounded-2xl p-8 border border-[#679632]/10 hover:border-[#679632]/30 hover:shadow-lg hover:shadow-[#679632]/10 transition-all duration-300"
            >
              <div className="flex gap-1 text-[#F4C542] mb-5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j} className="text-lg">★</span>
                ))}
              </div>
              <p className="text-[#000201]/70 text-base leading-relaxed mb-8 relative">
                <span className="text-[#99C169] text-4xl font-serif leading-none absolute -top-2 -right-1 opacity-40">"</span>
                {t.content}
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${avatarColors[i]}, ${avatarColors[i]}cc)` }}
                >
                  {t.initial}
                </div>
                <div>
                  <div className="font-heading font-black text-[#000201]">{t.name}</div>
                  <div className="text-sm text-[#000201]/45">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
