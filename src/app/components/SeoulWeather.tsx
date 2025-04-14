'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type WeatherData = {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  dt: number;
  name: string;
  wind: {
    speed: number;
  };
};

// 날씨 아이콘 매핑
const weatherIcons: Record<string, string> = {
  "01d": "☀️", // 맑음 (낮)
  "01n": "🌙", // 맑음 (밤)
  "02d": "⛅", // 구름 조금 (낮)
  "02n": "☁️", // 구름 조금 (밤)
  "03d": "☁️", // 구름 많음
  "03n": "☁️",
  "04d": "☁️", // 흐림
  "04n": "☁️",
  "09d": "🌧️", // 소나기
  "09n": "🌧️",
  "10d": "🌦️", // 비 (낮)
  "10n": "🌧️", // 비 (밤)
  "11d": "⛈️", // 천둥번개
  "11n": "⛈️",
  "13d": "❄️", // 눈
  "13n": "❄️",
  "50d": "🌫️", // 안개
  "50n": "🌫️"
};

export default function SeoulWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // .env.local 파일에서 API 키 가져오기
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        // API 키가 설정되지 않은 경우 에러 처리
        if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
          throw new Error('API 키가 설정되지 않았습니다');
        }
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Seoul&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Weather data could not be fetched');
        }
        
        const data = await response.json();
        setWeather(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message === 'API 키가 설정되지 않았습니다' 
            ? '.env.local 파일에 NEXT_PUBLIC_OPENWEATHER_API_KEY를 설정해주세요' 
            : '날씨 정보를 가져오는데 실패했습니다. API 키를 확인해주세요.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
    
    // Refresh weather data every hour
    const interval = setInterval(fetchWeather, 3600000);
    
    return () => clearInterval(interval);
  }, [API_KEY]);
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-800/20 to-blue-900/40 rounded-xl shadow-lg flex justify-center items-center h-48">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-10 h-10 border-t-2 border-l-2 border-blue-400 rounded-full"
        />
      </div>
    );
  }
  
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-red-900/20 rounded-xl text-red-300 shadow-lg"
      >
        <p className="text-center">{error}</p>
      </motion.div>
    );
  }
  
  if (!weather) {
    return null;
  }
  
  const weatherIcon = weather.weather[0].icon;
  const emoji = weatherIcons[weatherIcon] || '🌍';
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gradient-to-br from-blue-800/20 to-blue-900/40 rounded-xl shadow-lg text-white"
    >
      <div className="flex flex-col md:flex-row items-center md:justify-between">
        <div>
          <motion.div 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="flex items-center"
          >
            <h2 className="text-2xl font-bold">{weather.name}</h2>
            <span className="text-sm bg-blue-600/40 px-2 py-0.5 rounded-full ml-2 backdrop-blur-sm">현재</span>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-baseline mt-3"
          >
            <span className="text-4xl font-bold">{Math.round(weather.main.temp)}</span>
            <span className="text-2xl">°C</span>
            <span className="text-sm text-gray-300 ml-2">
              체감: {Math.round(weather.main.feels_like)}°C
            </span>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-gray-300 flex items-center"
          >
            <span className="mr-1">{weather.weather[0].description}</span>
            <span className="text-2xl ml-1">{emoji}</span>
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 md:mt-0 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10"
        >
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-gray-400">습도</span>
              <span className="font-semibold">{weather.main.humidity}%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-400">풍속</span>
              <span className="font-semibold">{weather.wind.speed} m/s</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 text-xs text-gray-400 flex justify-between items-center"
      >
        <span>갱신: {formatTime(weather.dt)}</span>
        <span className="text-blue-300">OpenWeatherMap</span>
      </motion.div>
    </motion.div>
  );
} 