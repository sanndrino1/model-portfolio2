import CacheService, { CACHE_KEYS, CACHE_TTL } from '@/lib/redis'

// Типове за категории и инструменти
interface Category {
  id: string
  name: string
  slug: string
  count: number
  description?: string
  icon?: string
}

interface ToolStats {
  total: number
  byCategory: Record<string, number>
  byStatus: Record<string, number>
  byType: Record<string, number>
}

interface SuggestionStats {
  total: number
  byStatus: Record<string, number>
  byCategory: Record<string, number>
  byPriority: Record<string, number>
}

export class AdminCacheService {
  
  /**
   * Получаване на всички категории с кеширане
   */
  static async getCategories(): Promise<Category[]> {
    return await CacheService.getOrSet(
      CACHE_KEYS.CATEGORIES,
      async () => {
        // Симулация на заявка към база данни
        const categories: Category[] = [
          {
            id: '1',
            name: 'Layout',
            slug: 'layout',
            count: 8,
            description: 'Компоненти за оформление',
            icon: '📐'
          },
          {
            id: '2',
            name: 'Форми',
            slug: 'forms',
            count: 12,
            description: 'Input елементи и форми',
            icon: '📝'
          },
          {
            id: '3',
            name: 'Feedback',
            slug: 'feedback',
            count: 6,
            description: 'Съобщения и индикатори',
            icon: '💬'
          },
          {
            id: '4',
            name: 'Навигация',
            slug: 'navigation',
            count: 4,
            description: 'Менюта и навигация',
            icon: '🧭'
          },
          {
            id: '5',
            name: 'Данни',
            slug: 'data',
            count: 10,
            description: 'Таблици и галерии',
            icon: '📊'
          }
        ]
        
        console.log('🔄 Fetching categories from database...')
        return categories
      },
      CACHE_TTL.LONG // 2 часа
    )
  }

  /**
   * Получаване на статистики за инструменти с кеширане
   */
  static async getToolsStats(): Promise<ToolStats> {
    return await CacheService.getOrSet(
      CACHE_KEYS.TOOLS_COUNT,
      async () => {
        console.log('🔄 Calculating tools statistics...')
        
        const stats: ToolStats = {
          total: 40,
          byCategory: {
            'layout': 8,
            'forms': 12,
            'feedback': 6,
            'navigation': 4,
            'data': 10
          },
          byStatus: {
            'stable': 32,
            'beta': 6,
            'deprecated': 2
          },
          byType: {
            'component': 35,
            'utility': 3,
            'hook': 2
          }
        }
        
        return stats
      },
      CACHE_TTL.MEDIUM // 30 минути
    )
  }

  /**
   * Получаване на статистики за предложения с кеширане
   */
  static async getSuggestionsStats(): Promise<SuggestionStats> {
    return await CacheService.getOrSet(
      CACHE_KEYS.SUGGESTIONS_COUNT,
      async () => {
        console.log('🔄 Calculating suggestions statistics...')
        
        const stats: SuggestionStats = {
          total: 25,
          byStatus: {
            'pending': 8,
            'approved': 12,
            'rejected': 3,
            'implemented': 2
          },
          byCategory: {
            'improvement': 15,
            'bug-fix': 6,
            'new-feature': 4
          },
          byPriority: {
            'low': 10,
            'medium': 12,
            'high': 3
          }
        }
        
        return stats
      },
      CACHE_TTL.SHORT // 5 минути
    )
  }

  /**
   * Инвалидиране на категории cache при промяна
   */
  static async invalidateCategories(): Promise<void> {
    await CacheService.delete(CACHE_KEYS.CATEGORIES)
    console.log('🗑️ Categories cache invalidated')
  }

  /**
   * Инвалидиране на инструменти статистики
   */
  static async invalidateToolsStats(): Promise<void> {
    await CacheService.delete(CACHE_KEYS.TOOLS_COUNT)
    console.log('🗑️ Tools statistics cache invalidated')
  }

  /**
   * Инвалидиране на предложения статистики
   */
  static async invalidateSuggestionsStats(): Promise<void> {
    await CacheService.delete(CACHE_KEYS.SUGGESTIONS_COUNT)
    console.log('🗑️ Suggestions statistics cache invalidated')
  }

  /**
   * Обновяване на броя инструменти в категория
   */
  static async updateCategoryCount(categoryId: string, delta: number): Promise<void> {
    try {
      const categories = await this.getCategories()
      const category = categories.find(cat => cat.id === categoryId)
      
      if (category) {
        category.count += delta
        
        // Обновяване в cache
        await CacheService.set(CACHE_KEYS.CATEGORIES, categories, CACHE_TTL.LONG)
        
        // Обновяване и общата статистика
        await this.invalidateToolsStats()
        
        console.log(`📊 Updated category ${categoryId} count by ${delta}`)
      }
    } catch (error) {
      console.error('Error updating category count:', error)
    }
  }

  /**
   * Добавяне на нова категория
   */
  static async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString() // Временно ID за демо
    }
    
    const categories = await this.getCategories()
    categories.push(newCategory)
    
    // Обновяване в cache
    await CacheService.set(CACHE_KEYS.CATEGORIES, categories, CACHE_TTL.LONG)
    
    console.log('➕ Added new category:', newCategory.name)
    return newCategory
  }

  /**
   * Изтриване на категория
   */
  static async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const categories = await this.getCategories()
      const filteredCategories = categories.filter(cat => cat.id !== categoryId)
      
      if (filteredCategories.length < categories.length) {
        await CacheService.set(CACHE_KEYS.CATEGORIES, filteredCategories, CACHE_TTL.LONG)
        await this.invalidateToolsStats()
        
        console.log('🗑️ Deleted category:', categoryId)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error deleting category:', error)
      return false
    }
  }

  /**
   * Получаване на cache статистики
   */
  static async getCacheStats(): Promise<{
    categories: { cached: boolean; ttl: number }
    toolsStats: { cached: boolean; ttl: number }
    suggestionsStats: { cached: boolean; ttl: number }
  }> {
    return {
      categories: {
        cached: await CacheService.exists(CACHE_KEYS.CATEGORIES),
        ttl: await CacheService.ttl(CACHE_KEYS.CATEGORIES)
      },
      toolsStats: {
        cached: await CacheService.exists(CACHE_KEYS.TOOLS_COUNT),
        ttl: await CacheService.ttl(CACHE_KEYS.TOOLS_COUNT)
      },
      suggestionsStats: {
        cached: await CacheService.exists(CACHE_KEYS.SUGGESTIONS_COUNT),
        ttl: await CacheService.ttl(CACHE_KEYS.SUGGESTIONS_COUNT)
      }
    }
  }

  /**
   * Прогряване на cache-а (предварително зареждане)
   */
  static async warmupCache(): Promise<void> {
    console.log('🔥 Warming up admin cache...')
    
    await Promise.all([
      this.getCategories(),
      this.getToolsStats(),
      this.getSuggestionsStats()
    ])
    
    console.log('✅ Cache warmup completed')
  }

  /**
   * Изчистване на целия админ cache
   */
  static async clearAllCache(): Promise<void> {
    await Promise.all([
      this.invalidateCategories(),
      this.invalidateToolsStats(),
      this.invalidateSuggestionsStats()
    ])
    
    console.log('🧹 All admin cache cleared')
  }
}

export default AdminCacheService