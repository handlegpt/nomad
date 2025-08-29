import { logInfo, logError, logWarn } from '@/lib/logger'
import { useState, useEffect, useCallback } from 'react'

// 事件类型定义
export type RealtimeEventType = 
  | 'user_online'
  | 'user_offline'
  | 'new_message'
  | 'meetup_invitation'
  | 'visa_reminder'
  | 'city_update'
  | 'place_update'
  | 'vote_update'
  | 'notification'

export interface RealtimeEvent {
  type: RealtimeEventType
  data: any
  timestamp: number
  userId?: string
}

export interface RealtimeConfig {
  url?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
}

// 事件监听器类型
type EventListener = (event: RealtimeEvent) => void

// 实时服务类
export class RealtimeService {
  private static instance: RealtimeService
  private ws: WebSocket | null = null
  private eventSource: EventSource | null = null
  private listeners: Map<RealtimeEventType, EventListener[]> = new Map()
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private isConnected = false
  private config: RealtimeConfig

  constructor(config: RealtimeConfig = {}) {
    this.config = {
      url: process.env.NEXT_PUBLIC_REALTIME_URL || 'wss://nomadnow.app/realtime',
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config
    }
  }

  static getInstance(config?: RealtimeConfig): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService(config)
    }
    return RealtimeService.instance
  }

  // 连接WebSocket
  connect(userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.isConnected) {
          resolve()
          return
        }

        logInfo('Connecting to realtime service...', { url: this.config.url }, 'RealtimeService')

        this.ws = new WebSocket(this.config.url!)

        this.ws.onopen = () => {
          this.isConnected = true
          this.reconnectAttempts = 0
          logInfo('Realtime connection established', null, 'RealtimeService')
          
          // 发送认证信息
          if (userId) {
            this.send({ type: 'auth', userId })
          }
          
          // 启动心跳
          this.startHeartbeat()
          
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const realtimeEvent: RealtimeEvent = JSON.parse(event.data)
            this.handleEvent(realtimeEvent)
          } catch (error) {
            logError('Failed to parse realtime message', error, 'RealtimeService')
          }
        }

        this.ws.onclose = (event) => {
          this.isConnected = false
          this.stopHeartbeat()
          logWarn('Realtime connection closed', { code: event.code, reason: event.reason }, 'RealtimeService')
          
          if (!event.wasClean && this.reconnectAttempts < this.config.maxReconnectAttempts!) {
            this.scheduleReconnect()
          }
        }

        this.ws.onerror = (error) => {
          logError('Realtime connection error', error, 'RealtimeService')
          reject(error)
        }

      } catch (error) {
        logError('Failed to create WebSocket connection', error, 'RealtimeService')
        reject(error)
      }
    })
  }

  // 连接SSE (Server-Sent Events)
  connectSSE(userId?: string): void {
    try {
      if (this.eventSource) {
        this.eventSource.close()
      }

      const url = this.config.url?.replace('wss://', 'https://').replace('ws://', 'http://') + '/sse'
      this.eventSource = new EventSource(url)

      this.eventSource.onopen = () => {
        this.isConnected = true
        logInfo('SSE connection established', { url }, 'RealtimeService')
      }

      this.eventSource.onmessage = (event) => {
        try {
          const realtimeEvent: RealtimeEvent = JSON.parse(event.data)
          this.handleEvent(realtimeEvent)
        } catch (error) {
          logError('Failed to parse SSE message', error, 'RealtimeService')
        }
      }

      this.eventSource.onerror = (error) => {
        logError('SSE connection error', error, 'RealtimeService')
        this.isConnected = false
      }

    } catch (error) {
      logError('Failed to create SSE connection', error, 'RealtimeService')
    }
  }

  // 断开连接
  disconnect(): void {
    this.isConnected = false
    this.stopHeartbeat()
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }

    logInfo('Realtime connection disconnected', null, 'RealtimeService')
  }

  // 发送消息
  send(message: any): void {
    if (this.ws && this.isConnected) {
      try {
        this.ws.send(JSON.stringify(message))
      } catch (error) {
        logError('Failed to send message', error, 'RealtimeService')
      }
    }
  }

  // 订阅事件
  subscribe(eventType: RealtimeEventType, listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    
    this.listeners.get(eventType)!.push(listener)
    
    logInfo(`Subscribed to event: ${eventType}`, null, 'RealtimeService')
    
    // 返回取消订阅函数
    return () => {
      const listeners = this.listeners.get(eventType)
      if (listeners) {
        const index = listeners.indexOf(listener)
        if (index > -1) {
          listeners.splice(index, 1)
          logInfo(`Unsubscribed from event: ${eventType}`, null, 'RealtimeService')
        }
      }
    }
  }

  // 处理事件
  private handleEvent(event: RealtimeEvent): void {
    const listeners = this.listeners.get(event.type)
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event)
        } catch (error) {
          logError(`Error in event listener for ${event.type}`, error, 'RealtimeService')
        }
      })
    }
  }

  // 安排重连
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    this.reconnectAttempts++
    const delay = this.config.reconnectInterval! * Math.pow(2, this.reconnectAttempts - 1)
    
    logInfo(`Scheduling reconnect attempt ${this.reconnectAttempts}`, { delay }, 'RealtimeService')
    
    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }

  // 启动心跳
  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected && this.ws) {
        this.send({ type: 'ping', timestamp: Date.now() })
      }
    }, this.config.heartbeatInterval)
  }

  // 停止心跳
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  // 获取连接状态
  getConnectionStatus(): { isConnected: boolean; reconnectAttempts: number } {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    }
  }
}

