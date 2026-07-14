
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  return (
    <>
      <header className="relative z-50 py-4 px-6 indigo-gradient-bg border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-400/30 shadow-inner backdrop-blur-md">
              <span className="text-2xl">🩺</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-white text-neon">سامانه جامع ارزیابی پرستاری</h1>
              <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-[0.15em] mt-0.5">Comprehensive Nursing Assessment System</p>
            </div>
          </div>
          
          <button onClick={() => setIsAboutModalOpen(true)} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-emerald-300 font-black text-sm">درباره برنامه</span>
          </button>
        </div>
      </header>

      {isAboutModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in">
          <div 
            className="absolute inset-0"
            onClick={() => setIsAboutModalOpen(false)}
            aria-hidden="true"
          ></div>
          <div role="dialog" aria-modal="true" aria-labelledby="about-title" className="relative premium-card p-6 md:p-10 max-w-2xl w-full space-y-6 md:space-y-8 border-indigo-500/30">
            <div className="flex justify-between items-center pb-4 md:pb-6 border-b border-white/10">
                <h3 id="about-title" className="text-xl md:text-2xl font-black text-white">درباره سامانه</h3>
                <button onClick={() => setIsAboutModalOpen(false)} aria-label="بستن" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white text-xl">✕</button>
            </div>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed md:leading-loose text-justify font-medium space-y-2">
              این سامانه یک ابزار جامع و تخصصی برای پرستاران است که مجموعه‌ای گستره و بی‌نظیر از مقیاس‌ها و پروتکل‌های استاندارد ارزیابی بالینی را فراهم می‌کند. در آخرین به‌روزرسانی برنامه (تیر ۱۴۰۵)، بخش فوق‌تخصصی مدیریت درد نوزادان بستری (شامل ابزارهای استاندارد NIPS و CRIES به همراه پکیج دستورالعمل‌های غیردارویی و دارویی معتبر) و نیز فرآیند ارزیابی آمادگی بیمار جهت جداسازی از ونتیلاتور (Weaning) به سامانه اضافه شده‌اند. این سیستم در مجموع شامل ۱۲ ابزار کاربردی و کلیدی از جمله ارزیابی درد، زخم فشاری، ریسک سقوط، سطح هوشیاری، مقیاس سکته NIHSS، ترومبوآمبولی، محاسبات شاخص توده بدنی (BMI)، تخمین قد و وزن از روی قد زانو، تحلیل گازهای خونی شریانی (ABG/VBG)، غربالگری خودکشی و ابزارهای بخش‌های ویژه (APACHE II, SOFA, RASS) است تا کارآمدی بالینی کادر درمان را به حداکثر برساند.
            </p>
            
            <div className="pt-6 md:pt-8 mt-6 md:mt-8 border-t border-white/10 text-center space-y-6">
              <p className="text-slate-400 font-bold text-sm md:text-base">
                سازنده: حسین نصاری • آخرین به‌روزرسانی: تیر ۱۴۰۵
              </p>
              <div className="flex flex-col items-center justify-center gap-4">
                <a href="https://t.me/ho3in925" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 px-4 py-3 md:px-6 md:py-4 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 transition-colors w-full justify-center text-right">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 md:w-8 md:h-8 text-sky-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-1.37.2-1.64l16.43-6.2c.85-.32 1.58.2 1.32 1.28l-2.6 12.42c-.28 1.13-1.02 1.4-1.9 .86L12.1 14.53l-1.62 1.55c-.2.2-.36.36-.67.36z"></path>
                  </svg>
                  <div>
                    <span className="text-sky-300 font-black text-sm md:text-base">ارتباط با سازنده</span>
                    <span className="block text-sky-400/70 font-bold text-xs mt-1">@ho3in925</span>
                  </div>
                </a>
                <a href="https://www.aparat.com/Amazing.Nurse" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 px-4 py-3 md:px-6 md:py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors w-full justify-center text-right">
                  <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 md:w-8 md:h-8 text-red-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none">
                        <path d="M2.35 10.16L7.5 2.37C8.55 0.81 9.3 1.38 9.7 1.42H14.3C14.7 1.38 15.45 0.81 16.5 2.37L21.65 10.16C22.42 11.3 22.42 12.7 21.65 13.84L16.5 21.63C15.45 23.19 14.7 22.62 14.3 22.58H9.7C9.3 22.62 8.55 23.19 7.5 21.63L2.35 13.84C1.58 12.7 1.58 11.3 2.35 10.16Z" fill="currentColor"></path>
                        <path d="M15 12L10 8V16L15 12Z" fill="#ffffff"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-red-300 font-black text-sm md:text-base">دسترسی به ویدیوهای آموزشی</span>
                    <span className="block text-red-400/70 font-bold text-xs mt-1">Amazing.Nurse</span>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Header;
