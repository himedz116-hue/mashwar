import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, ShieldCheck, Route, Wallet,
  Truck, Map, HeadphonesIcon, Tag, Settings,
  Menu, X, Bell, LogOut, ChevronLeft, Lock,
} from "lucide-react";
import Overview from "./admin/Overview";
import UsersManagement from "./admin/UsersManagement";
import DriverVerification from "./admin/DriverVerification";
import TripsManagement from "./admin/TripsManagement";
import FinancialManagement from "./admin/FinancialManagement";
import FleetPricing from "./admin/FleetPricing";
import Cities from "./admin/Cities";
import Support from "./admin/Support";
import Marketing from "./admin/Marketing";
import GeneralSettings from "./admin/GeneralSettings";

const ADMIN_PASSWORD = "mashwar2024";

const navItems = [
  { id: "overview",     label: "لوحة الإحصائيات",       icon: LayoutDashboard, component: Overview },
  { id: "users",        label: "إدارة المستخدمين",       icon: Users,           component: UsersManagement },
  { id: "kyc",          label: "توثيق السائقين",          icon: ShieldCheck,     component: DriverVerification },
  { id: "trips",        label: "الرحلات والطلبات",        icon: Route,           component: TripsManagement },
  { id: "finance",      label: "الشؤون المالية",          icon: Wallet,          component: FinancialManagement },
  { id: "fleet",        label: "الأسطول والتسعير",        icon: Truck,           component: FleetPricing },
  { id: "cities",       label: "المدن والنطاق الجغرافي", icon: Map,             component: Cities },
  { id: "support",      label: "الدعم الفني والشكاوى",   icon: HeadphonesIcon,  component: Support },
  { id: "marketing",    label: "التسويق والعروض",         icon: Tag,             component: Marketing },
  { id: "settings",     label: "الإعدادات العامة",        icon: Settings,        component: GeneralSettings },
];

/* ─── Login Gate ─── */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "1");
      onLogin();
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D2212] flex items-center justify-center p-4 font-body" dir="rtl">
      {/* bg glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#679632]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#1F4A10]/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4EDA8] mb-4">
            <Lock className="w-7 h-7 text-[#1F4A10]" />
          </div>
          <h1 className="font-heading font-black text-2xl text-white">لوحة تحكم مشوار</h1>
          <p className="text-[#D4EDA8]/60 text-sm mt-1">للمسؤولين فقط</p>
        </div>

        <form onSubmit={submit} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-4">
          <div>
            <label className="block text-[#D4EDA8] text-sm font-bold mb-2">كلمة المرور</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(false); }}
              placeholder="أدخل كلمة المرور"
              className={`w-full py-3 px-4 rounded-xl bg-white/10 border text-white placeholder-white/30 outline-none transition-all ${
                error ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-[#D4EDA8]"
              }`}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-red-400 text-xs flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" /> كلمة المرور غير صحيحة
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!pw || loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-l from-[#679632] to-[#1F4A10] text-white font-heading font-black text-base hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-[#1F4A10]/40"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                جاري التحقق...
              </span>
            ) : "دخول"}
          </button>
        </form>

        <p className="text-center text-[#D4EDA8]/30 text-xs mt-6">
          Mashwar Admin Dashboard · v1.0
        </p>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "1");
  const [activeId, setActiveId] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileSidebarOpen(false); }, [activeId]);

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  const active = navItems.find((n) => n.id === activeId)!;
  const ActiveSection = active.component;

  const logout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/8">
        <div className="w-9 h-9 rounded-xl bg-[#D4EDA8] flex items-center justify-center flex-shrink-0">
          <span className="font-heading font-black text-[#1F4A10] text-sm">م</span>
        </div>
        {sidebarOpen && (
          <div>
            <p className="font-heading font-black text-white text-sm leading-tight">مشوار</p>
            <p className="text-[#D4EDA8]/50 text-[10px]">لوحة التحكم</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              title={!sidebarOpen ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group relative ${
                isActive
                  ? "bg-gradient-to-l from-[#2A5A14] to-[#1F4A10] text-white shadow-lg shadow-black/20"
                  : "text-[#D4EDA8]/60 hover:text-white hover:bg-white/8"
              }`}
            >
              {isActive && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#D4EDA8] rounded-l-full" />
              )}
              <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? "text-[#D4EDA8]" : "text-[#D4EDA8]/40 group-hover:text-[#D4EDA8]/70"}`} style={{ width: 18, height: 18 }} />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/8 p-3 space-y-1">
        {sidebarOpen && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#D4EDA8] flex items-center justify-center flex-shrink-0">
              <span className="font-black text-[#1F4A10] text-xs">م</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">المدير العام</p>
              <p className="text-[#D4EDA8]/40 text-[10px] truncate">mshwarsh@gmail.com</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#D4EDA8]/50 hover:text-red-400 hover:bg-red-500/10 text-sm transition-all"
          title={!sidebarOpen ? "تسجيل الخروج" : undefined}
        >
          <LogOut className="flex-shrink-0" style={{ width: 16, height: 16 }} />
          {sidebarOpen && <span className="text-xs font-bold">تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F0F5EA] font-body overflow-hidden" dir="rtl">

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#0D2212] transition-all duration-300 ease-in-out flex-shrink-0 ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-72 bg-[#0D2212] flex flex-col h-full z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3 px-4 md:px-6 h-14">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#4A5568]/50 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop collapse */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 rounded-lg text-[#4A5568]/50 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`} />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-[#4A5568]/40 text-sm hidden md:block">لوحة التحكم</span>
              <span className="text-[#4A5568]/30 hidden md:block">/</span>
              <h1 className="font-heading font-black text-[#1F4A10] text-sm truncate">{active.label}</h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg text-[#4A5568]/50 hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                {notifOpen && (
                  <div className="absolute top-12 left-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-[#1F4A10] text-sm">الإشعارات</h3>
                      <button onClick={() => setNotifOpen(false)} className="text-[#4A5568]/40 hover:text-[#4A5568]"><X className="w-4 h-4" /></button>
                    </div>
                    {[
                      { text: "طلب توثيق جديد من عبدالعزيز السلمي", time: "منذ 5 دقائق", dot: "bg-amber-400" },
                      { text: "شكوى جديدة من محمد الأحمد (#TK-301)", time: "منذ 23 دقيقة", dot: "bg-red-400" },
                      { text: "طلب سحب أرباح من خالد القحطاني", time: "منذ ساعة", dot: "bg-blue-400" },
                    ].map((n, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-[#F6FAF0] transition-colors border-b border-gray-50 last:border-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#1F4A10] leading-5">{n.text}</p>
                          <p className="text-xs text-[#4A5568]/40 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
                <span className="font-black text-[#1F4A10] text-sm">م</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <ActiveSection />
        </main>
      </div>
    </div>
  );
}
