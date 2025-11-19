// src/pages/About.tsx

import { Shield, Target, Users, Globe, Award, TrendingUp, Heart, Zap } from 'lucide-react';
import { PublicNav } from '@/components/PublicNav';

export default function About() {
  const team = [
    {
      name: 'Ibrahim Bashua',
      role: 'Founder & CEO',
      avatar: 'assets/profilePic.jpeg',
      bio: 'Former insuretech engineer with 5+ years building payment systems.',
      linkedin: 'https://www.linkedin.com/in/ibrahim-bashua-842528257'
    },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your financial data belongs to you. We never sell or share your information.'
    },
    {
      icon: Users,
      title: 'User Focused',
      description: 'Every feature we build starts with understanding what you need.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We hold ourselves to the highest standards of security and reliability.'
    },
    {
      icon: Heart,
      title: 'Trust',
      description: 'Transparent, honest, and always acting in your best interest.'
    }
  ];

  const milestones = [
    { year: '2024 Q4', event: 'Company Founded', description: 'Started with a mission to bring privacy to UK payments' },
    { year: '2025 Q1', event: 'MVP Development', description: 'Building core platform with Secret Network integration' },
    { year: 'Current', event: 'Seeking Seed Funding', description: 'Raising £2M to enable operations and FCA application' },
    { year: 'Post-Funding', event: 'FCA Sandbox Entry', description: 'Apply for FCA Regulatory Sandbox program' },
    { year: 'Post-Funding', event: 'Beta Testing', description: 'Limited beta with selected users' },
    { year: 'Target', event: 'Public Launch', description: 'Full FCA authorization and public availability' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            We're building the future of
            <br />
            <span className="text-blue-200">private payments</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            ZKPay was born from a simple belief: your financial privacy shouldn't be compromised for convenience.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10">
              <Target className="w-14 h-14 text-blue-600 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To make private, instant payments accessible to everyone in the UK. We're combining 
                cutting-edge zero-knowledge cryptography with a delightful user experience to prove 
                that privacy and convenience can coexist.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10">
              <Globe className="w-14 h-14 text-purple-600 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                A world where financial privacy is the default, not the exception. We envision a future 
                where people can transact freely without surveillance, judgment, or discrimination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-xl leading-relaxed mb-6">
              ZKPay started when we realized that UK payment apps were far behind on privacy. 
              Every transaction you make is tracked, stored, and often sold to advertisers.
            </p>
            <p className="text-xl leading-relaxed mb-6">
              As engineers who had built traditional payment systems, we knew there was a better way. 
              By leveraging Secret Network's privacy-preserving blockchain technology, we can build 
              a payment app that's both instant AND private.
            </p>
            <p className="text-xl leading-relaxed">
              We're currently developing our MVP and seeking seed funding to enable full operations. 
              The funding will allow us to complete development, apply for the FCA Regulatory Sandbox, 
              and bring truly private payments to the UK market.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Our Values</h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            These principles guide every decision we make
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Meet the Team</h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Experienced builders from fintech, blockchain, and regulatory backgrounds
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div></div>
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="text-6xl mb-4 flex justify-center"><img src={member.avatar} className='object-cover object-center rounded-[50%] w-[150px]' /></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6">{member.bio}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Connect on LinkedIn →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Journey</h2>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className={`w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold ${milestone.year == 'Post-Funding' ? 'text-md text-center' : 'text-md text-center' }`}>
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{milestone.event}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fundraising */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Seeking Seed Investment</h2>
          <p className="text-xl text-gray-400 mb-12">
            Raising £2M to enable operations, complete development, and enter FCA Sandbox
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">£2M</div>
              <div className="text-sm text-gray-300">Target Raise</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">FCA</div>
              <div className="text-sm text-gray-300">Sandbox (Post-Funding)</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">2026</div>
              <div className="text-sm text-gray-300">Target Launch</div>
            </div>
          </div>

          <p className="text-gray-300 mb-8">
            Interested in joining our journey? We're in conversations with leading European VCs.
          </p>

          <a
            href="/contact"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Join us on our mission
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're always looking for talented people who share our values
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/careers"
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all"
            >
              View Open Roles
            </a>
            <a
              href="/contact"
              className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-blue-600 transition-all"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}