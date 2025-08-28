'use client'

import { useState, useEffect } from 'react'
import { Users, MessageSquare, Send, MapPin, Coffee, Clock, Calendar } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface Message {
  id: string
  user: string
  avatar: string
  content: string
  timestamp: string
  location: string
}

export default function CommunitySection() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'local' | 'social'>('local')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentCity, setCurrentCity] = useState('Osaka, Japan')

  useEffect(() => {
    // 模拟获取留言板数据
    const mockMessages: Message[] = [
      {
        id: '1',
        user: 'Sarah Chen',
        avatar: 'SC',
        content: '有人知道大阪哪里有好的咖啡馆可以工作吗？WiFi要稳定的',
        timestamp: '2分钟前',
        location: 'Osaka, Japan'
      },
      {
        id: '2',
        user: 'Alex Rodriguez',
        avatar: 'AR',
        content: '推荐心斋桥的Blue Bottle Coffee，WiFi很快，环境也不错',
        timestamp: '5分钟前',
        location: 'Osaka, Japan'
      },
      {
        id: '3',
        user: 'Yuki Tanaka',
        avatar: 'YT',
        content: '今天天气不错，有人想一起去大阪城公园走走吗？',
        timestamp: '10分钟前',
        location: 'Osaka, Japan'
      }
    ]

    setMessages(mockMessages)
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        user: 'You',
        avatar: 'YO',
        content: newMessage,
        timestamp: '刚刚',
        location: currentCity
      }
      setMessages([message, ...messages])
      setNewMessage('')
    }
  }

  const localCommunities = [
    {
      name: 'Osaka Digital Nomads',
      members: '500+',
      descriptionKey: 'community.local.osaka.description',
      nextEvent: '2024-01-15',
      locationKey: 'community.local.osaka.location',
      icon: '🏯'
    },
    {
      name: 'Tokyo Remote Workers',
      members: '1.2K+',
      descriptionKey: 'community.local.tokyo.description',
      nextEvent: '2024-01-20',
      locationKey: 'community.local.tokyo.location',
      icon: '🗼'
    },
    {
      name: 'Kyoto Nomad Meetup',
      members: '300+',
      descriptionKey: 'community.local.kyoto.description',
      nextEvent: '2024-01-25',
      locationKey: 'community.local.kyoto.location',
      icon: '⛩️'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-600" />
          {t('community.title')}
        </h2>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('local')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'local'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('community.local')}
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'social'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('community.lightweightSocial.title')}
          </button>
        </div>
      </div>

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
                    {t(community.descriptionKey)}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{t('community.nextEvent')}: {community.nextEvent}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{t(community.locationKey)}</span>
                    </div>
                  </div>
                  <button className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium">
                    {t('community.attendEvent')} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'social' && (
        <div className="space-y-4">
          {/* Message Board Section */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t('community.lightweightSocial.messageBoard')}</h3>
            
            {/* Message Input */}
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('community.lightweightSocial.messagePlaceholder')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">{message.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{message.user}</span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {message.location}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {messages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">{t('community.lightweightSocial.noMessages')}</p>
                <p className="text-sm text-gray-500">{t('community.lightweightSocial.startConversation')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            {t('community.discoverMore')} →
          </button>
        </div>
      </div>
    </div>
  )
}
