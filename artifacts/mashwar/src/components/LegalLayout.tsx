import { motion } from "framer-motion";
import { Link } from "wouter";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface Section {
  title: string;
  content: React.ReactNode;
}

interface LegalLayoutProps {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
  icon: React.ReactNode;
}

export default function LegalLayout({ badge, title, subtitle, lastUpdated, sections, icon }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F6FAF0] font-body" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#1F4A10] overflow-hidden pt-24 pb-20">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#679632]/20 blur-3xl" />
          <div className="absolute -bottom-12 left-0 w-80 h-80 rounded-full bg-[#D4EDA8]/10 blur-3xl" />
          <svg className="absolute bottom-0 left-0 right-0 w-full opacity-10" viewBox="0 0 1440 80" fill="none">
            <path d="M0 80L1440 0V80H0Z" fill="white" />
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#D4EDA8]/70 hover:text-[#D4EDA8] text-sm mb-8 transition-colors group"
          >
            <svg className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            العودة للرئيسية
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#D4EDA8]/15 border border-[#D4EDA8]/25 flex items-center justify-center text-[#D4EDA8] flex-shrink-0">
              {icon}
            </div>

            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4EDA8]/15 border border-[#D4EDA8]/25 text-[#D4EDA8] text-xs font-bold mb-3">
                {badge}
              </span>
              <h1 className="text-3xl md:text-5xl font-heading font-black text-white leading-tight mb-2">
                {title}
              </h1>
              <p className="text-white/60 text-sm">{subtitle}</p>
            </div>
          </motion.div>

          {/* Last updated */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/8 border border-white/12 text-white/50 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            آخر تحديث: {lastUpdated}
          </div>
        </div>
      </section>

      {/* Table of contents + Content */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Sticky TOC */}
          <aside className="lg:w-72 flex-shrink-0 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-[#3D6B2C]/12 p-6 shadow-sm">
              <h2 className="text-[#1F4A10] font-heading font-black text-base mb-4">المحتويات</h2>
              <ul className="space-y-1.5">
                {sections.map((s, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="flex items-center gap-2.5 text-sm text-[#4A7A2A]/70 hover:text-[#3D6B2C] hover:bg-[#D4EDA8]/30 px-3 py-2 rounded-xl transition-all group"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#D4EDA8] text-[#3D6B2C] text-[10px] font-black flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        {i + 1}
                      </span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact card */}
            <div className="bg-[#1F4A10] rounded-2xl p-6 mt-5 text-white">
              <p className="font-heading font-black text-sm mb-1">هل لديك سؤال؟</p>
              <p className="text-white/60 text-xs mb-4">تواصل معنا مباشرة</p>
              <a
                href="mailto:mshwarsh@gmail.com"
                className="block text-center bg-[#D4EDA8] text-[#1F4A10] rounded-xl py-2.5 text-sm font-black hover:bg-white transition-colors"
              >
                راسلنا الآن
              </a>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              {sections.map((section, i) => (
                <motion.div
                  key={i}
                  id={`section-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="bg-white rounded-2xl border border-[#3D6B2C]/10 p-7 shadow-sm hover:shadow-md hover:border-[#3D6B2C]/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-8 h-8 rounded-xl bg-[#D4EDA8] text-[#1F4A10] text-sm font-black flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <h2 className="text-[#1F4A10] font-heading font-black text-lg">{section.title}</h2>
                  </div>
                  <div className="text-[#4A5568] text-sm leading-8 space-y-3">
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
