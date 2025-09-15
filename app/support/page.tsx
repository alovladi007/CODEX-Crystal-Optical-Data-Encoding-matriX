'use client';

import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, Mail, Phone } from 'lucide-react';

export default function SupportPage() {
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
            Support
          </h1>
          <p className="mt-6 text-xl text-dark-300 max-w-3xl mx-auto">
            Get help with CODEX Crystal Archive. We're here to assist you with any questions or issues.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700 hover:border-blue-500 transition-colors"
          >
            <HelpCircle className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">FAQ</h3>
            <p className="text-dark-300 mb-4">Find answers to frequently asked questions about CODEX Crystal Archive.</p>
            <div className="text-sm text-blue-400">View FAQ</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700 hover:border-green-500 transition-colors"
          >
            <MessageSquare className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Live Chat</h3>
            <p className="text-dark-300 mb-4">Chat with our support team in real-time for immediate assistance.</p>
            <div className="text-sm text-green-400">Start Chat</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700 hover:border-purple-500 transition-colors"
          >
            <Mail className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Email Support</h3>
            <p className="text-dark-300 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
            <div className="text-sm text-purple-400">support@codex-crystal-archive.com</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark-800 p-8 rounded-xl border border-dark-700 hover:border-red-500 transition-colors"
          >
            <Phone className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Phone Support</h3>
            <p className="text-dark-300 mb-4">Call us for urgent issues or complex technical problems.</p>
            <div className="text-sm text-red-400">+1 (555) 123-4567</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
