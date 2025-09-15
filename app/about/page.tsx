'use client';

import { motion } from 'framer-motion';
import { Users, Award, Target, Heart } from 'lucide-react';

export default function AboutPage() {
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
            About CODEX Crystal Archive
          </h1>
          <p className="mt-6 text-xl text-dark-300 max-w-3xl mx-auto">
            We're revolutionizing data preservation with cutting-edge 5D optical storage technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center p-6 bg-dark-800 rounded-xl border border-dark-700"
          >
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Our Mission</h3>
            <p className="text-dark-300">Preserve humanity's most important data for millennia using revolutionary 5D optical storage.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center p-6 bg-dark-800 rounded-xl border border-dark-700"
          >
            <Award className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Innovation</h3>
            <p className="text-dark-300">Leading the industry with breakthrough 5D optical encoding and advanced error correction.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center p-6 bg-dark-800 rounded-xl border border-dark-700"
          >
            <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Reliability</h3>
            <p className="text-dark-300">99.9999% data recovery rate with 1000+ year durability guarantee.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center p-6 bg-dark-800 rounded-xl border border-dark-700"
          >
            <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Future-Proof</h3>
            <p className="text-dark-300">Self-describing archives ensure compatibility with future technologies.</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-dark-400 text-lg">
            Learn more about our technology and mission.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
