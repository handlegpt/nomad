import { logInfo, logError } from '@/lib/logger'

// 本地存储键名常量
const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  USER_FAVORITES: 'user_favorites',
  USER_VISAS: 'user_visas',
  SEARCH_HISTORY: 'search_history',
  RECENT_CITIES: 'recent_cities',
  RECENT_PLACES: 'recent_places',
  THEME_SETTINGS: 'theme_settings',
  LANGUAGE_SETTINGS: 'language_settings',
  NOTIFICATION_SETTINGS: 'notification_settings'
} as const

// 数据版本控制
const DATA_VERSION = '1.0.0'

interface StoredData<T> {
  data: T
  version: string
  timestamp: number
  expiresAt?: number
}

// 基础存储类
class DataStorage {
  private prefix = 'nomad_now_'

  // 设置数据
  set<T>(key: string, data: T, ttl?: number): void {
    try {
      const storedData: StoredData<T> = {
        data,
        version: DATA_VERSION,
        timestamp: Date.now(),
        expiresAt: ttl ? Date.now() + ttl : undefined
      }
      
      localStorage.setItem(this.prefix + key, JSON.stringify(storedData))
      logInfo(`Data stored successfully`, { key, dataSize: JSON.stringify(data).length }, 'DataStorage')
    } catch (error) {
      logError(`Failed to store data`, error, 'DataStorage')
    }
  }

  // 获取数据
  get<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(this.prefix + key)
      if (!stored) return null

      const storedData: StoredData<T> = JSON.parse(stored)
      
      // 检查版本兼容性
      if (storedData.version !== DATA_VERSION) {
        logInfo(`Data version mismatch, clearing old data`, { key, version: storedData.version }, 'DataStorage')
        this.remove(key)
        return null
      }

      // 检查过期时间
      if (storedData.expiresAt && Date.now() > storedData.expiresAt) {
        logInfo(`Data expired, removing`, { key, expiresAt: storedData.expiresAt }, 'DataStorage')
        this.remove(key)
        return null
      }

      return storedData.data
    } catch (error) {
      logError(`Failed to retrieve data`, error, 'DataStorage')
      return null
    }
  }

  // 删除数据
  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key)
      logInfo(`Data removed successfully`, { key }, 'DataStorage')
    } catch (error) {
      logError(`Failed to remove data`, error, 'DataStorage')
    }
  }

  // 清空所有数据
  clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
      logInfo(`All data cleared successfully`, null, 'DataStorage')
    } catch (error) {
      logError(`Failed to clear data`, error, 'DataStorage')
    }
  }

  // 获取存储统计信息
  getStats(): { totalKeys: number; totalSize: number } {
    try {
      const keys = Object.keys(localStorage)
      const nomadKeys = keys.filter(key => key.startsWith(this.prefix))
      const totalSize = nomadKeys.reduce((size, key) => {
        return size + (localStorage.getItem(key)?.length || 0)
      }, 0)

      return {
        totalKeys: nomadKeys.length,
        totalSize
      }
    } catch (error) {
      logError(`Failed to get storage stats`, error, 'DataStorage')
      return { totalKeys: 0, totalSize: 0 }
    }
  }
}

// 创建存储实例
const storage = new DataStorage()

// 用户偏好设置管理
export class UserPreferencesManager {
  private static instance: UserPreferencesManager
  private storage = storage

  static getInstance(): UserPreferencesManager {
    if (!UserPreferencesManager.instance) {
      UserPreferencesManager.instance = new UserPreferencesManager()
    }
    return UserPreferencesManager.instance
  }

  // 保存用户偏好
  savePreferences(preferences: any): void {
    this.storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences)
  }

  // 获取用户偏好
  getPreferences(): any {
    return this.storage.get(STORAGE_KEYS.USER_PREFERENCES) || {}
  }

  // 更新特定偏好
  updatePreference(key: string, value: any): void {
    const preferences = this.getPreferences()
    preferences[key] = value
    this.savePreferences(preferences)
  }

  // 重置偏好设置
  resetPreferences(): void {
    this.storage.remove(STORAGE_KEYS.USER_PREFERENCES)
  }
}

// 收藏管理
export class FavoritesManager {
  private static instance: FavoritesManager
  private storage = storage

  static getInstance(): FavoritesManager {
    if (!FavoritesManager.instance) {
      FavoritesManager.instance = new FavoritesManager()
    }
    return FavoritesManager.instance
  }

  // 添加收藏
  addFavorite(type: 'city' | 'place', item: any): void {
    const favorites = this.getFavorites(type)
    const exists = favorites.find(fav => fav.id === item.id)
    
    if (!exists) {
      favorites.push({
        ...item,
        addedAt: new Date().toISOString()
      })
      this.storage.set(STORAGE_KEYS.USER_FAVORITES, favorites)
    }
  }

