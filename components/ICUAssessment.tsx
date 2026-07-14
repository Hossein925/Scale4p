
import React, { useState, useEffect } from 'react';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import ModuleHeader from './common/ModuleHeader';

const RASSScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
    const [score, setScore] = useState<number>(0);

    const rassLevels = [
        { score: 4, term: 'تهاجمی (Combative)', desc: 'خطر واضح برای پرسنل' },
        { score: 3, term: 'بسیار آژیته (Very Agitated)', desc: 'کشیدن لوله‌ها، رفتار تهاجمی' },
        { score: 2, term: 'آژیته (Agitated)', desc: 'حرکات غیرهدفمند و مکرر' },
        { score: 1, term: 'بی‌قرار (Restless)', desc: 'مضطرب، حرکات غی-تهاجمی' },
        { score: 0, term: 'هوشیار و آرام (Alert and Calm)', desc: '' },
        { score: -1, term: 'خواب‌آلود (Drowsy)', desc: 'بیش از ۱۰ ثانیه چشم باز نمی‌کند' },
        { score: -2, term: 'آرام‌بخشی سبک (Light Sedation)', desc: 'کمتر از ۱۰ ثانیه به صدا چشم باز می‌کند' },
        { score: -3, term: 'آرام‌بخشی متوسط (Moderate Sedation)', desc: 'چشم باز می‌کند ولی تماس چشمی ندارد' },
        { score: -4, term: 'آرام‌بخشی عمیق (Deep Sedation)', desc: 'به تحریک فیزیکی پاسخی نمی‌دهد' },
        { score: -5, term: 'غیرقابل بیدار شدن (Unarousable)', desc: 'بدون پاسخ به صدا یا تحریک' },
    ];

    useEffect(() => {
        const level = rassLevels.find(l => l.score === score);
        if (!level) return;

        let recommendations: string[] = [];
        let color = "bg-emerald-600", icon = "✅";

        if (score >= 3) {
            color = "bg-red-800"; icon = "🆘";
            recommendations = ["نیاز فوری به مداخله جهت کنترل آژیتاسیون.", "بررسی علل زمینه‌ای (درد، دلیریوم، هایپوکسی).", "اطلاع به پزشک جهت تنظیم داروهای سداتیو."];
        } else if (score >= 1) {
            color = "bg-amber-500"; icon = "🟡";
            recommendations = ["ارزیابی بیمار از نظر درد و اضطراب.", "استفاده از روش‌های غیردارویی آرام‌سازی.", "بررسی نیاز به تنظیم داروهای آرامبخش."];
        } else if (score === 0) {
            recommendations = ["سطح ایده‌آл. ادامه پایش طبق روتین."];
        } else if (score >= -2) {
            color = "bg-sky-600"; icon = "💤";
            recommendations = ["سطح مناسبی از سدیشن برای بسیاری از بیماران.", "ادامه پایش وضعیت هوشیاری و تنفسی."];
        } else { // -3 to -5
            color = "bg-indigo-800"; icon = "😴";
            recommendations = ["سدیشن عمیق. پایش دقیق همودینامیک و وضعیت تنفسی.", "بررسی روزانه جهت امکان سبک کردن سدیشن (Sedation Vacation)."];
        }

        onResult({ score, interpretation: level.term, color, icon, recommendations });
    }, [score]);

    return (
        <div className="pt-8 space-y-4">
            {rassLevels.map(level => (
                <button key={level.score} onClick={() => setScore(level.score)} className={`w-full text-right p-5 rounded-2xl border-2 transition-all flex items-center gap-5 ${score === level.score ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/5'}`}>
                    <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-2xl ${score === level.score ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-300'}`}>
                        {level.score > 0 ? `+${level.score}` : level.score}
                    </div>
                    <div>
                        <p className="font-bold text-white text-lg">{level.term}</p>
                        <p className="text-sm text-slate-400">{level.desc}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};

const SOFAScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
    const [values, setValues] = useState<any>({
        paO2: 95, fio2: 21, vent: false,
        platelets: 200, bilirubin: 1,
        map: 80, vasopressor: 'none',
        gcs: 15, creatinine: 1, urine: 2000
    });

    useEffect(() => {
        let totalScore = 0;
        let interpretationText = "";
        
        // Respiration
        const pfRatio = values.paO2 / (values.fio2 / 100);
        if (pfRatio < 100 && values.vent) totalScore += 4;
        else if (pfRatio < 200 && values.vent) totalScore += 3;
        else if (pfRatio < 300) totalScore += 2;
        else if (pfRatio < 400) totalScore += 1;

        // Coagulation
        if (values.platelets < 20) totalScore += 4;
        else if (values.platelets < 50) totalScore += 3;
        else if (values.platelets < 100) totalScore += 2;
        else if (values.platelets < 150) totalScore += 1;

        // Liver
        if (values.bilirubin >= 12) totalScore += 4;
        else if (values.bilirubin >= 6) totalScore += 3;
        else if (values.bilirubin >= 2) totalScore += 2;
        else if (values.bilirubin >= 1.2) totalScore += 1;

        // Cardiovascular
        if (values.vasopressor === 'high') totalScore += 4;
        else if (values.vasopressor === 'medium') totalScore += 3;
        else if (values.vasopressor === 'low') totalScore += 2;
        else if (values.map < 70) totalScore += 1;
        
        // CNS
        if (values.gcs < 6) totalScore += 4;
        else if (values.gcs <= 9) totalScore += 3;
        else if (values.gcs <= 12) totalScore += 2;
        else if (values.gcs <= 14) totalScore += 1;
        
        // Renal
        if (values.creatinine >= 5 || values.urine < 200) totalScore += 4;
        else if (values.creatinine >= 3.5 || values.urine < 500) totalScore += 3;
        else if (values.creatinine >= 2) totalScore += 2;
        else if (values.creatinine >= 1.2) totalScore += 1;

        interpretationText = `امتیاز بالاتر نشان‌دهنده اختلال عملکرد ارگان شدیدتر است. افزایش ناگهانی امتیاز به میزان ۲ یا بیشتر می‌تواند نشانگر سپسیس باشد.`;
        
        onResult({ score: totalScore, interpretation: interpretationText, color: 'bg-indigo-700', icon: '🧬' });
    }, [
        values.paO2, values.fio2, values.vent,
        values.platelets, values.bilirubin,
        values.map, values.vasopressor,
        values.gcs, values.creatinine, values.urine
    ]);

    const handleChange = (field: string, value: any) => {
        setValues((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="pt-8 space-y-8">
            <InputGroup title="۱. تنفسی (PaO2/FiO2)">
                <InputRow label="PaO2 (mmHg)" value={values.paO2} onChange={(v) => handleChange('paO2', v)} />
                <InputRow label="FiO2 (%)" value={values.fio2} onChange={(v) => handleChange('fio2', v)} />
                 <CheckboxRow label="تحت تهویه مکانیکی" checked={values.vent} onChange={(v) => handleChange('vent', v)} />
            </InputGroup>
            <InputGroup title="۲. انعقادی">
                 <InputRow label="پلاکت (x10³/µL)" value={values.platelets} onChange={(v) => handleChange('platelets', v)} />
            </InputGroup>
             <InputGroup title="۳. کبدی">
                 <InputRow label="بیلیروبین (mg/dL)" value={values.bilirubin} onChange={(v) => handleChange('bilirubin', v)} />
            </InputGroup>
            <InputGroup title="۴. قلبی-عروقی">
                <InputRow label="فشار متوسط شریانی (MAP)" value={values.map} onChange={(v) => handleChange('map', v)} />
                <RadioGroup
                    value={values.vasopressor}
                    onChange={(v) => handleChange('vasopressor', v)}
                    options={[
                        { value: 'none', label: 'بدون وازوپرسور' },
                        { value: 'low', label: 'دوپامین ≤۵ یا دوبوتامین' },
                        { value: 'medium', label: 'دوپامین >۵ یا اپی/نوراپی ≤۰.۱' },
                        { value: 'high', label: 'دوپامین >۱۵ یا اپی/نوراپی >۰.۱' },
                    ]}
                />
            </InputGroup>
            <InputGroup title="۵. سیستم عصبی مرکزی">
                 <InputRow label="امتیاز GCS" value={values.gcs} min={3} max={15} onChange={(v) => handleChange('gcs', v)} />
            </InputGroup>
             <InputGroup title="۶. کلیوی">
                 <InputRow label="کراتینین (mg/dL)" value={values.creatinine} onChange={(v) => handleChange('creatinine', v)} />
                 <InputRow label="برون‌ده ادراری (mL/day)" value={values.urine} onChange={(v) => handleChange('urine', v)} />
            </InputGroup>
        </div>
    );
};

const APACHEIIScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
    // A simplified implementation due to complexity
     const [values, setValues] = useState<any>({
        temp: 37, map: 90, hr: 80, rr: 16, pao2: 95, fio2: 21, ph: 7.4, na: 140, k: 4,
        creat: 1, arf: false, hct: 45, wbc: 8, gcs: 15,
        age: 50, chronic: 'none'
    });

    useEffect(() => {
        let aps = 0;
        // Simplified scoring for demonstration
        if (values.temp > 38.9 || values.temp < 35) aps += 3;
        if (values.map > 130 || values.map < 70) aps += 2;
        if (values.hr > 110 || values.hr < 70) aps += 2;
        if (values.rr > 25 || values.rr < 12) aps += 1;
        aps += (15 - values.gcs);

        let ageScore = 0;
        if (values.age >= 75) ageScore = 6;
        else if (values.age >= 65) ageScore = 5;
        else if (values.age >= 55) ageScore = 3;
        else if (values.age >= 45) ageScore = 2;
        
        let chronicScore = 0;
        if (values.chronic === 'emergency' || values.chronic === 'nonop') chronicScore = 5;
        else if (values.chronic === 'elective') chronicScore = 2;
        
        const totalScore = aps + ageScore + chronicScore;
        const interpretation = "امتیاز بالاتر نشان‌دهنده شدت بیماری بیشتر و ریسک بالاتر مورتالیتی است.";
        
        onResult({ score: totalScore, interpretation, color: 'bg-rose-800', icon: '📈' });
    }, [
        values.temp, values.map, values.hr, values.rr,
        values.gcs, values.age, values.chronic
    ]);

    const handleChange = (field: string, value: any) => {
        setValues((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
         <div className="pt-8 space-y-8">
            <h4 className="text-xl font-black text-center text-indigo-300">بخش A: امتیاز فیزیولوژی حاد (APS)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <InputRow label="دما (°C)" value={values.temp} onChange={(v) => handleChange('temp', v)} />
                <InputRow label="MAP (mmHg)" value={values.map} onChange={(v) => handleChange('map', v)} />
                <InputRow label="ضربان قلب" value={values.hr} onChange={(v) => handleChange('hr', v)} />
                <InputRow label="تعداد تنفس" value={values.rr} onChange={(v) => handleChange('rr', v)} />
                <InputRow label="PaO2 (mmHg)" value={values.pao2} onChange={(v) => handleChange('pao2', v)} />
                <InputRow label="pH شریانی" value={values.ph} onChange={(v) => handleChange('ph', v)} />
                <InputRow label="سدیم (mEq/L)" value={values.na} onChange={(v) => handleChange('na', v)} />
                <InputRow label="پتاسیم (mEq/L)" value={values.k} onChange={(v) => handleChange('k', v)} />
                <InputRow label="کراتینین" value={values.creat} onChange={(v) => handleChange('creat', v)} />
                <InputRow label="هماتوکریت (%)" value={values.hct} onChange={(v) => handleChange('hct', v)} />
                <InputRow label="WBC" value={values.wbc} onChange={(v) => handleChange('wbc', v)} />
                <InputRow label="GCS" value={values.gcs} min={3} max={15} onChange={(v) => handleChange('gcs', v)} />
            </div>
             <CheckboxRow label="نارسایی حاد کلیه (جهت دو برابر کردن امتیاز کراتینین)" checked={values.arf} onChange={(v) => handleChange('arf', v)} />
            
            <h4 className="text-xl font-black text-center text-indigo-300 pt-6 border-t border-white/10">بخش B: امتیاز سن</h4>
             <InputRow label="سن بیمار" value={values.age} onChange={(v) => handleChange('age', v)} />

            <h4 className="text-xl font-black text-center text-indigo-300 pt-6 border-t border-white/10">بخش C: امتیاز بیماری مزمن</h4>
             <RadioGroup
                    value={values.chronic}
                    onChange={(v) => handleChange('chronic', v)}
                    options={[
                        { value: 'none', label: 'بدون بیماری مزمن' },
                        { value: 'nonop', label: 'بیماری مزمن غیرجراحی' },
                        { value: 'emergency', label: 'بیماری مزمن جراحی اورژانسی' },
                        { value: 'elective', label: 'بیماری مزمن جراحی الکتیو' },
                    ]}
                />
        </div>
    )
}

const ICUAssessment: React.FC<{ onBack: () => void; onHome: () => void; }> = ({ onBack, onHome }) => {
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
                    <ScaleCard title="RASS" subtitle="Richmond Agitation-Sedation Scale" onClick={() => setScale('RASS')} />
                    <ScaleCard title="SOFA" subtitle="Sequential Organ Failure Assessment" onClick={() => setScale('SOFA')} />
                    <ScaleCard title="APACHE II" subtitle="Acute Physiology Evaluation II" onClick={() => setScale('APACHE II')} />
                </div>
            );
        }
        switch (scale) {
            case 'RASS': return <RASSScale onResult={setResult} />;
            case 'SOFA': return <SOFAScale onResult={setResult} />;
            case 'APACHE II': return <APACHEIIScale onResult={setResult} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            <ModuleHeader onBack={handleBack} onHome={onHome} />
            <div className="premium-card p-10 space-y-8 border-indigo-500/20">
                <div className="pb-8 border-b border-white/5 text-center">
                    <h3 className="text-3xl font-black text-white">ابزارهای تخصصی ICU</h3>
                    <p className="text-indigo-400 text-base font-bold mt-2">مقیاس‌های ارزیابی بیماران بخش مراقبت‌های ویژه</p>
                </div>
                {renderContent()}
            </div>
            {result && scale && <AssessmentResultDisplay title={`نتیجه ارزیابی ${scale}`} toolUsed={scale as any} score={result.score} interpretation={result.interpretation} color={result.color} icon={result.icon} recommendations={result.recommendations} />}
        </div>
    );
};

const ScaleCard = ({ title, subtitle, onClick }: any) => (
    <button onClick={onClick} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center hover:-translate-y-2">
      <h3 className="text-5xl font-black text-indigo-400 mb-3">{title}</h3>
      <p className="text-white text-sm font-bold">{subtitle}</p>
    </button>
);

// Helper Components for Inputs
const InputGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10">
        <h4 className="text-lg font-black text-slate-200">{title}</h4>
        <div className="space-y-4">{children}</div>
    </div>
);

const InputRow = ({ label, value, onChange, min = 0, max = 1000 }: any) => (
    <div className="flex items-center gap-4">
        <label className="text-sm font-bold text-slate-400 w-1/2">{label}</label>
        <input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-1/2 p-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white font-bold text-center"
        />
    </div>
);

const CheckboxRow = ({ label, checked, onChange }: any) => (
    <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-5 h-5 rounded text-indigo-500 bg-slate-700 border-slate-500 focus:ring-indigo-500" />
        <span className="text-sm font-bold text-slate-300">{label}</span>
    </label>
);

const RadioGroup = ({ options, value, onChange }: any) => (
    <div className="grid grid-cols-2 gap-2">
        {options.map((opt: any) => (
            <label key={opt.value} className={`p-3 rounded-lg text-center text-xs font-bold cursor-pointer transition-colors ${value === opt.value ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-slate-300'}`}>
                <input type="radio" name="vaso" value={opt.value} checked={value === opt.value} onChange={(e) => onChange(e.target.value)} className="hidden" />
                {opt.label}
            </label>
        ))}
    </div>
);

export default ICUAssessment;
