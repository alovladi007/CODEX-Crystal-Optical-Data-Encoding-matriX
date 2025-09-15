'use client';

import { motion } from 'framer-motion';
import { Shield, Eye, Download, Trash2 } from 'lucide-react';

export default function GDPRPage() {
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
            GDPR Compliance
          </h1>
          <p className="mt-6 text-xl text-dark-300 max-w-3xl mx-auto">
            Your data rights under the General Data Protection Regulation (GDPR).
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
            <h3 className="text-xl font-semibold text-white mb-3">Right to Access</h3>
            <p className="text-dark-300">Request a copy of all personal data we hold about you.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <Eye className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Right to Rectification</h3>
            <p className="text-dark-300">Correct any inaccurate or incomplete personal data.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <Download className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Right to Portability</h3>
            <p className="text-dark-300">Export your data in a machine-readable format.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <Trash2 className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Right to Erasure</h3>
            <p className="text-dark-300">Request deletion of your personal data under certain conditions.</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-dark-400 text-lg">
            To exercise your GDPR rights, contact us at privacy@codex-crystal-archive.com
          </p>
        </motion.div>
      </div>
    </section>
  );
}
