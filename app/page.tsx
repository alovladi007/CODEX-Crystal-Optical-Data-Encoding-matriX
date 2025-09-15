'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '@/components/hero';
import { Features } from '@/components/features';
import { HowItWorks } from '@/components/how-it-works';
import { Technology } from '@/components/technology';
import { Team } from '@/components/team';
import { Pricing } from '@/components/pricing';
import { Testimonials } from '@/components/testimonials';
import { Stats } from '@/components/stats';
import { CTA } from '@/components/cta';
import { ParticleBackground } from '@/components/particle-background';
import { FloatingElements } from '@/components/floating-elements';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <ParticleBackground />
      </div>
      <FloatingElements />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Technology />
        <Team />
        <Testimonials />
        <Pricing />
        <CTA />
      </motion.div>
    </div>
  );
}
