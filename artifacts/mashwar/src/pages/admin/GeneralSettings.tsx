import { useState } from "react";
import { Save, Plus, Trash2, ShieldCheck, User, Phone, Mail, Globe, AlertTriangle, Settings, Smartphone, Shield, CheckCircle2, X, Info, Apple, Eye, EyeOff, Laptop, Key, Clock, MoreVertical, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "support" | "finance";
  active: boolean;
  avatar?: string;
}

const ROLE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  super_admin: { label: "مدير عام", color: "#1F4A10", bg: "#D4EDA8" },
  support: { label: "دعم فني", color: "#2563eb", bg: "#dbeafe" },
  finance: { label: "موظف مالي", color: "#d97706", bg: "#fef3c7" },
};

const INITIAL_ADMINS: AdminUser[] = [
  { id: 1, name: "عبدالعزيز لويفي الحربي", email: "mshwarsh@gmail.com", role: "super_admin", active: true },
  { id: 2, name: "محمد الدوسري", email: "support@mashwar.sa", role: "support", active: true },
  { id: 3, name: "سارة العتيبي", email: "finance@mashwar.sa", role: "finance", active: false },
];

const APP_VERSIONS = [
  { platform: "ios", name: "Apple App Store", current: "2.4.1", minRequired: "2.3.0", url: "https://apps.apple.com/app/meshwar", icon: Apple },
  { platform: "android", name: "Google Play Store", current: "2.4.1", minRequired: "2.3.0", url: "https://play.google.com/store/apps/details?id=com.meshwar", icon: Smartphone },
];

