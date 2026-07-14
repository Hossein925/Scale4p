
import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const persianDate = time.toLocaleDateString('fa-IR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const persianTime = time.toLocaleTimeString('fa-IR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-[100] py-4">
      <div className="absolute inset-0 bg-indigo-950/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]"></div>
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center justify-center gap-3">
          
          {/* بخش زمان و تاریخ با ابعاد بهینه */}
          <div className="flex items-center gap-6 bg-white/5 px-6 py-2 rounded-2xl border border-white/10 shadow-inner">
            <div className="flex items-center gap-3 text-indigo-200">
              <span className="text-lg">🗓️</span>
              <span className="text-sm font-black tracking-tight">{persianDate}</span>
            </div>
            <div className="w-px h-6 bg-white/10"></div>
            <div className="flex items-center gap-3 text-white">
              <span className="text-lg">🕒</span>
              <span className="text-xl font-black tabular-nums tracking-wider text-glow">{persianTime}</span>
            </div>
          </div>

          {/* نام سازنده - فشرده‌تر */}
          <div className="text-center">
            <h4 className="text-sm font-black text-white/80">
              طراحی و توسعه تخصصی: <span className="text-indigo-400 bg-indigo-500/10 px-4 py-0.5 rounded-lg border border-indigo-400/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">حسین نصاری</span>
            </h4>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
