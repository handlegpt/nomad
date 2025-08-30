'use client'

import { useState, useEffect } from 'react'
import { Users, MapPin, Coffee, MessageSquare, Plus, Clock, AlertCircle, RefreshCw, MapPinOff, Calendar, Bell, Send } from 'lucide-react'
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
import {
  getCommunityMessages,
  sendCommunityMessage,
  toggleMessageLike,
  getMessageReplies,
  sendMessageReply,
  type CommunityMessage,
  type MessageReply
} from '@/lib/communityChatApi'
import { communityRealtimeService } from '@/lib/communityRealtimeService'

// 移除旧的接口定义，使用从API导入的接口
import { validateForm, validationRules, validateField } from '@/lib/formValidation'
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
  const [activeTab, setActiveTab] = useState<'users' | 'history' | 'notifications' | 'community'>('users')
  
  // 表单验证状态
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [isValidating, setIsValidating] = useState(false)
  
  // 社区聊天状态
  const [communityMessages, setCommunityMessages] = useState<CommunityMessage[]>([])
  const [newCommunityMessage, setNewCommunityMessage] = useState('')
  const [messageType, setMessageType] = useState<'general' | 'question' | 'info' | 'help'>('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'question' | 'info' | 'help' | 'general'>('all')
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [messagesPage, setMessagesPage] = useState(1)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [selectedMessageForReply, setSelectedMessageForReply] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [replies, setReplies] = useState<Record<string, MessageReply[]>>({})
  
  const { addNotification } = useNotifications()

  const currentCity = userLocation ? `${userLocation.city}, ${userLocation.country}` : 'Loading...'

  useEffect(() => {
    if (userLocation) {
      fetchUsers()
      fetchStats()
      fetchCommunityMessages()
    }
  }, [userLocation])

  const fetchCommunityMessages = async (page = 1, append = false) => {
    if (!userLocation) return
    
    try {
      setMessagesLoading(true)
      
      const result = await getCommunityMessages({
        page,
        limit: 20,
        message_type: filterType === 'all' ? undefined : filterType,
        location: currentCity,
        search: searchQuery || undefined
      })

      if (append) {
        setCommunityMessages(prev => [...prev, ...result.messages])
      } else {
        setCommunityMessages(result.messages)
      }
      
      setHasMoreMessages(result.hasMore)
      setMessagesPage(page)
    } catch (error) {
      logError('Failed to fetch community messages', error, 'NomadMeetup')
      addNotification({
        type: 'error',
        message: t('meetup.failedToLoadMessages')
      })
    } finally {
      setMessagesLoading(false)
    }
  }

  // 获取消息回复
  const fetchMessageReplies = async (messageId: string) => {
    try {
      const repliesData = await getMessageReplies(messageId)
      setReplies(prev => ({
        ...prev,
        [messageId]: repliesData
      }))
    } catch (error) {
      logError('Failed to fetch message replies', error, 'NomadMeetup')
    }
  }

  const handleSendCommunityMessage = async () => {
    if (!user.isAuthenticated) {
      addNotification({
        type: 'warning',
        message: t('meetup.pleaseLoginToMeetup')
      })
      return
    }

    if (!newCommunityMessage.trim()) return

    try {
      const message = await sendCommunityMessage({
        content: newCommunityMessage.trim(),
        message_type: messageType,
        location: currentCity,
        tags: []
      })
      
      setCommunityMessages(prev => [message, ...prev])
      setNewCommunityMessage('')
      addNotification({
        type: 'success',
        message: t('meetup.messageSent')
      })
    } catch (error) {
      logError('Failed to send community message', error, 'NomadMeetup')
      addNotification({
        type: 'error',
        message: t('meetup.failedToSendMessage')
      })
    }
  }

  // 筛选和搜索消息
  const filteredMessages = communityMessages.filter(message => {
    const matchesSearch = searchQuery === '' || 
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = filterType === 'all' || message.message_type === filterType
    
    return matchesSearch && matchesFilter
  })

  // 处理点赞
  const handleLikeMessage = async (messageId: string) => {
    if (!user.isAuthenticated) {
      addNotification({
        type: 'warning',
        message: t('meetup.pleaseLoginToMeetup')
      })
      return
    }

    try {
      const result = await toggleMessageLike(messageId)
      
      setCommunityMessages(prev => prev.map(message => 
        message.id === messageId 
          ? { ...message, likes_count: result.likesCount, is_liked_by_current_user: result.isLiked }
          : message
      ))
    } catch (error) {
      logError('Failed to like message', error, 'NomadMeetup')
      addNotification({
        type: 'error',
        message: t('meetup.failedToLikeMessage')
      })
    }
  }

  // 处理回复
  const handleReplyToMessage = async (messageId: string) => {
    if (!user.isAuthenticated) {
      addNotification({
        type: 'warning',
        message: t('meetup.pleaseLoginToMeetup')
      })
      return
    }

    if (!replyContent.trim()) return

    try {
      const reply = await sendMessageReply(messageId, replyContent.trim())
      
      setReplies(prev => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), reply]
      }))
      
      setReplyContent('')
      setSelectedMessageForReply(null)
      
      addNotification({
        type: 'success',
        message: t('meetup.replySent')
      })
    } catch (error) {
      logError('Failed to send reply', error, 'NomadMeetup')
      addNotification({
        type: 'error',
        message: t('meetup.failedToSendReply')
      })
    }
  }

  // 实时通信设置
  useEffect(() => {
    if (activeTab === 'community' && user.isAuthenticated) {
      // 连接实时通信
      communityRealtimeService.connect()
      
      // 监听新消息
      const handleNewMessage = (event: any) => {
        setCommunityMessages(prev => [event.data, ...prev])
      }
      
      // 监听消息更新
      const handleMessageUpdate = (event: any) => {
        setCommunityMessages(prev => prev.map(message => 
          message.id === event.data.id ? event.data : message
        ))
      }
      
      // 监听消息删除
      const handleMessageDelete = (event: any) => {
        setCommunityMessages(prev => prev.filter(message => message.id !== event.data.id))
      }
      
      // 监听点赞
      const handleMessageLike = (event: any) => {
        setCommunityMessages(prev => prev.map(message => 
          message.id === event.data.message_id 
            ? { ...message, likes_count: message.likes_count + 1 }
            : message
        ))
      }
      
      // 监听新回复
      const handleNewReply = (event: any) => {
        setReplies(prev => ({
          ...prev,
          [event.data.parent_message_id]: [...(prev[event.data.parent_message_id] || []), event.data]
        }))
      }
      
      communityRealtimeService.addEventListener('new_message', handleNewMessage)
      communityRealtimeService.addEventListener('message_updated', handleMessageUpdate)
      communityRealtimeService.addEventListener('message_deleted', handleMessageDelete)
      communityRealtimeService.addEventListener('message_liked', handleMessageLike)
      communityRealtimeService.addEventListener('new_reply', handleNewReply)
      
      return () => {
        communityRealtimeService.removeEventListener('new_message', handleNewMessage)
        communityRealtimeService.removeEventListener('message_updated', handleMessageUpdate)
        communityRealtimeService.removeEventListener('message_deleted', handleMessageDelete)
        communityRealtimeService.removeEventListener('message_liked', handleMessageLike)
        communityRealtimeService.removeEventListener('new_reply', handleNewReply)
      }
    }
  }, [activeTab, user.isAuthenticated])

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
    const meetupValidationRules = [
      { name: 'location', value: formValues.location, rules: validationRules.cityName },
      { name: 'time', value: formValues.time, rules: { required: true } },
      { name: 'description', value: formValues.description, rules: validationRules.description }
    ]
    const validation = validateForm(meetupValidationRules)
    
    if (!validation.isValid) {
      setFormErrors(validation.errors)
      setIsValidating(false)
      
      addNotification({
        type: 'error',
        message: Object.values(validation.errors).join('；')
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
    let rule
    switch (fieldName) {
      case 'location':
        rule = validationRules.cityName
        break
      case 'description':
        rule = validationRules.description
        break
      case 'time':
        rule = { required: true }
        break
      default:
        return
    }
    
    const field = { name: fieldName, value, rules: rule }
    const error = validateField(field)
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
                    <TabButton id="notifications" label={t('meetup.notifications.title')} icon={Bell} count={3} />
        <TabButton id="community" label={t('meetup.communityChat')} icon={MessageSquare} />
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
                            <span>{t('meetup.distance', { distance: user.distance.toString() })}</span>
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
                            {t('meetup.mutualInterests', { count: user.mutualInterests.length.toString() })}
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
                          <span className="text-xs text-gray-500">{t('meetup.compatibility', { percentage: user.meetupCompatibility.toString() })}</span>
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

      {activeTab === 'community' && (
        <div className="space-y-4">
                    {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('meetup.searchPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">{t('meetup.filterAll')}</option>
                <option value="general">{t('meetup.filterGeneral')}</option>
                <option value="question">{t('meetup.filterQuestion')}</option>
                <option value="info">{t('meetup.filterInfo')}</option>
                <option value="help">{t('meetup.filterHelp')}</option>
              </select>
            </div>
          </div>

          {/* Message Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{t('meetup.messageStats', { filtered: filteredMessages.length.toString(), total: communityMessages.length.toString() })}</span>
            {(searchQuery || filterType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setFilterType('all')
                }}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {t('meetup.clearFilter')}
              </button>
            )}
          </div>

          {/* Message Input */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">{t('meetup.filterGeneral')}</option>
                <option value="question">{t('meetup.filterQuestion')}</option>
                <option value="info">{t('meetup.filterInfo')}</option>
                <option value="help">{t('meetup.filterHelp')}</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCommunityMessage}
                onChange={(e) => setNewCommunityMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendCommunityMessage()}
                placeholder={t('meetup.messagePlaceholder')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendCommunityMessage}
                disabled={!newCommunityMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredMessages.map((message) => (
              <div key={message.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-medium">{message.userAvatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1 flex-wrap">
                      <span className="font-medium text-gray-900">{message.user_name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                        message.message_type === 'question' ? 'bg-yellow-100 text-yellow-800' :
                        message.message_type === 'info' ? 'bg-green-100 text-green-800' :
                        message.message_type === 'help' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {message.message_type === 'question' ? t('meetup.typeQuestion') :
                         message.message_type === 'info' ? t('meetup.typeInfo') :
                         message.message_type === 'help' ? t('meetup.typeHelp') : t('meetup.typeGeneral')}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center flex-shrink-0">
                        <MapPin className="h-3 w-3 mr-1" />
                        {message.location || message.user_location}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 break-words">{message.content}</p>
                    {message.tags && message.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {message.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* 回复区域 */}
                    {selectedMessageForReply === message.id && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={t('meetup.replyPlaceholder')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                          rows={2}
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => setSelectedMessageForReply(null)}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                          >
                            {t('common.cancel')}
                          </button>
                          <button
                            onClick={() => handleReplyToMessage(message.id)}
                            disabled={!replyContent.trim()}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {t('meetup.reply')}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 显示回复 */}
                    {replies[message.id] && replies[message.id].length > 0 && (
                      <div className="mb-3 space-y-2">
                        {replies[message.id].map((reply) => (
                          <div key={reply.id} className="ml-4 p-2 bg-gray-50 rounded border-l-2 border-blue-200">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm text-gray-900">{reply.user_name}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(reply.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <button 
                        onClick={() => handleLikeMessage(message.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          message.is_liked_by_current_user 
                            ? 'text-blue-600' 
                            : 'hover:text-blue-600'
                        }`}
                        title={t('meetup.like')}
                      >
                        <span>👍</span>
                        <span>{message.likes_count}</span>
                      </button>
                      <button 
                        onClick={() => {
                          if (selectedMessageForReply === message.id) {
                            setSelectedMessageForReply(null)
                          } else {
                            setSelectedMessageForReply(message.id)
                            if (!replies[message.id]) {
                              fetchMessageReplies(message.id)
                            }
                          }
                        }}
                        className="hover:text-blue-600 transition-colors"
                        title={t('meetup.reply')}
                      >
                        {t('meetup.reply')} ({message.replies_count})
                      </button>
                      <button 
                        className="hover:text-blue-600 transition-colors"
                        title={t('meetup.share')}
                      >
                        {t('meetup.share')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMessages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              {searchQuery || filterType !== 'all' ? (
                <>
                  <p className="text-gray-600">{t('meetup.noMatchingMessages')}</p>
                  <p className="text-sm text-gray-500">{t('meetup.tryAdjustSearch')}</p>
                </>
              ) : (
                <>
                  <p className="text-gray-600">{t('meetup.noMessages')}</p>
                  <p className="text-sm text-gray-500">{t('meetup.startConversation')}</p>
                </>
              )}
            </div>
          )}
        </div>
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
