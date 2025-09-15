'use client';

import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database } from 'lucide-react';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-6 text-xl text-dark-300 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <Shield className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Data Protection</h3>
            <p className="text-dark-300">We use military-grade encryption to protect your data at rest and in transit.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <Eye className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Transparency</h3>
            <p className="text-dark-300">We're transparent about what data we collect and how we use it.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <Lock className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Access Control</h3>
            <p className="text-dark-300">You have full control over your data and can delete it at any time.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <Database className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">No Tracking</h3>
            <p className="text-dark-300">We don't track your browsing behavior or sell your data to third parties.</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-dark-400 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
