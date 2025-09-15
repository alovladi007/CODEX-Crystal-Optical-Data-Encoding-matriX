'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Users, Building } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for personal use and small projects',
    icon: Users,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    features: [
      'Up to 1GB storage',
      'Basic error correction',
      'Web interface access',
      'Community support',
      'Standard compression',
      'Basic documentation'
    ],
    limitations: [
      'Limited to 1GB per archive',
      'Basic error correction only',
      'No priority support'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Professional',
    price: '$29',
    period: 'per month',
    description: 'Ideal for businesses and power users',
    icon: Zap,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
    features: [
      'Up to 100GB storage',
      'Advanced error correction',
      'CLI and API access',
      'Priority support',
      'High compression ratio',
      'Batch processing',
      'Custom profiles',
      'Detailed analytics'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For large organizations with custom needs',
    icon: Crown,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20',
    features: [
      'Unlimited storage',
      'Military-grade security',
      'Dedicated support',
      'Custom integrations',
      'On-premises deployment',
      'SLA guarantees',
      'Training and consulting',
      'Custom development'
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false
  }
];

const addOns = [
  {
    name: 'Additional Storage',
    price: '$0.10',
    unit: 'per GB/month',
    description: 'Extra storage beyond your plan limit',
    icon: Building
  },
  {
    name: 'Priority Support',
    price: '$99',
    unit: 'per month',
    description: '24/7 priority support and faster response times',
    icon: Star
  },
  {
    name: 'Custom Profiles',
    price: '$199',
    unit: 'one-time',
    description: 'Custom encoding profiles for specific use cases',
    icon: Zap
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="section bg-dark-800/30">
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
            Simple <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            Choose the perfect plan for your data preservation needs. 
            All plans include our core 5D optical storage technology.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative card hover-lift ${plan.popular ? 'ring-2 ring-purple-500/50' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="crystal" className="px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-16 h-16 ${plan.bgColor} ${plan.borderColor} border rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className={`w-8 h-8 ${plan.color}`} />
                </div>
                
                <h3 className="heading-3 mb-2">{plan.name}</h3>
                <p className="text-dark-300 mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-dark-400 ml-2">{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-dark-300">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="space-y-2 mb-6 p-4 bg-dark-700/50 rounded-lg">
                  <div className="text-sm font-semibold text-dark-400 mb-2">Limitations:</div>
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="text-sm text-dark-400">
                      • {limitation}
                    </div>
                  ))}
                </div>
              )}

              <Button
                className={`w-full ${
                  plan.popular 
                    ? 'btn-primary' 
                    : plan.name === 'Enterprise'
                    ? 'btn-secondary'
                    : 'btn-outline'
                }`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="heading-3 mb-4">Add-on Services</h3>
            <p className="text-body">
              Enhance your plan with additional services and features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((addOn, index) => (
              <motion.div
                key={addOn.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-dark-700/50 rounded-xl border border-dark-600 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                    <addOn.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">{addOn.name}</h4>
                </div>
                
                <div className="mb-3">
                  <span className="text-2xl font-bold text-white">{addOn.price}</span>
                  <span className="text-dark-400 ml-1">{addOn.unit}</span>
                </div>
                
                <p className="text-dark-300 text-sm">{addOn.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="heading-3 mb-4">Frequently Asked Questions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h4>
                <p className="text-dark-300">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h4>
                <p className="text-dark-300">Yes, all paid plans come with a 14-day free trial. No credit card required.</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">What happens to my data if I cancel?</h4>
                <p className="text-dark-300">Your data remains accessible for 30 days after cancellation. You can export it anytime.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Do you offer refunds?</h4>
                <p className="text-dark-300">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Is my data secure?</h4>
                <p className="text-dark-300">Absolutely. We use military-grade encryption and follow strict security protocols.</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Can I use this offline?</h4>
                <p className="text-dark-300">Yes, our CLI tool works completely offline. Only the web interface requires internet.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