// 实时数据管理器
export class RealtimeDataManager {
  private static instance: RealtimeDataManager
  private realtimeService: RealtimeService
  private dataCache: Map<string, any> = new Map()
  private updateCallbacks: Map<string, (data: any) => void> = new Map()

  constructor() {
    this.realtimeService = RealtimeService.getInstance()
    this.setupEventHandlers()
  }

  static getInstance(): RealtimeDataManager {
    if (!RealtimeDataManager.instance) {
      RealtimeDataManager.instance = new RealtimeDataManager()
    }
    return RealtimeDataManager.instance
  }

  // 设置事件处理器
  private setupEventHandlers(): void {
    // 用户在线状态更新
    this.realtimeService.subscribe('user_online', (event) => {
      this.updateUserStatus(event.data.userId, 'online')
    })

    this.realtimeService.subscribe('user_offline', (event) => {
      this.updateUserStatus(event.data.userId, 'offline')
    })

    // 新消息
    this.realtimeService.subscribe('new_message', (event) => {
      this.handleNewMessage(event.data)
    })

    // 见面邀请
    this.realtimeService.subscribe('meetup_invitation', (event) => {
      this.handleMeetupInvitation(event.data)
    })

    // 签证提醒
    this.realtimeService.subscribe('visa_reminder', (event) => {
      this.handleVisaReminder(event.data)
    })

    // 城市更新
    this.realtimeService.subscribe('city_update', (event) => {
      this.handleCityUpdate(event.data)
    })

    // 地点更新
    this.realtimeService.subscribe('place_update', (event) => {
      this.handlePlaceUpdate(event.data)
    })

    // 投票更新
    this.realtimeService.subscribe('vote_update', (event) => {
      this.handleVoteUpdate(event.data)
    })

    // 通知
    this.realtimeService.subscribe('notification', (event) => {
      this.handleNotification(event.data)
    })
  }

  // 连接实时服务
  async connect(userId?: string): Promise<void> {
    try {
      await this.realtimeService.connect(userId)
      logInfo('Realtime data manager connected', { userId }, 'RealtimeDataManager')
    } catch (error) {
      logError('Failed to connect realtime data manager', error, 'RealtimeDataManager')
      throw error
    }
  }

  // 断开连接
  disconnect(): void {
    this.realtimeService.disconnect()
    logInfo('Realtime data manager disconnected', null, 'RealtimeDataManager')
  }

  // 订阅数据更新
  subscribeToData(key: string, callback: (data: any) => void): () => void {
    this.updateCallbacks.set(key, callback)
    
    // 立即返回缓存的数据
    const cachedData = this.dataCache.get(key)
    if (cachedData) {
      callback(cachedData)
    }
    
    return () => {
      this.updateCallbacks.delete(key)
    }
  }

  // 更新用户状态
  private updateUserStatus(userId: string, status: 'online' | 'offline'): void {
    const key = `user_status_${userId}`
    const data = { userId, status, timestamp: Date.now() }
    
    this.dataCache.set(key, data)
    this.notifyUpdate(key, data)
  }

