
import React, { useState, useEffect } from 'react';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import ModuleHeader from './common/ModuleHeader';

const getDvtRecommendations = (riskLevel: string): string[] => {
  switch(riskLevel) {
    case 'low':
      return ["ادامه مراقبت‌های روتین و تشویق به تحرک زودهنگام.", "آموزش به بیمار در مورد علائم DVT (تورم، درد، قرمزی پا)."];
    case 'moderate':
      return ["استفاده از جوراب‌های فشاری (TED hose) یا دستگاه‌های فشار متناوب (SCDs).", "در نظر گرفتن پروفیلاکسی دارویی (مانند انوکساپارین) طبق دستور پزشک.", "ارزیابی روزانه اندام‌ها و مقایسه با یکدیگر."];
    case 'high':
      return ["شروع فوری پروفیلاکسی دارویی و مکانیکی طبق پروتکل.", "اطلاع به پزشک جهت بررسی‌های تشخیصی (مانند سونوگرافی داپلر).", "آمادگی برای شروع درمان ضدانعقادی کامل."];
    default: return [];
  }
};

const getPteRecommendations = (riskLevel: string): string[] => {
    switch(riskLevel) {
      case 'low':
        return ["تشویق به تحرک و راه رفتن زودهنگام پس از جراحی.", "اطمینان از هیدراتاسیون کافی بیمار."];
      case 'moderate':
        return ["شروع پروفیلاکسی دارویی و مکانیکی (جوراب فشاری/SCDs).", "آموزش به بیمار در مورد علائم آمبولی ریه (تنگی نفس ناگهانی، درد قفسه سینه، سرفه خونی).", "پایش دقیق وضعیت تنفسی."];
      case 'high':
        return ["اطلاع فوری به پزشک جهت ارزیابی و اقدامات تشخیصی (مانند CT آنژیوگرافی).", "پایش مداوم علائم حیاتی، به ویژه اشباع اکسیژن (SpO2) و تعداد تنفس.", "آمادگی برای مداخلات اورژانسی و اکسیژن‌درمانی."];
      default: return [];
    }
  };

const wellsCriteriaDVT = [
  { name: 'paralysis', label: 'جراحی، صدمه یا گچ در اندام تحتانی، پارزی یا پارالایزی', points: 1 },
  { name: 'bedridden', label: 'بستری در تخت بیش از ۳ روز یا جراحی بزرگ در ۴ هفته قبل', points: 1 },
  { name: 'tenderness', label: 'تندرنس در مسیر وریدهای پشت زانو یا ران', points: 1 },
  { name: 'swelling', label: 'تورم یک عضو (کل اندام)', points: 1 },
  { name: 'pitting_edema', label: 'ادم گوده‌گذار در اندام مبتلا', points: 1 },
  { name: 'calf_swelling', label: 'تورم > ۳ سانتی‌متر یک پا نسبت به پای دیگر (در ۱۰ سانتی‌متری زیر زانو)', points: 1 },
  { name: 'collateral_veins', label: 'تورم عروق محیطی که ناشی از واریس نباشد', points: 1 },
  { name: 'previous_dvt', label: 'داشتن سابقه DVT قبلی', points: 1 },
  { name: 'cancer', label: 'بدخیمی حاد یا درمان شده در ۶ ماه گذشته', points: 1 },
  { name: 'alt_diagnosis', label: 'تشخیص جایگزین با احتمال بیشتری نسبت به DVT', points: -2 },
];

const wellsCriteriaPTE = [
  { name: 'dvt_symptoms', label: 'وجود علائم بالینی DVT', points: 3 },
  { name: 'no_alt_diagnosis', label: 'تشخیص دیگری کمتر از آمبولی محتمل است', points: 3 },
  { name: 'heart_rate', label: 'ضربان قلب بالای ۱۰۰', points: 1.5 },
  { name: 'immobilization', label: 'بی‌حرکتی ≥ ۳ روز یا جراحی در ۴ هفته اخیر', points: 1.5 },
  { name: 'previous_vte', label: 'سابقه قبلی DVT یا آمبولی ریه', points: 1.5 },
  { name: 'hemoptysis', label: 'خلط خونی (هموپتزی)', points: 1 },
  { name: 'cancer_active', label: 'بدخیمی فعال (تحت درمان یا تسکینی)', points: 1 },
];

