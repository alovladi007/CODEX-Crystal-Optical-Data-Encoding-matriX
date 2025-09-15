'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Clock, 
  Database, 
  Lock, 
  Sparkles,
  Globe,
  Cpu,
  FileText,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Ultra-Durable Storage',
    description: 'Data preserved for millennia with advanced error correction and damage resistance.',
    stats: '1000+ years',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20'
  },
  {
    icon: Zap,
    title: '5D Optical Encoding',
    description: 'Revolutionary 5-dimensional data storage using orientation and retardance properties.',
    stats: '5D density',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20'
  },
  {
    icon: Clock,
    title: 'Real-time Processing',
    description: 'Fast encoding and decoding with optimized algorithms for immediate data access.',
    stats: '< 1 second',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20'
  },
  {
    icon: Database,
    title: 'Massive Capacity',
    description: 'Store petabytes of data in compact crystal format with efficient compression.',
    stats: 'PB scale',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20'
  },
  {
    icon: Lock,
    title: 'Military-Grade Security',
    description: 'Advanced encryption and integrity verification for maximum data protection.',
    stats: 'AES-256',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20'
  },
  {
    icon: Sparkles,
    title: 'Self-Describing',
    description: 'Complete decoding instructions embedded in every archive for future compatibility.',
    stats: '100% portable',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-400/20'
  }
];

const additionalFeatures = [
  'Multi-layer error correction (LDPC + Reed-Solomon)',
  'Gray coding for minimal error propagation',
  'Interleaving across multiple planes',
  'Merkle tree integrity verification',
  'Ed25519 digital signatures',
  'OAIS-compliant manifest system',
  'Damage simulation and testing',
  'Cross-platform compatibility',
  'RESTful API integration',
  'Real-time monitoring dashboard'
];

export function Features() {
  return (
    <section id="features" className="section relative overflow-hidden">
      {/* Data Visualization Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_transparent_0%,_rgba(14,165,233,0.05)_25%,_transparent_50%,_rgba(59,130,246,0.05)_75%,_transparent_100%)]" />
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(59,130,246,0.1)_1px,_transparent_1px),_linear-gradient(rgba(59,130,246,0.1)_1px,_transparent_1px)] bg-[length:50px_50px]" />
      </div>
      
      {/* Floating Data Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-1/4 w-20 h-20 bg-gradient-to-br from-cyan-400/15 to-blue-600/15 rounded-full blur-lg animate-float" />
        <div className="absolute top-32 right-1/3 w-14 h-14 bg-gradient-to-br from-blue-400/15 to-purple-600/15 rounded-full blur-md animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-24 left-1/5 w-18 h-18 bg-gradient-to-br from-green-400/15 to-cyan-600/15 rounded-full blur-lg animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-16 right-1/4 w-12 h-12 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full blur-sm animate-float" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-2">
            Revolutionary <span className="text-gradient">Features</span>
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            CODEX Crystal Archive combines cutting-edge 5D optical technology with 
            advanced error correction to create the most durable data storage system ever built.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`card hover-lift group ${feature.borderColor}`}
            >
              <div className={`w-12 h-12 ${feature.bgColor} ${feature.borderColor} border rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              
              <h3 className="heading-3 mb-3">{feature.title}</h3>
              <p className="text-body mb-4">{feature.description}</p>
              
              <div className={`inline-flex items-center px-3 py-1 ${feature.bgColor} ${feature.borderColor} border rounded-full text-sm font-semibold ${feature.color}`}>
                {feature.stats}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="heading-3 mb-4">Advanced Capabilities</h3>
            <p className="text-body">
              Built with enterprise-grade features for maximum reliability and performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-dark-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="heading-3 mb-8">Powered by Advanced Technology</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Cpu className="w-6 h-6 text-blue-400" />
              <span className="text-dark-300">LDPC Codes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="w-6 h-6 text-purple-400" />
              <span className="text-dark-300">Reed-Solomon</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-6 h-6 text-green-400" />
              <span className="text-dark-300">5D Optical</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-yellow-400" />
              <span className="text-dark-300">OAIS Standard</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