  // 处理新消息
  private handleNewMessage(messageData: any): void {
    const key = `messages_${messageData.chatId || 'global'}`
    const messages = this.dataCache.get(key) || []
    messages.push(messageData)
    
    this.dataCache.set(key, messages)
    this.notifyUpdate(key, messages)
  }

  // 处理见面邀请
  private handleMeetupInvitation(invitationData: any): void {
    const key = `meetup_invitations_${invitationData.userId}`
    const invitations = this.dataCache.get(key) || []
    invitations.push(invitationData)
    
    this.dataCache.set(key, invitations)
    this.notifyUpdate(key, invitations)
  }

  // 处理签证提醒
  private handleVisaReminder(reminderData: any): void {
    const key = `visa_reminders_${reminderData.userId}`
    const reminders = this.dataCache.get(key) || []
    reminders.push(reminderData)
    
    this.dataCache.set(key, reminders)
    this.notifyUpdate(key, reminders)
  }

  // 处理城市更新
  private handleCityUpdate(cityData: any): void {
    const key = `city_${cityData.id}`
    this.dataCache.set(key, cityData)
    this.notifyUpdate(key, cityData)
    
    // 同时更新城市列表
    const listKey = 'cities_list'
    const cities = this.dataCache.get(listKey) || []
    const index = cities.findIndex((city: any) => city.id === cityData.id)
    
    if (index > -1) {
      cities[index] = cityData
    } else {
      cities.push(cityData)
    }
    
    this.dataCache.set(listKey, cities)
    this.notifyUpdate(listKey, cities)
  }

  // 处理地点更新
  private handlePlaceUpdate(placeData: any): void {
    const key = `place_${placeData.id}`
    this.dataCache.set(key, placeData)
    this.notifyUpdate(key, placeData)
    
    // 同时更新地点列表
    const listKey = 'places_list'
    const places = this.dataCache.get(listKey) || []
    const index = places.findIndex((place: any) => place.id === placeData.id)
    
    if (index > -1) {
      places[index] = placeData
    } else {
      places.push(placeData)
    }
    
    this.dataCache.set(listKey, places)
    this.notifyUpdate(listKey, places)
  }

  // 处理投票更新
  private handleVoteUpdate(voteData: any): void {
    const key = `votes_${voteData.itemType}_${voteData.itemId}`
    const votes = this.dataCache.get(key) || { upvotes: 0, downvotes: 0, rating: 0 }
    
    votes.upvotes = voteData.upvotes
    votes.downvotes = voteData.downvotes
    votes.rating = voteData.rating
    
    this.dataCache.set(key, votes)
    this.notifyUpdate(key, votes)
  }

  // 处理通知
  private handleNotification(notificationData: any): void {
    const key = `notifications_${notificationData.userId}`
    const notifications = this.dataCache.get(key) || []
    notifications.unshift(notificationData)
    
    // 限制通知数量
    if (notifications.length > 50) {
      notifications.splice(50)
    }
    
    this.dataCache.set(key, notifications)
    this.notifyUpdate(key, notifications)
  }

  // 通知更新
  private notifyUpdate(key: string, data: any): void {
    const callback = this.updateCallbacks.get(key)
    if (callback) {
      try {
        callback(data)
      } catch (error) {
        logError(`Error in update callback for ${key}`, error, 'RealtimeDataManager')
      }
    }
  }

  // 获取缓存数据
  getCachedData(key: string): any {
    return this.dataCache.get(key)
  }

  // 清除缓存
  clearCache(key?: string): void {
    if (key) {
      this.dataCache.delete(key)
    } else {
      this.dataCache.clear()
    }
  }
}

// 导出单例实例
export const realtimeService = RealtimeService.getInstance()
export const realtimeData = RealtimeDataManager.getInstance()

// 实时Hook
export function useRealtimeData<T>(key: string, initialValue?: T): [T | undefined, (data: T) => void] {
  const [data, setData] = useState<T | undefined>(initialValue)

  useEffect(() => {
    const unsubscribe = realtimeData.subscribeToData(key, setData)
    return unsubscribe
  }, [key])

  const updateData = useCallback((newData: T) => {
    realtimeData.getCachedData(key) // 触发缓存更新
    setData(newData)
  }, [key])

  return [data, updateData]
}
