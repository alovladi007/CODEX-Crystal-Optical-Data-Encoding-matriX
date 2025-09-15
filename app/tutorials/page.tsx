'use client';

import { motion } from 'framer-motion';
import { BookOpen, Play, Download, Code } from 'lucide-react';

export default function TutorialsPage() {
  return (
    <section className="relative py-24 lg:py-32 bg-dark-900 text-white min-h-screen">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-4">
            Tutorials
          </h1>
          <p className="mt-6 text-xl text-dark-300 max-w-3xl mx-auto">
            Learn how to use CODEX Crystal Archive with step-by-step tutorials and guides.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700 hover:border-blue-500 transition-colors"
          >
            <BookOpen className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Getting Started</h3>
            <p className="text-dark-300 mb-4">Learn the basics of CODEX Crystal Archive and create your first archive.</p>
            <div className="text-sm text-blue-400">Coming Soon</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700 hover:border-green-500 transition-colors"
          >
            <Play className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Video Guides</h3>
            <p className="text-dark-300 mb-4">Watch video tutorials covering advanced features and best practices.</p>
            <div className="text-sm text-green-400">Coming Soon</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700 hover:border-purple-500 transition-colors"
          >
            <Code className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">API Integration</h3>
            <p className="text-dark-300 mb-4">Learn how to integrate CODEX into your applications using our REST API.</p>
            <div className="text-sm text-purple-400">Coming Soon</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
