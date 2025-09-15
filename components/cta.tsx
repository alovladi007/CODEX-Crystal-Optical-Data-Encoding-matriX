'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Play, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CTA() {
  const router = useRouter();

  return (
    <section className="section bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Ready to Get Started?</span>
            </motion.div>

            <h2 className="heading-2 mb-6">
              Preserve Your Data for <span className="text-gradient">Millennia</span>
            </h2>
            
            <p className="text-body text-lg max-w-2xl mx-auto">
              Join thousands of organizations already using CODEX Crystal Archive 
              to secure their most important data with revolutionary 5D optical storage technology.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              size="xl"
              className="btn-primary group"
              onClick={() => router.push('/demo')}
            >
              <Download className="w-5 h-5 mr-2" />
              Try Free Demo
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              size="xl"
              variant="outline"
              className="btn-secondary group"
              onClick={() => router.push('/docs')}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Tutorial
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-400/10 border border-green-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-400">1000+</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Years Durability</h3>
              <p className="text-dark-300 text-sm">Data preserved for millennia</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-400/10 border border-blue-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400">99.9999%</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Recovery Rate</h3>
              <p className="text-dark-300 text-sm">Even with 15% data loss</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-400/10 border border-purple-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-400">5D</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Optical Storage</h3>
              <p className="text-dark-300 text-sm">Revolutionary density</p>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Trusted by Industry Leaders</h3>
              <p className="text-dark-300">
                Join thousands of satisfied customers worldwide
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-1">10,000+</div>
                <div className="text-sm text-dark-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">99.8%</div>
                <div className="text-sm text-dark-400">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-dark-400">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-dark-400">Support</div>
              </div>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <p className="text-dark-300 mb-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="btn-primary"
                onClick={() => router.push('/get-started')}
              >
                Start Free Trial
              </Button>
              
              <Button
                size="lg"
                variant="ghost"
                className="text-blue-400 hover:text-blue-300"
                onClick={() => router.push('/contact')}
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
