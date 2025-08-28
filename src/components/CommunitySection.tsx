'use client'

import { useState } from 'react'
import { Users, MessageSquare, Calendar, MapPin } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function CommunitySection() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'online' | 'local'>('online')

  const onlineCommunities = [
    {
      name: 'Digital Nomads Facebook Group',
      members: '125K+',
      description: '全球最大的数字游民Facebook群组',
      url: '#',
      icon: '💬'
    },
    {
      name: 'Nomad List Community',
      members: '50K+',
      description: '基于Nomad List的活跃社区',
      url: '#',
      icon: '🌍'
    },
    {
      name: 'Reddit r/digitalnomad',
      members: '1.2M+',
      description: 'Reddit上的数字游民讨论区',
      url: '#',
      icon: '📱'
    }
  ]

  const localCommunities = [
    {
      name: 'Osaka Digital Nomads',
      members: '500+',
      description: '大阪本地数字游民聚会',
      nextEvent: '2024-01-15',
      location: '大阪市中心',
      icon: '🏯'
    },
    {
      name: 'Tokyo Remote Workers',
      members: '1.2K+',
      description: '东京远程工作者社区',
      nextEvent: '2024-01-20',
      location: '涩谷区',
      icon: '🗼'
    },
    {
      name: 'Kyoto Nomad Meetup',
      members: '300+',
      description: '京都数字游民定期聚会',
      nextEvent: '2024-01-25',
      location: '京都站附近',
      icon: '⛩️'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-600" />
          社区
        </h2>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('online')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'online'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            在线
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'local'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            本地
          </button>
        </div>
      </div>

      {activeTab === 'online' && (
        <div className="space-y-4">
          {onlineCommunities.map((community, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{community.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {community.name}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {community.members}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {community.description}
                  </p>
                  <a
                    href={community.url}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    加入社区 →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'local' && (
        <div className="space-y-4">
          {localCommunities.map((community, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{community.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {community.name}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {community.members}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {community.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>下次活动: {community.nextEvent}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{community.location}</span>
                    </div>
                  </div>
                  <button className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium">
                    参加活动 →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            发现更多社区 →
          </button>
        </div>
      </div>
    </div>
  )
}
