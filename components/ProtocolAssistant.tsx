
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ProtocolAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askAssistant = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction: "شما دستیار هوشمند پروتکل مدیریت درد وزارت بهداشت هستید. پاسخ‌ها را علمی، کاربردی و کوتاه به زبان فارسی ارائه دهید.",
        },
      });
      setAnswer(response.text);
    } catch (e) {
      setAnswer("خطایی رخ داد. لطفاً دوباره سوال کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100]">
      {isOpen ? (
        <div className="bg-white w-[22rem] md:w-[26rem] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 flex flex-col overflow-hidden animate-fade-in-up">
          <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">🤖</div>
              <span className="font-black text-sm">دستیار هوشمند پروتکل</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 transition-colors">✕</button>
          </div>
          
          <div className="p-6 h-80 overflow-y-auto bg-slate-50/50">
            {!answer && !loading && (
              <div className="text-center mt-10 space-y-4">
                <p className="text-slate-400 text-sm">سوالات خود را درباره دوز داروها، نحوه استفاده از ابزارها و زمان‌بندی ارزیابی بپرسید.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["دوز مرفین؟", "زمان ارزیابی مجدد؟", "نحوه کار با BPS"].map(q => (
                    <button key={q} onClick={() => {setQuery(q);}} className="text-[10px] bg-white border border-slate-200 px-3 py-1 rounded-full hover:border-blue-500">{q}</button>
                  ))}
                </div>
              </div>
            )}
            {answer && (
              <div className="bg-white p-5 rounded-3xl text-sm text-slate-700 leading-relaxed border border-slate-100 shadow-sm">
                {answer}
              </div>
            )}
            {loading && <div className="flex justify-center mt-10"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askAssistant()}
              placeholder="اینجا بنویسید..."
              className="flex-1 bg-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            />
            <button 
              onClick={askAssistant}
              disabled={loading}
              className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-all active:scale-95 group"
        >
          <span className="group-hover:rotate-12 transition-transform">🤖</span>
        </button>
      )}
    </div>
  );
};

export default ProtocolAssistant;
