'use client'

import { useState } from 'react'
import { XIcon, StarIcon, WifiIcon, UsersIcon, DollarSignIcon, CloudIcon } from 'lucide-react'
import { submitVote } from '@/lib/api'

interface VoteModalProps {
  city: {
    id: string
    name: string
    country: string
  }
  isOpen: boolean
  onClose: () => void
  onVoteSubmitted: () => void
}

const ratingCategories = [
  {
    id: 'overall',
    label: '总体评分',
    icon: StarIcon,
    description: '这个城市的整体体验如何？'
  },
  {
    id: 'wifi',
    label: 'WiFi质量',
    icon: WifiIcon,
    description: '网络速度和稳定性'
  },
  {
    id: 'social',
    label: '社交氛围',
    icon: UsersIcon,
    description: '当地人和游民社区'
  },
  {
    id: 'value',
    label: '性价比',
    icon: DollarSignIcon,
    description: '生活成本与质量对比'
  },
  {
    id: 'climate',
    label: '气候舒适度',
    icon: CloudIcon,
    description: '天气和季节变化'
  }
]

export default function VoteModal({ city, isOpen, onClose, onVoteSubmitted }: VoteModalProps) {
  const [ratings, setRatings] = useState({
    overall: 0,
    wifi: 0,
    social: 0,
    value: 0,
    climate: 0
  })
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleRatingChange = (category: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating
    }))
  }

  const handleSubmit = async () => {
    if (ratings.overall === 0) {
      alert(t('voteModal.pleaseProvideRating'))
      return
    }

    setSubmitting(true)
    try {
      await submitVote({
        city_id: city.id,
        user_id: 'anonymous', // Should use real user ID here
        overall_rating: ratings.overall,
        wifi_rating: ratings.wifi || ratings.overall,
        social_rating: ratings.social || ratings.overall,
        value_rating: ratings.value || ratings.overall,
        climate_rating: ratings.climate || ratings.overall,
        comment: comment.trim() || ''
      })
      
      onVoteSubmitted()
      onClose()
      // Reset form
      setRatings({ overall: 0, wifi: 0, social: 0, value: 0, climate: 0 })
      setComment('')
    } catch (error) {
      console.error('Error submitting vote:', error)
      alert(t('voteModal.submitFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const getRatingDescription = (rating: number) => {
    if (rating === 0) return '点击星星评分'
    if (rating <= 2) return '不推荐'
    if (rating <= 3) return '一般'
    if (rating <= 4) return '推荐'
    return '强烈推荐'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">为 {city.name} 投票</h2>
              <p className="text-gray-600">{city.country}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Rating Categories */}
          <div className="space-y-6">
            {ratingCategories.map((category) => {
              const IconComponent = category.icon
              const currentRating = ratings[category.id as keyof typeof ratings]
              
              return (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.label}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(category.id, star)}
                        className={`p-1 transition-colors ${
                          star <= currentRating
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        <StarIcon className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    {getRatingDescription(currentRating)}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Comment */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分享你的体验（可选）
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="告诉我们你在这个城市的经历..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || ratings.overall === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '提交中...' : '提交投票'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
