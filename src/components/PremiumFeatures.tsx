'use client'

import { useState } from 'react'
import { CrownIcon, DownloadIcon, BellIcon, MapIcon, StarIcon, CheckIcon } from 'lucide-react'

const premiumFeatures = [
  {
    icon: DownloadIcon,
    title: '城市对比报告',
    description: '导出PDF格式的详细城市对比分析',
    free: false
  },
  {
    icon: BellIcon,
    title: '签证到期提醒',
    description: '邮件和日历提醒，避免逾期',
    free: false
  },
  {
    icon: MapIcon,
    title: '个性化推荐',
    description: '基于你的偏好推荐下一个目的地',
    free: false
  },
  {
    icon: StarIcon,
    title: '高级筛选',
    description: '多维度筛选和排序城市',
    free: true
  },
  {
    icon: CrownIcon,
    title: '无广告体验',
    description: '享受纯净的浏览体验',
    free: false
  }
]

const affiliateServices = [
  {
    name: '住宿预订',
    description: 'Booking.com, Airbnb 优惠',
    commission: '3-15%',
    icon: '🏨'
  },
  {
    name: '签证服务',
    description: '专业签证代办服务',
    commission: '5-10%',
    icon: '🛂'
  },
  {
    name: '保险服务',
    description: '旅行和健康保险',
    commission: '8-12%',
    icon: '🛡️'
  },
  {
    name: 'Co-working',
    description: '全球联合办公空间',
    commission: '10-20%',
    icon: '💼'
  }
]

export default function PremiumFeatures() {
  const [showPricing, setShowPricing] = useState(false)

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <CrownIcon className="h-5 w-5 text-yellow-500 mr-2" />
          高级功能
        </h2>
        <button
          onClick={() => setShowPricing(!showPricing)}
          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
        >
          {showPricing ? '隐藏价格' : '查看价格'}
        </button>
      </div>

      {/* Features List */}
      <div className="space-y-4 mb-6">
        {premiumFeatures.map((feature, index) => {
          const IconComponent = feature.icon
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <IconComponent className={`h-5 w-5 ${feature.free ? 'text-green-500' : 'text-purple-500'}`} />
                <div>
                  <div className="font-medium text-gray-900">{feature.title}</div>
                  <div className="text-sm text-gray-600">{feature.description}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {feature.free ? (
                  <span className="text-green-600 text-sm font-medium">免费</span>
                ) : (
                  <span className="text-purple-600 text-sm font-medium">高级</span>
                )}
                {feature.free && <CheckIcon className="h-4 w-4 text-green-500" />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">订阅计划</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">月度订阅</h4>
              <div className="text-2xl font-bold text-purple-600 mb-2">$9.99</div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 所有高级功能</li>
                <li>• 无广告体验</li>
                <li>• 优先客服支持</li>
              </ul>
              <button className="w-full mt-3 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                开始订阅
              </button>
            </div>
            <div className="p-4 border-2 border-purple-500 rounded-lg bg-purple-50">
              <h4 className="font-semibold text-gray-900 mb-2">年度订阅</h4>
              <div className="text-2xl font-bold text-purple-600 mb-2">$99.99</div>
              <div className="text-sm text-green-600 mb-2">节省 $19.89</div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 所有高级功能</li>
                <li>• 无广告体验</li>
                <li>• 优先客服支持</li>
                <li>• 专属内容</li>
              </ul>
              <button className="w-full mt-3 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                开始订阅
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Affiliate Services */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">推荐服务</h3>
        <div className="grid grid-cols-2 gap-3">
          {affiliateServices.map((service, index) => (
            <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 text-center">
              <div className="text-2xl mb-2">{service.icon}</div>
              <div className="font-medium text-gray-900 text-sm">{service.name}</div>
              <div className="text-xs text-gray-600 mb-1">{service.description}</div>
              <div className="text-xs text-green-600 font-medium">佣金 {service.commission}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
