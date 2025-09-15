'use client';

import { motion } from 'framer-motion';
import { Users, Code, Database, Shield, Zap, Globe } from 'lucide-react';

const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'Lead Data Engineer',
    expertise: '5D Optical Storage',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Crystal Physics Specialist',
    expertise: 'Quantum Encoding',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Dr. Elena Volkov',
    role: 'Research Director',
    expertise: 'Error Correction',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Alex Kim',
    role: 'Systems Architect',
    expertise: 'Infrastructure',
    icon: Code,
    color: 'from-orange-500 to-red-500',
  },
  {
    name: 'Priya Patel',
    role: 'Product Manager',
    expertise: 'User Experience',
    icon: Globe,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    name: 'James Wilson',
    role: 'DevOps Engineer',
    expertise: 'Cloud Infrastructure',
    icon: Users,
    color: 'from-teal-500 to-cyan-500',
  },
];

export function Team() {
  return (
    <section id="team" className="section relative overflow-hidden">
      {/* Team Background Effects */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_transparent_0%,_rgba(59,130,246,0.05)_25%,_transparent_50%,_rgba(139,92,246,0.05)_75%,_transparent_100%)]" />
      </div>
      
      {/* Office Environment Overlay */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-slate-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-slate-900/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Meet Our Expert Team
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Our world-class team of scientists, engineers, and innovators are pushing the boundaries 
            of data storage technology to preserve humanity's most important information.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-300 hover:border-slate-600/50 hover:shadow-2xl hover:shadow-blue-500/10">
                  {/* Team member avatar placeholder */}
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${member.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 text-center">
                    {member.name}
                  </h3>
                  <p className="text-blue-400 font-semibold text-center mb-3">
                    {member.role}
                  </p>
                  <p className="text-slate-400 text-center text-sm">
                    {member.expertise}
                  </p>
                  
                  {/* Professional background indicator */}
                  <div className="mt-6 flex justify-center">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
                
                {/* Hover effect glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${member.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`} />
              </motion.div>
            );
          })}
        </div>

        {/* Team stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
            <div className="text-slate-400">Years Combined Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">15</div>
            <div className="text-slate-400">Research Papers Published</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">8</div>
            <div className="text-slate-400">Patents Filed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">100%</div>
            <div className="text-slate-400">Dedication to Innovation</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
