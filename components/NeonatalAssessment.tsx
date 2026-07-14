import React, { useState } from 'react';
import { PainSeverity, AssessmentResult } from '../types';

interface Props {
  onAssess: (result: AssessmentResult) => void;
  onBack: () => void;
  onHome: () => void;
}

type TabType = 'NIPS' | 'CRIES' | 'NON_PHARM';

const NeonatalAssessment: React.FC<Props> = ({ onAssess, onBack, onHome }) => {
  const [activeTab, setActiveTab] = useState<TabType>('NIPS');

  // NIPS state
  const [nips, setNips] = useState({
    facialExpression: 0,
    cry: 0,
    breathingPattern: 0,
    arms: 0,
    legs: 0,
    arousalState: 0,
  });

  // CRIES state
  const [cries, setCries] = useState({
    crying: 0,
    requiresO2: 0,
    increasedVitals: 0,
    expression: 0,
    sleeplessness: 0,
  });

  const handleNipsChange = (field: keyof typeof nips, val: number) => {
    const nextNips = { ...nips, [field]: val };
    setNips(nextNips);
    const score = nextNips.facialExpression + nextNips.cry + nextNips.breathingPattern + nextNips.arms + nextNips.legs + nextNips.arousalState;
    
    let severity = PainSeverity.NONE;
    let interpretation = '';
    
    if (score <= 2) {
      severity = PainSeverity.NONE;
      interpretation = 'بدون درد یا درد بسیار خفیف (تسکین محیطی و مراقبت‌های روتین)';
    } else if (score <= 4) {
      severity = PainSeverity.MILD;
      interpretation = 'درد خفیف تا متوسط (شروع فوری اقدامات غیردارویی نظیر قنداق کردن، ساکارز ۲۴٪، پستانک و ارزیابی مجدد پس از ۳۰ دقیقه)';
    } else {
      severity = PainSeverity.SEVERE;
      interpretation = 'درد شدید (شروع فوری مداخلات غیردارویی، گزارش به پزشک جهت بررسی نیاز به داروی مسکن و پایش مداوم علائم حیاتی)';
    }

    onAssess({
      score,
      severity,
      interpretation,
      toolUsed: 'NIPS',
      recommendations: getNipsRecommendations(score),
      timestamp: new Date()
    });
  };

  const handleCriesChange = (field: keyof typeof cries, val: number) => {
    const nextCries = { ...cries, [field]: val };
    setCries(nextCries);
    const score = nextCries.crying + nextCries.requiresO2 + nextCries.increasedVitals + nextCries.expression + nextCries.sleeplessness;
    
    let severity = PainSeverity.NONE;
    let interpretation = '';
    
    if (score <= 3) {
      severity = PainSeverity.NONE;
      interpretation = 'بدون درد یا درد بسیار خفیف';
    } else if (score <= 6) {
      severity = PainSeverity.MODERATE;
      interpretation = 'درد متوسط بعد از عمل (شروع اقدامات غیردارویی و در نظر گرفتن دوز مناسب استامینوفن طبق دستورالعمل)';
    } else {
      severity = PainSeverity.SEVERE;
      interpretation = 'درد شدید بعد از عمل (اقدامات دارویی تهاجمی‌تر مثل مسکن‌های مخدر و پایش مداوم هوشیاری و تنفس نوزاد)';
    }

    onAssess({
      score,
      severity,
      interpretation,
      toolUsed: 'CRIES',
      recommendations: getCriesRecommendations(score),
      timestamp: new Date()
    });
  };

  const getNipsRecommendations = (score: number): string[] => {
    if (score <= 2) {
      return [
        "پایداری محیطی نوزاد حفظ شود (کاهش نور مستقیم و سر و صدای بخش).",
        "مراقبت‌های پرستاری خوشه‌بندی شوند تا فواصل استراحت نوزاد طولانی‌تر گردد.",
        "ارزیابی درد بر اساس پروتکل بخش (مثلاً هر ۴ تا ۸ ساعت) تکرار شود."
      ];
    }
    if (score <= 4) {
      return [
        "تجویز ۲ تا ۴ قطره (۰.۱ تا ۱ میلی‌لیتر) محلول ساکارز ۲۴٪ بر روی زبان نوزاد ۲ دقیقه قبل از مداخلات بعدی.",
        "تشویق مادر به برقراری تماس پوست به پوست (مراقبت آغوشی کانگورویی - KMC).",
        "استفاده از روش‌های پوزیشن‌دهی فشرده حمایتی (قنداق کردن شل یا جمع کردن دست و پا به داخل بدن).",
        "قرار دادن پستانک تمیز در دهان نوزاد جهت مکیدن غیرمغذی.",
        "ارزیابی مجدد درد ۳۰ دقیقه پس از مداخلات فوق."
      ];
    }
    return [
      "گزارش فوری به پزشک مقیم جهت ارزیابی و تجویز دوز مناسب مسکن‌های دارویی (مثلاً استامینوفن یا مخدر ملایم).",
      "انجام سریع اقدامات غیردارویی (تجویز ساکارز ۲۴٪، قنداق کردن و مکیدن غیرمغذی) همزمان با مداخله دارویی.",
      "پایش مداوم علائم حیاتی نوزاد به ویژه ضربان قلب، تعداد تنفس و اشباع اکسیژن (SaO2).",
      "ارزیابی مجدد درد پس از تجویز داروی وریدی (بعد از ۱۵ تا ۳۰ دقیقه) یا داروی خوراکی/شیاف (بعد از ۳۰ تا ۶۰ دقیقه)."
    ];
  };

  const getCriesRecommendations = (score: number): string[] => {
    if (score <= 3) {
      return [
        "پایش روتین و ثبت درد در کاردکس نوزاد.",
        "تامین پوزیشن راحت نوزاد و به حداقل رساندن تحریکات محیطی ریکاوری یا بخش."
      ];
    }
    if (score <= 6) {
      return [
        "تجویز استامینوفن خوراکی یا شیاف (10-15 mg/kg) با رعایت حداکثر دوز روزانه مجاز.",
        "استفاده از روش‌های کمکی غیردارویی (ساکارز ۲۴٪ به همراه پستانک، قنداق کردن ملایم).",
        "ارزیابی مجدد درد نوزاد هر ۱ ساعت تا زمان پایدار شدن امتیاز زیر ۳."
      ];
    }
    return [
      "مشاوره با پزشک معالج یا سرویس درد جهت بررسی دوزهای درمانی مسکن‌های قوی‌تر (مانند انفوزیون مداوم یا تک‌دوزهای وریدی فنتانیل یا مورفین).",
      "پایش مداوم قلبی‌ریوی نوزاد (مانیتور اکسیژن و ضربان قلب) جهت جلوگیری از سرکوب تنفسی ناشی از اپیوئیدها.",
      "آمادگی کامل ترالی اورژانس نوزادان و در دسترس بودن داروی آنتی‌دوت (نالوکسان).",
      "ارزیابی مجدد درد هر ۳۰ دقیقه تا رسیدن به کنترل مناسب درد."
    ];
  };

  const nipsTotal = nips.facialExpression + nips.cry + nips.breathingPattern + nips.arms + nips.legs + nips.arousalState;
  const criesTotal = cries.crying + cries.requiresO2 + cries.increasedVitals + cries.expression + cries.sleeplessness;

  return (
    <div className="space-y-10 animate-in">
      {/* Tab Selectors */}
      <div className="flex flex-wrap justify-center gap-4 bg-slate-900/40 p-2 rounded-[2rem] border border-white/5 max-w-3xl mx-auto">
        <button
          onClick={() => setActiveTab('NIPS')}
          className={`flex-1 py-3 px-6 rounded-2xl text-sm font-black transition-all ${
            activeTab === 'NIPS'
              ? 'bg-indigo-600 text-white shadow-xl scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          id="tab-nips"
        >
          🚼 مقیاس NIPS (نوزادان عمومی)
        </button>
        <button
          onClick={() => setActiveTab('CRIES')}
          className={`flex-1 py-3 px-6 rounded-2xl text-sm font-black transition-all ${
            activeTab === 'CRIES'
              ? 'bg-indigo-600 text-white shadow-xl scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          id="tab-cries"
        >
          🩹 مقیاس CRIES (بعد از عمل)
        </button>
        <button
          onClick={() => setActiveTab('NON_PHARM')}
          className={`flex-1 py-3 px-6 rounded-2xl text-sm font-black transition-all ${
            activeTab === 'NON_PHARM'
              ? 'bg-indigo-600 text-white shadow-xl scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          id="tab-nonpharm"
        >
          🧸 دستورالعمل مراقبت‌های پرستاری
        </button>
      </div>

      {activeTab === 'NIPS' && (
        <div className="space-y-12 premium-card p-8 md:p-10 border-indigo-500/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
            <div className="text-right space-y-2">
              <h3 className="text-3xl font-black text-white">مقیاس ارزیابی درد نوزاد (NIPS)</h3>
              <p className="text-indigo-400 text-sm font-bold italic">Neonatal Infant Pain Scale — مناسب برای نوزادان ترم و نارس</p>
            </div>
            <div className="bg-indigo-950 px-6 py-4 rounded-3xl border border-indigo-500/30 text-center min-w-[120px]">
              <span className="text-[10px] text-indigo-300 block font-bold mb-1">امتیاز کل NIPS</span>
              <span className="text-4xl font-black text-white tabular-nums">{nipsTotal}</span>
              <span className="text-xs text-slate-400 block mt-1">از ۷ امتیاز</span>
            </div>
          </div>

          <div className="grid gap-8">
            <RadioGroup
              title="۱. حالت چهره (Facial Expression)"
              description="مشاهده عضلات صورت نوزاد"
              current={nips.facialExpression}
              onSelect={(v) => handleNipsChange('facialExpression', v)}
              options={[
                { value: 0, label: "آرام و طبیعی (۰)", desc: "عضلات صورت شل، چهره آرام، بدون اخم یا کشیدگی" },
                { value: 1, label: "درهم کشیده و اخم‌آلود (۱)", desc: "انقباض عضلات صورت، اخم کردن، به هم فشردن چشم‌ها یا لب‌ها" }
              ]}
            />

            <RadioGroup
              title="۲. گریه (Cry)"
              description="بررسی وضعیت صوتی نوزاد"
              current={nips.cry}
              onSelect={(v) => handleNipsChange('cry', v)}
              options={[
                { value: 0, label: "بدون گریه (۰)", desc: "آرام است، گریه یا صدای ناله شنیده نمی‌شود" },
                { value: 1, label: "ناله خفیف یا متناوب (۱)", desc: "گریه خفیف، ناله‌های دوره‌ای، با محرک‌های ملایم آرام می‌شود" },
                { value: 2, label: "گریه شدید و مداوم (۲)", desc: "گریه شدید و بلند با فرکانس بالا، جیغ کشیدن، به سختی تسکین می‌یابد" }
              ]}
            />

            <RadioGroup
              title="۳. الگوی تنفس (Breathing Patterns)"
              description="تغییرات تنفسی نسبت به وضعیت پایه"
              current={nips.breathingPattern}
              onSelect={(v) => handleNipsChange('breathingPattern', v)}
              options={[
                { value: 0, label: "طبیعی و آرام (۰)", desc: "تنفس منظم، بدون تلاش تنفسی اضافی یا نامنظمی" },
                { value: 1, label: "تغییر یافته یا نامنظم (۱)", desc: "تنفس تند، حبس نفس، غلغلک گلو، سرفه یا تندنفسی سطحی" }
              ]}
            />

            <RadioGroup
              title="۴. حرکات دست‌ها (Arms)"
              description="بررسی تنش عضلانی در اندام فوقانی"
              current={nips.arms}
              onSelect={(v) => handleNipsChange('arms', v)}
              options={[
                { value: 0, label: "آرام و شل (۰)", desc: "عدم وجود سفت‌شدگی عضلانی، حرکات راندوم و طبیعی دست‌ها" },
                { value: 1, label: "خم یا کشیده / سفت (۱)", desc: "دست‌ها سفت شده، به شدت باز یا کاملاً در سینه جمع شده‌اند" }
              ]}
            />

            <RadioGroup
              title="۵. حرکات پاها (Legs)"
              description="بررسی تنش عضلانی در اندام تحتانی"
              current={nips.legs}
              onSelect={(v) => handleNipsChange('legs', v)}
              options={[
                { value: 0, label: "آرام و شل (۰)", desc: "پاها شل و راحت، حرکات متناوب و رها" },
                { value: 1, label: "خم یا کشیده / سفت (۱)", desc: "سفت و منقبض بودن پاها، لگد زدن‌های تهاجمی یا کشش شدید زانوها" }
              ]}
            />

            <RadioGroup
              title="۶. سطح هوشیاری (State of Arousal)"
              description="میزان برانگیختگی و ناآرامی نوزاد"
              current={nips.arousalState}
              onSelect={(v) => handleNipsChange('arousalState', v)}
              options={[
                { value: 0, label: "خواب یا بیدار آرام (۰)", desc: "نوزاد به آرامی خوابیده یا بیدار و هشیار بدون اضطراب است" },
                { value: 1, label: "ناآرام و تحریک‌پذیر (۱)", desc: "تلاش مداوم برای تقلا، به شدت بی‌قرار، بدخلقی مکرر" }
              ]}
            />
          </div>
        </div>
      )}

      {activeTab === 'CRIES' && (
        <div className="space-y-12 premium-card p-8 md:p-10 border-indigo-500/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
            <div className="text-right space-y-2">
              <h3 className="text-3xl font-black text-white">مقیاس سنجش درد بعد از عمل (CRIES)</h3>
              <p className="text-indigo-400 text-sm font-bold italic">مناسب برای ارزیابی کارهای جراحی و پس از جراحی در نوزادان</p>
            </div>
            <div className="bg-indigo-950 px-6 py-4 rounded-3xl border border-indigo-500/30 text-center min-w-[120px]">
              <span className="text-[10px] text-indigo-300 block font-bold mb-1">امتیاز کل CRIES</span>
              <span className="text-4xl font-black text-white tabular-nums">{criesTotal}</span>
              <span className="text-xs text-slate-400 block mt-1">از ۱۰ امتیاز</span>
            </div>
          </div>

          <div className="grid gap-8">
            <RadioGroup
              title="۱. گریه (Crying)"
              description="خصوصیات گریه نوزاد پس از عمل"
              current={cries.crying}
              onSelect={(v) => handleCriesChange('crying', v)}
              options={[
                { value: 0, label: "گریه نمی‌کند (۰)", desc: "نوزاد کاملاً ساکت است یا صدای گریه ندارد" },
                { value: 1, label: "گریه با فرکانس بالا ولی قابل آرام کردن (۱)", desc: "گریه شدید اما با در آغوش گرفتن یا پستانک موقتاً آرام می‌شود" },
                { value: 2, label: "گریه متناوب/مداوم غیرقابل تسکین (۲)", desc: "گریه بسیار شدید، نوزاد با هیچ روشی آرام نمی‌گیرد" }
              ]}
            />

            <RadioGroup
              title="۲. نیاز به اکسیژن کمکی (Requires O2)"
              description="میزان اکسیژن مورد نیاز جهت نگهداشت SaO2 بالای ۹۵٪"
              current={cries.requiresO2}
              onSelect={(v) => handleCriesChange('requiresO2', v)}
              options={[
                { value: 0, label: "بدون نیاز به اکسیژن (۰)", desc: "در هوای اتاق اشباع بالای ۹۵٪ دارد" },
                { value: 1, label: "نیاز به FiO2 کمتر از ۳۰٪ (۱)", desc: "نیاز به اکسیژن با درصد پایین جهت حفظ اکسیژن خون" },
                { value: 2, label: "نیاز به FiO2 بیشتر از ۳۰٪ (۲)", desc: "نیاز به حجم اکسیژن بالاتر یا مانیتورینگ حمایتی قوی‌تر" }
              ]}
            />

            <RadioGroup
              title="۳. تغییر علائم حیاتی (Increased Vital Signs)"
              description="بررسی افزایش ضربان قلب و فشار خون شریانی نسبت به وضعیت پایه قبل عمل"
              current={cries.increasedVitals}
              onSelect={(v) => handleCriesChange('increasedVitals', v)}
              options={[
                { value: 0, label: "طبیعی یا زیر میزان پایه (۰)", desc: "بدون نوسان یا افزایش نگران‌کننده علائم حیاتی" },
                { value: 1, label: "افزایش تا ۲۰٪ نسبت به پایه (۱)", desc: "علائم حیاتی کمی بالاتر از حد پایه نوزاد است" },
                { value: 2, label: "افزایش بالای ۲۰٪ یا نوسانات شدید (۲)", desc: "تاکی‌کاردی یا فشار خون بسیار بالاتر از حد روتین نوزاد" }
              ]}
            />

            <RadioGroup
              title="۴. حالت چهره (Expression)"
              description="وجود انقباضات چشمی و دهانی"
              current={cries.expression}
              onSelect={(v) => handleCriesChange('expression', v)}
              options={[
                { value: 0, label: "چهره آرام و رها (۰)", desc: "بدون کوچک‌ترین اخم یا گرفتگی ماهیچه‌ها" },
                { value: 1, label: "اخم خفیف یا متوسط (۱)", desc: "تغییر جزیی چهره، به هم فشردن لب‌ها" },
                { value: 2, label: "اخم عمیق به همراه ناله‌های صوتی (۲)", desc: "اخم شدید، چروک عمیق پیشانی و شیار لب و بینی" }
              ]}
            />

            <RadioGroup
              title="۵. بی‌خوابی (Sleeplessness)"
              description="میزان خواب نوزاد در یک ساعت گذشته"
              current={cries.sleeplessness}
              onSelect={(v) => handleCriesChange('sleeplessness', v)}
              options={[
                { value: 0, label: "خواب کامل و پیوسته (۰)", desc: "نوزاد در طول ساعت گذشته به راحتی خوابیده است" },
                { value: 1, label: "بیدار شدن‌های مکرر و متناوب (۱)", desc: "فواصل کوتاه بیدار شده ولی دوباره به خواب رفته است" },
                { value: 2, label: "به طور مداوم بیدار بوده است (۲)", desc: "نوزاد در طول کل ساعت گذشته به دلیل درد نتوانسته بخوابد" }
              ]}
            />
          </div>
        </div>
      )}

      {activeTab === 'NON_PHARM' && (
        <div className="space-y-8 animate-in text-right">
          <div className="bg-indigo-950/40 p-8 rounded-[2.5rem] border border-indigo-500/20">
            <h3 className="text-2xl font-black text-indigo-300 mb-4">دستورالعمل جامع مداخلات غیردارویی کنترل درد نوزاد</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              بر اساس ابلاغیه کشوری وزارت بهداشت در خصوص <b>مراقبت‌های پرستاری در مدیریت درد نوزادان بستری</b>، استفاده از تکنیک‌های زیر در حین پروسجرهای تهاجمی (مانند نمونه‌گیری پاشنه پا، رگ‌گیری، پونکسیون لومبار و تزریق واکسن) الزامی است. این روش‌ها با اثر بر سیستم‌های حسی و ترشح اندورفین طبیعی، درک نوزاد از محرک‌های دردناک را به طور چشمگیری کاهش می‌دهند.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GuidelineCard
                icon="🤱"
                title="تغذیه با شیر مادر (Breastfeeding)"
                description="قوی‌ترین و اثربخش‌ترین مسکن طبیعی برای نوزادان است. تغذیه با شیر مادر باید از ۲ تا ۵ دقیقه قبل از شروع مداخله دردناک آغاز شود و در تمام مدت انجام کار ادامه یابد تا ترشح اندورفین و هورمون اکسی‌توسین به اوج برسد."
              />
              <GuidelineCard
                icon="🍭"
                title="تجویز ساکارز ۲۴٪ یا آب قند"
                description="تجویز چند قطره (۰.۱ الی ۱ میلی‌لیتر) از محلول آب قند یا ساکارز ۲۴٪ روی قسمت قدامی زبان نوزاد دقیقاً ۲ دقیقه قبل از مداخله دردناک. اثر این ماده تا ۵ الی ۱۰ دقیقه برای بلوک حس درد پایدار است."
              />
              <GuidelineCard
                icon="👶"
                title="مکیدن غیرمغذی (NNS)"
                description="استفاده از پستانک تمیز و مناسب نوزاد به تنهایی یا همزمان با تجویز چند قطره ساکارز ۲۴٪. تحریک فیزیکی و مکانیکی گیرنده‌های دهانی باعث مهار عبور پیام‌های درد از نخاع می‌گردد."
              />
              <GuidelineCard
                icon="🦘"
                title="مراقبت آغوشی مادر (KMC)"
                description="تماس پوست به پوست نوزاد با سینه مادر (یا پدر) حداقل ۱۰ تا ۱۵ دقیقه پیش از پروسجر تهاجمی. کاهش ضربان قلب، ثبات تنفس و ترشح هورمون‌های آرام‌بخش از نتایج مستقیم این مراقبت مهربانانه است."
              />
              <GuidelineCard
                icon="🩹"
                title="قنداق کردن و پوزیشن فشرده (Swaddling)"
                description="جمع نگهداشتن دست‌ها و پاهای نوزاد نزدیک به خط وسط بدن (مشابه حالت جنینی در رحم) و پوشش دادن نوزاد با پتو یا قنداق ملایم. این تکنیک مانع از آشفتگی حرکتی و کاهش خستگی نوزاد می‌گردد."
              />
              <GuidelineCard
                icon="🤫"
                title="اصلاحات محرک محیطی"
                description="خوشه‌بندی خدمات (Clustering Care) جهت به حداقل رساندن دفعات لمس نوزاد، تنظیم شدت نور انکوباتور با انداختن کاور پارچه‌ای، مهار آلارم‌های صوتی تجهیزات اطراف و صحبت با صدای بسیار آرام."
              />
            </div>
          </div>

          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <h4 className="text-xl font-black text-rose-300">💡 مراقبت‌های دارویی (دوزهای روتین نوزادان بستری):</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-300 text-right">
                <thead>
                  <tr className="border-b border-white/10 text-indigo-300 font-black">
                    <th className="pb-3 pl-4">نام دارو</th>
                    <th className="pb-3 pl-4">دوزاژ استاندارد</th>
                    <th className="pb-3 pl-4">فواصل زمانی تجویز</th>
                    <th className="pb-3">ملاحظات و مراقبت‌های پرستاری</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-bold">
                  <tr>
                    <td className="py-3 pl-4 text-white">استامینوفن (Acetaminophen)</td>
                    <td className="py-3 pl-4">10 - 15 mg/kg (خوراکی یا شیاف)</td>
                    <td className="py-3 pl-4">هر ۶ تا ۸ ساعت</td>
                    <td className="py-3">حداکثر دوز روزانه در نوزاد ترم ۴۰ میلی‌گرم بر کیلوگرم و در نوزاد نارس ۳۰ میلی‌گرم بر کیلوگرم است. پایش عملکرد کبد در مصرف طولانی‌مدت ضروری است.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pl-4 text-white">فنتانیل (Fentanyl)</td>
                    <td className="py-3 pl-4">0.5 - 2 mcg/kg/hour (انفوزیون وریدی)</td>
                    <td className="py-3 pl-4">مداوم (IV infusion)</td>
                    <td className="py-3">حتماً تحت مانیتورینگ کامل قلبی‌ریوی استفاده شود. تزریق سریع بولوس می‌تواند منجر به سفتی دیواره قفسه سینه (Chest wall rigidity) شود.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pl-4 text-white">مورفین (Morphine)</td>
                    <td className="py-3 pl-4">0.05 - 0.1 mg/kg (وریدی آهسته)</td>
                    <td className="py-3 pl-4">هر ۴ تا ۶ ساعت</td>
                    <td className="py-3">جهت دردهای شدید بعد عمل یا حین تهویه مکانیکی. مانیتورینگ دقیق وضعیت تنفس و آمادگی کامل داروی نالوکسان به عنوان آنتی‌دوت الزامی است.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RadioGroup = ({ title, description, current, onSelect, options }: any) => (
  <div className="space-y-4 text-right">
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-6 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/40"></div>
      <div>
        <h4 className="text-lg font-black text-slate-100">{title}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((opt: any) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`p-4 rounded-2xl border-2 transition-all duration-300 text-right relative overflow-hidden ${
            current === opt.value
              ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg -translate-y-1'
              : 'bg-white/5 border-white/5 text-slate-400 hover:border-indigo-400/30'
          }`}
        >
          <div className="text-[9px] font-black mb-1 opacity-40 uppercase tracking-widest">
            {current === opt.value ? '✓ انتخاب شده' : `انتخاب امتیاز ۰${opt.value}`}
          </div>
          <p className="text-base font-bold leading-tight">{opt.label}</p>
          <p className="text-xs opacity-60 mt-1">{opt.desc}</p>
        </button>
      ))}
    </div>
  </div>
);

const GuidelineCard = ({ icon, title, description }: any) => (
  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex gap-4 text-right items-start">
    <span className="text-4xl p-2 bg-white/5 rounded-2xl shrink-0">{icon}</span>
    <div className="space-y-2">
      <h4 className="text-lg font-black text-indigo-300">{title}</h4>
      <p className="text-slate-300 text-xs leading-relaxed">{description}</p>
    </div>
  </div>
);

export default NeonatalAssessment;
