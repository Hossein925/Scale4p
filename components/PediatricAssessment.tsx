
import React, { useState } from 'react';
import { PediatricAgeGroup, PainSeverity, AssessmentResult, FLACCScores, CHIPPScores } from '../types';

interface Props {
  ageGroup: PediatricAgeGroup;
  onAssess: (result: AssessmentResult) => void;
}

const PediatricAssessment: React.FC<Props> = ({ ageGroup, onAssess }) => {
  const [flacc, setFlacc] = useState<FLACCScores>({ face: 0, legs: 0, activity: 0, cry: 0, consolability: 0 });
  const [chipps, setChipps] = useState<CHIPPScores>({ cry: 0, facial: 0, torsoPosture: 0, legPosture: 0, restlessness: 0 });
  const [selectedScore, setSelectedScore] = useState<number>(0);

  const handleFlaccChange = (cat: keyof FLACCScores, val: number) => {
    const newScores = { ...flacc, [cat]: val };
    setFlacc(newScores);
    
    const total = (Object.values(newScores) as number[]).reduce((a, b) => a + b, 0);
    
    let severity = PainSeverity.NONE;
    if (total > 0 && total <= 3) severity = PainSeverity.MILD;
    else if (total <= 6) severity = PainSeverity.MODERATE;
    else if (total >= 7) severity = PainSeverity.SEVERE;

    onAssess({ score: total, severity, toolUsed: 'FLACC', timestamp: new Date() });
  };
  
  const handleChippsChange = (cat: keyof CHIPPScores, val: number) => {
    const newScores = { ...chipps, [cat]: val };
    setChipps(newScores);
    
    const total = (Object.values(newScores) as number[]).reduce((a, b) => a + b, 0);
    
    let severity = PainSeverity.NONE;
    if (total === 0) severity = PainSeverity.NONE;
    else if (total <= 3) severity = PainSeverity.MILD;
    else if (total <= 6) severity = PainSeverity.MODERATE;
    else if (total >= 7) severity = PainSeverity.SEVERE;

    onAssess({ score: total, severity, toolUsed: 'CHIPPS', timestamp: new Date() });
  };


  const handleSimpleScore = (val: number, tool: 'WONG_BAKER' | 'NRS') => {
    setSelectedScore(val);
    let severity = PainSeverity.NONE;
    if (val > 0 && val <= 3) severity = PainSeverity.MILD;
    else if (val <= 6) severity = PainSeverity.MODERATE;
    else if (val >= 7) severity = PainSeverity.SEVERE;

    onAssess({ score: val, severity, toolUsed: tool, timestamp: new Date() });
  };

  if (ageGroup === PediatricAgeGroup.INFANT_TODDLER) {
    return (
      <div className="premium-card p-10 space-y-12 border-indigo-500/20">
        <div className="text-right border-b border-white/5 pb-6">
          <h3 className="text-3xl font-black text-white">مقیاس FLACC (۱ ماه تا ۴ سال)</h3>
          <p className="text-indigo-400 text-sm font-bold mt-2 italic">ارزیابی رفتاری بر اساس مشاهده پرستار</p>
        </div>
        <div className="grid gap-10">
          <ScoreRow title="چهره (Face)" current={flacc.face} options={["آرام (۰)", "اخم گهگاه/بی‌علاقگی (۱)", "لرزش چانه/فک فشرده (۲)"]} onSelect={(v) => handleFlaccChange('face', v)} />
          <ScoreRow title="پاها (Legs)" current={flacc.legs} options={["طبیعی (۰)", "ناآرام/سفت (۱)", "لگد زدن/کشیده شده (۲)"]} onSelect={(v) => handleFlaccChange('legs', v)} />
          <ScoreRow title="فعالیت (Activity)" current={flacc.activity} options={["حرکت آرام (۰)", "پیچ و تاب/سفتی (۱)", "حرکات سریع/تکان شدید (۲)"]} onSelect={(v) => handleFlaccChange('activity', v)} />
          <ScoreRow title="گریه (Cry)" current={flacc.cry} options={["بدون گریه (۰)", "ناله/شکایت گهگاه (۱)", "گریه مداوم/جیغ (۲)"]} onSelect={(v) => handleFlaccChange('cry', v)} />
          <ScoreRow title="تسلی‌پذیری (Consolability)" current={flacc.consolability} options={["آرام (۰)", "با لمس آرام می‌شود (۱)", "دلداری دادن دشوار است (۲)"]} onSelect={(v) => handleFlaccChange('consolability', v)} />
        </div>
      </div>
    );
  }

  if (ageGroup === PediatricAgeGroup.PRE_SCHOOL) {
    return (
      <div className="premium-card p-10 space-y-12">
        <div className="text-right border-b border-white/5 pb-6">
          <h3 className="text-3xl font-black text-white">مقیاس Wong-Baker (۳ تا ۷ سال)</h3>
          <p className="text-indigo-400 text-sm font-bold mt-2 italic">از کودک بخواهید چهره‌ای که مشابه حال اوست را انتخاب کند</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[0, 2, 4, 6, 8, 10].map((v, i) => (
            <button key={v} onClick={() => handleSimpleScore(v, 'WONG_BAKER')} className={`p-6 rounded-3xl border-2 transition-all ${selectedScore === v ? 'bg-indigo-600 border-indigo-400 scale-105 shadow-xl' : 'bg-white/5 border-white/5 grayscale opacity-50'}`}>
              <div className="text-5xl mb-4">{["😊", "😐", "😟", "😣", "😭", "😫"][i]}</div>
              <div className="text-lg font-black text-white">{v}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (ageGroup === PediatricAgeGroup.SCHOOL_ADOLESCENT) {
    return (
        <div className="premium-card p-10 space-y-12">
            <div className="text-right border-b border-white/5 pb-6">
                <h3 className="text-3xl font-black text-white">مقیاس عددی درد (NRS) (بالای ۷ سال)</h3>
                <p className="text-indigo-400 text-sm font-bold mt-2 italic">از کودک بخواهید از ۰ (بدون درد) تا ۱۰ (بدترین درد) به درد خود امتیاز دهد</p>
            </div>
            <div className="flex justify-center items-center gap-2 flex-wrap">
                {[...Array(11).keys()].map(v => (
                    <button
                        key={v}
                        onClick={() => handleSimpleScore(v, 'NRS')}
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 text-2xl font-black transition-all flex items-center justify-center
                        ${selectedScore === v ? 'bg-indigo-600 border-indigo-400 scale-110 shadow-xl' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                    >
                        {v}
                    </button>
                ))}
            </div>
            <div className="flex justify-between px-2 text-xs font-black text-indigo-300 uppercase">
                <span>بدون درد</span>
                <span>درد غیر قابل تحمل</span>
            </div>
        </div>
    );
  }

  if (ageGroup === PediatricAgeGroup.POST_OP) {
      return (
          <div className="premium-card p-10 space-y-12 border-indigo-500/20">
              <div className="text-right border-b border-white/5 pb-6">
                  <h3 className="text-3xl font-black text-white">مقیاس CHIPPS (بعد از عمل تا ۷ سال)</h3>
                  <p className="text-indigo-400 text-sm font-bold mt-2 italic">ارزیابی درد بعد از عمل در شیرخواران و کودکان</p>
              </div>
              <div className="grid gap-10">
                  <ScoreRow title="گریه (Cry)" current={chipps.cry} options={["بدون گریه (۰)", "ناله کردن (۱)", "جیغ و فریاد (۲)"]} onSelect={(v) => handleChippsChange('cry', v)} />
                  <ScoreRow title="حالت چهره (Facial)" current={chipps.facial} options={["آرام (۰)", "درهم کشیده (۱)", "صورت سفت شده (۲)"]} onSelect={(v) => handleChippsChange('facial', v)} />
                  <ScoreRow title="وضعیت تنه (Torso)" current={chipps.torsoPosture} options={["طبیعی (۰)", "جابجایی/تنش (۱)", "قوس‌دار/سفت (۲)"]} onSelect={(v) => handleChippsChange('torsoPosture', v)} />
                  <ScoreRow title="وضعیت پاها (Legs)" current={chipps.legPosture} options={["طبیعی (۰)", "ناآرام/لگد زدن (۱)", "جمع شده/سفت (۲)"]} onSelect={(v) => handleChippsChange('legPosture', v)} />
                  <ScoreRow title="بی‌قراری (Restlessness)" current={chipps.restlessness} options={["آرام (۰)", "بی‌قرار و پیچ و تاب خوردن (۱)", "حرکات شدید و تند (۲)"]} onSelect={(v) => handleChippsChange('restlessness', v)} />
              </div>
          </div>
      );
  }

  return null;
};

const ScoreRow = ({ title, options, current, onSelect }: any) => (
  <div className="space-y-4">
    <h4 className="text-lg font-black text-slate-200">{title}</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {options.map((opt: string, i: number) => (
        <button key={i} onClick={() => onSelect(i)} className={`p-4 rounded-2xl border-2 text-right transition-all ${current === i ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'}`}>
          <span className="text-sm font-bold">{opt}</span>
        </button>
      ))}
    </div>
  </div>
);

export default PediatricAssessment;
