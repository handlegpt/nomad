'use client'

import { useState } from 'react'
import { SearchIcon, FilterIcon, BookOpenIcon, CalendarIcon, GlobeIcon, DollarSignIcon } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface VisaGuide {
  id: string
  country: string
  countryCode: string
  visaType: string
  duration: string
  cost: string
  requirements: string[]
  process: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  processingTime: string
}

const visaGuides: VisaGuide[] = [
  {
    id: '1',
    country: '葡萄牙',
    countryCode: 'PT',
    visaType: '数字游民签证',
    duration: '1年（可续签）',
    cost: '€75',
    requirements: [
      '月收入至少€2,800',
      '健康保险',
      '无犯罪记录证明',
      '住宿证明'
    ],
    process: [
      '在线申请',
      '提交所需文件',
      '支付申请费',
      '等待审批（约2-4周）'
    ],
    difficulty: 'medium',
    processingTime: '2-4周'
  },
  {
    id: '2',
    country: '泰国',
    countryCode: 'TH',
    visaType: '旅游签证',
    duration: '60天（可延期）',
    cost: '$40',
    requirements: [
      '有效护照（至少6个月有效期）',
      '往返机票',
      '住宿证明',
      '资金证明'
    ],
    process: [
      '在大使馆或领事馆申请',
      '提交申请表格和文件',
      '支付签证费',
      '等待审批（约3-5个工作日）'
    ],
    difficulty: 'easy',
    processingTime: '3-5个工作日'
  },
  {
    id: '3',
    country: '日本',
    countryCode: 'JP',
    visaType: '旅游签证',
    duration: '90天',
    cost: '免费',
    requirements: [
      '有效护照',
      '往返机票',
      '住宿证明',
      '行程安排'
    ],
    process: [
      '通过指定旅行社申请',
      '提交所需文件',
      '等待审批（约5-10个工作日）',
      '领取签证'
    ],
    difficulty: 'medium',
    processingTime: '5-10个工作日'
  }
]

export default function VisaGuidePage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedDuration, setSelectedDuration] = useState<string>('all')

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'hard': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单'
      case 'medium': return '中等'
      case 'hard': return '困难'
      default: return '未知'
    }
  }

  const filteredGuides = visaGuides.filter(guide => {
    const matchesSearch = guide.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.visaType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty
    const matchesDuration = selectedDuration === 'all' || guide.duration.includes(selectedDuration)
    
    return matchesSearch && matchesDifficulty && matchesDuration
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <BookOpenIcon className="h-8 w-8 text-blue-500 mr-3" />
              签证申请指南
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              为数字游民提供详细的签证申请信息，帮助你轻松获得各国签证
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索国家或签证类型..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">所有难度</option>
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">所有时长</option>
                <option value="30天">30天</option>
                <option value="60天">60天</option>
                <option value="90天">90天</option>
                <option value="1年">1年</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Visa Guides */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGuides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{getCountryFlag(guide.countryCode)}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{guide.country}</h3>
                      <p className="text-gray-600">{guide.visaType}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(guide.difficulty)}`}>
                    {getDifficultyText(guide.difficulty)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">时长：</span>
                    <span className="font-medium">{guide.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSignIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">费用：</span>
                    <span className="font-medium">{guide.cost}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GlobeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">处理时间：</span>
                    <span className="font-medium">{guide.processingTime}</span>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="p-6 border-b border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">申请要求</h4>
                <ul className="space-y-2">
                  {guide.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Process */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">申请流程</h4>
                <div className="space-y-3">
                  {guide.process.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的签证指南</h3>
            <p className="text-gray-600">尝试调整搜索条件或筛选器</p>
          </div>
        )}
      </div>
    </div>
  )
}
