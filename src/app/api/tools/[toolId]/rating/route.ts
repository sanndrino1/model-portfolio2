import { NextRequest, NextResponse } from 'next/server'
import { auditLogger } from '@/lib/auditLog'
import { toolRatingsManager } from '@/lib/toolRatings'

export async function GET(
  request: NextRequest,
  { params }: { params: { toolId: string } }
) {
  try {
    const { toolId } = params
        const stats = await toolRatingsManager.getToolStats(toolId)

    await auditLogger.log({
      userId: 'system',
      userEmail: 'system@admin.com',
      userRole: 'admin',
      action: 'view',
      resourceType: 'tool_rating',
      resourceId: toolId,
      details: {
        description: `Преглед на рейтинг за тул ${toolId}`,
        severity: 'low',
        category: 'user_action'
      }
    })

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error fetching rating:', error)
    return NextResponse.json(
      { error: 'Грешка при зареждане на рейтинг' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { toolId: string } }
) {
  try {
    const { toolId } = params
    const body = await request.json()
    const { value, userId } = body

    if (!value || value < 1 || value > 5) {
      return NextResponse.json(
        { error: 'Рейтингът трябва да е между 1 и 5' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID е задължителен' },
        { status: 400 }
      )
    }

    if (!ratings[toolId]) {
      ratings[toolId] = { average: 0, count: 0, votes: [] }
    }

    const toolRating = ratings[toolId]
    
    // Проверка дали потребителят вече е гласувал
    const existingVoteIndex = toolRating.votes.findIndex(vote => vote.userId === userId)
    
    if (existingVoteIndex >= 0) {
      // Обновяване на съществуващ глас
      const oldValue = toolRating.votes[existingVoteIndex].value
      toolRating.votes[existingVoteIndex].value = value
      toolRating.votes[existingVoteIndex].updatedAt = new Date().toISOString()
      
      // Преизчисляване на средния рейтинг
      const total = toolRating.votes.reduce((sum, vote) => sum + vote.value, 0)
      toolRating.average = Math.round((total / toolRating.count) * 10) / 10
      
      await auditLogger.log({
        userId,
        userEmail: `${userId}@admin.com`,
        userRole: 'admin',
        action: 'update',
        resourceType: 'tool_rating',
        resourceId: toolId,
        details: {
          description: `Обновен рейтинг за тул ${toolId} от ${oldValue} на ${value}`,
          severity: 'medium',
          category: 'user_action',
          metadata: { toolId, oldValue, newValue: value }
        }
      })
    } else {
      // Нов глас
      const newVote = {
        userId,
        value,
        createdAt: new Date().toISOString()
      }
      
      toolRating.votes.push(newVote)
      toolRating.count++
      
      // Преизчисляване на средния рейтинг
      const total = toolRating.votes.reduce((sum, vote) => sum + vote.value, 0)
      toolRating.average = Math.round((total / toolRating.count) * 10) / 10
      
      await auditLogger.log({
        userId,
        userEmail: `${userId}@admin.com`,
        userRole: 'admin',
        action: 'rate',
        resourceType: 'tool_rating',
        resourceId: toolId,
        details: {
          description: `Добавен рейтинг ${value} за тул ${toolId}`,
          severity: 'medium',
          category: 'user_action',
          metadata: { toolId, ratingValue: value }
        }
      })
    }

    return NextResponse.json({
      success: true,
      rating: toolRating
    })
  } catch (error) {
    console.error('Error saving rating:', error)
    return NextResponse.json(
      { error: 'Грешка при запазване на рейтинг' },
      { status: 500 }
    )
  }
}