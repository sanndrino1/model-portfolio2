'use client'

import * as React from "react"
import { Button, Card, Textarea, Modal, Dropdown } from "@/components/ui"
import { Rating, RatingDisplay } from "@/components/ui/Rating"
import { cn } from "@/lib/utils"
import { 
  ToolComment, 
  ToolCommentReply, 
  CommentFilters,
  CommentsResponse,
  toolRatingsManager,
  getRatingText,
  getRatingColor
} from "@/lib/toolRatings"

export interface CommentsProps {
  toolId: string
  className?: string
  showAddComment?: boolean
  showFilters?: boolean
  pageSize?: number
}

export interface CommentCardProps {
  comment: ToolComment
  onApprove?: (commentId: string) => void
  onDelete?: (commentId: string) => void
  onReply?: (commentId: string, reply: string) => void
  showActions?: boolean
  className?: string
}

const CommentCard = React.forwardRef<HTMLDivElement, CommentCardProps>(
  ({ 
    comment, 
    onApprove, 
    onDelete, 
    onReply,
    showActions = false,
    className,
    ...props 
  }, ref) => {
    const [isReplyOpen, setIsReplyOpen] = React.useState(false)
    const [replyText, setReplyText] = React.useState('')
    const [isSubmittingReply, setIsSubmittingReply] = React.useState(false)

    const handleReplySubmit = async () => {
      if (!replyText.trim() || !onReply) return
      
      setIsSubmittingReply(true)
      try {
        await onReply(comment.id, replyText)
        setReplyText('')
        setIsReplyOpen(false)
      } catch (error) {
        console.error('Error submitting reply:', error)
      } finally {
        setIsSubmittingReply(false)
      }
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('bg-BG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getRoleIcon = (role: string) => {
      switch (role) {
        case 'admin': return '👑'
        case 'editor': return '✏️'
        case 'viewer': return '👤'
        default: return '👤'
      }
    }

    const getRoleLabel = (role: string) => {
      switch (role) {
        case 'admin': return 'Администратор'
        case 'editor': return 'Редактор'
        case 'viewer': return 'Потребител'
        default: return 'Потребител'
      }
    }

    return (
      <Card 
        ref={ref}
        variant="default"
        className={cn(
          "p-4 space-y-3",
          !comment.isApproved && "border-orange-200 bg-orange-50/50",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getRoleIcon(comment.userRole)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.userEmail}</span>
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
                    {getRoleLabel(comment.userRole)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <RatingDisplay 
                    rating={comment.rating} 
                    count={0}
                    size="sm"
                    showCount={false}
                    showValue={true}
                    className="text-xs"
                  />
                  <span className={cn("text-xs font-medium", getRatingColor(comment.rating))}>
                    {getRatingText(comment.rating)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!comment.isApproved && (
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                Чака одобрение
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
              {comment.isEdited && " (редактиран)"}
            </span>
          </div>
        </div>

        {/* Comment Content */}
        <div className="text-sm text-foreground leading-relaxed">
          {comment.comment}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          {showActions && (
            <>
              {!comment.isApproved && onApprove && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => onApprove(comment.id)}
                  className="text-xs"
                >
                  ✓ Одобри
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="error"
                  onClick={() => onDelete(comment.id)}
                  className="text-xs"
                >
                  🗑️ Изтрий
                </Button>
              )}
            </>
          )}
          
          {onReply && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsReplyOpen(!isReplyOpen)}
              className="text-xs"
            >
              💬 Отговори
            </Button>
          )}
        </div>

        {/* Reply Form */}
        {isReplyOpen && (
          <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
            <Textarea
              placeholder="Напиши отговор..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              className="text-sm"
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleReplySubmit}
                disabled={!replyText.trim() || isSubmittingReply}
                className="text-xs"
              >
                {isSubmittingReply ? 'Изпраща...' : 'Изпрати'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsReplyOpen(false)
                  setReplyText('')
                }}
                className="text-xs"
              >
                Отказ
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2 ml-6 pl-4 border-l-2 border-muted">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getRoleIcon(reply.userRole)}</span>
                  <span className="font-medium text-sm">{reply.userEmail}</span>
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
                    {getRoleLabel(reply.userRole)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(reply.createdAt)}
                    {reply.isEdited && " (редактиран)"}
                  </span>
                </div>
                <div className="text-sm text-foreground leading-relaxed ml-6">
                  {reply.reply}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    )
  }
)

CommentCard.displayName = "CommentCard"

const Comments = React.forwardRef<HTMLDivElement, CommentsProps>(
  ({ 
    toolId, 
    className,
    showAddComment = true,
    showFilters = true,
    pageSize = 10,
    ...props 
  }, ref) => {
    const [comments, setComments] = React.useState<ToolComment[]>([])
    const [loading, setLoading] = React.useState(true)
    const [filters, setFilters] = React.useState<CommentFilters>({ toolId })
    const [currentPage, setCurrentPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)
    const [stats, setStats] = React.useState<CommentsResponse['stats'] | null>(null)

    // Add comment form
    const [isAddingComment, setIsAddingComment] = React.useState(false)
    const [newComment, setNewComment] = React.useState('')
    const [newRating, setNewRating] = React.useState(5)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const fetchComments = React.useCallback(async () => {
      setLoading(true)
      try {
        const response = toolRatingsManager.getComments(
          { ...filters, toolId }, 
          currentPage, 
          pageSize
        )
        setComments(response.comments)
        setTotalPages(response.totalPages)
        setStats(response.stats)
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoading(false)
      }
    }, [toolId, filters, currentPage, pageSize])

    React.useEffect(() => {
      fetchComments()
    }, [fetchComments])

    const handleAddComment = async () => {
      if (!newComment.trim()) return

      setIsSubmitting(true)
      try {
        const comment = toolRatingsManager.addComment({
          toolId,
          userId: 'current-user', // В реален случай от auth context
          userEmail: 'current@user.com', // В реален случай от auth context
          userRole: 'viewer', // В реален случай от auth context
          comment: newComment,
          rating: newRating,
          isApproved: false // Изисква одобрение
        })

        // Обнови локалния списък
        setComments(prev => [comment, ...prev])
        
        // Изчисти формата
        setNewComment('')
        setNewRating(5)
        setIsAddingComment(false)

        // Рефреш статистиките
        fetchComments()
      } catch (error) {
        console.error('Error adding comment:', error)
      } finally {
        setIsSubmitting(false)
      }
    }

    const handleApproveComment = async (commentId: string) => {
      try {
        const success = toolRatingsManager.approveComment(commentId)
        if (success) {
          setComments(prev => 
            prev.map(c => 
              c.id === commentId ? { ...c, isApproved: true } : c
            )
          )
          fetchComments() // Рефреш за статистики
        }
      } catch (error) {
        console.error('Error approving comment:', error)
      }
    }

    const handleDeleteComment = async (commentId: string) => {
      try {
        const success = toolRatingsManager.deleteComment(commentId)
        if (success) {
          setComments(prev => prev.filter(c => c.id !== commentId))
          fetchComments() // Рефреш за статистики
        }
      } catch (error) {
        console.error('Error deleting comment:', error)
      }
    }

    const handleReply = async (commentId: string, reply: string) => {
      // В реален случай API call
      console.log('Reply to comment:', commentId, reply)
    }

    return (
      <div 
        ref={ref}
        className={cn("space-y-4", className)}
        {...props}
      >
        {/* Header & Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Коментари и рейтинг</h3>
            {stats && (
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span>{stats.total} коментара</span>
                <span>{stats.approved} одобрени</span>
                {stats.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <RatingDisplay 
                      rating={stats.averageRating}
                      count={stats.total}
                      size="sm"
                      showValue={true}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {showAddComment && (
            <Button 
              size="sm"
              onClick={() => setIsAddingComment(true)}
            >
              💬 Добави коментар
            </Button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Dropdown
              trigger={
                <Button variant="outline" size="sm">
                  {filters.isApproved === undefined ? 'Всички' : 
                   filters.isApproved ? 'Одобрени' : 'Чакащи'} ▼
                </Button>
              }
              items={[
                { value: 'all', label: 'Всички коментари' },
                { value: 'approved', label: 'Одобрени' },
                { value: 'pending', label: 'Чакащи одобрение' }
              ]}
              onSelect={(value) => {
                setFilters(prev => ({
                  ...prev,
                  isApproved: value === 'all' ? undefined : value === 'approved'
                }))
                setCurrentPage(1)
              }}
            />

            <Dropdown
              trigger={
                <Button variant="outline" size="sm">
                  {filters.rating ? `${filters.rating} звезди` : 'Всички рейтинги'} ▼
                </Button>
              }
              items={[
                { value: 'all', label: 'Всички рейтинги' },
                { value: '5', label: '5 звезди' },
                { value: '4', label: '4 звезди' },
                { value: '3', label: '3 звезди' },
                { value: '2', label: '2 звезди' },
                { value: '1', label: '1 звезда' }
              ]}
              onSelect={(value) => {
                setFilters(prev => ({
                  ...prev,
                  rating: value === 'all' ? undefined : parseInt(value)
                }))
                setCurrentPage(1)
              }}
            />
          </div>
        )}

        {/* Comments List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground">Зареждане на коментари...</div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground">Няма коментари за този тул.</div>
            {showAddComment && (
              <Button 
                className="mt-2"
                onClick={() => setIsAddingComment(true)}
              >
                Бъди първия, който коментира
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onApprove={handleApproveComment}
                onDelete={handleDeleteComment}
                onReply={handleReply}
                showActions={true} // В реален случай проверка за роля
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ← Предишна
            </Button>
            
            <span className="text-sm text-muted-foreground px-3">
              Страница {currentPage} от {totalPages}
            </span>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Следваща →
            </Button>
          </div>
        )}

        {/* Add Comment Modal */}
        <Modal
          isOpen={isAddingComment}
          onClose={() => setIsAddingComment(false)}
          title="Добави коментар и рейтинг"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Твоят рейтинг</label>
              <Rating
                value={newRating}
                onChange={setNewRating}
                size="lg"
                showValue={true}
                showText={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Коментар</label>
              <Textarea
                placeholder="Сподели мнението си за този тул..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              />
              <div className="text-xs text-muted-foreground mt-1">
                Коментарът ще бъде видим след одобрение от администратор.
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? 'Изпраща...' : 'Изпрати коментар'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddingComment(false)}
              >
                Отказ
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
)

Comments.displayName = "Comments"

export { Comments, CommentCard }