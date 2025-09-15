'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  ArrowRight,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features', isAnchor: true },
    { name: 'Technology', href: '#technology', isAnchor: true },
    { name: 'Pricing', href: '#pricing', isAnchor: true },
    { name: 'Demo', href: '/demo', isAnchor: false },
    { name: 'API Docs', href: '/docs', isAnchor: false }
  ],
  company: [
    { name: 'About Us', href: '/about', isAnchor: false },
    { name: 'Careers', href: '/careers', isAnchor: false },
    { name: 'Press', href: '/press', isAnchor: false },
    { name: 'Blog', href: '/blog', isAnchor: false },
    { name: 'Contact', href: '/contact', isAnchor: false }
  ],
  resources: [
    { name: 'Documentation', href: '/docs', isAnchor: false },
    { name: 'Tutorials', href: '/tutorials', isAnchor: false },
    { name: 'Support', href: '/support', isAnchor: false },
    { name: 'Community', href: '/community', isAnchor: false },
    { name: 'Status', href: '/status', isAnchor: false }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy', isAnchor: false },
    { name: 'Terms of Service', href: '/terms', isAnchor: false },
    { name: 'Security', href: '/security', isAnchor: false },
    { name: 'Compliance', href: '/compliance', isAnchor: false },
    { name: 'GDPR', href: '/gdpr', isAnchor: false }
  ]
};

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/codex-crystal-archive', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com/codexcrystal', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/codex-crystal-archive', icon: Linkedin },
  { name: 'Email', href: 'mailto:contact@codex-crystal-archive.com', icon: Mail }
];

const features = [
  { icon: Shield, text: 'Military-grade security' },
  { icon: Zap, text: 'Lightning-fast processing' },
  { icon: Globe, text: 'Global accessibility' }
];

export function Footer() {
  const router = useRouter();

  const handleLinkClick = (href: string, isAnchor: boolean) => {
    if (isAnchor) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(href);
    }
  };

  return (
    <footer className="bg-dark-900 border-t border-dark-700">
      <div className="container">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">CODEX</span>
                </Link>
                
                <p className="text-dark-300 mb-6 max-w-sm">
                  Revolutionary 5D optical data storage technology for preserving 
                  your most important data for millennia.
                </p>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <feature.icon className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-dark-300">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 bg-dark-800 border border-dark-700 rounded-lg flex items-center justify-center text-dark-400 hover:text-white hover:border-blue-500/50 transition-colors"
                    >
                      <social.icon className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4 capitalize">
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <button
                          onClick={() => handleLinkClick(link.href, link.isAnchor)}
                          className="text-dark-300 hover:text-white transition-colors text-sm text-left"
                        >
                          {link.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-t border-dark-700"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Stay Updated with CODEX
            </h3>
            <p className="text-dark-300 mb-6">
              Get the latest news, updates, and insights about 5D optical storage technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-6 border-t border-dark-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-dark-400">
              © 2024 CODEX Crystal Archive. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-dark-400">
              <span>Made with ❤️ for data preservation</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
