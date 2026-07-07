import { useState, useEffect } from "react";
import { getAdminProfile, editAdminProfile, changeAdminPassword, type AdminProfile } from "@/lib/meshwarApi";
import { User, Lock, RefreshCw, Check, Camera } from "lucide-react";

export default function AdminProfile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [toast, setToast] = useState("");
  const [err, setErr] = useState("");
  const [pwErr, setPwErr] = useState("");

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [pw, setPw] = useState({ old_password: "", password: "", password_confirmation: "" });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

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

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!form.name) { setErr("الاسم مطلوب"); return; }
    setSaving(true);
    try { await editAdminProfile(form); showToast("✅ تم حفظ البيانات"); load(); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setSaving(false); }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setPwErr("");
    if (pw.password !== pw.password_confirmation) { setPwErr("كلمة المرور الجديدة غير متطابقة"); return; }
    if (pw.password.length < 6) { setPwErr("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    setChangingPw(true);
    try { await changeAdminPassword(pw); showToast("✅ تم تغيير كلمة المرور"); setPw({ old_password: "", password: "", password_confirmation: "" }); }
    catch (e: unknown) { setPwErr(e instanceof Error ? e.message : String(e)); }
    finally { setChangingPw(false); }
  };

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F4A10] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold">{toast}</div>}

      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">الملف الشخصي</h2>
        <p className="text-sm text-gray-500 mt-0.5">إدارة بيانات حساب المشرف</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {/* Profile info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
                <User className="w-5 h-5 text-[#1F4A10]" />
              </div>
              <div>
                <h3 className="font-heading font-black text-[#1F4A10]">البيانات الشخصية</h3>
                <p className="text-xs text-gray-400">تعديل معلومات الحساب</p>
              </div>
              <button onClick={load} className="mr-auto p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-[#F6FAF0] rounded-2xl">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#D4EDA8] flex items-center justify-center">
                  {profile?.avatar ? (
                    <img src={profile.avatar} className="w-16 h-16 rounded-2xl object-cover" />
                  ) : (
                    <span className="font-black text-[#1F4A10] text-2xl">{profile?.name?.[0] ?? "م"}</span>
                  )}
                </div>
                <button className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-[#679632] text-white flex items-center justify-center">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div>
                <p className="font-heading font-black text-[#1F4A10]">{profile?.name ?? "—"}</p>
                <p className="text-sm text-gray-500">{profile?.email ?? "—"}</p>
                <p className="text-xs text-gray-400 mt-0.5">{profile?.phone ?? "—"}</p>
              </div>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              {[
                { label: "الاسم الكامل", key: "name" as const, type: "text" },
                { label: "البريد الإلكتروني", key: "email" as const, type: "email" },
                { label: "رقم الهاتف", key: "phone" as const, type: "tel" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
                </div>
              ))}
              {err && <p className="text-red-500 text-xs">{err}</p>}
              <button type="submit" disabled={saving}
                className="w-full py-3 rounded-xl bg-[#1F4A10] text-white font-bold text-sm hover:bg-[#2A5A14] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-heading font-black text-[#1F4A10]">تغيير كلمة المرور</h3>
                <p className="text-xs text-gray-400">يُنصح بتغييرها بشكل دوري</p>
              </div>
            </div>

            <form onSubmit={savePassword} className="space-y-4">
              {[
                { label: "كلمة المرور الحالية", key: "old_password" as const },
                { label: "كلمة المرور الجديدة", key: "password" as const },
                { label: "تأكيد كلمة المرور الجديدة", key: "password_confirmation" as const },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{f.label}</label>
                  <input type="password" value={pw[f.key]} onChange={(e) => setPw((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#679632]" />
                </div>
              ))}

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 space-y-1">
                <p className="font-bold">متطلبات كلمة المرور:</p>
                <p>• 6 أحرف على الأقل</p>
                <p>• يُفضّل استخدام أرقام وحروف</p>
              </div>

              {pwErr && <p className="text-red-500 text-xs">{pwErr}</p>}
              <button type="submit" disabled={changingPw || !pw.old_password || !pw.password}
                className="w-full py-3 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> {changingPw ? "جاري التغيير..." : "تغيير كلمة المرور"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
