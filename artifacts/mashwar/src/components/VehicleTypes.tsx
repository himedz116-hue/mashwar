import { motion } from "framer-motion";

const vehicles = [
  {
    id: "wanette",
    name: "وانيت",
    en: "Pickup Truck",
    desc: "مناسب لنقل الأغراض الخفيفة والطرود والمشاوير السريعة داخل المدينة.",
    capacity: "حتى ١ طن",
    color: "#99C169",
    bg: "from-[#99C169]/15 to-[#679632]/5",
    border: "border-[#99C169]/30",
  },
  {
    id: "satha",
    name: "سطحة",
    en: "Flatbed",
    desc: "لنقل السيارات المعطلة، المركبات الجديدة، والمعدات الثقيلة بأمان تام.",
    capacity: "حتى ٣ أطنان",
    color: "#679632",
    bg: "from-[#679632]/15 to-[#517D2E]/5",
    border: "border-[#679632]/30",
  },
  {
    id: "dina",
    name: "دينا",
    en: "Medium Truck",
    desc: "الخيار الأمثل لنقل أثاث المنازل وبضائع المستودعات والمواد الكبيرة.",
    capacity: "حتى ٥ أطنان",
    color: "#517D2E",
    bg: "from-[#517D2E]/15 to-[#99C169]/5",
    border: "border-[#517D2E]/30",
  },
  {
    id: "dina-winch",
    name: "دينا ونش",
    en: "Crane Truck",
    desc: "مجهزة برافعة لرفع ونقل المعدات الثقيلة التي تحتاج إلى جهد إضافي.",
    capacity: "حتى ٨ أطنان",
    color: "#000201",
    bg: "from-[#000201]/10 to-[#517D2E]/5",
    border: "border-[#000201]/20",
  },
];

const truckIcons: Record<string, string> = {
  wanette: "M2 17h18v2H2zm0-4h18v2H2zm2-4h14v2H4zm2-4h10v2H6zm4-4h2v2h-2z",
  satha: "M1 3h22v2H1zm0 4h22v2H1zM3 11h18l2 6H1l2-6zm3 8a2 2 0 100 4 2 2 0 000-4zm12 0a2 2 0 100 4 2 2 0 000-4z",
  dina: "M1 3h22v14H1zM5 17v4M19 17v4M1 9h22",
  "dina-winch": "M12 2l-2 4H4l4 4-2 6 6-3 6 3-2-6 4-4h-6l-2-4z",
};

export default function VehicleTypes() {
  return (
    <section id="vehicles" className="py-24 bg-[#F7FAF4]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-[#679632]/10 text-[#679632] text-sm font-bold mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            أسطولنا المتنوع
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-heading font-black text-[#000201] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            المركبة المناسبة
            <span className="text-[#679632]"> لكل حاجة</span>
          </motion.h2>
          <motion.p
            className="text-[#000201]/60 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            مهما كان حجم شحنتك، لدينا المركبة المناسبة بسائق موثق وسعر واضح.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {vehicles.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative bg-white rounded-3xl p-7 border ${v.border} shadow-sm hover:shadow-xl hover:shadow-[#679632]/10 transition-all duration-300 overflow-hidden group`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${v.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`} />

              <div className="relative z-10">
                {/* Icon circle */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: v.color + "18" }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24" rx="6" fill={v.color} fillOpacity="0.15" />
                    <path
                      d="M4 16h16M4 12h16M6 8h12M8 4h8"
                      stroke={v.color}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: v.color }}
                >
                  {v.en}
                </div>
                <h3 className="text-2xl font-heading font-black text-[#000201] mb-3">{v.name}</h3>
                <p className="text-[#000201]/60 text-sm leading-relaxed mb-5">{v.desc}</p>

                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: v.color + "15", color: v.color }}
                >
                  <span>⚡</span>
                  {v.capacity}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Vehicle showcase image */}
        <motion.div
          className="mt-16 rounded-3xl overflow-hidden bg-[#000201] shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 p-8 md:p-14 text-right">
              <h3 className="text-3xl md:text-4xl font-heading font-black text-white mb-4">
                اختر مركبتك
                <br />
                <span className="text-[#99C169]">من داخل التطبيق</span>
              </h3>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                واجهة سهلة تعرض لك جميع المركبات المتاحة مع أسعارها وتفاصيلها في الوقت الفعلي.
              </p>
              <button className="px-7 py-3.5 rounded-xl bg-[#679632] text-white font-bold hover:bg-[#517D2E] transition-colors shadow-lg shadow-[#679632]/30">
                جرب التطبيق الآن
              </button>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end p-6 md:p-0">
              <img
                src="/vehicles.png"
                alt="مركبات مشوار"
                className="w-full max-w-[220px] md:max-w-[260px] rounded-2xl shadow-2xl"
                style={{ objectFit: "cover", objectPosition: "top", maxHeight: "400px" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
