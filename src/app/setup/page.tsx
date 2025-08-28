'use client'

import { useState } from 'react'
import { 
  UserIcon, MapPinIcon, GlobeIcon, BellIcon, 
  ShieldIcon, PaletteIcon, SaveIcon 
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface UserSettings {
  profile: {
    name: string
    email: string
    avatar: string
    currentLocation: string
    timezone: string
  }
  preferences: {
    language: string
    theme: 'light' | 'dark' | 'auto'
    notifications: {
      visaReminders: boolean
      cityRecommendations: boolean
      weeklyDigest: boolean
      emailUpdates: boolean
    }
  }
  visa: {
    currentCountry: string
    visaType: string
    expiryDate: string
    passportCountry: string
  }
}

export default function SetupPage() {
  const { t, locale, setLocale } = useTranslation()
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'visa'>('profile')
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: '',
      email: '',
      avatar: '',
      currentLocation: '',
      timezone: 'Asia/Tokyo'
    },
    preferences: {
      language: locale,
      theme: 'light',
      notifications: {
        visaReminders: true,
        cityRecommendations: true,
        weeklyDigest: false,
        emailUpdates: true
      }
    },
    visa: {
      currentCountry: '',
      visaType: '',
      expiryDate: '',
      passportCountry: ''
    }
  })

  const handleSave = async () => {
    setSaving(true)
    
    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 保存到本地存储
    localStorage.setItem('userSettings', JSON.stringify(settings))
    
    // 更新语言设置
    if (settings.preferences.language !== locale) {
      setLocale(settings.preferences.language)
    }
    
    setSaving(false)
    
    // 显示成功消息
    alert('设置已保存！')
  }

  const updateSettings = (section: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const updateNestedSettings = (section: keyof UserSettings, subsection: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }))
  }

  const TabButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeTab === id
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">个人设置</h1>
        <p className="text-gray-600">配置你的个人信息和偏好设置</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-8">
        <TabButton id="profile" label="个人资料" icon={UserIcon} />
        <TabButton id="preferences" label="偏好设置" icon={PaletteIcon} />
        <TabButton id="visa" label="签证信息" icon={ShieldIcon} />
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">个人资料</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名
                </label>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(e) => updateSettings('profile', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="输入你的姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="输入你的邮箱"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  当前位置
                </label>
                <input
                  type="text"
                  value={settings.profile.currentLocation}
                  onChange={(e) => updateSettings('profile', 'currentLocation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：大阪，日本"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  时区
                </label>
                <select
                  value={settings.profile.timezone}
                  onChange={(e) => updateSettings('profile', 'timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                  <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                  <option value="Europe/London">Europe/London (UTC+0)</option>
                  <option value="America/New_York">America/New_York (UTC-5)</option>
                  <option value="Europe/Lisbon">Europe/Lisbon (UTC+0)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">偏好设置</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  语言
                </label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => updateSettings('preferences', 'language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="zh">中文</option>
                  <option value="es">Español</option>
                  <option value="ja">日本語</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主题
                </label>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) => updateSettings('preferences', 'theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">浅色</option>
                  <option value="dark">深色</option>
                  <option value="auto">跟随系统</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <BellIcon className="h-5 w-5 mr-2" />
                通知设置
              </h3>
              
              <div className="space-y-4">
                {[
                  { key: 'visaReminders', label: '签证到期提醒' },
                  { key: 'cityRecommendations', label: '城市推荐' },
                  { key: 'weeklyDigest', label: '每周摘要' },
                  { key: 'emailUpdates', label: '邮件更新' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.preferences.notifications[key as keyof typeof settings.preferences.notifications]}
                      onChange={(e) => updateNestedSettings('preferences', 'notifications', key, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Visa Tab */}
        {activeTab === 'visa' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">签证信息</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  护照国家
                </label>
                <select
                  value={settings.visa.passportCountry}
                  onChange={(e) => updateSettings('visa', 'passportCountry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">选择国家</option>
                  <option value="CN">中国</option>
                  <option value="US">美国</option>
                  <option value="JP">日本</option>
                  <option value="KR">韩国</option>
                  <option value="SG">新加坡</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  当前所在国家
                </label>
                <select
                  value={settings.visa.currentCountry}
                  onChange={(e) => updateSettings('visa', 'currentCountry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">选择国家</option>
                  <option value="JP">日本</option>
                  <option value="TH">泰国</option>
                  <option value="PT">葡萄牙</option>
                  <option value="ES">西班牙</option>
                  <option value="MX">墨西哥</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  签证类型
                </label>
                <select
                  value={settings.visa.visaType}
                  onChange={(e) => updateSettings('visa', 'visaType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">选择签证类型</option>
                  <option value="tourist">旅游签证</option>
                  <option value="business">商务签证</option>
                  <option value="student">学生签证</option>
                  <option value="work">工作签证</option>
                  <option value="digital_nomad">数字游民签证</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  到期日期
                </label>
                <input
                  type="date"
                  value={settings.visa.expiryDate}
                  onChange={(e) => updateSettings('visa', 'expiryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {settings.visa.expiryDate && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">签证状态</h4>
                <p className="text-blue-700">
                  距离签证到期还有 {Math.ceil((new Date(settings.visa.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} 天
                </p>
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <SaveIcon className="h-4 w-4" />
            <span>{saving ? '保存中...' : '保存设置'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
