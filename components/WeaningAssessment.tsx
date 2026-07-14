import React, { useState, useEffect } from 'react';
import ModuleHeader from './common/ModuleHeader';

interface Props {
  onBack: () => void;
  onHome: () => void;
}

type TabType = 'RSBI' | 'CROP' | 'IWI' | 'P01' | 'NIF' | 'SBT_CHECKLIST';

const WeaningAssessment: React.FC<Props> = ({ onBack, onHome }) => {
  const [activeTab, setActiveTab] = useState<TabType>('RSBI');

  // Input states
  // 1. Common inputs
  const [f, setF] = useState<number>(18); // respiratory frequency (breaths/min)
  const [vt, setVt] = useState<number>(0.45); // tidal volume (Liters)
  
  // 2. Compliance inputs
  const [cdyn, setCdyn] = useState<number>(35); // dynamic compliance (mL / cmH2O)
  const [cstat, setCstat] = useState<number>(45); // static compliance (mL / cmH2O)
  
  // 3. Pressure inputs
  const [mip, setMip] = useState<number>(-25); // MIP / NIF (cmH2O)
  const [p01, setP01] = useState<number>(2.5); // P0.1 (cmH2O)
  
  // 4. Oxygenation inputs
  const [sao2, setSao2] = useState<number>(96); // SaO2 (%)
  const [pao2, setPao2] = useState<number>(85); // PaO2 (mmHg)
  const [fio2, setFio2] = useState<number>(40); // FiO2 (%)
  const [paco2, setPaco2] = useState<number>(40); // PaCO2 (mmHg)

  // Computed Values
  const [rsbi, setRsbi] = useState<number>(0);
  const [crop, setCrop] = useState<number>(0);
  const [iwi, setIwi] = useState<number>(0);
  const [pao2Pao2Ratio, setPao2Pao2Ratio] = useState<number>(0);
  const [pao2Alveolar, setPao2Alveolar] = useState<number>(0);

  // SBT Checklist states
  const [checklist, setChecklist] = useState({
    causeResolved: false,
    pao2Fio2Ok: false,
    peepOk: false,
    hemodynamicStable: false,
    consciousGcs: false,
    coughSecretions: false,
    temperatureOk: false,
    electrolytesOk: false,
  });

  // Calculate values
  useEffect(() => {
    // 1. RSBI
    const calculatedRsbi = vt > 0 ? f / vt : 0;
    setRsbi(calculatedRsbi);

    // 2. Alveolar gas equation for PAO2
    // PAO2 = FiO2/100 * (760 - 47) - PaCO2 / 0.8  (at sea level)
    const PAO2 = (fio2 / 100) * 713 - paco2 / 0.8;
    setPao2Alveolar(PAO2);

    const ratio = PAO2 > 0 ? pao2 / PAO2 : 0;
    setPao2Pao2Ratio(ratio);

    // 3. CROP Index
    // CROP = [Cdyn * |MIP| * (PaO2/PAO2)] / f
    const absMip = Math.abs(mip);
    const calculatedCrop = f > 0 ? (cdyn * absMip * ratio) / f : 0;
    setCrop(calculatedCrop);

    // 4. IWI
    // IWI = (Cstat * SaO2) / RSBI
    const calculatedIwi = calculatedRsbi > 0 ? (cstat * sao2) / calculatedRsbi : 0;
    setIwi(calculatedIwi);
  }, [f, vt, cdyn, cstat, mip, sao2, pao2, fio2, paco2]);

  const toggleChecklistItem = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedSbtItems = Object.values(checklist).filter(Boolean).length;
  const totalSbtItems = Object.keys(checklist).length;

  const renderRSBI = () => {
    const isSuccess = rsbi < 105;
    const isExcellent = rsbi < 80;
    
    return (
      <div className="space-y-8 animate-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 space-y-6">
            <h4 className="text-xl font-black text-indigo-300 border-b border-white/5 pb-3">پارامترهای ورودی RSBI</h4>
            
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-white font-bold text-sm">تعداد تنفس (f)</label>
                  <p className="text-xs text-slate-400">تعداد تنفس بیمار در دقیقه (Breaths/min)</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={f}
                    onChange={(e) => setF(parseInt(e.target.value) || 0)}
                    className="w-32 sm:w-44 accent-indigo-500"
                  />
                  <input
                    type="number"
                    value={f}
                    onChange={(e) => setF(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div>
                  <label className="text-white font-bold text-sm">حجم جاری (Vt)</label>
                  <p className="text-xs text-slate-400">حجم هوای دم و بازدم بر حسب <b>لیتر (L)</b></p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.05"
                    max="1.5"
                    step="0.01"
                    value={vt}
                    onChange={(e) => setVt(parseFloat(e.target.value) || 0)}
                    className="w-32 sm:w-44 accent-indigo-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={vt}
                    onChange={(e) => setVt(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-16 p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                  <span className="text-xs text-slate-400">L</span>
                </div>
              </div>
            </div>

            {/* Formula box */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center text-xs font-mono text-slate-300">
              <span className="text-indigo-400 font-bold">فرمول محاسباتی:</span> RSBI = f / Vt = {f} / {vt} L
            </div>
          </div>

          {/* Results display */}
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-black text-indigo-300 border-b border-white/5 pb-3">نتیجه شاخص RSBI</h4>
              
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Rapid Shallow Breathing Index</div>
                <div className={`text-6xl font-black ${isSuccess ? (isExcellent ? 'text-emerald-400' : 'text-teal-400') : 'text-rose-500'}`}>
                  {rsbi.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500 mt-1">breaths/min/L</div>

                <div className={`mt-6 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${
                  isSuccess ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}>
                  <span>{isSuccess ? (isExcellent ? '🟢 آمادگی بسیار عالی (پیش‌بینی موفقیت بالا)' : '🟡 آمادگی مناسب (پیش‌بینی موفقیت)') : '🔴 خطر شکست بالا (تندنفسی سطحی)'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl space-y-2 text-sm">
              <div className="font-bold text-indigo-300">💡 تفسیر بالینی:</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                شاخص تنفس سریع و سطحی (Tobin Index) محبوب‌ترین شاخص در ICU است. مقدار <b>کمتر از ۱۰۵</b> نشان‌دهنده الگوی تنفسی کارآمد است و کاندید بسیار خوبی برای آزمون تنفس خودبه‌خودی (SBT) است.
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Application and Suitability */}
        <div className="bg-indigo-950/20 p-8 rounded-3xl border border-indigo-500/15 space-y-4">
          <h5 className="text-lg font-black text-white flex items-center gap-2">
            <span>🔍</span> چه زمانی و برای کدام بیماران مناسب است؟
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="font-bold text-indigo-300">📌 بهترین وضعیت کاربرد:</p>
              <ul className="list-disc pr-5 space-y-2">
                <li>بیماران با تهویه مکانیکی عمومی، جراحی‌های بزرگ روتین و کسانی که سابقه بیماری ریوی زمینه‌ای پیچیده ندارند.</li>
                <li>ارزیابی سریع و بالینی بر بالین بیمار قبل از شروع پروتکل جداسازی.</li>
                <li>تغییرات روند RSBI در طول ۲۴ ساعت بسیار ارزشمندتر از یک تک‌اندازه‌گیری است.</li>
              </ul>
            </div>
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="font-bold text-rose-300">⚠️ محدودیت‌ها و موارد عدم انطباق:</p>
              <ul className="list-disc pr-5 space-y-2">
                <li>در بیماران مسن یا بیماران با COPD ممکن است به طور کاذب بالا باشد ولی جداسازی با موفقیت انجام شود (بهتر است آستانه برای این افراد ۱۳۰ در نظر گرفته شود).</li>
                <li>تحت تاثیر اضطراب، درد، تب، ساکشن ترشحات یا سداسیون نامناسب تغییر چشمگیری می‌کند.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCROP = () => {
    const isSuccess = crop > 13;
    
    return (
      <div className="space-y-8 animate-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 space-y-5">
            <h4 className="text-xl font-black text-indigo-300 border-b border-white/5 pb-3">پارامترهای ورودی CROP</h4>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-white font-bold text-sm">کمپلیانس دینامیک (Cdyn)</label>
                  <p className="text-xs text-slate-400">انعطاف‌پذیری دینامیک ریه (mL/cmH2O)</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={cdyn}
                    onChange={(e) => setCdyn(parseInt(e.target.value) || 0)}
                    className="w-32 sm:w-40 accent-indigo-500"
                  />
                  <input
                    type="number"
                    value={cdyn}
                    onChange={(e) => setCdyn(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <label className="text-white font-bold text-sm">حداکثر فشار دمی (MIP/NIF)</label>
                  <p className="text-xs text-slate-400">قدرت عضلات تنفسی (مثبت وارد شود، مثلا ۲۵)</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={Math.abs(mip)}
                    onChange={(e) => setMip(-Math.abs(parseInt(e.target.value) || 0))}
                    className="w-32 sm:w-40 accent-indigo-500"
                  />
                  <input
                    type="number"
                    value={Math.abs(mip)}
                    onChange={(e) => setMip(-Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                  <span className="text-xs text-slate-400">cmH2O</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <label className="text-white font-bold text-sm">فشار اکسیژن شریانی (PaO2)</label>
                  <p className="text-xs text-slate-400">گرفته شده از نمونه آزمایش ABG (mmHg)</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="40"
                    max="200"
                    value={pao2}
                    onChange={(e) => setPao2(parseInt(e.target.value) || 0)}
                    className="w-32 sm:w-40 accent-indigo-500"
                  />
                  <input
                    type="number"
                    value={pao2}
                    onChange={(e) => setPao2(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">درصد اکسیژن دمی (FiO2 %)</label>
                  <input
                    type="number"
                    min="21"
                    max="100"
                    value={fio2}
                    onChange={(e) => setFio2(Math.max(21, Math.min(100, parseInt(e.target.value) || 21)))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">فشار دی‌اکسید کربن (PaCO2)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={paco2}
                    onChange={(e) => setPaco2(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <label className="text-white font-bold text-sm">تعداد تنفس (f)</label>
                  <p className="text-xs text-slate-400">تعداد تنفس خودبه‌خودی در دقیقه</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={f}
                    onChange={(e) => setF(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results display */}
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-black text-indigo-300 border-b border-white/5 pb-3">نتیجه شاخص CROP</h4>
              
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="text-xs font-black text-slate-400 mb-1 uppercase tracking-widest">Compliance, Rate, Oxygenation, Pressure</div>
                <div className={`text-6xl font-black ${isSuccess ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {crop.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500 mt-1">mL/breath/min</div>

                <div className="mt-4 grid grid-cols-2 gap-4 w-full text-xs font-mono bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-right">
                    <span className="text-slate-400 block">PAO2 (آلوئولی):</span>
                    <span className="text-indigo-300 font-bold">{pao2Alveolar.toFixed(0)} mmHg</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">نسبت PaO2/PAO2:</span>
                    <span className="text-indigo-300 font-bold">{pao2Pao2Ratio.toFixed(2)}</span>
                  </div>
                </div>

                <div className={`mt-6 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${
                  isSuccess ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}>
                  <span>{isSuccess ? '🟢 موفقیت جداسازی بالا (> ۱۳)' : '🔴 احتمال بالای شکست بستگی به ریه (≤ ۱۳)'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl space-y-1 text-sm">
              <div className="font-bold text-indigo-300">💡 تفسیر بالینی:</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                فرمول پیشرفته: [Cdyn * MIP * (PaO2/PAO2)] / f. مقدار <b>بیشتر از ۱۳</b> نشانه توان بالا در عبور موفق از پروسه جداسازی است.
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Application and Suitability */}
        <div className="bg-indigo-950/20 p-8 rounded-3xl border border-indigo-500/15 space-y-4">
          <h5 className="text-lg font-black text-white flex items-center gap-2">
            <span>🔍</span> چه زمانی و برای کدام بیماران مناسب است؟
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="font-bold text-indigo-300">📌 بهترین وضعیت کاربرد:</p>
              <ul className="list-disc pr-5 space-y-2">
                <li>بیمارانی با نارسایی قلبی حاد، بیماری‌های فضاگیر یا ناتوانی عضلانی ریوی همزمان.</li>
                <li>بیماران تحت تهویه مکانیکی طولانی مدت (Prolonged Intubation) که به دفعات در جداسازی سنتی شکست خورده‌اند.</li>
                <li>یک ارزیابی چندبعدی شامل قدرت دم (MIP)، عملکرد تبادل گاز (PaO2/PAO2)، قابلیت ارتجاعی ریه (Cdyn) و کار تنفس (f).</li>
              </ul>
            </div>
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="font-bold text-rose-300">⚠️ محدودیت‌ها و موارد عدم انطباق:</p>
              <ul className="list-disc pr-5 space-y-2">
                <li>فرمول پیچیده و محاسبات طولانی‌تر نسبت به RSBI که نیاز به گاز خون شریانی (ABG) و مانیتورینگ دقیق کمپلیانس دارد.</li>
                <li>برای اورژانس‌های شلوغ یا ارزیابی‌های ثانیه‌ای چندان کاربردی نیست و بیشتر ابزاری تخصصی برای بخش‌های مراقبت‌های ویژه (ICU) است.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderIWI = () => {
    const isSuccess = iwi > 25;
    
    return (
      <div className="space-y-8 animate-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 space-y-6">
            <h4 className="text-xl font-black text-indigo-300 border-b border-white/5 pb-3">پارامترهای ورودی IWI</h4>
            
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-white font-bold text-sm">کمپلیانس استاتیک (Cstat)</label>
                  <p className="text-xs text-slate-400">انعطاف ریه در غیاب جریان هوا (mL/cmH2O)</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="120"
                    value={cstat}
                    onChange={(e) => setCstat(parseInt(e.target.value) || 0)}
                    className="w-32 sm:w-40 accent-indigo-500"
                  />
                  <input
                    type="number"
                    value={cstat}
                    onChange={(e) => setCstat(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div>
                  <label className="text-white font-bold text-sm">اشباع اکسیژن شریانی (SaO2)</label>
                  <p className="text-xs text-slate-400">گرفته شده از پالس‌اکسی‌متری یا ABG (%)</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={sao2}
                    onChange={(e) => setSao2(parseInt(e.target.value) || 0)}
                    className="w-32 sm:w-40 accent-indigo-500"
                  />
                  <input
                    type="number"
                    value={sao2}
                    onChange={(e) => setSao2(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                    className="w-16 p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                  <span className="text-xs text-slate-400">%</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">تعداد تنفس (f)</label>
                  <input
                    type="number"
                    value={f}
                    onChange={(e) => setF(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">حجم جاری (Vt در لیتر)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={vt}
                    onChange={(e) => setVt(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Formula box */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center text-xs font-mono text-slate-300">
              <span className="text-indigo-400 font-bold">فرمول محاسباتی:</span> IWI = (Cstat * SaO2) / RSBI
            </div>
          </div>

          {/* Results display */}
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-black text-indigo-300 border-b border-white/5 pb-3">نتیجه شاخص IWI</h4>
              
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Integrated Weaning Index</div>
                <div className={`text-6xl font-black ${isSuccess ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {iwi.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500 mt-1">mL/cmH2O/breaths/min/L</div>

                <div className="mt-4 text-xs font-mono bg-white/5 py-2 px-4 rounded-xl border border-white/5 text-slate-400">
                  RSBI مخرج کسر: <span className="text-indigo-300 font-bold">{rsbi.toFixed(1)}</span>
                </div>

                <div className={`mt-6 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${
                  isSuccess ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}>
                  <span>{isSuccess ? '🟢 آمادگی عالی برای لوله‌برداری (> ۲۵)' : '🔴 خطر شکست تنفسی بالا (≤ ۲۵)'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl space-y-2 text-sm">
              <div className="font-bold text-indigo-300">💡 تفسیر بالینی:</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                این شاخص یک فاکتور فوق‌العاده قوی و جامع است که هر سه ضلع مثلث تنفسی (تبادل گاز SaO2، مکانیک ریه Cstat و الگوی نفس RSBI) را همپوشانی می‌کند. مقادیر <b>بیشتر از ۲۵</b> نشان‌دهنده حساسیت و ویژگی بسیار بالا در جداسازی موفق است.
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Application and Suitability */}
        <div className="bg-indigo-950/20 p-8 rounded-3xl border border-indigo-500/15 space-y-4">
          <h5 className="text-lg font-black text-white flex items-center gap-2">
            <span>🔍</span> چه زمانی و برای کدام بیماران مناسب است؟
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="font-bold text-indigo-300">📌 بهترین وضعیت کاربرد:</p>
              <ul className="list-disc pr-5 space-y-2">
                <li><b>بالاترین میزان دقت تشخیصی:</b> در مقالات بالینی متعدد، IWI از نظر حساسیت (Sensitivity) و ویژگی (Specificity) رتبه بسیار بهتری نسبت به تک شاخص RSBI کسب کرده است.</li>
                <li>بیمارانی که نوسانات اکسیژن دمی دارند، چرا که این فرمول شامل اشباع مستقیم هموگلوبین (SaO2) نیز هست.</li>
                <li>کاهش چشمگیر موارد لوله‌گذاری مجدد غیرضروری (Unplanned Re-intubation).</li>
              </ul>
            </div>
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="font-bold text-rose-300">⚠️ محدودیت‌ها و موارد عدم انطباق:</p>
              <ul className="list-disc pr-5 space-y-2">
                <li>نیاز به محاسبه کمپلیانس استاتیک ریه دارد که مستلزم انجام نگهداشت دمی (Inspiratory Hold) روی ونتیلاتور و ثبت دقیق فشار پلاتو (Plateau Pressure) است.</li>
                <li>در شرایط پالس‌اکسی‌متری غیرقابل اعتماد (مانند شوک شدید، هایپوترمی یا لاک ناخن ضخیم) ممکن است مخرج کسر و محاسبات به خطا برود.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderP01 = () => {
    let p01Status = "طبیعی (Normal Drive)";
    let p01Color = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    let p01Desc = "قدرت فرمان صادر شده از بصل‌النخاع کاملاً طبیعی و متناسب است. بیمار آماده ورود به پروسه جداسازی و لوله‌برداری است.";

    if (p01 < 1.0) {
      p01Status = "کاهش درایو تنفسی (Depressed Drive)";
      p01Color = "text-rose-400 bg-rose-500/10 border-rose-500/20";
      p01Desc = "درایو تنفسی مرکزی بیمار به شدت کاهش یافته است. علل اصلی می‌تواند سداسیون عمیق، هایپرکاپنی مزمن (شستشوی مغزی)، صدمات مغزی یا آسیب عضلانی باشد. جداسازی ممنوع است.";
    } else if (p01 > 4.0) {
      p01Status = "بسیار بالا / بار شدید تنفسی (Excessive Drive / Hyperdrive)";
      p01Color = "text-red-400 bg-red-500/10 border-red-500/20";
      p01Desc = "مغز بیمار فرمان تنفس‌های بسیار شدید را صادر می‌کند. خستگی زودرس عضلانی دم و شکست در جداسازی قطعی است. کار تنفس بیمار بسیار سنگین است.";
    } else if (p01 > 2.0) {
      p01Status = "درایو نسبتاً بالا (Elevated Drive)";
      p01Color = "text-amber-400 bg-amber-500/10 border-amber-500/20";
      p01Desc = "مرکز تنفس فعال‌تر از معمول است که می‌تواند واکنش به نارسایی خفیف اکسیژن، اسیدوز یا اضطراب باشد. بررسی دقیق‌تر ترشحات یا درد بیمار الزامی است.";
    }

    return (
      <div className="space-y-8 animate-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 space-y-6">
            <h4 className="text-xl font-black text-indigo-300 border-b border-white/5 pb-3">ثبت فشار انسداد آلوئول (P0.1)</h4>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-white font-bold text-sm">فشار P0.1 ثبت شده</label>
                  <p className="text-xs text-slate-400">فشار انسداد مجاری هوایی در ۱۰۰ میلی‌ثانیه اول دم (cmH2O)</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={p01}
                    onChange={(e) => setP01(parseFloat(e.target.value) || 0)}
                    className="w-32 sm:w-40 accent-indigo-500"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={p01}
                    onChange={(e) => setP01(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-16 p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                  <span className="text-xs text-slate-400">cmH2O</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl text-xs leading-relaxed text-slate-300 space-y-2">
              <p className="font-bold text-indigo-300">💡 روش اندازه‌گیری P0.1:</p>
              <p>
                این معیار به شکل اتوماتیک توسط ونتیلاتورهای مدرن حین تلاش دمی اولیه بیمار بدون اینکه خود بیمار متوجه انسداد کوتاه مدت دم شود اندازه‌گیری و برحسب cmH2O ارائه می‌گردد.
              </p>
            </div>
          </div>

          {/* Results display */}
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-black text-indigo-300 border-b border-white/5 pb-3">تحلیل فرمان تنفس مرکزی (Drive)</h4>
              
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Airway Occlusion Pressure (P0.1)</div>
                <div className="text-6xl font-black text-indigo-400">
                  {p01.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500 mt-1">cmH2O</div>

                <div className={`mt-6 px-4 py-2 rounded-2xl font-black text-sm border text-center ${p01Color}`}>
                  {p01Status}
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl space-y-1 text-sm">
              <div className="font-bold text-indigo-300">📌 نظر راهنمای بالینی:</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {p01Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Application and Suitability */}
        <div className="bg-indigo-950/20 p-8 rounded-3xl border border-indigo-500/15 space-y-4">
          <h5 className="text-lg font-black text-white flex items-center gap-2">
            <span>🔍</span> چه زمانی و برای کدام بیماران مناسب است؟
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="font-bold text-indigo-300">📌 بهترین وضعیت کاربرد:</p>
              <ul className="list-disc pr-5 space-y-2">
                <li><b>بیماران مبتلا به COPD شدید:</b> که از مرکز تنفس تحریک‌شده رنج می‌برند. به پزشک در تنظیم مقدار PEEP جهت مهار کار تنفسی کمک شایانی می‌کند.</li>
                <li>بیمارانی با نوسانات خلق، هیپرونتیلاسیون روانی، اضطراب شدید یا کسانی که سداسیون طولانی داشته‌اند.</li>
                <li><b>پیشگیری از آسیب ریه ناشی از تلاش خود بیمار (P-SILI):</b> مقادیر بالای P0.1 حاکی از آن است که بیمار فشار منفی شدیدی به بافت پارانشیم ریه خود وارد می‌کند.</li>
              </ul>
            </div>
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="font-bold text-rose-300">⚠️ محدودیت‌ها و موارد عدم انطباق:</p>
              <ul className="list-disc pr-5 space-y-2">
                <li>پاسخ تنفسی نامنظم بیمار (مانند موارد سرفه شدید یا دیس‌سینکرونی شدید دم با دستگاه) به شدت این عدد را مخدوش می‌کند.</li>
                <li>در صورت وجود نشت شدید هوا از اطراف کاف لوله‌تراشه، پایش این معیار دقت خود را از دست می‌دهد.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNIF = () => {
    const absMip = Math.abs(mip);
    const isExcellent = absMip >= 30;
    const isAcceptable = absMip >= 20 && absMip < 30;
    const isWeak = absMip < 20;

    let nifStatus = "قدرت بسیار عالی عضلات دم (Strong Muscle Force)";
    let nifColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    let nifDesc = "عضلات دمی بیمار (دیافراگم و عضلات بین‌دنده‌ای خارجی) قدرت بسیار بالایی در تولید فشار منفی جهت غلبه بر مقاومت لوله تراشه و تهویه مستقل دارند.";

    if (isWeak) {
      nifStatus = "ضعف شدید عضلات دمی (Severe Diaphragm Weakness)";
      nifColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
      nifDesc = "بیمار توانایی تولید حداقل نیروی تنفسی را هم ندارد. لوله‌برداری در این شرایط بلافاصله منجر به خستگی تنفسی، آتلکتازی و نیاز مجدد به اینتوباسیون به علت ناتوانی در سرفه و تخلیه ترشحات خواهد شد.";
    } else if (isAcceptable) {
      nifStatus = "قدرت مرزی / نیازمند مراقبت (Borderline Strength)";
      nifColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
      nifDesc = "نیروی تنفسی قابل قبول است اما عالی نیست. بیمار در صورت داشتن سایر معیارهای مثبت تنفسی کاندید خوبی برای SBT است اما باید به شدت پایش شود.";
    }

    return (
      <div className="space-y-8 animate-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 space-y-6">
            <h4 className="text-xl font-black text-indigo-300 border-b border-white/5 pb-3">ثبت نیروی دمی منفی (NIF / MIP)</h4>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-white font-bold text-sm">نیروی دمی منفی (NIF)</label>
                  <p className="text-xs text-slate-400">حداکثر فشار منفی دمی حین انسداد دم (cmH2O)</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={absMip}
                    onChange={(e) => setMip(-Math.abs(parseInt(e.target.value) || 0))}
                    className="w-32 sm:w-40 accent-indigo-500"
                  />
                  <input
                    type="number"
                    value={absMip}
                    onChange={(e) => setMip(-Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 p-2 rounded-xl bg-slate-950 border border-white/10 text-center font-bold text-white text-sm"
                  />
                  <span className="text-xs text-slate-400">cmH2O-</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl text-xs leading-relaxed text-slate-300 space-y-2">
              <p className="font-bold text-indigo-300">💡 روش آزمایش بالینی NIF:</p>
              <p>
                لوله‌دمی بیمار را به مدت ۱۵ تا ۲۰ ثانیه با دکمه مخصوص NIF روی ونتیلاتور مسدود کرده و از او می‌خواهیم که عمیق‌ترین تلاش دم خود را انجام دهد. ونتیلاتور بیشترین فشار منفی ایجاد شده را ثبت می‌کند.
              </p>
            </div>
          </div>

          {/* Results display */}
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-black text-indigo-300 border-b border-white/5 pb-3">وضعیت عضلات تنفسی بیمار</h4>
              
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Negative Inspiratory Force</div>
                <div className="text-6xl font-black text-indigo-400">
                  -{absMip}
                </div>
                <div className="text-xs text-slate-500 mt-1">cmH2O</div>

                <div className={`mt-6 px-4 py-2 rounded-2xl font-black text-sm border text-center ${nifColor}`}>
                  {nifStatus}
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl space-y-1 text-sm">
              <div className="font-bold text-indigo-300">📌 راهنمای تصمیم‌گیری بالینی:</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {nifDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Application and Suitability */}
        <div className="bg-indigo-950/20 p-8 rounded-3xl border border-indigo-500/15 space-y-4">
          <h5 className="text-lg font-black text-white flex items-center gap-2">
            <span>🔍</span> چه زمانی و برای کدام بیماران مناسب است؟
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="font-bold text-indigo-300">📌 بهترین وضعیت کاربرد:</p>
              <ul className="list-disc pr-5 space-y-2">
                <li><b>بیماران نورومسکولار:</b> (مانند مبتلایان به گیلن باره، میاستنی گراویس، ALS یا آسیب طناب نخاعی) که ضعف عضلانی فاکتور اصلی محدودکننده آنهاست.</li>
                <li>بیمارانی با مدت لوله‌گذاری بسیار طولانی (هفته‌ها یا ماه‌ها) که عضلات دیافراگم آنها دچار آتروفی شدید ناشی از عدم فعالیت (Ventilator-Induced Diaphragmatic Dysfunction) شده است.</li>
                <li>تخمین عالی از قدرت سرفه بیمار جهت خارج کردن مستقل موکوس و خلط.</li>
              </ul>
            </div>
            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="font-bold text-rose-300">⚠️ محدودیت‌ها و موارد عدم انطباق:</p>
              <ul className="list-disc pr-5 space-y-2">
                <li><b>نیاز مبرم به همکاری بیمار:</b> در صورتی که بیمار فاقد هوشیاری یا دچار دلیریوم باشد و دستور را متوجه نشود، تلاش حداکثری نکرده و عدد کاذبی ثبت خواهد شد.</li>
                <li>آزمایش می‌تواند باعث نوسانات موقت فشار خون، بالا رفتن فشار مغزی (ICP) و احساس وحشت خفیف در بیمار به علت خفگی چندثانیه‌ای شود.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSbtChecklist = () => {
    return (
      <div className="space-y-8 animate-in">
        <div className="bg-slate-900/30 p-6 rounded-3xl border border-white/5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
            <div>
              <h4 className="text-xl font-black text-indigo-300">چک‌لیست آمادگی ورود به آزمون تنفس خودبه‌خودی (SBT)</h4>
              <p className="text-xs text-slate-400 mt-1">بر اساس گایدلاین انجمن ریه و مراقبت‌های ویژه آمریکا (ATS/ACCP)</p>
            </div>
            <div className="bg-indigo-600/20 border border-indigo-500/30 px-4 py-2 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block font-bold">میزان تحقق معیارها</span>
              <span className="text-lg font-black text-white">{completedSbtItems} از {totalSbtItems}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChecklistItem
              id="causeResolved"
              label="برطرف شدن علت اصلی اینتوباسیون"
              description="علت زمینه‌ای (سپسیس، ادم حاد ریه، اسپاسم شدید ریوی) مهار شده یا در حال بهبود واضح است."
              checked={checklist.causeResolved}
              onChange={() => toggleChecklistItem('causeResolved')}
            />
            <ChecklistItem
              id="pao2Fio2Ok"
              label="وضعیت اکسیژن‌رسانی پایدار (PaO2/FiO2 ≥ ۱۵۰)"
              description="تبادل گازی بیمار مناسب است (مثلاً PaO2 بالای ۶۰ با FiO2 زیر ۴۰٪)."
              checked={checklist.pao2Fio2Ok}
              onChange={() => toggleChecklistItem('pao2Fio2Ok')}
            />
            <ChecklistItem
              id="peepOk"
              label="فشار مثبت انتهای بازدمی (PEEP ≤ ۵-۸)"
              description="ریه بیمار بدون نیاز به PEEPهای تهاجمی بالا باز می‌ماند."
              checked={checklist.peepOk}
              onChange={() => toggleChecklistItem('peepOk')}
            />
            <ChecklistItem
              id="hemodynamicStable"
              label="ثبات همودینامیک عالی"
              description="فشار خون بیمار بدون دارو یا با دوزهای ناچیز وازوپرسور حفظ شده و آریتمی جدید وجود ندارد."
              checked={checklist.hemodynamicStable}
              onChange={() => toggleChecklistItem('hemodynamicStable')}
            />
            <ChecklistItem
              id="consciousGcs"
              label="هوشیاری و رفلکس‌های عصبی کافی"
              description="بیمار هوشیار است (GCS ≥ ۸)، دستورات ساده را اجرا می‌کند و توان صیانت از راه هوایی را دارد."
              checked={checklist.consciousGcs}
              onChange={() => toggleChecklistItem('consciousGcs')}
            />
            <ChecklistItem
              id="coughSecretions"
              label="رفلکس سرفه قوی و ترشحات کم"
              description="ترشحات ریه بیمار بسیار غلیظ نیست و دفعات ساکشن به بیش از هر ۲ ساعت یکبار نیاز ندارد."
              checked={checklist.coughSecretions}
              onChange={() => toggleChecklistItem('coughSecretions')}
            />
            <ChecklistItem
              id="temperatureOk"
              label="دمای طبیعی بدن (T < ۳۸°C)"
              description="بیمار تب شدید فعال یا هایپوترمی حاد ندارد تا بار متابولیک بیهوده افزایش نیابد."
              checked={checklist.temperatureOk}
              onChange={() => toggleChecklistItem('temperatureOk')}
            />
            <ChecklistItem
              id="electrolytesOk"
              label="تعادل الکترولیت‌ها و مایعات بدن"
              description="پتاسیم، فسفر و منیزیم در محدوده نرمال است (تا انقباض عضلانی دیافراگم دچار اختلال نشود)."
              checked={checklist.electrolytesOk}
              onChange={() => toggleChecklistItem('electrolytesOk')}
            />
          </div>
        </div>

        {/* Action recommendations based on completion */}
        <div className={`p-6 rounded-3xl border ${completedSbtItems === totalSbtItems ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'} space-y-3`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{completedSbtItems === totalSbtItems ? '🎉' : '⚠️'}</span>
            <h5 className="font-black text-white text-lg">
              {completedSbtItems === totalSbtItems ? 'آماده انجام آزمون تنفس خودبه‌خودی (SBT)' : 'برخی معیارهای کلیدی هنوز محقق نشده‌اند'}
            </h5>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {completedSbtItems === totalSbtItems 
              ? "بیمار تمام معیارهای غربالگری بالینی را داراست. بر اساس گایدلاین‌های جهانی، اکنون می‌توانید SBT را به مدت ۳۰ الی ۱۲۰ دقیقه (با مد T-piece یا Pressure Support 5-8 cmH2O) شروع کنید. در صورت پایداری در این مدت، extubation بلامانع است."
              : `بیمار ${completedSbtItems} مورد از ${totalSbtItems} معیار کلیدی را پاس کرده است. توصیه می‌شود ابتدا پارامترهای نامنطبق را بهبود بخشیده و مجددا غربالگری را تکرار کنید تا احتمال شکست extubation به حداقل برسد.`
            }
          </p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'RSBI': return renderRSBI();
      case 'CROP': return renderCROP();
      case 'IWI': return renderIWI();
      case 'P01': return renderP01();
      case 'NIF': return renderNIF();
      case 'SBT_CHECKLIST': return renderSbtChecklist();
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in text-right" dir="rtl">
      <ModuleHeader onBack={onBack} onHome={onHome} />
      
      {/* Title */}
      <div className="premium-card p-8 border-indigo-500/20 text-center">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-4 text-5xl mx-auto">🫁</div>
        <h3 className="text-3xl font-black text-white">شاخص‌های جداسازی بیمار از ونتیلاتور</h3>
        <p className="text-indigo-400 text-sm font-bold mt-2">محاسبه، ارزیابی و تفسیر دقیق بالینی آمادگی بیمار جهت Extubation</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-white/5">
        <TabButton id="RSBI" label="RSBI (شاخص توبین)" active={activeTab === 'RSBI'} onClick={() => setActiveTab('RSBI')} />
        <TabButton id="CROP" label="شاخص CROP" active={activeTab === 'CROP'} onClick={() => setActiveTab('CROP')} />
        <TabButton id="IWI" label="شاخص تلفیقی IWI" active={activeTab === 'IWI'} onClick={() => setActiveTab('IWI')} />
        <TabButton id="P01" label="فشار انسداد P0.1" active={activeTab === 'P01'} onClick={() => setActiveTab('P01')} />
        <TabButton id="NIF" label="قدرت عضلانی NIF" active={activeTab === 'NIF'} onClick={() => setActiveTab('NIF')} />
        <TabButton id="SBT_CHECKLIST" label="📝 چک‌لیست آمادگی SBT" active={activeTab === 'SBT_CHECKLIST'} onClick={() => setActiveTab('SBT_CHECKLIST')} />
      </div>

      {/* Active Tab Screen */}
      <div className="premium-card p-6 sm:p-8 border-white/5 min-h-[400px]">
        {renderContent()}
      </div>

      {/* General Medical Disclaimer Footer */}
      <div className="bg-slate-900/10 border border-white/5 p-5 rounded-2xl text-center text-xs text-slate-500">
        📌 اطلاعات ارائه شده در این ماژول بر مبنای منابع معتبر مراجع طب مراقبت‌های ویژه (MDCalc، مراجع تهویه مکانیکی Pilbeam و گایدلاین‌های ATS/ACCP) گردآوری شده است. تصمیم نهایی بالینی همواره با پزشک معالج بیمار در بخش ICU است.
      </div>
    </div>
  );
};

const TabButton = ({ id, label, active, onClick }: { id: string, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-5 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap border flex-shrink-0 ${
      active 
        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' 
        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
    }`}
  >
    {label}
  </button>
);

const ChecklistItem = ({ id, label, description, checked, onChange }: { id: string, label: string, description: string, checked: boolean, onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    className={`flex items-start gap-4 p-5 rounded-2xl border transition-all text-right w-full ${
      checked 
        ? 'bg-indigo-600/10 border-indigo-500/30' 
        : 'bg-white/5 border-white/5 hover:bg-white/10'
    }`}
  >
    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border mt-1 flex-shrink-0 ${
      checked ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-white/20'
    }`}>
      {checked && <span className="text-xs font-black">✓</span>}
    </div>
    <div className="space-y-1">
      <span className={`font-black text-sm block ${checked ? 'text-indigo-300' : 'text-slate-200'}`}>{label}</span>
      <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
    </div>
  </button>
);

export default WeaningAssessment;
