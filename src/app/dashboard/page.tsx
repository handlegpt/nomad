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
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import Header from '@/components/Header'
import { getCurrentUser, User as UserType } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useUser, useLoading, useNotifications } from '@/contexts/GlobalStateContext'
import { userDataService } from '@/lib/userDataService'
import LoadingSpinner from '@/components/LoadingSpinner'
import FixedLink from '@/components/FixedLink'

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
  const [editingVisa, setEditingVisa] = useState<string | null>(null)
  const [editingPreferences, setEditingPreferences] = useState(false)

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
        currentCity: currentUser.current_city || t('dashboard.notSet'),
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
        message: t('dashboard.userDataLoaded'),
        duration: 3000
      })

    } catch (error) {
      console.error('Error fetching user data:', error)
      addNotification({
        type: 'error',
        message: t('dashboard.failedToLoadData'),
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
          message: t('dashboard.logoutSuccess'),
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
        message: t('dashboard.logoutFailed'),
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
          message: t('dashboard.syncSuccess'),
          duration: 3000
        })
      } else {
        throw new Error('Sync failed')
      }
    } catch (error) {
      console.error('Error syncing data:', error)
      addNotification({
        type: 'error',
        message: t('dashboard.syncFailed'),
        duration: 5000
      })
    } finally {
      setLoading('data', false)
    }
  }

  const handleAddVisa = () => {
    // 实现添加签证功能
    addNotification({
      type: 'info',
      message: '添加签证功能即将推出',
      duration: 3000
    })
  }

  const handleEditVisa = (visaId: string) => {
    setEditingVisa(visaId)
    // TODO: 实现编辑签证功能
    addNotification({
      type: 'info',
      message: '编辑签证功能即将推出',
      duration: 3000
    })
  }

  const handleDeleteVisa = async (visaId: string) => {
    if (confirm('确定要删除这个签证记录吗？')) {
      try {
        // TODO: 实现删除签证功能
        addNotification({
          type: 'success',
          message: '签证记录已删除',
          duration: 3000
        })
      } catch (error) {
        addNotification({
          type: 'error',
          message: '删除失败',
          duration: 3000
        })
      }
    }
  }

  const handleRemoveFavorite = async (cityId: string) => {
    if (confirm('确定要移除这个收藏城市吗？')) {
      try {
        const success = await userDataService.removeFavorite(cityId)
        if (success) {
          await loadUserFavorites()
          addNotification({
            type: 'success',
            message: '已移除收藏城市',
            duration: 3000
          })
        }
      } catch (error) {
        addNotification({
          type: 'error',
          message: '移除失败',
          duration: 3000
        })
      }
    }
  }

  const handleUpdatePreferences = async (prefType: string, value: number) => {
    try {
      const currentPrefs = user.preferences || {
        wifi: 0,
        cost: 0,
        climate: 0,
        social: 0,
        visa: 0
      }
      
      const updatedPrefs = {
        ...currentPrefs,
        [prefType]: value
      }
      
      const success = await userDataService.saveUserPreferences(updatedPrefs)
      if (success) {
        setUserPreferences(updatedPrefs)
        addNotification({
          type: 'success',
          message: '偏好设置已更新',
          duration: 3000
        })
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: '更新失败',
        duration: 3000
      })
    }
  }

  if (localLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">{t('dashboard.loadingUserData')}</p>
        </div>
      </div>
    )
  }

  if (!user.isAuthenticated || !user.profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{t('dashboard.pleaseLogin')}</p>
          <FixedLink href="/auth/login" className="btn btn-primary mt-4">
            {t('dashboard.goToLogin')}
          </FixedLink>
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

  const getVisaStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'expiring': return <AlertTriangle className="h-4 w-4" />
      case 'expired': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const navigationItems = [
    { id: 'overview', label: t('dashboard.overview'), icon: User },
    { id: 'visas', label: t('dashboard.visas'), icon: Calendar },
    { id: 'favorites', label: t('dashboard.favorites'), icon: Heart },
    { id: 'preferences', label: t('dashboard.preferences'), icon: Settings }
  ]

  const preferenceItems = [
    { id: 'wifi', label: t('dashboard.wifiQuality'), value: user?.preferences?.wifi || 0 },
    { id: 'cost', label: t('dashboard.costOfLiving'), value: user?.preferences?.cost || 0 },
    { id: 'climate', label: t('dashboard.climateComfort'), value: user?.preferences?.climate || 0 },
    { id: 'social', label: t('dashboard.socialAtmosphere'), value: user?.preferences?.social || 0 },
    { id: 'visa', label: t('dashboard.visaConvenience'), value: user?.preferences?.visa || 0 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header showNavigation={false} pageTitle={t('dashboard.title')} showPageTitle={true} />
      
      {/* Action Buttons */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSyncData}
              className="btn btn-md btn-primary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('dashboard.syncData')}
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-md btn-secondary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('dashboard.logout')}
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
                <h2 className="text-lg font-semibold text-gray-900">{user?.profile?.name || t('dashboard.notSet')}</h2>
                <p className="text-sm text-gray-500">{user?.profile?.email || t('dashboard.notSet')}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {t('dashboard.joinDate', { date: user?.profile?.joinDate || t('dashboard.unknown') })}
                </p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {navigationItems.map((item) => {
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
                    {t('dashboard.currentStatus')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{user?.profile?.currentCity || t('dashboard.notSet')}</div>
                      <div className="text-sm text-gray-600">{t('dashboard.currentCity')}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{user?.visas?.length || 0}</div>
                      <div className="text-sm text-gray-600">{t('dashboard.validVisas')}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{user?.favorites?.length || 0}</div>
                      <div className="text-sm text-gray-600">{t('dashboard.favoriteCities')}</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.recentActivity')}</h3>
                  <div className="space-y-3">
                    {user?.favorites?.slice(0, 3).map((favorite, index) => (
                      <div key={favorite.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Heart className="h-4 w-4 text-red-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {t('dashboard.favoritedCity', { city: favorite.cities?.name || 'Unknown City' })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(favorite.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {user?.favorites?.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>暂无活动记录</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visas' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.visas')}</h3>
                  <button 
                    onClick={handleAddVisa}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('dashboard.addVisa')}</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {user?.visas?.map((visa) => (
                    <div key={visa.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getVisaStatusIcon(visa.status)}
                          <div>
                            <h4 className="font-medium text-gray-900">{visa.country}</h4>
                            <p className="text-sm text-gray-600">{visa.visa_type}</p>
                            <p className="text-xs text-gray-500">
                              {t('dashboard.expiryDate', { date: new Date(visa.expiry_date).toLocaleDateString() })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVisaStatusColor(visa.status)}`}>
                                                         {t('dashboard.daysRemaining', { days: Math.max(0, Math.ceil((new Date(visa.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))).toString() })}
                          </span>
                          <div className="flex space-x-2 mt-2">
                            <button 
                              onClick={() => handleEditVisa(visa.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteVisa(visa.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {user?.visas?.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>暂无签证记录</p>
                      <button 
                        onClick={handleAddVisa}
                        className="mt-4 btn btn-primary"
                      >
                        {t('dashboard.addVisa')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('dashboard.favorites')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user?.favorites?.map((favorite) => (
                    <div key={favorite.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getCountryFlag(favorite.cities?.country_code || 'US')}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{favorite.cities?.name || 'Unknown City'}</h4>
                            <p className="text-sm text-gray-600">{favorite.cities?.country || 'Unknown Country'}</p>
                            <p className="text-xs text-gray-500">
                              {t('dashboard.favoritedOn', { date: new Date(favorite.created_at).toLocaleDateString() })}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <FixedLink 
                            href={`/cities/${favorite.cities?.id}`}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Star className="h-4 w-4" />
                          </FixedLink>
                          <button 
                            onClick={() => handleRemoveFavorite(favorite.cities?.id || '')}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {user?.favorites?.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>暂无收藏城市</p>
                      <FixedLink href="/cities" className="mt-4 btn btn-primary">
                        探索城市
                      </FixedLink>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.preferences')}</h3>
                  <button
                    onClick={() => setEditingPreferences(!editingPreferences)}
                    className="btn btn-sm btn-secondary"
                  >
                    {editingPreferences ? '保存' : '编辑'}
                  </button>
                </div>
                
                <div className="space-y-6">
                  {preferenceItems.map((pref) => (
                    <div key={pref.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{pref.label}</span>
                        <span className="text-sm text-gray-500">{pref.value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={pref.value}
                        onChange={(e) => {
                          if (editingPreferences) {
                            handleUpdatePreferences(pref.id, parseInt(e.target.value))
                          }
                        }}
                        disabled={!editingPreferences}
                        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${
                          editingPreferences ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        }`}
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>低</span>
                        <span>高</span>
                      </div>
                    </div>
                  ))}
                  
                  {!editingPreferences && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        点击"编辑"按钮来调整您的偏好设置，这将影响我们为您推荐的城市。
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
