'use client'

import { useState } from 'react'
import { Crown, Check, Star, Download, Bell, Users } from 'lucide-react'

export default function PremiumFeatures() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')

  const features = [
    {
      name: 'PDF城市对比报告',
      description: '生成详细的城市对比PDF报告',
      icon: Download
    },
    {
      name: '个性化签证提醒',
      description: '智能签证到期提醒和续签建议',
      icon: Bell
    },
    {
      name: 'AI城市推荐助手',
      description: '基于个人偏好的AI城市推荐',
      icon: Star
    },
    {
      name: '高级数据分析',
      description: '详细的成本和生活质量分析',
      icon: Users
    }
  ]

  const plans = {
    monthly: {
      price: 9.99,
      period: '月',
      savings: null
    },
    yearly: {
      price: 99.99,
      period: '年',
      savings: '节省 20%'
    }
  }

  const currentPlan = plans[selectedPlan]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Crown className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">高级功能</h2>
        <p className="text-gray-600">解锁更多专业功能，提升数字游民体验</p>
      </div>

      {/* Plan Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPlan === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            月付
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPlan === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            年付
          </button>
        </div>
      </div>

      {/* Pricing */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-3xl font-bold text-gray-900">¥{currentPlan.price}</span>
          <span className="text-gray-600">/{currentPlan.period}</span>
        </div>
        {currentPlan.savings && (
          <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
            {currentPlan.savings}
          </span>
        )}
      </div>

      {/* Features */}
      <div className="space-y-4 mb-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{feature.name}</h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA Button */}
      <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 flex items-center justify-center">
        <Crown className="h-5 w-5 mr-2" />
        升级到高级版
      </button>

      {/* Additional Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          7天免费试用 • 随时取消 • 无隐藏费用
        </p>
      </div>
    </div>
  )
}
