'use client';

import { useState } from 'react';
import { StarIcon, ArrowTopRightOnSquareIcon, SparklesIcon, ShieldCheckIcon, CreditCardIcon, GlobeAltIcon } from '@heroicons/react/24/solid';

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState('banking');

  const categories = [
    { key: 'banking', label: 'Banking Services', icon: CreditCardIcon, color: 'blue' },
    { key: 'insurance', label: 'Insurance Services', icon: ShieldCheckIcon, color: 'green' },
    { key: 'remote_work', label: 'Remote Work Platforms', icon: GlobeAltIcon, color: 'purple' },
    { key: 'language_learning', label: 'Language Learning', icon: SparklesIcon, color: 'orange' }
  ];

  const tools = {
    banking: {
      items: [
        {
          name: 'Wise (TransferWise)',
          description: 'International money transfers with real exchange rates',
          rating: 4.8,
          features: ['Multi-currency accounts', 'Real exchange rates', 'Low fees', 'Global coverage'],
          url: 'https://wise.com',
          badge: 'Most Popular'
        },
        {
          name: 'Revolut',
          description: 'Digital banking with cryptocurrency support',
          rating: 4.6,
          features: ['Crypto trading', 'Stock trading', 'Travel insurance', 'No foreign fees'],
          url: 'https://revolut.com',
          badge: 'Trending'
        },
        {
          name: 'N26',
          description: 'Mobile banking with premium features',
          rating: 4.5,
          features: ['Free ATM withdrawals', 'Travel insurance', 'Investment options', 'Metal card'],
          url: 'https://n26.com'
        },
        {
          name: 'Monzo',
          description: 'UK-based digital bank with great UX',
          rating: 4.4,
          features: ['Fee-free spending abroad', 'Savings pots', 'Bill splitting', 'Real-time notifications'],
          url: 'https://monzo.com'
        }
      ]
    },
    insurance: {
      items: [
        {
          name: 'SafetyWing',
          description: 'Nomad-focused health insurance',
          rating: 4.7,
          features: ['Global coverage', 'Covid-19 coverage', 'Flexible plans', 'Easy claims'],
          url: 'https://safetywing.com',
          badge: 'Nomad Favorite'
        },
        {
          name: 'World Nomads',
          description: 'Comprehensive travel insurance',
          rating: 4.5,
          features: ['Adventure sports coverage', 'Trip cancellation', 'Medical evacuation', '24/7 support'],
          url: 'https://worldnomads.com'
        },
        {
          name: 'IMG Global',
          description: 'International health insurance',
          rating: 4.3,
          features: ['Comprehensive coverage', 'Direct billing', 'Mental health coverage', 'Pre-existing conditions'],
          url: 'https://imgglobal.com'
        },
        {
          name: 'Cigna Global',
          description: 'Premium international health insurance',
          rating: 4.6,
          features: ['Worldwide coverage', 'Direct settlement', 'Mental health', 'Dental coverage'],
          url: 'https://cignaglobal.com'
        }
      ]
    },
    remote_work: {
      items: [
        {
          name: 'Upwork',
          description: 'Freelance platform for remote work',
          rating: 4.4,
          features: ['Global client base', 'Secure payments', 'Time tracking', 'Skill tests'],
          url: 'https://upwork.com',
          badge: 'Top Platform'
        },
        {
          name: 'Fiverr',
          description: 'Freelance services marketplace',
          rating: 4.3,
          features: ['Gig-based work', 'Seller levels', 'Buyer protection', 'Multiple categories'],
          url: 'https://fiverr.com'
        },
        {
          name: 'Toptal',
          description: 'Elite freelance network',
          rating: 4.7,
          features: ['Top 3% talent', 'High rates', 'Quality guarantee', 'Direct client access'],
          url: 'https://toptal.com',
          badge: 'Premium'
        },
        {
          name: 'Remote.co',
          description: 'Remote job board and resources',
          rating: 4.5,
          features: ['Curated listings', 'Company profiles', 'Remote work guides', 'Career advice'],
          url: 'https://remote.co'
        }
      ]
    },
    language_learning: {
      items: [
        {
          name: 'Duolingo',
          description: 'Gamified language learning app',
          rating: 4.6,
          features: ['40+ languages', 'Free tier available', 'Gamification', 'Progress tracking'],
          url: 'https://duolingo.com',
          badge: 'Most Popular'
        },
        {
          name: 'italki',
          description: 'Online language tutoring platform',
          rating: 4.7,
          features: ['Native speakers', 'Flexible scheduling', 'Affordable rates', 'Multiple languages'],
          url: 'https://italki.com'
        },
        {
          name: 'Babbel',
          description: 'Conversation-focused language learning',
          rating: 4.4,
          features: ['Speech recognition', 'Cultural context', 'Grammar focus', 'Offline lessons'],
          url: 'https://babbel.com'
        },
        {
          name: 'Memrise',
          description: 'Memory-based language learning',
          rating: 4.3,
          features: ['Spaced repetition', 'Real native videos', 'Offline mode', 'Multiple languages'],
          url: 'https://memrise.com'
        }
      ]
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const renderToolCard = (tool: any) => (
    <div key={tool.name} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{tool.name}</h3>
            {tool.badge && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                {tool.badge}
              </span>
            )}
          </div>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  className={`h-5 w-5 ${i < Math.floor(tool.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600">{tool.rating}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-6 leading-relaxed">{tool.description}</p>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Features:</h4>
        <div className="grid grid-cols-1 gap-2">
          {tool.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
              {feature}
            </div>
          ))}
        </div>
      </div>

      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Visit Website
        <ArrowTopRightOnSquareIcon className="ml-2 h-5 w-5" />
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <SparklesIcon className="h-16 w-16 mx-auto text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Essential Tools for Nomads
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Curated tools and services that digital nomads actually use. From banking to insurance, 
            remote work platforms to language learning - everything you need for your nomadic lifestyle.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.key
                    ? `${getColorClasses(category.color)} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                <IconComponent className="h-6 w-6" />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tools[activeCategory as keyof typeof tools].items.map(renderToolCard)}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Missing a Tool?
            </h3>
            <p className="text-gray-600 mb-6">
              We're constantly updating our recommendations. Have a favorite tool that should be on this list?
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Suggest a Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 