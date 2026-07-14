
import React, { useState, useEffect } from 'react';
import { HumptyDumptyScores } from '../types';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import AssessmentRow from './common/AssessmentRow';
import ModuleHeader from './common/ModuleHeader';

const getMorseRecommendations = (riskLevel: string): string[] => {
  switch (riskLevel) {
    case 'low':
      return ["آموزش به بیمار و همراه در مورد ایمنی محیط.", "اطمینان از در دسترس بودن زنگ اخبار.", "حفظ محیطی با نور کافی و عاری از موانع."];
    case 'medium':
      return ["نصب دستگیره در کنار تخت و سرویس بهداشتی.", "استفاده از تخت در پایین‌ترین ارتفاع ممکن.", "استفاده از دستبند زرد رنگ (هشدار ریسک سقوط).", "بررسی نیاز به وسایل کمکی حین راه رفتن."];
    case 'high':
      return ["نظارت دقیق و مکرر بر بیمار (هر ۱-۲ ساعت).", "همراهی بیمار حین راه رفتن و انتقال.", "قرار دادن بیمار در اتاقی نزدیک به ایستگاه پرستاری.", "اطمینان از قفل بودن چرخ‌های تخت و ویلچر."];
    default:
      return [];
  }
};

const getHumptyRecommendations = (riskLevel: string): string[] => {
  switch (riskLevel) {
    case 'low':
      return ["آموزش ایمنی به والدین و کودک (متناسب با سن).", "بالا بودن نرده‌های تخت در همه حال.", "اطمینان از وجود روشنایی کافی در شب."];
    case 'high':
      return ["نصب علامت هشدار سقوط (ستاره زرد) بالای تخت بیمار.", "در نظر گرفتن همراهی دائم بیمار یا افزایش فواصل سرکشی.", "قرار دادن وسایل ضروری در دسترس کودک.", "استفاده از دستبند شناسایی ریسک سقوط."];
    default:
      return [];
  }
}

const MorseScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [scores, setScores] = useState({ history: 0, secondary: 0, aid: 0, iv: 0, gait: 0, mental: 0 });

  const handleSelect = (cat: keyof typeof scores, val: number) => {
    const newScores = { ...scores, [cat]: val };
    setScores(newScores);
    const total = (Object.values(newScores) as number[]).reduce((a, b) => a + b, 0);
    
    let interpretation = "", color = "", icon = "", riskLevel = "";
    if (total > 45) {
      riskLevel = 'high';
      interpretation = "ریسک بالا (High Risk)";
      color = "bg-rose-700";
      icon = "🚨";
    } else if (total >= 25) {
      riskLevel = 'medium';
      interpretation = "ریسک متوسط (Medium Risk)";
      color = "bg-amber-500";
      icon = "🟡";
    } else {
      riskLevel = 'low';
      interpretation = "ریسک کم (Low Risk)";
      color = "bg-emerald-600";
      icon = "✅";
    }
    const recommendations = getMorseRecommendations(riskLevel);
    onResult({ score: total, interpretation, color, icon, recommendations });
  };
  
  return (
    <div className="grid gap-12 pt-8">
        <AssessmentRow title="۱. سابقه سقوط" currentValue={scores.history} onSelect={(v) => handleSelect('history', v)} options={[{label: 'خیر', value: 0}, {label: 'بله (در ۳ ماه گذشته)', value: 25}]} />
        <AssessmentRow title="۲. تشخیص پزشکی ثانویه" currentValue={scores.secondary} onSelect={(v) => handleSelect('secondary', v)} options={[{label: 'خیر (فقط یک تشخیص فعال)', value: 0}, {label: 'بله (بیش از یک تشخیص فعال)', value: 15}]} />
        <AssessmentRow title="۳. ابزار کمکی" currentValue={scores.aid} onSelect={(v) => handleSelect('aid', v)} options={[{label: 'بدون کمک/استراحت مطلق/ویلچر', value: 0}, {label: 'عصا/واکر', value: 15}, {label: 'تکیه به وسایل اطراف', value: 30}]} />
        <AssessmentRow title="۴. IV درمانی" currentValue={scores.iv} onSelect={(v) => handleSelect('iv', v)} options={[{label: 'خیر', value: 0}, {label: 'بله', value: 20}]} />
        <AssessmentRow title="۵. الگوی گام برداشتن" currentValue={scores.gait} onSelect={(v) => handleSelect('gait', v)} options={[{label: 'نرمال', value: 0}, {label: 'ضعیف (سر خمیده، گام کوتاه)', value: 10}, {label: 'مختل (مشکل در برخاستن، نگاه به زمین)', value: 20}]} />
        <AssessmentRow title="۶. وضعیت روانی" currentValue={scores.mental} onSelect={(v) => handleSelect('mental', v)} options={[{label: 'طبیعی (آگاه به توانایی خود)', value: 0}, {label: 'فراموشکاری محدودیت‌ها', value: 15}]} />
    </div>
  );
};

const HumptyDumptyScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [scores, setScores] = useState<HumptyDumptyScores>({ age: 1, gender: 1, diagnosis: 1, cognitive: 1, environmental: 1, surgery: 1, medication: 1 });

  useEffect(() => {
    const total = (Object.values(scores) as number[]).reduce((a, b) => a + b, 0);
    let interpretation = "", color = "", icon = "", riskLevel = "";
    if (total >= 12) {
      riskLevel = 'high';
      interpretation = "ریسک بالای سقوط (High Risk)";
      color = "bg-rose-700";
      icon = "🚨";
    } else { // 7-11
      riskLevel = 'low';
      interpretation = "ریسک پایین سقوط (Low Risk)";
      color = "bg-amber-500";
      icon = "🟡";
    }
    const recommendations = getHumptyRecommendations(riskLevel);
    onResult({ score: total, interpretation, color, icon, recommendations });
  }, [scores]);
  
  const handleSelect = (cat: keyof HumptyDumptyScores, val: number) => {
    setScores(prev => ({...prev, [cat]: val}));
  }

  return (
    <div className="grid gap-12 pt-8">
      <AssessmentRow title="۱. سن" currentValue={scores.age} onSelect={(v) => handleSelect('age', v)} options={[{label: '< ۳ سال', value: 4}, {label: '۳ تا ۷ سال', value: 3}, {label: '۷ تا ۱۳ سال', value: 2}, {label: '≥ ۱۳ سال', value: 1}]} />
      <AssessmentRow title="۲. جنس" currentValue={scores.gender} onSelect={(v) => handleSelect('gender', v)} options={[{label: 'پسر', value: 2}, {label: 'دختر', value: 1}]} />
      <AssessmentRow title="۳. تشخیص بالینی" currentValue={scores.diagnosis} onSelect={(v) => handleSelect('diagnosis', v)} options={[{label: 'تشخیص‌های نورولوژیک', value: 4}, {label: 'اختلال در اکسیژن‌رسانی', value: 3}, {label: 'اختلالات روانی/رفتاری', value: 2}, {label: 'تشخیص‌های دیگر', value: 1}]} />
      <AssessmentRow title="۴. اختلالات شناختی" currentValue={scores.cognitive} onSelect={(v) => handleSelect('cognitive', v)} options={[{label: 'عدم آگاهی از ناتوانی', value: 3}, {label: 'فراموشی محدودیت‌ها', value: 2}, {label: 'آگاهی کامل از توانایی', value: 1}]} />
      <AssessmentRow title="۵. فاکتورهای محیطی" currentValue={scores.environmental} onSelect={(v) => handleSelect('environmental', v)} options={[{label: 'سابقه سقوط/شیرخوار در تخت نامناسب', value: 4}, {label: 'استفاده از وسایل کمک حرکتی', value: 3}, {label: 'بیمار در تخت است', value: 2}, {label: 'بیمار سرپایی', value: 1}]} />
      <AssessmentRow title="۶. پاسخ به جراحی/بیهوشی" currentValue={scores.surgery} onSelect={(v) => handleSelect('surgery', v)} options={[{label: 'تا ۲۴ ساعت بعد از عمل', value: 3}, {label: 'تا ۴۸ ساعت بعد از عمل', value: 2}, {label: '> ۴۸ ساعت گذشته یا بدون جراحی', value: 1}]} />
      <AssessmentRow title="۷. داروهای مصرفی" currentValue={scores.medication} onSelect={(v) => handleSelect('medication', v)} options={[{label: 'استفاده همزمان از داروهای پرخطر', value: 3}, {label: 'فقط یکی از داروهای پرخطر', value: 2}, {label: 'بدون داروهای پرخطر', value: 1}]} />
    </div>
  );
}

