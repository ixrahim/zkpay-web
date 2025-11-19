// src/pages/Product.tsx

import { useState } from 'react';
import { 
  Send, 
  Users, 
  PiggyBank, 
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Smartphone,
  CheckCircle2,
  ArrowRight,
 ArrowDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PublicNav } from '@/components/PublicNav';

export default function Product() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('payments');

  interface PaymentsDemo {
    from: string;
    to: string;
    amount: string;
    time: string;
  }

  interface SplitBillsDemo {
    bill: string;
    people: number;
    perPerson: string;
    status: string;
  }

  interface PotsDemo {
    goal: string;
    target: string;
    saved: string;
    progress: string;
  }

  interface AnalyticsDemo {
    health: string;
    budget: string;
    topCategory: string;
    trend: string;
  }

  const features = {
    payments: {
      title: 'Instant Payments',
      description: 'Send money in seconds using @usernames. No account numbers, no sort codes.',
      icon: Send,
      color: 'from-blue-500 to-blue-600',
      benefits: [
        'Send money using @usernames',
        'Instant transfers (< 3 seconds)',
        'Zero-knowledge privacy',
        'No transaction fees for basic users',
        'Works with all UK banks'
      ],
      demo: {
        from: '@you',
        to: '@friend',
        amount: '£50',
        time: '2.3s'
      } as PaymentsDemo
    },
    splitbills: {
      title: 'Split Bills',
      description: 'Split expenses with friends instantly. No awkward payment requests.',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      benefits: [
        'Create group expenses',
        'Auto-calculate splits',
        'Track who has paid',
        'Send payment reminders',
        'Works for any size group'
      ],
      demo: {
        bill: 'Team Dinner',
        people: 4,
        perPerson: '£32.50',
        status: '3/4 paid'
      } as SplitBillsDemo
    },
    pots: {
      title: 'Savings Pots',
      description: 'Set savings goals and watch your money grow.',
      icon: PiggyBank,
      color: 'from-green-500 to-green-600',
      benefits: [
        'Create unlimited savings goals',
        'Visual progress tracking',
        'Set deadlines for goals',
        'Auto-save features',
        'Interest on savings'
      ],
      demo: {
        goal: 'Holiday Fund',
        target: '£1,000',
        saved: '£650',
        progress: '65%'
      } as PotsDemo
    },
    analytics: {
      title: 'Smart Analytics',
      description: 'Understand your spending with AI-powered insights.',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      benefits: [
        'Spending by category',
        'Budget tracking',
        'Financial health score',
        'Spending trends',
        'Smart recommendations'
      ],
      demo: {
        health: '87/100',
        budget: '72% used',
        topCategory: 'Dining',
        trend: '+12%'
      } as AnalyticsDemo
    }
  };

  const activeFeature = features[activeTab as keyof typeof features];
  const Icon = activeFeature.icon;

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      {/* Hero */}
      <section className="pt-32 pb-[7rem] px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-medium">In Development - Features Preview</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Features you'll
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              actually use
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're building modern financial tools with uncompromising privacy. 
            Here's what ZKPay will offer when we launch.
          </p>
        </div>
      </section>

      {/* Feature Tabs */}
      <section className="pb-[3rem] pt-[6rem] px-4 bg-white border-b border-gray-200 sticky top-0 z-40">
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(features).map(([key, feature]) => {
              const FeatureIcon = feature.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FeatureIcon className="w-5 h-5" />
                  <span>{feature.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Detail */}
      <div className='flex justify-center'> <div className="mt-2 flex justify-center animate-fade-in">
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight - 170, behavior: 'smooth' })}
              className="group flex flex-col items-center space-y-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
              aria-label="Scroll to explore features"
            >
              <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Scroll to explore
              </span>
              <ArrowDown className="w-8 h-8 animate-bounce-arrow" />
            </button>
          </div></div>
      <section className="py-20 px-4">
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Details */}
            <div>
              <div className={`w-16 h-16 bg-gradient-to-br ${activeFeature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {activeFeature.title}
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                {activeFeature.description}
              </p>
              
              <div className="space-y-4 mb-8">
                {activeFeature.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all inline-flex items-center space-x-2"
              >
                <span>Try It Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Right: Demo */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-xl">
                <div className="bg-white rounded-2xl p-8">
                  {activeTab === 'payments' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-2">Send Payment</div>
                        <div className="text-4xl font-bold text-gray-900 mb-4">{(activeFeature.demo as PaymentsDemo).amount}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl">👤</span>
                          </div>
                          <div className="font-medium">{(activeFeature.demo as PaymentsDemo).from}</div>
                        </div>
                        <ArrowRight className="w-8 h-8 text-blue-600" />
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl">👤</span>
                          </div>
                          <div className="font-medium">{(activeFeature.demo as PaymentsDemo).to}</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="font-medium">Sent in {(activeFeature.demo as PaymentsDemo).time}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'splitbills' && (
                    <div className="space-y-4">
                      <div className="text-xl font-bold text-gray-900">{(activeFeature.demo as SplitBillsDemo).bill}</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">People</div>
                          <div className="text-2xl font-bold text-gray-900">{(activeFeature.demo as SplitBillsDemo).people}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Per Person</div>
                          <div className="text-2xl font-bold text-gray-900">{(activeFeature.demo as SplitBillsDemo).perPerson}</div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-2">Payment Status</div>
                        <div className="text-lg font-medium text-gray-900">{(activeFeature.demo as SplitBillsDemo).status}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'pots' && (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-4xl">✈️</span>
                        <div className="text-2xl font-bold text-gray-900">{(activeFeature.demo as PotsDemo).goal}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Progress</span>
                          <span className="font-bold text-gray-900">{(activeFeature.demo as PotsDemo).progress}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-3 rounded-full" style={{ width: (activeFeature.demo as PotsDemo).progress }}></div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{(activeFeature.demo as PotsDemo).saved}</span>
                          <span className="font-medium text-gray-900">{(activeFeature.demo as PotsDemo).target}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'analytics' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-2">Financial Health Score</div>
                        <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                          {(activeFeature.demo as AnalyticsDemo).health}
                        </div>
                        <div className="text-sm text-green-600 font-medium mt-2">Excellent</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="text-sm text-gray-600">Budget Used</div>
                          <div className="text-xl font-bold text-gray-900">{(activeFeature.demo as AnalyticsDemo).budget}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="text-sm text-gray-600">Spending</div>
                          <div className="text-xl font-bold text-gray-900">{(activeFeature.demo as AnalyticsDemo).trend}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 {/* Bounce Animation Styles */}
      <style>{`
        @keyframes bounce-arrow {
          0%, 100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(25%);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-bounce-arrow {
          animation: bounce-arrow 2s infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out 0.5s both;
        }
      `}</style>
      {/* Platform Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Built for everyone
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: 'Mobile First',
                description: 'Beautiful native apps for iOS and Android. Fast, intuitive, always accessible.'
              },
              {
                icon: Globe,
                title: 'UK Banking',
                description: 'Works with all major UK banks via Open Banking. Instant connections.'
              },
              {
                icon: Shield,
                title: 'Zero Knowledge',
                description: 'Transactions encrypted with zero-knowledge proofs. Complete privacy.'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Transfers complete in under 3 seconds. No waiting around.'
              },
              {
                icon: CheckCircle2,
                title: 'FCA Regulated',
                description: 'Fully authorized and regulated by the Financial Conduct Authority.'
              },
              {
                icon: Users,
                title: 'Social Payments',
                description: 'Use @usernames instead of account numbers. Simple and secure.'
              }
            ].map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <FeatureIcon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to experience
            <br />
            <span className="text-blue-600">the future?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our waitlist to get early access when we launch.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-12 py-5 rounded-full text-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center space-x-2"
          >
            <span>Join Waitlist</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
      `}</style>
    </div>
  );
}