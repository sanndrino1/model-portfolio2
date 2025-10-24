'use client'

import * as React from "react"
import { Modal, ModalBody, ModalFooter } from "./Modal"
import { Button } from "./Button"
import { Input } from "./Input"
import { Textarea } from "./Textarea"
import { CategoryDropdown, PortfolioCategory } from "./CategoryDropdown"
import { PortfolioItem } from "./AddPortfolioModal"
import { cn } from "@/lib/utils"
import { useToastActions } from "@/contexts/ToastContext"

export interface EditPortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: PortfolioItem) => void
  onDelete?: (id: string) => void
  item: PortfolioItem | null
  isLoading?: boolean
}

const EditPortfolioModal = React.forwardRef<HTMLDivElement, EditPortfolioModalProps>(
  ({ isOpen, onClose, onSave, onDelete, item, isLoading = false }, ref) => {
    const { showSaveSuccess, showDeleteSuccess, showValidationError, showError } = useToastActions()
    
    const [formData, setFormData] = React.useState<PortfolioItem>({
      id: '',
      title: '',
      description: '',
      category: 'editorial',
      imageUrl: '',
      tags: [],
      date: '',
      featured: false
    })

    const [errors, setErrors] = React.useState<Record<string, string>>({})
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

    // Update form when item changes
    React.useEffect(() => {
      if (isOpen && item) {
        setFormData({
          id: item.id || '',
          title: item.title || '',
          description: item.description || '',
          category: item.category || 'editorial',
          imageUrl: item.imageUrl || '',
          tags: item.tags || [],
          date: item.date || '',
          featured: item.featured || false
        })
        setErrors({})
        setShowDeleteConfirm(false)
      }
    }, [isOpen, item])

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
          const updatedItem = {
            ...formData,
            tags: formData.tags?.filter(tag => tag.trim() !== '') || []
          }
          
          await onSave(updatedItem)
          showSaveSuccess()
          onClose()
        } else {
          showValidationError()
        }
      } catch (error) {
        console.error('Error saving portfolio item:', error)
        showError('Възникна грешка при запазването. Моля, опитайте отново.')
      }
    }

    const handleDelete = async () => {
      try {
        if (onDelete && formData.id) {
          await onDelete(formData.id)
          showDeleteSuccess()
          setShowDeleteConfirm(false)
          onClose()
        }
      } catch (error) {
        console.error('Error deleting portfolio item:', error)
        showError('Възникна грешка при изтриването. Моля, опитайте отново.')
        setShowDeleteConfirm(false)
      }
    }

    const handleTagsChange = (value: string) => {
      const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      handleInputChange('tags', tags)
    }

    if (!item) return null

    return (
      <Modal
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        title="Редактирай снимка от портфолио"
        description="Променете информацията за снимката"
        size="lg"
      >
        <ModalBody>
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">
                Заглавие *
              </label>
              <Input
                id="edit-title"
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
              <label htmlFor="edit-description" className="text-sm font-medium">
                Описание *
              </label>
              <Textarea
                id="edit-description"
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
              <label htmlFor="edit-imageUrl" className="text-sm font-medium">
                URL на снимката *
              </label>
              <Input
                id="edit-imageUrl"
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
                <label htmlFor="edit-date" className="text-sm font-medium">
                  Година
                </label>
                <Input
                  id="edit-date"
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  placeholder="2024"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label htmlFor="edit-tags" className="text-sm font-medium">
                Тагове (разделени със запетая)
              </label>
              <Input
                id="edit-tags"
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="мода, портрет, студийна снимка"
              />
            </div>

            {/* Featured checkbox */}
            <div className="flex items-center space-x-2">
              <input
                id="edit-featured"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="edit-featured" className="text-sm font-medium">
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

            {/* Delete confirmation */}
            {showDeleteConfirm && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="font-medium">Потвърждение за изтриване</span>
                </div>
                <p className="text-red-700 text-sm mb-3">
                  Сигурни ли сте, че искате да изтриете тази снимка? Това действие не може да бъде отменено.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Отказ
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleDelete}
                  >
                    Изтрий
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex justify-between w-full">
            <div>
              {onDelete && !showDeleteConfirm && (
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                >
                  Изтрий
                </Button>
              )}
            </div>
            <div className="flex gap-3">
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
                {isLoading ? 'Запазване...' : 'Запази промените'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    )
  }
)
EditPortfolioModal.displayName = "EditPortfolioModal"

export { EditPortfolioModal }