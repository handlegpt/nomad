'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3Icon, 
  TrendingUpIcon, 
  UsersIcon, 
  MapPinIcon, 
  StarIcon, 
  CalendarIcon,
  GlobeIcon,
  WifiIcon,
  DollarSignIcon
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface StatCard {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
  color: string
}

interface ChartData {
  month: string
  users: number
  cities: number
  votes: number
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // 模拟统计数据
  const stats: StatCard[] = [
    {
      title: '活跃用户',
      value: '12,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: <UsersIcon className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: '城市数量',
      value: '156',
      change: '+3',
      changeType: 'positive',
      icon: <MapPinIcon className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: '总投票数',
      value: '89,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: <StarIcon className="h-6 w-6" />,
      color: 'bg-yellow-500'
    },
    {
      title: '平均评分',
      value: '4.6',
      change: '+0.1',
      changeType: 'positive',
      icon: <TrendingUpIcon className="h-6 w-6" />,
      color: 'bg-purple-500'
    }
  ]

  const chartData: ChartData[] = [
    { month: '1月', users: 8500, cities: 120, votes: 6500 },
    { month: '2月', users: 9200, cities: 125, votes: 7200 },
    { month: '3月', users: 9800, cities: 130, votes: 7800 },
    { month: '4月', users: 10500, cities: 135, votes: 8200 },
    { month: '5月', users: 11200, cities: 140, votes: 8900 },
    { month: '6月', users: 12847, cities: 156, votes: 89234 }
  ]

  const topCities = [
    { name: '里斯本', country: '葡萄牙', votes: 2340, rating: 4.8 },
    { name: '清迈', country: '泰国', votes: 2156, rating: 4.7 },
    { name: '巴厘岛', country: '印度尼西亚', votes: 1987, rating: 4.6 },
    { name: '墨西哥城', country: '墨西哥', votes: 1876, rating: 4.5 },
    { name: '布达佩斯', country: '匈牙利', votes: 1765, rating: 4.4 }
  ]

  const recentActivity = [
    { type: 'vote', user: '张三', action: '为里斯本投票', time: '2分钟前' },
    { type: 'review', user: '李四', action: '在清迈发表评价', time: '5分钟前' },
    { type: 'join', user: '王五', action: '加入社区', time: '10分钟前' },
    { type: 'vote', user: '赵六', action: '为巴厘岛投票', time: '15分钟前' }
  ]

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'positive': return '↗'
      case 'negative': return '↘'
      default: return '→'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3Icon className="h-8 w-8 text-blue-500 mr-3" />
                数据统计仪表板
              </h1>
              <p className="text-gray-600 mt-2">实时监控平台数据和用户活动</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">本周</option>
                <option value="month">本月</option>
                <option value="quarter">本季度</option>
                <option value="year">本年</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <div className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                  {getChangeIcon(stat.changeType)} {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Growth Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">增长趋势</h3>
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-600">{data.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">用户: {data.users.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(data.users / 13000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">热门城市</h3>
            <div className="space-y-4">
              {topCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{city.name}</p>
                      <p className="text-sm text-gray-600">{city.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{city.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{city.votes} 票</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">最近活动</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <GlobeIcon className="h-6 w-6 text-blue-500" />
              <h4 className="font-semibold text-gray-900">覆盖国家</h4>
            </div>
            <p className="text-3xl font-bold text-gray-900">45</p>
            <p className="text-sm text-gray-600">个国家和地区</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <WifiIcon className="h-6 w-6 text-green-500" />
              <h4 className="font-semibold text-gray-900">平均网速</h4>
            </div>
            <p className="text-3xl font-bold text-gray-900">85</p>
            <p className="text-sm text-gray-600">Mbps</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <DollarSignIcon className="h-6 w-6 text-yellow-500" />
              <h4 className="font-semibold text-gray-900">平均成本</h4>
            </div>
            <p className="text-3xl font-bold text-gray-900">$1,200</p>
            <p className="text-sm text-gray-600">每月生活成本</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <CalendarIcon className="h-6 w-6 text-purple-500" />
              <h4 className="font-semibold text-gray-900">平均停留</h4>
            </div>
            <p className="text-3xl font-bold text-gray-900">90</p>
            <p className="text-sm text-gray-600">天</p>
          </div>
        </div>
      </div>
    </div>
  )
}
