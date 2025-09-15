'use client';

import { motion } from 'framer-motion';
import { 
  Upload, 
  Archive, 
  Shield, 
  Cpu, 
  Database, 
  Download,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Files',
    description: 'Select your files or drag and drop them into the interface. Supports any file type and size.',
    details: ['Drag & drop interface', 'Batch file upload', 'Progress tracking', 'File validation'],
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20'
  },
  {
    icon: Archive,
    title: 'Compress & Pack',
    description: 'Files are compressed using advanced algorithms and packed into a single binary blob.',
    details: ['Zstandard compression', '72% average reduction', 'Version tracking', 'Metadata preservation'],
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20'
  },
  {
    icon: Shield,
    title: 'Error Correction',
    description: 'Multi-layer error correction codes are applied for maximum data durability.',
    details: ['LDPC inner codes', 'Reed-Solomon outer codes', 'Interleaving', 'Redundancy layers'],
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20'
  },
  {
    icon: Cpu,
    title: '5D Mapping',
    description: 'Data is converted to 5D optical symbols using orientation and retardance properties.',
    details: ['Orientation angles', 'Retardance levels', 'Gray coding', 'Voxel organization'],
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20'
  },
  {
    icon: Database,
    title: 'Crystal Storage',
    description: 'Data is stored in crystal format with self-describing manifests for future decoding.',
    details: ['Crystal tiles', 'Manifest generation', 'Integrity checks', 'Self-describing format'],
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-400/20'
  },
  {
    icon: Download,
    title: 'Archive Ready',
    description: 'Your crystal archive is ready for long-term storage with complete decoding instructions.',
    details: ['Download archive', 'Verification tools', 'Decoding instructions', 'Future compatibility'],
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section bg-dark-800/30">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-2">
            How <span className="text-gradient">CODEX</span> Works
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            Our revolutionary 5D optical storage process transforms your data into 
            ultra-durable crystal archives through six sophisticated steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-8 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Step Content */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${step.bgColor} ${step.borderColor} border rounded-lg flex items-center justify-center`}>
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <div>
                    <h3 className="heading-3">{step.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-dark-400">Step {index + 1}</span>
                      <div className="w-8 h-px bg-dark-600"></div>
                    </div>
                  </div>
                </div>
                
                <p className="text-body">{step.description}</p>
                
                <div className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-dark-300">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Visual */}
              <div className="flex-1 max-w-md">
                <div className={`${step.bgColor} ${step.borderColor} border rounded-2xl p-8 text-center`}>
                  <div className={`w-20 h-20 ${step.bgColor} ${step.borderColor} border rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className={`w-10 h-10 ${step.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {index + 1}
                  </div>
                  <div className="text-sm text-dark-300">
                    {step.title}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                  <ArrowRight className="w-6 h-6 text-dark-600 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Process Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8"
        >
          <div className="text-center">
            <h3 className="heading-3 mb-4">Complete Process in Under 60 Seconds</h3>
            <p className="text-body mb-6">
              From file upload to crystal archive, the entire process is optimized for speed and reliability.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">99.9999%</div>
                <div className="text-sm text-dark-300">Data Recovery Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">72%</div>
                <div className="text-sm text-dark-300">Average Compression</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">1000+</div>
                <div className="text-sm text-dark-300">Years Durability</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
