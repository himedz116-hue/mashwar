import LegalLayout from "@/components/LegalLayout";

const sections = [
  {
    title: "مقدمة — من هو السائق في مشوار؟",
    content: (
      <>
        <p>
          السائق في منصة "مشوار" هو شريكنا الأساسي في تقديم خدمة نقل البضائع والأثاث بجودة عالية. نؤمن بأن نجاح المنصة مرتبط ارتباطاً مباشراً بنجاح سائقينا ورضاهم.
        </p>
        <p className="mt-3">
          هذه الوثيقة تُوضّح الشروط والمتطلبات الخاصة بالانضمام وعمل السائقين على منصة مشوار. قراءتها والالتزام بها شرط أساسي للتسجيل كسائق.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { icon: "💼", stat: "مرن", label: "وقت العمل" },
            { icon: "💰", stat: "يومي", label: "تحويل الأرباح" },
            { icon: "🛡️", stat: "كاملة", label: "الحماية القانونية" },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-[#1F4A10] rounded-xl text-center text-white">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="font-black text-[#D4EDA8]">{item.stat}</p>
              <p className="text-white/60 text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: "شروط الانضمام كسائق",
    content: (
      <>
        <p>للتسجيل كسائق في منصة مشوار، يجب استيفاء الشروط التالية بشكل كامل:</p>
        <ul className="mt-4 space-y-2">
          {[
            { icon: "🪪", title: "الهوية الوطنية", desc: "سارية المفعول ويجب أن يكون عمر السائق 21 عاماً أو أكثر." },
            { icon: "📋", title: "رخصة القيادة", desc: "سارية المفعول من نوع مناسب لحجم المركبة المراد تشغيلها." },
            { icon: "🚛", title: "استمارة المركبة", desc: "سارية المفعول وسجل ملكية المركبة باسم السائق أو جهة موثقة." },
            { icon: "🔧", title: "صلاحية المركبة", desc: "اجتياز فحص الصلاحية الدوري ومطابقة متطلبات السلامة." },
            { icon: "🏦", title: "حساب بنكي", desc: "حساب بنكي فعّال باسم السائق لاستلام الأرباح المحوّلة." },
            { icon: "📱", title: "هاتف ذكي", desc: "بنظام iOS أو Android حديث يدعم تشغيل تطبيق مشوار." },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 p-3 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-bold text-[#1F4A10] mb-0.5 text-sm">{item.title}</p>
                <p className="text-xs leading-6 text-[#4A5568]/80">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: "عملية التسجيل والتوثيق",
    content: (
      <>
        <p>تمر عملية تسجيل السائق بالخطوات التالية:</p>
        <div className="mt-4 space-y-3">
          {[
            { step: "١", title: "التقديم الإلكتروني", desc: "تحميل التطبيق، تعبئة نموذج التسجيل، ورفع جميع المستندات المطلوبة." },
            { step: "٢", title: "مراجعة الطلب", desc: "يقوم فريق مشوار بمراجعة وثائقك خلال ٢-٣ أيام عمل." },
            { step: "٣", title: "التحقق الميداني", desc: "قد يتطلب الأمر فحص المركبة ميدانياً في بعض الحالات." },
            { step: "٤", title: "تفعيل الحساب", desc: "بعد الموافقة، يتم تفعيل حسابك وتمكينك من استقبال الطلبات فوراً." },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
              <div className="w-10 h-10 rounded-xl bg-[#1F4A10] text-[#D4EDA8] font-black text-lg flex items-center justify-center flex-shrink-0">
                {item.step}
              </div>
              <div>
                <p className="font-bold text-[#1F4A10] mb-1">{item.title}</p>
                <p className="text-xs leading-6 text-[#4A5568]/80">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: "الالتزامات المهنية للسائق",
    content: (
      <>
        <div className="space-y-3">
          {[
            {
              category: "أثناء تنفيذ الطلبات",
              items: [
                "الحضور في موقع الاستلام خلال الوقت المحدد أو إشعار العميل بأي تأخير فوراً.",
                "الحفاظ على البضائع والأثاث من الأضرار أثناء التحميل والنقل والتفريغ.",
                "التواصل المهني مع العميل وإبلاغه بأي مستجدات تخص طلبه.",
                "تفعيل تطبيق الإرسال وتحديث حالة الرحلة بشكل مستمر.",
              ],
            },
            {
              category: "صيانة المركبة والامتثال",
              items: [
                "الالتزام بأنظمة المرور السعودية ولوائح السلامة على الطريق.",
                "ضمان أن تكون المركبة في حالة جيدة وآمنة للتشغيل في جميع الأوقات.",
                "تجديد جميع التراخيص والوثائق قبل انتهاء صلاحيتها وتحديثها في التطبيق.",
                "عدم قيادة المركبة تحت تأثير أي مؤثرات.",
              ],
            },
            {
              category: "السلوك المهني",
              items: [
                "معاملة العملاء باحترام ومهنية في جميع الأوقات.",
                "الامتناع عن طلب مبالغ إضافية خارج نطاق السعر المحدد في التطبيق.",
                "الإبلاغ الفوري عن أي حوادث أو نزاعات لفريق دعم مشوار.",
              ],
            },
          ].map((section, i) => (
            <div key={i} className="p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
              <p className="font-bold text-[#1F4A10] mb-3 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#679632] text-white text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                {section.category}
              </p>
              <ul className="space-y-1.5">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs leading-6 text-[#4A5568]/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#679632] mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: "نظام الأرباح والعمولات",
    content: (
      <>
        <p>يحصل السائق على نسبة من قيمة كل طلب يُنفّذه بنجاح. النسبة تتفاوت بحسب:</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {[
            { factor: "نوع المركبة", icon: "🚛", desc: "الشاحنات الكبيرة تحقق عوائد أعلى." },
            { factor: "المسافة", icon: "📍", desc: "كلما زادت المسافة زاد الربح." },
            { factor: "التقييم", icon: "⭐", desc: "الدرجة العالية تفتح طلبات أكثر وأرباحاً أفضل." },
            { factor: "ساعات الذروة", icon: "⏰", desc: "مضاعفات تلقائية خلال أوقات الطلب العالي." },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.icon}</span>
                <p className="font-bold text-[#1F4A10] text-sm">{item.factor}</p>
              </div>
              <p className="text-xs text-[#4A5568]/70">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-[#1F4A10] rounded-xl text-white">
          <p className="font-bold text-[#D4EDA8] mb-1">🏦 موعد تحويل الأرباح</p>
          <p className="text-sm text-white/80">تُحوَّل الأرباح إلى حسابك البنكي بشكل منتظم وفق السياسة المعتمدة داخل التطبيق. يمكنك متابعة أرباحك بتفاصيل كاملة في لوحة تحكم السائق.</p>
        </div>
      </>
    ),
  },
  {
    title: "نظام التقييم والجودة",
    content: (
      <>
        <p>
          تعتمد منصة مشوار نظام تقييم شفاف ومتوازن يضمن جودة الخدمة لجميع الأطراف:
        </p>
        <div className="mt-4 space-y-3">
          <div className="p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
            <p className="font-bold text-[#1F4A10] mb-3">⭐ معايير التقييم</p>
            <div className="space-y-2">
              {[
                { label: "الالتزام بالمواعيد", weight: "٣٠٪" },
                { label: "سلامة البضائع", weight: "٣٠٪" },
                { label: "الاحترافية في التعامل", weight: "٢٥٪" },
                { label: "نظافة المركبة", weight: "١٥٪" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-[#4A5568]/80">{item.label}</span>
                  <span className="font-bold text-[#679632]">{item.weight}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { level: "ممتاز", range: "٤.٨ – ٥", color: "bg-green-100 text-green-800 border-green-200", perk: "أولوية في الطلبات المميزة" },
              { level: "جيد", range: "٤.٠ – ٤.٧", color: "bg-blue-50 text-blue-800 border-blue-200", perk: "مؤهل للعمل بشكل طبيعي" },
              { level: "تحت المراجعة", range: "أقل من ٤.٠", color: "bg-amber-50 text-amber-800 border-amber-200", perk: "برنامج تحسين الأداء" },
            ].map((item, i) => (
              <div key={i} className={`p-3 rounded-xl border text-center ${item.color}`}>
                <p className="font-black text-sm mb-1">{item.level}</p>
                <p className="text-xs mb-2 opacity-80">{item.range}</p>
                <p className="text-[10px] leading-4">{item.perk}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },
  {
    title: "تعليق الحساب وإنهاء الشراكة",
    content: (
      <>
        <p>تحتفظ مشوار بحق تعليق أو إنهاء حساب السائق في الحالات التالية:</p>
        <ul className="mt-4 space-y-2">
          {[
            { severity: "فوري", color: "bg-red-50 border-red-200 text-red-800", items: ["الإبلاغ عن حادثة جسيمة أو سلوك احتيالي.", "انتهاك سلامة العملاء أو تهديدهم.", "تزوير أو تزييف المستندات المقدمة."] },
            { severity: "بعد تحذير", color: "bg-amber-50 border-amber-200 text-amber-800", items: ["التقييم المتراجع باستمرار تحت ٣.٥ لمدة ٣٠ يوماً.", "الإلغاء المتكرر للطلبات المقبولة دون مبرر مقبول.", "انتهاء صلاحية الوثائق وعدم تجديدها رغم الإشعار."] },
          ].map((group, i) => (
            <li key={i} className={`p-4 rounded-xl border ${group.color}`}>
              <p className="font-bold mb-2 text-sm">إيقاف {group.severity}:</p>
              <ul className="space-y-1">
                {group.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs leading-6">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: "الدعم والتواصل",
    content: (
      <>
        <p>فريق دعم مشوار متاح لمساعدتك في أي استفسار أو مشكلة:</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {[
            { icon: "✉️", label: "البريد الإلكتروني", value: "mshwarsh@gmail.com", href: "mailto:mshwarsh@gmail.com" },
            { icon: "📞", label: "رقم الدعم", value: "‎+966 50 219 9098", href: "tel:+966502199098" },
            { icon: "📍", label: "العنوان", value: "بريدة، حي الفلاح — المملكة العربية السعودية" },
            { icon: "🕐", label: "ساعات الدعم", value: "الأحد – الخميس، ٨ص – ١٠م" },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
              <div className="flex items-center gap-2 mb-1">
                <span>{item.icon}</span>
                <span className="text-xs text-[#4A5568]/60">{item.label}</span>
              </div>
              {item.href ? (
                <a href={item.href} className="text-[#679632] font-bold text-sm hover:underline">{item.value}</a>
              ) : (
                <p className="text-[#1F4A10] font-bold text-sm">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </>
    ),
  },
];

export default function DriverTerms() {
  return (
    <LegalLayout
      badge="شروط السائقين"
      title="شروط وأحكام السائقين"
      subtitle="كل ما تحتاج معرفته للانضمام وعمل بنجاح على منصة مشوار"
      lastUpdated="٧ يوليو ٢٠٢٦"
      icon={
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      }
      sections={sections}
    />
  );
}
