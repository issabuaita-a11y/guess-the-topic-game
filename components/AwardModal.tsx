import React from 'react';
import { Trophy, Share2, ArrowRight } from 'lucide-react';
import { GameState } from '../types';

interface AwardModalProps {
    gameState: GameState;
    onContinue: () => void;
}

export const AwardModal: React.FC<AwardModalProps> = ({ gameState, onContinue }) => {
    const isAr = gameState.language === 'ar';
    const badge = gameState.showingAward;

    if (!badge) return null;

    let title = '';
    let description = '';
    let icon = '🏆';
    let color = 'text-yellow-500';
    let bg = 'bg-yellow-100';
    let border = 'border-yellow-400';

    if (badge === 'DETECTIVE_NOVICE') {
        title = isAr ? 'محقق مبتدئ' : 'NOVICE DETECTIVE';
        description = isAr ? 'لقد أكملت 5 جولات!' : 'You completed 5 rounds!';
        icon = '🥉';
        color = 'text-orange-600';
        bg = 'bg-orange-100';
        border = 'border-orange-400';
    } else if (badge === 'DETECTIVE_PRO') {
        title = isAr ? 'محقق محترف' : 'PRO DETECTIVE';
        description = isAr ? 'لقد أكملت 13 جولة!' : 'You completed 13 rounds!';
        icon = '🥈';
        color = 'text-gray-600';
        bg = 'bg-gray-100';
        border = 'border-gray-400';
    } else if (badge === 'DETECTIVE_MASTER') {
        title = isAr ? 'محقق أسطوري' : 'MASTER DETECTIVE';
        description = isAr ? 'لقد أكملت 20 جولة!' : 'You completed 20 rounds!';
        icon = '🥇';
        color = 'text-yellow-600';
        bg = 'bg-yellow-100';
        border = 'border-yellow-400';
    }

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`relative w-full max-w-md bg-white border-8 ${border} rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(234,179,8,0.5)] transform animate-in zoom-in-95 duration-300`}>

                {/* Confetti Effect (CSS only for simplicity) */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-6xl animate-bounce">
                    {icon}
                </div>

                <div className="mt-8 space-y-4">
                    <h2 className={`text-3xl ${color} uppercase tracking-tighter ${isAr ? 'font-sans font-bold' : 'font-pixel'}`}>
                        {isAr ? 'وسام جديد!' : 'NEW BADGE UNLOCKED!'}
                    </h2>

                    <div className={`${bg} p-6 rounded-2xl border-4 ${border} border-dashed`}>
                        <h3 className={`text-2xl text-purple-900 mb-2 ${isAr ? 'font-sans font-bold' : 'font-pixel'}`}>
                            {title}
                        </h3>
                        <p className="text-purple-700 font-mono text-lg">
                            {description}
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-green-600 font-bold bg-green-50 p-2 rounded-lg border-2 border-green-200">
                        <span>❤️</span>
                        <span>{isAr ? '+1 حياة إضافية!' : '+1 EXTRA LIFE!'}</span>
                    </div>

                    <button
                        onClick={onContinue}
                        className={`w-full py-4 mt-4 bg-purple-600 hover:bg-purple-500 text-white text-xl rounded-xl shadow-[0_6px_0_0_#581c87] active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${isAr ? 'font-sans font-bold' : 'font-pixel'}`}
                    >
                        {isAr ? 'استمر' : 'CONTINUE'} <ArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};
