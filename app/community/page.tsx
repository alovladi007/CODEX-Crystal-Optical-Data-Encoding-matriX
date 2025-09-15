'use client';

import { motion } from 'framer-motion';
import { Users, MessageCircle, Github, Twitter } from 'lucide-react';

export default function CommunityPage() {
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
            Community
          </h1>
          <p className="mt-6 text-xl text-dark-300 max-w-3xl mx-auto">
            Join our community of developers, researchers, and data preservation enthusiasts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700 hover:border-blue-500 transition-colors"
          >
            <Users className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Discord</h3>
            <p className="text-dark-300 mb-4">Join our Discord server for real-time discussions and support.</p>
            <div className="text-sm text-blue-400">Join Discord</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700 hover:border-green-500 transition-colors"
          >
            <MessageCircle className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Forum</h3>
            <p className="text-dark-300 mb-4">Participate in discussions and share your experiences.</p>
            <div className="text-sm text-green-400">Visit Forum</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700 hover:border-purple-500 transition-colors"
          >
            <Github className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">GitHub</h3>
            <p className="text-dark-300 mb-4">Contribute to open source projects and report issues.</p>
            <div className="text-sm text-purple-400">View on GitHub</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700 hover:border-red-500 transition-colors"
          >
            <Twitter className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Twitter</h3>
            <p className="text-dark-300 mb-4">Follow us for updates, news, and community highlights.</p>
            <div className="text-sm text-red-400">Follow @codexcrystal</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
