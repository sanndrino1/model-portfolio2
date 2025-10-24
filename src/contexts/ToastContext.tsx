'use client'

import * as React from "react"
import { ToastContainer, ToastProps, ToastType } from "@/components/ui/Toast"

interface ToastContextValue {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  success: (message: string, options?: Partial<ToastProps>) => string
  error: (message: string, options?: Partial<ToastProps>) => string
  warning: (message: string, options?: Partial<ToastProps>) => string
  info: (message: string, options?: Partial<ToastProps>) => string
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export interface ToastProviderProps {
  children: React.ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxToasts?: number
}

export function ToastProvider({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addToast = React.useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = generateId()
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: () => removeToast(id)
    }

    setToasts(currentToasts => {
      const updatedToasts = [...currentToasts, newToast]
      // Limit the number of toasts
      return updatedToasts.slice(-maxToasts)
    })

    return id
  }, [maxToasts])

  const removeToast = React.useCallback((id: string) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  // Helper methods for different toast types
  const success = React.useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({
      type: 'success',
      message,
      ...options
    })
  }, [addToast])

  const error = React.useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({
      type: 'error',
      message,
      duration: 7000, // Error messages stay longer
      ...options
    })
  }, [addToast])

  const warning = React.useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({
      type: 'warning',
      message,
      duration: 6000,
      ...options
    })
  }, [addToast])

  const info = React.useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({
      type: 'info',
      message,
      ...options
    })
  }, [addToast])

  const contextValue: ToastContextValue = React.useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info
  }), [toasts, addToast, removeToast, clearToasts, success, error, warning, info])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer 
        toasts={toasts} 
        position={position}
      />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Utility hook for common toast patterns
export function useToastActions() {
  const { success, error, warning, info } = useToast()

  // Common actions
  const showSaveSuccess = React.useCallback(() => 
    success('Промените са запазени успешно!'), [success])

  const showDeleteSuccess = React.useCallback(() => 
    success('Записът е изтрит успешно!'), [success])

  const showCreateSuccess = React.useCallback(() => 
    success('Новият запис е създаден успешно!'), [success])

  const showError = React.useCallback((message: string = 'Възникна грешка. Моля, опитайте отново.') => 
    error(message), [error])

  const showValidationError = React.useCallback(() => 
    warning('Моля, попълнете всички задължителни полета.'), [warning])

  const showNetworkError = React.useCallback(() => 
    error('Проблем с мрежата. Проверете интернет връзката.'), [error])

  const showUnsavedChanges = React.useCallback(() => 
    warning('Имате незапазени промени.'), [warning])

  return {
    showSaveSuccess,
    showDeleteSuccess, 
    showCreateSuccess,
    showError,
    showValidationError,
    showNetworkError,
    showUnsavedChanges,
    success,
    error,
    warning,
    info
  }
}