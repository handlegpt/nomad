'use client';

import { useState } from 'react';
import { StarIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState('banking');

  const categories = [
    { key: 'banking', label: 'Banking Services' },
    { key: 'insurance', label: 'Insurance Services' },
    { key: 'remote_work', label: 'Remote Work Platforms' },
    { key: 'language_learning', label: 'Language Learning' }
  ];

  const tools = {
    banking: {
      items: [
        {
          name: "Revolut",
          description: "Multi-currency account with competitive rates",
          features: ["No foreign exchange fees", "Free ATM withdrawals", "Multi-currency support"],
          rating: 4.8,
          url: "https://revolut.com"
        },
        {
          name: "Wise (TransferWise)",
          description: "International transfers and borderless accounts",
          features: ["Low transfer fees", "Real-time exchange rates", "Borderless accounts"],
          rating: 4.7,
          url: "https://wise.com"
        },
        {
          name: "N26",
          description: "European digital bank with global features",
          features: ["Free ATM withdrawals", "Real-time notifications", "Travel insurance"],
          rating: 4.5,
          url: "https://n26.com"
        },
        {
          name: "Monzo",
          description: "UK digital bank, travel-friendly",
          features: ["No foreign exchange fees", "Real-time notifications", "Budget management"],
          rating: 4.4,
          url: "https://monzo.com"
        }
      ]
    },
    insurance: {
      items: [
        {
          name: "SafetyWing",
          description: "Global health insurance for nomads",
          features: ["180+ countries covered", "COVID-19 coverage", "Flexible plans"],
          rating: 4.6,
          url: "https://safetywing.com"
        },
        {
          name: "World Nomads",
          description: "Travel insurance including adventure sports",
          features: ["Adventure sports coverage", "24/7 emergency support", "Flexible duration"],
          rating: 4.4,
          url: "https://worldnomads.com"
        },
        {
          name: "Genki",
          description: "Digital health insurance for global citizens",
          features: ["Digital-first approach", "Global coverage", "Simple claims"],
          rating: 4.3,
          url: "https://genki.world"
        },
        {
          name: "Cigna Global",
          description: "Premium international health insurance",
          features: ["Global network", "Premium service", "Comprehensive coverage"],
          rating: 4.5,
          url: "https://cigna.com"
        }
      ]
    },
    remote_work: {
      items: [
        {
          name: "Upwork",
          description: "Freelance platform for various skills",
          features: ["Wide range of projects", "Secure payment system", "Skill matching"],
          rating: 4.2,
          url: "https://upwork.com"
        },
        {
          name: "Fiverr",
          description: "Project-based freelance marketplace",
          features: ["Quick project completion", "Service packages", "Global clients"],
          rating: 4.1,
          url: "https://fiverr.com"
        },
        {
          name: "Toptal",
          description: "Premium freelance network for top talent",
          features: ["High-quality projects", "Premium clients", "Competitive rates"],
          rating: 4.5,
          url: "https://toptal.com"
        },
        {
          name: "Remote.co",
          description: "Remote job aggregation platform",
          features: ["Full-time remote jobs", "Direct company hiring", "Quality positions"],
          rating: 4.3,
          url: "https://remote.co"
        }
      ]
    },
    language_learning: {
      items: [
        {
          name: "Duolingo",
          description: "Free language learning app",
          features: ["Gamified learning", "40+ languages", "Free basic version"],
          rating: 4.3,
          url: "https://duolingo.com"
        },
        {
          name: "italki",
          description: "Online language tutoring platform",
          features: ["Native speakers", "Flexible scheduling", "Conversation practice"],
          rating: 4.4,
          url: "https://italki.com"
        },
        {
          name: "Babbel",
          description: "Conversation-focused language learning",
          features: ["Speech recognition", "Real conversations", "Grammar focus"],
          rating: 4.2,
          url: "https://babbel.com"
        },
        {
          name: "Memrise",
          description: "Memory science-driven language learning",
          features: ["Memory techniques", "Real videos", "Personalized learning"],
          rating: 4.1,
          url: "https://memrise.com"
        }
      ]
    }
  };

  const renderToolCard = (tool: any) => (
    <div key={tool.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{tool.name}</h3>
        <div className="flex items-center">
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <span className="ml-1 text-sm text-gray-600">{tool.rating}</span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{tool.description}</p>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
        <ul className="space-y-1">
          {tool.features.map((feature: string, index: number) => (
            <li key={index} className="text-sm text-gray-600 flex items-center">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        Visit Website
        <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Essential Tools</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Tools and services for digital nomads</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                activeCategory === category.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools[activeCategory as keyof typeof tools].items.map(renderToolCard)}
        </div>
      </div>
    </div>
  );
} 