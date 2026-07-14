
import React, { useState, useEffect } from 'react';
import { GCSScores, FOURScores, PediatricGCSScores } from '../types';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import AssessmentRow from './common/AssessmentRow';
import ModuleHeader from './common/ModuleHeader';

const GCSScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [scores, setScores] = useState<GCSScores>({ eyes: 1, verbal: 1, motor: 1 });
  
  useEffect(() => {
    const total = scores.eyes + scores.verbal + scores.motor;
    let interpretation = "", color = "", icon = "";
    let recommendations: string[] = [];
    if (total <= 8) {
      interpretation = "آسیب مغزی شدید / کما (Severe Brain Injury / Coma)";
      color = "bg-red-800";
      icon = "🆘";
      recommendations = [
        "🚨 کما یا آسیب شدید مغزی (GCS ≤ 8). تامین فوری راه هوایی مطمئن از طریق لوله‌گذاری تراشه (Intubation) جهت جلوگیری از آسپیراسیون ریوی و کنترل هیپوکسی الزامی است.",
        "🧠 هماهنگی جهت انجام فوری سی‌تی اسکن اورژانسی مغز بدون کنتراست.",
        "📞 مشاوره اورژانسی و سریع با سرویس جراحی مغز و اعصاب جهت ارزیابی افزایش فشار داخل جمجمه‌ای (ICP) یا هماتوم‌ها.",
        "🩺 مانیتورینگ دقیق و مستمر همودینامیک و علائم حیاتی در ICU."
      ];
    } else if (total <= 12) {
      interpretation = "آسیب مغزی متوسط (Moderate Brain Injury)";
      color = "bg-orange-600";
      icon = "🟠";
      recommendations = [
        "🟠 آسیب مغزی متوسط (GCS 9-12). بستری فوری در ICU یا واحد مراقبت‌های حاد تحت نظر نوروسرجری.",
        "🧠 انجام سی‌تی اسکن سریال مغز جهت رد خونریزی‌های تاخیری (Delayed Hemorrhages).",
        "🩺 بررسی منظم سطح هوشیاری به صورت سریال (نیم‌ساعته یا یک‌ساعته) جهت پیشگیری از هرگونه افت سریع هوشیاری."
      ];
    } else {
      interpretation = "آسیب مغزی خفیف (Mild Brain Injury)";
      color = "bg-amber-500";
      icon = "🟡";
      recommendations = [
        "🟢 آسیب مغزی خفیف (GCS 13-15). بیمار تحت نظر در اورژانس جهت رد علائم حاد همودینامیک یا مغزی.",
        "📋 ارائه کامل آموزش‌ها و علائم هشداردهنده ترخیص (مانند استفراغ مداوم، لتارژی، سردرد پیشرونده، گیجی شدید یا تشنج) به همراه بیمار.",
        "🩺 در صورت لزوم و بر اساس معیارهای Canadian CT Head Rule، تصمیم‌گیری جهت انجام سی‌تی اسکن مغز انجام گیرد."
      ];
    }
    onResult({ score: total, interpretation, color, icon, recommendations });
  }, [scores]);

  const handleSelect = (cat: keyof GCSScores, val: number) => {
    setScores(prev => ({ ...prev, [cat]: val }));
  };

  return (
    <div className="grid gap-12 pt-8">
      <AssessmentRow title="۱. پاسخ چشمی (E)" currentValue={scores.eyes} onSelect={(v) => handleSelect('eyes', v)} options={[{label: 'باز کردن خود به خود چشم‌ها', value: 4}, {label: 'در پاسخ به صدا یا درخواست کلامی', value: 3}, {label: 'در پاسخ به تحریک دردناک', value: 2}, {label: 'بدون پاسخ', value: 1}]} />
      <AssessmentRow title="۲. پاسخ کلامی (V)" currentValue={scores.verbal} onSelect={(v) => handleSelect('verbal', v)} options={[{label: 'بیمار آگاه و مسلط به زمان و مکان', value: 5}, {label: 'گیج و منگ (پاسخ کلامی همراه با ابهام)', value: 4}, {label: 'کلمات نامناسب و نامربوط به بحث', value: 3}, {label: 'صداهای نامفهوم و گنگ (ناله)', value: 2}, {label: 'بدون پاسخ کلامی', value: 1}]} />
      <AssessmentRow title="۳. پاسخ حرکتی (M)" currentValue={scores.motor} onSelect={(v) => handleSelect('motor', v)} options={[{label: 'اطاعت کامل از دستورات حرکتی کلامی', value: 6}, {label: 'مکان‌یابی محرک دردناک (تلاش برای رفع درد)', value: 5}, {label: 'پس کشیدن اندام از محرک دردناک', value: 4}, {label: 'خم شدن غیرطبیعی اندام‌ها به درد (دکورتیکه)', value: 3}, {label: 'باز شدن غیرطبیعی اندام‌ها به درد (دسربره)', value: 2}, {label: 'بدون پاسخ حرکتی', value: 1}]} />
    </div>
  );
};

const PediatricGCSScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [ageGroup, setAgeGroup] = useState<'infant' | 'child'>('infant');
  const [scores, setScores] = useState<PediatricGCSScores>({ eyes: 1, verbal: 1, motor: 1 });
  
  useEffect(() => {
    const total = scores.eyes + scores.verbal + scores.motor;
    let interpretation = "";
    let color = "";
    let icon = "";
    let recommendations: string[] = [];

    if (total <= 8) {
      interpretation = "آسیب مغزی شدید / کما اطفال (Severe Pediatric Brain Injury / Coma)";
      color = "bg-red-800";
      icon = "🆘";
      recommendations = [
        "🚨 کما یا آسیب مغزی شدید اطفال (pGCS ≤ 8). بر اساس استانداردهای بالینی MDCalc، تأمین فوری مجرای هوایی مطمئن با لوله‌گذاری تراشه (Intubation) به جهت مهار خطر نارسایی تنفسی و آسپیراسیون شدیداً توصیه می‌گردد.",
        "🩺 مانیتورینگ مداوم و تهاجمی علائم حیاتی، سطح اکسیژن‌رسانی و وضعیت همودینامیک نوزاد یا کودک.",
        "🧠 انجام سی‌تی اسکن اورژانسی مغز بر اساس پروتکل‌های ترومای سر اطفال (معیارهای PECARN).",
        "📞 مشاوره اورژانسی و فوق‌تخصصی جراحی اعصاب اطفال جهت ارزیابی فشار داخل جمجمه‌ای (ICP) و مداخله مقتضی."
      ];
    } else if (total <= 12) {
      interpretation = "آسیب مغزی متوسط اطفال (Moderate Pediatric Brain Injury)";
      color = "bg-orange-600";
      icon = "🟠";
      recommendations = [
        "🟠 آسیب مغزی متوسط اطفال (pGCS 9-12). بستری در بخش مراقبت‌های ویژه اطفال (PICU) با پایش سریال سطح هوشیاری (هر ۳۰ دقیقه تا ۱ ساعت).",
        "🧠 ارزیابی اندیکاسیون‌های انجام سی‌تی اسکن فوری بر اساس پروتکل استاندارد PECARN اطفال جهت رد خونریزی‌های فضاگیر داخل مغزی.",
        "🚫 تحت نظر قرار دادن بیمار جهت پایش علائم تشدید فشار داخل جمجمه‌ای مانند استفراغ مکرر جهنده، برادی‌کاردی، سردرد شدید یا لتارژی پیشرونده."
      ];
    } else {
      interpretation = "آسیب مغزی خفیف اطفال (Mild Pediatric Brain Injury)";
      color = "bg-amber-500";
      icon = "🟡";
      recommendations = [
        "🟢 آسیب مغزی خفیف اطفال (pGCS 13-15). پایش دقیق و تحت‌نظر گرفتن فعال نوزاد یا کودک به مدت حداقل ۴ تا ۶ ساعت پس از تروما در بخش اورژانس.",
        "📋 آموزش کامل و مستند علائم هشداردهنده خطیر ترخیص به والدین کودک (شامل: خواب‌آلودگی مفرط، لتارژی، سختی در بیدار کردن، تشنج، ضعف یا گزگز اندام‌ها، استفراغ مکرر بیش از ۲ بار، گریه غیرعادی مداوم).",
        "💤 توصیه به استراحت کامل فیزیکی و مغزی کودک، پرهیز از تماشای تلویزیون/صفحه نمایش و خودداری از بازی‌های پرتحرک در روزهای نخست پس از تروما."
      ];
    }

    onResult({ score: total, interpretation, color, icon, recommendations });
  }, [scores, ageGroup]);

  const handleSelect = (cat: keyof PediatricGCSScores, val: number) => {
    setScores(prev => ({ ...prev, [cat]: val }));
  };

  const eyesOptions = [
    { label: 'باز کردن خودبه‌خودی چشم‌ها (Spontaneous)', value: 4 },
    { label: 'باز کردن چشم‌ها با پاسخ به صدا یا درخواست کلامی (To voice / sound)', value: 3 },
    { label: 'باز کردن چشم‌ها با پاسخ به تحریک دردناک (To pain / noxious stimuli)', value: 2 },
    { label: 'بدون پاسخ (No response)', value: 1 }
  ];

  const verbalOptions = ageGroup === 'infant' 
    ? [
        { label: 'لبخند زدن، دنبال کردن اشیاء با چشم، غان و غون کردن (Coos & babbles) - فعالیت کلامی طبیعی', value: 5 },
        { label: 'گریه می‌کند ولی تسلی‌پذیر است؛ پاسخ ارتباطی نامنظم (Irritable cry, consolable)', value: 4 },
        { label: 'گریه دائم و بی‌قراری به درد؛ تسلی‌ناپذیر (Persistently irritable, cries to pain)', value: 3 },
        { label: 'ناله، زمزمه یا صدای گنگ ناهنجار در پاسخ به درد (Moans or grunts to pain)', value: 2 },
        { label: 'بدون پاسخ کلامی (No response)', value: 1 }
      ]
    : [
        { label: 'آگاه، هوشیار و جهت‌یابی شده به زمان و مکان با کلمات مناسب (Oriented, appropriate)', value: 5 },
        { label: 'گیج و منگ؛ صحبت همراه با ابهام و تداخل (Confused / disoriented)', value: 4 },
        { label: 'استفاده از کلمات نامناسب، تک‌کلمه‌ای و نامربوط (Inappropriate words)', value: 3 },
        { label: 'صداهای نامفهوم، ناله و کلمات گنگ غیرقابل فهم (Incomprehensible sounds/words)', value: 2 },
        { label: 'بدون پاسخ کلامی (No response)', value: 1 }
      ];

  const motorOptions = ageGroup === 'infant'
    ? [
        { label: 'حرکت خودبه‌خودی و نرمال هدفمند و مستقل (Spontaneous, normal movements)', value: 6 },
        { label: 'مکان‌یابی محرک دردناک یا پاسخ به لمس (Localizes pain or touch)', value: 5 },
        { label: 'پس کشیدن اندام در پاسخ به تحریک دردناک (Withdraws from pain)', value: 4 },
        { label: 'خم شدن غیرطبیعی اندام‌ها به تحریک دردناک / دکورتیکه (Abnormal flexion)', value: 3 },
        { label: 'باز شدن غیرطبیعی اندام‌ها به تحریک دردناک / دسربره (Abnormal extension)', value: 2 },
        { label: 'بدون پاسخ حرکتی (No response)', value: 1 }
      ]
    : [
        { label: 'اطاعت کامل از دستورات حرکتی کلامی (Obeys commands)', value: 6 },
        { label: 'مکان‌یابی محرک دردناک جهت برطرف کردن عامل درد (Localizes pain)', value: 5 },
        { label: 'پس کشیدن عضو از محرک تحریک دردناک (Withdraws from pain)', value: 4 },
        { label: 'خم شدن غیرطبیعی اندام‌ها به درد / وضعیت دکورتیکه (Abnormal flexion)', value: 3 },
        { label: 'باز شدن غیرطبیعی اندام‌ها به درد / وضعیت دسربره (Abnormal extension)', value: 2 },
        { label: 'بدون پاسخ حرکتی (No response)', value: 1 }
      ];

  return (
    <div className="space-y-10 pt-4">
      {/* Age Group Selector matching MDCalc */}
      <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
        <label className="text-slate-300 text-sm font-bold block">انتخاب رده سنی بر اساس استاندارد MDCalc pGCS:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setAgeGroup('infant')}
            className={`p-4 rounded-2xl font-black text-sm border transition-all text-right ${ageGroup === 'infant' ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            👶 نوزاد / شیرخوار زیر ۲ سال (Infant &lt; 2 yrs)
            <span className="block text-[10px] text-indigo-200 mt-1 font-medium">ارزیابی غیرکلامی بر اساس گریه، غان و غون و بازخورد محیطی</span>
          </button>
          <button
            type="button"
            onClick={() => setAgeGroup('child')}
            className={`p-4 rounded-2xl font-black text-sm border transition-all text-right ${ageGroup === 'child' ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            👦 کودک ۲ سال و بالاتر (Child &ge; 2 yrs)
            <span className="block text-[10px] text-indigo-200 mt-1 font-medium">ارزیابی پاسخ‌های آگاهانه کلامی متناسب با رشد زبانی کودک</span>
          </button>
        </div>
      </div>

      <div className="grid gap-12">
        <AssessmentRow 
          title="۱. پاسخ چشمی (Eye Opening Response)" 
          currentValue={scores.eyes} 
          onSelect={(v) => handleSelect('eyes', v)} 
          options={eyesOptions} 
        />
        <AssessmentRow 
          title="۲. پاسخ کلامی (Verbal Response)" 
          description={ageGroup === 'infant' ? "ارزیابی پاسخ‌های صوتی و غیرکلامی شیرخوار زیر ۲ سال" : "ارزیابی پاسخ کلامی و زبانی کودک بالای ۲ سال"}
          currentValue={scores.verbal} 
          onSelect={(v) => handleSelect('verbal', v)} 
          options={verbalOptions} 
        />
        <AssessmentRow 
          title="۳. پاسخ حرکتی (Motor Response)" 
          description={ageGroup === 'infant' ? "ارزیابی بهترین حرکات اندام‌ها در پاسخ به درد یا لمس نوزاد" : "ارزیابی دستور‌پذیری حرکتی یا واکنش به درد کودک"}
          currentValue={scores.motor} 
          onSelect={(v) => handleSelect('motor', v)} 
          options={motorOptions} 
        />
      </div>
    </div>
  );
};

const FOURScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [scores, setScores] = useState<FOURScores>({ eyes: 4, motor: 4, brainstem: 4, respiration: 4 });

  useEffect(() => {
    const total = scores.eyes + scores.motor + scores.brainstem + scores.respiration;
    let interpretation = "", color = "", icon = "";
    if (total <= 4) { interpretation = "کومای عمیق / ریسک بالای مرگ"; color = "bg-red-800"; icon = "🆘"; }
    else if (total <= 8) { interpretation = "آسیب شدید"; color = "bg-rose-700"; icon = "🚨"; }
    else if (total <= 12) { interpretation = "آسیب متوسط"; color = "bg-orange-600"; icon = "🟠"; }
    else { interpretation = "آسیب خفیف"; color = "bg-amber-500"; icon = "🟡"; }
    onResult({ score: total, interpretation, color, icon });
  }, [scores]);

  const handleSelect = (cat: keyof FOURScores, val: number) => {
    setScores(prev => ({ ...prev, [cat]: val }));
  };

  return (
    <div className="grid gap-12 pt-8">
      <AssessmentRow title="۱. پاسخ چشمی (E)" description="ارزیابی باز بودن چشم‌ها و توانایی بیمار برای تعقیب اشیاء یا پلک زدن به دستور." currentValue={scores.eyes} onSelect={(v) => handleSelect('eyes', v)} options={[
        {label: 'پلک باز، تعقیب یا پلک زدن به دستور', value: 4},
        {label: 'پلک باز ولی عدم تعقیب', value: 3},
        {label: 'پلک بسته ولی به صدای بلند باز می‌شود', value: 2},
        {label: 'پلک بسته ولی به درد باز می‌شود', value: 1},
        {label: 'پلک با درد هم بسته می‌ماند', value: 0},
      ]} />
      <AssessmentRow title="۲. پاسخ حرکتی (M)" description="ارزیابی بهترین پاسخ حرکتی اندام فوقانی به دستورات کلامی یا تحریک دردناک." currentValue={scores.motor} onSelect={(v) => handleSelect('motor', v)} options={[
        {label: 'علامت پیروزی یا شست بالا به دستور', value: 4},
        {label: 'مکان‌یابی درد', value: 3},
        {label: 'پاسخ فلکسوری به درد', value: 2},
        {label: 'پاسخ اکستانسوری به درد', value: 1},
        {label: 'بدون پاسخ یا تشنج', value: 0},
      ]} />
      <AssessmentRow title="۳. رفلکس‌های ساقه مغز (B)" description="بررسی حضور یا عدم حضور رفلکس‌های مردمک به نور و رفلکس قرنیه." currentValue={scores.brainstem} onSelect={(v) => handleSelect('brainstem', v)} options={[
        {label: 'رفلکس قرنیه و مردمک حاضر', value: 4},
        {label: 'یک مردمک گشاد و ثابت', value: 3},
        {label: 'رفلکس قرنیه یا مردمک غایب', value: 2},
        {label: 'رفلکس قرنیه و مردمک غایب', value: 1},
        {label: 'رفلکس قرنیه، مردمک و سرفه غایب', value: 0},
      ]} />
       <AssessmentRow title="۴. الگوی تنفسی (R)" description="ارزیابی الگوی تنفسی بیمار، چه اینتوبه باشد یا به صورت خودبه‌خودی تنفس کند." currentValue={scores.respiration} onSelect={(v) => handleSelect('respiration', v)} options={[
        {label: 'غیر اینتوبه، تنفس منظم', value: 4},
        {label: 'غیر اینتوبه، تنفس شین-استوک', value: 3},
        {label: 'غیر اینتوبه، تنفس نامنظم', value: 2},
        {label: 'تنفس بالاتر از ریت ونتیلاتور', value: 1},
        {label: 'تنفس با ریت ونتیلاتور یا آپنه', value: 0},
      ]} />
    </div>
  );
};

const AVPUScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [level, setLevel] = useState<string | null>(null);

  const handleSelect = (selectedLevel: string) => {
    setLevel(selectedLevel);
    let result = { score: '', interpretation: '', color: '', icon: '' };
    switch (selectedLevel) {
      case 'A':
        result = { score: 'A', interpretation: 'هوشیار (Alert) - بیمار کاملاً هوشیار، آگاه و به محرک‌های محیطی پاسخ‌دهنده است.', color: 'bg-emerald-600', icon: '✅' };
        break;
      case 'V':
        result = { score: 'V', interpretation: 'پاسخ به صدا (Voice) - بیمار با شنیدن صدای کلامی پاسخ یا واکنشی نشان می‌دهد.', color: 'bg-amber-500', icon: '🟡' };
        break;
      case 'P':
        result = { score: 'P', interpretation: 'پاسخ به تحریک دردناک (Pain) - بیمار تنها در پاسخ به تحریک فیزیکی دردناک واکنش نشان می‌دهد.', color: 'bg-orange-600', icon: '🟠' };
        break;
      case 'U':
        result = { score: 'U', interpretation: 'بدون پاسخ (Unresponsive) - بیمار به هیچ‌گونه محرک کلامی یا تحریک دردناک پاسخی نمی‌دهد.', color: 'bg-red-800', icon: '🆘' };
        break;
    }
    onResult(result);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8">
      <AVPUButton label="Alert" persianLabel="هوشیار" value="A" selected={level} onClick={handleSelect} />
      <AVPUButton label="Voice" persianLabel="پاسخ به صدا" value="V" selected={level} onClick={handleSelect} />
      <AVPUButton label="Pain" persianLabel="پاسخ به درد" value="P" selected={level} onClick={handleSelect} />
      <AVPUButton label="Unresponsive" persianLabel="بدون پاسخ" value="U" selected={level} onClick={handleSelect} />
    </div>
  );
};

