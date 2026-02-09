import React, { useState } from 'react';
import { ChevronRight, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Difficulty } from '../types';

interface DifficultyScreenProps {
    onStart: (difficulty: Difficulty) => void;
}

export const DifficultyScreen: React.FC<DifficultyScreenProps> = ({ onStart }) => {
    const [selected, setSelected] = useState<Difficulty>('easy');

    const difficulties: { id: Difficulty; label: string; desc: string; icon: any; color: string }[] = [
        {
            id: 'easy',
            label: 'EASY',
            desc: 'Common objects, clear hints. Perfect for an entry-level session.',
            icon: ShieldCheck,
            color: 'text-green-600'
        },
        {
            id: 'medium',
            label: 'MEDIUM',
            desc: 'Abstract links, tricky banter. Requires sharp focus.',
            icon: Shield,
            color: 'text-yellow-600'
        },
        {
            id: 'hard',
            label: 'HARD',
            desc: 'Cryptic concepts, poetic riddles. Only for deduction masters.',
            icon: ShieldAlert,
            color: 'text-red-600'
        },
    ];

    return (
        <div className="h-screen flex flex-col items-center justify-center p-6 bg-purple-200 relative overflow-hidden font-vt323 px-4">
            {/* Background */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#a855f7 2px, transparent 2px)`,
                    backgroundSize: '24px 24px'
                }}>
            </div>

            <div className="max-w-2xl w-full text-center space-y-12 relative z-10">

                <div className="inline-block bg-white border-4 border-purple-900 p-4 shadow-[6px_6px_0_0_rgba(88,28,135,0.3)]">
                    <h2 className="text-2xl sm:text-4xl text-purple-900 font-pixel uppercase tracking-tight">
                        SELECT DIFFICULTY
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {difficulties.map((d) => (
                        <button
                            key={d.id}
                            onClick={() => setSelected(d.id)}
                            className={`
                p-6 border-4 transition-all text-left relative flex items-center gap-6 group
                ${selected === d.id
                                    ? 'bg-purple-600 border-purple-900 text-white shadow-[8px_8px_0_0_#581c87] scale-105'
                                    : 'bg-white border-purple-300 text-purple-900 hover:border-purple-500'
                                }
              `}
                        >
                            <div className={`p-3 bg-purple-50 rounded-lg group-hover:scale-110 transition-transform ${selected === d.id ? 'bg-white/20' : ''}`}>
                                <d.icon size={32} className={selected === d.id ? 'text-white' : d.color} />
                            </div>

                            <div className="flex-1">
                                <div className="font-pixel text-lg mb-1">{d.label}</div>
                                <div className="text-sm font-mono leading-tight opacity-80">{d.desc}</div>
                            </div>

                            {selected === d.id && (
                                <div className="hidden sm:block">
                                    <ChevronRight size={24} className="animate-pulse" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onStart(selected)}
                    className="px-16 py-6 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-pixel text-2xl border-4 border-purple-900 shadow-[8px_8px_0_0_#581c87] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#581c87] transition-all active:translate-y-2 uppercase w-full sm:w-auto"
                >
                    BEGIN NOW
                </button>
            </div>
        </div>
    );
};
