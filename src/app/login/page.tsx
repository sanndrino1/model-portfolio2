'use client'

import React from 'react'
import LoginForm from '@/components/auth/LoginForm'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Зареждане...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent-50">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-elegant font-semibold text-foreground mb-2">
              Model Portfolio
            </h1>
            <p className="text-muted-foreground">
              Административен достъп
            </p>
          </div>

          {/* Login Form */}
          <LoginForm 
            onSuccess={() => router.push('/admin')}
            className="w-full max-w-md"
          />

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Защитено с двустепенна автентификация (2FA)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}