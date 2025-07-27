'use client';

import { useState } from 'react';
import { 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
  GlobeAltIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState('telegram');

  const communities = {
    telegram: {
      title: 'Telegram Groups',
      description: 'Active Telegram communities for digital nomads',
      items: [
        {
          name: 'Digital Nomads Global',
          description: 'Largest global digital nomad community',
          members: '50,000+',
          language: 'English',
          features: ['Job opportunities', 'City recommendations', 'Visa discussions', 'Meetups']
        },
        {
          name: 'Nomad List Community',
          description: 'Official Nomad List community',
          members: '25,000+',
          language: 'English',
          features: ['City reviews', 'Cost of living', 'Accommodation tips', 'Local insights']
        },
        {
          name: 'Remote Work & Digital Nomads',
          description: 'Focus on remote work opportunities',
          members: '15,000+',
          language: 'English',
          features: ['Job postings', 'Skill sharing', 'Remote work tips', 'Company reviews']
        },
        {
          name: 'Digital Nomads Asia',
          description: 'Asia-focused nomad community',
          members: '8,000+',
          language: 'English',
          features: ['Asian destinations', 'Visa information', 'Cultural tips', 'Local meetups']
        }
      ]
    },
    discord: {
      title: 'Discord Servers',
      description: 'Discord communities for real-time discussions',
      items: [
        {
          name: 'Nomad List Discord',
          description: 'Official Discord server for Nomad List',
          members: '10,000+',
          language: 'English',
          features: ['Voice channels', 'City-specific rooms', 'Event planning', 'Resource sharing']
        },
        {
          name: 'Digital Nomad Hub',
          description: 'Comprehensive nomad community',
          members: '5,000+',
          language: 'English',
          features: ['Weekly events', 'Mentorship program', 'Skill workshops', 'Networking']
        },
        {
          name: 'Remote Workers United',
          description: 'Professional remote work community',
          members: '3,000+',
          language: 'English',
          features: ['Career advice', 'Industry discussions', 'Job opportunities', 'Professional development']
        }
      ]
    },
    facebook: {
      title: 'Facebook Groups',
      description: 'Facebook communities for local connections',
      items: [
        {
          name: 'Digital Nomads Around the World',
          description: 'Global Facebook community',
          members: '100,000+',
          language: 'English',
          features: ['Local meetups', 'Accommodation sharing', 'Travel tips', 'Cultural exchange']
        },
        {
          name: 'Female Digital Nomads',
          description: 'Women-focused nomad community',
          members: '25,000+',
          language: 'English',
          features: ['Safety tips', 'Women-only meetups', 'Support network', 'Travel advice']
        },
        {
          name: 'Digital Nomads in Europe',
          description: 'Europe-specific community',
          members: '15,000+',
          language: 'English',
          features: ['European destinations', 'Schengen visa tips', 'EU regulations', 'Local events']
        }
      ]
    },
    meetups: {
      title: 'Local Meetups',
      description: 'In-person events and meetups',
      items: [
        {
          name: 'Nomad Coffee Meetups',
          description: 'Weekly coffee meetups in major cities',
          members: 'Varies by city',
          language: 'English',
          features: ['Weekly events', 'Casual networking', 'City exploration', 'New friendships']
        },
        {
          name: 'Coworking Space Events',
          description: 'Events hosted by coworking spaces',
          members: 'Local members',
          language: 'English',
          features: ['Professional networking', 'Skill sharing', 'Workspace tours', 'Community building']
        },
        {
          name: 'Nomad Conferences',
          description: 'Annual digital nomad conferences',
          members: '500-2000 per event',
          language: 'English',
          features: ['Keynote speakers', 'Workshops', 'Networking', 'Industry insights']
        }
      ]
    }
  };

  const categories = [
    { key: 'telegram', label: 'Telegram Groups' },
    { key: 'discord', label: 'Discord Servers' },
    { key: 'facebook', label: 'Facebook Groups' },
    { key: 'meetups', label: 'Local Meetups' }
  ];

  const selectedCommunities = communities[activeCategory as keyof typeof communities];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow digital nomads through online communities and local meetups
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

        {/* Communities Content */}
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedCommunities.title}</h2>
            <p className="text-xl text-gray-600">{selectedCommunities.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCommunities.items.map((community, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{community.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{community.description}</p>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-blue-600 mr-1" />
                    <span className="text-sm text-gray-600">{community.members}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    <span>{community.language}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {community.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Join Community
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Community Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Be Active</h3>
              <p className="text-sm text-gray-600">
                Participate in discussions, share experiences, and help others. Active members get more value from communities.
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Attend Meetups</h3>
              <p className="text-sm text-gray-600">
                Join local meetups to build real connections. Many communities organize regular in-person events.
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-600">
                Follow community events and announcements. Many groups share valuable resources and opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 