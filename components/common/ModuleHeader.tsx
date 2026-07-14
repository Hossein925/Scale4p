
import React from 'react';

interface Props {
  onBack: () => void;
  onHome: () => void;
}

const ModuleHeader: React.FC<Props> = ({ onBack, onHome }) => {
  return (
    <div className="flex justify-between items-center">
      <button onClick={onHome} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
        <span className="text-2xl transition-transform group-hover:scale-110">🏠</span>
        <span className="text-white font-black text-sm">منوی اصلی</span>
      </button>
      <button onClick={onBack} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
        <span className="text-white font-black text-sm">بازگشت</span>
        <span className="text-2xl transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
      </button>
    </div>
  );
};

export default ModuleHeader;
