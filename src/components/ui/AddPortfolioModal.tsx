'use client'

import * as React from "react"
import { Modal, ModalBody, ModalFooter } from "./Modal"
import { Button } from "./Button"
import { Input } from "./Input"
import { Textarea } from "./Textarea"
import { CategoryDropdown, PortfolioCategory } from "./CategoryDropdown"
import { cn } from "@/lib/utils"
import { useToastActions } from "@/contexts/ToastContext"

export interface PortfolioItem {
  id?: string
  title: string
  description: string
  category: PortfolioCategory
  imageUrl: string
  tags?: string[]
  date?: string
  featured?: boolean
}

export interface AddPortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: PortfolioItem) => void
  isLoading?: boolean
}

const AddPortfolioModal = React.forwardRef<HTMLDivElement, AddPortfolioModalProps>(
  ({ isOpen, onClose, onSave, isLoading = false }, ref) => {
    const { showCreateSuccess, showValidationError, showError } = useToastActions()
    
    const [formData, setFormData] = React.useState<PortfolioItem>({
      title: '',
      description: '',
      category: 'editorial',
      imageUrl: '',
      tags: [],
      date: new Date().getFullYear().toString(),
      featured: false
    })

    const [errors, setErrors] = React.useState<Record<string, string>>({})

    // Reset form when modal opens
    React.useEffect(() => {
      if (isOpen) {
        setFormData({
          title: '',
          description: '',
          category: 'editorial',
          imageUrl: '',
          tags: [],
          date: new Date().getFullYear().toString(),
          featured: false
        })
        setErrors({})
      }
    }, [isOpen])

    const handleInputChange = (field: keyof PortfolioItem, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }))
      }
    }

    const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {}

      if (!formData.title.trim()) {
        newErrors.title = 'Заглавието е задължително'
      }

      if (!formData.description.trim()) {
        newErrors.description = 'Описанието е задължително'
      }

      if (!formData.imageUrl.trim()) {
        newErrors.imageUrl = 'URL на снимката е задължителен'
      } else {
        // Basic URL validation
        try {
          new URL(formData.imageUrl)
        } catch {
          newErrors.imageUrl = 'Невалиден URL адрес'
        }
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSave = async () => {
      try {
        if (validateForm()) {
          const newItem = {
            ...formData,
            id: Date.now().toString(), // Generate simple ID
            tags: formData.tags?.filter(tag => tag.trim() !== '') || []
          }
          
          await onSave(newItem)
          showCreateSuccess()
          onClose()
        } else {
          showValidationError()
        }
      } catch (error) {
        console.error('Error saving portfolio item:', error)
        showError('Възникна грешка при запазването. Моля, опитайте отново.')
      }
    }

    const handleTagsChange = (value: string) => {
      const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      handleInputChange('tags', tags)
    }

    return (
      <Modal
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        title="Добави нова снимка в портфолио"
        description="Попълнете информацията за новата снимка"
        size="lg"
      >
        <ModalBody>
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Заглавие *
              </label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Въведете заглавие на снимката"
                className={cn(errors.title && "border-red-500")}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Описание *
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Опишете снимката..."
                rows={3}
                className={cn(errors.description && "border-red-500")}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">
                URL на снимката *
              </label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={cn(errors.imageUrl && "border-red-500")}
              />
              {errors.imageUrl && (
                <p className="text-sm text-red-600">{errors.imageUrl}</p>
              )}
            </div>

            {/* Category and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Категория
                </label>
                <CategoryDropdown
                  currentCategory={formData.category}
                  onCategoryChange={(category) => handleInputChange('category', category)}
                  showAll={false}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Година
                </label>
                <Input
                  id="date"
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  placeholder="2024"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Тагове (разделени със запетая)
              </label>
              <Input
                id="tags"
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="мода, портрет, студийна снимка"
              />
              <p className="text-xs text-muted-foreground">
                Въведете тагове разделени със запетая
              </p>
            </div>

            {/* Featured checkbox */}
            <div className="flex items-center space-x-2">
              <input
                id="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Избрана снимка (ще се показва на първо място)
              </label>
            </div>

            {/* Preview */}
            {formData.imageUrl && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Преглед</label>
                <div className="border border-border rounded-lg p-4">
                  <img
                    src={formData.imageUrl}
                    alt="Преглед"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Отказ
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Запазване...' : 'Запази'}
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
)
AddPortfolioModal.displayName = "AddPortfolioModal"

export { AddPortfolioModal }