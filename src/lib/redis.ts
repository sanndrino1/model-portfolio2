import Redis from 'ioredis'

// Redis конфигурация
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 3,
})

// Cache ключове
export const CACHE_KEYS = {
  CATEGORIES: 'admin:categories',
  TOOLS_COUNT: 'admin:tools:count',
  SUGGESTIONS_COUNT: 'admin:suggestions:count',
  USER_ROLES: 'admin:user:roles',
  SETTINGS: 'admin:settings',
} as const

// Cache TTL (време на живот в секунди)
export const CACHE_TTL = {
  SHORT: 5 * 60, // 5 минути
  MEDIUM: 30 * 60, // 30 минути
  LONG: 2 * 60 * 60, // 2 часа
  DAILY: 24 * 60 * 60, // 24 часа
} as const

// Cache utility functions
export class CacheService {
  
  /**
   * Получаване на данни от cache
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  /**
   * Запазване на данни в cache
   */
  static async set(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<boolean> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Изтриване на конкретен ключ
   */
  static async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Изтриване на множество ключове по pattern
   */
  static async deletePattern(pattern: string): Promise<boolean> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
      return true
    } catch (error) {
      console.error(`Cache delete pattern error for pattern ${pattern}:`, error)
      return false
    }
  }

  /**
   * Получаване с автоматично обновление
   */
  static async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<T> {
    try {
      // Опитай да вземеш от cache
      const cached = await this.get<T>(key)
      if (cached !== null) {
        return cached
      }

      // Ако няма в cache, извикай fetcher функцията
      const fresh = await fetcher()
      
      // Съхрани новите данни в cache
      await this.set(key, fresh, ttl)
      
      return fresh
    } catch (error) {
      console.error(`Cache getOrSet error for key ${key}:`, error)
      // Ако има проблем с cache, върни директно резултата
      return await fetcher()
    }
  }

  /**
   * Увеличаване на брояч
   */
  static async increment(key: string, amount: number = 1): Promise<number> {
    try {
      return await redis.incrby(key, amount)
    } catch (error) {
      console.error(`Cache increment error for key ${key}:`, error)
      return 0
    }
  }

  /**
   * Намаляване на брояч
   */
  static async decrement(key: string, amount: number = 1): Promise<number> {
    try {
      return await redis.decrby(key, amount)
    } catch (error) {
      console.error(`Cache decrement error for key ${key}:`, error)
      return 0
    }
  }

  /**
   * Проверка дали ключ съществува
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const exists = await redis.exists(key)
      return exists === 1
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Получаване на време на изтичане на ключ
   */
  static async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(key)
    } catch (error) {
      console.error(`Cache TTL error for key ${key}:`, error)
      return -1
    }
  }

  /**
   * Изчистване на целия cache
   */
  static async flush(): Promise<boolean> {
    try {
      await redis.flushdb()
      return true
    } catch (error) {
      console.error('Cache flush error:', error)
      return false
    }
  }
}

// Експортиране на Redis инстанцията за директна употреба
export { redis }
export default CacheService