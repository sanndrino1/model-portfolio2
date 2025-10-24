'use client'

import * as React from "react"
import { Button, Card, Input, Textarea, Dropdown, Modal } from "@/components/ui"
import { cn } from "@/lib/utils"

// Типове за настройки
interface SettingItem {
  id: string
  key: string
  label: string
  description: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea' | 'color' | 'file'
  value: any
  category: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

// Примерни настройки на системата
const SYSTEM_SETTINGS: SettingItem[] = [
  // Основни настройки
  {
    id: '1',
    key: 'site_title',
    label: 'Заглавие на сайта',
    description: 'Основно заглавие, което се показва в браузъра и SEO',
    type: 'string',
    value: 'Model Portfolio',
    category: 'Основни',
    required: true
  },
  {
    id: '2',
    key: 'site_description',
    label: 'Описание на сайта',
    description: 'Кратко описание за SEO и социални мрежи',
    type: 'textarea',
    value: 'Професионален модел портфолио сайт с галерии и контакти',
    category: 'Основни',
    required: true
  },
  {
    id: '3',
    key: 'contact_email',
    label: 'Основен email',
    description: 'Email адрес за контакти и системни съобщения',
    type: 'string',
    value: 'contact@modelportfolio.com',
    category: 'Основни',
    required: true,
    validation: { pattern: '^[^@]+@[^@]+\\.[^@]+$' }
  },
  {
    id: '4',
    key: 'phone_number',
    label: 'Телефонен номер',
    description: 'Основен телефон за контакти',
    type: 'string',
    value: '+359 888 123 456',
    category: 'Основни'
  },

  // Дизайн настройки
  {
    id: '5',
    key: 'primary_color',
    label: 'Основен цвят',
    description: 'Главният цвят на темата',
    type: 'color',
    value: '#3b82f6',
    category: 'Дизайн'
  },
  {
    id: '6',
    key: 'secondary_color',
    label: 'Вторичен цвят',
    description: 'Вторичният цвят на темата',
    type: 'color',
    value: '#64748b',
    category: 'Дизайн'
  },
  {
    id: '7',
    key: 'theme_mode',
    label: 'Режим на темата',
    description: 'Светла или тъмна тема по подразбиране',
    type: 'select',
    value: 'auto',
    category: 'Дизайн',
    options: [
      { value: 'light', label: 'Светла' },
      { value: 'dark', label: 'Тъмна' },
      { value: 'auto', label: 'Автоматично' }
    ]
  },
  {
    id: '8',
    key: 'enable_animations',
    label: 'Анимации',
    description: 'Включване на анимации и преходи',
    type: 'boolean',
    value: true,
    category: 'Дизайн'
  },

  // Портфолио настройки
  {
    id: '9',
    key: 'gallery_columns',
    label: 'Колони в галерията',
    description: 'Брой колони за показване на снимки',
    type: 'number',
    value: 3,
    category: 'Портфолио',
    validation: { min: 1, max: 6 }
  },
  {
    id: '10',
    key: 'images_per_page',
    label: 'Снимки на страница',
    description: 'Колко снимки да се показват на една страница',
    type: 'number',
    value: 20,
    category: 'Портфолио',
    validation: { min: 5, max: 50 }
  },
  {
    id: '11',
    key: 'enable_lightbox',
    label: 'Lightbox галерия',
    description: 'Включване на lightbox при кликване върху снимка',
    type: 'boolean',
    value: true,
    category: 'Портфолио'
  },
  {
    id: '12',
    key: 'image_quality',
    label: 'Качество на снимките',
    description: 'Качество на компресията на снимките',
    type: 'select',
    value: 'high',
    category: 'Портфолио',
    options: [
      { value: 'low', label: 'Ниско (по-бързо)' },
      { value: 'medium', label: 'Средно' },
      { value: 'high', label: 'Високо (по-бавно)' }
    ]
  },

  // SEO настройки
  {
    id: '13',
    key: 'meta_keywords',
    label: 'Meta ключови думи',
    description: 'Ключови думи за търсачки (разделени със запетая)',
    type: 'textarea',
    value: 'модел, портфолио, фотография, мода, красота',
    category: 'SEO'
  },
  {
    id: '14',
    key: 'google_analytics_id',
    label: 'Google Analytics ID',
    description: 'ID за Google Analytics проследяване',
    type: 'string',
    value: '',
    category: 'SEO'
  },
  {
    id: '15',
    key: 'enable_sitemap',
    label: 'Автоматичен sitemap',
    description: 'Генериране на sitemap.xml файл',
    type: 'boolean',
    value: true,
    category: 'SEO'
  },

  // Сигурност настройки
  {
    id: '16',
    key: 'enable_2fa',
    label: 'Двуфакторна автентификация',
    description: 'Задължителна 2FA за администратори',
    type: 'boolean',
    value: true,
    category: 'Сигурност'
  },
  {
    id: '17',
    key: 'session_timeout',
    label: 'Време на сесия (минути)',
    description: 'Автоматично излизане след неактивност',
    type: 'number',
    value: 60,
    category: 'Сигурност',
    validation: { min: 15, max: 480 }
  },
  {
    id: '18',
    key: 'max_login_attempts',
    label: 'Максимум опити за вход',
    description: 'Брой неуспешни опити преди блокиране',
    type: 'number',
    value: 5,
    category: 'Сигурност',
    validation: { min: 3, max: 10 }
  }
]

interface SettingsManagerProps {
  className?: string
}

export function SettingsManager({ className }: SettingsManagerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [editingSettings, setEditingSettings] = React.useState<{ [key: string]: any }>({})
  const [hasChanges, setHasChanges] = React.useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = React.useState(false)

  const categories = [
    { value: 'all', label: 'Всички категории' },
    { value: 'Основни', label: 'Основни' },
    { value: 'Дизайн', label: 'Дизайн' },
    { value: 'Портфолио', label: 'Портфолио' },
    { value: 'SEO', label: 'SEO' },
    { value: 'Сигурност', label: 'Сигурност' }
  ]

  const filteredSettings = SYSTEM_SETTINGS.filter(setting => {
    const matchesCategory = selectedCategory === 'all' || setting.category === selectedCategory
    const matchesSearch = setting.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         setting.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const groupedSettings = filteredSettings.reduce((groups, setting) => {
    const category = setting.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(setting)
    return groups
  }, {} as { [key: string]: SettingItem[] })

  const handleSettingChange = (settingId: string, value: any) => {
    setEditingSettings(prev => ({
      ...prev,
      [settingId]: value
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      // Тук би трябвало да се направи API заявка за запазване
      console.log('Saving settings:', editingSettings)
      
      // Симулация на API заявка
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setEditingSettings({})
      setHasChanges(false)
      
      // Toast съобщение за успешно запазване
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  const handleReset = () => {
    setEditingSettings({})
    setHasChanges(false)
    setIsResetModalOpen(false)
  }

  const renderSettingInput = (setting: SettingItem) => {
    const currentValue = editingSettings[setting.id] !== undefined 
      ? editingSettings[setting.id] 
      : setting.value

    switch (setting.type) {
      case 'string':
        return (
          <Input
            value={currentValue || ''}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            placeholder={setting.description}
            required={setting.required}
          />
        )

      case 'textarea':
        return (
          <Textarea
            value={currentValue || ''}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            placeholder={setting.description}
            rows={3}
            required={setting.required}
          />
        )

      case 'number':
        return (
          <Input
            type="number"
            value={currentValue || ''}
            onChange={(e) => handleSettingChange(setting.id, Number(e.target.value))}
            min={setting.validation?.min}
            max={setting.validation?.max}
            required={setting.required}
          />
        )

      case 'boolean':
        return (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={currentValue === true}
              onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
              className="w-4 h-4 text-primary bg-background border-muted rounded focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">
              {currentValue ? 'Включено' : 'Изключено'}
            </span>
          </div>
        )

      case 'select':
        return (
          <Dropdown
            items={setting.options || []}
            onSelect={(item) => handleSettingChange(setting.id, item.value)}
            placeholder={setting.options?.find(opt => opt.value === currentValue)?.label || 'Избери...'}
          />
        )

      case 'color':
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={currentValue || '#000000'}
              onChange={(e) => handleSettingChange(setting.id, e.target.value)}
              className="w-12 h-8 rounded border border-muted cursor-pointer"
            />
            <Input
              value={currentValue || ''}
              onChange={(e) => handleSettingChange(setting.id, e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        )

      default:
        return <Input value={currentValue || ''} disabled />
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-elegant font-semibold text-foreground">
            Настройки на системата
          </h1>
          <p className="text-muted-foreground">
            Конфигуриране на основните параметри на сайта
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {hasChanges && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsResetModalOpen(true)}
              >
                🔄 Отказ
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleSave}
              >
                💾 Запази промените
              </Button>
            </>
          )}
          <Button variant="outline" size="sm">
            📋 Експортирай настройки
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Търси настройки..."
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
            </Button>
          ))}
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-8">
        {Object.entries(groupedSettings).map(([categoryName, settings]) => (
          <div key={categoryName}>
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-muted">
              {categoryName}
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {settings.map((setting) => (
                <Card key={setting.id} variant="default" className="p-6">
                  <div className="space-y-4">
                    {/* Setting Header */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <label className="font-semibold text-foreground">
                          {setting.label}
                        </label>
                        {setting.required && (
                          <span className="text-error text-sm">*</span>
                        )}
                        {editingSettings[setting.id] !== undefined && (
                          <span className="w-2 h-2 bg-warning rounded-full" title="Има несъхранени промени" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>

                    {/* Setting Input */}
                    <div>
                      {renderSettingInput(setting)}
                    </div>

                    {/* Validation Info */}
                    {setting.validation && (
                      <div className="text-xs text-muted-foreground">
                        {setting.validation.min !== undefined && setting.validation.max !== undefined && (
                          <span>Между {setting.validation.min} и {setting.validation.max}</span>
                        )}
                        {setting.validation.pattern && (
                          <span>Формат: {setting.validation.pattern}</span>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Отказ на промените"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Сигурни ли сте, че искате да отхвърлите всички несъхранени промени?
          </p>
          
          <div className="flex gap-3">
            <Button 
              variant="error"
              onClick={handleReset}
            >
              Да, отхвърли
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsResetModalOpen(false)}
            >
              Отказ
            </Button>
          </div>
        </div>
      </Modal>

      {/* Empty State */}
      {filteredSettings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Няма намерени настройки
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

      {/* Changes Indicator */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-warning/10 border border-warning/20 text-warning px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
            Имате несъхранени промени
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsManager