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
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import Logo from '@/components/Logo'
import { getCurrentUser, User as UserType } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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
  const [user, setUser] = useState<UserProfile | null>(null)
  const [visas, setVisas] = useState<VisaInfo[]>([])
  const [favorites, setFavorites] = useState<FavoriteCity[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // 获取当前用户信息
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        // 用户未登录，重定向到登录页面
        window.location.href = '/auth/login'
        return
      }

      setUser({
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
      })

      // 获取用户的签证信息
      const { data: userVisas } = await supabase
        .from('user_visas')
        .select('*')
        .eq('user_id', currentUser.id)

      if (userVisas) {
        setVisas((userVisas as UserVisa[]).map((visa: UserVisa) => ({
          id: visa.id,
          country: visa.country,
          type: visa.visa_type,
          expiryDate: visa.expiry_date,
          daysLeft: Math.ceil((new Date(visa.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
          status: visa.status
        })))
      }

      // 获取用户的收藏城市
      const { data: userFavorites } = await supabase
        .from('user_favorites')
        .select(`
          *,
          cities (
            id,
            name,
            country,
            country_code
          )
        `)
        .eq('user_id', currentUser.id)

      if (userFavorites) {
        setFavorites((userFavorites as UserFavorite[]).map((fav: UserFavorite) => ({
          id: fav.cities.id,
          name: fav.cities.name,
          country: fav.cities.country,
          countryCode: fav.cities.country_code,
          addedDate: new Date(fav.created_at).toLocaleDateString()
        })))
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // 清除本地存储的会话令牌
        localStorage.removeItem('session_token')
        // 重定向到首页
        window.location.href = '/'
      } else {
        console.error('退出登录失败')
      }
    } catch (error) {
      console.error('退出登录错误:', error)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Logo size="sm" linkToHome={true} />
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">用户后台</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>退出登录</span>
              </button>
            </div>
          </div>
        </div>
      </header>

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
                <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">加入时间：{user?.joinDate}</p>
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
                      <div className="text-2xl font-bold text-blue-600">{user?.currentCity}</div>
                      <div className="text-sm text-gray-600">当前城市</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{visas.length}</div>
                      <div className="text-sm text-gray-600">有效签证</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{favorites.length}</div>
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
                  {visas.map((visa) => (
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
                  {favorites.map((city) => (
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
                    { id: 'wifi', label: 'WiFi质量', value: user?.preferences.wifi || 0 },
                    { id: 'cost', label: '生活成本', value: user?.preferences.cost || 0 },
                    { id: 'climate', label: '气候舒适度', value: user?.preferences.climate || 0 },
                    { id: 'social', label: '社交氛围', value: user?.preferences.social || 0 },
                    { id: 'visa', label: '签证便利性', value: user?.preferences.visa || 0 }
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
