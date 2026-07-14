
import React, { useState } from 'react';
import { PatientStatus, PainSeverity, AssessmentResult, BPSScores } from '../types';

interface Props {
  status: PatientStatus;
  onAssess: (result: AssessmentResult) => void;
}

const PainAssessment: React.FC<Props> = ({ status, onAssess }) => {
  const [vasScore, setVasScore] = useState<number>(0);
  const [bps, setBps] = useState<BPSScores>({
    facial: 1,
    upperLimbs: 1,
    ventilation: 1,
    vocalization: 1,
    isIntubated: true
  });

  const calculateSeverity = (score: number, tool: string) => {
    if (tool === 'VAS') {
      if (score === 0) return PainSeverity.NONE;
      if (score <= 3) return PainSeverity.MILD;
      if (score <= 6) return PainSeverity.MODERATE;
      return PainSeverity.SEVERE;
    } else {
      if (score === 3) return PainSeverity.NONE;
      if (score <= 5) return PainSeverity.MILD;
      if (score <= 8) return PainSeverity.MODERATE;
      return PainSeverity.SEVERE;
    }
  };

  const handleVasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVasScore(val);
    onAssess({ score: val, severity: calculateSeverity(val, 'VAS'), toolUsed: 'VAS', timestamp: new Date() });
  };

  const handleBpsChange = (category: keyof BPSScores, value: number | boolean) => {
    const newBps = { ...bps, [category]: value } as BPSScores;
    setBps(newBps);
    const total = newBps.facial + newBps.upperLimbs + (newBps.isIntubated ? newBps.ventilation : newBps.vocalization);
    onAssess({ score: total, severity: calculateSeverity(total, 'BPS'), toolUsed: 'BPS', timestamp: new Date() });
  };

  if (status === PatientStatus.PARALYZED) {
    return (
      <div className="premium-card p-10 text-center space-y-8 border-indigo-500/20">
        <div className="w-24 h-24 bg-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-indigo-400/30">
          <span className="text-5xl animate-pulse">📊</span>
        </div>
        <div className="space-y-4">
          <h3 className="text-3xl font-black text-white">پایش فیزیولوژیک (همودینامیک)</h3>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            در بیماران تحت پارالیز عضلانی، ارزیابی درد بر اساس افزایش علایم حیاتی (بیش از ۲۰٪ نسبت به پایه) انجام می‌شود.
          </p>
        </div>
        <div className="bg-indigo-600/20 p-6 rounded-2xl border border-indigo-500/30 text-indigo-100 text-lg font-black shadow-inner">
          ⚠️ پایش مداوم ضربان قلب و فشار خون الزامی است
        </div>
      </div>
    );
  }

  return (
    <div className="premium-card p-10 space-y-12 border-indigo-500/20">
      {status === PatientStatus.CONSCIOUS ? (
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-right space-y-2">
              <h3 className="text-3xl font-black text-white tracking-tight">مقیاس دیداری درد (VAS)</h3>
              <p className="text-indigo-400 text-base font-bold italic tracking-wide">پیوست ۱ فایل ابلاغی: گزارش مستقیم بیمار</p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all"></div>
              <div className="relative w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-6xl font-black text-white shadow-[0_15px_35px_rgba(79,70,229,0.5)] border-4 border-white/10 tabular-nums">
                {vasScore}
              </div>
            </div>
          </div>
          
          <div className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/5">
            <input type="range" min="0" max="10" value={vasScore} onChange={handleVasChange} className="w-full h-3" />
            <div className="flex justify-between px-2 text-[10px] font-black text-indigo-300 uppercase tracking-widest">
              <span>بدون درد (۰)</span>
              <span>درد شدید (۱۰)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <PainFace icon="😊" label="بدون درد" active={vasScore === 0} />
            <PainFace icon="😐" label="خفیف" active={vasScore > 0 && vasScore <= 3} />
            <PainFace icon="😟" label="متوسط" active={vasScore > 3 && vasScore <= 6} />
            <PainFace icon="😫" label="شدید" active={vasScore > 6} />
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/5">
            <div className="text-right space-y-2">
              <h3 className="text-3xl font-black text-white">مقیاس رفتاری درد (BPS)</h3>
              <p className="text-indigo-400 text-base font-bold italic">پیوست ۲: ارزیابی تخصصی در بیماران ICU</p>
            </div>
            <div className="bg-white/5 p-2 rounded-2xl flex gap-2 border border-white/10 shadow-inner">
              <button onClick={() => handleBpsChange('isIntubated', true)} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${bps.isIntubated ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}>بیمار اینتوبه</button>
              <button onClick={() => handleBpsChange('isIntubated', false)} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${!bps.isIntubated ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}>غیر اینتوبه</button>
            </div>
          </div>

          <div className="grid gap-12">
            <BPSRow title="۱. حالات چهره" current={bps.facial} onSelect={(v) => handleBpsChange('facial', v)} options={["آرام (۱)", "نسبتاً درهم کشیده (۲)", "کاملاً درهم کشیده (۳)", "درهم رفتن خصمانه (۴)"]} />
            <BPSRow title="۲. حرکات اندام فوقانی" current={bps.upperLimbs} onSelect={(v) => handleBpsChange('upperLimbs', v)} options={["بی‌حرکت (۱)", "کمی خم می‌کند (۲)", "کاملاً خم می‌کند (۳)", "کشیدن و مقاومت (۴)"]} />
            <BPSRow 
              title={bps.isIntubated ? "۳. هماهنگی با ونتیلاتور" : "۳. وضعیت کلامی"} 
              current={bps.isIntubated ? bps.ventilation : bps.vocalization} 
              onSelect={(v) => handleBpsChange(bps.isIntubated ? 'ventilation' : 'vocalization', v)} 
              options={bps.isIntubated ? ["تحمل کامل (۱)", "سرفه گذرا (۲)", "جنگ با دستگاه (۳)", "عدم تحمل (۴)"] : ["صحبت عادی (۱)", "ناله جزیی (۲)", "ناله مکرر (۳)", "فریاد و ضجه (۴)"]} 
            />
          </div>

          <div className="p-10 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] flex items-center justify-between text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div>
              <p className="text-indigo-200 font-black text-[10px] mb-2 uppercase tracking-[0.4em]">Final Behavioral Score</p>
              <h4 className="text-3xl font-black">امتیاز نهایی ارزیابی</h4>
            </div>
            <div className="text-7xl font-black text-white tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              {bps.facial + bps.upperLimbs + (bps.isIntubated ? bps.ventilation : bps.vocalization)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PainFace = ({ icon, label, active }: any) => (
  <div className={`p-6 rounded-3xl border-2 transition-all duration-500 flex flex-col items-center group ${active ? 'bg-indigo-600 border-transparent shadow-xl scale-105' : 'bg-white/5 border-white/5 opacity-40 hover:opacity-60 grayscale hover:grayscale-0'}`}>
    <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</span>
    <span className={`text-sm font-black ${active ? 'text-white' : 'text-slate-400'}`}>{label}</span>
  </div>
);

const BPSRow = ({ title, options, current, onSelect }: any) => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <div className="w-2 h-8 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/40"></div>
      <h4 className="text-xl font-black text-slate-100">{title}</h4>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {options.map((opt: string, i: number) => (
        <button key={i} onClick={() => onSelect(i + 1)} className={`p-4 rounded-2xl border-2 transition-all duration-300 text-right relative overflow-hidden ${current === i + 1 ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg -translate-y-1' : 'bg-white/5 border-white/5 text-slate-500 hover:border-indigo-400/30'}`}>
           <div className="text-[9px] font-black mb-2 opacity-40 uppercase tracking-widest">انتخاب ۰{i + 1}</div>
          <p className="text-base font-bold leading-tight">{opt}</p>
        </button>
      ))}
    </div>
  </div>
);

export default PainAssessment;
