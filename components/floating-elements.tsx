'use client';

import { motion } from 'framer-motion';
import { Sparkles, Shield, Zap, Database } from 'lucide-react';

const floatingElements = [
  {
    icon: Sparkles,
    position: { top: '20%', left: '10%' },
    delay: 0,
    duration: 6,
  },
  {
    icon: Shield,
    position: { top: '30%', right: '15%' },
    delay: 1,
    duration: 8,
  },
  {
    icon: Zap,
    position: { top: '60%', left: '5%' },
    delay: 2,
    duration: 7,
  },
  {
    icon: Database,
    position: { top: '70%', right: '10%' },
    delay: 3,
    duration: 9,
  },
];

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={element.position}
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: 'easeInOut',
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center">
            <element.icon className="w-6 h-6 text-blue-400" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
