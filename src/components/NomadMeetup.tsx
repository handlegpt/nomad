'use client'

import { useState, useEffect } from 'react'
import { Users, MapPin, Coffee, MessageSquare, Plus, Clock, AlertCircle, RefreshCw, MapPinOff, Calendar, Bell } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useNotifications, useUser } from '@/contexts/GlobalStateContext'
import { logInfo, logError } from '@/lib/logger'
import { useLocation } from '@/hooks/useLocation'
import { 
  getOnlineUsers, 
  getMeetupStats, 
  sendMeetupInvitation, 
  createPublicMeetup,
  type MeetupUser,
  type MeetupStats
} from '@/lib/meetupApi'
import { validateForm, meetupFormRules, validateField } from '@/lib/formValidation'
import UserProfileModal from './UserProfileModal'
import MeetupHistory from './MeetupHistory'
import MeetupNotifications from './MeetupNotifications'

export default function NomadMeetup() {
  const { t } = useTranslation()
  const { user } = useUser()
  const { location: userLocation, loading: locationLoading, error: locationError, refreshLocation } = useLocation()
  
  const [users, setUsers] = useState<MeetupUser[]>([])
  const [stats, setStats] = useState<MeetupStats | null>(null)
  const [showMeetupForm, setShowMeetupForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [sendingInvitation, setSendingInvitation] = useState(false)
  const [creatingMeetup, setCreatingMeetup] = useState(false)
  
  // 新增状态
  const [selectedUser, setSelectedUser] = useState<MeetupUser | null>(null)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [activeTab, setActiveTab] = useState<'users' | 'history' | 'notifications'>('users')
  
  // 表单验证状态
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [isValidating, setIsValidating] = useState(false)
  
  const { addNotification } = useNotifications()

  const currentCity = userLocation ? `${userLocation.city}, ${userLocation.country}` : 'Loading...'

  useEffect(() => {
    if (userLocation) {
      fetchUsers()
      fetchStats()
    }
  }, [userLocation])

  const fetchUsers = async () => {
    if (!userLocation) return
    
    try {
      setLoading(true)
      setError(null)
      
      const usersData = await getOnlineUsers(userLocation.city, {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      })
      setUsers(usersData)
    } catch (error) {
      logError('Failed to fetch users', error, 'NomadMeetup')
      setError(t('meetup.failedToLoadUsers'))
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    if (!userLocation) return
    
    try {
      const statsData = await getMeetupStats(userLocation.city)
      setStats(statsData)
    } catch (error) {
      logError('Failed to fetch stats', error, 'NomadMeetup')
      // 不显示错误，因为统计信息不是关键功能
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([
      fetchUsers(),
      fetchStats(),
      refreshLocation()
    ])
    setRefreshing(false)
  }

  const handleRequestMeetup = async (userId: string) => {
    if (!user.isAuthenticated) {
      addNotification({
        type: 'warning',
        message: t('meetup.pleaseLoginToMeetup')
      })
      return
    }

    setSendingInvitation(true)
    
    try {
      const result = await sendMeetupInvitation(
        userId,
        'Coffee Shop',
        new Date().toISOString(),
        'Let\'s meet for coffee!'
      )
      
      if (result.success) {
        addNotification({
          type: 'success',
          message: t('meetup.requestSent')
        })
      } else {
        addNotification({
          type: 'error',
          message: result.message
        })
      }
    } catch (error) {
      logError('Failed to send meetup invitation', error, 'NomadMeetup')
      addNotification({
        type: 'error',
        message: t('meetup.requestFailed')
      })
    } finally {
      setSendingInvitation(false)
    }
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

  const handlePublishInvitation = async () => {
    const formData = new FormData(document.getElementById('meetup-form') as HTMLFormElement)
    const formValues = {
      location: formData.get('location') as string,
      time: formData.get('time') as string,
      description: formData.get('description') as string
    }

    // 表单验证
    setIsValidating(true)
    const validation = validateForm(formValues, meetupFormRules)
    
    if (!validation.isValid) {
      const errors: { [key: string]: string } = {}
      validation.errors.forEach(error => {
        const field = error.split(' ')[0]
        errors[field] = error
      })
      setFormErrors(errors)
      setIsValidating(false)
      
      addNotification({
        type: 'error',
        message: validation.errors.join('；')
      })
      return
    }

    setFormErrors({})
    setCreatingMeetup(true)
    
    try {
      const result = await createPublicMeetup(formValues.location, formValues.time, formValues.description)
      
      if (result.success) {
        addNotification({
          type: 'success',
          message: t('meetup.publicMeetupCreated')
        })
        setShowMeetupForm(false)
        // 刷新数据
        await fetchUsers()
        await fetchStats()
      } else {
        addNotification({
          type: 'error',
          message: result.message
        })
      }
    } catch (error) {
      logError('Failed to create public meetup', error, 'NomadMeetup')
      addNotification({
        type: 'error',
        message: t('meetup.createMeetupFailed')
      })
    } finally {
      setCreatingMeetup(false)
      setIsValidating(false)
    }
  }

  // 实时验证字段
  const validateFieldRealTime = (fieldName: string, value: string) => {
    const rule = meetupFormRules[fieldName]
    if (!rule) return
    
    const error = validateField(value, rule, fieldName)
    setFormErrors(prev => ({
      ...prev,
      [fieldName]: error || ''
    }))
  }

  const handleUserClick = (user: MeetupUser) => {
    setSelectedUser(user)
    setShowUserProfile(true)
  }

  const TabButton = ({ id, label, icon: Icon, count }: { id: string, label: string, icon: any, count?: number }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeTab === id
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {count && count > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  )

  if (locationLoading) {
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

  if (locationError) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center py-8">
          <MapPinOff className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">{t('meetup.locationError')}</p>
          <button
            onClick={refreshLocation}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{t('common.retry')}</span>
          </button>
        </div>
      </div>
    )
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

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        <TabButton id="users" label={t('meetup.onlineUsers')} icon={Users} />
        <TabButton id="history" label={t('meetup.history')} icon={Calendar} />
        <TabButton id="notifications" label={t('meetup.notifications')} icon={Bell} count={3} />
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <>
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
                    <button
                      onClick={() => handleUserClick(user)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                        user.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                      {user.avatar}
                    </button>
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
                        {user.distance && (
                          <>
                            <span>•</span>
                            <span>{user.distance}km</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.interests.slice(0, 2).map((interest, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {interest}
                          </span>
                        ))}
                        {user.mutualInterests && user.mutualInterests.length > 0 && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {user.mutualInterests.length} 共同兴趣
                          </span>
                        )}
                      </div>
                      {user.meetupCompatibility && (
                        <div className="flex items-center space-x-1 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${user.meetupCompatibility}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{user.meetupCompatibility}% 匹配</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {user.isAvailable ? (
                      <button
                        onClick={() => handleRequestMeetup(user.id)}
                        disabled={sendingInvitation}
                        className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {sendingInvitation ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Coffee className="h-3 w-3" />
                        )}
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
                <p className="text-lg font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                <p className="text-xs text-gray-600">{t('meetup.totalUsers')}</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">{stats?.availableUsers || 0}</p>
                <p className="text-xs text-gray-600">{t('meetup.availableUsers')}</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-600">{stats?.todayMeetups || 0}</p>
                <p className="text-xs text-gray-600">{t('meetup.todayMeetups')}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <MeetupHistory />
      )}

      {activeTab === 'notifications' && (
        <MeetupNotifications />
      )}

      {/* Meetup Form Modal */}
      {showMeetupForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('meetup.createMeetupTitle')}</h3>
            <form id="meetup-form" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('meetup.meetupLocation')} *
                </label>
                <input
                  name="location"
                  type="text"
                  required
                  placeholder={t('meetup.meetupLocationPlaceholder')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={(e) => validateFieldRealTime('location', e.target.value)}
                />
                {formErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('meetup.meetupTime')} *
                </label>
                <input
                  name="time"
                  type="datetime-local"
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={(e) => validateFieldRealTime('time', e.target.value)}
                />
                {formErrors.time && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.time}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('meetup.meetupDescription')}
                </label>
                <textarea
                  name="description"
                  placeholder={t('meetup.meetupDescriptionPlaceholder')}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onChange={(e) => validateFieldRealTime('description', e.target.value)}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                )}
              </div>
            </form>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowMeetupForm(false)}
                disabled={creatingMeetup}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {t('meetup.cancel')}
              </button>
              <button 
                onClick={handlePublishInvitation}
                disabled={creatingMeetup}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {creatingMeetup ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    {t('common.submitting')}
                  </>
                ) : (
                  t('meetup.publishInvitation')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser}
        isOpen={showUserProfile}
        onClose={() => {
          setShowUserProfile(false)
          setSelectedUser(null)
        }}
      />
    </div>
  )
}
