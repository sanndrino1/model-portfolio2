'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState, lazy, Suspense } from 'react'
import { Card, Button } from '@/components/ui'

// Lazy load тежките компоненти
const AdminTools = lazy(() => import('@/components/admin/AdminTools').then(m => ({ default: m.AdminTools })))
const ContentManager = lazy(() => import('@/components/admin/ContentManager').then(m => ({ default: m.ContentManager })))
const SettingsManager = lazy(() => import('@/components/admin/SettingsManager').then(m => ({ default: m.SettingsManager })))
const ActivityTracker = lazy(() => import('@/components/admin/ActivityTracker').then(m => ({ default: m.ActivityTracker })))
const SuggestionsManager = lazy(() => import('@/components/admin/SuggestionsManager').then(m => ({ default: m.SuggestionsManager })))
const PhotoManager = lazy(() => import('@/components/admin/PhotoManager').then(m => ({ default: m.PhotoManager })))

type AdminView = 'dashboard' | 'tools' | 'content' | 'photos' | 'settings' | 'activity'

export default function AdminPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-2 text-muted-foreground">Зареждане...</span>
    </div>
  )

  const renderView = () => {
    switch (currentView) {
      case 'tools':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminTools />
          </Suspense>
        )
      case 'content':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ContentManager />
          </Suspense>
        )
      case 'photos':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PhotoManager />
          </Suspense>
        )
      case 'settings':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsManager />
          </Suspense>
        )
      case 'activity':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ActivityTracker />
          </Suspense>
        )
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-elegant font-semibold text-foreground mb-2">
            Административен панел
          </h1>
          <p className="text-muted-foreground">
            Добре дошли, {user?.email}
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="text-sm text-muted-foreground">
            Последен достъп: {new Date().toLocaleDateString('bg-BG')}
          </div>
          <Button variant="outline" onClick={logout}>
            Изход
          </Button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-muted/30 rounded-lg w-fit">
        <Button
          variant={currentView === 'dashboard' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setCurrentView('dashboard')}
        >
          📊 Табло
        </Button>
        <Button
          variant={currentView === 'tools' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setCurrentView('tools')}
        >
          🛠️ UI Инструменти
        </Button>
        <Button
          variant={currentView === 'content' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setCurrentView('content')}
        >
          📝 Съдържание
        </Button>
        <Button
          variant={currentView === 'photos' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setCurrentView('photos')}
        >
          📷 Снимки
        </Button>
        <Button
          variant={currentView === 'settings' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setCurrentView('settings')}
        >
          ⚙️ Настройки
        </Button>
        <Button
          variant={currentView === 'activity' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setCurrentView('activity')}
        >
          📋 Активност
        </Button>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* UI Tools Management */}
        <Card 
          variant="default" 
          className="p-6 hover:shadow-elegant transition-shadow cursor-pointer group"
          onClick={() => setCurrentView('tools')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="text-primary text-xl">🛠️</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                UI Инструменти
              </h3>
              <p className="text-sm text-muted-foreground">Управление на компоненти</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Преглед и документация на всички UI компоненти в системата
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">8 компонента</span>
            <Button variant="outline" size="sm">
              Отвори →
            </Button>
          </div>
        </Card>

        {/* Portfolio Management */}
        <Card variant="default" className="p-6 hover:shadow-elegant transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <span className="text-secondary text-xl">🖼️</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Портфолио</h3>
              <p className="text-sm text-muted-foreground">Управление на галерии</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Добавяне, редактиране и организиране на снимки и галерии
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">24 снимки</span>
            <Button variant="outline" size="sm">
              Управление
            </Button>
          </div>
        </Card>

        {/* Content Management */}
        <Card 
          variant="default" 
          className="p-6 hover:shadow-elegant transition-shadow cursor-pointer group"
          onClick={() => setCurrentView('content')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <span className="text-accent text-xl">📝</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Съдържание
              </h3>
              <p className="text-sm text-muted-foreground">Редактиране на страници</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Редактиране на текстове, снимки и съдържание на сайта
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">5 страници</span>
            <Button variant="outline" size="sm">
              Отвори →
            </Button>
          </div>
        </Card>

        {/* Settings */}
        <Card 
          variant="default" 
          className="p-6 hover:shadow-elegant transition-shadow cursor-pointer group"
          onClick={() => setCurrentView('settings')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-muted/20 rounded-lg flex items-center justify-center group-hover:bg-muted/30 transition-colors">
              <span className="text-muted-foreground text-xl">⚙️</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
                Настройки
              </h3>
              <p className="text-sm text-muted-foreground">Конфигуриране на сайта</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Основни настройки, SEO, сигурност и персонализация
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">18 настройки</span>
            <Button variant="outline" size="sm">
              Отвори →
            </Button>
          </div>
        </Card>

        {/* Analytics */}
        <Card variant="default" className="p-6 hover:shadow-elegant transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <span className="text-success text-xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Аналитика</h3>
              <p className="text-sm text-muted-foreground">Статистики и отчети</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Преглед на посещения, популярни страници и взаимодействия
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">1.2K посещения</span>
            <Button variant="outline" size="sm">
              Преглед
            </Button>
          </div>
        </Card>

        {/* Security */}
        <Card variant="default" className="p-6 hover:shadow-elegant transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <span className="text-error text-xl">🔒</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Сигурност</h3>
              <p className="text-sm text-muted-foreground">Логове и сигурност</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Преглед на опити за достъп, сесии и логове за сигурност
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Активна 2FA</span>
            <Button variant="outline" size="sm">
              Логове
            </Button>
          </div>
        </Card>

        {/* Activity Tracker */}
        <Card 
          variant="default" 
          className="p-6 hover:shadow-elegant transition-shadow cursor-pointer group"
          onClick={() => setCurrentView('activity')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center group-hover:bg-warning/20 transition-colors">
              <span className="text-warning text-xl">📋</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-warning transition-colors">
                Активност
              </h3>
              <p className="text-sm text-muted-foreground">Одит логове</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Проследяване на потребителска активност и одит логове
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Одит система</span>
            <Button variant="outline" size="sm">
              Отвори →
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="bg-card/50 backdrop-blur-sm border border-muted rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">24</div>
          <div className="text-sm text-muted-foreground">Общо снимки</div>
          <div className="text-xs text-success mt-1">↗ +3 този месец</div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-muted rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">5</div>
          <div className="text-sm text-muted-foreground">Галерии</div>
          <div className="text-xs text-success mt-1">↗ +1 този месец</div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-muted rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">1,234</div>
          <div className="text-sm text-muted-foreground">Посещения</div>
          <div className="text-xs text-success mt-1">↗ +15% този месец</div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-muted rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">12</div>
          <div className="text-sm text-muted-foreground">Запитвания</div>
          <div className="text-xs text-warning mt-1">→ = спрямо миналия месец</div>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back button for non-dashboard views */}
        {currentView !== 'dashboard' && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('dashboard')}
              className="group"
            >
              ← Назад към таблото
            </Button>
          </div>
        )}

        {renderView()}
      </div>
    </div>
  )
}
