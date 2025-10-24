'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, Input } from "@/components/ui"
import { useAuth } from "@/contexts/AuthContext"
import { useToastActions } from "@/contexts/ToastContext"

interface LoginFormProps {
  className?: string
  onSuccess?: () => void
}

export function LoginForm({ className, onSuccess }: LoginFormProps) {
  const [email, setEmail] = React.useState('')
  const [code, setCode] = React.useState('')
  const [step, setStep] = React.useState<'email' | 'code'>('email')
  const [isLoading, setIsLoading] = React.useState(false)
  const [countdown, setCountdown] = React.useState(0)
  
  const { login } = useAuth()
  const { success, error, info } = useToastActions()

  // Countdown timer за resend код
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        success('Кодът е изпратен! Проверете email-а си.')
        setStep('code')
        setCountdown(60) // 1 минута преди да може да изпрати отново
      } else {
        error(data.error || 'Възникна грешка при изпращането на кода')
      }
    } catch (err) {
      error('Мрежова грешка. Моля опитайте отново.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (response.ok) {
        success('Успешно влязохте!')
        await login(data.user, data.token)
        onSuccess?.()
      } else {
        error(data.error || 'Невалиден код')
      }
    } catch (err) {
      error('Мрежова грешка. Моля опитайте отново.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        info('Новият код е изпратен!')
        setCountdown(60)
      } else {
        error(data.error || 'Възникна грешка')
      }
    } catch (err) {
      error('Мрежова грешка. Моля опитайте отново.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setStep('email')
    setCode('')
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="bg-card p-8 rounded-2xl shadow-elegant border">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-elegant font-semibold text-foreground mb-2">
            {step === 'email' ? 'Вход в системата' : 'Верификация'}
          </h2>
          <p className="text-muted-foreground">
            {step === 'email' 
              ? 'Въведете email адреса си за да получите код за достъп'
              : 'Въведете 6-цифрения код изпратен на вашия email'
            }
          </p>
        </div>

        {/* Email Step */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email адрес
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12"
              />
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Изпращане...
                </div>
              ) : (
                'Изпрати код'
              )}
            </Button>
          </form>
        )}

        {/* Code Step */}
        {step === 'code' && (
          <div className="space-y-6">
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-foreground mb-2">
                  Верификационен код
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={isLoading}
                  className="h-12 text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Кодът е изпратен на: <span className="font-medium">{email}</span>
                </p>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Верификация...
                  </div>
                ) : (
                  'Потвърди код'
                )}
              </Button>
            </form>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendCode}
                disabled={countdown > 0 || isLoading}
                className="text-sm"
              >
                {countdown > 0 
                  ? `Изпрати отново (${countdown}с)`
                  : 'Изпрати нов код'
                }
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                disabled={isLoading}
                className="text-sm"
              >
                ← Назад към email
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginForm