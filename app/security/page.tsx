'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react';

export default function SecurityPage() {
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
            Security
          </h1>
          <p className="mt-6 text-xl text-dark-300 max-w-3xl mx-auto">
            Learn about our comprehensive security measures and data protection practices.
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
            <h3 className="text-xl font-semibold text-white mb-3">Encryption</h3>
            <p className="text-dark-300">AES-256 encryption for data at rest and TLS 1.3 for data in transit.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <Lock className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Access Control</h3>
            <p className="text-dark-300">Multi-factor authentication and role-based access controls.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <Eye className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Monitoring</h3>
            <p className="text-dark-300">24/7 security monitoring and threat detection systems.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <CheckCircle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Compliance</h3>
            <p className="text-dark-300">SOC 2 Type II, ISO 27001, and GDPR compliance certifications.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