const AVPUButton = ({ label, persianLabel, value, selected, onClick }: any) => (
  <button onClick={() => onClick(value)} className={`p-6 rounded-3xl border-2 text-center transition-all ${selected === value ? 'bg-indigo-600 border-indigo-400 scale-105 shadow-xl' : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'}`}>
    <div className="text-4xl font-black text-white">{value}</div>
    <div className="text-sm font-bold text-indigo-300 mt-2">{label}</div>
    <div className="text-lg font-black text-white mt-1">{persianLabel}</div>
  </button>
);

const ConsciousnessAssessment: React.FC<{ onBack: () => void; onHome: () => void; }> = ({ onBack, onHome }) => {
  const [scale, setScale] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleBack = () => {
    if (scale) {
      setScale(null);
      setResult(null);
    } else {
      onBack();
    }
  };

  const renderContent = () => {
    if (!scale) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
          <ScaleCard title="GCS (بزرگسالان)" subtitle="Glasgow Coma Scale" description="مقیاس کما گلاسکو برای سنین بالای ۴ سال و بزرگسالان" onClick={() => setScale('GCS')} />
          <ScaleCard title="GCS (اطفال)" subtitle="Pediatric GCS" description="تعدیل شده برای کودکان زیر ۲ سال و نوزادان غیرکلامی" onClick={() => setScale('Pediatric GCS')} />
          <ScaleCard title="FOUR" subtitle="FOUR Score" description="ارزیابی کامل عدم پاسخ‌دهی شامل رفلکس ساقه مغز و تنفس" onClick={() => setScale('FOUR')} />
          <ScaleCard title="AVPU" subtitle="AVPU Scale" description="غربالگری فوق سریع سطح هوشیاری بیمار" onClick={() => setScale('AVPU')} />
        </div>
      );
    }
    switch(scale) {
      case 'GCS': return <GCSScale onResult={setResult} />;
      case 'Pediatric GCS': return <PediatricGCSScale onResult={setResult} />;
      case 'AVPU': return <AVPUScale onResult={setResult} />;
      case 'FOUR': return <FOURScale onResult={setResult} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={handleBack} onHome={onHome} />
      <div className="premium-card p-10 space-y-8 border-indigo-500/20">
        <div className="pb-8 border-b border-white/5 text-center">
          <h3 className="text-3xl font-black text-white">ارزیابی سطح هوشیاری</h3>
          <p className="text-indigo-400 text-base font-bold mt-2">لطفاً مقیاس مورد نظر را انتخاب کنید</p>
        </div>
        {renderContent()}
      </div>
      {result && scale && <AssessmentResultDisplay title={`نتیجه ارزیابی ${scale}`} toolUsed={scale} score={result.score} interpretation={result.interpretation} color={result.color} icon={result.icon} recommendations={result.recommendations} />}
    </div>
  );
};

const ScaleCard = ({ title, subtitle, description, onClick }: any) => (
    <button onClick={onClick} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center hover:-translate-y-2 flex flex-col justify-between items-center min-h-[190px]">
      <div>
        <h3 className="text-2xl font-black text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors">{title}</h3>
        {subtitle && <p className="text-emerald-400 text-sm font-black mb-3">{subtitle}</p>}
      </div>
      <p className="text-white/60 text-xs font-bold leading-relaxed">{description}</p>
    </button>
);

export default ConsciousnessAssessment;
