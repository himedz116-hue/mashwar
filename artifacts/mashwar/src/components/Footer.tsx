export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#517D2E] text-white/80">
      <div className="container mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 pb-12 border-b border-white/15">
          {/* Brand */}
          <div className="md:col-span-1">
            <img src="/logo.png" alt="مشوار" className="h-9 w-auto mb-5 brightness-0 invert" />
            <p className="text-sm leading-relaxed mb-6 text-white/65">
              منصة حجز مركبات النقل الرائدة في المملكة العربية السعودية ودول الخليج.
            </p>
            <div className="flex gap-3">
              {["X", "in", "ig"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-sm font-bold hover:bg-white hover:text-[#679632] transition-all duration-300"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-heading font-black mb-5">روابط سريعة</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "الرئيسية", href: "#hero" },
                { label: "مركباتنا", href: "#vehicles" },
                { label: "المميزات", href: "#features" },
                { label: "تواصل معنا", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-heading font-black mb-5">قانونية</h3>
            <ul className="space-y-3 text-sm">
              {["الشروط والأحكام", "سياسة الخصوصية", "شروط السائقين", "الأسئلة الشائعة"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-heading font-black mb-5">تواصل معنا</h3>
            <ul className="space-y-3 text-sm mb-6">
              <li>الدعم: 920000000</li>
              <li>info@mashwar.app</li>
            </ul>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white hover:text-[#679632] transition-all text-sm font-bold"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </a>
              <a
                href="#"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4EDA8]/20 border border-[#D4EDA8]/30 hover:bg-[#D4EDA8]/30 text-[#D4EDA8] transition-all text-sm font-bold"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.16.64.24.99.21l12.59-7.27-2.62-2.62-10.96 9.68zM.93 1.91C.35 2.46 0 3.3 0 4.37v15.26c0 1.07.35 1.91.93 2.46l.13.12 8.55-8.55v-.2L1.06 1.78l-.13.13zM19.72 10.42l-2.45-1.41-2.93 2.93 2.93 2.93 2.46-1.42c.7-.4.7-1.06-.01-1.03zM4.17.24L16.76 7.5l-2.62 2.62L3.18.44c.35-.34.65-.34.99-.2z"/>
                </svg>
                Google Play
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-sm gap-4 text-white/50">
          <p>© {year} شركة مشوار لتقنية المعلومات. جميع الحقوق محفوظة.</p>
          <p className="text-[#D4EDA8] font-bold">صُنع بفخر في السعودية</p>
        </div>
      </div>
    </footer>
  );
}
