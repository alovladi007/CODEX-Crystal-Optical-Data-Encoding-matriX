'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Building, User, Award, Check } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Chief Data Officer',
    company: 'TechCorp Industries',
    avatar: 'SC',
    content: 'CODEX Crystal Archive has revolutionized our data preservation strategy. The 5D optical storage technology gives us confidence that our critical research data will be accessible for generations to come.',
    rating: 5,
    verified: true
  },
  {
    name: 'Michael Rodriguez',
    role: 'IT Director',
    company: 'Global Finance Ltd',
    avatar: 'MR',
    content: 'The error correction capabilities are outstanding. Even with significant data corruption, we were able to recover 99.9% of our archived financial records. This is exactly what we needed for long-term compliance.',
    rating: 5,
    verified: true
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Research Director',
    company: 'National Archives',
    avatar: 'EW',
    content: 'As a government institution, we need the highest standards for data preservation. CODEX meets and exceeds all our requirements with its OAIS compliance and self-describing archive format.',
    rating: 5,
    verified: true
  },
  {
    name: 'James Thompson',
    role: 'CTO',
    company: 'StartupXYZ',
    avatar: 'JT',
    content: 'The free tier allowed us to test the technology before committing. Now we use the Professional plan for all our critical data. The compression ratio and speed are incredible.',
    rating: 5,
    verified: true
  },
  {
    name: 'Dr. Lisa Park',
    role: 'Head of Research',
    company: 'Medical Research Institute',
    avatar: 'LP',
    content: 'We store decades of medical research data in CODEX archives. The durability guarantee and advanced error correction give us peace of mind that our work will be preserved for future researchers.',
    rating: 5,
    verified: true
  },
  {
    name: 'Robert Kim',
    role: 'Data Engineer',
    company: 'CloudTech Solutions',
    avatar: 'RK',
    content: 'The API integration was seamless. We built custom tools on top of CODEX and the performance is excellent. The self-describing format means our clients can decode archives without any external dependencies.',
    rating: 5,
    verified: true
  }
];

const stats = [
  { label: 'Customer Satisfaction', value: '99.8%', icon: Star },
  { label: 'Data Recovery Rate', value: '99.9999%', icon: Award },
  { label: 'Uptime SLA', value: '99.99%', icon: Building },
  { label: 'Response Time', value: '< 1s', icon: User }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="section">
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
            Trusted by <span className="text-gradient">Organizations</span>
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            See what our customers say about CODEX Crystal Archive and how it's 
            transforming their data preservation strategies.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card hover-lift group"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="relative mb-6">
                <Quote className="w-8 h-8 text-blue-400/20 absolute -top-2 -left-2" />
                <p className="text-dark-300 italic relative z-10">
                  "{testimonial.content}"
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    {testimonial.verified && (
                      <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                    )}
                  </div>
                  <p className="text-sm text-dark-400">{testimonial.role}</p>
                  <p className="text-sm text-blue-400">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="heading-3 mb-4">Customer Success Metrics</h3>
            <p className="text-body">
              Real performance data from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="heading-3 mb-4">Trusted by Leading Organizations</h3>
            <p className="text-body">
              From startups to Fortune 500 companies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[
              'TechCorp Industries',
              'Global Finance Ltd',
              'National Archives',
              'Medical Research Institute',
              'CloudTech Solutions',
              'StartupXYZ'
            ].map((company, index) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 bg-dark-800/30 rounded-lg border border-dark-700"
              >
                <div className="text-sm text-dark-300 font-medium">{company}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
