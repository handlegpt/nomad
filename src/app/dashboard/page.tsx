'use client'

import { useState, useEffect } from 'react'
import { 
  UsersIcon, MapPinIcon, ThumbsUpIcon, StarIcon, 
  TrendingUpIcon, ActivityIcon, GlobeIcon, CalendarIcon 
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface DashboardStats {
  totalUsers: number
  totalCities: number
  totalVotes: number
  avgRating: number
  activeUsers: number
  totalPlaces: number
  topCities: Array<{
    name: string
    country: string
    rating: number
    votes: number
  }>
  recentActivity: Array<{
    type: string
    description: string
    time: string
  }>
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    // 模拟获取统计数据
    const fetchStats = async () => {
      setLoading(true)
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockStats: DashboardStats = {
        totalUsers: 1247,
        totalCities: 156,
        totalVotes: 8923,
        avgRating: 4.2,
        activeUsers: 89,
        totalPlaces: 342,
        topCities: [
          { name: 'Lisbon', country: 'Portugal', rating: 4.8, votes: 230 },
          { name: 'Chiang Mai', country: 'Thailand', rating: 4.6, votes: 190 },
          { name: 'Tbilisi', country: 'Georgia', rating: 4.4, votes: 160 },
          { name: 'Bali', country: 'Indonesia', rating: 4.3, votes: 150 },
          { name: 'Medellin', country: 'Colombia', rating: 4.2, votes: 140 }
        ],
        recentActivity: [
          { type: 'vote', description: '用户对里斯本进行了投票', time: '2分钟前' },
          { type: 'place', description: '新增咖啡馆推荐：Blue Bottle Coffee', time: '5分钟前' },
          { type: 'user', description: '新用户注册：来自日本的数字游民', time: '10分钟前' },
          { type: 'review', description: '清迈获得5星评价', time: '15分钟前' },
          { type: 'city', description: '新增城市：布拉格', time: '1小时前' }
        ]
      }
      
      setStats(mockStats)
      setLoading(false)
    }

    fetchStats()
  }, [timeRange])

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    change 
  }: {
    title: string
    value: string | number
    icon: any
    color: string
    change?: string
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUpIcon className="h-4 w-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">数据统计仪表板</h1>
        <p className="text-gray-600">实时监控 NOMAD.NOW 平台的关键指标</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {[
            { value: '7d', label: '最近7天' },
            { value: '30d', label: '最近30天' },
            { value: '90d', label: '最近90天' }
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="总用户数"
          value={stats?.totalUsers.toLocaleString() || '0'}
          icon={UsersIcon}
          color="bg-blue-500"
          change="+12% 本月"
        />
        <StatCard
          title="活跃用户"
          value={stats?.activeUsers || '0'}
          icon={ActivityIcon}
          color="bg-green-500"
          change="+5% 本周"
        />
        <StatCard
          title="城市数量"
          value={stats?.totalCities || '0'}
          icon={MapPinIcon}
          color="bg-purple-500"
          change="+3 新增"
        />
        <StatCard
          title="平均评分"
          value={stats?.avgRating.toFixed(1) || '0.0'}
          icon={StarIcon}
          color="bg-yellow-500"
          change="+0.2 提升"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="总投票数"
          value={stats?.totalVotes.toLocaleString() || '0'}
          icon={ThumbsUpIcon}
          color="bg-red-500"
        />
        <StatCard
          title="推荐地点"
          value={stats?.totalPlaces || '0'}
          icon={GlobeIcon}
          color="bg-indigo-500"
        />
        <StatCard
          title="今日活跃"
          value="23"
          icon={CalendarIcon}
          color="bg-pink-500"
        />
      </div>

      {/* Top Cities and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Cities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">热门城市</h3>
          <div className="space-y-4">
            {stats?.topCities.map((city, index) => (
              <div key={city.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{city.name}</p>
                    <p className="text-sm text-gray-500">{city.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{city.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">({city.votes} 票)</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
          <div className="space-y-4">
            {stats?.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Chart Placeholder */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">用户增长趋势</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">图表功能开发中...</p>
        </div>
      </div>
    </div>
  )
}
