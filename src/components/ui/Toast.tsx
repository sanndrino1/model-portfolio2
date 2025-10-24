'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id?: string
  type?: ToastType
  title?: string
  message: string
  duration?: number
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ 
    id,
    type = 'info',
    title,
    message,
    duration = 5000,
    onClose,
    action,
    className,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)
    const [isLeaving, setIsLeaving] = React.useState(false)

    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose()
        }, duration)

        return () => clearTimeout(timer)
      }
    }, [duration])

    const handleClose = () => {
      setIsLeaving(true)
      setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, 300) // Animation duration
    }

    const typeStyles = {
      success: {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-800',
        icon: (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      error: {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        icon: (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      warning: {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-800',
        icon: (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      },
      info: {
        bg: 'bg-blue-50 border-blue-200',
        text: 'text-blue-800',
        icon: (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      }
    }

    if (!isVisible) return null

    const styles = typeStyles[type]

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
          'transform transition-all duration-300 ease-out',
          styles.bg,
          styles.text,
          isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100',
          className
        )}
        style={{
          animation: isLeaving ? undefined : 'slideInRight 300ms ease-out'
        }}
        {...props}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          {styles.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-medium mb-1">
              {title}
            </h4>
          )}
          <p className="text-sm">
            {message}
          </p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
          aria-label="Затвори"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-current opacity-30"
              style={{
                animation: `shrink ${duration}ms linear`
              }}
            />
          </div>
        )}
      </div>
    )
  }
)
Toast.displayName = "Toast"

// Toast Container
export interface ToastContainerProps {
  toasts: ToastProps[]
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  className?: string
}

const ToastContainer = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  ({ toasts, position = 'top-right', className }, ref) => {
    const positionClasses = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col gap-2 w-full max-w-sm',
          positionClasses[position],
          className
        )}
      >
        {toasts.map((toast, index) => (
          <Toast key={toast.id || index} {...toast} />
        ))}
      </div>
    )
  }
)
ToastContainer.displayName = "ToastContainer"

export { Toast, ToastContainer }