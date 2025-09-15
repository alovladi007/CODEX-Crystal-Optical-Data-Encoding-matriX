'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Sparkles, 
  Download, 
  Github, 
  Twitter,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features', isAnchor: true },
    { name: 'Technology', href: '#technology', isAnchor: true },
    { name: 'Pricing', href: '#pricing', isAnchor: true },
    { name: 'Docs', href: '/docs', isAnchor: false },
    { name: 'Demo', href: '/demo', isAnchor: false },
    { name: 'Status', href: '/status', isAnchor: false },
  ];

  const handleNavClick = (href: string, isAnchor: boolean) => {
    if (isAnchor) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(href);
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-700' 
          : 'bg-transparent'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              CODEX
            </span>
            <Badge variant="outline" className="text-xs text-blue-400 border-blue-400/50">
              v1.0
            </Badge>
          </Link>

          {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                item.isAnchor ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href, item.isAnchor)}
                    className="text-dark-300 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-dark-300 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-dark-300 hover:text-white"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/demo')}
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Try Demo
            </Button>

            <Button
              variant="crystal"
              size="sm"
              onClick={() => router.push('/get-started')}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-dark-700 bg-dark-900/95 backdrop-blur-md"
            >
                <div className="py-4 space-y-4">
                  {navItems.map((item) => (
                    item.isAnchor ? (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.href, item.isAnchor)}
                        className="block w-full text-left px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors duration-200"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block w-full text-left px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                
                <div className="px-4 pt-4 border-t border-dark-700 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                    onClick={() => {
                      router.push('/demo');
                      setIsOpen(false);
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Try Demo
                  </Button>
                  
                  <Button
                    variant="crystal"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/get-started');
                      setIsOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
