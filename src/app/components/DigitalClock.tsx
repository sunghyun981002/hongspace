'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type TimeFormat = '12h' | '24h';

export default function DigitalClock() {
  const [time, setTime] = useState<Date | null>(null);
  const [format, setFormat] = useState<TimeFormat>('24h');

  useEffect(() => {
    // 클라이언트 사이드에서만 초기 시간 설정
    setTime(new Date());
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date | null): string => {
    if (!date) return '--:--:--';
    
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: format === '12h',
    };
    
    return date.toLocaleTimeString('ko-KR', options);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '----/--/--';
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const toggleFormat = () => {
    setFormat(prev => prev === '12h' ? '24h' : '12h');
  };

  // 시간 문자열을 개별 문자로 분리
  const timeString = formatTime(time);
  const timeDigits = timeString.split('');

  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.3)] overflow-hidden relative">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />
      
      <div className="text-center relative">
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-sm mb-4 text-gray-400 font-medium"
        >
          {formatDate(time)}
        </motion.div>
        
        <div className="flex justify-center items-center mb-6 space-x-1">
          {timeDigits.map((digit, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: i * 0.05,
                type: "spring",
                stiffness: 300
              }}
              className={`font-sans text-5xl tabular-nums ${
                digit === ':' 
                  ? 'text-indigo-400 px-1 w-4' 
                  : /[0-9]/.test(digit)
                    ? 'bg-gray-700/60 text-cyan-300 w-12 inline-block rounded backdrop-blur-sm py-2 border border-gray-600/50' 
                    : 'text-gray-400 px-0.5'
              }`}
            >
              {digit}
            </motion.span>
          ))}
        </div>
        
        <motion.button 
          onClick={toggleFormat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-xs bg-indigo-600/80 hover:bg-indigo-500/80 rounded-full text-white transition-colors backdrop-blur-sm border border-indigo-500/30"
        >
          {format === '12h' ? '24시간제로 전환' : '12시간제로 전환'}
        </motion.button>
      </div>
    </div>
  );
} 