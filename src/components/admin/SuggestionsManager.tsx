'use client'

import * as React from "react"
import { Button, Card, Input, Dropdown, Modal, Badge } from "@/components/ui"
import { cn } from "@/lib/utils"

// Типове за предложения
interface Suggestion {
  id: string
  title: string
  description: string
  category: 'feature' | 'bug' | 'improvement' | 'design' | 'content'
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  submittedBy: string
  submitterRole: 'user' | 'admin' | 'moderator' | 'client'
  submittedAt: string
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  estimatedHours?: number
  attachments?: string[]
}

// Примерни данни за предложения
const SUGGESTIONS: Suggestion[] = [
  {
    id: '1',
    title: 'Добавяне на тъмна тема',
    description: 'Предлагам да се добави опция за тъмна тема в настройките на сайта за по-добро потребителско изживяване през нощта.',
    category: 'feature',
    status: 'pending',
    priority: 'medium',
    submittedBy: 'maria.petrova@email.com',
    submitterRole: 'client',
    submittedAt: '2024-01-15',
    estimatedHours: 8
  },
  {
    id: '2',
    title: 'Оптимизация на галерията',
    description: 'Галерията се зарежда бавно при много снимки. Предлагам lazy loading и компресия на изображенията.',
    category: 'improvement',
    status: 'approved',
    priority: 'high',
    submittedBy: 'admin@site.com',
    submitterRole: 'admin',
    submittedAt: '2024-01-12',
    reviewedBy: 'Главен разработчик',
    reviewedAt: '2024-01-13',
    reviewNotes: 'Отлична идея, ще подобри производителността значително.',
    estimatedHours: 40
  },
  {
    id: '3',
    title: 'Контактна форма не работи',
    description: 'При изпращане на съобщение се показва грешка 500. Проблемът се появява последните 2 дни',
    category: 'bug',
    status: 'approved',
    priority: 'critical',
    submittedBy: 'visitor@email.com',
    submittedAt: '2024-10-18T16:45:00Z',
    reviewedBy: 'admin@site.com',
    reviewedAt: '2024-10-18T17:00:00Z',
    reviewNotes: 'Критичен проблем - трябва да се поправи спешно',
    submitterRole: 'user'
  },
  {
    id: '4',
    title: 'Мобилна версия на галерията',
    description: 'Подобряване на мобилната версия на портфолио галерията с gesture навигация',
    category: 'design',
    status: 'rejected',
    priority: 'low',
    submittedBy: 'designer@agency.com',
    submittedAt: '2024-10-10T11:00:00Z',
    reviewedBy: 'admin@site.com',
    reviewedAt: '2024-10-13T13:30:00Z',
    reviewNotes: 'В момента мобилната версия работи добре. Ще преразгледаме в бъдеще.',
    submitterRole: 'client'
  },
  {
    id: '5',
    title: 'Интеграция със социални мрежи',
    description: 'Автоматично споделяне на нови снимки в Instagram и Facebook',
    category: 'feature',
    status: 'pending',
    priority: 'medium',
    submittedBy: 'marketing@company.com',
    submittedAt: '2024-10-17T08:15:00Z',
    submitterRole: 'client',
    estimatedHours: 80
  },
  {
    id: '6',
    title: 'Добавяне на филтри за галерията',
    description: 'Възможност за филтрине на снимки по дата, категория и ключови думи',
    category: 'feature',
    status: 'completed',
    priority: 'medium',
    submittedBy: 'client@model.com',
    submittedAt: '2024-09-25T12:00:00Z',
    reviewedBy: 'admin@site.com',
    reviewedAt: '2024-09-26T10:00:00Z',
    reviewNotes: 'Имплементирано успешно в последния ъпдейт',
    submitterRole: 'client'
  }
]

interface SuggestionsManagerProps {
  className?: string
}

