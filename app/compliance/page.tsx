'use client';

import { motion } from 'framer-motion';
import { Award, CheckCircle, FileCheck, Globe } from 'lucide-react';

export default function CompliancePage() {
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
            Compliance
          </h1>
          <p className="mt-6 text-xl text-dark-300 max-w-3xl mx-auto">
            CODEX Crystal Archive meets the highest industry standards and regulatory requirements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <Award className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">SOC 2 Type II</h3>
            <p className="text-dark-300">Audited security, availability, and confidentiality controls.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">ISO 27001</h3>
            <p className="text-dark-300">International standard for information security management.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <FileCheck className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">GDPR</h3>
            <p className="text-dark-300">Full compliance with European data protection regulations.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700"
          >
            <Globe className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">OAIS</h3>
            <p className="text-dark-300">Open Archival Information System standard compliance.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
