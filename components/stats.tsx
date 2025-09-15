'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { 
  Clock, 
  Shield, 
  Database, 
  Zap,
  Users,
  Globe,
  FileText,
  CheckCircle
} from 'lucide-react';

const stats = [
  {
    icon: Clock,
    value: 1000,
    suffix: '+',
    label: 'Years Durability',
    description: 'Data preserved for millennia',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10'
  },
  {
    icon: Shield,
    value: 99.9999,
    suffix: '%',
    label: 'Recovery Rate',
    description: 'Even with 15% data loss',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10'
  },
  {
    icon: Database,
    value: 72,
    suffix: '%',
    label: 'Compression Ratio',
    description: 'Average space savings',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10'
  },
  {
    icon: Zap,
    value: 0.0001,
    suffix: '%',
    label: 'Error Rate',
    description: 'Ultra-low bit error rate',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10'
  },
  {
    icon: Users,
    value: 10000,
    suffix: '+',
    label: 'Active Users',
    description: 'Trusted by organizations',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10'
  },
  {
    icon: Globe,
    value: 5,
    suffix: 'D',
    label: 'Optical Dimensions',
    description: 'Revolutionary storage density',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10'
  }
];

const achievements = [
  'First 5D optical storage system',
  'Military-grade security certification',
  'OAIS compliance standard',
  '99.9999% data recovery rate',
  '1000+ year durability guarantee',
  'Zero external dependencies'
];

export function Stats() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="section bg-gradient-to-r from-blue-500/5 to-purple-500/5">
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
            Proven <span className="text-gradient">Performance</span>
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            CODEX Crystal Archive delivers industry-leading performance metrics 
            and reliability guarantees backed by extensive testing and validation.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card text-center group hover-lift"
            >
              <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              
              <div className="text-4xl font-bold text-white mb-2">
                {inView && (
                  <CountUp
                    start={0}
                    end={stat.value}
                    duration={2}
                    decimals={stat.value < 1 ? 4 : 0}
                    suffix={stat.suffix}
                  />
                )}
              </div>
              
              <h3 className="heading-3 mb-2">{stat.label}</h3>
              <p className="text-dark-300">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="heading-3 mb-4">Industry Achievements</h3>
            <p className="text-body">
              Recognized for innovation and excellence in data preservation technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 p-4 bg-dark-700/50 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-dark-300">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="heading-3 mb-4">Performance Comparison</h3>
            <p className="text-body">
              How CODEX compares to traditional storage solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-dark-800/30 border border-dark-700 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-4">Traditional Storage</h4>
              <div className="space-y-2 text-sm text-dark-300">
                <div>• 3-5 years lifespan</div>
                <div>• Single point of failure</div>
                <div>• Requires active maintenance</div>
                <div>• Limited error correction</div>
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-4">CODEX Crystal</h4>
              <div className="space-y-2 text-sm text-white">
                <div>• 1000+ years lifespan</div>
                <div>• Multi-layer redundancy</div>
                <div>• Self-maintaining</div>
                <div>• Advanced error correction</div>
              </div>
            </div>

            <div className="text-center p-6 bg-dark-800/30 border border-dark-700 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-4">Cloud Storage</h4>
              <div className="space-y-2 text-sm text-dark-300">
                <div>• 99.9% uptime SLA</div>
                <div>• Ongoing costs</div>
                <div>• Internet dependency</div>
                <div>• Vendor lock-in risk</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