export function SuggestionsManager({ className }: SuggestionsManagerProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [selectedType, setSelectedType] = React.useState<string>('all')
  const [selectedPriority, setSelectedPriority] = React.useState<string>('all')
  const [selectedRole, setSelectedRole] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedSuggestion, setSelectedSuggestion] = React.useState<Suggestion | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false)
  const [reviewNotes, setReviewNotes] = React.useState('')
  const [reviewAction, setReviewAction] = React.useState<'approve' | 'reject'>('approve')

  const statusFilters = [
    { value: 'all', label: 'Всички статуси', count: SUGGESTIONS.length },
    { value: 'pending', label: 'Чакащи преглед', count: SUGGESTIONS.filter(s => s.status === 'pending').length },
    { value: 'approved', label: 'Одобрени', count: SUGGESTIONS.filter(s => s.status === 'approved').length },
    { value: 'rejected', label: 'Отхвърлени', count: SUGGESTIONS.filter(s => s.status === 'rejected').length },
    { value: 'in-progress', label: 'В процес', count: SUGGESTIONS.filter(s => s.status === 'in-progress').length },
    { value: 'completed', label: 'Завършени', count: SUGGESTIONS.filter(s => s.status === 'completed').length }
  ]

  const typeFilters = [
    { value: 'all', label: 'Всички типове' },
    { value: 'feature', label: 'Нова функционалност' },
    { value: 'improvement', label: 'Подобрение' },
    { value: 'bug', label: 'Проблем' },
    { value: 'design', label: 'Дизайн' },
    { value: 'content', label: 'Съдържание' }
  ]

  const priorityFilters = [
    { value: 'all', label: 'Всички приоритети' },
    { value: 'critical', label: 'Критичен' },
    { value: 'high', label: 'Висок' },
    { value: 'medium', label: 'Среден' },
    { value: 'low', label: 'Нисък' }
  ]

  const roleFilters = [
    { value: 'all', label: 'Всички роли' },
    { value: 'user', label: '👤 Потребител' },
    { value: 'admin', label: '👑 Администратор' },
    { value: 'moderator', label: '🛡️ Модератор' },
    { value: 'client', label: '💼 Клиент' }
  ]

  const filteredSuggestions = SUGGESTIONS.filter(suggestion => {
    const matchesStatus = selectedStatus === 'all' || suggestion.status === selectedStatus
    const matchesType = selectedType === 'all' || suggestion.category === selectedType
    const matchesPriority = selectedPriority === 'all' || suggestion.priority === selectedPriority
    const matchesSearch = suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         suggestion.submittedBy.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesType && matchesPriority && matchesSearch
  })

  const getStatusBadge = (status: Suggestion['status']) => {
    const variants = {
      pending: 'warning',
      approved: 'success', 
      rejected: 'error',
      'in-progress': 'info',
      completed: 'success'
    } as const

    const labels = {
      pending: 'Чака преглед',
      approved: 'Одобрено',
      rejected: 'Отхвърлено',
      'in-progress': 'В процес',
      completed: 'Завършено'
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: Suggestion['priority']) => {
    const variants = {
      critical: 'error',
      high: 'warning',
      medium: 'info',
      low: 'secondary'
    } as const

    const labels = {
      critical: 'Критичен',
      high: 'Висок',
      medium: 'Среден',
      low: 'Нисък'
    }

    return (
      <Badge variant={variants[priority]} size="sm">
        {labels[priority]}
      </Badge>
    )
  }

  const getTypeIcon = (category: Suggestion['category']) => {
    const icons = {
      feature: '✨',
      improvement: '⚡',
      bug: '🐛',
      design: '🎨',
      content: '📝'
    }
    return icons[category] || '💡'
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

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion)
    setIsDetailModalOpen(true)
  }

  const handleReviewClick = (suggestion: Suggestion, action: 'approve' | 'reject') => {
    setSelectedSuggestion(suggestion)
    setReviewAction(action)
    setReviewNotes('')
    setIsReviewModalOpen(true)
  }

  const handleReviewSubmit = () => {
    if (!selectedSuggestion || !reviewNotes.trim()) return

    // Тук би трябвало да се направи API заявка за обновяване на статуса
    console.log('Reviewing suggestion:', {
      id: selectedSuggestion.id,
      action: reviewAction,
      notes: reviewNotes
    })

    // Затваряме модалите
    setIsReviewModalOpen(false)
    setIsDetailModalOpen(false)
    setSelectedSuggestion(null)
    setReviewNotes('')
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-elegant font-semibold text-foreground">
            Управление на предложения
          </h1>
          <p className="text-muted-foreground">
            Одобряване и отхвърляне на предложения от потребители
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            📊 Статистики
          </Button>
          <Button variant="primary" size="sm">
            📝 Ново предложение
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <span className="text-warning text-lg">⏳</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {SUGGESTIONS.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Чакащи преглед</div>
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <span className="text-success text-lg">✅</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {SUGGESTIONS.filter(s => s.status === 'approved').length}
              </div>
              <div className="text-sm text-muted-foreground">Одобрени</div>
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <span className="text-error text-lg">❌</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {SUGGESTIONS.filter(s => s.status === 'rejected').length}
              </div>
              <div className="text-sm text-muted-foreground">Отхвърлени</div>
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <span className="text-info text-lg">🚀</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {SUGGESTIONS.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Внедрени</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Търси предложения..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Dropdown
            trigger={
              <Button variant="outline" size="sm">
                {statusFilters.find(f => f.value === selectedStatus)?.label || 'Статус'} ▼
              </Button>
            }
            items={statusFilters.map(f => ({ value: f.value, label: f.label }))}
            onSelect={(value) => setSelectedStatus(value)}
          />
          
          <Dropdown
            trigger={
              <Button variant="outline" size="sm">
                {typeFilters.find(f => f.value === selectedType)?.label || 'Тип'} ▼
              </Button>
            }
            items={typeFilters}
            onSelect={(value) => setSelectedType(value)}
          />
          
          <Dropdown
            trigger={
              <Button variant="outline" size="sm">
                {priorityFilters.find(f => f.value === selectedPriority)?.label || 'Приоритет'} ▼
              </Button>
            }
            items={priorityFilters}
            onSelect={(value) => setSelectedPriority(value)}
          />
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {filteredSuggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            variant="default"
            className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Icon & Title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="text-lg">
                      {getTypeIcon(suggestion.category)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {suggestion.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {suggestion.description}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">От:</span> {suggestion.submittedBy}
                  </div>
                  <div>
                    <span className="font-medium">Дата:</span> {formatDate(suggestion.submittedAt)}
                  </div>
                  {suggestion.category && (
                    <div>
                      <span className="font-medium">Категория:</span> {suggestion.category}
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-2">
                  {getStatusBadge(suggestion.status)}
                  {getPriorityBadge(suggestion.priority)}
                </div>
                
                {suggestion.status === 'pending' && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReviewClick(suggestion, 'approve')
                      }}
                    >
                      ✓ Одобри
                    </Button>
                    <Button
                      variant="error"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReviewClick(suggestion, 'reject')
                      }}
                    >
                      ✗ Отхвърли
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile metadata */}
            <div className="md:hidden mt-3 pt-3 border-t border-muted flex items-center justify-between text-xs text-muted-foreground">
              <span>{suggestion.submittedBy}</span>
              <span>{formatDate(suggestion.submittedAt)}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedSuggestion?.title}
        size="lg"
      >
        {selectedSuggestion && (
          <div className="space-y-6">
            {/* Status & Priority */}
            <div className="flex items-center gap-4">
              {getStatusBadge(selectedSuggestion.status)}
              {getPriorityBadge(selectedSuggestion.priority)}
              <span className="text-sm text-muted-foreground">
                {getTypeIcon(selectedSuggestion.category)} {selectedSuggestion.category}
              </span>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Описание</h4>
              <p className="text-muted-foreground">{selectedSuggestion.description}</p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Подадено от:</span>
                <p className="mt-1">{selectedSuggestion.submittedBy}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Дата на подаване:</span>
                <p className="mt-1">{formatDate(selectedSuggestion.submittedAt)}</p>
              </div>
              {selectedSuggestion.category && (
                <div>
                  <span className="font-medium text-muted-foreground">Категория:</span>
                  <p className="mt-1">{selectedSuggestion.category}</p>
                </div>
              )}
              {selectedSuggestion.estimatedHours && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Оценено време:</p>
                  <p className="mt-1">{selectedSuggestion.estimatedHours} часа</p>
                </div>
              )}
            </div>

            {/* Review Info */}
            {selectedSuggestion.reviewedBy && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Информация за прегледа</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Прегледано от:</span> {selectedSuggestion.reviewedBy}
                  </div>
                  <div>
                    <span className="font-medium">Дата на прегледа:</span> {formatDate(selectedSuggestion.reviewedAt!)}
                  </div>
                  {selectedSuggestion.reviewNotes && (
                    <div>
                      <span className="font-medium">Бележки:</span>
                      <p className="mt-1 text-muted-foreground">{selectedSuggestion.reviewNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            {selectedSuggestion.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="success"
                  onClick={() => handleReviewClick(selectedSuggestion, 'approve')}
                >
                  ✓ Одобри
                </Button>
                <Button 
                  variant="error"
                  onClick={() => handleReviewClick(selectedSuggestion, 'reject')}
                >
                  ✗ Отхвърли
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`${reviewAction === 'approve' ? 'Одобряване' : 'Отхвърляне'} на предложение`}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-lg">
            <h4 className="font-semibold mb-1">{selectedSuggestion?.title}</h4>
            <p className="text-sm text-muted-foreground">{selectedSuggestion?.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Бележки за прегледа {reviewAction === 'reject' && <span className="text-error">*</span>}
            </label>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder={reviewAction === 'approve' 
                ? 'Добавете коментар за одобрението...' 
                : 'Обяснете защо отхвърляте предложението...'
              }
              className="w-full min-h-[100px] p-3 border border-muted rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant={reviewAction === 'approve' ? 'success' : 'error'}
              onClick={handleReviewSubmit}
              disabled={!reviewNotes.trim()}
            >
              {reviewAction === 'approve' ? '✓ Одобри' : '✗ Отхвърли'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsReviewModalOpen(false)}
            >
              Отказ
            </Button>
          </div>
        </div>
      </Modal>

      {/* Empty State */}
      {filteredSuggestions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💡</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Няма намерени предложения
          </h3>
          <p className="text-muted-foreground mb-4">
            Опитайте с различни филтри или изчакайте нови предложения
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('')
              setSelectedStatus('all')
              setSelectedType('all')
              setSelectedPriority('all')
            }}
          >
            Изчисти филтрите
          </Button>
        </div>
      )}
    </div>
  )
}

export default SuggestionsManager