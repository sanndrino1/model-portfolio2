'use client'

import * as React from "react"
import { Button, Card, Input, Dropdown, Modal } from "@/components/ui"
import { cn } from "@/lib/utils"

// Типове за управление на съдържание
interface ContentItem {
  id: string
  title: string
  type: 'page' | 'portfolio' | 'blog' | 'media'
  status: 'published' | 'draft' | 'archived'
  author: string
  createdAt: string
  updatedAt: string
  views?: number
  category?: string
}

// Примерни данни
const CONTENT_ITEMS: ContentItem[] = [
  {
    id: '1',
    title: 'Начална страница',
    type: 'page',
    status: 'published',
    author: 'Админ',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    views: 1250,
    category: 'Основни страници'
  },
  {
    id: '2',
    title: 'Портфолио галерия',
    type: 'portfolio',
    status: 'published',
    author: 'Админ',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    views: 890,
    category: 'Портфолио'
  },
  {
    id: '3',
    title: 'За мен страница',
    type: 'page',
    status: 'published',
    author: 'Админ',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-16',
    views: 560,
    category: 'Основни страници'
  },
  {
    id: '4',
    title: 'Fashion фотосесия 2024',
    type: 'portfolio',
    status: 'draft',
    author: 'Админ',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22',
    category: 'Портфолио'
  },
  {
    id: '5',
    title: 'Контакти и услуги',
    type: 'page',
    status: 'published',
    author: 'Админ',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-14',
    views: 420,
    category: 'Основни страници'
  }
]

interface ContentManagerProps {
  className?: string
}

export function ContentManager({ className }: ContentManagerProps) {
  const [selectedType, setSelectedType] = React.useState<string>('all')
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedItem, setSelectedItem] = React.useState<ContentItem | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  const contentTypes = [
    { value: 'all', label: 'Всички типове', count: CONTENT_ITEMS.length },
    { value: 'page', label: 'Страници', count: CONTENT_ITEMS.filter(c => c.type === 'page').length },
    { value: 'portfolio', label: 'Портфолио', count: CONTENT_ITEMS.filter(c => c.type === 'portfolio').length },
    { value: 'blog', label: 'Блог', count: CONTENT_ITEMS.filter(c => c.type === 'blog').length },
    { value: 'media', label: 'Медия', count: CONTENT_ITEMS.filter(c => c.type === 'media').length }
  ]

  const statusTypes = [
    { value: 'all', label: 'Всички статуси' },
    { value: 'published', label: 'Публикувани' },
    { value: 'draft', label: 'Чернови' },
    { value: 'archived', label: 'Архивирани' }
  ]

  const filteredItems = CONTENT_ITEMS.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesType && matchesStatus && matchesSearch
  })

  const getTypeIcon = (type: ContentItem['type']) => {
    const icons = {
      page: '📄',
      portfolio: '🖼️',
      blog: '📝',
      media: '🎬'
    }
    return icons[type] || '📄'
  }

  const getStatusBadge = (status: ContentItem['status']) => {
    const styles = {
      published: 'bg-success/10 text-success border-success/20',
      draft: 'bg-warning/10 text-warning border-warning/20',
      archived: 'bg-muted text-muted-foreground border-muted'
    }
    
    const labels = {
      published: 'Публикувано',
      draft: 'Чернова',
      archived: 'Архивирано'
    }

    return (
      <span className={cn(
        'px-2 py-1 text-xs font-medium rounded-full border',
        styles[status]
      )}>
        {labels[status]}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleItemClick = (item: ContentItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-elegant font-semibold text-foreground">
            Управление на съдържание
          </h1>
          <p className="text-muted-foreground">
            Преглед и редактиране на всички страници и медия файлове
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            📊 Статистики
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Ново съдържание
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Търси по заглавие или категория..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Type Filter */}
        <div className="flex flex-wrap gap-2">
          {contentTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.value)}
              className="text-sm"
            >
              {type.label}
              <span className="ml-1 opacity-60">({type.count})</span>
            </Button>
          ))}
        </div>

        {/* Status Filter */}
        <Dropdown
          trigger={
            <Button variant="outline" size="sm">
              {statusTypes.find(s => s.value === selectedStatus)?.label || 'Статус'} ▼
            </Button>
          }
          items={statusTypes}
          onSelect={(value) => setSelectedStatus(value)}
        />
      </div>

      {/* Content List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            variant="default"
            className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => handleItemClick(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Icon & Title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="text-lg">
                      {getTypeIcon(item.type)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    {item.category && (
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Автор:</span> {item.author}
                  </div>
                  <div>
                    <span className="font-medium">Обновено:</span> {formatDate(item.updatedAt)}
                  </div>
                  {item.views && (
                    <div>
                      <span className="font-medium">Прегледи:</span> {item.views.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3">
                {getStatusBadge(item.status)}
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Edit:', item.id)
                    }}
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Delete:', item.id)
                    }}
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile metadata */}
            <div className="md:hidden mt-3 pt-3 border-t border-muted flex items-center justify-between text-xs text-muted-foreground">
              <span>{item.author} • {formatDate(item.updatedAt)}</span>
              {item.views && <span>{item.views.toLocaleString()} прегледа</span>}
            </div>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem?.title}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Тип:</span>
                <p className="flex items-center gap-2 mt-1">
                  <span>{getTypeIcon(selectedItem.type)}</span>
                  {selectedItem.type}
                </p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Статус:</span>
                <div className="mt-1">
                  {getStatusBadge(selectedItem.status)}
                </div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Автор:</span>
                <p className="mt-1">{selectedItem.author}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Категория:</span>
                <p className="mt-1">{selectedItem.category || 'Няма'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Създадено:</span>
                <p className="mt-1">{formatDate(selectedItem.createdAt)}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Обновено:</span>
                <p className="mt-1">{formatDate(selectedItem.updatedAt)}</p>
              </div>
            </div>

            {/* Stats */}
            {selectedItem.views && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Статистики</h4>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="font-medium">Прегледи:</span> {selectedItem.views.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Средно на ден:</span> ~{Math.round(selectedItem.views / 30)}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="primary">
                ✏️ Редактирай
              </Button>
              <Button variant="outline">
                👁️ Преглед
              </Button>
              <Button variant="outline">
                📊 Статистики
              </Button>
              {selectedItem.status === 'published' ? (
                <Button variant="outline">
                  📝 Архивирай
                </Button>
              ) : (
                <Button variant="secondary">
                  🚀 Публикувай
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Създай ново съдържание"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Тип съдържание</label>
            <Dropdown
              trigger={
                <Button variant="outline" className="w-full justify-between">
                  Избери тип ▼
                </Button>
              }
              items={[
                { value: 'page', label: '📄 Страница' },
                { value: 'portfolio', label: '🖼️ Портфолио' },
                { value: 'blog', label: '📝 Блог статия' },
                { value: 'media', label: '🎬 Медия файл' }
              ]}
              onSelect={(value) => console.log('Selected:', value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Заглавие</label>
            <Input placeholder="Въведи заглавие..." />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Категория</label>
            <Input placeholder="Въведи категория..." />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="primary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Създай
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Отказ
            </Button>
          </div>
        </div>
      </Modal>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Няма намерено съдържание
          </h3>
          <p className="text-muted-foreground mb-4">
            Опитайте с различни филтри или създайте ново съдържание
          </p>
          <Button 
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Създай съдържание
          </Button>
        </div>
      )}
    </div>
  )
}

export default ContentManager