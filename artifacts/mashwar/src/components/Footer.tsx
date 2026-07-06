import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-4xl font-heading font-black text-primary">مشوار</span>
            </Link>
            <p className="mb-6 leading-relaxed">
              التطبيق الرائد لحجز مركبات النقل في المملكة العربية السعودية والخليج.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-background mb-6">روابط سريعة</h3>
            <ul className="space-y-3">
              <li><a href="#hero" className="hover:text-primary transition-colors">الرئيسية</a></li>
              <li><a href="#vehicles" className="hover:text-primary transition-colors">المركبات</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">المميزات</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">تواصل معنا</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-background mb-6">شروط وأحكام</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">الشروط والأحكام</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">شروط السائقين</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">الأسئلة الشائعة</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-background mb-6">تواصل معنا</h3>
            <ul className="space-y-3">
              <li>الدعم الفني: 920000000</li>
              <li>البريد: info@mashwar.app</li>
              <li className="pt-4 flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">X</a>
                <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">in</a>
                <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">ig</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>© {new Date().getFullYear()} شركة مشوار لتقنية المعلومات. جميع الحقوق محفوظة.</p>
          <div className="mt-4 md:mt-0">
            صُنع بفخر في السعودية
          </div>
        </div>
      </div>
    </footer>
  );
}
