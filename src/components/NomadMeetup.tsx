'use client'

import { useState, useEffect } from 'react'
import { Users, MapPin, Coffee, MessageSquare, Plus, Clock } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useNotifications } from '@/contexts/GlobalStateContext'
import { logInfo } from '@/lib/logger'

interface MeetupUser {
  id: string
  name: string
  avatar: string
  location: string
  status: 'online' | 'offline'
  lastSeen: string
  interests: string[]
  isAvailable: boolean
}

export default function NomadMeetup() {
  const { t } = useTranslation()
  const [currentCity, setCurrentCity] = useState('Osaka, Japan')
  const [users, setUsers] = useState<MeetupUser[]>([])
  const [showMeetupForm, setShowMeetupForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { addNotification } = useNotifications()

  useEffect(() => {
    // 模拟获取当前城市的数字游民数据
    setTimeout(() => {
      const mockUsers: MeetupUser[] = [
        {
          id: '1',
          name: 'Sarah Chen',
          avatar: 'SC',
          location: 'Osaka, Japan',
          status: 'online',
          lastSeen: '2分钟前',
          interests: ['咖啡', '摄影', '技术'],
          isAvailable: true
        },
        {
          id: '2',
          name: 'Alex Rodriguez',
          avatar: 'AR',
          location: 'Osaka, Japan',
          status: 'online',
          lastSeen: '5分钟前',
          interests: ['创业', '旅行', '美食'],
          isAvailable: true
        },
        {
          id: '3',
          name: 'Yuki Tanaka',
          avatar: 'YT',
          location: 'Osaka, Japan',
          status: 'offline',
          lastSeen: '1小时前',
          interests: ['设计', '音乐', '文化'],
          isAvailable: false
        },
        {
          id: '4',
          name: 'Emma Wilson',
          avatar: 'EW',
          location: 'Osaka, Japan',
          status: 'online',
          lastSeen: '刚刚',
          interests: ['写作', '瑜伽', '环保'],
          isAvailable: true
        }
      ]
      setUsers(mockUsers)
      setLoading(false)
    }, 1000)
  }, [])

  const handleRequestMeetup = (userId: string) => {
    logInfo('Requesting meetup with user', { userId }, 'NomadMeetup')
    
    addNotification({
      type: 'success',
      message: t('meetup.requestSent')
    })
  }

  const handleCreateMeetup = () => {
    setShowMeetupForm(true)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Coffee className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{t('meetup.title')}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {currentCity}
            </p>
          </div>
        </div>
        <button
          onClick={handleCreateMeetup}
          className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>{t('meetup.createMeetup')}</span>
        </button>
      </div>

      {/* Online Users */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {t('meetup.onlineNomads')} ({users.filter(u => u.status === 'online').length})
          </h4>
          <span className="text-sm text-gray-500">
            {users.filter(u => u.isAvailable).length} {t('meetup.available')}
          </span>
        </div>

        <div className="space-y-3">
          {users.filter(user => user.status === 'online').map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                  user.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {user.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-gray-900">{user.name}</h5>
                    <span className={`w-2 h-2 rounded-full ${
                      user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>{user.lastSeen}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.interests.slice(0, 2).map((interest, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {user.isAvailable ? (
                  <button
                    onClick={() => handleRequestMeetup(user.id)}
                    className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Coffee className="h-3 w-3" />
                                         <span>{t('meetup.coffeeMeetup')}</span>
                  </button>
                ) : (
                                     <span className="text-sm text-gray-500">{t('meetup.busy')}</span>
                )}
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {users.filter(user => user.status === 'online').length === 0 && (
          <div className="text-center py-8">
            <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">当前没有在线的数字游民</p>
            <p className="text-sm text-gray-500">稍后再来看看吧</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">{users.length}</p>
            <p className="text-xs text-gray-600">总用户</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">{users.filter(u => u.isAvailable).length}</p>
            <p className="text-xs text-gray-600">可约见</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-600">12</p>
            <p className="text-xs text-gray-600">今日见面</p>
          </div>
        </div>
      </div>

      {/* Meetup Form Modal */}
      {showMeetupForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">发起见面邀请</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  见面地点
                </label>
                <input
                  type="text"
                  placeholder="例如：Blue Bottle Coffee, 心斋桥"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  时间
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述
                </label>
                <textarea
                  placeholder="简单介绍一下见面的目的..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowMeetupForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                发布邀请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
