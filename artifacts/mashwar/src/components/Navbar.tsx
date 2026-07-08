import { useState, useEffect } from "react";
import { Menu, X, Home, Truck, Zap, Star, Users } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const scrollTo = (hash: string) => {
    setIsMobileMenuOpen(false);
    const id = hash.replace("#", "");
    if (location === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const goHome = () => {
    setIsMobileMenuOpen(false);
    if (location === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const navLinks = [
    { name: "الرئيسية", href: "#hero", icon: <Home size={18} /> },
    { name: "مركباتنا", href: "#vehicles", icon: <Truck size={18} /> },
    { name: "كيف يعمل", href: "#how-it-works", icon: <Zap size={18} /> },
    { name: "المميزات", href: "#features", icon: <Star size={18} /> },
    { name: "عملاؤنا", href: "#customers", icon: <Users size={18} /> },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-[#679632]/10 py-3 border-b border-[#679632]/10"
            : "bg-white/80 backdrop-blur-sm py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
            <img src="/logo.png" alt="مشوار" className="h-9 w-auto" />
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-7">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="font-medium text-sm text-[#000201]/70 hover:text-[#679632] transition-colors duration-200"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 mr-2">
              <button
                onClick={() => scrollTo("#download")}
                className="px-5 py-2.5 text-sm font-bold rounded-lg border border-[#679632] text-[#679632] hover:bg-[#679632]/5 transition-all duration-200"
              >
                حمل التطبيق
              </button>
              <button
                onClick={() => scrollTo("#download")}
                className="px-5 py-2.5 text-sm font-bold rounded-lg bg-[#679632] text-white hover:bg-[#517D2E] transition-all duration-200 shadow-lg shadow-[#679632]/30"
              >
                سجل كسائق
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-[#679632]/8 text-[#000201]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.92 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile fullscreen menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-40 w-[85%] max-w-xs bg-white md:hidden flex flex-col shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#679632]/10">
                <img src="/logo.png" alt="مشوار" className="h-8 w-auto" />
                <div className="w-2 h-2 rounded-full bg-[#679632] animate-pulse" />
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.25 }}
                    >
                      <button
                        onClick={() => scrollTo(link.href)}
                        className="w-full flex items-center gap-4 text-right py-3.5 px-4 rounded-2xl hover:bg-[#679632]/8 text-[#000201]/80 font-medium transition-all duration-200 group"
                      >
                        <span className="w-9 h-9 rounded-xl bg-[#679632]/10 text-[#679632] flex items-center justify-center flex-shrink-0 group-hover:bg-[#679632] group-hover:text-white transition-all duration-200">
                          {link.icon}
                        </span>
                        <span className="flex-1 text-base">{link.name}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#679632]/40">
                          <path d="M9 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </motion.li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="my-4 h-px bg-[#679632]/10" />

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-around py-4 rounded-2xl bg-[#F7FAF4] border border-[#679632]/10"
                >
                  {[
                    { v: "+١٠٠٠", l: "سائق" },
                    { v: "+٥٠٠٠", l: "طلب" },
                    { v: "٤.٩★", l: "تقييم" },
                  ].map((s) => (
                    <div key={s.l} className="text-center">
                      <div className="text-base font-black text-[#679632]">{s.v}</div>
                      <div className="text-[#000201]/40 text-xs mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* CTA buttons at bottom */}
              <motion.div
                className="px-4 pb-6 pt-3 flex flex-col gap-2.5 border-t border-[#679632]/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={() => scrollTo("#download")}
                  className="w-full py-3.5 text-center font-black rounded-2xl bg-[#679632] text-white shadow-lg shadow-[#679632]/25 text-sm"
                >
                  حمل التطبيق الآن
                </button>
                <button
                  onClick={() => scrollTo("#download")}
                  className="w-full py-3.5 text-center font-bold rounded-2xl border-2 border-[#679632]/30 text-[#679632] text-sm"
                >
                  سجل كسائق
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
