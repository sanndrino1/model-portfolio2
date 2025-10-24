// Tool Ratings & Comments System

export interface ToolComment {
  id: string
  toolId: string
  userId: string
  userEmail: string
  userRole: 'admin' | 'editor' | 'viewer'
  comment: string
  rating: number // 1-5 звезди
  isApproved: boolean
  createdAt: string
  updatedAt?: string
  isEdited: boolean
  replies?: ToolCommentReply[]
}

export interface ToolCommentReply {
  id: string
  parentCommentId: string
  userId: string
  userEmail: string
  userRole: 'admin' | 'editor' | 'viewer'
  reply: string
  createdAt: string
  updatedAt?: string
  isEdited: boolean
}

export interface ToolRating {
  id: string
  toolId: string
  userId: string
  userEmail: string
  userRole: 'admin' | 'editor' | 'viewer'
  rating: number // 1-5 звезди
  createdAt: string
  updatedAt?: string
}

export interface ToolRatingStats {
  toolId: string
  averageRating: number
  totalRatings: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  totalComments: number
  approvedComments: number
  pendingComments: number
}

export interface ToolWithRatings {
  id: string
  name: string
  description: string
  category: string
  isActive: boolean
  hasExample: boolean
  lastUsed?: string
  // Добавени полета за рейтинг
  ratings: ToolRatingStats
  recentComments: ToolComment[]
}

// Филтри за коментари
export interface CommentFilters {
  toolId?: string
  userId?: string
  rating?: number
  isApproved?: boolean
  dateFrom?: string
  dateTo?: string
  searchTerm?: string
}

// Response типове за API
export interface CommentsResponse {
  comments: ToolComment[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  stats: {
    total: number
    approved: number
    pending: number
    averageRating: number
  }
}

export interface RatingsResponse {
  ratings: ToolRating[]
  stats: ToolRatingStats
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Utility functions
export const formatRating = (rating: number): string => {
  return rating.toFixed(1)
}

export const getRatingText = (rating: number): string => {
  if (rating >= 4.5) return 'Отличен'
  if (rating >= 4.0) return 'Много добър'
  if (rating >= 3.5) return 'Добър'
  if (rating >= 3.0) return 'Среден'
  if (rating >= 2.0) return 'Слаб'
  return 'Много слаб'
}

export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return 'text-green-600'
  if (rating >= 4.0) return 'text-green-500'
  if (rating >= 3.5) return 'text-yellow-500'
  if (rating >= 3.0) return 'text-yellow-600'
  if (rating >= 2.0) return 'text-orange-500'
  return 'text-red-500'
}

export const getStarsDisplay = (rating: number): string => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars)
}

// Mock data за development
export const MOCK_TOOL_COMMENTS: ToolComment[] = [
  {
    id: '1',
    toolId: 'button',
    userId: 'user1',
    userEmail: 'designer@company.com',
    userRole: 'editor',
    comment: 'Отличен компонент! Много добри варианти за стилизация и лесно за използване.',
    rating: 5,
    isApproved: true,
    createdAt: '2024-10-15T10:30:00Z',
    isEdited: false,
    replies: [
      {
        id: '1-1',
        parentCommentId: '1',
        userId: 'admin1',
        userEmail: 'admin@site.com',
        userRole: 'admin',
        reply: 'Благодаря за отзива! Радвам се, че ти харесва.',
        createdAt: '2024-10-15T11:00:00Z',
        isEdited: false
      }
    ]
  },
  {
    id: '2',
    toolId: 'button',
    userId: 'user2',
    userEmail: 'dev@agency.com',
    userRole: 'viewer',
    comment: 'Добър компонент, но би било добре да има повече размери.',
    rating: 4,
    isApproved: true,
    createdAt: '2024-10-14T14:20:00Z',
    isEdited: false
  },
  {
    id: '3',
    toolId: 'card',
    userId: 'user3',
    userEmail: 'client@model.com',
    userRole: 'viewer',
    comment: 'Перфектен за галерии! Анимациите са гладки.',
    rating: 5,
    isApproved: true,
    createdAt: '2024-10-13T09:15:00Z',
    isEdited: false
  },
  {
    id: '4',
    toolId: 'modal',
    userId: 'user4',
    userEmail: 'tester@company.com',
    userRole: 'editor',
    comment: 'Работи добре, но понякога има проблеми с ESC клавиша.',
    rating: 3,
    isApproved: false,
    createdAt: '2024-10-12T16:45:00Z',
    isEdited: false
  }
]