const FAKE_SESSIONS = [
  { id: 1, device: "Chrome — Windows 10", ip: "192.168.1.15", lastActive: "الآن", current: true },
  { id: 2, device: "Safari — iPhone 15 Pro", ip: "10.0.0.42", lastActive: "منذ ساعتين", current: false },
  { id: 3, device: "Firefox — macOS", ip: "172.16.0.8", lastActive: "منذ 3 أيام", current: false },
];

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function GeneralSettings() {
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [tab, setTab] = useState<"app" | "versions" | "team" | "security">("app");
  
  const [appInfo, setAppInfo] = useState({
    phone: "+966 50 219 9098",
    email: "mshwarsh@gmail.com",
    website: "https://mashwar.sa",
    twitter: "https://twitter.com/mashwar_sa",
    instagram: "https://instagram.com/mashwar_sa",
    whatsapp: "+966 50 219 9098",
  });

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info"; show: boolean }>({ msg: "", type: "success", show: false });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "support" as AdminUser["role"] });
  const [twoFA, setTwoFA] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [sessions, setSessions] = useState(FAKE_SESSIONS);

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(p => ({ ...p, show: false })), 3000);
  };

  const saveAppInfo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("تم حفظ معلومات التطبيق بنجاح");
  };

  const toggleAdmin = (id: number) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    const target = admins.find(a => a.id === id);
    showToast(target?.active ? `تم إيقاف حساب ${target.name}` : `تم تفعيل حساب ${target?.name}`, "info");
  };

  const deleteAdmin = (id: number) => {
    const target = admins.find(a => a.id === id);
    if (!confirm(`حذف حساب ${target?.name} بشكل نهائي؟`)) return;
    setAdmins(prev => prev.filter(a => a.id !== id));
    showToast(`تم حذف المشرف ${target?.name}`, "error");
  };

  const addAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email) { showToast("الاسم والبريد الإلكتروني مطلوبان", "error"); return; }
    setAdmins(prev => [...prev, { id: Date.now(), ...newAdmin, active: true }]);
    setNewAdmin({ name: "", email: "", role: "support" });
    setShowAddModal(false);
    showToast(`تم إضافة المشرف ${newAdmin.name} بنجاح`);
  };

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) { showToast("جميع الحقول مطلوبة", "error"); return; }
    if (passwordForm.newPass !== passwordForm.confirm) { showToast("كلمة المرور الجديدة غير متطابقة", "error"); return; }
    if (passwordForm.newPass.length < 8) { showToast("يجب أن تكون كلمة المرور 8 أحرف على الأقل", "error"); return; }
    setPasswordForm({ current: "", newPass: "", confirm: "" });
    showToast("تم تحديث كلمة المرور بنجاح");
  };

  const revokeSession = (id: number) => {
    if (!confirm("هل أنت متأكد من إنهاء هذه الجلسة؟ سيتم تسجيل خروج الجهاز فوراً.")) return;
    setSessions(prev => prev.filter(s => s.id !== id));
    showToast("تم إنهاء الجلسة بنجاح", "info");
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border text-white font-bold text-sm flex items-center gap-3 ${
              toast.type === "success" ? "bg-green-500 border-green-400" : toast.type === "error" ? "bg-red-500 border-red-400" : "bg-[#1F4A10] border-[#679632]"
            }`}>
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5" />}
            {toast.type === "error" && <AlertTriangle className="w-5 h-5" />}
            {toast.type === "info" && <ShieldCheck className="w-5 h-5" />}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#1F4A10]">الإعدادات العامة</h2>
          <p className="text-sm text-gray-500 mt-1">إدارة معلومات التطبيق، الصلاحيات، وفريق الإدارة والأمان</p>
        </div>
      </div>

      {/* KPI Stats */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "إجمالي المشرفين", value: admins.length, icon: Users, color: "#1F4A10", bg: "#F6FAF0" },
          { label: "حسابات نشطة", value: admins.filter(a => a.active).length, icon: CheckCircle2, color: "#16a34a", bg: "#dcfce7" },
          { label: "المنصات المدعومة", value: APP_VERSIONS.length, icon: Smartphone, color: "#2563eb", bg: "#dbeafe" },
          { label: "جلسات نشطة", value: sessions.length, icon: Key, color: "#7c3aed", bg: "#ede9fe" },
        ].map((s, i) => (
          <motion.div variants={itemVariants} key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: s.bg }}>
              <s.icon className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-3xl font-heading font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-bold text-gray-500 mt-1">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row" style={{ minHeight: "600px" }}>
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50/50 border-b md:border-b-0 md:border-l border-gray-100 p-4 space-y-2 flex md:flex-col overflow-x-auto md:overflow-visible hide-scrollbar">
          {([
            { key: "app", label: "معلومات وروابط التطبيق", icon: Settings },
            { key: "versions", label: "إصدارات المنصات", icon: Smartphone },
            { key: "team", label: "فريق الإدارة والصلاحيات", icon: Users },
            { key: "security", label: "الأمان وحماية الحساب", icon: Shield },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:whitespace-normal ${
                tab === t.key ? "bg-white text-[#1F4A10] shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }`}>
              <t.icon className={`w-5 h-5 flex-shrink-0 ${tab === t.key ? "text-[#679632]" : ""}`} />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* APP INFO TAB */}
            {tab === "app" && (
              <motion.div key="app" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-3xl space-y-8">
                <div>
                  <h3 className="font-heading font-black text-[#1F4A10] text-xl mb-1">معلومات التواصل الأساسية</h3>
                  <p className="text-sm text-gray-500 mb-6">تظهر هذه المعلومات للعملاء والسائقين في التطبيق للتواصل مع الدعم</p>
                  <form onSubmit={saveAppInfo} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5"><Phone className="w-4 h-4"/> رقم خدمة العملاء</label>
                        <input value={appInfo.phone} onChange={e => setAppInfo({...appInfo, phone: e.target.value})} dir="ltr"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white text-left" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5"><Mail className="w-4 h-4"/> البريد الإلكتروني الرسمي</label>
                        <input value={appInfo.email} onChange={e => setAppInfo({...appInfo, email: e.target.value})} dir="ltr"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white text-left" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5"><Globe className="w-4 h-4"/> الموقع الإلكتروني</label>
                        <input value={appInfo.website} onChange={e => setAppInfo({...appInfo, website: e.target.value})} dir="ltr"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white text-left" />
                      </div>
                    </div>

                    <hr className="border-gray-100" />

                    <h3 className="font-heading font-black text-[#1F4A10] text-xl mb-4">حسابات التواصل الاجتماعي</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">رابط Twitter (X)</label>
                        <input value={appInfo.twitter} onChange={e => setAppInfo({...appInfo, twitter: e.target.value})} dir="ltr"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white text-left" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">رابط Instagram</label>
                        <input value={appInfo.instagram} onChange={e => setAppInfo({...appInfo, instagram: e.target.value})} dir="ltr"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white text-left" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-green-500"/> رقم WhatsApp للدعم</label>
                        <input value={appInfo.whatsapp} onChange={e => setAppInfo({...appInfo, whatsapp: e.target.value})} dir="ltr"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white text-left" />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="px-8 py-3.5 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] transition-all shadow-lg active:scale-95 flex items-center gap-2">
                        <Save className="w-4 h-4" /> حفظ التعديلات
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* VERSIONS TAB */}
            {tab === "versions" && (
              <motion.div key="versions" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading font-black text-[#1F4A10] text-xl">تحديثات المنصات</h3>
                    <p className="text-sm text-gray-500 mt-1">يُجبر التحديث الإلزامي المستخدمين على تحديث التطبيق إذا كانت نسختهم أقدم من الحد الأدنى</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {APP_VERSIONS.map((v, i) => (
                    <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute -left-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <v.icon className="w-40 h-40" />
                      </div>
                      
                      <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${v.platform === 'ios' ? 'bg-gray-100' : 'bg-green-100'}`}>
                          <v.icon className={`w-7 h-7 ${v.platform === 'ios' ? 'text-gray-800' : 'text-green-600'}`} />
                        </div>
                        <div>
                          <h4 className="font-black text-gray-800 text-lg">{v.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${v.platform === 'ios' ? 'bg-gray-100 text-gray-600' : 'bg-green-50 text-green-700'}`}>تطبيق {v.platform === 'ios' ? 'المستخدمين والسائقين' : 'المستخدمين والسائقين'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <p className="text-xs text-gray-500 font-bold mb-1">الإصدار الحالي</p>
                          <p className="font-mono text-xl font-black text-[#1F4A10]">{v.current}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                          <p className="text-xs text-red-500 font-bold mb-1">الحد الأدنى المطلوب</p>
                          <p className="font-mono text-xl font-black text-red-700">{v.minRequired}</p>
                        </div>
                      </div>

                      <div className="space-y-4 relative z-10">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5">رابط المتجر</label>
                          <input value={v.url} readOnly dir="ltr" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-600 bg-gray-50 text-left outline-none" />
                        </div>
                        <button className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors">
                          تعديل إعدادات الإصدار
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TEAM TAB */}
            {tab === "team" && (
              <motion.div key="team" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-heading font-black text-[#1F4A10] text-xl">فريق الإدارة والصلاحيات</h3>
                    <p className="text-sm text-gray-500 mt-1">التحكم في وصول الموظفين للوحة التحكم وتحديد صلاحياتهم</p>
                  </div>
                  <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F4A10] text-white text-sm font-bold hover:bg-[#2A5A14] transition-all shadow-md active:scale-95">
                    <Plus className="w-4 h-4" /> مستخدم جديد
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {admins.map((admin) => (
                    <div key={admin.id} className={`bg-white rounded-3xl p-5 border transition-all ${admin.active ? 'border-gray-100 hover:border-[#D4EDA8] hover:shadow-md' : 'border-gray-100 opacity-60'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg shadow-inner">
                          {admin.name.charAt(0)}
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${ROLE_LABELS[admin.role].bg} text-opacity-100`} style={{ color: ROLE_LABELS[admin.role].color }}>
                          {ROLE_LABELS[admin.role].label}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-gray-800 text-lg mb-0.5">{admin.name}</h4>
                      <p className="text-xs text-gray-500 font-mono mb-5">{admin.email}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div className={`relative w-10 h-5 rounded-full transition-colors ${admin.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${admin.active ? 'translate-x-5' : 'translate-x-0'}`} />
                          </div>
                          <span className={`text-xs font-bold ${admin.active ? 'text-green-700' : 'text-gray-500'}`}>{admin.active ? 'مفعّل' : 'معطل'}</span>
                          <input type="checkbox" className="hidden" checked={admin.active} onChange={() => toggleAdmin(admin.id)} />
                        </label>
                        {admin.role !== 'super_admin' && (
                          <button onClick={() => deleteAdmin(admin.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SECURITY TAB */}
            {tab === "security" && (
              <motion.div key="security" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8 max-w-4xl">
                
                {/* Password Change */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Key className="w-5 h-5 text-amber-600"/></div>
                    <div>
                      <h3 className="font-heading font-black text-[#1F4A10] text-lg">تغيير كلمة المرور</h3>
                      <p className="text-xs text-gray-500">ينصح بتغيير كلمة المرور بشكل دوري لحماية الحساب</p>
                    </div>
                  </div>

                  <form onSubmit={changePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">كلمة المرور الحالية</label>
                      <input type="password" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] bg-gray-50 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">كلمة المرور الجديدة</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} value={passwordForm.newPass} onChange={e => setPasswordForm({...passwordForm, newPass: e.target.value})}
                          className="w-full pr-4 pl-10 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] bg-gray-50 focus:bg-white" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#679632]">
                          {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">تأكيد كلمة المرور الجديدة</label>
                      <input type={showPassword ? "text" : "password"} value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] bg-gray-50 focus:bg-white" />
                    </div>
                    <button type="submit" className="px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors w-full mt-2">
                      تحديث كلمة المرور
                    </button>
                  </form>
                </div>

                {/* 2FA */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-6 h-6 text-green-600"/></div>
                    <div>
                      <h3 className="font-heading font-black text-gray-800 text-lg mb-1">المصادقة الثنائية (2FA)</h3>
                      <p className="text-sm text-gray-500">إضافة طبقة أمان إضافية لحسابك تتطلب رمزاً يتم إرساله إلى هاتفك عند تسجيل الدخول.</p>
                    </div>
                  </div>
                  <label className="relative w-14 h-7 rounded-full cursor-pointer flex-shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={twoFA} onChange={() => { setTwoFA(!twoFA); showToast(twoFA ? "تم إيقاف المصادقة الثنائية" : "تم تفعيل المصادقة الثنائية", "info"); }} />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                {/* Active Sessions */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8">
                  <h3 className="font-heading font-black text-[#1F4A10] text-lg mb-6 flex items-center gap-2"><Laptop className="w-5 h-5"/> الجلسات النشطة</h3>
                  <div className="space-y-3">
                    {sessions.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.current ? 'bg-green-100' : 'bg-gray-200'}`}>
                            {s.device.includes("iPhone") ? <Smartphone className={`w-5 h-5 ${s.current ? 'text-green-600' : 'text-gray-500'}`}/> : <Laptop className={`w-5 h-5 ${s.current ? 'text-green-600' : 'text-gray-500'}`}/>}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
                              {s.device} 
                              {s.current && <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-md">هذا الجهاز</span>}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-gray-500">
                              <span className="flex items-center gap-1"><Globe className="w-3 h-3"/>{s.ip}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{s.lastActive}</span>
                            </div>
                          </div>
                        </div>
                        {!s.current && (
                          <button onClick={() => revokeSession(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors tooltip" title="إنهاء الجلسة">
                            <LogOut className="w-4 h-4"/>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 md:p-8 space-y-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-heading font-black text-[#1F4A10] text-xl flex items-center gap-2"><User className="w-6 h-6 text-[#679632]"/> إضافة مشرف جديد</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 bg-gray-50 hover:bg-red-50 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
              </div>

              <form onSubmit={addAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">الاسم الكامل *</label>
                  <input value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} placeholder="الاسم"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">البريد الإلكتروني *</label>
                  <input type="email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} placeholder="email@example.com" dir="ltr"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all bg-gray-50 focus:bg-white text-left" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">الدور والصلاحية</label>
                  <select value={newAdmin.role} onChange={e => setNewAdmin({...newAdmin, role: e.target.value as AdminUser["role"]})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#679632] bg-white">
                    <option value="support">موظف دعم فني</option>
                    <option value="finance">موظف مالي</option>
                    <option value="super_admin">مدير عام (صلاحيات كاملة)</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="submit" className="flex-1 py-3.5 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] transition-colors">إضافة المشرف</button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors">إلغاء</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
