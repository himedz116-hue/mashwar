import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, ShieldCheck, Route, Wallet,
  Truck, Map, HeadphonesIcon, Tag, Settings,
  Menu, X, Bell, LogOut, ChevronLeft, Lock,
  Car, MessageSquare, BookOpen, User, DollarSign,
  Send, BarChart2,
} from "lucide-react";
import { adminLogin, adminLogout, setAdminToken, clearAdminToken, getAdminToken } from "@/lib/meshwarApi";

// Sections
import Overview from "./admin/Overview";
import UsersSection from "./admin/UsersSection";
import DriversManagement from "./admin/DriversManagement";
import DriversKYC from "./admin/DriversKYC";
import OrdersManagement from "./admin/OrdersManagement";
import FinancialManagement from "./admin/FinancialManagement";
import CarTypesManagement from "./admin/CarTypesManagement";
import CarsManagement from "./admin/CarsManagement";
import CitiesManagement from "./admin/CitiesManagement";
import IntroductionsManagement from "./admin/IntroductionsManagement";
import MessagesCenter from "./admin/MessagesCenter";
import NotificationsCenter from "./admin/NotificationsCenter";
import AppSettings from "./admin/AppSettings";
import AdminProfile from "./admin/AdminProfile";
import Support from "./admin/Support";
import Marketing from "./admin/Marketing";

const navGroups = [
  {
    label: "الرئيسية",
    items: [
      { id: "overview",       label: "لوحة الإحصائيات",        icon: LayoutDashboard,  component: Overview },
    ],
  },
  {
    label: "المستخدمون",
    items: [
      { id: "users",          label: "إدارة المستخدمين",        icon: Users,            component: UsersSection },
      { id: "drivers",        label: "إدارة السائقين",           icon: Car,              component: DriversManagement },
      { id: "kyc",            label: "توثيق السائقين",           icon: ShieldCheck,      component: DriversKYC },
    ],
  },
  {
    label: "العمليات",
    items: [
      { id: "orders",         label: "الطلبات والرحلات",         icon: Route,            component: OrdersManagement },
      { id: "finance",        label: "الشؤون المالية",           icon: Wallet,           component: FinancialManagement },
      { id: "messages",       label: "مركز الرسائل",             icon: MessageSquare,    component: MessagesCenter },
      { id: "notifications",  label: "مركز الإشعارات",           icon: Send,             component: NotificationsCenter },
    ],
  },
  {
    label: "الإدارة",
    items: [
      { id: "car-types",      label: "أنواع السيارات والتسعير",  icon: Truck,            component: CarTypesManagement },
      { id: "cars",           label: "إدارة السيارات",           icon: Car,              component: CarsManagement },
      { id: "cities",         label: "المدن والنطاق الجغرافي",   icon: Map,              component: CitiesManagement },
      { id: "introductions",  label: "شرائح تعريف التطبيق",      icon: BookOpen,         component: IntroductionsManagement },
    ],
  },
  {
    label: "الدعم والتسويق",
    items: [
      { id: "support",        label: "الدعم الفني والشكاوى",     icon: HeadphonesIcon,   component: Support },
      { id: "marketing",      label: "التسويق والعروض",          icon: Tag,              component: Marketing },
    ],
  },
  {
    label: "الحساب",
    items: [
      { id: "profile",        label: "الملف الشخصي",             icon: User,             component: AdminProfile },
      { id: "settings",       label: "الإعدادات العامة",          icon: Settings,         component: AppSettings },
    ],
  },
];

const allItems = navGroups.flatMap((g) => g.items);

