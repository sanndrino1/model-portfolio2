'use client'

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Tooltip } from "@/components/ui/Tooltip"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Rating } from "@/components/ui/Rating"
import { Comments } from "@/components/ui/Comments"
import { cn } from "@/lib/utils"

// Типове за UI компонентите
interface ComponentInfo {
  id: string
  name: string
  description: string
  category: 'layout' | 'form' | 'feedback' | 'navigation' | 'data'
  status: 'stable' | 'beta' | 'deprecated'
  version: string
  props: ComponentProp[]
  examples: ComponentExample[]
}

interface ComponentProp {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
}

interface ComponentExample {
  title: string
  code: string
  preview?: React.ReactNode
}

// Данни за всички UI компоненти
const UI_COMPONENTS: ComponentInfo[] = [
  {
    id: 'button',
    name: 'Button',
    description: 'Интерактивен бутон с различни стилове и размери',
    category: 'form',
    status: 'stable',
    version: '1.0.0',
    props: [
      { name: 'variant', type: '"default" | "primary" | "secondary" | "outline" | "ghost" | "link"', required: false, default: 'default', description: 'Визуален стил на бутона' },
      { name: 'size', type: '"sm" | "md" | "lg" | "xl"', required: false, default: 'md', description: 'Размер на бутона' },
      { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Деактивиране на бутона' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Съдържание на бутона' }
    ],
    examples: [
      {
        title: 'Основни варианти',
        code: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>`,
        preview: (
          <div className="flex gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        )
      }
    ]
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Контейнер за групиране на свързано съдържание',
    category: 'layout',
    status: 'stable',
    version: '1.2.0',
    props: [
      { name: 'variant', type: '"default" | "photo" | "elegant" | "glass" | "interactive" | "luxury"', required: false, default: 'default', description: 'Стил на картата' },
      { name: 'hover', type: 'boolean', required: false, default: 'false', description: 'Hover ефекти' },
      { name: 'clickable', type: 'boolean', required: false, default: 'false', description: 'Clickable карта' }
    ],
    examples: [
      {
        title: 'Различни стилове',
        code: `<Card variant="default">Default Card</Card>
<Card variant="elegant">Elegant Card</Card>
<Card variant="luxury">Luxury Card</Card>`
      }
    ]
  },
  {
    id: 'toast',
    name: 'Toast',
    description: 'Временни съобщения за потребителска информация',
    category: 'feedback',
    status: 'stable',
    version: '1.0.0',
    props: [
      { name: 'type', type: '"success" | "error" | "warning" | "info"', required: false, default: 'info', description: 'Тип на съобщението' },
      { name: 'title', type: 'string', required: false, description: 'Заглавие на съобщението' },
      { name: 'message', type: 'string', required: true, description: 'Текст на съобщението' },
      { name: 'duration', type: 'number', required: false, default: '5000', description: 'Време в милисекунди' }
    ],
    examples: [
      {
        title: 'Различни типове',
        code: `success('Успешно запазено!')
error('Възникна грешка!')
warning('Внимание!')
info('Информация')`
      }
    ]
  },
  {
    id: 'modal',
    name: 'Modal',
    description: 'Модален диалог за важно съдържание',
    category: 'feedback',
    status: 'stable',
    version: '1.1.0',
    props: [
      { name: 'isOpen', type: 'boolean', required: true, description: 'Състояние на модала' },
      { name: 'onClose', type: '() => void', required: true, description: 'Функция за затваряне' },
      { name: 'title', type: 'string', required: false, description: 'Заглавие на модала' },
      { name: 'size', type: '"sm" | "md" | "lg" | "xl"', required: false, default: 'md', description: 'Размер на модала' }
    ],
    examples: []
  },
  {
    id: 'input',
    name: 'Input',
    description: 'Поле за въвеждане на текст',
    category: 'form',
    status: 'stable',
    version: '1.0.0',
    props: [
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder текст' },
      { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Деактивиране' },
      { name: 'error', type: 'string', required: false, description: 'Съобщение за грешка' }
    ],
    examples: []
  },
  {
    id: 'dropdown',
    name: 'Dropdown',
    description: 'Падащо меню за избор от опции',
    category: 'form',
    status: 'stable',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'DropdownItem[]', required: true, description: 'Списък с опции' },
      { name: 'onSelect', type: '(item: DropdownItem) => void', required: true, description: 'Callback при избор' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder текст' }
    ],
    examples: []
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Галерия за показване на изображения',
    category: 'data',
    status: 'stable',
    version: '1.0.0',
    props: [
      { name: 'images', type: 'GalleryImage[]', required: true, description: 'Списък с изображения' },
      { name: 'columns', type: 'number', required: false, default: '3', description: 'Брой колони' },
      { name: 'lightbox', type: 'boolean', required: false, default: 'true', description: 'Lightbox функционалност' }
    ],
    examples: []
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    description: 'Подсказки при hover върху елементи',
    category: 'feedback',
    status: 'stable',
    version: '1.0.0',
    props: [
      { name: 'content', type: 'string', required: true, description: 'Съдържание на tooltip' },
      { name: 'position', type: '"top" | "bottom" | "left" | "right"', required: false, default: 'top', description: 'Позиция' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Елемент с tooltip' }
    ],
    examples: []
  }
]

interface AdminToolsProps {
  className?: string
}

export function AdminTools({ className }: AdminToolsProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedComponent, setSelectedComponent] = React.useState<ComponentInfo | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [categories, setCategories] = React.useState([
    { value: 'all', label: 'Всички', count: UI_COMPONENTS.length },
    { value: 'layout', label: 'Layout', count: UI_COMPONENTS.filter(c => c.category === 'layout').length },
    { value: 'form', label: 'Форми', count: UI_COMPONENTS.filter(c => c.category === 'form').length },
    { value: 'feedback', label: 'Feedback', count: UI_COMPONENTS.filter(c => c.category === 'feedback').length },
    { value: 'navigation', label: 'Навигация', count: UI_COMPONENTS.filter(c => c.category === 'navigation').length },
    { value: 'data', label: 'Данни', count: UI_COMPONENTS.filter(c => c.category === 'data').length }
  ])
  const [isLoadingStats, setIsLoadingStats] = React.useState(false)
  const [cacheInfo, setCacheInfo] = React.useState<any>(null)
  
  // Състояние за коментари и рейтинг
  const [selectedToolForRating, setSelectedToolForRating] = React.useState<string | null>(null)
  const [toolRatings, setToolRatings] = React.useState<Record<string, { average: number, count: number }>>({})
  const [toolComments, setToolComments] = React.useState<Record<string, any[]>>({})
  const [isCommentsOpen, setIsCommentsOpen] = React.useState(false)

  // Зареждане на статистики с кеширане
  const loadStats = async (forceRefresh = false) => {
    setIsLoadingStats(true)
    try {
      const response = await fetch(`/api/admin/stats?type=all${forceRefresh ? '&refresh=true' : ''}`)
      const result = await response.json()
      
      if (result.success) {
        const { categories: cachedCategories, toolsStats, cacheInfo: newCacheInfo } = result.data
        
        // Обновяване на категориите с cache данни
        const updatedCategories = [
          { value: 'all', label: 'Всички', count: toolsStats.total },
          ...Object.entries(toolsStats.byCategory).map(([key, count]) => ({
            value: key,
            label: key === 'forms' ? 'Форми' : key === 'navigation' ? 'Навигация' : key === 'data' ? 'Данни' : 
                   key.charAt(0).toUpperCase() + key.slice(1),
            count: count as number
          }))
        ]
        
        setCategories(updatedCategories)
        setCacheInfo(newCacheInfo)
        
        console.log('📊 Stats loaded from cache:', result.cached ? 'HIT' : 'MISS')
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Зареждане на статистики при mount
  React.useEffect(() => {
    loadStats()
  }, [])

  const filteredComponents = UI_COMPONENTS.filter(component => {
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleComponentClick = (component: ComponentInfo) => {
    setSelectedComponent(component)
    setIsModalOpen(true)
  }

  const getStatusBadge = (status: ComponentInfo['status']) => {
    const styles = {
      stable: 'bg-success/10 text-success border-success/20',
      beta: 'bg-warning/10 text-warning border-warning/20',
      deprecated: 'bg-error/10 text-error border-error/20'
    }
    
    const labels = {
      stable: 'Стабилен',
      beta: 'Beta',
      deprecated: 'Deprecated'
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

  // Функции за рейтинг и коментари
  const handleRatingSubmit = async (toolId: string, rating: number) => {
    try {
      const response = await fetch('/api/admin/tool-ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, rating })
      })
      
      if (response.ok) {
        const result = await response.json()
        setToolRatings(prev => ({
          ...prev,
          [toolId]: result.data
        }))
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
    }
  }

  const handleCommentSubmit = async (toolId: string, comment: string) => {
    try {
      const response = await fetch('/api/admin/tool-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, comment })
      })
      
      if (response.ok) {
        const result = await response.json()
        setToolComments(prev => ({
          ...prev,
          [toolId]: [...(prev[toolId] || []), result.data]
        }))
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  const openComments = (toolId: string) => {
    setSelectedToolForRating(toolId)
    setIsCommentsOpen(true)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-elegant font-semibold text-foreground">
            Управление на UI компоненти
          </h1>
          <p className="text-muted-foreground">
            Преглед и управление на всички UI инструменти в системата
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            📊 Статистики
          </Button>
          <Button variant="primary" size="sm">
            + Нов компонент
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Търси компоненти..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="text-sm"
            >
              {category.label}
              <span className="ml-1 opacity-60">({category.count})</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredComponents.map((component) => (
          <Card
            key={component.id}
            variant="default"
            className="p-6 hover:shadow-elegant transition-all duration-200 cursor-pointer group"
            onClick={() => handleComponentClick(component)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="text-primary font-medium text-sm">
                    {component.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {component.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    v{component.version}
                  </p>
                </div>
              </div>
              {getStatusBadge(component.status)}
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {component.description}
            </p>
            
            {/* Рейтинг и коментари */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <Rating
                  value={toolRatings[component.id]?.average || 0}
                  onChange={(rating) => handleRatingSubmit(component.id, rating)}
                  size="sm"
                  showValue={true}
                />
                <span className="text-xs text-muted-foreground">
                  ({toolRatings[component.id]?.count || 0})
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    openComments(component.id)
                  }}
                  className="text-xs"
                >
                  💬 Коментари ({toolComments[component.id]?.length || 0})
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground capitalize">
                {component.category}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {component.props.length} props
                </span>
                {component.examples.length > 0 && (
                  <Tooltip content="Има примери">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </Tooltip>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Component Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedComponent?.name}
        size="lg"
      >
        {selectedComponent && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-2">
                  {selectedComponent.description}
                </p>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedComponent.status)}
                  <span className="text-sm text-muted-foreground">
                    Версия {selectedComponent.version}
                  </span>
                  <span className="text-sm text-muted-foreground capitalize">
                    Категория: {selectedComponent.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Props */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Props</h4>
              <div className="space-y-3">
                {selectedComponent.props.map((prop, index) => (
                  <div key={index} className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono text-primary">
                        {prop.name}
                      </code>
                      {prop.required && (
                        <span className="text-xs text-error">*задължителен</span>
                      )}
                      {prop.default && (
                        <span className="text-xs text-muted-foreground">
                          default: {prop.default}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Тип: <code>{prop.type}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {prop.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Examples */}
            {selectedComponent.examples.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-3">Примери</h4>
                <div className="space-y-4">
                  {selectedComponent.examples.map((example, index) => (
                    <div key={index} className="space-y-2">
                      <h5 className="text-sm font-medium text-foreground">
                        {example.title}
                      </h5>
                      {example.preview && (
                        <div className="p-4 bg-muted/30 rounded-lg border">
                          {example.preview}
                        </div>
                      )}
                      <pre className="p-3 bg-muted/50 rounded-lg text-sm overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Empty State */}
      {filteredComponents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.007-5.824-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Няма намерени компоненти
          </h3>
          <p className="text-muted-foreground mb-4">
            Опитайте с различни филтри или търсене
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
          >
            Изчисти филтрите
          </Button>
        </div>
      )}

      {/* Comments Modal */}
      <Modal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        title={`Коментари за ${selectedToolForRating ? UI_COMPONENTS.find(c => c.id === selectedToolForRating)?.name : ''}`}
        size="lg"
      >
        {selectedToolForRating && (
          <div className="space-y-6">
            {/* Rating Section */}
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Оценка</h3>
              <div className="flex items-center gap-4">
                <Rating
                  value={toolRatings[selectedToolForRating]?.average || 0}
                  onChange={(rating) => handleRatingSubmit(selectedToolForRating, rating)}
                  size="lg"
                  showValue={true}
                />
                <span className="text-sm text-muted-foreground">
                  {toolRatings[selectedToolForRating]?.count || 0} гласа
                </span>
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <Comments
                toolId={selectedToolForRating}
                showAddComment={true}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AdminTools