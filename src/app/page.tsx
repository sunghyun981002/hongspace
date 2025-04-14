'use client';

import { motion } from 'framer-motion';
import DigitalClock from './components/DigitalClock';
import SeoulWeather from './components/SeoulWeather';
import TodoList from './components/TodoList';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 pt-6"
      >
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-400">
          Hong Space
        </h1>
        <p className="text-center text-gray-400 mt-2">디지털 대시보드</p>
      </motion.header>
      
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="flex flex-col gap-8">
          <motion.section variants={itemVariants} className="backdrop-blur-sm bg-white/5 rounded-xl p-2 shadow-xl border border-white/10">
            <DigitalClock />
          </motion.section>
          
          <motion.section variants={itemVariants} className="backdrop-blur-sm bg-white/5 rounded-xl p-2 shadow-xl border border-white/10">
            <SeoulWeather />
          </motion.section>
        </div>
        
        <motion.section 
          variants={itemVariants} 
          className="backdrop-blur-sm bg-white/5 rounded-xl p-2 shadow-xl border border-white/10 h-full"
        >
          <TodoList />
        </motion.section>
      </motion.main>
      
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-12 text-center text-gray-400 text-sm"
      >
        <p>&copy; {new Date().getFullYear()} Hong Space App</p>
      </motion.footer>
    </div>
  );
}
