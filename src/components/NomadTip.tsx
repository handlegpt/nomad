'use client'

import { useState } from 'react'
import { LightbulbIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const tips = [
  {
    id: 1,
    content: '在葡萄牙，数字游民签证允许停留1年并可续签。',
    category: '签证'
  },
  {
    id: 2,
    content: '泰国的数字游民签证需要月收入至少$2,000。',
    category: '签证'
  },
  {
    id: 3,
    content: '里斯本的咖啡馆WiFi速度普遍很快，适合远程工作。',
    category: '工作'
  },
  {
    id: 4,
    content: '清迈的生活成本比曼谷低30%，但网速稍慢。',
    category: '生活'
  },
  {
    id: 5,
    content: '格鲁吉亚对大多数国家提供1年免签，非常适合游民。',
    category: '签证'
  }
]

export default function NomadTip() {
  const { t } = useTranslation()
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [showSubscription, setShowSubscription] = useState(false)

  const currentTip = tips[currentTipIndex]

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length)
  }

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <LightbulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
          Nomad 小贴士
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevTip}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-500">
            {currentTipIndex + 1} / {tips.length}
          </span>
          <button
            onClick={nextTip}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <p className="text-gray-700 italic leading-relaxed">
              「{currentTip.content}」
            </p>
            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {currentTip.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowSubscription(!showSubscription)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          订阅邮件提醒 → 获取签证到期/城市推荐
        </button>
      </div>

      {/* Subscription Form */}
      {showSubscription && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-3">订阅设置</h4>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="输入邮箱地址"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span>签证到期提醒</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span>城市推荐</span>
              </label>
            </div>
            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                订阅
              </button>
              <button
                onClick={() => setShowSubscription(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
