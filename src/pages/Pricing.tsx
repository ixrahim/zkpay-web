// src/pages/Pricing.tsx

import { Check, ArrowRight, Zap, Shield, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PublicNav } from '@/components/PublicNav';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '£0',
      period: 'forever',
      description: 'Perfect for getting started with private payments',
      icon: Zap,
      color: 'from-gray-600 to-gray-700',
      features: [
        'Send & receive payments',
        'Zero-knowledge privacy',
        'Up to £500/month',
        '10 transactions/month',
        'Basic analytics',
        'Split bills (up to 5 people)',
        '1 savings pot',
        'Email support'
      ],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Plus',
      price: '£4.99',
      period: 'per month',
      description: 'For power users who want unlimited features',
      icon: Shield,
      color: 'from-blue-600 to-indigo-700',
      features: [
        'Everything in Free, plus:',
        'Unlimited transactions',
        'No monthly limits',
        'Advanced analytics',
        'Financial health insights',
        'Unlimited split bills',
        'Unlimited savings pots',
        'Priority support',
        'Custom categories',
        'Export data (CSV/PDF)'
      ],
      cta: 'Start 30-Day Trial',
      popular: true
    },
    {
      name: 'Business',
      price: '£19.99',
      period: 'per month',
      description: 'For freelancers and small businesses',
      icon: Crown,
      color: 'from-purple-600 to-pink-600',
      features: [
        'Everything in Plus, plus:',
        'Business account features',
        'Invoice generation',
        'Multi-user access (up to 5)',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
        'Advanced reporting',
        'Tax reports',
        'White-label option'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const faqs = [
    {
      q: 'When will ZKPay launch?',
      a: 'We\'re targeting Q2 2025 for public launch, pending FCA authorization. Join our waitlist to be notified when we go live.'
    },
    {
      q: 'Is my data private on all plans?',
      a: 'Absolutely. Zero-knowledge privacy is core to ZKPay and will be available on ALL plans, including Free. We never see your transaction details.'
    },
    {
      q: 'Can I use ZKPay now?',
      a: 'We\'re currently in development and FCA sandbox testing. Join our waitlist to get early access when we launch our beta program.'
    },
    {
      q: 'Will prices change before launch?',
      a: 'These are our planned prices, but they may be adjusted based on market feedback and regulatory requirements. Waitlist members will be notified of any changes.'
    },
    {
      q: 'How will you handle regulatory compliance?',
      a: 'We\'re working within the FCA Regulatory Sandbox to ensure our privacy solution meets all UK payment service regulations. Full compliance is our priority before public launch.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-medium">Planned Pricing - Subject to Change</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, transparent
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              pricing for everyone
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our planned pricing model when we launch. Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div
                  key={index}
                  className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all hover:scale-105 ${
                    plan.popular ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600">/ {plan.period}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate('/register')}
                      className={`w-full py-4 rounded-full font-semibold text-lg transition-all mb-8 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-xl'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Join Waitlist
                    </button>
                    
                    <div className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            plan.popular ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                          <span className={`text-sm ${
                            feature.includes('Everything in') ? 'font-semibold text-gray-900' : 'text-gray-700'
                          }`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Need something custom?</h2>
          <p className="text-xl text-gray-300 mb-8">
            We offer custom enterprise solutions for large organizations with specific needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              'Unlimited users',
              'Custom SLAs',
              'Dedicated support',
              'On-premise option',
              'Custom integrations',
              'Training & onboarding'
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all inline-flex items-center space-x-2"
          >
            <span>Contact Sales</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Compare plans in detail
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Free</th>
                  <th className="text-center py-4 px-4 font-bold text-blue-600">Plus</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { feature: 'Monthly transaction limit', free: '£500', plus: 'Unlimited', business: 'Unlimited' },
                  { feature: 'Number of transactions', free: '10/month', plus: 'Unlimited', business: 'Unlimited' },
                  { feature: 'Zero-knowledge privacy', free: '✓', plus: '✓', business: '✓' },
                  { feature: 'Split bills', free: 'Up to 5', plus: 'Unlimited', business: 'Unlimited' },
                  { feature: 'Savings pots', free: '1', plus: 'Unlimited', business: 'Unlimited' },
                  { feature: 'Analytics', free: 'Basic', plus: 'Advanced', business: 'Advanced + Tax' },
                  { feature: 'API access', free: '—', plus: '—', business: '✓' },
                  { feature: 'Multi-user', free: '—', plus: '—', business: 'Up to 5' },
                  { feature: 'Support', free: 'Email', plus: 'Priority', business: 'Dedicated' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-700">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{row.free}</td>
                    <td className="py-4 px-4 text-center text-blue-600 font-medium">{row.plus}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{row.business}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to join the waitlist?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Be first to experience private payments when we launch
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-12 py-5 rounded-full text-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center space-x-2"
          >
            <span>Join Waitlist</span>
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-sm text-gray-500 mt-4">
            No payment required • Be notified when we launch
          </p>
        </div>
      </section>
    </div>
  );
}