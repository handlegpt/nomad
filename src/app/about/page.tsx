'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { Globe, Users, Heart, Target } from 'lucide-react'

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">关于 NOMAD.NOW</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            为数字游民打造的最重要的信息工具 - 时间、位置、决策支持
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">我们的使命</h2>
            <p className="text-lg text-gray-600">
              让数字游民的生活更简单、更高效、更有趣
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">全球信息</h3>
              <p className="text-sm text-gray-600">
                实时时间、天气、WiFi速度等关键信息
              </p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">社区驱动</h3>
              <p className="text-sm text-gray-600">
                基于用户投票和推荐的城市排名
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">生活体验</h3>
              <p className="text-sm text-gray-600">
                从数据工具升级为生活体验社区
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">核心功能</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">实时信息工具</h3>
                <p className="text-gray-600">
                  显示当前位置的时间、天气、WiFi速度、签证剩余天数等关键信息
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">城市推荐系统</h3>
                <p className="text-gray-600">
                  基于社区投票的多维度城市排名，包括WiFi、社交、性价比、气候等
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">地点推荐</h3>
                <p className="text-gray-600">
                  咖啡馆、联合办公空间、住宿区域等具体地点的社区推荐
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-orange-600 font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">签证管理</h3>
                <p className="text-gray-600">
                  签证倒计时提醒、各国签证指南、申请流程等
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">团队</h2>
          <p className="text-center text-gray-600 mb-8">
            NOMAD.NOW 由一群热爱旅行的数字游民创建，我们理解这个群体的需求和挑战
          </p>
          
          <div className="text-center">
            <p className="text-gray-600">
              我们相信，通过技术和社区的力量，可以让数字游民的生活更加美好。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
