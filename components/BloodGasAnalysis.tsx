import React, { useState, useEffect } from 'react';
import ModuleHeader from './common/ModuleHeader';

interface Props {
  onBack: () => void;
  onHome: () => void;
}

interface InterpretationResult {
  primaryDisturbance: string;
  compensationStatus: string;
  interpretationText: string;
  oxygenationStatus?: string;
  anionGap?: number;
  anionGapInterpretation?: string;
  pfRatio?: number;
  pfRatioInterpretation?: string;
  severity: 'normal' | 'warning' | 'danger' | 'critical';
  color: string;
  bgGradient: string;
}

const BloodGasAnalysis: React.FC<Props> = ({ onBack, onHome }) => {
  const [type, setType] = useState<'ABG' | 'VBG'>('ABG');
  
  // Input parameters
  const [ph, setPh] = useState<number>(7.40);
  const [co2, setCo2] = useState<number>(40);
  const [hco3, setHco3] = useState<number>(24);
  const [o2, setO2] = useState<number>(90);
  const [fio2, setFio2] = useState<number>(21); // default room air: 21%
  const [na, setNa] = useState<string>('');
  const [cl, setCl] = useState<string>('');

  // Result state
  const [result, setResult] = useState<InterpretationResult | null>(null);

  // Preset templates for quick filling & learning
  const presets = [
    {
      name: 'طبیعی (Normal ABG)',
      type: 'ABG' as const,
      ph: 7.41,
      co2: 39,
      hco3: 24,
      o2: 95,
      fio2: 21,
      na: '140',
      cl: '104',
      desc: 'یک نمونه سالم و ایده‌آل گاز خون شریانی'
    },
    {
      name: 'کتواسیدوز دیابتی (DKA)',
      type: 'ABG' as const,
      ph: 7.15,
      co2: 22,
      hco3: 8,
      o2: 98,
      fio2: 21,
      na: '136',
      cl: '98',
      desc: 'اسیدوز متابولیک با شکاف آنیونی بالا (HAGMA) همراه با جبران تنفسی نسبی'
    },
    {
      name: 'بیمار COPD مزمن (COPD)',
      type: 'ABG' as const,
      ph: 7.36,
      co2: 58,
      hco3: 32,
      o2: 64,
      fio2: 28,
      na: '140',
      cl: '100',
      desc: 'اسیدوز تنفسی مزمن با جبران کامل کلیوی (Fully Compensated)'
    },
    {
      name: 'حمله حاد آسم (Acute Asthma)',
      type: 'ABG' as const,
      ph: 7.28,
      co2: 52,
      hco3: 24,
      o2: 58,
      fio2: 35,
      na: '',
      cl: '',
      desc: 'اسیدوز تنفسی حاد جبران‌نشده ناشی از هیپوونتیلاسیون و احتباس CO2'
    },
    {
      name: 'استفراغ شدید (Severe Vomiting)',
      type: 'ABG' as const,
      ph: 7.52,
      co2: 48,
      hco3: 38,
      o2: 92,
      fio2: 21,
      na: '138',
      cl: '90',
      desc: 'آلکالوز متابولیک جبران‌شده جزئی ناشی از دست رفتن اسید معده'
    },
    {
      name: 'اضطراب / هیپرونتیلاسیون',
      type: 'ABG' as const,
      ph: 7.50,
      co2: 28,
      hco3: 23,
      o2: 104,
      fio2: 21,
      desc: 'آلکالوز تنفسی حاد جبران‌نشده ناشی از دفع بیش از حد CO2'
    }
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setType(preset.type);
    setPh(preset.ph);
    setCo2(preset.co2);
    setHco3(preset.hco3);
    setO2(preset.o2);
    setFio2(preset.fio2 || 21);
    setNa(preset.na || '');
    setCl(preset.cl || '');
  };

  useEffect(() => {
    const isABG = type === 'ABG';
    
    // Limits
    const lowPH = isABG ? 7.35 : 7.31;
    const highPH = isABG ? 7.45 : 7.41;
    const midPH = isABG ? 7.40 : 7.36;
    
    const lowCO2 = isABG ? 35 : 40;
    const highCO2 = isABG ? 45 : 50;
    
    const lowHCO3 = 22;
    const highHCO3 = 26;
    
    let primaryDisturbance = '';
    let compensationStatus = '';
    let severity: 'normal' | 'warning' | 'danger' | 'critical' = 'normal';
    let color = 'text-emerald-400';
    let bgGradient = 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30';
    
    // 1. Detect Primary disturbance
    if (ph < lowPH) {
      severity = 'danger';
      color = 'text-red-400';
      bgGradient = 'from-red-500/20 to-red-600/5 border-red-500/30';
      
      const isRespiratory = co2 > highCO2;
      const isMetabolic = hco3 < lowHCO3;
      
      if (isRespiratory && isMetabolic) {
        primaryDisturbance = 'اسیدوز مخلوط تنفسی و متابولیک (Mixed Respiratory & Metabolic Acidosis)';
        compensationStatus = 'عدم جبران (هر دو سیستم تنفسی و متابولیک در جهت ایجاد اسیدوز حرکت کرده‌اند)';
        severity = 'critical';
        bgGradient = 'from-red-900/30 to-red-950/20 border-red-700/50';
      } else if (isRespiratory) {
        primaryDisturbance = 'اسیدوز تنفسی (Respiratory Acidosis)';
        if (hco3 > highHCO3) {
          compensationStatus = 'جبران‌شده به صورت جزئی (Partially Compensated) - سیستم کلیوی با افزایش بازجذب بیکربنات شروع به جبران کرده اما هنوز pH طبیعی نشده است.';
        } else {
          compensationStatus = 'جبران‌نشده (Uncompensated) - پاسخ کلیوی هنوز آغاز نشده یا ناکافی است.';
        }
      } else if (isMetabolic) {
        primaryDisturbance = 'اسیدوز متابولیک (Metabolic Acidosis)';
        if (co2 < lowCO2) {
          compensationStatus = 'جبران‌شده به صورت جزئی (Partially Compensated) - سیستم تنفسی با افزایش عمق و تعداد تنفس (دفع CO2) در حال جبران است.';
        } else {
          compensationStatus = 'جبران‌نشده (Uncompensated) - سیستم تنفسی پاسخ جبرانی کافی ایجاد نکرده است.';
        }
      } else {
        primaryDisturbance = 'اسیدوز با منشاء نامشخص یا جبران متناقض';
        compensationStatus = 'برای ارزیابی دقیق‌تر، نمونه تکرار شود یا از الکترولیت‌ها استفاده گردد.';
        severity = 'warning';
        bgGradient = 'from-amber-500/20 to-amber-600/5 border-amber-500/30';
      }
    } else if (ph > highPH) {
      severity = 'danger';
      color = 'text-orange-400';
      bgGradient = 'from-orange-500/20 to-orange-600/5 border-orange-500/30';
      
      const isRespiratory = co2 < lowCO2;
      const isMetabolic = hco3 > highHCO3;
      
      if (isRespiratory && isMetabolic) {
        primaryDisturbance = 'آلکالوز مخلوط تنفسی و متابولیک (Mixed Respiratory & Metabolic Alkalosis)';
        compensationStatus = 'عدم جبران (هر دو سیستم تنفسی و متابولیک در جهت ایجاد آلکالوز حرکت کرده‌اند)';
        severity = 'critical';
        bgGradient = 'from-red-900/30 to-red-950/20 border-red-700/50';
      } else if (isRespiratory) {
        primaryDisturbance = 'آلکالوز تنفسی (Respiratory Alkalosis)';
        if (hco3 < lowHCO3) {
          compensationStatus = 'جبران‌شده به صورت جزئی (Partially Compensated) - سیستم کلیوی با افزایش دفع بیکربنات در حال جبران آلکالوز است.';
        } else {
          compensationStatus = 'جبران‌نشده (Uncompensated) - پاسخ کلیوی آغاز نشده است.';
        }
      } else if (isMetabolic) {
        primaryDisturbance = 'آلکالوز متابولیک (Metabolic Alkalosis)';
        if (co2 > highCO2) {
          compensationStatus = 'جبران‌شده به صورت جزئی (Partially Compensated) - سیستم تنفسی با کاهش ونتیلاسیون (احتباس CO2) شروع به جبران کرده است.';
        } else {
          compensationStatus = 'جبران‌نشده (Uncompensated) - پاسخ تنفسی آغاز نشده یا ناکافی است.';
        }
      } else {
        primaryDisturbance = 'آلکالوز با منشاء نامشخص یا جبران متناقض';
        compensationStatus = 'تکرار آزمایش گازهای خونی پیشنهاد می‌گردد.';
        severity = 'warning';
        bgGradient = 'from-amber-500/20 to-amber-600/5 border-amber-500/30';
      }
    } else {
      // Normal pH (completely normal or fully compensated)
      const co2Abnormal = co2 < lowCO2 || co2 > highCO2;
      const hco3Abnormal = hco3 < lowHCO3 || hco3 > highHCO3;
      
      if (!co2Abnormal && !hco3Abnormal) {
        primaryDisturbance = 'وضعیت اسید-باز طبیعی (Normal Acid-Base)';
        compensationStatus = 'تمامی مقادیر در محدوده طبیعی هستند و هیچ‌گونه اختلالی مشاهده نمی‌شود.';
        severity = 'normal';
        color = 'text-emerald-400';
        bgGradient = 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30';
      } else {
        // Fully compensated
        severity = 'warning';
        color = 'text-indigo-400';
        bgGradient = 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30';
        
        if (ph < midPH) {
          // Acidic side of normal -> fully compensated acidosis
          if (co2 > highCO2 && hco3 > highHCO3) {
            primaryDisturbance = 'اسیدوز تنفسی جبران‌شده‌ی کامل (Fully Compensated Respiratory Acidosis)';
            compensationStatus = 'جبران کامل توسط پاسخ متابولیک (کلیه‌ها با نگهداری بیکربنات HCO3 سطح pH را به محدوده طبیعی برگردانده‌اند).';
          } else if (hco3 < lowHCO3 && co2 < lowCO2) {
            primaryDisturbance = 'اسیدوز متابولیک جبران‌شده‌ی کامل (Fully Compensated Metabolic Acidosis)';
            compensationStatus = 'جبران کامل توسط پاسخ تنفسی (ریه‌ها با افزایش تهویه و دفع دی‌اکسید کربن CO2 سطح pH را به محدوده طبیعی برگردانده‌اند).';
          } else {
            primaryDisturbance = 'اختلال اسید-باز جبران‌شده پیچیده / مختلط با pH نرمال';
            compensationStatus = 'جهت تفسیر دقیق، شرح حال بالینی و الکترولیت‌ها ارزیابی گردند.';
          }
        } else {
          // Alkaline side of normal -> fully compensated alkalosis
          if (co2 < lowCO2 && hco3 < lowHCO3) {
            primaryDisturbance = 'آلکالوز تنفسی جبران‌شده‌ی کامل (Fully Compensated Respiratory Alkalosis)';
            compensationStatus = 'جبران کامل توسط پاسخ متابولیک (کلیه‌ها با دفع بیکربنات HCO3 سطح pH را به محدوده طبیعی برگردانده‌اند).';
          } else if (hco3 > highHCO3 && co2 > highCO2) {
            primaryDisturbance = 'آلکالوز متابولیک جبران‌شده‌ی کامل (Fully Compensated Metabolic Alkalosis)';
            compensationStatus = 'جبران کامل توسط پاسخ تنفسی (ریه‌ها با کاهش تهویه و احتباس دی‌اکسید کربن CO2 سطح pH را به محدوده طبیعی برگردانده‌اند).';
          } else {
            primaryDisturbance = 'اختلال اسید-باز جبران‌شده پیچیده / مختلط با pH نرمال';
            compensationStatus = 'جهت تفسیر دقیق، شرح حال بالینی و الکترولیت‌ها ارزیابی گردند.';
          }
        }
      }
    }
    
    // 2. Anion Gap Calculation
    let calculatedAG: number | undefined;
    let agInterpretation = '';
    const sodiumVal = parseFloat(na);
    const chlorideVal = parseFloat(cl);
    
    if (!isNaN(sodiumVal) && !isNaN(chlorideVal) && sodiumVal > 0 && chlorideVal > 0) {
      calculatedAG = sodiumVal - (chlorideVal + hco3);
      if (calculatedAG > 12) {
        agInterpretation = `شکاف آنیونی بالا (Anion Gap = ${calculatedAG.toFixed(1)} mEq/L) است (نرمال: ۸ تا ۱۲). این مقدار مطرح‌کننده اسیدوز متابولیک با شکاف آنیونی بالا (HAGMA) می‌باشد. شایع‌ترین علل شامل کتواسیدوز دیابتی یا الکلی، اسیدوز لاکتیک، اورمی شدید، مسمومیت با سالیسیلات، متانول یا اتیلن گلیکول است.`;
      } else if (calculatedAG < 8) {
        agInterpretation = `شکاف آنیونی پایین (Anion Gap = ${calculatedAG.toFixed(1)} mEq/L) است (نرمال: ۸ تا ۱۲). این حالت به صورت بالینی ناشایع بوده و غالباً در بیماران مبتلا به هیپوآلبومینمی شدید، مولتیپل میلوما یا به علت خطای محاسباتی/آزمایشگاهی رخ می‌دهد.`;
      } else {
        agInterpretation = `شکاف آنیونی نرمال (Anion Gap = ${calculatedAG.toFixed(1)} mEq/L) است (نرمال: ۸ تا ۱۲). مطرح‌کننده اسیدوز با شکاف آنیونی نرمال (NAGMA) یا اسیدوز هایپرکلرمیک است. شایع‌ترین علل آن از دست رفتن بیکربنات از دستگاه گوارش (مانند اسهال شدید) یا مشکلات بازجذب کلیوی (مانند اسیدوز لوله‌ای کلیه RTA) می‌باشد.`;
      }
    }
    
    // 3. Oxygenation and P/F Ratio for ABG or VBG
    let oxygenationStatus = '';
    let calculatedPF: number | undefined;
    let pfRatioInterpretation = '';
    
    if (isABG) {
      if (o2 < 45) {
        oxygenationStatus = '🚨 هیپوکسی شریانی بسیار شدید (Severe Hypoxemia) - نیاز فوری به اکسیژن‌رسانی تهاجمی یا حمایت تهویه‌ای مکانیکی.';
      } else if (o2 < 60) {
        oxygenationStatus = '🟠 هیپوکسی شریانی متوسط (Moderate Hypoxemia) - نیاز به اکسیژن کمکی مناسب (ماسک ذخیره‌ساز یا NIV) و پایش مداوم.';
      } else if (o2 < 80) {
        oxygenationStatus = '🟡 هیپوکسی شریانی خفیف (Mild Hypoxemia) - نیاز به نازال کانولا یا پیگیری علت زمینه‌ای اختلال ریوی دارد.';
      } else {
        oxygenationStatus = '✅ اکسیژن‌رسانی طبیعی شریانی (Normal Oxygenation) - تبادل ریوی گاز اکسیژن در حد مطلوبی است.';
      }
      
      if (fio2 >= 21) {
        calculatedPF = o2 / (fio2 / 100);
        if (calculatedPF < 100) {
          pfRatioInterpretation = `🚨 شاخص P/F بسیار خطرناک (${calculatedPF.toFixed(0)}) - منطبق بر سندرم دیسترس تنفسی حاد شدید (Severe ARDS). نیاز مبرم به بستری در ICU، لوله‌گذاری تراشه یا تهویه با فشار مثبت انتهای بازدمی بالا (PEEP).`;
        } else if (calculatedPF < 200) {
          pfRatioInterpretation = `🟠 شاخص P/F متوسط (${calculatedPF.toFixed(0)}) - منطبق بر ARDS متوسط (Moderate ARDS). ممکن است نیاز به لوله‌گذاری یا استفاده غیرتهاجمی از ونتیلاتور (NIV/CPAP) باشد.`;
        } else if (calculatedPF < 300) {
          pfRatioInterpretation = `🟡 شاخص P/F خفیف (${calculatedPF.toFixed(0)}) - منطبق بر ARDS خفیف (Mild ARDS) یا آسیب حاد ریوی (ALI). پایش اکسیژن‌رسانی و وضعیت تنفس ضروری است.`;
        } else {
          pfRatioInterpretation = `✅ شاخص P/F نرمال (${calculatedPF.toFixed(0)}) - تبادل و انتشار آلوئولی اکسیژن کاملاً طبیعی و بدون نقص تنفسی بارز است.`;
        }
      }
    } else {
      // VBG Oxygenation
      if (o2 < 30) {
        oxygenationStatus = '🔴 کاهش سطح اشباع یا فشار اکسیژن وریدی - احتمال وجود کاهش برون‌ده قلبی، کم‌خونی شدید یا افزایش برداشت اکسیژن توسط سلول‌ها به دلیل افزایش متابولیسم (مانند تشنج یا هایپرترمی).';
      } else if (o2 > 40) {
        oxygenationStatus = '🟡 فشار اکسیژن وریدی بالا - نشان‌دهنده عدم استفاده مناسب بافت‌ها از اکسیژن (مانند مسمومیت با سیانور یا شوک سپتیک با منبع توزیعی شدید) یا عبور مستقیم خون بدون تبادل بافتی (شنت عروقی).';
      } else {
        oxygenationStatus = '✅ اکسیژن‌رسانی وریدی نرمال - وضعیت برداشت بافتی و خون‌رسانی محیطی رضایت‌بخش است.';
      }
    }
    
    // 4. Generate overall interpretation summary text
    let interpretationText = `در بررسی آزمایش گازهای خونی بیمار (${isABG ? 'شریانی - ABG' : 'وریدی - VBG'}): `;
    
    if (ph < lowPH) {
      interpretationText += `اسیدمی بارز (pH = ${ph.toFixed(2)} کمتر از حد پایین ${lowPH}) مشاهده می‌شود. `;
    } else if (ph > highPH) {
      interpretationText += `آلکالمی بارز (pH = ${ph.toFixed(2)} بیشتر از حد بالا ${highPH}) مشاهده می‌شود. `;
    } else {
      interpretationText += `سطح pH خون (${ph.toFixed(2)}) در محدوده مرجع فیزیولوژیک (${lowPH} تا ${highPH}) حفظ شده است. `;
    }
    
    interpretationText += `فشار دی‌اکسید کربن (pCO2) برابر ${co2} mmHg است (محدوده طبیعی: ${lowCO2}-${highCO2}) که تغییرات آن جهت هدایت پاسخ تنفسی بیمار می‌باشد. `;
    interpretationText += `مقدار غلظت یون بیکربنات (HCO3) نیز برابر ${hco3} mEq/L ارزیابی گردیده است (محدوده طبیعی: ۲۲-۲۶) که به عنوان شاخص متابولیک اصلی سیستم بافری کلیوی عمل می‌کند.`;
    
    setResult({
      primaryDisturbance,
      compensationStatus,
      interpretationText,
      oxygenationStatus,
      anionGap: calculatedAG,
      anionGapInterpretation: agInterpretation,
      pfRatio: calculatedPF,
      pfRatioInterpretation,
      severity,
      color,
      bgGradient
    });
  }, [type, ph, co2, hco3, o2, fio2, na, cl]);

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={onBack} onHome={onHome} />
      
      <div className="premium-card p-10 space-y-10 border-indigo-500/20">
        <div className="pb-8 border-b border-white/5 text-center">
          <h3 className="text-3xl font-black text-white">تفسیر گازهای خونی (ABG / VBG)</h3>
          <p className="text-indigo-400 text-base font-bold mt-2">
            محاسبه خودکار اختلالات اسید و باز، سنجش میزان جبران، بررسی اکسیژن‌رسانی و فرمول شکاف آنیونی (Anion Gap)
          </p>
        </div>

        {/* Presets and Tutorial */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
          <h4 className="text-lg font-black text-white flex items-center gap-2">
            <span className="text-xl">🎓</span> الگوهای پیش‌فرض و موارد بالینی جهت آزمایش و یادگیری
          </h4>
          <p className="text-xs text-slate-400">با کلیک روی هر یک از سناریوهای زیر، پارامترهای فرم به طور خودکار منطبق با علائم آن سناریو تنظیم می‌شوند:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-right transition-all group"
              >
                <div className="text-indigo-300 font-black text-xs group-hover:text-white transition-colors">{preset.name}</div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 h-7">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Inputs Panel */}
          <div className="lg:col-span-6 space-y-8 bg-white/5 p-8 rounded-3xl border border-white/5">
            <h4 className="text-xl font-black text-white border-b border-white/5 pb-4 flex items-center gap-3">
              <span className="text-2xl">🩸</span> پارامترهای برگه آزمایش
            </h4>

            {/* ABG vs VBG Toggle */}
            <div className="space-y-3">
              <label className="text-slate-300 text-sm font-bold block">نوع نمونه خون (Blood Sample Type)</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('ABG')}
                  className={`p-4 rounded-2xl font-black text-base border transition-all ${type === 'ABG' ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  🔴 شریانی (ABG)
                </button>
                <button
                  type="button"
                  onClick={() => setType('VBG')}
                  className={`p-4 rounded-2xl font-black text-base border transition-all ${type === 'VBG' ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  🔵 وریدی (VBG)
                </button>
              </div>
            </div>

            {/* pH Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 text-sm font-bold">میزان اسیدیته خون (pH)</label>
                <span className="text-indigo-300 font-mono text-lg font-black">{ph.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-slate-400">محدوده نرمال {type === 'ABG' ? 'شریانی: ۷.۳۵ - ۷.۴۵' : 'وریدی: ۷.۳۱ - ۷.۴۱'}</p>
              <input
                type="range"
                min="6.80"
                max="7.80"
                step="0.01"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>اسیدوز شدید (6.8)</span>
                <span>نرمال (7.4)</span>
                <span>آلکالوز شدید (7.8)</span>
              </div>
            </div>

            {/* pCO2 Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 text-sm font-bold">فشار دی‌اکسید کربن (pCO2 / pvCO2) - mmHg</label>
                <span className="text-emerald-400 font-mono text-lg font-black">{co2} mmHg</span>
              </div>
              <p className="text-[10px] text-slate-400">محدوده نرمال {type === 'ABG' ? 'شریانی: ۳۵ - ۴۵' : 'وریدی: ۴۰ - ۵۰'}</p>
              <input
                type="range"
                min="10"
                max="100"
                value={co2}
                onChange={(e) => setCo2(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* HCO3- Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 text-sm font-bold">بیکربنات (HCO3-) - mEq/L</label>
                <span className="text-amber-400 font-mono text-lg font-black">{hco3} mEq/L</span>
              </div>
              <p className="text-[10px] text-slate-400">محدوده نرمال: ۲۲ - ۲۶ mEq/L</p>
              <input
                type="range"
                min="5"
                max="50"
                value={hco3}
                onChange={(e) => setHco3(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* pO2 Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 text-sm font-bold">
                  {type === 'ABG' ? 'فشار اکسیژن شریانی (paO2) - mmHg' : 'فشار اکسیژن وریدی (pvO2) - mmHg'}
                </label>
                <span className="text-sky-400 font-mono text-lg font-black">{o2} mmHg</span>
              </div>
              <p className="text-[10px] text-slate-400">محدوده نرمال {type === 'ABG' ? 'شریانی: ۸۰ - ۱۰۰' : 'وریدی: ۳۰ - ۴۰'}</p>
              <input
                type="range"
                min="20"
                max="150"
                value={o2}
                onChange={(e) => setO2(parseInt(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>

            {/* FiO2 Input - Only shown for ABG */}
            {type === 'ABG' && (
              <div className="space-y-3 border-t border-white/5 pt-4">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 text-sm font-bold">درصد اکسیژن دریافتی (FiO2) - %</label>
                  <span className="text-indigo-300 font-mono text-lg font-black">{fio2}%</span>
                </div>
                <p className="text-[10px] text-slate-400">هوای اتاق: ۲۱٪ | ماسک ساده یا ونتیلاتور: ۳۰٪ تا ۱۰۰٪</p>
                <input
                  type="range"
                  min="21"
                  max="100"
                  value={fio2}
                  onChange={(e) => setFio2(parseInt(e.target.value))}
                  className="w-full accent-indigo-400"
                />
              </div>
            )}

            {/* Optional Electrolytes for Anion Gap */}
            <div className="space-y-4 border-t border-white/5 pt-6">
              <h5 className="text-sm font-black text-white flex items-center gap-2">
                <span>🧪</span> وارد کردن الکترولیت‌ها برای محاسبه شکاف آنیونی (اختیاری)
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-400 text-xs font-bold block">سدیم (Na+) - mEq/L</label>
                  <input
                    type="number"
                    value={na}
                    onChange={(e) => setNa(e.target.value)}
                    placeholder="مانند 140"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-center focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-400 text-xs font-bold block">کلر (Cl-) - mEq/L</label>
                  <input
                    type="number"
                    value={cl}
                    onChange={(e) => setCl(e.target.value)}
                    placeholder="مانند 104"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-center focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            {result && (
              <div className="space-y-6">
                <h4 className="text-xl font-black text-white border-b border-white/5 pb-4 flex items-center gap-3">
                  <span className="text-2xl">📊</span> تحلیل و تفسیر تخصصی
                </h4>

                {/* Primary Diagnosis Card */}
                <div className={`bg-gradient-to-br ${result.bgGradient} rounded-3xl p-8 border text-white shadow-xl relative overflow-hidden transition-all duration-300`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">تشخیص اصلی (Primary Diagnosis)</span>
                    <h5 className={`text-2xl font-black ${result.color} mt-2 leading-snug`}>
                      {result.primaryDisturbance}
                    </h5>
                    
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm">
                      <div>
                        <span className="text-slate-300 font-bold block">وضعیت جبران بالینی (Compensation):</span>
                        <p className="text-white font-medium mt-1 leading-relaxed">
                          {result.compensationStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantitative Review */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">ارزیابی پارامترها و بازخورد آزمایشگاه</span>
                  <p className="text-slate-200 text-sm font-medium leading-relaxed">
                    {result.interpretationText}
                  </p>
                </div>

                {/* Oxygenation Analysis */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">اکسیژن‌رسانی (Oxygenation Status)</span>
                  <p className="text-slate-200 text-sm font-medium leading-relaxed">
                    {result.oxygenationStatus}
                  </p>
                  
                  {type === 'ABG' && result.pfRatio && result.pfRatioInterpretation && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <span className="text-indigo-300 text-xs font-bold block">شاخص و نسبت P/F Ratio (PaO2/FiO2):</span>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        {result.pfRatioInterpretation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Anion Gap Results */}
                {result.anionGap !== undefined && result.anionGapInterpretation && (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 animate-in">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">شکاف آنیونی (Anion Gap Calculation)</span>
                    <p className="text-slate-200 text-xs font-bold leading-relaxed">
                      {result.anionGapInterpretation}
                    </p>
                    <div className="text-[10px] text-indigo-300 font-mono">
                      فرمول: Anion Gap = Na⁺ - (Cl⁻ + HCO₃⁻) = {na} - ({cl} + {hco3}) = {result.anionGap.toFixed(1)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Informative Guidance */}
            <div className="bg-indigo-950/40 p-6 rounded-2xl border border-indigo-500/20 text-xs leading-relaxed text-indigo-200">
              <strong className="text-indigo-300 font-bold block mb-1">💡 راهنمای آموزشی پایش گازهای خونی:</strong>
              <ul className="list-disc list-inside space-y-1.5 mt-1">
                <li><strong>گام اول:</strong> ابتدا pH را بررسی کنید تا وجود اسیدمی (pH &lt; 7.35) یا آلکالمی (pH &gt; 7.45) مشخص شود.</li>
                <li><strong>گام دوم:</strong> جهت تعیین علت اصلی، تغییرات CO2 و HCO3 را مقایسه کنید (قانون ROME: Respiratory Opposite, Metabolic Equal).</li>
                <li><strong>گام سوم:</strong> جبران سیستم ثانویه (ریه یا کلیه) را بسنجید تا جبران کامل، جزئی یا عدم جبران مشخص گردد.</li>
                <li><strong>گام چهارم:</strong> در اسیدوز متابولیک، حتماً شکاف آنیونی را محاسبه کنید تا بین علل ایجاد اسیدوز تفکیک حاصل شود.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodGasAnalysis;
