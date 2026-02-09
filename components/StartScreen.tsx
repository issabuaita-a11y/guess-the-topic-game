import React from 'react';
import { MessageSquare, Cpu, Search } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  onLanguageChange: (lang: 'en' | 'ar') => void;
  currentLanguage: 'en' | 'ar';
}

const translations = {
  en: {
    title: "GUESS THE TOPIC",
    subtitle: "A PIXEL-ART DEDUCTION GAME",
    observe: "OBSERVE",
    observeDesc: "Watch bots chat.",
    deduce: "DEDUCE",
    deduceDesc: "Find patterns.",
    solve: "SOLVE",
    solveDesc: "Pick topic.",
    start: "START GAME"
  },
  ar: {
    title: "خمن الموضوع",
    subtitle: "لعبة استنتاج بفن البكسل",
    observe: "راقب",
    observeDesc: "شاهد البوتات تتحدث.",
    deduce: "استنتج",
    deduceDesc: "ابحث عن الأنماط.",
    solve: "حل",
    solveDesc: "اختر الموضوع.",
    start: "ابدأ اللعبة"
  }
};

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onLanguageChange, currentLanguage }) => {
  const t = translations[currentLanguage];
  const isAr = currentLanguage === 'ar';

  return (
    <div
      className={`h-dvh flex flex-col items-center justify-center p-6 bg-purple-200 relative overflow-hidden font-vt323 px-4 ${isAr ? 'rtl' : 'ltr'}`}
      dir={isAr ? 'rtl' : 'ltr'}
      data-language={currentLanguage}
    >
      {/* Animated Pattern Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#a855f7 2px, transparent 2px)`,
          backgroundSize: '24px 24px'
        }}>
      </div>

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-50 flex gap-2">
        <button
          onClick={() => onLanguageChange('en')}
          className={`px-3 py-1 border-2 border-purple-900 font-pixel text-[10px] transition-all ${currentLanguage === 'en' ? 'bg-purple-900 text-white' : 'bg-white text-purple-900 hover:bg-purple-100'}`}
        >
          EN
        </button>
        <button
          onClick={() => onLanguageChange('ar')}
          className={`px-3 py-1 border-2 border-purple-900 font-pixel text-[10px] transition-all ${currentLanguage === 'ar' ? 'bg-purple-900 text-white' : 'bg-white text-purple-900 hover:bg-purple-100'}`}
        >
          عربي
        </button>
      </div>

      <div className="max-w-3xl w-full text-center space-y-6 sm:space-y-12 relative z-10 px-2 sm:px-0">
        <div className="space-y-2 sm:space-y-4">
          <div className="inline-block bg-white border-2 sm:border-4 border-purple-900 p-3 sm:p-6 shadow-[4px_4px_0_0_rgba(88,28,135,0.3)] sm:shadow-[8px_8px_0_0_rgba(88,28,135,0.3)] transform rotate-1">
            <h1 className={`text-2xl sm:text-6xl text-purple-900 leading-tight ${isAr ? 'font-sans font-bold' : 'font-pixel'}`}>
              {t.title}
            </h1>
          </div>
          <p className="text-purple-700 text-sm sm:text-2xl font-mono tracking-widest mt-2 sm:mt-4 uppercase">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 text-start">
          <div className="bg-white p-3 sm:p-6 border-2 sm:border-4 border-purple-300 shadow-sm rounded-xl flex items-center md:flex-col md:items-start gap-4 md:gap-0">
            <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mb-0 md:mb-4 shrink-0" />
            <div>
              <h3 className={`text-purple-900 mb-1 sm:mb-2 uppercase tracking-tighter ${isAr ? 'font-sans font-bold text-xs' : 'font-pixel text-[10px] sm:text-xs'}`}>{t.observe}</h3>
              <p className="text-purple-600 text-xs sm:text-sm leading-tight">{t.observeDesc}</p>
            </div>
          </div>
          <div className="bg-white p-3 sm:p-6 border-2 sm:border-4 border-purple-300 shadow-sm rounded-xl flex items-center md:flex-col md:items-start gap-4 md:gap-0">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mb-0 md:mb-4 shrink-0" />
            <div>
              <h3 className={`text-purple-900 mb-1 sm:mb-2 uppercase tracking-tighter ${isAr ? 'font-sans font-bold text-xs' : 'font-pixel text-[10px] sm:text-xs'}`}>{t.deduce}</h3>
              <p className="text-purple-600 text-xs sm:text-sm leading-tight">{t.deduceDesc}</p>
            </div>
          </div>
          <div className="bg-white p-3 sm:p-6 border-2 sm:border-4 border-purple-300 shadow-sm rounded-xl flex items-center md:flex-col md:items-start gap-4 md:gap-0">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mb-0 md:mb-4 shrink-0" />
            <div>
              <h3 className={`text-purple-900 mb-1 sm:mb-2 uppercase tracking-tighter ${isAr ? 'font-sans font-bold text-xs' : 'font-pixel text-[10px] sm:text-xs'}`}>{t.solve}</h3>
              <p className="text-purple-600 text-xs sm:text-sm leading-tight">{t.solveDesc}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className={`w-full sm:w-auto px-8 sm:px-16 py-4 sm:py-6 bg-yellow-400 hover:bg-yellow-300 text-purple-900 text-xl sm:text-2xl border-2 sm:border-4 border-purple-900 shadow-[4px_4px_0_0_#581c87] sm:shadow-[8px_8px_0_0_#581c87] hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#581c87] transition-all active:translate-y-1 uppercase ${isAr ? 'font-sans font-bold' : 'font-pixel'}`}
        >
          {t.start}
        </button>
      </div>
    </div>
  );
};