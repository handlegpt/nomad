'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

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
        error: { message: null, type: null }
      }
    
    case 'LOGOUT':
      return {
        ...initialState,
        loading: { ...initialState.loading }
      }
    
    default:
      return state
  }
}

// Context创建
const GlobalStateContext = createContext<{
  state: GlobalState
  dispatch: React.Dispatch<GlobalAction>
} | null>(null)

// Provider组件
export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(globalReducer, initialState)

  // 初始化时从本地存储加载用户数据
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: true } })
        
        // 从localStorage加载用户偏好
        const savedPreferences = localStorage.getItem('user_preferences')
        if (savedPreferences) {
          const preferences = JSON.parse(savedPreferences)
          dispatch({ type: 'SET_USER_PREFERENCES', payload: preferences })
        }

        // 从localStorage加载收藏
        const savedFavorites = localStorage.getItem('user_favorites')
        if (savedFavorites) {
          const favorites = JSON.parse(savedFavorites)
          dispatch({ type: 'SET_USER_FAVORITES', payload: favorites })
        }

        // 从localStorage加载签证信息
        const savedVisas = localStorage.getItem('user_visas')
        if (savedVisas) {
          const visas = JSON.parse(savedVisas)
          dispatch({ type: 'SET_USER_VISAS', payload: visas })
        }
      } catch (error) {
        console.error('Error loading user data from localStorage:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } })
      }
    }

    initializeUserData()
  }, [])

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

// Hook for using global state
export function useGlobalState() {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}

// 便捷的hooks
export function useLoading() {
  const { state, dispatch } = useGlobalState()
  
  const setLoading = (key: keyof GlobalState['loading'], value: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { key, value } })
  }
  
  return {
    loading: state.loading,
    setLoading,
    isLoading: Object.values(state.loading).some(Boolean)
  }
}

export function useUser() {
  const { state, dispatch } = useGlobalState()
  
  const setUserProfile = (profile: any) => {
    dispatch({ type: 'SET_USER_PROFILE', payload: profile })
  }
  
  const setUserPreferences = (preferences: UserPreferences) => {
    dispatch({ type: 'SET_USER_PREFERENCES', payload: preferences })
    // 保存到本地存储
    localStorage.setItem('user_preferences', JSON.stringify(preferences))
  }
  
  const setUserFavorites = (favorites: any[]) => {
    dispatch({ type: 'SET_USER_FAVORITES', payload: favorites })
    // 保存到本地存储
    localStorage.setItem('user_favorites', JSON.stringify(favorites))
  }
  
  const setUserVisas = (visas: any[]) => {
    dispatch({ type: 'SET_USER_VISAS', payload: visas })
    // 保存到本地存储
    localStorage.setItem('user_visas', JSON.stringify(visas))
  }
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    // 清除本地存储
    localStorage.removeItem('user_preferences')
    localStorage.removeItem('user_favorites')
    localStorage.removeItem('user_visas')
    localStorage.removeItem('session_token')
  }
  
  return {
    user: state.user,
    setUserProfile,
    setUserPreferences,
    setUserFavorites,
    setUserVisas,
    logout
  }
}

export function useError() {
  const { state, dispatch } = useGlobalState()
  
  const setError = (message: string, type: 'auth' | 'data' | 'ui') => {
    dispatch({ type: 'SET_ERROR', payload: { message, type } })
  }
  
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }
  
  return {
    error: state.error,
    setError,
    clearError
  }
}

export function useNotifications() {
  const { state, dispatch } = useGlobalState()
  
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
  
  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }
  
  return {
    notifications: state.notifications,
    addNotification,
    removeNotification
  }
}
