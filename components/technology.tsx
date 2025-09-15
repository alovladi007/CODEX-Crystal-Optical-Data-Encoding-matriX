'use client';

import { motion } from 'framer-motion';
import { 
  Cpu, 
  Database, 
  Shield, 
  Zap, 
  Globe,
  FileText,
  Lock,
  Settings,
  BarChart3,
  Layers
} from 'lucide-react';

const technologies = [
  {
    category: 'Error Correction',
    icon: Shield,
    title: 'Multi-Layer Protection',
    description: 'Advanced error correction using LDPC and Reed-Solomon codes for maximum data integrity.',
    features: [
      'LDPC inner codes with soft-decision decoding',
      'Reed-Solomon outer codes for burst error protection',
      'Interleaving across multiple planes',
      '99.9999% recovery rate with 15% tile loss'
    ],
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20'
  },
  {
    category: '5D Optical Storage',
    icon: Globe,
    title: 'Revolutionary Encoding',
    description: '5-dimensional data storage using orientation angles and retardance properties.',
    features: [
      'Orientation angles: 0°, 45°, 90°, 135°',
      'Retardance levels: 0.25, 0.75',
      'Gray coding for minimal error propagation',
      '3-5 bits per voxel capacity'
    ],
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20'
  },
  {
    category: 'Compression',
    icon: Database,
    title: 'Advanced Algorithms',
    description: 'State-of-the-art compression with version tracking and metadata preservation.',
    features: [
      'Zstandard compression (72% average)',
      'XZ compression for maximum ratio',
      'Version tracking for compatibility',
      'Metadata preservation and indexing'
    ],
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20'
  },
  {
    category: 'Security',
    icon: Lock,
    title: 'Military-Grade Protection',
    description: 'Advanced encryption and integrity verification for maximum data security.',
    features: [
      'AES-256 encryption',
      'Ed25519 digital signatures',
      'Merkle tree integrity verification',
      'SHA-256 file hashing'
    ],
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20'
  },
  {
    category: 'Standards',
    icon: FileText,
    title: 'OAIS Compliance',
    description: 'Self-describing archives following international archival standards.',
    features: [
      'OAIS-compliant manifest system',
      'Complete decoding instructions',
      'Future compatibility guaranteed',
      'No external dependencies required'
    ],
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20'
  },
  {
    category: 'Performance',
    icon: Zap,
    title: 'Optimized Processing',
    description: 'High-performance algorithms optimized for speed and efficiency.',
    features: [
      'Real-time encoding/decoding',
      'Parallel processing support',
      'Memory-efficient algorithms',
      'Hardware acceleration ready'
    ],
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-400/20'
  }
];

const technicalSpecs = [
  { label: 'Data Density', value: '5D Optical', icon: Globe },
  { label: 'Error Rate', value: '0.0001%', icon: Shield },
  { label: 'Compression', value: '72% avg', icon: Database },
  { label: 'Durability', value: '1000+ years', icon: Lock },
  { label: 'Recovery', value: '99.9999%', icon: Zap },
  { label: 'Standards', value: 'OAIS', icon: FileText }
];

export function Technology() {
  return (
    <section id="technology" className="section relative overflow-hidden">
      {/* Technology Background Pattern */}
      <div className="absolute inset-0 opacity-25">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/backgrounds/tech-circuit.svg)',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_transparent_0%,_rgba(139,92,246,0.05)_50%,_transparent_100%)]" />
      </div>
      
      {/* Circuit Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_rgba(59,130,246,0.1)_25%,_rgba(59,130,246,0.1)_50%,_transparent_50%,_transparent_75%,_rgba(139,92,246,0.1)_75%)] bg-[length:40px_40px]" />
      </div>
      
      {/* Floating Tech Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-1/4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-600/20 rounded-full blur-lg animate-pulse" />
        <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-md animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-10 w-8 h-8 bg-gradient-to-br from-green-400/20 to-cyan-600/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '2s' }} />
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
            Cutting-Edge <span className="text-gradient">Technology</span>
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            CODEX Crystal Archive leverages the latest advances in optical storage, 
            error correction, and data preservation to create the most durable storage system ever built.
          </p>
        </motion.div>

        {/* Technology Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`card hover-lift group ${tech.borderColor}`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 ${tech.bgColor} ${tech.borderColor} border rounded-lg flex items-center justify-center`}>
                  <tech.icon className={`w-5 h-5 ${tech.color}`} />
                </div>
                <div>
                  <div className="text-xs text-dark-400 uppercase tracking-wide">{tech.category}</div>
                  <h3 className="heading-3">{tech.title}</h3>
                </div>
              </div>
              
              <p className="text-body mb-4">{tech.description}</p>
              
              <div className="space-y-2">
                {tech.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-dark-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="heading-3 mb-4">Technical Specifications</h3>
            <p className="text-body">
              Industry-leading performance metrics and technical capabilities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technicalSpecs.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <spec.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{spec.value}</div>
                <div className="text-sm text-dark-400">{spec.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="heading-3 mb-4">System Architecture</h3>
            <p className="text-body">
              Multi-layered architecture designed for maximum reliability and performance
            </p>
          </div>

          <div className="bg-dark-800/30 border border-dark-700 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { name: 'Data Input', icon: FileText, color: 'text-blue-400' },
                { name: 'Compression', icon: Database, color: 'text-green-400' },
                { name: 'Error Correction', icon: Shield, color: 'text-purple-400' },
                { name: '5D Mapping', icon: Globe, color: 'text-yellow-400' },
                { name: 'Crystal Storage', icon: Layers, color: 'text-red-400' }
              ].map((layer, index) => (
                <div key={layer.name} className="text-center">
                  <div className={`w-16 h-16 bg-dark-700 border border-dark-600 rounded-lg flex items-center justify-center mx-auto mb-3 ${layer.color}`}>
                    <layer.icon className="w-8 h-8" />
                  </div>
                  <div className="text-sm text-dark-300">{layer.name}</div>
                  {index < 4 && (
                    <div className="hidden md:block absolute top-8 left-full w-4 h-0.5 bg-dark-600 transform translate-x-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
