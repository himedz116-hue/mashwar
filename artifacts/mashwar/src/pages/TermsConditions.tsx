import LegalLayout from "@/components/LegalLayout";

const sections = [
  {
    title: "قبول الشروط والتعريف بالمنصة",
    content: (
      <>
        <p>
          ترحّب بكم منصة <strong className="text-[#1F4A10]">"مشوار"</strong> الرقمية، المملوكة لـ <strong className="text-[#1F4A10]">مؤسسة عبدالعزيز لويفي الحربي</strong>، المسجلة في المملكة العربية السعودية برقم موحد: <strong className="text-[#1F4A10]">7054680967</strong>.
        </p>
        <p className="mt-3">
          إن استخدامكم للتطبيق أو الموقع، بأي شكل كان — تصفحاً، تسجيلاً، أو إجراء معاملات — يُعدّ موافقةً كاملةً وصريحةً على الالتزام بجميع الشروط والأحكام الواردة في هذه الوثيقة.
          إذا كنتم لا توافقون على أي بند من هذه الشروط، يُرجى التوقف عن استخدام الخدمة.
        </p>
        <div className="mt-4 p-4 bg-[#1F4A10]/5 border border-[#1F4A10]/10 rounded-xl">
          <p className="text-[#1F4A10] font-bold text-xs mb-1">📋 الرقم الوطني الموحد للمنشأة</p>
          <p className="text-2xl font-black text-[#679632] tracking-widest">7054680967</p>
        </div>
      </>
    ),
  },
  {
    title: "طبيعة الخدمة المقدمة",
    content: (
      <>
        <p>
          <strong className="text-[#1F4A10]">"مشوار"</strong> هي <strong className="text-[#1F4A10]">منصة تقنية وسيطة</strong> تعمل على ربط العملاء الراغبين في نقل الأثاث أو البضائع مع السائقين المستقلين أو التابعين لجهات نقل معتمدة.
        </p>
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          {[
            { icon: "🔗", title: "الربط", desc: "تسهيل التواصل بين العميل والسائق المناسب." },
            { icon: "📍", title: "التتبع", desc: "تتبع الشحنات والرحلات في الوقت الفعلي." },
            { icon: "💳", title: "المدفوعات", desc: "معالجة المدفوعات بأمان بين الأطراف." },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-[#F6FAF0] rounded-xl text-center border border-[#3D6B2C]/8">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="font-bold text-[#1F4A10] text-sm mb-1">{item.title}</p>
              <p className="text-xs text-[#4A5568]/70">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[#4A5568]/70 bg-amber-50 border border-amber-200 p-3 rounded-xl">
          ⚠️ المنصة لا تقدم خدمات النقل بشكل مباشر ولا تُعدّ شركة نقل، وإنما ينحصر دورها في التيسير والربط والتنسيق.
        </p>
      </>
    ),
  },
  {
    title: "أهلية الاستخدام والتسجيل",
    content: (
      <>
        <ul className="space-y-3">
          {[
            { title: "الحد الأدنى للعمر", desc: "يجب ألا يقل عمر المستخدم عن 18 عاماً لإنشاء حساب واستخدام خدمات التطبيق." },
            { title: "دقة المعلومات", desc: "يتعهد المستخدم بتقديم معلومات صحيحة، دقيقة، وكاملة أثناء التسجيل، والحرص على تحديثها عند أي تغيير." },
            { title: "حساب واحد", desc: "يُمنع امتلاك أكثر من حساب واحد لكل مستخدم. المنصة تحتفظ بحق تعليق الحسابات المكررة." },
            { title: "سرية الحساب", desc: "يتحمل المستخدم المسؤولية الكاملة عن الحفاظ على سرية بيانات الدخول وعدم مشاركتها مع أطراف أخرى." },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
              <svg className="w-4 h-4 text-[#679632] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-bold text-[#1F4A10] mb-0.5">{item.title}</p>
                <p className="text-xs leading-6">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: "التزامات العميل والسائق",
    content: (
      <>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">👤</span>
              <h3 className="font-heading font-black text-[#1F4A10]">التزامات العميل</h3>
            </div>
            <ul className="space-y-2">
              {[
                "عدم استخدام الخدمة لنقل أي مواد غير قانونية، مسروقة، خطرة، أو محظورة.",
                "تهيئة البضائع وتغليفها بشكل مناسب قبل الاستلام.",
                "دفع القيمة المتفق عليها عبر الوسائل المتاحة في التطبيق.",
                "التواجد في موقع الاستلام أو التسليم خلال الوقت المحدد.",
                "التعامل مع السائق باحترام ومهنية.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs leading-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#679632] mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🚛</span>
              <h3 className="font-heading font-black text-[#1F4A10]">التزامات السائق</h3>
            </div>
            <ul className="space-y-2">
              {[
                "الالتزام بأنظمة المرور السارية ومتطلبات السلامة على الطريق.",
                "الحفاظ على سلامة المنقولات وتسليمها في حالتها الأصلية.",
                "تحديث بيانات المركبة ورخصة القيادة بشكل دوري.",
                "الالتزام بالحضور في الوقت المحدد لتنفيذ الطلبات المقبولة.",
                "تقديم الخدمة بمهنية عالية ومعاملة العملاء بأدب.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs leading-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#679632] mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    title: "الأسعار والمدفوعات والإلغاء",
    content: (
      <>
        <div className="space-y-4">
          <div className="p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
            <h4 className="font-bold text-[#1F4A10] mb-2">📊 احتساب التكلفة</h4>
            <p className="text-xs leading-6">يتم احتساب تكلفة النقل بناءً على عدة عوامل: نوع المركبة المختارة، المسافة بين نقطة الاستلام والتسليم، حجم ووزن الشحنة، وتفاصيل الطلب الأخرى المحددة في التطبيق.</p>
          </div>
          <div className="p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
            <h4 className="font-bold text-[#1F4A10] mb-2">💳 طرق الدفع</h4>
            <p className="text-xs leading-6">تتوفر خيارات دفع متعددة ومرنة تشمل: الدفع النقدي، الدفع الإلكتروني عبر بطاقات الصراف والائتمان، ومحافظ الدفع الرقمية المعتمدة.</p>
          </div>
          <div className="p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
            <h4 className="font-bold text-[#1F4A10] mb-2">🔄 سياسة الإلغاء والاسترداد</h4>
            <p className="text-xs leading-6">تخضع المبالغ المستردة وسياسات الإلغاء لتقدير إدارة التطبيق ومراجعتها لكل حالة على حدة. يُنصح بمراجعة سياسة الإلغاء التفصيلية داخل التطبيق قبل إتمام الطلب.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    title: "حدود المسؤولية",
    content: (
      <>
        <p>
          تبذل إدارة "مشوار" قصارى جهدها للتحقق من هوية السائقين وضمان جودة الخدمة، غير أنها <strong className="text-[#1F4A10]">لا تضمن تصرفات السائقين أو العملاء بشكل مطلق</strong>.
        </p>
        <p className="mt-3">
          التطبيق غير مسؤول مسؤولية مباشرة عن الأضرار التالية:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            "الأضرار المادية أو المعنوية الناتجة عن فقدان البضائع أو تلفها أثناء النقل بسبب إهمال السائق.",
            "التأخيرات الناجمة عن ظروف خارجة عن الإرادة كالازدحام أو الظروف الجوية.",
            "الخسائر غير المباشرة أو التبعية الناتجة عن استخدام الخدمة أو التوقف عنها.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100 text-red-800 text-xs">
              <span className="text-red-400 mt-0.5">⚠️</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[#4A5568]/70">
          يخضع حل النزاعات للأنظمة والقوانين المحلية السارية في المملكة العربية السعودية.
        </p>
      </>
    ),
  },
  {
    title: "إلغاء الحسابات والتعليق",
    content: (
      <>
        <p>
          يحق لإدارة تطبيق "مشوار" تعليق أو إلغاء حساب أي مستخدم — عميلاً كان أو سائقاً — بشكل مؤقت أو دائم في الحالات التالية:
        </p>
        <ul className="mt-4 space-y-2">
          {[
            "انتهاك أي من الشروط والأحكام الواردة في هذه الوثيقة.",
            "الاشتباه في وجود ممارسات احتيالية أو غير قانونية.",
            "تقديم معلومات تسجيل مزيفة أو مضللة.",
            "سوء التعامل مع الأطراف الأخرى أو انتهاك معايير السلوك المقبول.",
            "استخدام التطبيق بطريقة تضر بالمنصة أو مستخدميها الآخرين.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 py-2 border-b border-[#3D6B2C]/8 last:border-0 text-xs leading-6">
              <span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: "القانون واجب التطبيق والاختصاص القضائي",
    content: (
      <>
        <p>
          تخضع هذه الشروط والأحكام وتُفسَّر وفقاً للأنظمة والتشريعات المعمول بها في <strong className="text-[#1F4A10]">المملكة العربية السعودية</strong>.
        </p>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-[#1F4A10] rounded-xl text-white">
            <p className="text-[#D4EDA8] text-xs mb-1">الجهة القضائية المختصة</p>
            <p className="font-black">محاكم بريدة</p>
            <p className="text-white/60 text-xs mt-1">المملكة العربية السعودية</p>
          </div>
          <div className="p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
            <p className="text-[#4A5568]/60 text-xs mb-1">النظام الحاكم</p>
            <p className="font-black text-[#1F4A10]">أنظمة المملكة العربية السعودية</p>
            <p className="text-[#4A5568]/60 text-xs mt-1">بما فيها نظام التجارة الإلكترونية</p>
          </div>
        </div>
        <div className="mt-5 p-4 bg-[#F6FAF0] rounded-xl">
          <p className="font-bold text-[#1F4A10] text-sm mb-3">معلومات التواصل الرسمية</p>
          <ul className="space-y-2 text-xs">
            {[
              { label: "الجهة المالكة", value: "مؤسسة عبدالعزيز لويفي الحربي" },
              { label: "البريد الإلكتروني", value: "mshwarsh@gmail.com", href: "mailto:mshwarsh@gmail.com" },
              { label: "رقم الجوال", value: "‎+966 50 219 9098", href: "tel:+966502199098" },
              { label: "العنوان", value: "بريدة، حي الفلاح، شارع عزيزة بنت مشرف، المملكة العربية السعودية" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-[#4A5568]/50 w-24 flex-shrink-0">{item.label}:</span>
                {item.href ? (
                  <a href={item.href} className="text-[#679632] font-bold hover:underline">{item.value}</a>
                ) : (
                  <span className="text-[#1F4A10] font-bold">{item.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </>
    ),
  },
];

export default function TermsConditions() {
  return (
    <LegalLayout
      badge="وثيقة قانونية"
      title="الشروط والأحكام"
      subtitle="تعرّف على حقوقك والتزاماتك عند استخدام منصة مشوار"
      lastUpdated="٧ يوليو ٢٠٢٦"
      icon={
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      }
      sections={sections}
    />
  );
}
