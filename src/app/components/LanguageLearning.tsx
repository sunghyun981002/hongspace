'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaVolumeUp } from 'react-icons/fa';

type Sentence = {
  english: string;
  korean: string;
};

export default function LanguageLearning() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<{[key: string]: boolean}>({});

  const generateSentence = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-sentence', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '문장 생성 중 오류가 발생했습니다.');
      }

      setSentences(prev => [...prev, data]);
    } catch (err) {
      console.error('Error generating sentence:', err);
      setError('문장 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const playTTS = async (text: string, language: 'en' | 'ko', index: number) => {
    if (isPlaying[`${index}-${language}`]) return;

    try {
      setIsPlaying(prev => ({ ...prev, [`${index}-${language}`]: true }));

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'TTS 생성 중 오류가 발생했습니다.');
      }

      // Create audio element and play
      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      audio.onended = () => {
        setIsPlaying(prev => ({ ...prev, [`${index}-${language}`]: false }));
      };
      await audio.play();
    } catch (err) {
      console.error('TTS Error:', err);
      setIsPlaying(prev => ({ ...prev, [`${index}-${language}`]: false }));
    }
  };

  return (
    <div className="w-full backdrop-blur-sm bg-white/5 rounded-xl p-6 shadow-xl border border-white/10">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-2xl font-bold text-white/90 mb-4">오늘의 영어 문장</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateSentence}
          disabled={isLoading}
          className={`px-6 py-2.5 bg-indigo-600/80 text-white rounded-lg
            transition-all duration-200 hover:bg-indigo-500/80
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-lg hover:shadow-indigo-500/25 text-sm font-medium`}
        >
          {isLoading ? '생성 중...' : '새로운 문장 생성'}
        </motion.button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-center mb-4 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.div layout className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        {sentences.map((sentence, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-white/5 hover:border-indigo-500/20 transition-colors"
          >
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-indigo-300 text-xs font-medium">English</span>
                <button
                  onClick={() => playTTS(sentence.english, 'en', index)}
                  disabled={isPlaying[`${index}-en`]}
                  className={`p-1.5 rounded-full hover:bg-white/10 transition-colors
                    ${isPlaying[`${index}-en`] ? 'text-indigo-400' : 'text-white/60'}`}
                >
                  <FaVolumeUp size={16} />
                </button>
              </div>
              <p className="text-white/90 text-base">{sentence.english}</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-indigo-300 text-xs font-medium">Korean</span>
                <button
                  onClick={() => playTTS(sentence.korean, 'ko', index)}
                  disabled={isPlaying[`${index}-ko`]}
                  className={`p-1.5 rounded-full hover:bg-white/10 transition-colors
                    ${isPlaying[`${index}-ko`] ? 'text-indigo-400' : 'text-white/60'}`}
                >
                  <FaVolumeUp size={16} />
                </button>
              </div>
              <p className="text-white/90 text-base">{sentence.korean}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
} 