const getNeonatalFallRecommendations = (riskLevel: string): string[] => {
  switch (riskLevel) {
    case 'low':
      return [
        "آموزش روتین به مادر جهت نگهداری ایمن نوزاد در هم‌آغوشی و تغذیه متناسب با رهنمودهای ایمنی نوزاد.",
        "تأکید بر بالا بودن دائم ریل‌های تخت نوزاد یا قرارگیری صحیح نوزاد درون کات/انکوباتور.",
        "پایش منظم وضعیت هوشیاری مادر حین در آغوش گرفتن نوزاد به منظور پیشگیری از غوطه‌ور شدن نوزاد به دلیل خواب‌آلودگی مادر.",
        "آموزش خطرات بالقوه سقوط نوزاد به والدین به صورت کتبی یا شفاهی."
      ];
    case 'high':
      return [
        "آموزش فوری و مستمر به مادر و خانواده درباره خطرات سقوط نوزاد و تکمیل چک‌لیست آگاهی بیمار و امضای آن.",
        "نظارت شدید و مکرر پرسنل پرستاری در زمان‌هایی که مادر داروهای خواب‌آور، آرام‌بخش یا ضددرد قوی دریافت می‌کند.",
        "اطمینان کامل از انتقال ایمن نوزاد با برانکارد یا کات چرخ‌دار بجای حمل دستی طویل در راهروها.",
        "نصب تابلوی هشدار دهنده ریسک سقوط نوزاد (نشان ستاره زرد یا کارت هشدار متمایز) بالای انکوباتور/کات نوزاد و روی کارتکس پرستاری.",
        "ارزیابی مکرر و کنترل درد نوزاد و مادر و مانیتورینگ متغیرهای همودینامیک نوزادان بدحال.",
        "در صورت تغذیه با شیر مادر در آغوش، همواره یکی از همراهان هوشیار یا پرسنل بر بالین حضور داشته باشد (بویژه در شیفت شب).",
        "اطمینان از ارزیابی مجدد ریسک سقوط نوزاد در آغاز هر شیفت یا با هرگونه تغییر بالینی نوزاد یا مادر."
      ];
    default:
      return [];
  }
};

const NeonatalFallScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [infantRisks, setInfantRisks] = useState({
    incubatorOut: false,
    breastfeeding: false,
    bathing: false,
    invasiveProcedures: false,
    priorFall: false,
    seizures: false,
    connectedEquipment: false,
    infantTransfer: false,
    painGE1: false,
    clinicalDeterioration: false
  });

  const [motherRisks, setMotherRisks] = useState({
    clinicalChanges: false,
    physicalDisability: false,
    specificMeds: false,
    painGE1: false,
    lackOfAwareness: false,
    hospitalization: false,
    medPainControl: false
  });

  useEffect(() => {
    // Each infant risk is 1 pt
    const infantScore = Object.values(infantRisks).filter(Boolean).length;
    // Mother risk scoring:
    let motherScore = 0;
    if (motherRisks.clinicalChanges) motherScore += 1;
    if (motherRisks.physicalDisability) motherScore += 1;
    if (motherRisks.specificMeds) motherScore += 1;
    if (motherRisks.painGE1) motherScore += 1;
    if (motherRisks.lackOfAwareness) motherScore += 1;
    if (motherRisks.hospitalization) motherScore += 1;
    if (motherRisks.medPainControl) motherScore += 4;

    const total = infantScore + motherScore;

    let interpretation = "", color = "", icon = "", riskLevel = "";
    if (total >= 4) {
      riskLevel = 'high';
      interpretation = `ریسک بالا (High Risk) - امتیاز ${total} از ۲۰`;
      color = "bg-rose-700";
      icon = "🚨";
    } else {
      riskLevel = 'low';
      interpretation = `ریسک پایین (Low Risk) - امتیاز ${total} از ۲۰`;
      color = "bg-emerald-600";
      icon = "✅";
    }

    const recommendations = getNeonatalFallRecommendations(riskLevel);
    onResult({ score: total, interpretation, color, icon, recommendations, toolUsed: 'NeonatalFall' });
  }, [infantRisks, motherRisks]);

  const toggleInfant = (key: keyof typeof infantRisks) => {
    setInfantRisks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMother = (key: keyof typeof motherRisks) => {
    setMotherRisks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const infantFields = [
    { key: 'incubatorOut', label: 'خارج کردن نوزاد از تخت یا انکوباتور به هر دلیل', score: 1 },
    { key: 'breastfeeding', label: 'تغذیه با شیر مادر (آغوش مادر)', score: 1 },
    { key: 'bathing', label: 'حمام کردن / مراقبت از نوزاد', score: 1 },
    { key: 'invasiveProcedures', label: 'مداخلات / آزمایش‌های تهاجمی و نمونه‌گیری خون', score: 1 },
    { key: 'priorFall', label: 'سابقه سقوط نوزاد', score: 1 },
    { key: 'seizures', label: 'تاریخچه تشنج‌ها (نوزاد و مادر)', score: 1 },
    { key: 'connectedEquipment', label: 'تجهیزات جراحی و غیرجراحی متصل به نوزاد (اکسیژن، کاتتر ادراری، پروب، لوله‌ها، ونتیلاتور و...)', score: 1 },
    { key: 'infantTransfer', label: 'حمل و انتقال نوزاد', score: 1 },
    { key: 'painGE1', label: 'امتیاز درد نوزاد بیشتر یا مساوی ۱ (Pain Score ≥ 1)', score: 1 },
    { key: 'clinicalDeterioration', label: 'بدحال بودن نوزاد (بی‌قراری، اختلال خواب، مشکلات تنفسی، مکیدن، بلع، تب و...)', score: 1 }
  ];

  const motherFields = [
    { key: 'clinicalChanges', label: 'تغییرات در وضعیت بالینی مادر (مانند خونریزی، تشنج، هایپوگلیسمی، هیپرتنشن و...)', score: 1 },
    { key: 'physicalDisability', label: 'ناتوانی فیزیکی مادر که بسیار جوان یا بسیار مسن است', score: 1 },
    { key: 'specificMeds', label: 'استفاده مادر از داروهای خاص (آرام‌بخش، خواب‌آور و...)', score: 1 },
    { key: 'painGE1', label: 'درد مادر بیشتر یا مساوی ۱ (Pain Score ≥ 1)', score: 1 },
    { key: 'lackOfAwareness', label: 'عدم آگاهی مادر یا خانواده از خطرات سقوط نوزاد', score: 1 },
    { key: 'hospitalization', label: 'بستری شدن مادر در بیمارستان', score: 1 },
    { key: 'medPainControl', label: 'کنترل درد مادر با استفاده از داروهای مربوطه (مانند مسکن‌های تزریقی/مخدر)', score: 4 }
  ];

  return (
    <div className="space-y-8 pt-8">
      <div className="bg-indigo-950/40 p-6 rounded-3xl border border-indigo-500/10 text-center">
        <h4 className="text-xl font-black text-white">معیار نوین ارزیابی خطر سقوط نوزادان</h4>
        <p className="text-slate-400 text-sm mt-1">تکمیل چک‌لیست برای نوزادان بستری بر اساس متدهای بالینی استاندارد مامایی و نوزادان</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Infant Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <span className="text-2xl">👶</span>
            <h5 className="text-lg font-black text-indigo-300">خطرات مربوط به نوزاد (تا ۱۰ امتیاز)</h5>
          </div>
          <div className="space-y-2.5">
            {infantFields.map((item) => (
              <label
                key={item.key}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-right cursor-pointer transition-all ${
                  infantRisks[item.key as keyof typeof infantRisks]
                    ? 'bg-indigo-950/50 border-indigo-500 text-white'
                    : 'bg-slate-900/40 border-white/5 text-slate-300 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 pl-2">
                  <input
                    type="checkbox"
                    checked={infantRisks[item.key as keyof typeof infantRisks]}
                    onChange={() => toggleInfant(item.key as keyof typeof infantRisks)}
                    className="w-5 h-5 rounded accent-indigo-500 cursor-pointer"
                  />
                </div>
                <div className="flex-1 pr-2">
                  <span className="text-sm font-medium leading-relaxed block">{item.label}</span>
                </div>
                <div className="mr-3 bg-white/5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-indigo-400">
                  +{item.score}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Mother Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <span className="text-2xl">👩</span>
            <h5 className="text-lg font-black text-indigo-300">خطرات مربوط به مادر (تا ۱۰ امتیاز)</h5>
          </div>
          <div className="space-y-2.5">
            {motherFields.map((item) => (
              <label
                key={item.key}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-right cursor-pointer transition-all ${
                  motherRisks[item.key as keyof typeof motherRisks]
                    ? 'bg-indigo-950/50 border-indigo-500 text-white'
                    : 'bg-slate-900/40 border-white/5 text-slate-300 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 pl-2">
                  <input
                    type="checkbox"
                    checked={motherRisks[item.key as keyof typeof motherRisks]}
                    onChange={() => toggleMother(item.key as keyof typeof motherRisks)}
                    className="w-5 h-5 rounded accent-indigo-500 cursor-pointer"
                  />
                </div>
                <div className="flex-1 pr-2">
                  <span className="text-sm font-medium leading-relaxed block">{item.label}</span>
                </div>
                <div className="mr-3 bg-white/5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-indigo-400">
                  +{item.score}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FallRiskAssessment: React.FC<{ onBack: () => void; onHome: () => void; }> = ({ onBack, onHome }) => {
  const [scale, setScale] = useState<'morse' | 'humpty' | 'neonatal' | null>(null);
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
        <div className="space-y-12 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <MainCard title="بزرگسالان" subtitle="Morse Fall Scale" icon="👨‍🦳" onClick={() => setScale('morse')} />
            <MainCard title="اطفال" subtitle="Humpty Dumpty Scale" icon="👶" onClick={() => setScale('humpty')} />
            <MainCard title="نوزادان" subtitle="Neonatal Fall Scale" icon="🤱" onClick={() => setScale('neonatal')} />
          </div>

          <div className="border-t border-white/5 pt-12 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-4xl">💡</span>
              <h4 className="text-2xl font-black text-white">متدها و تکنیک‌های استاندارد پیشگیری از سقوط</h4>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">دستورالعمل‌های بالینی و خودمراقبتی جهت افزایش ایمنی و به حداقل رساندن خطرات احتمالی در بخش</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
              <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-4 hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏠</span>
                  <div>
                    <h5 className="text-lg font-black text-indigo-300">۱. ایمن‌سازی محیط فیزیکی</h5>
                    <span className="text-[10px] text-slate-500 font-mono">Environmental Safety</span>
                  </div>
                </div>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-2.5 leading-relaxed pr-2">
                  <li>روشنایی شبانه کافی در کابین و حمام؛ روشن نگه داشتن چراغ‌های راهنما در تاریکی.</li>
                  <li>حذف فوری اشیاء اضافی، ملافه‌های رها شده و سیم‌های برق مزاحم از مسیرهای رفت‌وآمد بیمار.</li>
                  <li>استفاده از نوارهای ضد لغزش یا تاتامی‌های پلیمری غیر لغزنده در کف حمام و دستشویی بیمارستان.</li>
                </ul>
              </div>

              <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-4 hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🛏️</span>
                  <div>
                    <h5 className="text-lg font-black text-indigo-300">۲. مانیتورینگ تخت و تجهیزات</h5>
                    <span className="text-[10px] text-slate-500 font-mono">Bed & Equipment Protocols</span>
                  </div>
                </div>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-2.5 leading-relaxed pr-2">
                  <li>تنظیم دائم تخت در پایین‌ترین ارتفاع نسبت به زمین و اطمینان از قفل بودن چرخ‌های تخت و ویلچر.</li>
                  <li>بالا بودن مستمر ریل‌های محافظ کنار تخت (Side Rails)، به ویژه در طول استراحت و شب.</li>
                  <li>قرار دادن دکمه زنگ اخبار، تلفن همراه، آب آشامیدنی و عینک دقیقاً در مجاورت و قابل دسترس بیمار.</li>
                </ul>
              </div>

              <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-4 hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🚶</span>
                  <div>
                    <h5 className="text-lg font-black text-indigo-300">۳. تکنیک‌های پویا و ایمن جابجایی</h5>
                    <span className="text-[10px] text-slate-500 font-mono">Safe Transfer Techniques</span>
                  </div>
                </div>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-2.5 leading-relaxed pr-2">
                  <li><strong>قانون ۳۰ ثانیه‌ای ایست لب تخت:</strong> آموزش به بیمار جهت نشستن کامل روی لبه تخت به مدت حداقل ۳۰ ثانیه قبل از برخاستن به منظور پیشگیری از افت فشار وضعیتی ناگهانی (Orthostatic Hypotension).</li>
                  <li>استفاده الزامی از دمپایی یا کفش‌های طبی فیت و غیر لغزنده به جای جوراب‌های صاف.</li>
                  <li>درخواست کمک مداوم از پرسنل پرستاری حین خروج اول پس از عمل جراحی یا بی‌حسی نخاعی.</li>
                </ul>
              </div>

              <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-4 hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💊</span>
                  <div>
                    <h5 className="text-lg font-black text-indigo-300">۴. مراقبت‌های دارویی و نمادهای هشدار</h5>
                    <span className="text-[10px] text-slate-500 font-mono">Clinical & Medication Care</span>
                  </div>
                </div>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-2.5 leading-relaxed pr-2">
                  <li>بررسی اثر داروها بر تعادل و هوشیاری (مانند مسکن‌های مخدر، دیورتیک‌ها، خواب‌آورها و داروهای ضد فشارخون).</li>
                  <li>بستن دستبند زرد متمایز هشدار سقوط روی مچ بیمار و نصب علامت ستاره روی کارتکس و بالای تخت.</li>
                  <li>آموزش‌های اختصاصی و دلسوزانه به همراه بیمار و والدین اطفال جهت پایش پیوسته رفتار کودک.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (scale === 'morse') return <MorseScale onResult={setResult} />;
    if (scale === 'humpty') return <HumptyDumptyScale onResult={setResult} />;
    if (scale === 'neonatal') return <NeonatalFallScale onResult={setResult} />;
  };

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={handleBack} onHome={onHome} />
      <div className="premium-card p-10 space-y-8 border-indigo-500/20">
        <div className="pb-8 border-b border-white/5 text-center">
          <h3 className="text-3xl font-black text-white">ارزیابی ریسک سقوط</h3>
          <p className="text-indigo-400 text-base font-bold mt-2">انتخاب مقیاس بر اساس گروه سنی بیمار</p>
        </div>
        {renderContent()}
      </div>
      {result && <AssessmentResultDisplay title="نتیجه ارزیابی ریسک سقوط" toolUsed={scale === 'morse' ? 'Morse' : scale === 'humpty' ? 'Humpty Dumpty' : 'Neonatal Fall'} score={result.score} interpretation={result.interpretation} color={result.color} icon={result.icon} recommendations={result.recommendations} />}
    </div>
  );
};

const MainCard = ({ title, subtitle, icon, onClick }: any) => (
    <button onClick={onClick} className="group premium-card p-10 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center border-white/5 hover:border-indigo-500/50">
      <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 text-6xl">{icon}</div>
      <h3 className="text-3xl font-black text-white mb-2">{title}</h3>
      <p className="text-indigo-400 text-sm font-bold">{subtitle}</p>
    </button>
  );

export default FallRiskAssessment;
