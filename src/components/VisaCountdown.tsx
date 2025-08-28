'use client'

import { useState, useEffect } from 'react'
import { CalendarIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon } from 'lucide-react'
import { calculateVisaDays } from '@/lib/api'
import { useTranslation } from '@/hooks/useTranslation'

interface VisaCountdownProps {
  visaExpiry: string
  country: string
  visaType: string
}

export default function VisaCountdown({ visaExpiry, country, visaType }: VisaCountdownProps) {
  const { t } = useTranslation()
  const [daysLeft, setDaysLeft] = useState(0)
  const [status, setStatus] = useState<'safe' | 'warning' | 'danger' | 'expired'>('safe')

  useEffect(() => {
    const days = calculateVisaDays(visaExpiry)
    setDaysLeft(days)
    
    if (days <= 0) {
      setStatus('expired')
    } else if (days <= 7) {
      setStatus('danger')
    } else if (days <= 30) {
      setStatus('warning')
    } else {
      setStatus('safe')
    }
  }, [visaExpiry])

  const getStatusColor = () => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'danger': return 'text-red-600 bg-red-50'
      case 'expired': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'safe': return <CheckCircleIcon className="h-5 w-5" />
      case 'warning': return <ClockIcon className="h-5 w-5" />
      case 'danger': return <AlertTriangleIcon className="h-5 w-5" />
      case 'expired': return <AlertTriangleIcon className="h-5 w-5" />
      default: return <CalendarIcon className="h-5 w-5" />
    }
  }

  const getStatusMessage = () => {
    if (daysLeft <= 0) {
      return '签证已过期，请立即处理'
    } else if (daysLeft <= 7) {
      return '签证即将到期，请尽快处理'
    } else if (daysLeft <= 30) {
      return '签证即将到期，建议提前规划'
    } else {
      return '签证状态良好'
    }
  }

  const getRecommendations = () => {
    if (daysLeft <= 0) {
      return ['立即联系移民局', '考虑申请延期', '准备离境计划']
    } else if (daysLeft <= 7) {
      return ['申请签证延期', '准备离境', '联系移民律师']
    } else if (daysLeft <= 30) {
      return ['规划下一步', '了解延期政策', '准备必要文件']
    } else {
      return ['继续享受旅行', '关注政策变化', '规划下次续签']
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
          签证倒计时
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{getStatusMessage()}</span>
        </div>
      </div>

      {/* Main Countdown */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {daysLeft > 0 ? daysLeft : 0}
        </div>
        <div className="text-gray-600">天</div>
        <div className="text-sm text-gray-500 mt-2">
          {country} • {visaType}
        </div>
        <div className="text-sm text-gray-500">
          到期时间: {new Date(visaExpiry).toLocaleDateString()}
        </div>
      </div>

      {/* Recommendations */}
      {status !== 'safe' && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-900 mb-3">建议行动:</h4>
          <ul className="space-y-2">
            {getRecommendations().map((rec, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            设置提醒
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            查看政策
          </button>
        </div>
      </div>
    </div>
  )
}
