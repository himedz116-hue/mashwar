import { motion } from "framer-motion";
import { Truck, Car, Package } from "lucide-react"; // Fallbacks just in case

const vehicles = [
  {
    id: "wanette",
    name: "وانيت",
    desc: "مناسب لنقل الأغراض الخفيفة، المشاوير السريعة، وتوصيل طلبات المتاجر.",
    color: "bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "sath-ha",
    name: "سطحة",
    desc: "لنقل السيارات المعطلة، المركبات الجديدة، والمعدات الثقيلة بأمان.",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "dina",
    name: "دينا",
    desc: "الخيار الأمثل لنقل أثاث المنازل، بضائع المستودعات، والمواد الكبيرة.",
    color: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    id: "dina-winch",
    name: "دينا ونش",
    desc: "مجهزة برافعة لرفع ونقل المعدات والبضائع الثقيلة التي تتطلب جهداً.",
    color: "bg-purple-100 dark:bg-purple-900/30",
  }
];

export default function VehicleTypes() {
  return (
    <section id="vehicles" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            أسطول متكامل لاحتياجاتك
          </h2>
          <p className="text-muted-foreground text-lg">
            مهما كان حجم حمولتك، لدينا المركبة المناسبة لنقلها بكل سهولة وبأسعار تنافسية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-16 h-16 rounded-xl ${vehicle.color} flex items-center justify-center mb-6`}>
                <Truck className="w-8 h-8 text-foreground opacity-80" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">{vehicle.name}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {vehicle.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
