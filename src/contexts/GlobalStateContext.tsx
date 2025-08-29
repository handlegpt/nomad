'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { getSessionToken, setSessionToken, clearSession, getCurrentUser } from '@/lib/auth'
import { logInfo, logError } from '@/lib/logger'

// 全局状态类型定义
interface GlobalState {
  loading: {
    global: boolean
    auth: boolean
    data: boolean
    ui: boolean
  }
  user: {
    isAuthenticated: boolean
    profile: any | null
    preferences: UserPreferences | null
    favorites: any[]
    visas: any[]
  }
  error: {
    message: string | null
    type: 'auth' | 'data' | 'ui' | null
  }
  notifications: Notification[]
}

interface UserPreferences {
  wifi: number
  cost: number
  climate: number
  social: number
  visa: number
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

// Action类型定义
type GlobalAction =
  | { type: 'SET_LOADING'; payload: { key: keyof GlobalState['loading']; value: boolean } }
  | { type: 'SET_USER_PROFILE'; payload: any }
  | { type: 'SET_USER_PREFERENCES'; payload: UserPreferences }
  | { type: 'SET_USER_FAVORITES'; payload: any[] }
  | { type: 'SET_USER_VISAS'; payload: any[] }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { message: string; type: 'auth' | 'data' | 'ui' } | null }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' }

// 初始状态
const initialState: GlobalState = {
  loading: {
    global: false,
    auth: false,
    data: false,
    ui: false
  },
  user: {
    isAuthenticated: false,
    profile: null,
    preferences: null,
    favorites: [],
    visas: []
  },
  error: {
    message: null,
    type: null
  },
  notifications: []
}

// Reducer函数
function globalReducer(state: GlobalState, action: GlobalAction): GlobalState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      }
    
    case 'SET_USER_PROFILE':
      return {
        ...state,
        user: {
          ...state.user,
          profile: action.payload,
          isAuthenticated: !!action.payload
        }
      }
    
    case 'SET_USER_PREFERENCES':
      return {
        ...state,
        user: {
          ...state.user,
          preferences: action.payload
        }
      }
    
    case 'SET_USER_FAVORITES':
      return {
        ...state,
        user: {
          ...state.user,
          favorites: action.payload
        }
      }
    
    case 'SET_USER_VISAS':
      return {
        ...state,
        user: {
          ...state.user,
          visas: action.payload
        }
      }
    
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: action.payload
        }
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload || { message: null, type: null }
      }
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      }
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: {
          message: null,
          type: null
        }
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: {
          isAuthenticated: false,
          profile: null,
          preferences: null,
          favorites: [],
          visas: []
        },
        error: {
          message: null,
          type: null
        },
        notifications: []
      }
    
    default:
      return state
  }
}

// 创建Context
const GlobalStateContext = createContext<{
  state: GlobalState
  dispatch: React.Dispatch<GlobalAction>
  setUserProfile: (profile: any) => void
  setUserPreferences: (preferences: UserPreferences) => void
  setUserFavorites: (favorites: any[]) => void
  setUserVisas: (visas: any[]) => void
  logout: () => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearError: () => void
} | undefined>(undefined)

// Provider组件
export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(globalReducer, initialState)

  // 初始化时检查认证状态
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: true } })
        
        // 检查JWT令牌
        const sessionToken = getSessionToken()
        if (sessionToken) {
          // 获取用户信息
          const user = await getCurrentUser()
          if (user) {
            dispatch({ type: 'SET_USER_PROFILE', payload: user })
            logInfo('User authenticated on app start', { userId: user.id }, 'GlobalState')
          } else {
            // 令牌无效，清除会话
            clearSession()
            logInfo('Invalid session token, cleared session', null, 'GlobalState')
          }
        }
      } catch (error) {
        logError('Failed to initialize authentication', error, 'GlobalState')
        clearSession()
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } })
      }
    }

    initializeAuth()
  }, [])

  // 设置用户资料
  const setUserProfile = (profile: any) => {
    if (profile) {
      // 设置JWT令牌
      setSessionToken(profile)
      dispatch({ type: 'SET_USER_PROFILE', payload: profile })
      logInfo('User profile set', { userId: profile.id }, 'GlobalState')
    }
  }

  // 设置用户偏好
  const setUserPreferences = (preferences: UserPreferences) => {
    dispatch({ type: 'SET_USER_PREFERENCES', payload: preferences })
  }

  // 设置用户收藏
  const setUserFavorites = (favorites: any[]) => {
    dispatch({ type: 'SET_USER_FAVORITES', payload: favorites })
  }

  // 设置用户签证
  const setUserVisas = (visas: any[]) => {
    dispatch({ type: 'SET_USER_VISAS', payload: visas })
  }

  // 登出
  const logout = () => {
    clearSession()
    dispatch({ type: 'LOGOUT' })
    logInfo('User logged out', null, 'GlobalState')
  }

  // 添加通知
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification = { ...notification, id }
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification })
    
    // 自动移除通知
    if (notification.duration !== 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
      }, notification.duration || 5000)
    }
  }

  // 移除通知
  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }

  // 清除错误
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    state,
    dispatch,
    setUserProfile,
    setUserPreferences,
    setUserFavorites,
    setUserVisas,
    logout,
    addNotification,
    removeNotification,
    clearError
  }

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  )
}

// 自定义Hook
export function useGlobalState() {
  const context = useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}

// 便捷Hook
export function useUser() {
  const { state, setUserProfile, setUserPreferences, setUserFavorites, setUserVisas, logout } = useGlobalState()
  return {
    user: state.user,
    setUserProfile,
    setUserPreferences,
    setUserFavorites,
    setUserVisas,
    logout
  }
}

export function useLoading() {
  const { state, dispatch } = useGlobalState()
  return {
    loading: state.loading,
    setLoading: (key: keyof GlobalState['loading'], value: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: { key, value } })
    }
  }
}

export function useNotifications() {
  const { state, addNotification, removeNotification } = useGlobalState()
  return {
    notifications: state.notifications,
    addNotification,
    removeNotification
  }
}

export function useError() {
  const { state, dispatch } = useGlobalState()
  return {
    error: state.error,
    setError: (message: string, type: 'auth' | 'data' | 'ui') => {
      dispatch({ type: 'SET_ERROR', payload: { message, type } })
    },
    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' })
    }
  }
}
