'use client';

import { useState } from 'react';
import { CalendarIcon, DocumentTextIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Country {
  name: string;
  days: number;
  notes: string;
}

interface TaxSection {
  title: string;
  description: string;
  countries?: Country[];
  common_treaties?: string[];
}

export default function TaxPage() {
  const [activeSection, setActiveSection] = useState('183_day_rule');

  const taxData: Record<string, TaxSection> = {
    "183_day_rule": {
      title: "183-Day Rule",
      description: "Most countries consider you a tax resident after 183 days",
      countries: [
        {
          name: "Spain",
          days: 183,
          notes: "Also considers habitual residence"
        },
        {
          name: "Mexico",
          days: 183,
          notes: "Consecutive or non-consecutive days"
        },
        {
          name: "Thailand",
          days: 180,
          notes: "Any calendar year"
        },
        {
          name: "Japan",
          days: 183,
          notes: "Any 12-month period"
        },
        {
          name: "Portugal",
          days: 183,
          notes: "Consecutive or non-consecutive days"
        },
        {
          name: "Hungary",
          days: 183,
          notes: "Within calendar year"
        }
      ]
    },
    "double_taxation": {
      title: "Double Taxation Treaties",
      description: "Agreements to avoid double taxation",
      common_treaties: [
        "US has treaties with 60+ countries",
        "UK has treaties with 130+ countries",
        "Germany has treaties with 90+ countries",
        "Portugal has treaties with 70+ countries",
        "Hungary has treaties with 80+ countries"
      ]
    }
  };

  const sections = [
    { key: '183_day_rule', label: '183-Day Rule' },
    { key: 'double_taxation', label: 'Double Taxation Treaties' }
  ];

  const selectedData = taxData[activeSection];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tax Reminder</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay tax compliant with our comprehensive guide to tax rules and treaties
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                activeSection === section.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedData.title}</h2>
              <p className="text-xl text-gray-600">{selectedData.description}</p>
            </div>

            {activeSection === '183_day_rule' && selectedData.countries && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    <p className="text-yellow-800 font-medium">
                      Important: Tax rules vary by country. Always consult with a tax professional for your specific situation.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedData.countries.map((country: Country, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{country.name}</h3>
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-medium text-blue-600">{country.days} days</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{country.notes}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-blue-400 mr-2" />
                    <div>
                      <p className="text-blue-800 font-medium">Pro Tips:</p>
                      <ul className="text-blue-700 text-sm mt-2 space-y-1">
                        <li>• Keep detailed travel records and receipts</li>
                        <li>• Consider using tax tracking apps</li>
                        <li>• Plan your stays carefully to avoid tax residency</li>
                        <li>• Consult local tax professionals</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'double_taxation' && selectedData.common_treaties && (
              <div className="space-y-6">
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                    <p className="text-green-800 font-medium">
                      Good news: Most countries have double taxation treaties to prevent paying tax twice.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedData.common_treaties.map((treaty: string, index: number) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
                      <span className="text-gray-900">{treaty}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-6 w-6 text-white" />
                    <div className="ml-3">
                      <p className="text-blue-800 font-medium">Understanding Double Taxation Treaties:</p>
                      <ul className="text-blue-700 text-sm mt-2 space-y-1">
                        <li>• Determine which country has primary taxing rights</li>
                        <li>• Provide relief from double taxation</li>
                        <li>• Define tax residency rules</li>
                        <li>• Specify which income types are covered</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 