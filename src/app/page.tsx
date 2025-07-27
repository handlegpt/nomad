'use client';

import Link from 'next/link';
import { WrenchScrewdriverIcon, MapPinIcon, CalculatorIcon, BookOpenIcon, UserGroupIcon, GlobeAltIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const features = [
    {
      icon: WrenchScrewdriverIcon,
      title: 'Essential Tools',
      description: 'Digital banking, insurance, and remote work platforms',
      href: '/tools'
    },
    {
      icon: MapPinIcon,
      title: 'Nomad Cities',
      description: 'Popular destinations with visa and cost information',
      href: '/cities'
    },
    {
      icon: CalculatorIcon,
      title: 'Tax Guidance',
      description: '183-day rule and double taxation treaties',
      href: '/tax'
    },
    {
      icon: BookOpenIcon,
      title: 'Guides & Resources',
      description: 'Visa applications, moving checklists, and tips',
      href: '/guides'
    },
    {
      icon: UserGroupIcon,
      title: 'Community',
      description: 'Connect with fellow digital nomads worldwide',
      href: '/community'
    }
  ];

  const stats = [
    { number: '180+', label: 'Countries Covered' },
    { number: '50+', label: 'Cities Featured' },
    { number: '100+', label: 'Tools & Services' },
    { number: '24/7', label: 'Community Support' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Digital Nomad Info
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Your comprehensive guide for digital nomads. Find visa information, tax guidance, 
              essential tools, and connect with the global nomad community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/tools" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Tools
              </Link>
              <Link 
                href="/cities" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Browse Cities
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive resources for your digital nomad journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    Learn more
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Global Nomad Community
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of digital nomads worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8">
            Explore our comprehensive resources and join the global digital nomad community.
          </p>
          <Link 
            href="/tools" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            Get Started
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
} 