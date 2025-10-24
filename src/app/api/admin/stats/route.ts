import { NextRequest, NextResponse } from 'next/server'
import AdminCacheService from '@/lib/adminCache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const forceRefresh = searchParams.get('refresh') === 'true'

    // Ако се иска force refresh, изчистваме cache-а
    if (forceRefresh) {
      await AdminCacheService.clearAllCache()
    }

    switch (type) {
      case 'categories': {
        const categories = await AdminCacheService.getCategories()
        return NextResponse.json({
          success: true,
          data: categories,
          cached: !forceRefresh
        })
      }

      case 'tools': {
        const stats = await AdminCacheService.getToolsStats()
        return NextResponse.json({
          success: true,
          data: stats,
          cached: !forceRefresh
        })
      }

      case 'suggestions': {
        const stats = await AdminCacheService.getSuggestionsStats()
        return NextResponse.json({
          success: true,
          data: stats,
          cached: !forceRefresh
        })
      }

      case 'cache-stats': {
        const cacheStats = await AdminCacheService.getCacheStats()
        return NextResponse.json({
          success: true,
          data: cacheStats
        })
      }

      case 'all':
      default: {
        // Връщаме всички статистики наведнъж
        const [categories, toolsStats, suggestionsStats, cacheStats] = await Promise.all([
          AdminCacheService.getCategories(),
          AdminCacheService.getToolsStats(),
          AdminCacheService.getSuggestionsStats(),
          AdminCacheService.getCacheStats()
        ])

        return NextResponse.json({
          success: true,
          data: {
            categories,
            toolsStats,
            suggestionsStats,
            cacheInfo: cacheStats
          },
          cached: !forceRefresh
        })
      }
    }
  } catch (error) {
    console.error('Admin stats API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch admin statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, categoryId, delta } = await request.json()

    switch (action) {
      case 'update-category-count': {
        if (!categoryId || typeof delta !== 'number') {
          return NextResponse.json(
            { success: false, error: 'Missing categoryId or delta' },
            { status: 400 }
          )
        }

        await AdminCacheService.updateCategoryCount(categoryId, delta)
        
        return NextResponse.json({
          success: true,
          message: `Category ${categoryId} count updated by ${delta}`
        })
      }

      case 'warmup-cache': {
        await AdminCacheService.warmupCache()
        
        return NextResponse.json({
          success: true,
          message: 'Cache warmed up successfully'
        })
      }

      case 'clear-cache': {
        await AdminCacheService.clearAllCache()
        
        return NextResponse.json({
          success: true,
          message: 'All cache cleared successfully'
        })
      }

      default: {
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
      }
    }
  } catch (error) {
    console.error('Admin stats POST API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process admin action',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const type = searchParams.get('type')

    if (type === 'category' && categoryId) {
      const success = await AdminCacheService.deleteCategory(categoryId)
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: `Category ${categoryId} deleted successfully`
        })
      } else {
        return NextResponse.json(
          { success: false, error: 'Category not found or could not be deleted' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid delete request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Admin stats DELETE API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete resource',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}