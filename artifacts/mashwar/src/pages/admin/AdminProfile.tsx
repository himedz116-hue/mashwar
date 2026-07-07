import { useState, useEffect, useRef } from "react";
import { getAdminProfile, editAdminProfileWithAvatar, changeAdminPassword, type AdminProfile } from "@/lib/meshwarApi";
import { User, Lock, RefreshCw, Check, Camera, Upload, Eye, EyeOff, Shield, Mail, Phone as PhoneIcon } from "lucide-react";

export default function AdminProfile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [toast, setToast] = useState("");
  const [toastOk, setToastOk] = useState(true);
  const [err, setErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pw, setPw] = useState({ old_password: "", password: "", password_confirmation: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, ok = true) => {
    setToast(msg); setToastOk(ok); setTimeout(() => setToast(""), 3500);
  };

  const load = () => {
    setLoading(true);
    getAdminProfile()
      .then((r) => {
        setProfile(r.data);
        setForm({ name: r.data.name ?? "", email: r.data.email ?? "", phone: r.data.phone ?? "" });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!form.name) { setErr("الاسم مطلوب"); return; }
    setSaving(true);
    try {
      await editAdminProfileWithAvatar({ ...form, avatarFile: avatarFile ?? undefined });
      showToast("✅ تم حفظ البيانات بنجاح");
      setAvatarFile(null);
      setAvatarPreview(null);
      load();
    }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(msg); showToast("خطأ: " + msg, false);
    }
    finally { setSaving(false); }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setPwErr("");
    if (!pw.old_password) { setPwErr("كلمة المرور الحالية مطلوبة"); return; }
    if (pw.password.length < 6) { setPwErr("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    if (pw.password !== pw.password_confirmation) { setPwErr("كلمة المرور الجديدة غير متطابقة"); return; }
    setChangingPw(true);
    try {
      await changeAdminPassword(pw);
      showToast("✅ تم تغيير كلمة المرور بنجاح");
      setPw({ old_password: "", password: "", password_confirmation: "" });
    }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setPwErr(msg); showToast("خطأ: " + msg, false);
    }
    finally { setChangingPw(false); }
  };

  const displayAvatar = avatarPreview ?? profile?.avatar;
  const initials = profile?.name?.[0] ?? "م";

  return (
    <div className="space-y-5">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold transition-all ${toastOk ? "bg-[#1F4A10] text-white" : "bg-red-600 text-white"}`}>
          {toast}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">الملف الشخصي</h2>
        <p className="text-sm text-gray-500 mt-0.5">إدارة بيانات حساب المشرف والصلاحيات</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
                <User className="w-5 h-5 text-[#1F4A10]" />
              </div>
              <div>
                <h3 className="font-heading font-black text-[#1F4A10]">البيانات الشخصية</h3>
                <p className="text-xs text-gray-400">تعديل معلومات الحساب والصورة الشخصية</p>
              </div>
              <button onClick={load} className="mr-auto p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors" title="تحديث">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-[#F6FAF0] to-[#D4EDA8]/20 rounded-2xl border border-[#D4EDA8]/50">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl shadow-lg overflow-hidden">
                  {displayAvatar ? (
                    <img src={displayAvatar} className="w-24 h-24 object-cover" />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-[#D4EDA8] to-[#a8d060] flex items-center justify-center">
                      <span className="font-black text-[#1F4A10] text-4xl">{initials}</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 rounded-3xl bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center"
                >
                  <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <div className="text-center">
                <p className="font-heading font-black text-[#1F4A10] text-lg">{profile?.name ?? "—"}</p>
                <p className="text-sm text-gray-500">{profile?.email ?? "—"}</p>
              </div>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D4EDA8] text-[#679632] text-xs font-bold hover:bg-[#D4EDA8] transition-colors">
                <Upload className="w-3.5 h-3.5" />
                {avatarFile ? `✅ ${avatarFile.name.slice(0, 20)}...` : "تغيير الصورة الشخصية"}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={saveProfile} className="space-y-4">
              {[
                { label: "الاسم الكامل", key: "name" as const, type: "text", icon: User },
                { label: "البريد الإلكتروني", key: "email" as const, type: "email", icon: Mail },
                { label: "رقم الهاتف", key: "phone" as const, type: "tel", icon: PhoneIcon },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{f.label}</label>
                  <div className="relative">
                    <f.icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] transition-colors"
                    />
                  </div>
                </div>
              ))}
              {err && <p className="text-red-500 text-xs bg-red-50 p-3 rounded-xl">{err}</p>}
              <button type="submit" disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-l from-[#679632] to-[#1F4A10] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1F4A10]/20">
                <Check className="w-4 h-4" /> {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </form>
          </div>

          {/* Password Card */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#1F4A10]" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-[#1F4A10]">تغيير كلمة المرور</h3>
                  <p className="text-xs text-gray-400">استخدم كلمة مرور قوية لحماية الحساب</p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">اختر كلمة مرور قوية تحتوي على حروف وأرقام ورموز، ولا تشاركها مع أحد.</p>
              </div>

              <form onSubmit={savePassword} className="space-y-4">
                {[
                  { label: "كلمة المرور الحالية", key: "old_password" as const, show: showOld, toggle: () => setShowOld(!showOld) },
                  { label: "كلمة المرور الجديدة", key: "password" as const, show: showNew, toggle: () => setShowNew(!showNew) },
                  { label: "تأكيد كلمة المرور", key: "password_confirmation" as const, show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">{f.label}</label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={f.show ? "text" : "password"}
                        value={pw[f.key]}
                        onChange={(e) => setPw((p) => ({ ...p, [f.key]: e.target.value }))}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="w-full pr-10 pl-10 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632] transition-colors"
                      />
                      <button type="button" onClick={f.toggle} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {f.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Password strength indicator */}
                {pw.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => {
                        const strength = [pw.password.length >= 6, /[A-Z]/.test(pw.password), /[0-9]/.test(pw.password), /[^A-Za-z0-9]/.test(pw.password)];
                        const filled = strength.slice(0, i).every(Boolean) || (i <= strength.filter(Boolean).length);
                        return (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${filled ? (i <= 1 ? "bg-red-400" : i <= 2 ? "bg-amber-400" : i <= 3 ? "bg-blue-400" : "bg-green-500") : "bg-gray-200"}`} />
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400">
                      {pw.password.length < 6 ? "ضعيفة - أدخل 6 أحرف على الأقل" :
                       !/[A-Z]/.test(pw.password) ? "متوسطة - أضف حرفاً كبيراً" :
                       !/[0-9]/.test(pw.password) ? "جيدة - أضف رقماً" : "قوية ✅"}
                    </p>
                  </div>
                )}

                {pwErr && <p className="text-red-500 text-xs bg-red-50 p-3 rounded-xl">{pwErr}</p>}
                <button type="submit" disabled={changingPw || !pw.old_password || !pw.password || !pw.password_confirmation}
                  className="w-full py-3 rounded-xl bg-gradient-to-l from-red-500 to-red-700 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md shadow-red-600/20">
                  <Shield className="w-4 h-4" /> {changingPw ? "جاري التغيير..." : "تغيير كلمة المرور"}
                </button>
              </form>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
              <h3 className="font-heading font-black text-[#1F4A10] text-sm">معلومات الحساب</h3>
              <div className="space-y-2.5">
                {[
                  { label: "معرّف الحساب (UUID)", value: profile?.uuid ? `${profile.uuid.slice(0, 16)}...` : "—", mono: true },
                  { label: "نوع الحساب", value: "مشرف عام", mono: false },
                  { label: "منصة التطبيق", value: "Android & iOS", mono: false },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-400">{row.label}</span>
                    <span className={`text-xs font-bold text-[#1F4A10] ${row.mono ? "font-mono" : ""}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
