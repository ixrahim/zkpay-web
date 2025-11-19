// src/pages/Landing.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Lock, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Smartphone,
  Play,
  ChevronRight,
  Sparkles,
  ArrowDown
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Zero-Knowledge Privacy',
      description: 'Send money with complete privacy. Nobody can see who you pay or how much.',
      color: 'from-blue-500 to-blue-600',
      stats: '100% Private'
    },
    {
      icon: Zap,
      title: 'Instant Transfers',
      description: 'Money arrives in seconds, not days. No more waiting for bank transfers.',
      color: 'from-purple-500 to-purple-600',
      stats: '<3 seconds'
    },
    {
      icon: Lock,
      title: 'Bank-Grade Security',
      description: 'Military-grade encryption with Secret Network blockchain protection.',
      color: 'from-green-500 to-green-600',
      stats: '256-bit Encryption'
    },
    {
      icon: Users,
      title: 'Split Bills Easily',
      description: 'Split expenses with friends instantly. No awkward reminders needed.',
      color: 'from-orange-500 to-orange-600',
      stats: 'Group Payments'
    }
  ];

  const stats = [
    { value: 'Q4 2024', label: 'Founded' },
    { value: 'MVP', label: 'In Development' },
    { value: '£2M', label: 'Raising' },
    { value: 'FCA', label: 'Post-Funding Target' }
  ];

  // const testimonials = [
  //   {
  //     name: 'Sarah Johnson',
  //     role: 'Product Manager',
  //     avatar: '👩‍💼',
  //     text: 'Finally, a payment app that actually respects my privacy. No more sharing my bank details!',
  //     rating: 5
  //   },
  //   {
  //     name: 'James Chen',
  //     role: 'Software Engineer',
  //     avatar: '👨‍💻',
  //     text: 'The split bills feature is a game-changer. Sorted our team dinner in seconds.',
  //     rating: 5
  //   },
  //   {
  //     name: 'Emma Williams',
  //     role: 'Freelancer',
  //     avatar: '👩‍🎨',
  //     text: 'Love the savings pots! Helping me save for my holiday without thinking about it.',
  //     rating: 5
  //   }
  // ];

  const howItWorks = [
    {
      step: '1',
      title: 'Sign Up',
      description: 'Create your account in 60 seconds. No credit check, no paperwork.',
      icon: Smartphone
    },
    {
      step: '2',
      title: 'Link Your Bank',
      description: 'Securely connect your UK bank account with Open Banking.',
      icon: Lock
    },
    {
      step: '3',
      title: 'Start Sending',
      description: 'Send money instantly using @usernames. Private and fast.',
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Floating Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                ZKPay
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/product" className="text-gray-700 hover:text-blue-600 transition-colors">Product</a>
              <a href="/security" className="text-gray-700 hover:text-blue-600 transition-colors">Security</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6 animate-bounce-slow">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">🚀 In Development - Join Waitlist</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              The Future of
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Private Payments.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're building the UK's first privacy-preserving payment app using zero-knowledge proofs. 
              Currently in development. Join our waitlist to be first to access.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <button
                onClick={() => navigate('/register')}
                className="group bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all flex items-center space-x-2"
              >
                <span>Join Waitlist</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-blue-600 transition-all flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>FCA Sandbox</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>In Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>Privacy-First</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Phone Mockup */}
          <div className="mt-16 relative">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-1">
                <div className="bg-white rounded-3xl p-8">
                  {/* Placeholder - Beautiful gradient mockup */}
                  <div className="w-full aspect-video bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden relative">
                    {/* Mock Dashboard UI */}
                    <div className="absolute inset-0 p-8">
                      <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="h-4 bg-gray-300 rounded w-32"></div>
                          <div className="h-8 w-8 bg-blue-600 rounded-full"></div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">£1,250.50</div>
                        <div className="text-sm text-gray-500">Available Balance</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow p-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Privacy Badge */}
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>100% Private</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bouncing Arrow - Scroll Indicator */}
          <div className="mt-16 flex justify-center animate-fade-in">
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="group flex flex-col items-center space-y-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
              aria-label="Scroll to explore features"
            >
              <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Scroll to explore
              </span>
              <ArrowDown className="w-8 h-8 animate-bounce-arrow" />
            </button>
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

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need.
              <br />
              <span className="text-blue-600">Nothing you don't.</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modern banking features with uncompromising privacy protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveFeature(index)}
                  className={`group relative bg-white rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'shadow-2xl scale-105 border-2 border-blue-600' 
                      : 'shadow-lg hover:shadow-xl border-2 border-transparent'
                  }`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600">
                      {feature.stats}
                    </span>
                    <ChevronRight className={`w-5 h-5 text-blue-600 transition-transform ${
                      isActive ? 'translate-x-1' : ''
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get started in <span className="text-blue-600">60 seconds</span>
            </h2>
            <p className="text-xl text-gray-600">
              No paperwork. No credit checks. Just simple, private payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-600 to-transparent"></div>
                  )}
                  
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                      {step.step}
                    </div>
                    
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-7 h-7 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 text-center">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-blue-600">Vision</span>
            </h2>
            <p className="text-xl text-gray-600">
              Building the future of private payments in the UK
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy by Default</h3>
              <p className="text-gray-600">
                Using zero-knowledge proofs to ensure your transactions remain completely private. 
                Nobody, not even us, can see what you spend or who you pay.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Transfers</h3>
              <p className="text-gray-600">
                Combining blockchain technology with traditional banking to enable 
                instant, private payments across the UK.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regulatory Compliant</h3>
              <p className="text-gray-600">
                Working within FCA sandbox to build a privacy solution that meets 
                all UK regulatory requirements for payment services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Your privacy is
                <br />
                <span className="text-blue-400">our priority</span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8">
                Built on Secret Network's privacy-preserving blockchain technology. 
                Your transactions are encrypted end-to-end with zero-knowledge proofs.
              </p>
              
              <div className="space-y-4">
                {[
                  'Zero-knowledge cryptography',
                  '256-bit military-grade encryption',
                  'Trusted Execution Environments (TEEs)',
                  'FCA regulated and compliant'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => navigate('/security')}
                className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <span>Learn About Our Security</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 transform hover:scale-105 transition-transform">
                <Lock className="w-32 h-32 text-white mx-auto mb-6" />
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-blue-100">Private Transactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Be first to experience
            <br />
            <span className="text-blue-600">private payments</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            Join our waitlist to get early access when we launch in Q2 2025.
          </p>
          
          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-12 py-5 rounded-full text-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center space-x-2"
          >
            <span>Join Waitlist</span>
            <ArrowRight className="w-6 h-6" />
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            No payment required. Be notified when we launch.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="/compliance" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://twitter.com/zkpay" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="https://linkedin.com/company/zkpay" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="https://github.com/zkpay" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Z</span>
              </div>
              <span className="font-bold">ZKPay</span>
            </div>
            
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>© 2024 ZKPay. All rights reserved.</p>
              <p className="mt-1 text-xs">
                Currently in development. Not yet authorized for payment services. FCA Sandbox participant.
              </p>
            </div>
          </div>
        </div>
      </footer>

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