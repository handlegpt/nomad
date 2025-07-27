'use client';

import { useState } from 'react';
import { MapPinIcon, CurrencyDollarIcon, WifiIcon, ShieldCheckIcon, StarIcon, GlobeAltIcon, ArrowRightIcon, CalendarIcon, HomeIcon, UtensilsIcon, BusIcon, PhoneIcon, CreditCardIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface City {
  name: string;
  country: string;
  description: string;
  cost: string;
  internet: string;
  safety: string;
  visa: string;
  weather: string;
  nomadScore: number;
  image: string;
  highlights: string[];
  tips: string[];
  // 新增详细信息
  detailedInfo: {
    visaDetails: {
      touristVisa: string;
      digitalNomadVisa: string;
      requirements: string[];
      applicationProcess: string;
      fees: string;
      processingTime: string;
    };
    costBreakdown: {
      accommodation: {
        budget: string;
        midRange: string;
        luxury: string;
        areas: string[];
      };
      food: {
        localRestaurant: string;
        midRangeRestaurant: string;
        groceries: string;
        popularDishes: string[];
      };
      transportation: {
        publicTransport: string;
        taxi: string;
        scooter: string;
        bike: string;
      };
      utilities: {
        internet: string;
        electricity: string;
        water: string;
        mobile: string;
      };
      entertainment: {
        coworking: string;
        gym: string;
        cinema: string;
        nightlife: string;
      };
    };
    practicalInfo: {
      bestTimeToVisit: string;
      language: string;
      currency: string;
      timezone: string;
      emergencyNumbers: string[];
      hospitals: string[];
      embassies: string[];
    };
    nomadCommunity: {
      coworkingSpaces: string[];
      meetupGroups: string[];
      onlineCommunities: string[];
      events: string[];
    };
    neighborhoods: {
      name: string;
      description: string;
      pros: string[];
      cons: string[];
      averageRent: string;
      vibe: string;
    }[];
  };
}

export default function CitiesPage() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const cities: City[] = [
    {
      name: 'Barcelona',
      country: 'Spain',
      description: 'Mediterranean charm with excellent infrastructure and vibrant culture',
      cost: '$2,500 - $4,000/month',
      internet: '100 Mbps average',
      safety: 'Very Safe',
      visa: 'Schengen Visa (90 days)',
      weather: 'Mediterranean climate, mild winters',
      nomadScore: 9.2,
      image: '🇪🇸',
      highlights: ['Beautiful beaches', 'Rich culture', 'Great food scene', 'Excellent public transport'],
      tips: ['Learn some Spanish', 'Avoid tourist traps', 'Get a local SIM card', 'Use public transport'],
      detailedInfo: {
        visaDetails: {
          touristVisa: '90 days within 180 days (Schengen)',
          digitalNomadVisa: 'Available since 2023',
          requirements: [
            'Valid passport (6+ months validity)',
            'Proof of income (€2,160/month minimum)',
            'Health insurance coverage',
            'Clean criminal record',
            'Proof of accommodation'
          ],
          applicationProcess: 'Apply at Spanish consulate or embassy in your home country',
          fees: '€80 for tourist visa, €500 for digital nomad visa',
          processingTime: '2-4 weeks for tourist visa, 1-2 months for digital nomad visa'
        },
        costBreakdown: {
          accommodation: {
            budget: '$800-1,200/month',
            midRange: '$1,200-2,000/month',
            luxury: '$2,000-4,000/month',
            areas: ['Gràcia', 'Eixample', 'Sant Antoni', 'Poblenou', 'El Born']
          },
          food: {
            localRestaurant: '$8-15 per meal',
            midRangeRestaurant: '$15-30 per meal',
            groceries: '$300-500/month',
            popularDishes: ['Paella', 'Tapas', 'Jamón ibérico', 'Catalan cream', 'Seafood paella']
          },
          transportation: {
            publicTransport: '$40-50/month (unlimited)',
            taxi: '$10-20 for short trips',
            scooter: '$200-300/month rental',
            bike: '$15-25/day rental'
          },
          utilities: {
            internet: '$30-50/month',
            electricity: '$80-120/month',
            water: '$20-30/month',
            mobile: '$15-25/month'
          },
          entertainment: {
            coworking: '$150-300/month',
            gym: '$40-80/month',
            cinema: '$8-12 per ticket',
            nightlife: '$50-100 per night out'
          }
        },
        practicalInfo: {
          bestTimeToVisit: 'March-May and September-November',
          language: 'Spanish (Catalan in Catalonia)',
          currency: 'Euro (€)',
          timezone: 'CET (UTC+1)',
          emergencyNumbers: ['112 (General)', '061 (Medical)', '091 (Police)'],
          hospitals: ['Hospital Clínic', 'Hospital Sant Pau', 'Hospital del Mar'],
          embassies: ['US Embassy', 'UK Embassy', 'Canadian Embassy']
        },
        nomadCommunity: {
          coworkingSpaces: [
            'Betahaus Barcelona',
            'Campus La Salle',
            'MOB (Makers of Barcelona)',
            'OneCoWork',
            'Cowo Barcelona'
          ],
          meetupGroups: [
            'Barcelona Digital Nomads',
            'Barcelona Entrepreneurs',
            'Barcelona Tech Meetup',
            'Barcelona Language Exchange'
          ],
          onlineCommunities: [
            'Barcelona Digital Nomads Facebook Group',
            'Barcelona Expats WhatsApp',
            'Nomad List Barcelona Chat'
          ],
          events: [
            'Barcelona Tech Week',
            'Mobile World Congress',
            'Sonar Festival',
            'Barcelona Design Week'
          ]
        },
        neighborhoods: [
          {
            name: 'Gràcia',
            description: 'Bohemian neighborhood with local charm',
            pros: ['Authentic local feel', 'Great cafes', 'Artistic community', 'Less touristy'],
            cons: ['Hilly terrain', 'Limited metro access', 'Can be noisy'],
            averageRent: '$1,200-1,800/month',
            vibe: 'Hipster, artistic, local'
          },
          {
            name: 'Eixample',
            description: 'Modern grid layout with excellent amenities',
            pros: ['Central location', 'Great transport', 'Many restaurants', 'Safe area'],
            cons: ['Touristy', 'More expensive', 'Less character'],
            averageRent: '$1,500-2,500/month',
            vibe: 'Modern, convenient, upscale'
          },
          {
            name: 'Sant Antoni',
            description: 'Up-and-coming neighborhood with great food scene',
            pros: ['Trendy area', 'Great food market', 'Young crowd', 'Good transport'],
            cons: ['Still developing', 'Some areas can be sketchy at night'],
            averageRent: '$1,000-1,600/month',
            vibe: 'Trendy, foodie, young'
          }
        ]
      }
    },
    {
      name: 'Mexico City',
      country: 'Mexico',
      description: 'Vibrant metropolis with rich culture and affordable living',
      cost: '$1,500 - $3,000/month',
      internet: '50 Mbps average',
      safety: 'Moderate',
      visa: 'Tourist Visa (180 days)',
      weather: 'High altitude, mild year-round',
      nomadScore: 8.8,
      image: '🇲🇽',
      highlights: ['Rich history', 'Amazing food', 'Affordable living', 'Vibrant nightlife'],
      tips: ['Learn basic Spanish', 'Stay in safe neighborhoods', 'Use Uber for transport', 'Try local street food'],
      detailedInfo: {
        visaDetails: {
          touristVisa: '180 days (extendable)',
          digitalNomadVisa: 'Not available',
          requirements: [
            'Valid passport',
            'Return ticket',
            'Proof of funds',
            'Hotel reservation'
          ],
          applicationProcess: 'Apply at Mexican consulate or get on arrival',
          fees: '$36 USD for tourist visa',
          processingTime: 'Same day at airport, 1-2 weeks at consulate'
        },
        costBreakdown: {
          accommodation: {
            budget: '$500-800/month',
            midRange: '$800-1,500/month',
            luxury: '$1,500-3,000/month',
            areas: ['Roma Norte', 'Condesa', 'Polanco', 'Coyoacán', 'San Miguel Chapultepec']
          },
          food: {
            localRestaurant: '$3-8 per meal',
            midRangeRestaurant: '$8-20 per meal',
            groceries: '$200-400/month',
            popularDishes: ['Tacos al pastor', 'Mole poblano', 'Chiles en nogada', 'Tamales', 'Churros']
          },
          transportation: {
            publicTransport: '$15-25/month',
            taxi: '$5-15 for short trips',
            scooter: '$150-250/month rental',
            bike: '$10-20/day rental'
          },
          utilities: {
            internet: '$25-40/month',
            electricity: '$30-60/month',
            water: '$10-20/month',
            mobile: '$10-20/month'
          },
          entertainment: {
            coworking: '$100-200/month',
            gym: '$30-60/month',
            cinema: '$4-8 per ticket',
            nightlife: '$30-80 per night out'
          }
        },
        practicalInfo: {
          bestTimeToVisit: 'March-May and October-November',
          language: 'Spanish',
          currency: 'Mexican Peso (MXN)',
          timezone: 'CST (UTC-6)',
          emergencyNumbers: ['911 (General)', '065 (Medical)', '066 (Police)'],
          hospitals: ['Hospital ABC', 'Hospital Angeles', 'Hospital Español'],
          embassies: ['US Embassy', 'Canadian Embassy', 'UK Embassy']
        },
        nomadCommunity: {
          coworkingSpaces: [
            'WeWork Mexico City',
            'Centro',
            'Impact Hub Mexico',
            'La Bicicleta',
            'Casa Búho'
          ],
          meetupGroups: [
            'Mexico City Digital Nomads',
            'Mexico City Entrepreneurs',
            'Mexico City Tech Meetup',
            'Mexico City Language Exchange'
          ],
          onlineCommunities: [
            'Mexico City Digital Nomads Facebook Group',
            'Mexico City Expats WhatsApp',
            'Nomad List Mexico City Chat'
          ],
          events: [
            'Mexico City Art Week',
            'Zona Maco',
            'Corona Capital',
            'Mexico City International Film Festival'
          ]
        },
        neighborhoods: [
          {
            name: 'Roma Norte',
            description: 'Trendy neighborhood with great food and culture',
            pros: ['Excellent food scene', 'Beautiful architecture', 'Art galleries', 'Good cafes'],
            cons: ['Expensive', 'Touristy', 'Can be noisy'],
            averageRent: '$800-1,500/month',
            vibe: 'Trendy, artistic, foodie'
          },
          {
            name: 'Condesa',
            description: 'Green, walkable neighborhood with parks',
            pros: ['Lots of parks', 'Walkable', 'Good restaurants', 'Safe area'],
            cons: ['Expensive', 'Touristy', 'Limited parking'],
            averageRent: '$900-1,800/month',
            vibe: 'Green, relaxed, upscale'
          },
          {
            name: 'Coyoacán',
            description: 'Historic neighborhood with bohemian vibe',
            pros: ['Historic charm', 'Less touristy', 'Good markets', 'Cultural sites'],
            cons: ['Further from center', 'Limited nightlife', 'Less modern amenities'],
            averageRent: '$600-1,200/month',
            vibe: 'Historic, bohemian, local'
          }
        ]
      }
    },
    // 添加更多城市的详细信息...
    {
      name: 'Bali',
      country: 'Indonesia',
      description: 'Tropical paradise with spiritual culture and digital nomad community',
      cost: '$1,200 - $2,500/month',
      internet: '25 Mbps average',
      safety: 'Safe',
      visa: 'Tourist Visa (30 days, extendable)',
      weather: 'Tropical, wet and dry seasons',
      nomadScore: 9.0,
      image: '🇮🇩',
      highlights: ['Beautiful beaches', 'Spiritual culture', 'Affordable living', 'Strong nomad community'],
      tips: ['Respect local customs', 'Get a scooter', 'Learn basic Indonesian', 'Stay hydrated'],
      detailedInfo: {
        visaDetails: {
          touristVisa: '30 days (extendable to 60 days)',
          digitalNomadVisa: 'B211A visa available',
          requirements: [
            'Valid passport (6+ months validity)',
            'Return ticket',
            'Proof of funds',
            'Sponsor letter (for B211A)'
          ],
          applicationProcess: 'Apply at Indonesian embassy or get on arrival',
          fees: '$35 USD for tourist visa, $200+ for B211A',
          processingTime: 'Same day at airport, 1-2 weeks for B211A'
        },
        costBreakdown: {
          accommodation: {
            budget: '$300-600/month',
            midRange: '$600-1,200/month',
            luxury: '$1,200-2,500/month',
            areas: ['Canggu', 'Ubud', 'Seminyak', 'Uluwatu', 'Sanur']
          },
          food: {
            localRestaurant: '$2-5 per meal',
            midRangeRestaurant: '$5-15 per meal',
            groceries: '$150-300/month',
            popularDishes: ['Nasi goreng', 'Mie goreng', 'Satay', 'Gado-gado', 'Babi guling']
          },
          transportation: {
            publicTransport: 'Limited, mainly taxis and ride-sharing',
            taxi: '$5-15 for short trips',
            scooter: '$50-100/month rental',
            bike: '$5-10/day rental'
          },
          utilities: {
            internet: '$20-40/month',
            electricity: '$30-80/month',
            water: '$10-20/month',
            mobile: '$5-15/month'
          },
          entertainment: {
            coworking: '$100-200/month',
            gym: '$20-50/month',
            cinema: '$3-6 per ticket',
            nightlife: '$20-60 per night out'
          }
        },
        practicalInfo: {
          bestTimeToVisit: 'April-October (dry season)',
          language: 'Indonesian, English widely spoken',
          currency: 'Indonesian Rupiah (IDR)',
          timezone: 'WITA (UTC+8)',
          emergencyNumbers: ['112 (General)', '118 (Medical)', '110 (Police)'],
          hospitals: ['BIMC Hospital', 'Siloam Hospital', 'Sanglah Hospital'],
          embassies: ['US Consulate', 'Australian Consulate', 'UK Consulate']
        },
        nomadCommunity: {
          coworkingSpaces: [
            'Dojo Bali',
            'Outpost',
            'Tropical Nomad',
            'BaliSpirit',
            'Hubud'
          ],
          meetupGroups: [
            'Bali Digital Nomads',
            'Bali Entrepreneurs',
            'Bali Tech Meetup',
            'Bali Language Exchange'
          ],
          onlineCommunities: [
            'Bali Digital Nomads Facebook Group',
            'Bali Expats WhatsApp',
            'Nomad List Bali Chat'
          ],
          events: [
            'Bali Spirit Festival',
            'Ubud Writers & Readers Festival',
            'Bali International Film Festival',
            'Bali Arts Festival'
          ]
        },
        neighborhoods: [
          {
            name: 'Canggu',
            description: 'Surf and digital nomad hotspot',
            pros: ['Great surf', 'Nomad community', 'Good cafes', 'Beach access'],
            cons: ['Traffic congestion', 'Rising prices', 'Touristy'],
            averageRent: '$500-1,200/month',
            vibe: 'Surf, nomad, beach'
          },
          {
            name: 'Ubud',
            description: 'Cultural and spiritual center',
            pros: ['Cultural activities', 'Yoga scene', 'Nature', 'Spiritual community'],
            cons: ['Touristy', 'Limited nightlife', 'Further from beach'],
            averageRent: '$400-1,000/month',
            vibe: 'Cultural, spiritual, nature'
          },
          {
            name: 'Seminyak',
            description: 'Upscale beach area with nightlife',
            pros: ['Beach access', 'Good restaurants', 'Nightlife', 'Shopping'],
            cons: ['Expensive', 'Very touristy', 'Crowded'],
            averageRent: '$800-1,800/month',
            vibe: 'Upscale, beach, nightlife'
          }
        ]
      }
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'text-green-600 bg-green-100';
    if (score >= 8.0) return 'text-blue-600 bg-blue-100';
    if (score >= 7.0) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case 'Very Safe': return 'text-green-600 bg-green-100';
      case 'Safe': return 'text-blue-600 bg-blue-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: GlobeAltIcon },
    { id: 'visa', label: 'Visa & Legal', icon: DocumentTextIcon },
    { id: 'costs', label: 'Costs', icon: CurrencyDollarIcon },
    { id: 'practical', label: 'Practical Info', icon: MapPinIcon },
    { id: 'community', label: 'Community', icon: UserGroupIcon },
    { id: 'neighborhoods', label: 'Neighborhoods', icon: HomeIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <GlobeAltIcon className="h-16 w-16 mx-auto text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Nomad Cities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the best cities for digital nomads. Each destination offers unique opportunities, 
            from affordable living to vibrant communities and excellent infrastructure.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cities.map((city) => (
            <div
              key={city.name}
              onClick={() => setSelectedCity(city)}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{city.image}</div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreColor(city.nomadScore)}`}>
                  {city.nomadScore}/10
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{city.name}</h3>
              <p className="text-gray-600 mb-4">{city.country}</p>
              <p className="text-gray-700 mb-4 leading-relaxed">{city.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-500" />
                  {city.cost}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <WifiIcon className="h-4 w-4 mr-2 text-blue-500" />
                  {city.internet}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheckIcon className="h-4 w-4 mr-2 text-purple-500" />
                  {city.safety}
                </div>
              </div>
              
              <div className="flex items-center text-blue-600 font-semibold text-sm">
                View Details
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Selected City Details */}
        {selectedCity && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100">
            {/* City Header */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{selectedCity.image}</div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900">{selectedCity.name}</h2>
                    <p className="text-xl text-gray-600">{selectedCity.country}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getScoreColor(selectedCity.nomadScore)}`}>
                  Nomad Score: {selectedCity.nomadScore}/10
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{selectedCity.description}</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-500 mr-2" />
                        <h4 className="font-semibold text-gray-900">Cost of Living</h4>
                      </div>
                      <p className="text-gray-600">{selectedCity.cost}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <WifiIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <h4 className="font-semibold text-gray-900">Internet</h4>
                      </div>
                      <p className="text-gray-600">{selectedCity.internet}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <ShieldCheckIcon className="h-5 w-5 text-purple-500 mr-2" />
                        <h4 className="font-semibold text-gray-900">Safety</h4>
                      </div>
                      <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getSafetyColor(selectedCity.safety)}`}>
                        {selectedCity.safety}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <MapPinIcon className="h-5 w-5 text-orange-500 mr-2" />
                        <h4 className="font-semibold text-gray-900">Visa</h4>
                      </div>
                      <p className="text-gray-600 text-sm">{selectedCity.visa}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                        Highlights
                      </h3>
                      <ul className="space-y-2">
                        {selectedCity.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <GlobeAltIcon className="h-5 w-5 text-green-500 mr-2" />
                        Local Tips
                      </h3>
                      <ul className="space-y-2">
                        {selectedCity.tips.map((tip, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'visa' && selectedCity.detailedInfo && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Visa Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Tourist Visa</h4>
                        <p className="text-gray-600">{selectedCity.detailedInfo.visaDetails.touristVisa}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Digital Nomad Visa</h4>
                        <p className="text-gray-600">{selectedCity.detailedInfo.visaDetails.digitalNomadVisa}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {selectedCity.detailedInfo.visaDetails.requirements.map((req, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Process & Fees</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Application Process</p>
                          <p className="text-gray-900">{selectedCity.detailedInfo.visaDetails.applicationProcess}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fees</p>
                          <p className="text-gray-900">{selectedCity.detailedInfo.visaDetails.fees}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Processing Time</p>
                          <p className="text-gray-900">{selectedCity.detailedInfo.visaDetails.processingTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'costs' && selectedCity.detailedInfo && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Cost Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <HomeIcon className="h-5 w-5 text-blue-500 mr-2" />
                          Accommodation
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600">Budget</p>
                            <p className="font-medium">{selectedCity.detailedInfo.costBreakdown.accommodation.budget}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Mid-Range</p>
                            <p className="font-medium">{selectedCity.detailedInfo.costBreakdown.accommodation.midRange}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Luxury</p>
                            <p className="font-medium">{selectedCity.detailedInfo.costBreakdown.accommodation.luxury}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <UtensilsIcon className="h-5 w-5 text-green-500 mr-2" />
                          Food & Dining
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600">Local Restaurant</p>
                            <p className="font-medium">{selectedCity.detailedInfo.costBreakdown.food.localRestaurant}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Mid-Range Restaurant</p>
                            <p className="font-medium">{selectedCity.detailedInfo.costBreakdown.food.midRangeRestaurant}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Groceries</p>
                            <p className="font-medium">{selectedCity.detailedInfo.costBreakdown.food.groceries}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <BusIcon className="h-5 w-5 text-purple-500 mr-2" />
                          Transportation
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600">Public Transport</p>
                            <p className="font-medium">{selectedCity.detailedInfo.costBreakdown.transportation.publicTransport}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Taxi</p>
                            <p className="font-medium">{selectedCity.detailedInfo.costBreakdown.transportation.taxi}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Scooter Rental</p>
                            <p className="font-medium">{selectedCity.detailedInfo.costBreakdown.transportation.scooter}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Popular Local Dishes</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCity.detailedInfo.costBreakdown.food.popularDishes.map((dish, index) => (
                        <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'practical' && selectedCity.detailedInfo && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Essential Information</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">Best Time to Visit</p>
                          <p className="font-medium">{selectedCity.detailedInfo.practicalInfo.bestTimeToVisit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Language</p>
                          <p className="font-medium">{selectedCity.detailedInfo.practicalInfo.language}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Currency</p>
                          <p className="font-medium">{selectedCity.detailedInfo.practicalInfo.currency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Timezone</p>
                          <p className="font-medium">{selectedCity.detailedInfo.practicalInfo.timezone}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Emergency Contacts</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Emergency Numbers</h4>
                          <div className="space-y-1">
                            {selectedCity.detailedInfo.practicalInfo.emergencyNumbers.map((number, index) => (
                              <p key={index} className="text-sm text-gray-600">{number}</p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Major Hospitals</h4>
                          <div className="space-y-1">
                            {selectedCity.detailedInfo.practicalInfo.hospitals.map((hospital, index) => (
                              <p key={index} className="text-sm text-gray-600">{hospital}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'community' && selectedCity.detailedInfo && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Nomad Community</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <GlobeAltIcon className="h-5 w-5 text-blue-500 mr-2" />
                          Coworking Spaces
                        </h4>
                        <ul className="space-y-2">
                          {selectedCity.detailedInfo.nomadCommunity.coworkingSpaces.map((space, index) => (
                            <li key={index} className="flex items-center text-gray-700">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                              {space}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
                          Meetup Groups
                        </h4>
                        <ul className="space-y-2">
                          {selectedCity.detailedInfo.nomadCommunity.meetupGroups.map((group, index) => (
                            <li key={index} className="flex items-center text-gray-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                              {group}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Events & Festivals</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCity.detailedInfo.nomadCommunity.events.map((event, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'neighborhoods' && selectedCity.detailedInfo && (
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Neighborhoods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedCity.detailedInfo.neighborhoods.map((neighborhood, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">{neighborhood.name}</h4>
                        <p className="text-gray-600 mb-4">{neighborhood.description}</p>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">Average Rent</p>
                          <p className="font-medium">{neighborhood.averageRent}</p>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600">Vibe</p>
                          <p className="font-medium">{neighborhood.vibe}</p>
                        </div>

                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Pros</h5>
                          <ul className="space-y-1">
                            {neighborhood.pros.map((pro, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Cons</h5>
                          <ul className="space-y-1">
                            {neighborhood.cons.map((con, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 flex-shrink-0"></div>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-gray-200">
              <button
                onClick={() => setSelectedCity(null)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Back to Cities
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {!selectedCity && (
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Planning Your Next Destination?
              </h3>
              <p className="text-gray-600 mb-6">
                Get detailed visa information, cost breakdowns, and community insights for each city.
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get City Guide
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 