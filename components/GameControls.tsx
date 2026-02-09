import React from 'react';
import { Topic } from '../types';

interface GameControlsProps {
  options: Topic[];
  onGuess: (id: string) => void;
  disabled: boolean;
  language: 'en' | 'ar';
}

export const GameControls: React.FC<GameControlsProps> = ({ options, onGuess, disabled, language }) => {
  const isAr = language === 'ar';
  return (
    <div className="p-4 sm:p-10 bg-white border-t-8 border-purple-300 z-20 shadow-[0_-8px_0_0_rgba(0,0,0,0.05)]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <h3 className={`text-center text-purple-400 mb-4 sm:mb-6 tracking-wider uppercase opacity-80 ${isAr ? 'font-sans font-bold text-sm' : 'text-[10px] sm:text-sm font-pixel'}`}>
          {isAr ? 'عن ماذا يتحدثون؟' : 'What are they talking about?'}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onGuess(option.id)}
              disabled={disabled}
              className={`
                min-h-[4rem] sm:min-h-[7rem] px-2 sm:px-4 py-2 sm:py-4 relative tracking-wider rounded-xl border-4
                transition-all duration-200
                ${isAr ? 'font-sans font-bold text-sm' : 'font-pixel text-[10px] sm:text-sm'}
                ${disabled
                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-purple-400 text-purple-900 shadow-[2px_2px_0_0_#581c87] sm:shadow-[4px_4px_0_0_#581c87] hover:bg-purple-50 active:shadow-none active:translate-y-0.5 active:translate-x-0.5'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};