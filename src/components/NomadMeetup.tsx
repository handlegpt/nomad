'use client'

import { useState, useEffect } from 'react'
import { Users, MapPin, Coffee, MessageSquare, Plus, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useNotifications, useUser } from '@/contexts/GlobalStateContext'
import { logInfo, logError } from '@/lib/logger'
import FixedLink from '@/components/FixedLink'

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
  const { user } = useUser()
  const [currentCity, setCurrentCity] = useState('Osaka, Japan')
  const [users, setUsers] = useState<MeetupUser[]>([])
  const [showMeetupForm, setShowMeetupForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const { addNotification } = useNotifications()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 模拟获取当前城市的数字游民数据
      // 这里应该调用真实的API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
    } catch (error) {
      logError('Failed to fetch users', error, 'NomadMeetup')
      setError(t('meetup.failedToLoadUsers'))
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchUsers()
    setRefreshing(false)
  }

  const handleRequestMeetup = (userId: string) => {
    if (!user.isAuthenticated) {
      addNotification({
        type: 'warning',
        message: t('meetup.pleaseLoginToMeetup')
      })
      return
    }

    logInfo('Requesting meetup with user', { userId }, 'NomadMeetup')
    
    addNotification({
      type: 'success',
      message: t('meetup.requestSent')
    })
  }

  const handleCreateMeetup = () => {
    if (!user.isAuthenticated) {
      addNotification({
        type: 'warning',
        message: t('meetup.pleaseLoginToMeetup')
      })
      return
    }
    setShowMeetupForm(true)
  }

  const handlePublishInvitation = () => {
    // 这里应该调用API发布邀请
    addNotification({
      type: 'success',
      message: t('meetup.requestSent')
    })
    setShowMeetupForm(false)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg"></div>
              <div>
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{t('common.retry')}</span>
          </button>
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
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title={t('common.refresh')}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleCreateMeetup}
            className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>{t('meetup.createMeetup')}</span>
          </button>
        </div>
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
            <p className="text-gray-600">{t('meetup.noOnlineUsers')}</p>
            <p className="text-sm text-gray-500">{t('meetup.checkLater')}</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">{users.length}</p>
            <p className="text-xs text-gray-600">{t('meetup.totalUsers')}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">{users.filter(u => u.isAvailable).length}</p>
            <p className="text-xs text-gray-600">{t('meetup.availableUsers')}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-600">12</p>
            <p className="text-xs text-gray-600">{t('meetup.todayMeetups')}</p>
          </div>
        </div>
      </div>

      {/* Meetup Form Modal */}
      {showMeetupForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('meetup.createMeetupTitle')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('meetup.meetupLocation')}
                </label>
                <input
                  type="text"
                  placeholder={t('meetup.meetupLocationPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('meetup.meetupTime')}
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('meetup.meetupDescription')}
                </label>
                <textarea
                  placeholder={t('meetup.meetupDescriptionPlaceholder')}
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
                {t('meetup.cancel')}
              </button>
              <button 
                onClick={handlePublishInvitation}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('meetup.publishInvitation')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
