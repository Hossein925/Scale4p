
import React from 'react';

interface Props {
  title: string;
  toolUsed: string;
  score: number | string;
  interpretation: string;
  color: string;
  icon: string;
  recommendations?: string[];
}

const AssessmentResultDisplay: React.FC<Props> = ({ title, toolUsed, score, interpretation, color, icon, recommendations }) => {
  return (
    <div className="animate-in mt-10 premium-card overflow-hidden shadow-xl border border-white/5">
      <div className={`${color} p-8 flex flex-col lg:flex-row items-center justify-between gap-8 relative`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl border border-white/30 shadow-inner">
            {icon}
          </div>
          <div className="text-center lg:text-right">
            <h3 className="text-2xl font-black text-white leading-tight">{title}</h3>
            <p className="text-white/70 text-xs font-bold mt-1 uppercase tracking-wide">
              {toolUsed} Assessment Scale
            </p>
          </div>
        </div>
        
        <div className="relative flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl text-indigo-950 text-center shadow-lg">
            <span className="block text-[8px] font-black opacity-40 mb-0.5">امتیاز نهایی</span>
            <span className="text-3xl font-black text-indigo-700 tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      <div className="p-8 text-center bg-slate-800/50">
          <p className="text-xl font-black text-white">
            <span className="text-indigo-400">نتیجه: </span>{interpretation}
          </p>
      </div>

      {recommendations && recommendations.length > 0 && (
        <div className="p-8 bg-slate-900/60 border-t border-white/5">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-7 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30"></div>
              <h4 className="text-xl font-black text-indigo-100">توصیه‌های مراقبتی پیشنهادی</h4>
            </div>
          <ul className="space-y-4">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-emerald-400 text-xl font-black mt-0.5">✓</span>
                <span className="text-slate-200 font-bold leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AssessmentResultDisplay;
