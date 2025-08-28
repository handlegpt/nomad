'use client'

import { useState } from 'react'
import { ArrowRightIcon, MapPinIcon, CalendarIcon, GlobeIcon } from 'lucide-react'

export default function SetupPage() {
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState({
    currentCity: '',
    currentCountry: '',
    visaExpiry: '',
    passportCountry: '',
    preferences: {
      wifi: 50,
      cost: 50,
      climate: 50,
      social: 50,
      visa: 50
    }
  })

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePreferenceChange = (preference: string, value: number) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }))
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const completeSetup = () => {
    // 保存用户数据到本地存储或数据库
    localStorage.setItem('nomad-user-data', JSON.stringify(userData))
    // 跳转到首页
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GlobeIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">欢迎来到 NOMAD.NOW</h1>
          <p className="text-gray-600">让我们快速设置你的个人信息</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">步骤 {step} / 3</span>
            <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Current Location */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 text-blue-500 mr-2" />
                你当前在哪里？
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    城市
                  </label>
                  <input
                    type="text"
                    value={userData.currentCity}
                    onChange={(e) => handleInputChange('currentCity', e.target.value)}
                    placeholder="例如：Osaka"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    国家
                  </label>
                  <input
                    type="text"
                    value={userData.currentCountry}
                    onChange={(e) => handleInputChange('currentCountry', e.target.value)}
                    placeholder="例如：Japan"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Visa Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 text-orange-500 mr-2" />
                签证信息
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    签证到期日期
                  </label>
                  <input
                    type="date"
                    value={userData.visaExpiry}
                    onChange={(e) => handleInputChange('visaExpiry', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    护照国家
                  </label>
                  <input
                    type="text"
                    value={userData.passportCountry}
                    onChange={(e) => handleInputChange('passportCountry', e.target.value)}
                    placeholder="例如：China"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                你的偏好设置
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                调整滑块来设置你对各个因素的重视程度
              </p>
              <div className="space-y-6">
                {Object.entries(userData.preferences).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {key === 'wifi' && 'WiFi质量'}
                        {key === 'cost' && '生活成本'}
                        {key === 'climate' && '气候舒适度'}
                        {key === 'social' && '社交氛围'}
                        {key === 'visa' && '签证便利性'}
                      </span>
                      <span className="text-sm text-gray-500">{value}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => handlePreferenceChange(key, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              上一步
            </button>
          )}
          
          <div className="flex-1"></div>
          
          {step < 3 ? (
            <button
              onClick={nextStep}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>下一步</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={completeSetup}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center space-x-2"
            >
              <span>完成设置</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            跳过，稍后设置
          </button>
        </div>
      </div>
    </div>
  )
}
