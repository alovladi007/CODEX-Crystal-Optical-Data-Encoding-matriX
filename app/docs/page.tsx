'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Download, 
  Code, 
  FileText, 
  ArrowRight,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export default function DocsPage() {
  const sections = [
    {
      title: 'Getting Started',
      description: 'Quick start guide for CODEX Crystal Archive',
      icon: BookOpen,
      items: [
        { name: 'Installation', href: '#installation' },
        { name: 'Quick Start', href: '#quick-start' },
        { name: 'First Archive', href: '#first-archive' }
      ]
    },
    {
      title: 'API Reference',
      description: 'Complete API documentation',
      icon: Code,
      items: [
        { name: 'CLI Commands', href: '#cli-commands' },
        { name: 'Python API', href: '#python-api' },
        { name: 'Web API', href: '#web-api' }
      ]
    },
    {
      title: 'Guides',
      description: 'Step-by-step tutorials',
      icon: FileText,
      items: [
        { name: 'Encoding Profiles', href: '#encoding-profiles' },
        { name: 'Error Correction', href: '#error-correction' },
        { name: 'Data Recovery', href: '#data-recovery' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-20">
      <div className="container py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="heading-1 mb-4">
            Documentation
          </h1>
          <p className="text-body max-w-3xl mx-auto">
            Complete documentation for CODEX Crystal Archive. Learn how to use our 
            revolutionary 5D optical storage technology to preserve your data.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="card text-center">
            <Download className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Download CLI</h3>
            <p className="text-dark-300 mb-4">Get the command-line interface for offline use</p>
            <Button className="btn-primary w-full">
              Download v1.0.0
            </Button>
          </div>

          <div className="card text-center">
            <Code className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">API Reference</h3>
            <p className="text-dark-300 mb-4">Complete API documentation and examples</p>
            <Button variant="outline" className="btn-secondary w-full">
              View API Docs
            </Button>
          </div>

          <div className="card text-center">
            <ExternalLink className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">GitHub</h3>
            <p className="text-dark-300 mb-4">Source code and community contributions</p>
            <Button variant="outline" className="btn-secondary w-full">
              View on GitHub
            </Button>
          </div>
        </motion.div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="card"
            >
              <div className="flex items-center mb-4">
                <section.icon className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">{section.title}</h3>
              </div>
              
              <p className="text-dark-300 mb-6">{section.description}</p>
              
              <div className="space-y-2">
                {section.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors group"
                  >
                    <span className="text-white group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-dark-400 group-hover:text-blue-400 transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Installation Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <div className="card">
            <h2 className="heading-3 mb-6">Installation</h2>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Via pip</h4>
                <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-400">pip install codex-crystal-archive</div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">From source</h4>
                <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 font-mono text-sm space-y-2">
                  <div className="text-blue-400">git clone https://github.com/codex-crystal-archive/codex.git</div>
                  <div className="text-blue-400">cd codex</div>
                  <div className="text-green-400">pip install -e .</div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Docker</h4>
                <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 font-mono text-sm">
                  <div className="text-blue-400">docker run -it codex-crystal-archive:latest</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <div className="card">
            <h2 className="heading-3 mb-6">Quick Start</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Install CODEX</h4>
                  <p className="text-dark-300">Install the CLI tool using pip or download from GitHub.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Create your first archive</h4>
                  <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 font-mono text-sm mt-2">
                    <div className="text-green-400">crystal-archive encode ./my-files/ --profile A</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Verify your archive</h4>
                  <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 font-mono text-sm mt-2">
                    <div className="text-green-400">crystal-archive verify archive.crystal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