const ThromboembolismAssessment: React.FC<{ onBack: () => void; onHome: () => void; }> = ({ onBack, onHome }) => {
  const [scale, setScale] = useState<'dvt' | 'pte'>('dvt');
  const [criteria, setCriteria] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<any>(null);

  const currentCriteria = scale === 'dvt' ? wellsCriteriaDVT : wellsCriteriaPTE;

  useEffect(() => {
    const totalScore = currentCriteria.reduce((total, item) => {
      return criteria[item.name] ? total + item.points : total;
    }, 0);
    setScore(totalScore);

    let interpretation = "", color = "", icon = "", riskLevel = "";
    let recommendations: string[] = [];

    if (scale === 'dvt') {
      if (totalScore >= 3) { riskLevel = "high"; interpretation = "احتمال بالا (High Probability)"; color = "bg-rose-700"; icon = "🚨"; }
      else if (totalScore >= 1) { riskLevel = "moderate"; interpretation = "احتمال متوسط (Moderate Probability)"; color = "bg-orange-600"; icon = "🟠"; }
      else { riskLevel = "low"; interpretation = "احتمال کم (Low Probability)"; color = "bg-emerald-600"; icon = "✅"; }
      recommendations = getDvtRecommendations(riskLevel);
    } else { // PTE
      if (totalScore > 6) { riskLevel = "high"; interpretation = "احتمال بالا (High Probability)"; color = "bg-rose-700"; icon = "🚨"; }
      else if (totalScore >= 2) { riskLevel = "moderate"; interpretation = "احتمال متوسط (Moderate Probability)"; color = "bg-orange-600"; icon = "🟠"; }
      else { riskLevel = "low"; interpretation = "احتمال کم (Low Probability)"; color = "bg-emerald-600"; icon = "✅"; }
      recommendations = getPteRecommendations(riskLevel);
    }
    
    setResult({ interpretation, color, icon, recommendations });
  }, [criteria, scale]);

  const toggleCriterion = (name: string) => {
    setCriteria(prev => ({ ...prev, [name]: !prev[name] }));
  };
  
  const handleScaleChange = (newScale: 'dvt' | 'pte') => {
    if (scale !== newScale) {
        setScale(newScale);
        setCriteria({});
    }
  };

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={onBack} onHome={onHome} />
      <div className="premium-card p-10 space-y-12 border-indigo-500/20">
        <div className="pb-8 border-b border-white/5 text-center">
          <h3 className="text-3xl font-black text-white">معیار ولز (Wells): ارزیابی ریسک ترومبوآمبولی وریدی</h3>
          <p className="text-indigo-400 text-base font-bold mt-2">لطفاً نوع ارزیابی مورد نظر را انتخاب کنید</p>
        </div>

        <div className="bg-white/5 p-2 rounded-2xl flex gap-2 border border-white/10 shadow-inner max-w-lg mx-auto">
            <button onClick={() => handleScaleChange('dvt')} className={`flex-1 px-8 py-3 rounded-xl text-sm font-black transition-all ${scale === 'dvt' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-white'}`}>
                ترومبوز ورید عمقی (DVT)
            </button>
            <button onClick={() => handleScaleChange('pte')} className={`flex-1 px-8 py-3 rounded-xl text-sm font-black transition-all ${scale === 'pte' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-white'}`}>
                آمبولی ریه (PTE)
            </button>
        </div>

        <div className="space-y-4 pt-6">
          {currentCriteria.map(item => (
            <label key={item.name} className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${criteria[item.name] ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/5'}`}>
              <input type="checkbox" checked={!!criteria[item.name]} onChange={() => toggleCriterion(item.name)} className="w-5 h-5 rounded text-indigo-500 bg-slate-700 border-slate-500 focus:ring-indigo-500" />
              <span className="mr-4 text-white font-bold flex-1">{item.label}</span>
              <span className={`font-black text-lg ${item.points > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{item.points > 0 ? `+${item.points}` : item.points}</span>
            </label>
          ))}
        </div>
      </div>
      {result && <AssessmentResultDisplay title={`نتیجه ارزیابی ریسک ${scale.toUpperCase()}`} toolUsed="Wells' Score" score={score} interpretation={result.interpretation} color={result.color} icon={result.icon} recommendations={result.recommendations} />}
    </div>
  );
};

export default ThromboembolismAssessment;
