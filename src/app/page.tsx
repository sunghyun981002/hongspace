'use client';

import { motion } from 'framer-motion';
import DigitalClock from './components/DigitalClock';
import SeoulWeather from './components/SeoulWeather';
import TodoList from './components/TodoList';
import LanguageLearning from './components/LanguageLearning';

// 애니메이션 설정
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.section variants={itemVariants} className="backdrop-blur-sm bg-white/5 rounded-xl p-6 shadow-xl border border-white/10">
            <DigitalClock />
          </motion.section>
          <motion.section variants={itemVariants} className="backdrop-blur-sm bg-white/5 rounded-xl p-6 shadow-xl border border-white/10">
            <SeoulWeather />
          </motion.section>
        </div>
        <motion.section variants={itemVariants} className="backdrop-blur-sm bg-white/5 rounded-xl p-6 shadow-xl border border-white/10">
          <TodoList />
        </motion.section>
        <motion.section variants={itemVariants} className="w-full">
          <LanguageLearning />
        </motion.section>
      </div>
    </main>
  );
}
