import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const footerSections = [
  {
    title: "روابط سريعة",
    links: [
      { label: "الرئيسية", href: "#hero" },
      { label: "مركباتنا", href: "#vehicles" },
      { label: "المميزات", href: "#features" },
      { label: "تواصل معنا", href: "/contact" },
    ],
  },
  {
    title: "قانونية",
    links: [
      { label: "الشروط والأحكام", href: "/terms" },
      { label: "سياسة الخصوصية", href: "/privacy" },
      { label: "شروط السائقين", href: "/driver-terms" },
      { label: "الأسئلة الشائعة", href: "/faq" },
    ],
  },
];

function AccordionSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        className="w-full flex items-center justify-between py-4 text-right"
        onClick={() => setOpen(!open)}
      >
        <ChevronDown
          size={18}
          className={`text-white/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        <span className="text-white font-heading font-black text-sm">{title}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 flex flex-col gap-2.5 text-right">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/65 text-sm hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#517D2E] text-white/80">
      <div className="container mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-8">

        {/* ── Desktop grid ── */}
        <div className="hidden md:grid md:grid-cols-4 gap-10 mb-12 pb-12 border-b border-white/15">
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
                { label: "تواصل معنا", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-heading font-black mb-5">قانونية</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "الشروط والأحكام", href: "/terms" },
                { label: "سياسة الخصوصية", href: "/privacy" },
                { label: "شروط السائقين", href: "/driver-terms" },
                { label: "الأسئلة الشائعة", href: "/faq" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-white transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-heading font-black mb-5">تواصل معنا</h3>
            <ul className="space-y-3 text-sm mb-6">
              <li><a href="tel:+966502199098" className="hover:text-white transition-colors">‎+966 50 219 9098</a></li>
              <li><a href="mailto:mshwarsh@gmail.com" className="hover:text-white transition-colors">mshwarsh@gmail.com</a></li>
              <li className="text-white/50 text-xs leading-6">بريدة، حي الفلاح، شارع عزيزة بنت مشرف</li>
            </ul>
            <div className="flex flex-col gap-3">
              <a href="#" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white hover:text-[#679632] transition-all text-sm font-bold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </a>
              <a href="#" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4EDA8]/20 border border-[#D4EDA8]/30 hover:bg-[#D4EDA8]/30 text-[#D4EDA8] transition-all text-sm font-bold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.16.64.24.99.21l12.59-7.27-2.62-2.62-10.96 9.68zM.93 1.91C.35 2.46 0 3.3 0 4.37v15.26c0 1.07.35 1.91.93 2.46l.13.12 8.55-8.55v-.2L1.06 1.78l-.13.13zM19.72 10.42l-2.45-1.41-2.93 2.93 2.93 2.93 2.46-1.42c.7-.4.7-1.06-.01-1.03zM4.17.24L16.76 7.5l-2.62 2.62L3.18.44c.35-.34.65-.34.99-.2z"/>
                </svg>
                Google Play
              </a>
            </div>
          </div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="md:hidden">
          {/* Brand row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2.5">
              {["X", "in", "ig"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs font-bold hover:bg-white hover:text-[#679632] transition-all duration-200"
                >
                  {s}
                </a>
              ))}
            </div>
            <img src="/logo.png" alt="مشوار" className="h-8 w-auto brightness-0 invert" />
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-6 text-white/60 text-right">
            منصة حجز مركبات النقل الرائدة في المملكة العربية السعودية ودول الخليج.
          </p>

          {/* Accordion sections */}
          <div className="mb-4">
            {footerSections.map((section) => (
              <AccordionSection key={section.title} title={section.title} links={section.links} />
            ))}

            {/* Contact as accordion */}
            <AccordionSection
              title="تواصل معنا"
              links={[
                { label: "+966 50 219 9098", href: "tel:+966502199098" },
                { label: "mshwarsh@gmail.com", href: "mailto:mshwarsh@gmail.com" },
              ]}
            />
          </div>

          {/* Download buttons — horizontal on mobile */}
          <div className="flex gap-3 mb-6">
            <a
              href="#"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-[#000201] text-xs font-black"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              App Store
            </a>
            <a
              href="#"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#D4EDA8]/20 border border-[#D4EDA8]/30 text-[#D4EDA8] text-xs font-black"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.3.16.64.24.99.21l12.59-7.27-2.62-2.62-10.96 9.68zM.93 1.91C.35 2.46 0 3.3 0 4.37v15.26c0 1.07.35 1.91.93 2.46l.13.12 8.55-8.55v-.2L1.06 1.78l-.13.13zM19.72 10.42l-2.45-1.41-2.93 2.93 2.93 2.93 2.46-1.42c.7-.4.7-1.06-.01-1.03zM4.17.24L16.76 7.5l-2.62 2.62L3.18.44c.35-.34.65-.34.99-.2z"/>
              </svg>
              Google Play
            </a>
          </div>

          <div className="h-px bg-white/15 mb-5" />
        </div>

        {/* Bottom bar — both layouts */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm gap-2 md:gap-4 text-white/50">
          <p className="text-center md:text-right">© {year} شركة مشوار لتقنية المعلومات. جميع الحقوق محفوظة.</p>
          <p className="text-[#D4EDA8] font-bold">صُنع بفخر في السعودية 🇸🇦</p>
        </div>
      </div>
    </footer>
  );
}
