import LegalLayout from "@/components/LegalLayout";

const sections = [
  {
    title: "مقدمة والتزامنا بالخصوصية",
    content: (
      <>
        <p>
          تلتزم مؤسسة عبدالعزيز لويفي الحربي، المالكة لتطبيق وموقع "مشوار"، بحماية خصوصية بيانات جميع مستخدمينا سواءً كانوا عملاءً أو سائقين.
          تعكس هذه السياسة قيمنا الجوهرية في الشفافية والأمان، ونؤمن بأن بياناتكم الشخصية هي ملككم وحدكم.
        </p>
        <p>
          توضح هذه الوثيقة بشكل كامل وشفاف كيفية جمع بياناتكم، ولأي غرض تُستخدم، ومع من قد تُشارَك، وكيف نضمن حمايتها.
          باستخدامكم للتطبيق أو الموقع، تُعبّرون عن موافقتكم على الشروط الواردة في هذه السياسة.
        </p>
      </>
    ),
  },
  {
    title: "البيانات التي نجمعها",
    content: (
      <>
        <p>نجمع البيانات التالية لتقديم خدمتنا على أكمل وجه:</p>
        <ul className="mt-3 space-y-2">
          {[
            { label: "بيانات التسجيل", detail: "الاسم الكامل، رقم الجوال، البريد الإلكتروني، وتفاصيل الحساب الشخصي." },
            { label: "بيانات السائقين", detail: "الهوية الوطنية، رخصة القيادة، استمارة المركبة، والبيانات البنكية اللازمة لتحويل الأرباح — لأغراض التحقق والتوثيق فقط." },
            { label: "بيانات الموقع الجغرافي (GPS)", detail: "نجمع بيانات الموقع بدقة عالية لتحديد نقاط الاستلام والتسليم وتتبع الشحنات في الوقت الفعلي. يتطلب ذلك صلاحية الوصول للموقع في الخلفية لضمان سير الرحلة بشكل صحيح." },
            { label: "بيانات المعاملات", detail: "تفاصيل الطلبات، المبالغ المدفوعة، تواريخ الرحلات، وتقييمات الخدمة." },
            { label: "بيانات الجهاز", detail: "نوع الجهاز، نظام التشغيل، ومعرّف الجهاز — لتحسين تجربة التطبيق وحل المشكلات التقنية." },
          ].map((item, i) => (
            <li key={i} className="flex gap-3 p-3 bg-[#F6FAF0] rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#679632] mt-2 flex-shrink-0" />
              <div>
                <span className="font-bold text-[#1F4A10]">{item.label}: </span>
                {item.detail}
              </div>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: "كيف نستخدم بياناتكم",
    content: (
      <>
        <p>نستخدم البيانات التي نجمعها للأغراض التالية حصراً:</p>
        <ul className="mt-3 space-y-2">
          {[
            "تشغيل وتقديم خدمات نقل البضائع والأثاث، وتسهيل التواصل بين العميل والسائق.",
            "توثيق حسابات السائقين والتحقق من هوياتهم لضمان الأمان والحدّ من الاحتيال.",
            "تحسين وتطوير أداء التطبيق وتجربة المستخدم استناداً لأنماط الاستخدام.",
            "إرسال الإشعارات المتعلقة بحالة الطلبات، التحديثات الهامة، والعروض ذات الصلة.",
            "تقديم الدعم الفني وحل النزاعات بين الأطراف.",
            "الامتثال للمتطلبات القانونية والتنظيمية في المملكة العربية السعودية.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 py-2 border-b border-[#3D6B2C]/8 last:border-0">
              <svg className="w-4 h-4 text-[#679632] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: "مشاركة البيانات مع أطراف ثالثة",
    content: (
      <>
        <p>
          نُولي خصوصيتكم أهمية قصوى. <strong className="text-[#1F4A10]">لا نقوم بأي حال ببيع أو تأجير أو مبادلة بياناتكم الشخصية مع أطراف خارجية لأغراض تجارية.</strong>
          تقتصر مشاركة البيانات على الحالات الضرورية التالية:
        </p>
        <div className="mt-4 space-y-3">
          {[
            { icon: "🚛", title: "تنفيذ الطلبات", text: "مشاركة اسم العميل، رقم هاتفه، وموقع الاستلام مع السائق المعيّن لتنفيذ الخدمة." },
            { icon: "💳", title: "خدمات الدفع", text: "مشاركة بيانات الدفع اللازمة مع مزودي خدمات الدفع الإلكتروني المعتمدين والممتثلين للأنظمة." },
            { icon: "⚖️", title: "المتطلبات القانونية", text: "مشاركة البيانات مع الجهات الحكومية أو القضائية في المملكة العربية السعودية عند وجود طلب قانوني رسمي." },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-bold text-[#1F4A10] mb-1">{item.title}</p>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: "أمن البيانات وحمايتها",
    content: (
      <>
        <p>
          نطبّق معايير أمنية تقنية وإدارية متقدمة تشمل التشفير الكامل للبيانات أثناء النقل وعند التخزين، وضوابط الوصول الصارمة، ومراجعات أمنية دورية لحماية بياناتكم من:
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {["الوصول غير المصرح به", "التعديل غير الشرعي", "الإفشاء غير المبرر", "الفقدان أو الإتلاف"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-[#1F4A10]/5 rounded-xl">
              <span className="text-[#679632]">🔒</span>
              <span className="text-[#1F4A10] font-medium text-xs">{item}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
          ⚠️ رغم جهودنا المتواصلة، لا يمكن لأي نظام إلكتروني ضمان الأمان المطلق 100%. نوصيكم بالحفاظ على سرية كلمة مرور حسابكم وعدم مشاركتها مع أي طرف.
        </p>
      </>
    ),
  },
  {
    title: "حقوق المستخدم",
    content: (
      <>
        <p>يتمتع كل مستخدم بالحقوق الكاملة التالية تجاه بياناته الشخصية:</p>
        <ul className="mt-4 space-y-2">
          {[
            { right: "حق الاطلاع", desc: "الحصول على نسخة من جميع بياناتك المحفوظة لدينا." },
            { right: "حق التصحيح", desc: "تعديل أي معلومات غير دقيقة أو غير مكتملة في حسابك." },
            { right: "حق الحذف", desc: "طلب حذف حسابك وجميع بياناتك الشخصية نهائياً من أنظمتنا." },
            { right: "حق الاعتراض", desc: "الاعتراض على معالجة بياناتك لأغراض التسويق أو الأبحاث." },
            { right: "حق النقل", desc: "الحصول على بياناتك بتنسيق قابل للقراءة الآلية لنقلها لمنصة أخرى." },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 p-3 bg-[#F6FAF0] rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#679632] mt-2 flex-shrink-0" />
              <div>
                <span className="font-bold text-[#1F4A10]">{item.right}: </span>
                {item.desc}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[#4A5568]/70">
          لممارسة أي من هذه الحقوق، يمكنك التوجه إلى إعدادات الحساب مباشرةً، أو التواصل معنا عبر البريد الإلكتروني: <a href="mailto:mshwarsh@gmail.com" className="text-[#679632] font-bold">mshwarsh@gmail.com</a>
        </p>
      </>
    ),
  },
  {
    title: "التواصل معنا",
    content: (
      <>
        <p>لأي استفسارات أو طلبات تتعلق بخصوصية بياناتكم، يرجى التواصل مع مسؤول الخصوصية لدينا:</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {[
            { icon: "✉️", label: "البريد الإلكتروني", value: "mshwarsh@gmail.com", href: "mailto:mshwarsh@gmail.com" },
            { icon: "📞", label: "رقم الهاتف", value: "‎+966 50 219 9098", href: "tel:+966502199098" },
            { icon: "🏢", label: "الجهة المالكة", value: "مؤسسة عبدالعزيز لويفي الحربي" },
            { icon: "📍", label: "العنوان", value: "بريدة، حي الفلاح، شارع عزيزة بنت مشرف" },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-[#F6FAF0] rounded-xl border border-[#3D6B2C]/8">
              <div className="flex items-center gap-2 mb-1">
                <span>{item.icon}</span>
                <span className="text-xs text-[#4A5568]/60 font-medium">{item.label}</span>
              </div>
              {item.href ? (
                <a href={item.href} className="text-[#679632] font-bold hover:underline">{item.value}</a>
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

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      badge="وثيقة قانونية"
      title="سياسة الخصوصية"
      subtitle="نحن نأخذ خصوصيتك على محمل الجد — اقرأ كيف نحمي بياناتك"
      lastUpdated="٧ يوليو ٢٠٢٦"
      icon={
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      }
      sections={sections}
    />
  );
}
