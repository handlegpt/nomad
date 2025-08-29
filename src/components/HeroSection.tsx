'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Globe, Clock, MapPin, Wifi } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import FixedLink from '@/components/FixedLink'

export default function HeroSection() {
  const { t } = useTranslation()
  const [currentTime, setCurrentTime] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')

  useEffect(() => {
    // 更新当前时间
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    // 获取当前位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 这里可以调用API获取城市名称
          setCurrentLocation('正在获取位置...')
        },
        () => {
          setCurrentLocation('位置不可用')
        }
      )
    }

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          
          {/* Left Content */}
          <div className="space-y-8 lg:pr-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200">
              <Globe className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-700">
                数字游民必备工具
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                发现你的
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  下一个目的地
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                实时时间、天气、WiFi速度、签证信息，一切数字游民需要的信息都在这里。
                让全球旅行变得更简单、更智能。
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <FixedLink 
                href="/cities"
                className="btn btn-lg btn-primary group"
              >
                探索城市
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </FixedLink>
              <FixedLink 
                href="/dashboard"
                className="btn btn-lg btn-secondary"
              >
                开始使用
              </FixedLink>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">40+</div>
                <div className="text-sm text-gray-600">热门城市</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1000+</div>
                <div className="text-sm text-gray-600">用户推荐</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">实时更新</div>
              </div>
            </div>
          </div>

          {/* Right Content - Live Info Card */}
          <div className="relative lg:sticky lg:top-8">
            <div className="card card-lg bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">实时信息</h3>
                  <p className="text-sm text-gray-600">你的当前位置</p>
                </div>

                {/* Current Time */}
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-mono font-bold text-gray-900">
                    {currentTime}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">当前时间</div>
                </div>

                {/* Current Location */}
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <MapPin className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">
                    {currentLocation}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">当前位置</div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <FixedLink 
                    href="/wifi-test"
                    className="btn btn-sm btn-primary"
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    测速
                  </FixedLink>
                  <FixedLink 
                    href="/cities"
                    className="btn btn-sm btn-secondary"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    探索
                  </FixedLink>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-auto">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-current text-white"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-current text-white"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-current text-white"
          ></path>
        </svg>
      </div>
    </section>
  )
}