export const MOCK_TOOL_RATINGS: ToolRating[] = [
  {
    id: '1',
    toolId: 'button',
    userId: 'user1',
    userEmail: 'designer@company.com',
    userRole: 'editor',
    rating: 5,
    createdAt: '2024-10-15T10:30:00Z'
  },
  {
    id: '2',
    toolId: 'button',
    userId: 'user2',
    userEmail: 'dev@agency.com',
    userRole: 'viewer',
    rating: 4,
    createdAt: '2024-10-14T14:20:00Z'
  },
  {
    id: '3',
    toolId: 'button',
    userId: 'user5',
    userEmail: 'user@domain.com',
    userRole: 'viewer',
    rating: 5,
    createdAt: '2024-10-13T08:10:00Z'
  }
]

// Statistics calculator
export class ToolRatingsManager {
  private static instance: ToolRatingsManager
  private comments: ToolComment[] = [...MOCK_TOOL_COMMENTS]
  private ratings: ToolRating[] = [...MOCK_TOOL_RATINGS]

  static getInstance(): ToolRatingsManager {
    if (!ToolRatingsManager.instance) {
      ToolRatingsManager.instance = new ToolRatingsManager()
    }
    return ToolRatingsManager.instance
  }

  getToolStats(toolId: string): ToolRatingStats {
    const toolRatings = this.ratings.filter(r => r.toolId === toolId)
    const toolComments = this.comments.filter(c => c.toolId === toolId)
    
    const totalRatings = toolRatings.length
    const averageRating = totalRatings > 0 
      ? toolRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    toolRatings.forEach(r => {
      distribution[r.rating as keyof typeof distribution]++
    })

    return {
      toolId,
      averageRating,
      totalRatings,
      ratingDistribution: distribution,
      totalComments: toolComments.length,
      approvedComments: toolComments.filter(c => c.isApproved).length,
      pendingComments: toolComments.filter(c => !c.isApproved).length
    }
  }

  getComments(filters: CommentFilters = {}, page = 1, pageSize = 10): CommentsResponse {
    let filteredComments = [...this.comments]

    if (filters.toolId) {
      filteredComments = filteredComments.filter(c => c.toolId === filters.toolId)
    }
    if (filters.isApproved !== undefined) {
      filteredComments = filteredComments.filter(c => c.isApproved === filters.isApproved)
    }
    if (filters.rating) {
      filteredComments = filteredComments.filter(c => c.rating === filters.rating)
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      filteredComments = filteredComments.filter(c => 
        c.comment.toLowerCase().includes(term) ||
        c.userEmail.toLowerCase().includes(term)
      )
    }

    const total = filteredComments.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const paginatedComments = filteredComments.slice(start, start + pageSize)

    const averageRating = filteredComments.length > 0
      ? filteredComments.reduce((sum, c) => sum + c.rating, 0) / filteredComments.length
      : 0

    return {
      comments: paginatedComments,
      total,
      page,
      pageSize,
      totalPages,
      stats: {
        total: filteredComments.length,
        approved: filteredComments.filter(c => c.isApproved).length,
        pending: filteredComments.filter(c => !c.isApproved).length,
        averageRating
      }
    }
  }

  addComment(comment: Omit<ToolComment, 'id' | 'createdAt' | 'isEdited'>): ToolComment {
    const newComment: ToolComment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isEdited: false,
      replies: []
    }
    
    this.comments.unshift(newComment)
    return newComment
  }

  addRating(rating: Omit<ToolRating, 'id' | 'createdAt'>): ToolRating {
    // Премахни предишен рейтинг от същия потребител за същия тул
    this.ratings = this.ratings.filter(r => 
      !(r.toolId === rating.toolId && r.userId === rating.userId)
    )
    
    const newRating: ToolRating = {
      ...rating,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    this.ratings.push(newRating)
    return newRating
  }

  approveComment(commentId: string): boolean {
    const comment = this.comments.find(c => c.id === commentId)
    if (comment) {
      comment.isApproved = true
      return true
    }
    return false
  }

  deleteComment(commentId: string): boolean {
    const index = this.comments.findIndex(c => c.id === commentId)
    if (index !== -1) {
      this.comments.splice(index, 1)
      return true
    }
    return false
  }
}

export const toolRatingsManager = ToolRatingsManager.getInstance()