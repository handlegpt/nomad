'use client';

import { useState } from 'react';
import { 
  Calculator, 
  FileText, 
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function TaxPage() {
  const [activeCategory, setActiveCategory] = useState('basics');

  const taxGuides = {
    basics: {
      title: 'Tax Basics',
      description: 'Understanding tax obligations for digital nomads',
      items: [
        {
          title: 'Tax Residency vs Citizenship',
          description: 'Understanding the difference between tax residency and citizenship',
          content: 'Tax residency is determined by where you spend most of your time, not your citizenship. Most countries consider you a tax resident if you spend more than 183 days there.',
          tips: ['Keep track of days spent in each country', 'Understand local tax laws', 'Consider tax treaties']
        },
        {
          title: '183-Day Rule',
          description: 'How the 183-day rule affects your tax obligations',
          content: 'Many countries use the 183-day rule to determine tax residency. If you spend more than 183 days in a country, you may be considered a tax resident.',
          tips: ['Track your travel dates carefully', 'Use digital tools to log stays', 'Keep documentation']
        },
        {
          title: 'Tax Treaties',
          description: 'How tax treaties can help avoid double taxation',
          content: 'Tax treaties between countries can help you avoid paying taxes twice on the same income. They often include provisions for digital nomads.',
          tips: ['Research treaties between your countries', 'Consult with tax professionals', 'Keep treaty documents']
        }
      ]
    },
    countries: {
      title: 'Country-Specific Tax Rules',
      description: 'Tax rules for popular digital nomad destinations',
      items: [
        {
          title: 'Portugal Tax System',
          description: 'Understanding Portugal\'s tax system for digital nomads',
          content: 'Portugal offers the Non-Habitual Resident (NHR) program, which provides significant tax benefits for new residents, including 0% tax on foreign income for 10 years.',
          tips: ['Apply for NHR status within 6 months', 'Keep foreign income separate', 'Consult local tax advisor']
        },
        {
          title: 'Thailand Tax Rules',
          description: 'Tax obligations for digital nomads in Thailand',
          content: 'Thailand taxes income earned within the country. Foreign income is generally not taxed if you don\'t bring it into Thailand in the same year.',
          tips: ['Keep income outside Thailand', 'Understand remittance rules', 'File tax returns if required']
        },
        {
          title: 'Mexico Tax System',
          description: 'Tax considerations for digital nomads in Mexico',
          content: 'Mexico has a territorial tax system. You\'re only taxed on Mexican-source income, but you may need to file returns if you have Mexican income.',
          tips: ['Separate Mexican and foreign income', 'File returns if you have local income', 'Keep good records']
        }
      ]
    },
    strategies: {
      title: 'Tax Strategies',
      description: 'Legal strategies to optimize your tax situation',
      items: [
        {
          title: 'Offshore Banking',
          description: 'Using offshore banking for tax optimization',
          content: 'Offshore banking can help you manage your finances and potentially reduce tax obligations, but it must be done legally and transparently.',
          tips: ['Choose reputable banks', 'Comply with reporting requirements', 'Seek professional advice']
        },
        {
          title: 'Company Structure',
          description: 'Setting up companies for tax efficiency',
          content: 'Setting up a company in a tax-friendly jurisdiction can help you manage your business income and reduce overall tax burden.',
          tips: ['Choose appropriate jurisdiction', 'Understand compliance requirements', 'Work with professionals']
        },
        {
          title: 'Retirement Accounts',
          description: 'Using retirement accounts for tax benefits',
          content: 'Contributing to retirement accounts can provide immediate tax benefits and help you save for the future while reducing current tax liability.',
          tips: ['Maximize contributions', 'Understand withdrawal rules', 'Consider international options']
        }
      ]
    }
  };

  const categories = [
    { key: 'basics', label: 'Tax Basics', icon: Calculator },
    { key: 'countries', label: 'Country Rules', icon: Globe },
    { key: 'strategies', label: 'Strategies', icon: TrendingUp }
  ];

  const selectedGuides = taxGuides[activeCategory as keyof typeof taxGuides];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tax Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding tax obligations and strategies for digital nomads
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-colors ${
                  activeCategory === category.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tax Guides Content */}
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedGuides.title}</h2>
            <p className="text-xl text-gray-600">{selectedGuides.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {selectedGuides.items.map((guide, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{guide.content}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Key Tips:
                  </h4>
                  <ul className="space-y-1">
                    {guide.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
              <p className="text-yellow-700 text-sm leading-relaxed">
                This information is for educational purposes only and should not be considered as tax advice. 
                Tax laws vary by country and change frequently. Always consult with a qualified tax professional 
                or accountant who specializes in international tax law before making any decisions about your tax situation.
              </p>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Additional Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Tax Documents</h3>
              <p className="text-sm text-gray-600">
                Templates and checklists for organizing your tax documents
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Calculator className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Tax Calculator</h3>
              <p className="text-sm text-gray-600">
                Calculate your potential tax obligations in different countries
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Tax Professionals</h3>
              <p className="text-sm text-gray-600">
                Directory of tax professionals specializing in digital nomads
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 