import React from 'react';
import { Timer, Trophy, Hash } from 'lucide-react';

interface HeaderProps {
  timeLeft: number;
  score: number;
  round: number;
  badges?: string[];
  language: 'en' | 'ar';
}

export const Header: React.FC<HeaderProps> = ({ timeLeft, score, round, badges = [], language }) => {
  const isUrgent = timeLeft <= 10;
  const isAr = language === 'ar';

  return (
    <header
      className="h-16 sm:h-20 bg-white border-b-4 sm:border-b-8 border-purple-300 flex items-center justify-between px-2 sm:px-8 relative z-20 shadow-md"
      dir={isAr ? 'rtl' : 'ltr'}
      data-language={language}
    >

      {/* Left HUD (Right in RTL) */}
      <div className="flex items-center gap-4 sm:gap-8">
        <div className="flex flex-col">
          <span className={`text-purple-400 mb-1 tracking-tighter ${isAr ? 'font-sans font-bold text-xs' : 'font-pixel text-[10px]'}`}>
            {isAr ? 'الجولة' : 'ROUND'}
          </span>
          <div className="flex items-center gap-2 text-purple-700">
            <Hash size={16} />
            <span className="text-xl font-mono font-bold">{round.toString().padStart(2, '0')}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className={`text-purple-400 mb-1 tracking-tighter ${isAr ? 'font-sans font-bold text-xs' : 'font-pixel text-[10px]'}`}>
            {isAr ? 'النقاط' : 'SCORE'}
          </span>
          <div className="flex items-center gap-2 text-yellow-600">
            <Trophy size={16} />
            <span className="text-xl font-mono font-bold">{score.toString().padStart(5, '0')}</span>
          </div>
        </div>
      </div>

      {/* Center Badges */}
      <div className="hidden md:flex gap-2 absolute left-1/2 transform -translate-x-1/2">
        {/* Placeholder slots for badges */}
        {['DETECTIVE_NOVICE', 'DETECTIVE_PRO', 'DETECTIVE_MASTER'].map((badge) => {
          const hasBadge = (badges || []).includes(badge);
          let icon = '';
          if (badge === 'DETECTIVE_NOVICE') icon = '🥉';
          if (badge === 'DETECTIVE_PRO') icon = '🥈';
          if (badge === 'DETECTIVE_MASTER') icon = '🥇';

          return (
            <div key={badge} className={`w-10 h-10 flex items-center justify-center border-2 rounded-lg 
                ${hasBadge ? 'bg-yellow-100 border-yellow-400 opacity-100 scale-110' : 'bg-gray-100 border-gray-200 opacity-30'}
             `}>
              <span className="text-xl">{icon}</span>
            </div>
          )
        })}
      </div>

      {/* Timer HUD */}
      <div className={`
        flex items-center gap-3 px-6 py-2 border-4 rounded-xl
        transition-all duration-300
        ${isUrgent
          ? 'bg-red-100 border-red-400 text-red-600 animate-pulse'
          : 'bg-purple-50 border-purple-200 text-purple-600'
        }
      `}>
        <Timer size={22} className={isUrgent ? 'animate-bounce' : ''} />
        <span className="font-pixel text-lg w-10 text-center">{timeLeft}</span>
      </div>
    </header>
  );
};