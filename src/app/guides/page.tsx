'use client';

import { useState } from 'react';
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CalendarIcon,
  GlobeAltIcon,
  HomeIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState('visa');

  const guides = {
    visa: {
      title: 'Visa Guides',
      description: 'Step-by-step guides for popular digital nomad visas',
      items: [
        {
          title: 'Spain Digital Nomad Visa',
          description: 'Complete guide to Spain\'s digital nomad visa application',
          steps: [
            'Gather required documents (passport, income proof, health insurance)',
            'Book accommodation for at least 6 months',
            'Apply at Spanish consulate in your home country',
            'Wait for approval (2-4 weeks)',
            'Travel to Spain and register with local authorities'
          ],
          requirements: ['€2,160+ monthly income', 'Health insurance', 'Clean criminal record'],
          processing_time: '2-4 weeks',
          validity: '1 year (renewable)'
        },
        {
          title: 'Portugal D7 Visa',
          description: 'Passive income visa for Portugal residency',
          steps: [
            'Prove passive income of €7,200+ annually',
            'Secure accommodation in Portugal',
            'Apply at Portuguese consulate',
            'Provide bank statements and income proof',
            'Wait for approval and travel to Portugal'
          ],
          requirements: ['€7,200+ annual passive income', 'Accommodation proof', 'Health insurance'],
          processing_time: '3-6 months',
          validity: '1 year (renewable)'
        },
        {
          title: 'Thailand ED Visa',
          description: 'Education visa for long-term stay in Thailand',
          steps: [
            'Enroll in Thai language school or course',
            'Receive acceptance letter from school',
            'Apply at Thai consulate with documents',
            'Pay visa fee and wait for approval',
            'Enter Thailand and extend visa locally'
          ],
          requirements: ['School enrollment', 'Bank statement', 'Health insurance'],
          processing_time: '1-2 weeks',
          validity: '3 months (extendable)'
        }
      ]
    },
    moving: {
      title: 'Moving Checklists',
      description: 'Essential checklists for smooth relocation',
      items: [
        {
          title: 'Pre-Move Checklist (2-3 months)',
          description: 'Tasks to complete before your move',
          steps: [
            'Research visa requirements and start application',
            'Book accommodation for first month',
            'Arrange health insurance coverage',
            'Notify banks and update addresses',
            'Research local banking options',
            'Plan transportation and arrival logistics'
          ],
          tips: ['Start visa process early', 'Book accommodation in advance', 'Research local customs']
        },
        {
          title: 'Packing Checklist',
          description: 'Essential items for digital nomads',
          steps: [
            'Passport and visa documents',
            'Laptop and essential electronics',
            'Universal power adapter',
            'Basic medical supplies',
            'Comfortable clothing for climate',
            'Important documents (copies)'
          ],
          tips: ['Pack light but smart', 'Bring backup electronics', 'Keep documents organized']
        },
        {
          title: 'First Week Checklist',
          description: 'Tasks to complete upon arrival',
          steps: [
            'Register with local authorities (if required)',
            'Set up local bank account',
            'Get local SIM card',
            'Explore neighborhood and find essentials',
            'Join local expat/nomad groups',
            'Set up workspace and internet'
          ],
          tips: ['Take time to adjust', 'Meet other nomads', 'Learn basic local phrases']
        }
      ]
    },
    cohabitation: {
      title: 'Cohabitation Guides',
      description: 'Tips for living with other digital nomads',
      items: [
        {
          title: 'Finding Roommates',
          description: 'How to find compatible roommates',
          steps: [
            'Join local Facebook groups and forums',
            'Use platforms like NomadList and Reddit',
            'Attend local meetups and events',
            'Ask for recommendations from other nomads',
            'Screen potential roommates carefully',
            'Discuss expectations and house rules'
          ],
          tips: ['Be clear about your lifestyle', 'Discuss work schedules', 'Set boundaries early']
        },
        {
          title: 'House Rules & Communication',
          description: 'Establishing good cohabitation practices',
          steps: [
            'Create shared house rules document',
            'Set up group chat for communication',
            'Establish cleaning schedule',
            'Discuss noise levels and work hours',
            'Plan shared expenses and utilities',
            'Schedule regular house meetings'
          ],
          tips: ['Be respectful of others', 'Communicate openly', 'Compromise when needed']
        },
        {
          title: 'Conflict Resolution',
          description: 'Handling disagreements in shared spaces',
          steps: [
            'Address issues early before they escalate',
            'Use "I" statements to express concerns',
            'Listen actively to other perspectives',
            'Find mutually acceptable solutions',
            'Document agreements in writing',
            'Know when to involve landlord or mediator'
          ],
          tips: ['Stay calm and professional', 'Focus on solutions', 'Maintain relationships']
        }
      ]
    }
  };

  const categories = [
    { key: 'visa', label: 'Visa Guides' },
    { key: 'moving', label: 'Moving Checklists' },
    { key: 'cohabitation', label: 'Cohabitation Guides' }
  ];

  const selectedGuides = guides[activeCategory as keyof typeof guides];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Guides & Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive guides for visa applications, moving checklists, and cohabitation tips
          </p>
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

        {/* Guides Content */}
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedGuides.title}</h2>
            <p className="text-xl text-gray-600">{selectedGuides.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {selectedGuides.items.map((guide, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{guide.title}</h3>
                  <p className="text-gray-600 mb-6">{guide.description}</p>

                  <div className="space-y-6">
                    {/* Steps */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <ArrowRightIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Steps
                      </h4>
                      <ol className="space-y-2">
                        {guide.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start">
                            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                              {stepIndex + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Requirements or Tips */}
                    {('requirements' in guide) && (
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                          <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
                          Requirements
                        </h4>
                        <ul className="space-y-2">
                          {guide.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {('tips' in guide) && (
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                          <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-600" />
                          Tips
                        </h4>
                        <ul className="space-y-2">
                          {guide.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></div>
                              <span className="text-gray-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Processing Time and Validity (for visa guides) */}
                    {('processing_time' in guide) && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-1">Processing Time</h5>
                          <p className="text-gray-600">{guide.processing_time}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-1">Validity</h5>
                          <p className="text-gray-600">{guide.validity}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 