'use client'

import { useState, useEffect } from 'react'
import { Bell, Coffee, Calendar, MapPin, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useNotifications } from '@/contexts/GlobalStateContext'
import { logInfo, logError } from '@/lib/logger'

interface MeetupNotification {
  id: string
  type: 'invitation' | 'reminder' | 'update' | 'message'
  title: string
  message: string
  messageParams?: Record<string, string>
  from: string
  time: string
  isRead: boolean
  action?: {
    type: 'accept' | 'decline' | 'view' | 'reply'
    data?: any
  }
}

export default function MeetupNotifications() {
  const { t } = useTranslation()
  const { addNotification } = useNotifications()
  const [notifications, setNotifications] = useState<MeetupNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 这里应该调用真实的API
      // 目前使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockNotifications: MeetupNotification[] = [
        {
          id: '1',
          type: 'invitation',
          title: 'meetup.notifications.newInvitation',
          message: 'meetup.notifications.invitationMessage',
          messageParams: { user: 'Sarah Chen' },
          from: 'Sarah Chen',
          time: '2分钟前',
          isRead: false,
          action: {
            type: 'accept',
            data: { meetupId: '123' }
          }
        },
        {
          id: '2',
          type: 'reminder',
          title: 'meetup.notifications.meetupReminder',
          message: 'meetup.notifications.reminderMessage',
          messageParams: { time: '14:00', location: 'Blue Bottle Coffee' },
          from: 'System',
          time: '1小时前',
          isRead: false,
          action: {
            type: 'view',
            data: { meetupId: '456' }
          }
        },
        {
          id: '3',
          type: 'update',
          title: 'meetup.notifications.meetupUpdate',
          message: 'meetup.notifications.updateMessage',
          messageParams: { user: 'Alex Rodriguez' },
          from: 'Alex Rodriguez',
          time: '3小时前',
          isRead: true,
          action: {
            type: 'view',
            data: { meetupId: '789' }
          }
        },
        {
          id: '4',
          type: 'message',
          title: 'meetup.notifications.newMessage',
          message: 'meetup.notifications.messagePreview',
          messageParams: { user: 'Emma Wilson' },
          from: 'Emma Wilson',
          time: '1天前',
          isRead: true,
          action: {
            type: 'reply',
            data: { userId: 'emma123' }
          }
        }
      ]
      
      setNotifications(mockNotifications)
    } catch (error) {
      logError('Failed to fetch notifications', error, 'MeetupNotifications')
      setError(t('meetup.notifications.loadError'))
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (notification: MeetupNotification) => {
    if (!notification.action) return

    try {
      switch (notification.action.type) {
        case 'accept':
          // 这里应该调用API接受邀请
          logInfo('Accepting meetup invitation', notification.action.data, 'MeetupNotifications')
          addNotification({
            type: 'success',
            message: t('meetup.notifications.invitationAccepted')
          })
          break
        case 'decline':
          // 这里应该调用API拒绝邀请
          logInfo('Declining meetup invitation', notification.action.data, 'MeetupNotifications')
          addNotification({
            type: 'info',
            message: t('meetup.notifications.invitationDeclined')
          })
          break
        case 'view':
          // 查看meetup详情
          logInfo('Viewing meetup details', notification.action.data, 'MeetupNotifications')
          break
        case 'reply':
          // 回复消息
          logInfo('Replying to message', notification.action.data, 'MeetupNotifications')
          break
      }
      
      // 标记为已读
      markAsRead(notification.id)
    } catch (error) {
      logError('Failed to handle notification action', error, 'MeetupNotifications')
      addNotification({
        type: 'error',
        message: t('meetup.notifications.actionError')
      })
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'invitation':
        return <Coffee className="h-5 w-5 text-green-600" />
      case 'reminder':
        return <Calendar className="h-5 w-5 text-blue-600" />
      case 'update':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'invitation':
        return 'bg-green-100'
      case 'reminder':
        return 'bg-blue-100'
      case 'update':
        return 'bg-yellow-100'
      case 'message':
        return 'bg-purple-100'
      default:
        return 'bg-gray-100'
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3)

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

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchNotifications}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Clock className="h-4 w-4" />
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
          <div className="p-2 bg-orange-100 rounded-lg">
            <Bell className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{t('meetup.notifications.title')}</h3>
            <p className="text-sm text-gray-600">{t('meetup.notifications.description')}</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">{t('meetup.notifications.noNotifications')}</p>
            <p className="text-sm text-gray-500">{t('meetup.notifications.checkLater')}</p>
          </div>
        ) : (
          displayedNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`border rounded-lg p-4 transition-colors ${
                notification.isRead 
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {t(notification.title)}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      {notification.time}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.messageParams 
                      ? t(notification.message, notification.messageParams)
                      : t(notification.message)
                    }
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {t('meetup.notifications.from')}: {notification.from}
                    </span>
                    
                    {notification.action && (
                      <div className="flex space-x-2">
                        {notification.action.type === 'accept' && (
                          <>
                            <button
                              onClick={() => handleAction(notification)}
                              className="flex items-center space-x-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>{t('meetup.notifications.accept')}</span>
                            </button>
                            <button
                              onClick={() => handleAction({ ...notification, action: { type: 'decline', data: notification.action!.data } })}
                              className="flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                            >
                              <XCircle className="h-3 w-3" />
                              <span>{t('meetup.notifications.decline')}</span>
                            </button>
                          </>
                        )}
                        {notification.action.type === 'view' && (
                          <button
                            onClick={() => handleAction(notification)}
                            className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                          >
                            <MapPin className="h-3 w-3" />
                            <span>{t('meetup.notifications.view')}</span>
                          </button>
                        )}
                        {notification.action.type === 'reply' && (
                          <button
                            onClick={() => handleAction(notification)}
                            className="flex items-center space-x-1 bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition-colors"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>{t('meetup.notifications.reply')}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      {notifications.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {t('meetup.notifications.markAllRead')}
            </button>
            
            {notifications.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-gray-600 hover:text-gray-700 transition-colors"
              >
                {showAll ? t('meetup.notifications.showLess') : t('meetup.notifications.showAll')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
