
import React from 'react';

interface Props {
  title: string;
  description?: string;
  options: { label: string; value: number }[];
  currentValue: number;
  onSelect: (value: number) => void;
}

const AssessmentRow: React.FC<Props> = ({ title, description, options, currentValue, onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-2 h-8 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/40 mt-1 shrink-0"></div>
        <div>
          <h4 className="text-xl font-black text-slate-100">{title}</h4>
          {description && <p className="text-sm text-indigo-300 font-bold mt-1 max-w-lg">{description}</p>}
        </div>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-${options.length > 4 ? 4 : options.length} gap-4`}>
        {options.map((opt) => (
          <button 
            key={opt.value} 
            onClick={() => onSelect(opt.value)} 
            className={`p-4 rounded-2xl border-2 transition-all duration-300 text-right relative overflow-hidden ${currentValue === opt.value ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg -translate-y-1' : 'bg-white/5 border-white/5 text-slate-400 hover:border-indigo-400/30 hover:text-white'}`}
          >
            <div className="text-[9px] font-black mb-2 opacity-50 uppercase tracking-widest">امتیاز {opt.value}</div>
            <p className="text-base font-bold leading-tight">{opt.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssessmentRow;
