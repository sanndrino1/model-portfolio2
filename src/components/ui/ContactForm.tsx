'use client'

import * as React from "react"
import { Button } from "./Button"
import { Input } from "./Input"
import { Textarea } from "./Textarea"
import { Card } from "./Card"
import { cn } from "@/lib/utils"

export interface ContactFormProps {
  className?: string
  onSubmit?: (data: FormData) => void
}

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const ContactForm = React.forwardRef<HTMLFormElement, ContactFormProps>(
  ({ className, onSubmit, ...props }, ref) => {
    const [formData, setFormData] = React.useState<FormData>({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      
      try {
        if (onSubmit) {
          await onSubmit(formData)
        }
        // Reset form on success
        setFormData({ name: '', email: '', subject: '', message: '' })
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <Card className={cn("p-6", className)}>
        <form ref={ref} onSubmit={handleSubmit} className="space-y-6" {...props}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Име *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Вашето име"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Имейл *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Тема
              </label>
              <Input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Тема на съобщението"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Съобщение *
              </label>
              <Textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Вашето съобщение..."
                rows={5}
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Изпращане...' : 'Изпрати съобщение'}
          </Button>
        </form>
      </Card>
    )
  }
)
ContactForm.displayName = "ContactForm"

export { ContactForm }