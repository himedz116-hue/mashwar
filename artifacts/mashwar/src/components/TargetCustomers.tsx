import { motion } from "framer-motion";

const customers = [
  {
    title: "الأفراد",
    desc: "لنقل الأثاث والأغراض الشخصية والمشتريات الكبيرة إلى منزلك بكل سهولة.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 21c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    num: "٦٠٪",
    numLabel: "من مستخدمينا",
  },
  {
    title: "أصحاب المتاجر",
    desc: "لتوصيل بضائع متجرك للعملاء ونقل المخزون من الموردين بسرعة وكفاءة.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    num: "٢٥٪",
    numLabel: "تجار ومتاجر",
  },
  {
    title: "شركات المقاولات",
    desc: "لنقل المعدات الثقيلة ومواد البناء بين مواقع العمل بسهولة ودقة عالية.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 9h18M9 21V9M15 21V9" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    num: "١٠٪",
    numLabel: "شركات ومقاولون",
  },
  {
    title: "المستودعات",
    desc: "لإدارة لوجستيات التوزيع ونقل الشحنات الضخمة بين المخازن ونقاط البيع.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M2 20h20v2H2zM4 20V10l8-8 8 8v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="9" y="14" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    num: "٥٪",
    numLabel: "مستودعات وشركات توزيع",
  },
];

export default function TargetCustomers() {
  return (
    <section id="customers" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#679632]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#679632]/20 to-transparent" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left text */}
          <div className="lg:w-2/5">
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full bg-[#679632]/10 text-[#679632] text-sm font-bold mb-6 border border-[#679632]/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              فئاتنا المستهدفة
            </motion.span>
            <motion.h2
              className="text-4xl md:text-5xl font-heading font-black text-[#000201] mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              الكل يعتمد
              <br />
              <span className="text-[#679632]">على مشوار</span>
            </motion.h2>
            <motion.p
              className="text-[#000201]/55 text-lg leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              من مشوار صغير لنقل أريكة، إلى أسطول لنقل مواد بناء — المنصة مرنة لتلبية جميع الاحتياجات.
            </motion.p>
            <motion.div
              className="w-16 h-1.5 bg-[#679632] rounded-full"
              initial={{ scaleX: 0, originX: 1 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </div>

          {/* Cards */}
          <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {customers.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#F7FAF4] border border-[#679632]/15 rounded-2xl p-6 hover:border-[#679632]/40 hover:bg-[#EFF7E8] hover:shadow-lg hover:shadow-[#679632]/10 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-xl bg-[#679632]/10 text-[#679632] flex items-center justify-center group-hover:bg-[#679632] group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-heading font-black text-[#679632]">{item.num}</div>
                    <div className="text-[#000201]/40 text-xs">{item.numLabel}</div>
                  </div>
                </div>
                <h3 className="text-xl font-heading font-black text-[#000201] mb-2">{item.title}</h3>
                <p className="text-[#000201]/55 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
