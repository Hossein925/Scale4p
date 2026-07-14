
import React, { useState, useEffect } from 'react';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import ModuleHeader from './common/ModuleHeader';

const getSadPersonsRecommendations = (score: number): string[] => {
  if (score <= 2) return ["ترخیص بیمار با هماهنگی جهت پیگیری دقیق و منظم سرپایی.", "ارائه اطلاعات تماس مراکز حمایتی به بیمار و خانواده."];
  if (score <= 4) return ["ترخیص بیمار با پیشنهاد قوی برای بستری شدن در بخش روانپزشکی.", "اطمینان از وجود یک برنامه ایمنی (Safety Plan) قبل از ترخیص."];
  if (score <= 6) return ["بستری کردن بیمار جهت مشاهده دقیق و ارزیابی تخصصی روانپزشکی.", "شروع اقدامات پیشگیرانه از خودکشی در بخش (مانند حذف اشیاء خطرناک)."];
  if (score >= 7) return ["بستری فوری و اورژانسی در بخش روانپزشکی.", "تحت نظر گرفتن یک به یک (One-to-one observation) برای جلوگیری از آسیب به خود و دیگران."];
  return [];
};

const sadPersonsCriteria = [
  { name: 'sex', label: '(Sex) جنسیت: مرد', points: 1 },
  { name: 'age', label: '(Age) سن: کمتر از ۲۰ یا بیشتر از ۴۴ سال', points: 1 },
  { name: 'depression', label: '(Depression) افسردگی', points: 1 },
  { name: 'previous_attempt', label: '(Previous attempt) سابقه اقدام به خودکشی', points: 1 },
  { name: 'ethanol_abuse', label: '(Ethanol abuse) سوء مصرف الکل', points: 1 },
  { name: 'rational_loss', label: '(Rational thinking loss) از دست دادن تفکر منطقی', points: 1 },
  { name: 'social_support_lacking', label: '(Social Supports Lacking) عدم وجود پشتیبان اجتماعی', points: 1 },
  { name: 'organized_plan', label: '(Organized Plan) طراحی نقشه سازمان‌یافته', points: 1 },
  { name: 'no_spouse', label: '(No Spouse) مجرد، مطلقه، یا بیوه', points: 1 },
  { name: 'sickness', label: '(Sickness) بیماری مزمن، ناتوان‌کننده یا شدید', points: 1 },
];

const SuicideRiskAssessment: React.FC<{ onBack: () => void; onHome: () => void; }> = ({ onBack, onHome }) => {
  const [criteria, setCriteria] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const totalScore = sadPersonsCriteria.reduce((total, item) => {
      return criteria[item.name] ? total + item.points : total;
    }, 0);
    setScore(totalScore);

    let interpretation = "", color = "", icon = "";
    if (totalScore >= 7) {
      interpretation = "بستری و از آسیب به خود و دیگران تحت نظر باشد";
      color = "bg-red-800"; icon = "🆘";
    } else if (totalScore >= 5) {
      interpretation = "بستری و تحت نظر";
      color = "bg-orange-600"; icon = "🟠";
    } else if (totalScore >= 3) {
      interpretation = "ترخیص با پیشنهاد بستری";
      color = "bg-amber-500"; icon = "🟡";
    } else { // 0-2
      interpretation = "ترخیص همراه با پیگیری";
      color = "bg-emerald-600"; icon = "✅";
    }
    const recommendations = getSadPersonsRecommendations(totalScore);
    setResult({ interpretation, color, icon, recommendations });
  }, [criteria]);

  const toggleCriterion = (name: string) => {
    setCriteria(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={onBack} onHome={onHome} />
      <div className="premium-card p-10 space-y-12 border-indigo-500/20">
        <div className="pb-8 border-b border-white/5 text-center">
          <h3 className="text-3xl font-black text-white">معیار ارزیابی خطر خودکشی (SAD PERSONS)</h3>
          <p className="text-indigo-400 text-base font-bold mt-2">موارد منطبق با وضعیت بیمار را انتخاب کنید (هر مورد ۱ امتیاز)</p>
        </div>
        <div className="space-y-4">
          {sadPersonsCriteria.map(item => (
            <label key={item.name} className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${criteria[item.name] ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/5'}`}>
              <input type="checkbox" checked={!!criteria[item.name]} onChange={() => toggleCriterion(item.name)} className="w-5 h-5 rounded text-indigo-500 bg-slate-700 border-slate-500 focus:ring-indigo-500" />
              <span className="mr-4 text-white font-bold flex-1">{item.label}</span>
              <span className="font-black text-lg text-emerald-400">+{item.points}</span>
            </label>
          ))}
        </div>
      </div>
      {result && <AssessmentResultDisplay title="نتیجه ارزیابی ریسک خودکشی" toolUsed="SAD PERSONS Scale" score={score} interpretation={result.interpretation} color={result.color} icon={result.icon} recommendations={result.recommendations} />}
    </div>
  );
};

export default SuicideRiskAssessment;
