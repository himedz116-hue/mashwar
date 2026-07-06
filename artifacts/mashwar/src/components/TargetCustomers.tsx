import { motion } from "framer-motion";
import { User, Store, Building2, Box } from "lucide-react";

const customers = [
  {
    icon: <User className="w-10 h-10" />,
    title: "الأفراد",
    desc: "لنقل الأثاث، والأغراض الشخصية، والمشتريات الكبيرة من المتاجر إلى منزلك."
  },
  {
    icon: <Store className="w-10 h-10" />,
    title: "أصحاب المتاجر",
    desc: "لتوصيل بضائع متجرك للعملاء أو نقلها من الموردين بسرعة وكفاءة."
  },
  {
    icon: <Building2 className="w-10 h-10" />,
    title: "شركات المقاولات",
    desc: "لنقل المعدات الثقيلة، مواد البناء، والآليات بين مواقع العمل بسهولة."
  },
  {
    icon: <Box className="w-10 h-10" />,
    title: "المستودعات",
    desc: "لإدارة لوجستيات التوزيع ونقل الشحنات الضخمة بين المخازن ونقاط البيع."
  }
];

export default function TargetCustomers() {
  return (
    <section id="customers" className="py-20 bg-muted/40 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          <div className="md:w-1/3">
            <motion.h2 
              className="text-3xl md:text-4xl font-heading font-bold mb-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              الكل يعتمد على مشوار
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg mb-8 leading-relaxed"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              صممنا منصتنا لتلبي احتياجات شريحة واسعة من المستخدمين. من مشوار صغير لنقل أريكة، إلى أسطول لنقل مواد بناء.
            </motion.p>
          </div>

          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {customers.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-card p-6 rounded-2xl shadow-sm border border-border"
              >
                <div className="text-primary mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
