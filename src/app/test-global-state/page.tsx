'use client'

import { useState } from 'react'
import { useUser, useLoading, useNotifications } from '@/contexts/GlobalStateContext'
import { userDataService } from '@/lib/userDataService'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function TestGlobalStatePage() {
  const { user, setUserPreferences, setUserFavorites, setUserVisas } = useUser()
  const { loading, setLoading } = useLoading()
  const { addNotification } = useNotifications()
  
  const [testPreferences, setTestPreferences] = useState({
    wifi: 50,
    cost: 60,
    climate: 70,
    social: 80,
    visa: 90
  })

  const handleTestPreferences = async () => {
    try {
      setLoading('data', true)
      await userDataService.saveUserPreferences(testPreferences)
      setUserPreferences(testPreferences)
      addNotification({
        type: 'success',
        message: '偏好设置已保存并同步',
        duration: 3000
      })
    } catch (error) {
      addNotification({
        type: 'error',
        message: '保存偏好设置失败',
        duration: 5000
      })
    } finally {
      setLoading('data', false)
    }
  }

  const handleTestNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    addNotification({
      type,
      message: `这是一个${type === 'success' ? '成功' : type === 'error' ? '错误' : type === 'warning' ? '警告' : '信息'}通知`,
      duration: 5000
    })
  }

  const handleTestLoading = (key: 'global' | 'auth' | 'data' | 'ui') => {
    setLoading(key, true)
    setTimeout(() => {
      setLoading(key, false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">全局状态管理测试</h1>
        
        {/* 当前状态显示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card card-lg">
            <h2 className="text-xl font-semibold mb-4">当前用户状态</h2>
            <div className="space-y-2">
              <p><strong>认证状态:</strong> {user.isAuthenticated ? '已登录' : '未登录'}</p>
              <p><strong>用户名:</strong> {user.profile?.name || '未设置'}</p>
              <p><strong>邮箱:</strong> {user.profile?.email || '未设置'}</p>
              <p><strong>收藏数量:</strong> {user.favorites?.length || 0}</p>
              <p><strong>签证数量:</strong> {user.visas?.length || 0}</p>
            </div>
          </div>
          
          <div className="card card-lg">
            <h2 className="text-xl font-semibold mb-4">加载状态</h2>
            <div className="space-y-2">
              <p><strong>全局加载:</strong> {loading.global ? '是' : '否'}</p>
              <p><strong>认证加载:</strong> {loading.auth ? '是' : '否'}</p>
              <p><strong>数据加载:</strong> {loading.data ? '是' : '否'}</p>
              <p><strong>UI加载:</strong> {loading.ui ? '是' : '否'}</p>
            </div>
          </div>
        </div>

        {/* 测试功能 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 偏好设置测试 */}
          <div className="card card-lg">
            <h2 className="text-xl font-semibold mb-4">偏好设置测试</h2>
            <div className="space-y-4">
              {Object.entries(testPreferences).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key === 'wifi' ? 'WiFi质量' : 
                     key === 'cost' ? '生活成本' : 
                     key === 'climate' ? '气候舒适度' : 
                     key === 'social' ? '社交氛围' : '签证便利性'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setTestPreferences(prev => ({
                      ...prev,
                      [key]: parseInt(e.target.value)
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm text-gray-500">{value}%</span>
                </div>
              ))}
              <button
                onClick={handleTestPreferences}
                className="btn btn-md btn-primary w-full"
                disabled={loading.data}
              >
                {loading.data ? <LoadingSpinner size="sm" /> : '保存偏好设置'}
              </button>
            </div>
          </div>

          {/* 通知测试 */}
          <div className="card card-lg">
            <h2 className="text-xl font-semibold mb-4">通知测试</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleTestNotification('success')}
                className="btn btn-sm btn-primary w-full"
              >
                成功通知
              </button>
              <button
                onClick={() => handleTestNotification('error')}
                className="btn btn-sm btn-secondary w-full"
              >
                错误通知
              </button>
              <button
                onClick={() => handleTestNotification('warning')}
                className="btn btn-sm btn-secondary w-full"
              >
                警告通知
              </button>
              <button
                onClick={() => handleTestNotification('info')}
                className="btn btn-sm btn-secondary w-full"
              >
                信息通知
              </button>
            </div>
          </div>

          {/* 加载状态测试 */}
          <div className="card card-lg">
            <h2 className="text-xl font-semibold mb-4">加载状态测试</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleTestLoading('global')}
                className="btn btn-sm btn-primary w-full"
                disabled={loading.global}
              >
                全局加载 (2秒)
              </button>
              <button
                onClick={() => handleTestLoading('auth')}
                className="btn btn-sm btn-secondary w-full"
                disabled={loading.auth}
              >
                认证加载 (2秒)
              </button>
              <button
                onClick={() => handleTestLoading('data')}
                className="btn btn-sm btn-secondary w-full"
                disabled={loading.data}
              >
                数据加载 (2秒)
              </button>
              <button
                onClick={() => handleTestLoading('ui')}
                className="btn btn-sm btn-secondary w-full"
                disabled={loading.ui}
              >
                UI加载 (2秒)
              </button>
            </div>
          </div>

          {/* 数据同步测试 */}
          <div className="card card-lg">
            <h2 className="text-xl font-semibold mb-4">数据同步测试</h2>
            <div className="space-y-3">
              <button
                onClick={async () => {
                  try {
                    setLoading('data', true)
                    const success = await userDataService.syncUserData()
                    if (success) {
                      addNotification({
                        type: 'success',
                        message: '数据同步成功',
                        duration: 3000
                      })
                    } else {
                      throw new Error('Sync failed')
                    }
                  } catch (error) {
                    addNotification({
                      type: 'error',
                      message: '数据同步失败',
                      duration: 5000
                    })
                  } finally {
                    setLoading('data', false)
                  }
                }}
                className="btn btn-sm btn-primary w-full"
                disabled={loading.data}
              >
                {loading.data ? <LoadingSpinner size="sm" /> : '同步所有数据'}
              </button>
              <button
                onClick={() => {
                  userDataService.clearUserData()
                  addNotification({
                    type: 'warning',
                    message: '本地数据已清除',
                    duration: 3000
                  })
                }}
                className="btn btn-sm btn-secondary w-full"
              >
                清除本地数据
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
