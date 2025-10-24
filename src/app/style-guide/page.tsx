'use client'

import React from 'react'
import { Button, Card, Toast } from '@/components/ui'

export default function StyleGuide() {
  const [toastVisible, setToastVisible] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-background to-accent-50"></div>
        <div className="relative z-10 container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Дизайн Система
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-elegant font-light text-foreground mb-6 tracking-tight">
              Цветова <span className="font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Схема</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Изискана палитра, създадена за модерен модел портфолио с внимание към детайла
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </section>

      <div className="container mx-auto px-6 pb-24 space-y-24">
        
        {/* Color Palette */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-elegant font-medium mb-4 text-foreground">Цветова Палитра</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Хармонична комбинация от топли и хладни тонове
            </p>
          </div>
          
          {/* Primary Colors */}
          <div className="mb-16">
            <h3 className="text-xl font-medium mb-8 text-foreground">Primary Palette</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[100, 200, 300, 400, 500, 600].map((shade) => (
                <div key={shade} className="group">
                  <div className={`h-20 w-full bg-primary-${shade} rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-300 mb-3`}></div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{shade}</p>
                    <p className="text-xs text-muted-foreground font-mono">primary-{shade}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accent Colors */}
          <div className="mb-16">
            <h3 className="text-xl font-medium mb-8 text-foreground">Accent Palette</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[100, 200, 300, 400, 500, 600].map((shade) => (
                <div key={shade} className="group">
                  <div className={`h-20 w-full bg-accent-${shade} rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-300 mb-3`}></div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{shade}</p>
                    <p className="text-xs text-muted-foreground font-mono">accent-{shade}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Colors */}
          <div>
            <h3 className="text-xl font-medium mb-8 text-foreground">Status Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Success', color: 'success', label: 'Успех' },
                { name: 'Warning', color: 'warning', label: 'Внимание' },
                { name: 'Error', color: 'error', label: 'Грешка' },
                { name: 'Info', color: 'info', label: 'Информация' }
              ].map((item) => (
                <div key={item.name} className="group">
                  <div className={`h-24 w-full bg-${item.color} rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-300 mb-4 flex items-center justify-center`}>
                    <span className={`text-${item.color}-foreground font-medium`}>{item.label}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{item.color}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-elegant font-medium mb-4 text-foreground">Типография</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Елегантни шрифтове за професионално представяне
            </p>
          </div>
          
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft space-y-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h1 className="text-4xl md:text-5xl font-elegant font-light text-foreground mb-3 leading-tight">
                  Elegant Display
                </h1>
                <p className="text-sm text-muted-foreground font-mono bg-muted px-3 py-1 rounded inline-block">
                  font-elegant font-light
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl md:text-3xl font-elegant font-medium text-foreground mb-3">
                  Refined Headlines
                </h2>
                <p className="text-sm text-muted-foreground font-mono bg-muted px-3 py-1 rounded inline-block">
                  font-elegant font-medium
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg text-foreground mb-3 leading-relaxed">
                    Това е пример за основен текст, който използваме в цялото приложение за четим и приятен потребителски опит.
                  </p>
                  <p className="text-sm text-muted-foreground font-mono bg-muted px-3 py-1 rounded inline-block">
                    text-lg leading-relaxed
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    Този по-малък текст е идеален за допълнителна информация, описания и метаданни в интерфейса.
                  </p>
                  <p className="text-sm text-muted-foreground font-mono bg-muted px-3 py-1 rounded inline-block">
                    text-sm text-muted-foreground
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* UI Components */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-elegant font-medium mb-4 text-foreground">UI Компоненти</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Модерни интерактивни елементи с внимание към детайла
            </p>
          </div>
          
          <div className="space-y-16">
            {/* Buttons */}
            <div className="bg-card rounded-2xl p-8 shadow-soft">
              <h3 className="text-xl font-medium mb-8 text-foreground">Бутони</h3>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" size="lg" className="shadow-luxury">
                    Primary Action
                  </Button>
                  <Button variant="secondary" size="lg">
                    Secondary
                  </Button>
                  <Button variant="outline" size="lg">
                    Outline Style
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" size="md">
                    Medium Primary
                  </Button>
                  <Button variant="ghost" size="md">
                    Ghost Button
                  </Button>
                  <Button variant="primary" size="sm">
                    Small
                  </Button>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="bg-card rounded-2xl p-8 shadow-soft">
              <h3 className="text-xl font-medium mb-8 text-foreground">Карти</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card variant="default" className="p-6 group hover:shadow-elegant transition-all duration-300">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary rounded"></div>
                  </div>
                  <h4 className="text-lg font-medium mb-2 text-foreground">Default Card</h4>
                  <p className="text-muted-foreground text-sm">Стандартна карта с елегантни сенки и закръглени ъгли.</p>
                </Card>
                
                <Card variant="glass" className="p-6 group hover:shadow-elegant transition-all duration-300">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-accent rounded"></div>
                  </div>
                  <h4 className="text-lg font-medium mb-2 text-foreground">Glass Effect</h4>
                  <p className="text-muted-foreground text-sm">Модерен стъклен ефект с размазване на фона.</p>
                </Card>
                
                <Card variant="luxury" className="p-6 group hover:shadow-glow transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-luxury-gradient rounded"></div>
                  </div>
                  <h4 className="text-lg font-medium mb-2 text-foreground">Luxury Style</h4>
                  <p className="text-muted-foreground text-sm">Премиум дизайн със златисти акценти.</p>
                </Card>
              </div>
            </div>

            {/* Interactive Elements */}
            <div className="bg-card rounded-2xl p-8 shadow-soft">
              <h3 className="text-xl font-medium mb-8 text-foreground">Интерактивни Елементи</h3>
              
              <div className="space-y-8">
                {/* Toast Demo */}
                <div>
                  <h4 className="text-lg font-medium mb-4 text-foreground">Toast Съобщения</h4>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => setToastVisible(true)}
                    >
                      Покажи Toast
                    </Button>
                  </div>

                  {toastVisible && (
                    <Toast
                      type="success"
                      title="Успех!"
                      message="Модерният дизайн е зареден успешно!"
                      onClose={() => setToastVisible(false)}
                      className="mb-4"
                    />
                  )}
                </div>

                {/* Shadow Examples */}
                <div>
                  <h4 className="text-lg font-medium mb-4 text-foreground">Сенки и Ефекти</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background p-4 rounded-xl shadow-soft border border-border">
                      <div className="w-8 h-8 bg-primary rounded-lg mb-2"></div>
                      <p className="text-xs font-medium text-foreground">Soft</p>
                      <p className="text-xs text-muted-foreground font-mono">shadow-soft</p>
                    </div>
                    
                    <div className="bg-background p-4 rounded-xl shadow-elegant border border-border">
                      <div className="w-8 h-8 bg-accent rounded-lg mb-2"></div>
                      <p className="text-xs font-medium text-foreground">Elegant</p>
                      <p className="text-xs text-muted-foreground font-mono">shadow-elegant</p>
                    </div>
                    
                    <div className="bg-background p-4 rounded-xl shadow-luxury border border-border">
                      <div className="w-8 h-8 bg-luxury-gradient rounded-lg mb-2"></div>
                      <p className="text-xs font-medium text-foreground">Luxury</p>
                      <p className="text-xs text-muted-foreground font-mono">shadow-luxury</p>
                    </div>
                    
                    <div className="bg-background p-4 rounded-xl shadow-glow border border-border">
                      <div className="w-8 h-8 bg-primary rounded-lg mb-2"></div>
                      <p className="text-xs font-medium text-foreground">Glow</p>
                      <p className="text-xs text-muted-foreground font-mono">shadow-glow</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Design Principles */}
        <section className="bg-gradient-to-br from-primary-50 via-transparent to-accent-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-elegant font-medium mb-4 text-foreground">Дизайн Принципи</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Основните принципи, които водят нашия модерен и елегантен дизайн
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg"></div>
              </div>
              <h3 className="text-lg font-medium mb-2 text-foreground">Минимализъм</h3>
              <p className="text-sm text-muted-foreground">Чист и фокусиран дизайн без излишни елементи</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg"></div>
              </div>
              <h3 className="text-lg font-medium mb-2 text-foreground">Елегантност</h3>
              <p className="text-sm text-muted-foreground">Изискани детайли и луксозно усещане</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-luxury-gradient rounded-lg"></div>
              </div>
              <h3 className="text-lg font-medium mb-2 text-foreground">Функционалност</h3>
              <p className="text-sm text-muted-foreground">Всеки елемент служи на определена цел</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}