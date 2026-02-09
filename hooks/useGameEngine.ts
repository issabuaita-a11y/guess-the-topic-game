import { useState, useEffect, useRef, useCallback } from 'react';
import { GamePhase, GameState, Topic, Message, Bot } from '../types';
import { TOPICS, BOTS, GENERIC_HINTS } from '../data';
import { generateBotBanter, generateNewTopic } from '../lib/ai';
import { playSound } from '../lib/sounds';


const ROUND_DURATION = 20; // Reduced to 20s for faster pace
const MIN_TYPING_DELAY = 500;
const MAX_TYPING_DELAY = 1500;
const MIN_MESSAGE_INTERVAL = 1000;
const MAX_MESSAGE_INTERVAL = 3000;

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.START,
    difficulty: 'easy',
    language: 'en',
    currentTopic: null,
    options: [],
    messages: [],
    score: 0,
    timeLeft: ROUND_DURATION,
    round: 1,
    isTyping: [],
    lastResult: null,
    badges: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [nextTopicData, setNextTopicData] = useState<{ topic: Topic, options: Topic[], difficulty: string } | null>(null);


  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Track played topics to ensure we cycle through all before repeating
  const playedTopicsRef = useRef<Set<string>>(new Set());
  const prefetchInProgressRef = useRef<boolean>(false);
  const lastBotIndexRef = useRef<number>(-1);
  const generatedHintsRef = useRef<string[]>([]);

  // Load persistence on mount
  useEffect(() => {
    const saved = localStorage.getItem('guess-the-topic-played');
    if (saved) {
      try {
        const topics = JSON.parse(saved);
        if (Array.isArray(topics)) {
          // Keep a sliding window of the last 100 topics
          const window = topics.slice(-100);
          playedTopicsRef.current = new Set(window);
        }
      } catch (e) {
        console.error("Failed to load played topics", e);
      }
    }
  }, []);

  const persistTopics = (topic: string) => {
    playedTopicsRef.current.add(topic);
    const topics = Array.from(playedTopicsRef.current).slice(-100);
    localStorage.setItem('guess-the-topic-played', JSON.stringify(topics));
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const getAiTopic = async (difficulty: string): Promise<{ topic: Topic, options: Topic[] } | null> => {
    // If we have a prefetched topic for this difficulty, use it
    if (nextTopicData && nextTopicData.difficulty === difficulty) {
      const { difficulty: _, ...topic } = nextTopicData;
      setNextTopicData(null);
      // Immediately trigger prefetch for NEXT one
      prefetchTopic(difficulty);
      return topic;
    }

    setIsLoading(true);
    const aiData = await generateNewTopic(difficulty, Array.from(playedTopicsRef.current), stateRef.current.language);
    setIsLoading(false);

    if (!aiData) return null;

    const correctTopic: Topic = { id: `ai-${Date.now()}`, label: aiData.label, hints: [] };
    persistTopics(aiData.label);

    const distractors = aiData.distractors.slice(0, 3);
    const options: Topic[] = [
      correctTopic,
      ...distractors.map((d, i) => ({ id: `dist-${i}-${Date.now()}`, label: d, hints: [] }))
    ].sort(() => 0.5 - Math.random());

    // Trigger prefetch for next one
    prefetchTopic(difficulty);

    return { topic: correctTopic, options };
  };

  const prefetchTopic = async (difficulty: string) => {
    if (prefetchInProgressRef.current) return;
    prefetchInProgressRef.current = true;

    try {
      const aiData = await generateNewTopic(difficulty, Array.from(playedTopicsRef.current), stateRef.current.language);
      if (aiData) {
        const correctTopic: Topic = { id: `ai-${Date.now()}`, label: aiData.label, hints: [] };
        const distractors = aiData.distractors.slice(0, 3);
        const options: Topic[] = [
          correctTopic,
          ...distractors.map((d, i) => ({ id: `dist-${i}-${Date.now()}`, label: d, hints: [] }))
        ].sort(() => 0.5 - Math.random());
        setNextTopicData({ topic: correctTopic, options, difficulty });
        persistTopics(aiData.label);
      }
    } catch (e) {
      console.error("Prefetch error", e);
    } finally {
      prefetchInProgressRef.current = false;
    }
  };



  // Bot Logic Functions
  const triggerBotTyping = async (isFirstMessage = false) => {
    if (stateRef.current.phase !== GamePhase.PLAYING) return;

    // Pick bots in sequence
    const nextBotIndex = (lastBotIndexRef.current + 1) % BOTS.length;
    lastBotIndexRef.current = nextBotIndex;
    const bot = BOTS[nextBotIndex];

    const topic = stateRef.current.currentTopic;

    if (!topic) return;

    setGameState(prev => ({
      ...prev,
      isTyping: [...prev.isTyping, bot.id]
    }));

    // Start fetching AI banter immediately
    const previousMessages = stateRef.current.messages
      .slice(-5)
      .map(m => {
        const b = BOTS.find(bot => bot.id === m.botId);
        return `${b?.name}: ${m.text}`;
      });

    // We start the AI call but also have a minimum typing time
    const aiCall = generateBotBanter(
      topic.label,
      bot.name,
      bot.style,
      previousMessages,
      stateRef.current.difficulty,
      stateRef.current.language
    );

    const typingDuration = isFirstMessage
      ? 1000 // Fast start for first message
      : Math.random() * (MAX_TYPING_DELAY - MIN_TYPING_DELAY) + MIN_TYPING_DELAY;

    const startTime = Date.now();

    // Weighted logic for repeating vs new hints
    // Reduced chance to repeat if we have enough hints
    let textToShow = "";
    const existingHints = generatedHintsRef.current;

    // 20% chance to repeat (was 40%), and only if we have at least 3 hints
    if (existingHints.length >= 3 && Math.random() < 0.2) {
      textToShow = existingHints[Math.floor(Math.random() * existingHints.length)];
    } else {
      const aiText = await aiCall;
      if (aiText) {
        textToShow = aiText;
        if (!generatedHintsRef.current.includes(aiText)) {
          generatedHintsRef.current.push(aiText);
        }
      } else {
        const topicHints = topic.hints || [];
        textToShow = topicHints.length > 0
          ? topicHints[Math.floor(Math.random() * topicHints.length)]
          : GENERIC_HINTS[Math.floor(Math.random() * GENERIC_HINTS.length)];

        if (!generatedHintsRef.current.includes(textToShow)) {
          generatedHintsRef.current.push(textToShow);
        }
      }
    }

    const elapsedTime = Date.now() - startTime;
    const remainingTypingTime = Math.max(0, typingDuration - elapsedTime);

    const timeoutId = setTimeout(() => {
      if (stateRef.current.phase !== GamePhase.PLAYING) return;


      const newMessage: Message = {
        id: Date.now().toString(),
        botId: bot.id,
        text: textToShow,
        timestamp: Date.now(),
      };

      playSound('blip');

      setGameState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        isTyping: prev.isTyping.filter(id => id !== bot.id)
      }));

      scheduleNextMessage();
    }, remainingTypingTime);

    timeoutsRef.current.push(timeoutId);
  };

  const scheduleNextMessage = () => {
    if (stateRef.current.phase !== GamePhase.PLAYING) return;

    const interval = Math.random() * (MAX_MESSAGE_INTERVAL - MIN_MESSAGE_INTERVAL) + MIN_MESSAGE_INTERVAL;

    const timeoutId = setTimeout(() => {
      triggerBotTyping();
    }, interval);

    timeoutsRef.current.push(timeoutId);
  };

  const startRound = useCallback(async (currentTopic?: Topic) => {
    clearAllTimeouts();
    generatedHintsRef.current = [];
    lastBotIndexRef.current = -1;

    // Determine difficulty based on round
    // 1-5: Easy
    // 6-13: Medium
    // 14+: Hard
    let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
    if (stateRef.current.round >= 14) difficulty = 'hard';
    else if (stateRef.current.round >= 6) difficulty = 'medium';

    setGameState(prev => ({ ...prev, difficulty }));

    // Try to get AI topic first
    const aiResult = await getAiTopic(difficulty);

    let newTopic: Topic;
    let options: Topic[];

    if (aiResult) {
      newTopic = aiResult.topic;
      options = aiResult.options;
    } else {
      // Fallback to static topics
      const availableTopics = TOPICS.filter(t => !playedTopicsRef.current.has(t.label));
      const source = availableTopics.length > 0 ? availableTopics : TOPICS;
      newTopic = source[Math.floor(Math.random() * source.length)];
      persistTopics(newTopic.label);

      const others = TOPICS.filter(t => t.id !== newTopic.id);
      options = [...others.sort(() => 0.5 - Math.random()).slice(0, 3), newTopic].sort(() => 0.5 - Math.random());
    }

    setGameState(prev => ({
      ...prev,
      phase: GamePhase.PLAYING,
      currentTopic: newTopic,
      options,
      messages: [],
      timeLeft: ROUND_DURATION,
      isTyping: [],
      lastResult: null,
    }));
  }, []);


  const nextRound = useCallback(() => {
    const currentTopic = stateRef.current.currentTopic || undefined;

    // Check for next round difficulty pre-fetch
    const nextRoundNum = stateRef.current.round + 1;
    let nextDiff = 'easy';
    if (nextRoundNum >= 14) nextDiff = 'hard';
    else if (nextRoundNum >= 6) nextDiff = 'medium';

    // Trigger prefetch for the UPCOMING round's difficulty
    prefetchTopic(nextDiff);

    setGameState(prev => ({
      ...prev,
      round: prev.round + 1
    }));

    startRound(currentTopic);
  }, [startRound]);

  const setLanguage = useCallback((language: 'en' | 'ar') => {
    setGameState(prev => ({ ...prev, language }));
  }, []);

  const goToDifficultySelect = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: GamePhase.DIFFICULTY_SELECT
    }));
  }, []);

  const startGame = useCallback(() => {
    // DO NOT CLEAR history on new game anymore, let it persist
    setNextTopicData(null);
    prefetchInProgressRef.current = false;
    lastBotIndexRef.current = -1;

    setGameState(prev => ({
      ...prev,
      phase: GamePhase.PLAYING,
      difficulty: 'easy',
      currentTopic: null,
      options: [],
      messages: [],
      score: 0,
      timeLeft: ROUND_DURATION,
      round: 1,
      isTyping: [],
      lastResult: null,
      badges: [],
    }));

    // Use a small timeout to ensure state update before calling startRound
    setTimeout(() => {
      startRound();
    }, 0);
  }, [startRound]);




  const handleGuess = (topicId: string) => {
    if (gameState.phase !== GamePhase.PLAYING) return;

    const isCorrect = topicId === gameState.currentTopic?.id;

    if (isCorrect) {
      playSound('success');
      setGameState(prev => {
        const newScore = prev.score + Math.ceil(prev.timeLeft * 10);

        // Check for badges
        const newBadges = [...prev.badges];
        if (prev.round === 5 && !newBadges.includes('DETECTIVE_NOVICE')) {
          newBadges.push('DETECTIVE_NOVICE');
        }
        if (prev.round === 13 && !newBadges.includes('DETECTIVE_PRO')) {
          newBadges.push('DETECTIVE_PRO');
        }
        if (prev.round === 20 && !newBadges.includes('DETECTIVE_MASTER')) {
          newBadges.push('DETECTIVE_MASTER');
        }

        return {
          ...prev,
          phase: GamePhase.ROUND_OVER,
          score: newScore,
          lastResult: 'win',
          badges: newBadges
        };
      });
    } else {
      playSound('error');
      setGameState(prev => ({
        ...prev,
        phase: GamePhase.ROUND_OVER,
        lastResult: 'loss'
      }));
    }

  };

  useEffect(() => {
    if (gameState.phase === GamePhase.PLAYING && gameState.currentTopic) {
      // If messages are empty, trigger immediately
      if (gameState.messages.length === 0) {
        triggerBotTyping(true);
      } else {
        scheduleNextMessage();
      }
    } else if (gameState.phase === GamePhase.START) {
      // Pre-warm AI with an easy topic prefetch
      prefetchTopic('easy');
    } else {
      clearAllTimeouts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.phase, gameState.currentTopic]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameState.phase === GamePhase.PLAYING) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            return {
              ...prev,
              phase: GamePhase.ROUND_OVER,
              timeLeft: 0,
              lastResult: 'timeout'
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.phase]);

  return {
    gameState,
    isLoading,
    goToDifficultySelect,
    setLanguage,
    startGame,
    handleGuess,
    nextRound
  };
};