interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

interface CacheOptions {
  ttl?: number // 缓存时间（毫秒）
  maxSize?: number // 最大缓存条目数
}

class APICache {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5分钟
  private maxSize = 100

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || this.defaultTTL
    this.maxSize = options.maxSize || this.maxSize
  }

  // 生成缓存键
  private generateKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : ''
    return `${url}:${paramString}`
  }

  // 检查缓存是否有效
  private isValid(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp < item.ttl
  }

  // 清理过期缓存
  private cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp >= item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // 限制缓存大小
  private limitSize(): void {
    if (this.cache.size > this.maxSize) {
      const entries = Array.from(this.cache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      const toDelete = entries.slice(0, this.cache.size - this.maxSize)
      toDelete.forEach(([key]) => this.cache.delete(key))
    }
  }

  // 获取缓存数据
  get<T>(url: string, params?: Record<string, any>): T | null {
    this.cleanup()
    const key = this.generateKey(url, params)
    const item = this.cache.get(key)
    
    if (item && this.isValid(item)) {
      return item.data
    }
    
    if (item) {
      this.cache.delete(key)
    }
    
    return null
  }

  // 设置缓存数据
  set<T>(url: string, data: T, params?: Record<string, any>, ttl?: number): void {
    this.cleanup()
    this.limitSize()
    
    const key = this.generateKey(url, params)
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    }
    
    this.cache.set(key, item)
  }

  // 删除缓存
  delete(url: string, params?: Record<string, any>): boolean {
    const key = this.generateKey(url, params)
    return this.cache.delete(key)
  }

  // 清空所有缓存
  clear(): void {
    this.cache.clear()
  }

  // 获取缓存统计信息
  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0 // 可以添加命中率统计
    }
  }
}

// 创建全局缓存实例
export const apiCache = new APICache({
  ttl: 5 * 60 * 1000, // 5分钟
  maxSize: 100
})

// 缓存装饰器函数
export function withCache<T>(
  fn: (...args: any[]) => Promise<T>,
  ttl?: number
): (...args: any[]) => Promise<T> {
  return async (...args: any[]) => {
    const cacheKey = `${fn.name}:${JSON.stringify(args)}`
    
    // 尝试从缓存获取
    const cached = apiCache.get<T>(cacheKey)
    if (cached) {
      return cached
    }
    
    // 执行原函数
    const result = await fn(...args)
    
    // 缓存结果
    apiCache.set(cacheKey, result, undefined, ttl)
    
    return result
  }
}

// 预定义的缓存策略
export const cacheStrategies = {
  // 城市数据缓存1小时
  cities: <T>(fn: (...args: any[]) => Promise<T>) => withCache(fn, 60 * 60 * 1000),
  // 地点数据缓存30分钟
  places: <T>(fn: (...args: any[]) => Promise<T>) => withCache(fn, 30 * 60 * 1000),
  // 用户数据缓存5分钟
  user: <T>(fn: (...args: any[]) => Promise<T>) => withCache(fn, 5 * 60 * 1000),
  // 实时数据不缓存
  realtime: <T>(fn: (...args: any[]) => Promise<T>) => fn
}