  // 移除收藏
  removeFavorite(type: 'city' | 'place', itemId: string): void {
    const favorites = this.getFavorites(type)
    const allFavorites = this.storage.get(STORAGE_KEYS.USER_FAVORITES) || []
    if (Array.isArray(allFavorites)) {
      const filtered = allFavorites.filter(fav => !(fav.type === type && fav.id === itemId))
      this.storage.set(STORAGE_KEYS.USER_FAVORITES, filtered)
    }
  }

  // 获取收藏列表
  getFavorites(type: 'city' | 'place'): any[] {
    const allFavorites = this.storage.get(STORAGE_KEYS.USER_FAVORITES) || []
    return Array.isArray(allFavorites) ? allFavorites.filter(fav => fav.type === type) : []
  }

  // 检查是否已收藏
  isFavorite(type: 'city' | 'place', itemId: string): boolean {
    const favorites = this.getFavorites(type)
    return favorites.some(fav => fav.id === itemId)
  }

  // 清空收藏
  clearFavorites(type?: 'city' | 'place'): void {
    if (type) {
      const allFavorites = this.storage.get(STORAGE_KEYS.USER_FAVORITES) || []
      if (Array.isArray(allFavorites)) {
        const filtered = allFavorites.filter(fav => fav.type !== type)
        this.storage.set(STORAGE_KEYS.USER_FAVORITES, filtered)
      }
    } else {
      this.storage.remove(STORAGE_KEYS.USER_FAVORITES)
    }
  }
}

// 签证管理
export class VisaManager {
  private static instance: VisaManager
  private storage = storage

  static getInstance(): VisaManager {
    if (!VisaManager.instance) {
      VisaManager.instance = new VisaManager()
    }
    return VisaManager.instance
  }

  // 保存签证信息
  saveVisas(visas: any[]): void {
    this.storage.set(STORAGE_KEYS.USER_VISAS, visas)
  }

  // 获取签证信息
  getVisas(): any[] {
    return this.storage.get(STORAGE_KEYS.USER_VISAS) || []
  }

  // 添加签证
  addVisa(visa: any): void {
    const visas = this.getVisas()
    visas.push({
      ...visa,
      addedAt: new Date().toISOString()
    })
    this.saveVisas(visas)
  }

  // 更新签证
  updateVisa(visaId: string, updates: any): void {
    const visas = this.getVisas()
    const index = visas.findIndex(visa => visa.id === visaId)
    if (index !== -1) {
      visas[index] = { ...visas[index], ...updates, updatedAt: new Date().toISOString() }
      this.saveVisas(visas)
    }
  }

  // 删除签证
  removeVisa(visaId: string): void {
    const visas = this.getVisas()
    if (Array.isArray(visas)) {
      const filtered = visas.filter(visa => visa.id !== visaId)
      this.saveVisas(filtered)
    }
  }
}

// 搜索历史管理
export class SearchHistoryManager {
  private static instance: SearchHistoryManager
  private storage = storage
  private maxHistorySize = 50

  static getInstance(): SearchHistoryManager {
    if (!SearchHistoryManager.instance) {
      SearchHistoryManager.instance = new SearchHistoryManager()
    }
    return SearchHistoryManager.instance
  }

  // 添加搜索历史
  addSearchHistory(query: string, type: 'city' | 'place'): void {
    const history = this.getSearchHistory()
    const newEntry = {
      query,
      type,
      timestamp: Date.now()
    }

    // 移除重复项
    const filtered = Array.isArray(history) ? history.filter(item => 
      !(item.query === query && item.type === type)
    ) : []

    // 添加到开头
    filtered.unshift(newEntry)

    // 限制历史记录大小
    if (filtered.length > this.maxHistorySize) {
      filtered.splice(this.maxHistorySize)
    }

    this.storage.set(STORAGE_KEYS.SEARCH_HISTORY, filtered)
  }

  // 获取搜索历史
  getSearchHistory(type?: 'city' | 'place'): any[] {
    const history = this.storage.get(STORAGE_KEYS.SEARCH_HISTORY) || []
    if (!Array.isArray(history)) return []
    return type ? history.filter(item => item.type === type) : history
  }

  // 清空搜索历史
  clearSearchHistory(type?: 'city' | 'place'): void {
    if (type) {
      const history = this.getSearchHistory()
      if (Array.isArray(history)) {
        const filtered = history.filter(item => item.type !== type)
        this.storage.set(STORAGE_KEYS.SEARCH_HISTORY, filtered)
      }
    } else {
      this.storage.remove(STORAGE_KEYS.SEARCH_HISTORY)
    }
  }
}

// 最近访问管理
export class RecentItemsManager {
  private static instance: RecentItemsManager
  private storage = storage
  private maxRecentSize = 20

  static getInstance(): RecentItemsManager {
    if (!RecentItemsManager.instance) {
      RecentItemsManager.instance = new RecentItemsManager()
    }
    return RecentItemsManager.instance
  }

