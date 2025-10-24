import { NextRequest, NextResponse } from 'next/server'
import { auditLogger } from '@/lib/auditLog'
import { toolRatingsManager } from '@/lib/toolRatings'

export async function GET(
  request: NextRequest,
  { params }: { params: { toolId: string } }
) {
  try {
    const { toolId } = params
    const comments = await toolRatingsManager.getComments({ toolId })

    await auditLogger.log({
      userId: 'system',
      userEmail: 'system@admin.com',
      userRole: 'admin',
      action: 'view',
      resourceType: 'tool_comment',
      resourceId: toolId,
      details: {
        description: `Преглед на коментари за тул ${toolId}`,
        severity: 'low',
        category: 'user_action'
      }
    })

    return NextResponse.json({
      success: true,
      comments
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Грешка при зареждане на коментари' },
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
    const { comment, rating, userId, userEmail, userRole } = body

    if (!comment || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Коментарът, потребителският ID и email са задължителни' },
        { status: 400 }
      )
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Рейтингът трябва да е между 1 и 5' },
        { status: 400 }
      )
    }

    const newComment = await toolRatingsManager.addComment({
      toolId,
      userId,
      userEmail,
      userRole: userRole || 'viewer',
      comment,
      rating: rating || 0
    })

    await auditLogger.log({
      userId,
      userEmail,
      userRole: userRole || 'viewer',
      action: 'create',
      resourceType: 'tool_comment',
      resourceId: newComment.id,
      resourceName: `Коментар за ${toolId}`,
      details: {
        description: `Създаден нов коментар за тул ${toolId}`,
        severity: 'medium',
        category: 'content',
        metadata: { toolId, commentText: comment, rating }
      }
    })

    return NextResponse.json({
      success: true,
      comment: newComment
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Грешка при създаване на коментар' },
      { status: 500 }
    )
  }
}