/* ─── Login Gate ─── */
function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await adminLogin({ email, password: pw });
      if (res.data?.token) {
        onLogin(res.data.token);
      } else {
        setError("بيانات الدخول غير صحيحة");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "بيانات الدخول غير صحيحة";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D2212] flex items-center justify-center p-4 font-body" dir="rtl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#679632]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#1F4A10]/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2A5A14]/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4EDA8] to-[#a8d060] mb-4 shadow-lg shadow-[#1F4A10]/50">
            <Lock className="w-7 h-7 text-[#1F4A10]" />
          </div>
          <h1 className="font-heading font-black text-2xl text-white">لوحة تحكم مشوار</h1>
          <p className="text-[#D4EDA8]/60 text-sm mt-1">للمسؤولين فقط · Admin Only</p>
        </div>

        <form onSubmit={submit} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-4">
          <div>
            <label className="block text-[#D4EDA8] text-sm font-bold mb-2">البريد الإلكتروني</label>
            <input
              type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="admin@example.com"
              className="w-full py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 outline-none focus:border-[#D4EDA8] transition-all"
              autoFocus
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-[#D4EDA8] text-sm font-bold mb-2">كلمة المرور</label>
            <input
              type="password" value={pw} onChange={(e) => { setPw(e.target.value); setError(""); }}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`w-full py-3 px-4 rounded-xl bg-white/10 border text-white placeholder-white/30 outline-none transition-all ${
                error ? "border-red-400" : "border-white/20 focus:border-[#D4EDA8]"
              }`}
            />
          </div>
          {error && (
            <p className="text-red-400 text-xs flex items-center gap-1.5 bg-red-500/10 px-3 py-2 rounded-xl">
              <X className="w-3.5 h-3.5 flex-shrink-0" /> {error}
            </p>
          )}
          <button
            type="submit" disabled={!email || !pw || loading}
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

        <p className="text-center text-[#D4EDA8]/30 text-xs mt-6">Mashwar Admin Dashboard · v2.0</p>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function Admin() {
  const [authed, setAuthed] = useState(() => !!getAdminToken());
  const [activeId, setActiveId] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => { setMobileSidebarOpen(false); }, [activeId]);

  const handleLogin = (token: string) => {
    setAdminToken(token);
    setAuthed(true);
  };

  const logout = async () => {
    try { await adminLogout(); } catch { /* ignore */ }
    clearAdminToken();
    setAuthed(false);
  };

  if (!authed) return <AdminLogin onLogin={handleLogin} />;

  const active = allItems.find((n) => n.id === activeId) ?? allItems[0];
  const ActiveSection = active.component;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/8 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4EDA8] to-[#a8d060] flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="font-heading font-black text-[#1F4A10] text-sm">م</span>
        </div>
        {sidebarOpen && (
          <div>
            <p className="font-heading font-black text-white text-sm leading-tight">مشوار</p>
            <p className="text-[#D4EDA8]/40 text-[10px]">لوحة التحكم v2</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-hide space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {sidebarOpen && (
              <p className="px-3 mb-1 text-[10px] font-black text-[#D4EDA8]/25 uppercase tracking-widest">{group.label}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id} onClick={() => setActiveId(item.id)}
                    title={!sidebarOpen ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group relative ${
                      isActive
                        ? "bg-gradient-to-l from-[#2A5A14] to-[#1F4A10] text-white shadow-lg shadow-black/20"
                        : "text-[#D4EDA8]/55 hover:text-white hover:bg-white/6"
                    }`}
                  >
                    {isActive && <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#D4EDA8] rounded-l-full" />}
                    <item.icon
                      className={`flex-shrink-0 transition-colors ${isActive ? "text-[#D4EDA8]" : "text-[#D4EDA8]/35 group-hover:text-[#D4EDA8]/60"}`}
                      style={{ width: 17, height: 17 }}
                    />
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/8 p-3 flex-shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#D4EDA8]/40 hover:text-red-400 hover:bg-red-500/10 text-sm transition-all"
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
      <aside className={`hidden lg:flex flex-col bg-[#0D2212] transition-all duration-300 ease-in-out flex-shrink-0 ${sidebarOpen ? "w-64" : "w-[60px]"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-72 bg-[#0D2212] flex flex-col h-full z-10 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3 px-4 md:px-6 h-14">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`} />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-gray-400 text-sm hidden md:block">لوحة التحكم</span>
              <span className="text-gray-300 hidden md:block">/</span>
              <h1 className="font-heading font-black text-[#1F4A10] text-sm truncate">{active.label}</h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Section count badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F6FAF0] border border-[#D4EDA8]">
                <BarChart2 className="w-3.5 h-3.5 text-[#679632]" />
                <span className="text-xs font-bold text-[#679632]">{allItems.length} قسم</span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>
                {notifOpen && (
                  <div className="absolute top-12 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-[#1F4A10] text-sm">الإشعارات</h3>
                      <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                    </div>
                    {[
                      { text: "طلب توثيق جديد ينتظر المراجعة", time: "منذ 5 دقائق", dot: "bg-amber-400" },
                      { text: "شكوى مستخدم جديدة تحتاج رداً", time: "منذ 23 دقيقة", dot: "bg-red-400" },
                      { text: "طلب سحب أرباح من سائق", time: "منذ ساعة", dot: "bg-blue-400" },
                      { text: "تسجيل 12 مستخدم جديد اليوم", time: "منذ ساعتين", dot: "bg-green-400" },
                    ].map((n, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-[#F6FAF0] transition-colors border-b border-gray-50 last:border-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#1F4A10] leading-5">{n.text}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4EDA8] to-[#a8d060] flex items-center justify-center cursor-pointer" onClick={() => setActiveId("profile")}>
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