  // 添加最近访问的城市
  addRecentCity(city: any): void {
    const recent = this.getRecentCities()
    const newEntry = {
      ...city,
      visitedAt: Date.now()
    }

    // 移除重复项
    const filtered = Array.isArray(recent) ? recent.filter(item => item.id !== city.id) : []
    filtered.unshift(newEntry)

    // 限制大小
    if (filtered.length > this.maxRecentSize) {
      filtered.splice(this.maxRecentSize)
    }

    this.storage.set(STORAGE_KEYS.RECENT_CITIES, filtered)
  }

  // 添加最近访问的地点
  addRecentPlace(place: any): void {
    const recent = this.getRecentPlaces()
    const newEntry = {
      ...place,
      visitedAt: Date.now()
    }

    // 移除重复项
    const filtered = Array.isArray(recent) ? recent.filter(item => item.id !== place.id) : []
    filtered.unshift(newEntry)

    // 限制大小
    if (filtered.length > this.maxRecentSize) {
      filtered.splice(this.maxRecentSize)
    }

    this.storage.set(STORAGE_KEYS.RECENT_PLACES, filtered)
  }

  // 获取最近访问的城市
  getRecentCities(): any[] {
    return this.storage.get(STORAGE_KEYS.RECENT_CITIES) || []
  }

  // 获取最近访问的地点
  getRecentPlaces(): any[] {
    return this.storage.get(STORAGE_KEYS.RECENT_PLACES) || []
  }

  // 清空最近访问记录
  clearRecentItems(type?: 'city' | 'place'): void {
    if (type === 'city') {
      this.storage.remove(STORAGE_KEYS.RECENT_CITIES)
    } else if (type === 'place') {
      this.storage.remove(STORAGE_KEYS.RECENT_PLACES)
    } else {
      this.storage.remove(STORAGE_KEYS.RECENT_CITIES)
      this.storage.remove(STORAGE_KEYS.RECENT_PLACES)
    }
  }
}

// 设置管理
export class SettingsManager {
  private static instance: SettingsManager
  private storage = storage

  static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager()
    }
    return SettingsManager.instance
  }

  // 保存主题设置
  saveThemeSettings(settings: any): void {
    this.storage.set(STORAGE_KEYS.THEME_SETTINGS, settings)
  }

  // 获取主题设置
  getThemeSettings(): any {
    return this.storage.get(STORAGE_KEYS.THEME_SETTINGS) || { theme: 'light' }
  }

  // 保存语言设置
  saveLanguageSettings(settings: any): void {
    this.storage.set(STORAGE_KEYS.LANGUAGE_SETTINGS, settings)
  }

  // 获取语言设置
  getLanguageSettings(): any {
    return this.storage.get(STORAGE_KEYS.LANGUAGE_SETTINGS) || { language: 'en' }
  }

  // 保存通知设置
  saveNotificationSettings(settings: any): void {
    this.storage.set(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings)
  }

  // 获取通知设置
  getNotificationSettings(): any {
    return this.storage.get(STORAGE_KEYS.NOTIFICATION_SETTINGS) || {
      email: true,
      push: true,
      visaReminders: true,
      cityRecommendations: true
    }
  }
}

// 导出单例实例
export const userPreferences = UserPreferencesManager.getInstance()
export const favorites = FavoritesManager.getInstance()
export const visas = VisaManager.getInstance()
export const searchHistory = SearchHistoryManager.getInstance()
export const recentItems = RecentItemsManager.getInstance()
export const settings = SettingsManager.getInstance()

// 数据同步服务（与云端同步）
export class DataSyncService {
  private static instance: DataSyncService

  static getInstance(): DataSyncService {
    if (!DataSyncService.instance) {
      DataSyncService.instance = new DataSyncService()
    }
    return DataSyncService.instance
  }

  // 同步用户数据到云端
  async syncToCloud(userId: string): Promise<boolean> {
    try {
      const data = {
        preferences: userPreferences.getPreferences(),
        favorites: {
          cities: favorites.getFavorites('city'),
          places: favorites.getFavorites('place')
        },
        visas: visas.getVisas(),
        settings: {
          theme: settings.getThemeSettings(),
          language: settings.getLanguageSettings(),
          notifications: settings.getNotificationSettings()
        }
      }

      // TODO: 实现云端同步逻辑
      logInfo(`Data synced to cloud for user ${userId}`, data, 'DataSyncService')
      return true
    } catch (error) {
      logError(`Failed to sync data to cloud`, error, 'DataSyncService')
      return false
    }
  }

  // 从云端同步数据
  async syncFromCloud(userId: string): Promise<boolean> {
    try {
      // TODO: 实现从云端获取数据的逻辑
      logInfo(`Data synced from cloud for user ${userId}`, null, 'DataSyncService')
      return true
    } catch (error) {
      logError(`Failed to sync data from cloud`, error, 'DataSyncService')
      return false
    }
  }
}

export const dataSync = DataSyncService.getInstance()
