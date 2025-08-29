'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Users, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { logInfo, logError } from '@/lib/logger'
import { getMeetupHistory, type MeetupInvitation } from '@/lib/meetupApi'

export default function MeetupHistory() {
  const { t } = useTranslation()
  const [meetups, setMeetups] = useState<MeetupInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMeetupHistory()
  }, [])

  const fetchMeetupHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 这里应该调用真实的API
      // 目前使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockMeetups: MeetupInvitation[] = [
        {
          id: '1',
          location: 'Blue Bottle Coffee, Shinsaibashi',
          time: '2024-01-15T14:00:00Z',
          description: 'Coffee and chat about digital nomad life',
          createdBy: 'Sarah Chen',
          createdAt: '2024-01-15T10:00:00Z',
          status: 'accepted'
        },
        {
          id: '2',
          location: 'Starbucks, Namba',
          time: '2024-01-12T16:00:00Z',
          description: 'Working session and networking',
          createdBy: 'Alex Rodriguez',
          createdAt: '2024-01-12T09:00:00Z',
          status: 'completed'
        },
        {
          id: '3',
          location: 'Cafe de Paris, Umeda',
          time: '2024-01-10T19:00:00Z',
          description: 'Dinner and cultural exchange',
          createdBy: 'Yuki Tanaka',
          createdAt: '2024-01-10T15:00:00Z',
          status: 'declined'
        },
        {
          id: '4',
          location: 'Tully\'s Coffee, Tennoji',
          time: '2024-01-08T11:00:00Z',
          description: 'Morning coffee and travel stories',
          createdBy: 'Emma Wilson',
          createdAt: '2024-01-08T08:00:00Z',
          status: 'completed'
        }
      ]
      
      setMeetups(mockMeetups)
    } catch (error) {
      logError('Failed to fetch meetup history', error, 'MeetupHistory')
      setError(t('meetup.failedToLoadHistory'))
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'declined':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'declined':
        return <XCircle className="h-4 w-4" />
      case 'pending':
        return <ClockIcon className="h-4 w-4" />
      default:
        return <ClockIcon className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return t('meetup.statusAccepted')
      case 'completed':
        return t('meetup.statusCompleted')
      case 'declined':
        return t('meetup.statusDeclined')
      case 'pending':
        return t('meetup.statusPending')
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <Calendar className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMeetupHistory}
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
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{t('meetup.history')}</h3>
            <p className="text-sm text-gray-600">{t('meetup.historyDescription')}</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">{meetups.length} {t('meetup.meetups')}</span>
      </div>

      {/* Meetup List */}
      <div className="space-y-4">
        {meetups.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">{t('meetup.noHistory')}</p>
            <p className="text-sm text-gray-500">{t('meetup.startMeeting')}</p>
          </div>
        ) : (
          meetups.map((meetup) => (
            <div key={meetup.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(meetup.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meetup.status)}`}>
                    {getStatusText(meetup.status)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{formatDate(meetup.createdAt)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{meetup.location}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{formatDate(meetup.time)}</span>
                </div>
                
                {meetup.description && (
                  <p className="text-sm text-gray-600 mt-2">{meetup.description}</p>
                )}
                
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>{t('meetup.createdBy')}: {meetup.createdBy}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {meetups.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900">{meetups.length}</p>
              <p className="text-xs text-gray-600">{t('meetup.totalMeetups')}</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">
                {meetups.filter(m => m.status === 'completed' || m.status === 'accepted').length}
              </p>
              <p className="text-xs text-gray-600">{t('meetup.successful')}</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-600">
                {meetups.filter(m => m.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-600">{t('meetup.pending')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
