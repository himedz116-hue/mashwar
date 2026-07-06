import { motion } from "framer-motion";

const vehicles = [
  {
    id: "wanette",
    name: "وانيت",
    en: "Pickup Truck",
    desc: "مناسب لنقل الأغراض الخفيفة والطرود والمشاوير السريعة داخل المدينة.",
    capacity: "حتى ١ طن",
    color: "#679632",
    imgBg: "from-[#99C169]/20 to-[#EFF7E8]",
    border: "border-[#99C169]/40",
    img: "/vehicle-pickup.png",
  },
  {
    id: "satha",
    name: "سطحة",
    en: "Flatbed",
    desc: "لنقل السيارات المعطلة، المركبات الجديدة، والمعدات الثقيلة بأمان تام.",
    capacity: "حتى ٣ أطنان",
    color: "#679632",
    imgBg: "from-[#679632]/20 to-[#EFF7E8]",
    border: "border-[#679632]/40",
    img: "/vehicle-flatbed.png",
  },
  {
    id: "dina",
    name: "دينا",
    en: "Medium Truck",
    desc: "الخيار الأمثل لنقل أثاث المنازل وبضائع المستودعات والمواد الكبيرة.",
    capacity: "حتى ٥ أطنان",
    color: "#679632",
    imgBg: "from-[#517D2E]/20 to-[#EFF7E8]",
    border: "border-[#517D2E]/40",
    img: "/vehicle-dina.png",
  },
  {
    id: "dina-winch",
    name: "دينا ونش",
    en: "Crane Truck",
    desc: "مجهزة برافعة لرفع ونقل المعدات الثقيلة التي تحتاج إلى جهد إضافي.",
    capacity: "حتى ٨ أطنان",
    color: "#679632",
    imgBg: "from-[#3a5c1e]/20 to-[#EFF7E8]",
    border: "border-[#3a5c1e]/40",
    img: "/vehicle-crane.png",
  },
];

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
              className={`relative bg-white rounded-3xl border ${v.border} shadow-sm hover:shadow-xl hover:shadow-[#679632]/10 transition-all duration-300 overflow-hidden group`}
            >
              {/* Vehicle image area */}
              <div className={`bg-gradient-to-b ${v.imgBg} px-6 pt-6 pb-2 flex items-end justify-center h-[160px]`}>
                <motion.img
                  src={v.img}
                  alt={v.name}
                  className="w-full max-w-[200px] object-contain drop-shadow-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Card content */}
              <div className="p-6 text-right">
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-1.5"
                  style={{ color: v.color }}
                >
                  {v.en}
                </div>
                <h3 className="text-2xl font-heading font-black text-[#000201] mb-2">{v.name}</h3>
                <p className="text-[#000201]/60 text-sm leading-relaxed mb-4">{v.desc}</p>
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
