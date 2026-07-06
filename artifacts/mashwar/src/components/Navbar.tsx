import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "#hero" },
    { name: "مركباتنا", href: "#vehicles" },
    { name: "كيف يعمل", href: "#how-it-works" },
    { name: "المميزات", href: "#features" },
    { name: "عملاؤنا", href: "#customers" },
  ];

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-[#679632]/10 py-3 border-b border-[#679632]/10"
          : "bg-white/80 backdrop-blur-sm py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("#hero")}>
          <img src="/logo.png" alt="مشوار" className="h-9 w-auto" />
        </div>

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

        <button
          className="md:hidden text-[#000201] p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-b border-[#679632]/10 shadow-xl p-5 flex flex-col gap-4">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <button
                  onClick={() => scrollTo(link.href)}
                  className="w-full text-right py-3 px-4 rounded-lg hover:bg-[#679632]/5 text-[#000201]/80 font-medium"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 pt-3 border-t border-[#679632]/15">
            <button className="w-full py-3 text-center font-bold rounded-lg border border-[#679632] text-[#679632]">
              حمل التطبيق
            </button>
            <button className="w-full py-3 text-center font-bold rounded-lg bg-[#679632] text-white">
              سجل كسائق
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
