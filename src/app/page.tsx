'use client';

import Link from 'next/link';
import { WrenchScrewdriverIcon, MapPinIcon, CalculatorIcon, BookOpenIcon, UserGroupIcon, GlobeAltIcon, ArrowRightIcon, StarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const features = [
    {
      icon: WrenchScrewdriverIcon,
      title: 'Essential Tools',
      description: 'Digital banking, insurance, and remote work platforms',
      href: '/tools',
      color: 'blue'
    },
    {
      icon: MapPinIcon,
      title: 'Nomad Cities',
      description: 'Popular destinations with visa and cost information',
      href: '/cities',
      color: 'green'
    },
    {
      icon: CalculatorIcon,
      title: 'Tax Guidance',
      description: '183-day rule and double taxation treaties',
      href: '/tax',
      color: 'purple'
    },
    {
      icon: BookOpenIcon,
      title: 'Guides & Resources',
      description: 'Visa applications, moving checklists, and tips',
      href: '/guides',
      color: 'orange'
    },
    {
      icon: UserGroupIcon,
      title: 'Community',
      description: 'Connect with fellow digital nomads worldwide',
      href: '/community',
      color: 'indigo'
    }
  ];

  const stats = [
    { number: '180+', label: 'Countries Covered', icon: GlobeAltIcon },
    { number: '50+', label: 'Cities Featured', icon: MapPinIcon },
    { number: '100+', label: 'Tools & Services', icon: WrenchScrewdriverIcon },
    { number: '24/7', label: 'Community Support', icon: UserGroupIcon }
  ];

  const testimonials = [
    {
      text: "This site helped me find the perfect city for my digital nomad lifestyle. The visa information was incredibly accurate!",
      author: "Sarah M.",
      location: "Barcelona, Spain"
    },
    {
      text: "The tax guidance saved me from making expensive mistakes. Essential resource for any nomad!",
      author: "Mike R.",
      location: "Lisbon, Portugal"
    },
    {
      text: "Found my remote work community through this platform. The tools section is gold!",
      author: "Emma L.",
      location: "Chiang Mai, Thailand"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      indigo: 'bg-indigo-500'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-6">
              <GlobeAltIcon className="h-16 w-16 mx-auto text-white opacity-80" />
            </div>
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Digital Nomad
              <span className="block text-blue-200">Information Hub</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Your comprehensive guide for digital nomads. Find visa information, tax guidance, 
              essential tools, and connect with the global nomad community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/tools" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Tools
              </Link>
              <Link 
                href="/cities" 
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Browse Cities
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                  className="group relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`w-16 h-16 ${getColorClasses(feature.color)} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                    Learn more
                    <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Global Nomad Community
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of digital nomads worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="text-center group">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Nomads Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <CheckCircleIcon className="h-16 w-16 mx-auto text-green-300 mb-6" />
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Explore our comprehensive resources and join the global digital nomad community.
            </p>
          </div>
          <Link 
            href="/tools" 
            className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center"
          >
            Get Started
            <ArrowRightIcon className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
} 