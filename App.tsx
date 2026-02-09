import React from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { ChatWindow } from './components/ChatWindow';
import { GameControls } from './components/GameControls';
import { Header } from './components/Header';
import { StartScreen } from './components/StartScreen';
import { DifficultyScreen } from './components/DifficultyScreen';
import { ResultModal } from './components/ResultModal';
import { GamePhase } from './types';

function App() {
  const {
    gameState,
    isLoading,
    goToDifficultySelect,
    startGame,
    handleGuess,
    nextRound,
    setLanguage
  } = useGameEngine();


  if (gameState.phase === GamePhase.START) {
    return <StartScreen onStart={startGame} onLanguageChange={setLanguage} currentLanguage={gameState.language} />;
  }


  if (isLoading) {
    return (
      <div
        className="h-dvh w-full flex flex-col items-center justify-center bg-purple-100 font-pixel text-purple-900"
        data-language={gameState.language}
      >
        <div className="w-16 h-16 border-8 border-purple-400 border-t-purple-600 rounded-full animate-spin mb-6 shadow-lg"></div>
        <p className="animate-pulse tracking-[0.3em] text-[10px] uppercase">
          {gameState.language === 'ar' ? 'جاري إنشاء الموضوع...' : 'Generating Topic...'}
        </p>
      </div>
    );
  }


  return (
    <div
      className="h-dvh w-full flex flex-col bg-purple-200 overflow-hidden relative font-vt323"
      data-language={gameState.language}
      dir={gameState.language === 'ar' ? 'rtl' : 'ltr'}
    >

      <Header
        timeLeft={gameState.timeLeft}
        score={gameState.score}
        round={gameState.round}
        badges={gameState.badges}
        language={gameState.language}
      />

      <ChatWindow
        messages={gameState.messages}
        typingBotIds={gameState.isTyping}
        language={gameState.language}
      />

      <GameControls
        options={gameState.options}
        onGuess={handleGuess}
        disabled={gameState.phase === GamePhase.ROUND_OVER}
        language={gameState.language}
      />

      {gameState.phase === GamePhase.ROUND_OVER && (
        <ResultModal gameState={gameState} onNext={nextRound} />
      )}
    </div>
  );
}

export default App;