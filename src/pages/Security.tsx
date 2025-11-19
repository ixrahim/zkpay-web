// src/pages/Security.tsx

import { Shield, Lock, Eye, Server, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PublicNav } from '@/components/PublicNav';

export default function Security() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <Shield className="w-20 h-20 mx-auto mb-6 text-blue-400" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Security & Privacy
            <br />
            <span className="text-blue-400">by Design</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your financial privacy is our top priority. Here's how we protect you.
          </p>
        </div>
      </section>

      {/* Zero-Knowledge Proofs */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Zero-Knowledge Cryptography
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                We use cutting-edge zero-knowledge proofs powered by Secret Network to ensure 
                your transactions are completely private.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                This means we can verify you have sufficient funds and authorization to make 
                a payment WITHOUT seeing who you're paying or how much. Not even we can see 
                your transaction details.
              </p>
              <div className="space-y-3">
                {[
                  'Transaction amounts are encrypted',
                  'Recipients are hidden',
                  'No transaction history stored',
                  'Mathematically provable privacy'
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white">
              <Eye className="w-16 h-16 mb-6 mx-auto" />
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">0%</div>
                <div className="text-blue-100 text-lg">
                  Visibility into your transactions
                </div>
                <p className="mt-4 text-sm text-blue-100">
                  Not even ZKPay can see who you pay or how much
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Security */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Bank-Grade Security
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: '256-bit Encryption',
                description: 'All data is encrypted with military-grade AES-256 encryption, both in transit and at rest.'
              },
              {
                icon: Server,
                title: 'TEE Technology',
                description: 'Secret Network uses Trusted Execution Environments (TEEs) for encrypted computation.'
              },
              {
                icon: Shield,
                title: 'Multi-Signature',
                description: 'Large transactions require multiple confirmations for added security.'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                  <Icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-50 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
              Regulatory Pathway
            </h2>
            <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-12">
              We're working within the FCA Regulatory Sandbox to develop our privacy-preserving payment solution.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'FCA Sandbox', desc: 'Currently in sandbox testing phase' },
                { title: 'AML/KYC Ready', desc: 'Compliant verification systems designed' },
                { title: 'Target: Full Authorization', desc: 'Seeking FCA authorization for launch' },
                { title: 'Privacy & Compliance', desc: 'Balancing privacy with UK regulations' }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center">
                  <CheckCircle2 className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <div className="font-bold text-gray-900 mb-2">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-gray-700 text-center">
                <strong>Important:</strong> ZKPay is currently in development and regulatory testing phase. 
                We are not yet authorized to offer payment services to the public. 
                Join our waitlist to be notified when we launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            What We Don't Do
          </h2>
          
          <div className="space-y-4">
            {[
              'We never sell your data to advertisers',
              'We never share transaction details with third parties',
              'We never track your spending for profiling',
              'We never store unencrypted transaction data',
              'We never have access to your encrypted transactions'
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 flex items-start space-x-4 shadow-sm">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Security Best Practices
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For You</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Enable biometric authentication (Face ID / Touch ID)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Use a strong, unique password</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Never share your login credentials</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Keep your app updated</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Report suspicious activity immediately</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Us</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>24/7 fraud monitoring and detection</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Regular security audits by external firms</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Bug bounty program for security researchers</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Automatic anomaly detection</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Instant notifications for all activity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Questions about security?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our security team is here to help
          </p>
          <a
            href="mailto:security@zkpay.uk"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all"
          >
            Contact Security Team
          </a>
        </div>
      </section>
    </div>
  );
}