import React, { useEffect, useRef } from 'react';
import { Message, Bot } from '../types';
import { BOTS } from '../data';

interface ChatWindowProps {
  messages: Message[];
  typingBotIds: string[];
}

// --- PFP Style Character Assets (Based on Image 2, but fit for isometric room) ---
const BotAvatar: React.FC<{ botId: string; isTyping: boolean; direction: 'left' | 'right'; scale?: number }> = ({ botId, isTyping, direction, scale = 1 }) => {
  const scaleX = (direction === 'left' ? 1 : -1) * scale;
  const spritePath = `/assets/bot${botId.replace('b', '')}_full.png`;
  const imgRef = useRef<HTMLImageElement>(null);

  const removeBackground = () => {
    const img = imgRef.current;
    if (!img) return;

    // Create a temporary canvas to process the image
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Iterate through pixels and make "white" pixels transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Target pure white (AI generated background)
      if (r > 245 && g > 245 && b > 245) {
        data[i + 3] = 0; // Set alpha to 0
      }
    }

    ctx.putImageData(imageData, 0, 0);
    img.src = canvas.toDataURL();
    img.classList.remove('opacity-0');
  };

  return (
    <div className={`relative transition-all duration-300 ${isTyping ? 'animate-bounce' : 'hover:-translate-y-1'}`} style={{ transform: `scaleX(${scaleX}) scaleY(${scale})` }}>
      <img
        ref={imgRef}
        src={spritePath}
        alt={botId}
        onLoad={removeBackground}
        crossOrigin="anonymous"
        className="w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain pixelated drop-shadow-2xl opacity-0 transition-opacity duration-300"
      />
    </div>
  );
};

const SpeechBubble: React.FC<{ text: string; language: 'en' | 'ar' }> = ({ text, language }) => {
  const isAr = language === 'ar';
  return (
    <div className="absolute bottom-[110%] left-1/2 transform -translate-x-1/2 w-32 sm:w-48 md:w-64 z-50 animate-in zoom-in slide-in-from-bottom-2 duration-300" dir={isAr ? 'rtl' : 'ltr'}>
      <div className={`bg-white border-2 sm:border-4 border-purple-900 p-2 sm:p-3 text-purple-900 shadow-xl relative rounded-lg sm:rounded-xl leading-tight ${isAr ? 'font-sans font-bold text-xs sm:text-sm' : 'font-pixel text-[9px] sm:text-[11px]'}`}>
        {text}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 
          border-l-[10px] border-l-transparent
          border-r-[10px] border-r-transparent
          border-t-[10px] border-t-purple-900">
        </div>
        <div className="absolute -bottom-[7px] left-1/2 transform -translate-x-1/2 w-0 h-0 
          border-l-[8px] border-l-transparent
          border-r-[8px] border-r-transparent
          border-t-[8px] border-t-white">
        </div>
      </div>
    </div>
  );
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, typingBotIds, language }) => {
  const isAr = language === 'ar';
  const getLatestMessage = (botId: string) => {
    return [...messages].reverse().find(m => m.botId === botId);
  };

  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  const BOT_CONFIGS = [
    { id: 'b1', top: '48%', left: '22%', direction: 'right', scale: 1 }, // Moved closer to the desk (left)
    { id: 'b2', top: '52%', left: '72%', direction: 'left', scale: 1 },  // Moved further right
  ] as const;

  return (
    <div className="flex-1 relative bg-purple-200 overflow-hidden flex flex-col md:flex-row">
      <div className="flex-1 relative order-1 md:order-2 overflow-hidden flex items-center justify-center">
        {/* Main Game Room Area */}
        <div className="relative w-full h-full max-w-4xl aspect-square md:aspect-video flex items-center justify-center p-4">
          <div className="relative w-full h-full border-8 border-purple-900 shadow-2xl rounded-lg overflow-hidden bg-purple-300">
            {/* Background Image */}
            <img
              src="/assets/living_room.png"
              alt="Living Room"
              className="absolute inset-0 w-full h-full object-cover pixelated"
            />

            {/* Bots Overlay */}
            <div className="absolute inset-0 z-10">
              {BOTS.map((bot, idx) => {
                const config = BOT_CONFIGS[idx];
                const latestMsg = getLatestMessage(bot.id);
                const showBubble = latestMsg && (Date.now() - latestMsg.timestamp < 7000);
                const isTyping = typingBotIds.includes(bot.id);

                return (
                  <div key={bot.id} className="absolute z-20 flex flex-col items-center transition-all duration-700" style={{ top: config.top, left: config.left }}>
                    {showBubble && <SpeechBubble text={latestMsg.text} language={language} />}
                    {isTyping && !showBubble && (
                      <div className={`absolute bottom-[105%] animate-pulse text-purple-900 bg-white px-2 py-1 rounded border-2 border-purple-900 mb-2 whitespace-nowrap ${isAr ? 'font-sans font-bold text-xs' : 'font-pixel text-[10px]'}`}>
                        {isAr ? 'يكتب...' : 'typing...'}
                      </div>
                    )}
                    <BotAvatar
                      botId={bot.id}
                      isTyping={isTyping}
                      direction={config.direction}
                      scale={config.scale}
                    />
                    <div className="bg-purple-900/80 text-white text-[9px] px-2 py-0.5 rounded-full mt-1 font-pixel shadow-sm border border-white/20">
                      {bot.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Log Sidebar (Moved to Left on Desktop) */}
      <div className="h-[25%] sm:h-[35%] md:h-full md:w-80 bg-white border-t-4 sm:border-t-8 md:border-t-0 md:border-r-8 border-purple-300 p-2 sm:p-4 font-mono text-purple-900 overflow-hidden flex flex-col order-2 md:order-1 relative z-40" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="border-b-2 sm:border-b-4 border-purple-100 pb-1 sm:pb-2 mb-1 sm:mb-2 flex justify-between items-center">
          <span className="font-pixel text-[8px] sm:text-[10px] text-purple-600">CHAT_LOG</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <div ref={logRef} className="flex-1 overflow-y-auto pixel-scrollbar space-y-2 sm:space-y-3 pr-1">
          {messages.length === 0 && <span className="opacity-30 italic text-xs">{isAr ? 'بانتظار البوتات...' : 'Waiting for bots...'}</span>}
          {messages.map((msg) => {
            const bot = BOTS.find(b => b.id === msg.botId);
            return (
              <div key={msg.id} className="leading-tight bg-purple-50 p-2 rounded border-2 border-purple-100 animate-in slide-in-from-right-2 duration-300">
                <span style={{ color: bot?.avatarColor }} className="font-pixel text-[8px] uppercase block mb-1">{bot?.name}</span>
                <span className={`text-gray-700 leading-normal ${isAr ? 'font-sans font-bold text-sm' : 'text-sm font-mono'}`}>{msg.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};