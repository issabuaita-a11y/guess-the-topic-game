import React from 'react';
import { GameState } from '../types';
import { Check, X, Skull, ChevronRight } from 'lucide-react';

interface ResultModalProps {
  gameState: GameState;
  onNext: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ gameState, onNext }) => {
  const result = gameState.lastResult;
  const topicLabel = gameState.currentTopic?.label || '???';
  const isAr = gameState.language === 'ar';

  if (!result) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-purple-900/60 backdrop-blur-sm"
      dir={isAr ? 'rtl' : 'ltr'}
      data-language={gameState.language}
    >
      <div className="bg-white border-8 border-purple-900 rounded-[2rem] p-8 w-full max-w-lg text-center shadow-[12px_12px_0_0_rgba(0,0,0,0.2)] animate-in zoom-in duration-300">

        <div className="flex justify-center mb-6">
          {result === 'win' && (
            <div className="bg-green-100 p-4 rounded-full border-4 border-green-500 shadow-lg">
              <Check size={48} className="text-green-600" />
            </div>
          )}
          {result === 'loss' && (
            <div className="bg-red-100 p-4 rounded-full border-4 border-red-500 shadow-lg">
              <X size={48} className="text-red-600" />
            </div>
          )}
          {result === 'timeout' && (
            <div className="bg-yellow-100 p-4 rounded-full border-4 border-yellow-500 shadow-lg">
              <Skull size={48} className="text-yellow-600" />
            </div>
          )}
        </div>

        <h2 className={`text-3xl text-purple-900 mb-4 tracking-tighter uppercase ${isAr ? 'font-sans font-bold' : 'font-pixel'}`}>
          {result === 'win'
            ? (isAr ? 'إجابة صحيحة!' : 'CORRECT!')
            : (isAr ? 'انتهت اللعبة' : 'GAME OVER')}
        </h2>

        {/* Badge Unlocked Notification */}
        {result === 'win' && gameState.round === 5 && (
          <div className={`mb-4 animate-bounce bg-yellow-100 border-2 border-yellow-400 p-2 rounded-lg text-yellow-800 tracking-wider ${isAr ? 'font-sans font-bold text-sm' : 'font-pixel text-xs'}`}>
            🏆 {isAr ? 'وسام جديد: تم فتح محقق مبتدئ!' : 'NEW BADGE: NOVICE DETECTIVE UNLOCKED!'}
          </div>
        )}
        {result === 'win' && gameState.round === 13 && (
          <div className={`mb-4 animate-bounce bg-yellow-100 border-2 border-yellow-400 p-2 rounded-lg text-yellow-800 tracking-wider ${isAr ? 'font-sans font-bold text-sm' : 'font-pixel text-xs'}`}>
            🏆 {isAr ? 'وسام جديد: تم فتح محقق محترف!' : 'NEW BADGE: PRO DETECTIVE UNLOCKED!'}
          </div>
        )}

        <div className="mb-8 bg-purple-50 rounded-2xl p-6 border-4 border-purple-100 flex flex-col items-center justify-center min-h-[140px]">
          <p className={`text-purple-400 mb-2 uppercase opacity-60 tracking-widest ${isAr ? 'font-sans font-bold text-xs' : 'font-pixel text-[10px]'}`}>
            {isAr ? 'الموضوع كان' : 'The topic was'}
          </p>
          <div className="w-full flex items-center justify-center">
            <p className={`text-2xl sm:text-3xl md:text-4xl text-purple-700 tracking-wider brightness-90 break-words leading-tight max-w-full ${isAr ? 'font-sans font-bold' : 'font-pixel'}`}>
              {topicLabel}
            </p>
          </div>
        </div>

        <button
          onClick={onNext}
          className={`group w-full py-5 bg-purple-600 hover:bg-purple-500 text-white text-lg rounded-xl shadow-[0_8px_0_0_#581c87] active:shadow-none active:translate-y-2 transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${isAr ? 'font-sans font-bold' : 'font-pixel'}`}
        >
          {isAr ? 'الجولة التالية' : 'NEXT ROUND'} <ChevronRight className={`w-6 h-6 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};