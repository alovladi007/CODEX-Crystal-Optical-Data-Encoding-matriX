'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Download, Sparkles, Shield, Zap } from 'lucide-react';
import { Typewriter } from '@/components/typewriter';
import { Crystal3D } from '@/components/crystal-3d';
import { useRouter } from 'next/navigation';

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
      
      {/* Real Crystal Background with Effects */}
      <div className="absolute inset-0 opacity-60">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/hero/real-crystal-bg.jpg)',
            backgroundSize: 'cover',
            filter: 'hue-rotate(30deg) saturate(1.2) contrast(1.1) brightness(0.8)'
          }}
        />
        {/* Crystal enhancement overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/30 via-purple-500/20 to-transparent" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_rgba(59,130,246,0.15)_60deg,_transparent_120deg,_rgba(139,92,246,0.15)_180deg,_transparent_240deg,_rgba(14,165,233,0.15)_300deg,_transparent_360deg)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(59,130,246,0.1)_0%,_transparent_25%,_rgba(139,92,246,0.1)_50%,_transparent_75%,_rgba(14,165,233,0.1)_100%)]" />
        {/* Crystal refraction effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.1)_0%,_transparent_50%)] animate-crystal-refract" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(59,130,246,0.1)_0%,_transparent_50%)] animate-crystal-refract" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Floating Crystal Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-md animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-green-400/20 to-cyan-600/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Content */}
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="outline" className="text-blue-400 border-blue-400/50 bg-blue-400/10">
                <Sparkles className="w-4 h-4 mr-2" />
                Revolutionary 5D Optical Storage
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="heading-1"
            >
              Preserve Data for{' '}
              <span className="text-gradient">
                <Typewriter
                  words={['Millennia', 'Eternity', 'Forever', 'Generations']}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={100}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-body max-w-2xl"
            >
              CODEX Crystal Archive uses revolutionary 5D optical crystal storage technology 
              to preserve your most important data for thousands of years with advanced 
              error correction and self-describing archives.
            </motion.p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-dark-300">99.9999% Recovery</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-dark-300">5D Optical Encoding</span>
              </div>
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-dark-300">Self-Describing</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="btn-primary group"
                onClick={() => router.push('/demo')}
              >
                Try Live Demo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="btn-secondary group"
                onClick={() => router.push('/docs')}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Download Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center space-x-2 text-sm text-dark-400"
            >
              <Download className="w-4 h-4" />
              <span>Download CLI Tool</span>
              <span className="text-blue-400">v1.0.0</span>
            </motion.div>
          </motion.div>

          {/* Right Column - 3D Crystal */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-96 lg:h-[500px]">
              <Crystal3D />
              
              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute top-4 right-4 glass rounded-lg p-4 space-y-2"
              >
                <div className="text-xs text-dark-400">Data Density</div>
                <div className="text-2xl font-bold text-blue-400">5D</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute bottom-4 left-4 glass rounded-lg p-4 space-y-2"
              >
                <div className="text-xs text-dark-400">Durability</div>
                <div className="text-2xl font-bold text-green-400">1000+</div>
                <div className="text-xs text-dark-400">years</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute top-1/2 -left-4 glass rounded-lg p-4 space-y-2"
              >
                <div className="text-xs text-dark-400">Error Rate</div>
                <div className="text-2xl font-bold text-purple-400">0.0001%</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
