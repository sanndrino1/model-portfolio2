'use client'

import { useState } from 'react'
import { Card, PortfolioCard, StatsCard } from '@/components/ui/Card'
import { Tooltip } from '@/components/ui/Tooltip'
import { RoleDropdown } from '@/components/ui/RoleDropdown'
import { CategoryDropdown } from '@/components/ui/CategoryDropdown'
import { Dropdown } from '@/components/ui/Dropdown'
import { Modal } from '@/components/ui/Modal'
import { AddPortfolioModal } from '@/components/ui/AddPortfolioModal'
import { EditPortfolioModal } from '@/components/ui/EditPortfolioModal'
import { Button } from '@/components/ui/Button'
import type { PortfolioItem } from '@/components/ui/AddPortfolioModal'

export default function CardsDemo() {
  const [currentRole, setCurrentRole] = useState('visitor')
  const [currentCategory, setCurrentCategory] = useState('all')
  
  // Modal states
  const [showBasicModal, setShowBasicModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])

  const handleAddPortfolio = (item: PortfolioItem) => {
    setPortfolioItems(prev => [...prev, item])
    setShowAddModal(false)
    alert('Снимката беше добавена успешно!')
  }

  const handleEditPortfolio = (item: PortfolioItem) => {
    setPortfolioItems(prev => 
      prev.map(p => p.id === item.id ? item : p)
    )
    setShowEditModal(false)
    alert('Промените бяха запазени!')
  }

  const handleDeletePortfolio = (id: string) => {
    setPortfolioItems(prev => prev.filter(p => p.id !== id))
    setShowEditModal(false)
    alert('Снимката беше изтрита!')
  }

  const openEditModal = (item: PortfolioItem) => {
    setEditingItem(item)
    setShowEditModal(true)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">UI Компоненти Демо</h1>
        <p className="mt-2 text-muted-foreground">
          Интерактивни карти с tooltips, dropdown менюта и модални прозорци
        </p>
      </div>

      {/* Modal Demos */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Модални прозорци</h2>
        
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setShowBasicModal(true)}>
            Основен Modal
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            Добави в портфолио
          </Button>
          {portfolioItems.length > 0 && (
            <Button 
              variant="outline"
              onClick={() => openEditModal(portfolioItems[0])}
            >
              Редактирай първия елемент
            </Button>
          )}
        </div>

        {/* Portfolio Items Display */}
        {portfolioItems.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Добавени снимки ({portfolioItems.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolioItems.map((item) => (
                <div key={item.id} className="relative group">
                  <PortfolioCard
                    image={item.imageUrl}
                    title={item.title}
                    description={item.description}
                    category={item.category}
                    date={item.date}
                    onClick={() => openEditModal(item)}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditModal(item)
                      }}
                    >
                      ✏️
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Dropdown Menus */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Dropdown Менюта</h2>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Role Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Избери роля:</label>
            <RoleDropdown
              currentRole={currentRole}
              onRoleChange={setCurrentRole}
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Избери категория:</label>
            <CategoryDropdown
              currentCategory={currentCategory}
              onCategoryChange={setCurrentCategory}
            />
          </div>

          {/* Custom Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom dropdown:</label>
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-muted">
                  <span>Опции</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              }
              items={[
                { value: 'export', label: 'Експорт', icon: <span>📤</span> },
                { value: 'import', label: 'Импорт', icon: <span>📥</span> },
                { divider: true, value: '', label: '' },
                { value: 'settings', label: 'Настройки', icon: <span>⚙️</span> },
                { value: 'help', label: 'Помощ', icon: <span>❓</span> }
              ]}
              onSelect={(value) => alert(`Избрано: ${value}`)}
            />
          </div>
        </div>

        {/* Role-based content */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold">Съдържание според ролята:</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Текущата роля е: <strong>{currentRole}</strong> | 
            Избраната категория е: <strong>{currentCategory}</strong>
          </p>
          
          {currentRole === 'admin' && (
            <div className="mt-2 text-red-600">
              🔐 Администраторски панел достъпен
            </div>
          )}
          {currentRole === 'model' && (
            <div className="mt-2 text-blue-600">
              👤 Модел профил и портфолио управление
            </div>
          )}
          {currentRole === 'photographer' && (
            <div className="mt-2 text-green-600">
              📷 Фотографски инструменти и галерии
            </div>
          )}
          {currentRole === 'visitor' && (
            <div className="mt-2 text-gray-600">
              👁️ Преглед на публично съдържание
            </div>
          )}
        </div>
      </section>

      {/* Basic Cards with Tooltips */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Основни Cards с Tooltips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            variant="default" 
            tooltip="Обикновена карта с основен дизайн"
            className="p-6"
          >
            <h3 className="font-semibold">Default Card</h3>
            <p className="text-sm text-muted-foreground">Hover за tooltip</p>
          </Card>

          <Card 
            variant="elegant" 
            tooltip="Елегантна карта с по-изискан дизайн"
            tooltipPosition="bottom"
            className="p-6"
          >
            <h3 className="font-semibold">Elegant Card</h3>
            <p className="text-sm text-muted-foreground">Tooltip отдолу</p>
          </Card>

          <Card 
            variant="interactive" 
            tooltip="Интерактивна карта с hover ефекти"
            tooltipPosition="left"
            hover={true}
            clickable={true}
            className="p-6"
          >
            <h3 className="font-semibold">Interactive Card</h3>
            <p className="text-sm text-muted-foreground">Hover и click</p>
          </Card>
        </div>
      </section>

      {/* Portfolio Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Portfolio Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PortfolioCard
            image="/photos/portfolio-1.jpg"
            title="Fashion Editorial"
            description="Модна фотосесия за списание"
            category="Editorial"
            date="2024"
            onClick={() => alert('Clicked portfolio item!')}
          />
          <PortfolioCard
            image="/photos/portfolio-2.jpg"
            title="Commercial Campaign"
            description="Рекламна кампания за модна марка"
            category="Commercial"
            date="2024"
            onClick={() => alert('Clicked portfolio item!')}
          />
          <PortfolioCard
            image="/photos/portfolio-3.jpg"
            title="Runway Show"
            description="Модно дефиле на София Fashion Week"
            category="Runway"
            date="2024"
            onClick={() => alert('Clicked portfolio item!')}
          />
        </div>
      </section>

      {/* Stats Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Stats Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Проекти"
            value="45"
            change="+12% този месец"
            description="Общ брой завършени фотосесии и проекти"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          <StatsCard
            title="Клиенти"
            value="28"
            change="+5 нови"
            description="Брой уникални клиенти с които съм работила"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Награди"
            value="8"
            description="Получени награди и отличия в модната индустрия"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
          <StatsCard
            title="Години опит"
            value="5"
            description="Професионален опит в модната индустрия"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* Custom Tooltips */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Custom Tooltips</h2>
        <div className="flex flex-wrap gap-4">
          <Tooltip content="Tooltip отгоре" position="top">
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
              Hover - Top
            </button>
          </Tooltip>
          
          <Tooltip content="Tooltip отдолу" position="bottom">
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">
              Hover - Bottom
            </button>
          </Tooltip>
          
          <Tooltip content="Tooltip отляво" position="left">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Hover - Left
            </button>
          </Tooltip>
          
          <Tooltip content="Tooltip отдясно" position="right">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Hover - Right
            </button>
          </Tooltip>
        </div>
      </section>

      {/* Modal Components */}
      <Modal
        isOpen={showBasicModal}
        onClose={() => setShowBasicModal(false)}
        title="Основен Modal"
        description="Това е пример за основен modal прозорец"
      >
        <div className="space-y-4">
          <p>Този modal демонстрира основните възможности:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Keyboard navigation (ESC за затваряне)</li>
            <li>Focus trapping</li>
            <li>Click outside за затваряне</li>
            <li>Smooth анимации</li>
            <li>Accessibility поддръжка</li>
          </ul>
          <div className="flex justify-end">
            <Button onClick={() => setShowBasicModal(false)}>
              Затвори
            </Button>
          </div>
        </div>
      </Modal>

      <AddPortfolioModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddPortfolio}
      />

      <EditPortfolioModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditPortfolio}
        onDelete={handleDeletePortfolio}
        item={editingItem}
      />
    </div>
  );
}