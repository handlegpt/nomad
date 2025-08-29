'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  MapPin, 
  Calendar, 
  Heart, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Star,
  Clock,
  Globe,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import Header from '@/components/Header'
import { getCurrentUser, User as UserType } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useUser, useLoading, useNotifications } from '@/contexts/GlobalStateContext'
import { userDataService } from '@/lib/userDataService'
import LoadingSpinner from '@/components/LoadingSpinner'

interface UserProfile {
  id: string
  email: string
  name: string
  avatar: string
  currentCity: string
  joinDate: string
  preferences: {
    wifi: number
    cost: number
    climate: number
    social: number
    visa: number
  }
}

interface VisaInfo {
  id: string
  country: string
  type: string
  expiryDate: string
  daysLeft: number
  status: 'active' | 'expired' | 'expiring'
}

interface FavoriteCity {
  id: string
  name: string
  country: string
  countryCode: string
  addedDate: string
}

interface UserVisa {
  id: string
  user_id: string
  country: string
  visa_type: string
  expiry_date: string
  status: 'active' | 'expired' | 'expiring'
  created_at: string
}

interface UserFavorite {
  id: string
  user_id: string
  created_at: string
  cities: {
    id: string
    name: string
    country: string
    country_code: string
  }
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user, setUserProfile, setUserPreferences, setUserFavorites, setUserVisas, logout } = useUser()
  const { setLoading } = useLoading()
  const { addNotification } = useNotifications()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading('auth', true)
      setLocalLoading(true)
      
      // 获取当前用户信息
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        // 用户未登录，重定向到登录页面
        window.location.href = '/auth/login'
        return
      }

      // 设置用户基本信息
      const userProfile: UserProfile = {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        avatar: currentUser.avatar || '',
        currentCity: currentUser.current_city || '未设置',
        joinDate: new Date(currentUser.created_at).toLocaleDateString(),
        preferences: {
          wifi: 20,
          cost: 25,
          climate: 20,
          social: 15,
          visa: 20
        }
      }

      setUserProfile(userProfile)

      // 并行加载用户数据
      await Promise.all([
        loadUserPreferences(),
        loadUserVisas(),
        loadUserFavorites()
      ])

      addNotification({
        type: 'success',
        message: '用户数据加载完成',
        duration: 3000
      })

    } catch (error) {
      console.error('Error fetching user data:', error)
      addNotification({
        type: 'error',
        message: '加载用户数据失败',
        duration: 5000
      })
    } finally {
      setLoading('auth', false)
      setLocalLoading(false)
    }
  }

  const loadUserPreferences = async () => {
    try {
      const preferences = await userDataService.getUserPreferences()
      if (preferences) {
        setUserPreferences(preferences)
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }

  const loadUserVisas = async () => {
    try {
      const visas = await userDataService.getUserVisas()
      setUserVisas(visas)
    } catch (error) {
      console.error('Error loading visas:', error)
    }
  }

  const loadUserFavorites = async () => {
    try {
      const favorites = await userDataService.getUserFavorites()
      setUserFavorites(favorites)
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const handleLogout = async () => {
    try {
      setLoading('auth', true)
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        logout() // 这会清除全局状态和本地存储
        addNotification({
          type: 'success',
          message: '已成功退出登录',
          duration: 3000
        })
        window.location.href = '/'
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Error during logout:', error)
      addNotification({
        type: 'error',
        message: '退出登录失败',
        duration: 5000
      })
    } finally {
      setLoading('auth', false)
    }
  }

  const handleSyncData = async () => {
    try {
      setLoading('data', true)
      const success = await userDataService.syncUserData()
      
      if (success) {
        // 重新加载数据
        await Promise.all([
          loadUserPreferences(),
          loadUserVisas(),
          loadUserFavorites()
        ])
        
        addNotification({
          type: 'success',
          message: '数据同步成功',
          duration: 3000
        })
      } else {
        throw new Error('Sync failed')
      }
    } catch (error) {
      console.error('Error syncing data:', error)
      addNotification({
        type: 'error',
        message: '数据同步失败',
        duration: 5000
      })
    } finally {
      setLoading('data', false)
    }
  }

  if (localLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">正在加载用户数据...</p>
        </div>
      </div>
    )
  }

  if (!user.isAuthenticated || !user.profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">请先登录</p>
          <Link href="/auth/login" className="btn btn-primary mt-4">
            去登录
          </Link>
        </div>
      </div>
    )
  }

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const getVisaStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'expiring': return 'text-yellow-600 bg-yellow-50'
      case 'expired': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header showNavigation={false} pageTitle="用户后台" showPageTitle={true} />
      
      {/* Action Buttons */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSyncData}
              className="btn btn-md btn-primary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              同步数据
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-md btn-secondary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              退出登录
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* User Profile */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{user?.profile?.name || '未设置'}</h2>
                <p className="text-sm text-gray-500">{user?.profile?.email || '未设置'}</p>
                <p className="text-xs text-gray-400 mt-1">加入时间：{user?.profile?.joinDate || '未知'}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: '概览', icon: User },
                  { id: 'visas', label: '签证管理', icon: Calendar },
                  { id: 'favorites', label: '收藏城市', icon: Heart },
                  { id: 'preferences', label: '偏好设置', icon: Settings }
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Current Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    当前状态
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{user?.profile?.currentCity || '未设置'}</div>
                      <div className="text-sm text-gray-600">当前城市</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{user?.visas?.length || 0}</div>
                      <div className="text-sm text-gray-600">有效签证</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{user?.favorites?.length || 0}</div>
                      <div className="text-sm text-gray-600">收藏城市</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Heart className="h-4 w-4 text-red-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">收藏了清迈</p>
                        <p className="text-xs text-gray-500">2024-02-01</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">更新了签证信息</p>
                        <p className="text-xs text-gray-500">2024-01-25</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visas' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">签证管理</h3>
                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4" />
                    <span>添加签证</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {user?.visas?.map((visa) => (
                    <div key={visa.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{visa.country}</h4>
                          <p className="text-sm text-gray-600">{visa.type}</p>
                          <p className="text-xs text-gray-500">到期时间：{visa.expiryDate}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVisaStatusColor(visa.status)}`}>
                            {visa.daysLeft}天剩余
                          </span>
                          <div className="flex space-x-2 mt-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">收藏城市</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user?.favorites?.map((city) => (
                    <div key={city.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getCountryFlag(city.countryCode)}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{city.name}</h4>
                            <p className="text-sm text-gray-600">{city.country}</p>
                            <p className="text-xs text-gray-500">收藏时间：{city.addedDate}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Star className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">偏好设置</h3>
                
                <div className="space-y-4">
                  {[
                    { id: 'wifi', label: 'WiFi质量', value: user?.preferences?.wifi || 0 },
                    { id: 'cost', label: '生活成本', value: user?.preferences?.cost || 0 },
                    { id: 'climate', label: '气候舒适度', value: user?.preferences?.climate || 0 },
                    { id: 'social', label: '社交氛围', value: user?.preferences?.social || 0 },
                    { id: 'visa', label: '签证便利性', value: user?.preferences?.visa || 0 }
                  ].map((pref) => (
                    <div key={pref.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{pref.label}</span>
                        <span className="text-sm text-gray-500">{pref.value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={pref.value}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        readOnly
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
