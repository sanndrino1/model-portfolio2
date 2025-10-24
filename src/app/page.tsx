'use client'

import React from 'react'
import Image from "next/image"
import Link from "next/link"
import { Button } from '@/components/ui'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-background to-accent-50"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-16 sm:py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="mb-4">
                <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary text-xs sm:text-sm font-medium rounded-full mb-3">
                  Професионално Портфолио
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-elegant font-light text-foreground mb-4 sm:mb-6 tracking-tight leading-tight">
                Model
                <span className="block font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Portfolio
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Елегантно и модерно представяне на професионална работа с внимание към всеки детайл
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link href="/portfolio">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="shadow-luxury"
                  >
                    Разгледай Портфолио
                  </Button>
                </Link>
                
                <Link href="/contact">
                  <Button 
                    variant="outline" 
                    size="lg"
                  >
                    Свържи се с мен
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Image/Visual */}
            <div className="relative order-first lg:order-last">
              <div className="aspect-[4/5] sm:aspect-[3/4] bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl lg:rounded-2xl shadow-elegant overflow-hidden max-w-sm sm:max-w-md mx-auto lg:max-w-none">
                {/* Placeholder for hero image */}
                <div className="w-full h-full bg-gradient-to-br from-primary-200/50 to-accent-200/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 h-20 bg-primary-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 sm:w-10 h-10 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-primary font-medium text-sm sm:text-base">Hero Image</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-20 h-20 sm:w-32 h-32 bg-accent/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-24 h-24 sm:w-40 h-40 bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-elegant font-medium mb-3 sm:mb-4 text-foreground">
              Защо да изберете
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Професионално качество и модерен подход към всеки проект
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:shadow-luxury transition-all duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg sm:rounded-xl"></div>
              </div>
              <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3 text-foreground">Професионализъм</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Висока квалификация и професионален подход към всеки проект</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-luxury transition-all duration-300">
                <div className="w-10 h-10 bg-accent rounded-xl"></div>
              </div>
              <h3 className="text-xl font-medium mb-3 text-foreground">Креативност</h3>
              <p className="text-muted-foreground">Уникални и иновативни решения за всеки клиент</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-luxury transition-all duration-300">
                <div className="w-10 h-10 bg-luxury-gradient rounded-xl"></div>
              </div>
              <h3 className="text-xl font-medium mb-3 text-foreground">Качество</h3>
              <p className="text-muted-foreground">Внимание към детайла и стремеж към съвършенство</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-elegant font-medium mb-4 text-foreground">
              Последни Проекти
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Преглед на най-новите и интересни проекти от портфолиото
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl overflow-hidden mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <div className="w-full h-full bg-gradient-to-br from-primary-200/30 to-accent-200/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <div className="w-8 h-8 bg-primary rounded-full"></div>
                      </div>
                      <p className="text-primary font-medium text-sm">Проект {item}</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Проект {item}</h3>
                <p className="text-sm text-muted-foreground">Описание на проекта с кратка информация</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/portfolio">
              <Button 
                variant="outline" 
                size="lg"
              >
                Виж всички проекти
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 via-transparent to-accent-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-elegant font-medium mb-6 text-foreground">
              Готови за сътрудничество?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Свържете се с мен за дискусия на вашия следващ проект
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="shadow-luxury"
                >
                  Свържете се
                </Button>
              </Link>
              
              <Link href="/style-guide">
                <Button 
                  variant="secondary" 
                  size="lg"
                >
                  Дизайн Система
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
