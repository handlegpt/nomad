'use client';

import { useState } from 'react';
import { 
  GlobeAltIcon, 
  CurrencyDollarIcon, 
  WifiIcon, 
  ShieldCheckIcon, 
  ChatBubbleLeftRightIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline';

export default function CitiesPage() {
  const [selectedCity, setSelectedCity] = useState('barcelona');

  const cities = [
    {
      key: 'barcelona',
      name: 'Barcelona, Spain',
      country: 'Spain',
      description: 'Mediterranean lifestyle, pleasant weather, rich culture',
      visa: {
        digital_nomad: 'Available (2023)',
        tourist: '90 days (Schengen)',
        requirements: ['Income proof', 'Health insurance', 'Clean criminal record']
      },
      cost_of_living: {
        monthly_budget: '$2000-3500',
        accommodation: '$800-1500',
        food: '$300-500',
        transport: '$50-100'
      },
      internet: {
        average_speed: '100 Mbps',
        coworking_spaces: '50+',
        free_wifi: 'Widely available'
      },
      safety: 'Very safe',
      language: 'Spanish, Catalan',
      highlights: ['Beach life', 'Rich culture', 'Gastronomy', 'Tech scene']
    },
    {
      key: 'mexico_city',
      name: 'Mexico City, Mexico',
      country: 'Mexico',
      description: 'Vibrant city with rich culture and affordable living',
      visa: {
        digital_nomad: 'Available',
        tourist: '180 days',
        requirements: ['Valid passport', 'Return ticket', 'Sufficient funds']
      },
      cost_of_living: {
        monthly_budget: '$1500-2500',
        accommodation: '$500-1000',
        food: '$200-400',
        transport: '$30-60'
      },
      internet: {
        average_speed: '50 Mbps',
        coworking_spaces: '30+',
        free_wifi: 'Common in cafes'
      },
      safety: 'Generally safe (avoid certain areas)',
      language: 'Spanish',
      highlights: ['Affordable', 'Rich culture', 'Great food', 'Friendly people']
    },
    {
      key: 'bali',
      name: 'Bali, Indonesia',
      country: 'Indonesia',
      description: 'Tropical paradise with spiritual culture',
      visa: {
        digital_nomad: 'Available (B211A)',
        tourist: '30 days (extendable)',
        requirements: ['Sponsor letter', 'Bank statement', 'Return ticket']
      },
      cost_of_living: {
        monthly_budget: '$1000-2000',
        accommodation: '$300-800',
        food: '$150-300',
        transport: '$50-100'
      },
      internet: {
        average_speed: '25 Mbps',
        coworking_spaces: '20+',
        free_wifi: 'Common in tourist areas'
      },
      safety: 'Very safe',
      language: 'Indonesian, English',
      highlights: ['Tropical climate', 'Spiritual culture', 'Affordable', 'Beautiful nature']
    },
    {
      key: 'tokyo',
      name: 'Tokyo, Japan',
      country: 'Japan',
      description: 'High-tech city with perfect infrastructure',
      visa: {
        digital_nomad: 'Not available',
        tourist: '90 days',
        requirements: ['Valid passport', 'Return ticket', 'Sufficient funds']
      },
      cost_of_living: {
        monthly_budget: '$3000-5000',
        accommodation: '$1500-2500',
        food: '$400-600',
        transport: '$100-150'
      },
      internet: {
        average_speed: '200 Mbps',
        coworking_spaces: '100+',
        free_wifi: 'Extensive coverage'
      },
      safety: 'Extremely safe',
      language: 'Japanese',
      highlights: ['Perfect infrastructure', 'High-tech', 'Clean', 'Efficient']
    },
    {
      key: 'lisbon',
      name: 'Lisbon, Portugal',
      country: 'Portugal',
      description: 'Historical charm meets modern digital nomad scene',
      visa: {
        digital_nomad: 'Available (D7 visa)',
        tourist: '90 days (Schengen)',
        requirements: ['Passive income proof', 'Health insurance', 'Accommodation proof']
      },
      cost_of_living: {
        monthly_budget: '$1800-3000',
        accommodation: '$600-1200',
        food: '$250-450',
        transport: '$40-80'
      },
      internet: {
        average_speed: '100 Mbps',
        coworking_spaces: '40+',
        free_wifi: 'Widely available'
      },
      safety: 'Very safe',
      language: 'Portuguese, English',
      highlights: ['Historical architecture', 'Gastronomy', 'Friendly community', 'Pleasant climate']
    },
    {
      key: 'chiang_mai',
      name: 'Chiang Mai, Thailand',
      country: 'Thailand',
      description: 'Peaceful ancient city with slow pace of life',
      visa: {
        digital_nomad: 'Available (ED visa)',
        tourist: '30 days (extendable)',
        requirements: ['Language school registration', 'Bank statement', 'Accommodation proof']
      },
      cost_of_living: {
        monthly_budget: '$800-1500',
        accommodation: '$200-500',
        food: '$100-200',
        transport: '$30-60'
      },
      internet: {
        average_speed: '30 Mbps',
        coworking_spaces: '15+',
        free_wifi: 'Common in cafes'
      },
      safety: 'Very safe',
      language: 'Thai, English',
      highlights: ['Ancient temples', 'Affordable living', 'Food paradise', 'Relaxed lifestyle']
    },
    {
      key: 'budapest',
      name: 'Budapest, Hungary',
      country: 'Hungary',
      description: 'Central European gem with thermal baths',
      visa: {
        digital_nomad: 'Available (White Card)',
        tourist: '90 days (Schengen)',
        requirements: ['Income proof', 'Health insurance', 'Accommodation contract']
      },
      cost_of_living: {
        monthly_budget: '$1200-2200',
        accommodation: '$400-800',
        food: '$200-350',
        transport: '$30-60'
      },
      internet: {
        average_speed: '80 Mbps',
        coworking_spaces: '25+',
        free_wifi: 'Widely available'
      },
      safety: 'Very safe',
      language: 'Hungarian, English',
      highlights: ['Thermal baths', 'Historical architecture', 'Nightlife', 'Good value']
    },
    {
      key: 'porto',
      name: 'Porto, Portugal',
      country: 'Portugal',
      description: 'Wine capital with artistic atmosphere',
      visa: {
        digital_nomad: 'Available (D7 visa)',
        tourist: '90 days (Schengen)',
        requirements: ['Passive income proof', 'Health insurance', 'Accommodation proof']
      },
      cost_of_living: {
        monthly_budget: '$1500-2500',
        accommodation: '$500-900',
        food: '$200-350',
        transport: '$30-60'
      },
      internet: {
        average_speed: '100 Mbps',
        coworking_spaces: '20+',
        free_wifi: 'Widely available'
      },
      safety: 'Very safe',
      language: 'Portuguese, English',
      highlights: ['Wine culture', 'Artistic atmosphere', 'Riverside beauty', 'Friendly community']
    }
  ];

  const selectedCityData = cities.find(city => city.key === selectedCity) || cities[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nomad Cities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Popular destinations for digital nomads with visa information, cost of living, and local insights
          </p>
        </div>

        {/* City Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cities.map((city) => (
            <button
              key={city.key}
              onClick={() => setSelectedCity(city.key)}
              className={`p-4 rounded-lg text-left transition-colors ${
                selectedCity === city.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <h3 className="font-semibold">{city.name}</h3>
              <p className="text-sm opacity-75">{city.country}</p>
            </button>
          ))}
        </div>

        {/* City Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedCityData.name}</h2>
                <p className="text-gray-600 mb-6">{selectedCityData.description}</p>

                <div className="space-y-6">
                  {/* Visa Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <GlobeAltIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Visa Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Digital Nomad Visa</p>
                          <p className="font-medium">{selectedCityData.visa.digital_nomad}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tourist Visa</p>
                          <p className="font-medium">{selectedCityData.visa.tourist}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Requirements:</p>
                        <ul className="text-sm space-y-1">
                          {selectedCityData.visa.requirements.map((req, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Cost of Living */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                      Cost of Living
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Monthly Budget</p>
                          <p className="font-medium">{selectedCityData.cost_of_living.monthly_budget}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Accommodation</p>
                          <p className="font-medium">{selectedCityData.cost_of_living.accommodation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Food</p>
                          <p className="font-medium">{selectedCityData.cost_of_living.food}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Transport</p>
                          <p className="font-medium">{selectedCityData.cost_of_living.transport}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="space-y-6">
                  {/* Internet & Workspace */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <WifiIcon className="h-5 w-5 mr-2 text-purple-600" />
                      Internet & Workspace
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Average Speed</p>
                          <p className="font-medium">{selectedCityData.internet.average_speed}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Coworking Spaces</p>
                          <p className="font-medium">{selectedCityData.internet.coworking_spaces}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Free WiFi</p>
                          <p className="font-medium">{selectedCityData.internet.free_wifi}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Safety & Language */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-600" />
                      Safety & Language
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Safety Level</p>
                          <p className="font-medium">{selectedCityData.safety}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Languages</p>
                          <p className="font-medium">{selectedCityData.language}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-orange-600" />
                      Highlights
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {selectedCityData.highlights.map((highlight, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 