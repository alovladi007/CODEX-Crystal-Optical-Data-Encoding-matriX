'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Code, 
  FileText, 
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Play,
  Terminal,
  BookOpen
} from 'lucide-react';

export default function GetStartedPage() {
  const steps = [
    {
      number: 1,
      title: 'Install CODEX',
      description: 'Get the CLI tool or use our web interface',
      icon: Download,
      actions: [
        { name: 'Download CLI', href: '#download', type: 'primary' },
        { name: 'Use Web Demo', href: '/demo', type: 'secondary' }
      ]
    },
    {
      number: 2,
      title: 'Create Your First Archive',
      description: 'Encode your data into a crystal archive',
      icon: Code,
      actions: [
        { name: 'Try Live Demo', href: '/demo', type: 'primary' },
        { name: 'View Examples', href: '#examples', type: 'secondary' }
      ]
    },
    {
      number: 3,
      title: 'Learn Advanced Features',
      description: 'Explore error correction, security, and optimization',
      icon: BookOpen,
      actions: [
        { name: 'Read Documentation', href: '/docs', type: 'primary' },
        { name: 'View Tutorials', href: '/tutorials', type: 'secondary' }
      ]
    }
  ];

  const features = [
    '5D Optical Data Storage',
    '99.9999% Data Recovery',
    'Military-Grade Encryption',
    'Self-Describing Archives',
    'Cross-Platform Compatibility',
    'Real-Time Processing'
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
          <Badge variant="outline" className="text-blue-400 border-blue-400/50 bg-blue-400/10 mb-4">
            <Play className="w-4 h-4 mr-2" />
            Quick Start Guide
          </Badge>
          <h1 className="heading-1 mb-4">
            Get Started with <span className="text-gradient">CODEX</span>
          </h1>
          <p className="text-body max-w-3xl mx-auto">
            Start preserving your data with revolutionary 5D optical crystal storage. 
            Follow our simple guide to create your first crystal archive in minutes.
          </p>
        </motion.div>

        {/* Quick Start Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="card text-center relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{step.number}</span>
                </div>
              </div>

              <div className="pt-6">
                <step.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="heading-3 mb-3">{step.title}</h3>
                <p className="text-dark-300 mb-6">{step.description}</p>
                
                <div className="space-y-3">
                  {step.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant={action.type === 'primary' ? 'crystal' : 'outline'}
                      className="w-full"
                      onClick={() => {
                        if (action.href.startsWith('/')) {
                          window.location.href = action.href;
                        } else {
                          // Handle anchor links
                          const element = document.querySelector(action.href);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                      }}
                    >
                      {action.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Installation Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="card">
            <h2 className="heading-3 mb-8 text-center">Installation Methods</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CLI Installation */}
              <div className="text-center">
                <Terminal className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Command Line</h3>
                <p className="text-dark-300 mb-4">Install the CLI tool for offline use</p>
                <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 font-mono text-sm mb-4">
                  <div className="text-green-400">pip install codex-crystal-archive</div>
                </div>
                <Button variant="outline" className="w-full">
                  Download CLI
                </Button>
              </div>

              {/* Web Interface */}
              <div className="text-center">
                <Code className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Web Interface</h3>
                <p className="text-dark-300 mb-4">Use our online demo and tools</p>
                <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 text-sm mb-4">
                  <div className="text-blue-400">No installation required</div>
                  <div className="text-dark-400">Works in any modern browser</div>
                </div>
                <Button 
                  variant="crystal" 
                  className="w-full"
                  onClick={() => window.location.href = '/demo'}
                >
                  Try Web Demo
                </Button>
              </div>

              {/* Docker */}
              <div className="text-center">
                <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Docker</h3>
                <p className="text-dark-300 mb-4">Run in a containerized environment</p>
                <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 font-mono text-sm mb-4">
                  <div className="text-blue-400">docker run -it codex-crystal-archive</div>
                </div>
                <Button variant="outline" className="w-full">
                  View Docker Hub
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <div className="card">
            <h2 className="heading-3 mb-8 text-center">Why Choose CODEX?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-dark-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <div className="card bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <h2 className="heading-3 mb-4">Ready to Get Started?</h2>
            <p className="text-body mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust CODEX Crystal Archive to preserve their most important data.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="btn-primary group"
                onClick={() => window.location.href = '/demo'}
              >
                Try Live Demo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="btn-secondary"
                onClick={() => window.location.href = '/docs'}
              >
                <FileText className="w-5 h-5 mr-2" />
                Read Documentation
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
