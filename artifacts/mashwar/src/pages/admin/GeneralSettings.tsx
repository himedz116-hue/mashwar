import { useState } from "react";
import { Save, Plus, Trash2, ShieldCheck, User, Phone, Mail, Globe, AlertTriangle } from "lucide-react";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "support" | "finance";
  active: boolean;
}

const roleLabels: Record<string, string> = {
  super_admin: "مدير عام",
  support: "موظف دعم فني",
  finance: "موظف مالي",
};

const roleColors: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700",
  support: "bg-blue-100 text-blue-700",
  finance: "bg-amber-100 text-amber-700",
};

const initialAdmins: AdminUser[] = [
  { id: 1, name: "عبدالعزيز لويفي الحربي", email: "mshwarsh@gmail.com", role: "super_admin", active: true },
  { id: 2, name: "محمد الدوسري", email: "support@mashwar.sa", role: "support", active: true },
  { id: 3, name: "سارة العتيبي", email: "finance@mashwar.sa", role: "finance", active: false },
];

const appVersions = [
  { platform: "iOS", current: "2.4.1", minRequired: "2.3.0", store: "App Store" },
  { platform: "Android", current: "2.4.1", minRequired: "2.3.0", store: "Google Play" },
];

export default function GeneralSettings() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [tab, setTab] = useState<"app" | "versions" | "roles">("app");
  const [saved, setSaved] = useState(false);

  const [appInfo, setAppInfo] = useState({
    phone: "+966 50 219 9098",
    email: "mshwarsh@gmail.com",
    website: "https://mashwar.sa",
    twitter: "https://twitter.com/mashwar_sa",
    instagram: "https://instagram.com/mashwar_sa",
    whatsapp: "+966 50 219 9098",
  });

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleAdmin = (id: number) => {
    setAdmins((prev) => prev.map((a) => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAdmin = (id: number) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">الإعدادات العامة للنظام</h2>
        <p className="text-[#4A5568]/60 text-sm mt-1">تحديث معلومات التطبيق وإدارة الصلاحيات</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { key: "app", label: "معلومات التطبيق" },
            { key: "versions", label: "إدارة الإصدارات" },
            { key: "roles", label: "مديرو النظام" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                tab === t.key ? "text-[#1F4A10] border-b-2 border-[#1F4A10] bg-[#F6FAF0]" : "text-[#4A5568]/60 hover:text-[#1F4A10]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "app" && (
            <div className="max-w-lg space-y-4">
              {[
                { label: "رقم الجوال", key: "phone", icon: Phone, type: "tel" },
                { label: "البريد الإلكتروني", key: "email", icon: Mail, type: "email" },
                { label: "الموقع الرسمي", key: "website", icon: Globe, type: "url" },
                { label: "تويتر / X", key: "twitter", icon: Globe, type: "url" },
                { label: "إنستقرام", key: "instagram", icon: Globe, type: "url" },
                { label: "واتساب", key: "whatsapp", icon: Phone, type: "tel" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-bold text-[#1F4A10] mb-1.5">{field.label}</label>
                  <div className="relative">
                    <field.icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568]/40" />
                    <input
                      type={field.type}
                      value={appInfo[field.key as keyof typeof appInfo]}
                      onChange={(e) => setAppInfo((p) => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full pr-9 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#679632] focus:ring-2 focus:ring-[#679632]/10"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={save}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  saved ? "bg-green-500 text-white" : "bg-[#1F4A10] text-white hover:bg-[#2A5A14]"
                } shadow-lg shadow-[#1F4A10]/20`}
              >
                <Save className="w-4 h-4" />
                {saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
              </button>
            </div>
          )}

          {tab === "versions" && (
            <div className="space-y-4 max-w-lg">
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">تحديث "الحد الأدنى المطلوب" سيجبر المستخدمين الذين لديهم نسخة أقدم على تحديث التطبيق فور فتحه.</p>
              </div>

              {appVersions.map((v, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
                      <Globe className="w-5 h-5 text-[#1F4A10]" />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-[#1F4A10]">{v.platform}</h4>
                      <p className="text-xs text-[#4A5568]/50">{v.store}</p>
                    </div>
                    <span className="mr-auto px-3 py-1 rounded-xl bg-[#1F4A10] text-[#D4EDA8] text-xs font-bold">v{v.current}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#4A5568]/60 mb-1 block">الإصدار الحالي</label>
                      <input defaultValue={v.current} className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#679632]" />
                    </div>
                    <div>
                      <label className="text-xs text-[#4A5568]/60 mb-1 block">الحد الأدنى المطلوب</label>
                      <input defaultValue={v.minRequired} className="w-full py-2 px-3 border border-red-200 rounded-xl text-sm outline-none focus:border-red-400" />
                    </div>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-[#F6FAF0] text-[#679632] text-sm font-bold border border-[#3D6B2C]/15 hover:bg-[#D4EDA8] transition-colors">
                    نشر تحديث إلزامي
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "roles" && (
            <div className="space-y-4 max-w-lg">
              {/* Permissions guide */}
              <div className="bg-[#F6FAF0] rounded-2xl p-4 border border-[#3D6B2C]/10 space-y-2">
                <h4 className="font-bold text-[#1F4A10] text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#679632]" />جدول الصلاحيات</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-right py-1.5 px-2 text-[#4A5568]/60">القسم</th>
                        <th className="text-center py-1.5 px-2 text-purple-600">مدير عام</th>
                        <th className="text-center py-1.5 px-2 text-blue-600">دعم فني</th>
                        <th className="text-center py-1.5 px-2 text-amber-600">مالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["لوحة الإحصائيات", "✓", "✓", "✓"],
                        ["إدارة المستخدمين", "✓", "✓", "—"],
                        ["الشؤون المالية", "✓", "—", "✓"],
                        ["الدعم الفني", "✓", "✓", "—"],
                        ["الإعدادات", "✓", "—", "—"],
                      ].map(([label, ...perms], i) => (
                        <tr key={i} className="border-t border-[#3D6B2C]/5">
                          <td className="py-1.5 px-2 text-[#4A5568]">{label}</td>
                          {perms.map((p, j) => (
                            <td key={j} className={`py-1.5 px-2 text-center font-bold ${p === "✓" ? "text-green-500" : "text-gray-300"}`}>{p}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admin users */}
              <div className="space-y-2">
                {admins.map((admin) => (
                  <div key={admin.id} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${admin.active ? "border-gray-100 bg-white" : "border-gray-100 bg-gray-50 opacity-60"}`}>
                    <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#1F4A10]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1F4A10] text-sm truncate">{admin.name}</p>
                      <p className="text-xs text-[#4A5568]/50 truncate">{admin.email}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${roleColors[admin.role]}`}>{roleLabels[admin.role]}</span>
                    {admin.role !== "super_admin" && (
                      <div className="flex gap-1.5">
                        <button onClick={() => toggleAdmin(admin.id)} className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors ${admin.active ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"}`}>
                          {admin.active ? "تعطيل" : "تفعيل"}
                        </button>
                        <button onClick={() => deleteAdmin(admin.id)} className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#3D6B2C]/20 text-[#679632] text-sm font-bold hover:border-[#679632] hover:bg-[#F6FAF0] transition-all">
                <Plus className="w-4 h-4" /> إضافة مشرف جديد
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
