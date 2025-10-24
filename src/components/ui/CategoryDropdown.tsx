'use client'

import * as React from "react"
import { Dropdown, DropdownItem } from "./Dropdown"
import { cn } from "@/lib/utils"

export type PortfolioCategory = 'all' | 'editorial' | 'commercial' | 'runway' | 'print' | 'beauty' | 'fashion' | 'lifestyle'

export interface CategoryDropdownProps {
  currentCategory: PortfolioCategory
  onCategoryChange: (category: PortfolioCategory) => void
  showAll?: boolean
  className?: string
  disabled?: boolean
}

const categoryItems: DropdownItem[] = [
  {
    value: 'all',
    label: 'Всички категории',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  { divider: true, value: '', label: '' },
  {
    value: 'editorial',
    label: 'Editorial',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    value: 'commercial',
    label: 'Commercial',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  },
  {
    value: 'runway',
    label: 'Runway',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z" />
      </svg>
    )
  },
  {
    value: 'print',
    label: 'Print',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
    )
  },
  { divider: true, value: '', label: '' },
  {
    value: 'beauty',
    label: 'Beauty',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    value: 'fashion',
    label: 'Fashion',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    value: 'lifestyle',
    label: 'Lifestyle',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
]

const getCategoryLabel = (category: PortfolioCategory): string => {
  const item = categoryItems.find(item => item.value === category)
  return item?.label || 'Неизвестна категория'
}

const getCategoryIcon = (category: PortfolioCategory): React.ReactNode => {
  const item = categoryItems.find(item => item.value === category)
  return item?.icon
}

const CategoryDropdown = React.forwardRef<HTMLDivElement, CategoryDropdownProps>(
  ({ currentCategory, onCategoryChange, showAll = true, className, disabled = false, ...props }, ref) => {
    const handleCategorySelect = (value: string) => {
      if (value && value !== currentCategory) {
        onCategoryChange(value as PortfolioCategory)
      }
    }

    // Filter items based on showAll prop
    const filteredItems = showAll 
      ? categoryItems 
      : categoryItems.filter(item => item.value !== 'all')

    const trigger = (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background',
          'hover:bg-muted transition-colors cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-ring min-w-[140px]',
          disabled && 'opacity-50 cursor-not-allowed hover:bg-background',
          className
        )}
      >
        <span className="w-4 h-4 flex-shrink-0">
          {getCategoryIcon(currentCategory)}
        </span>
        <span className="flex-1 text-sm font-medium">
          {getCategoryLabel(currentCategory)}
        </span>
        <svg 
          className="w-4 h-4 text-muted-foreground transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    )

    return (
      <Dropdown
        ref={ref}
        trigger={trigger}
        items={filteredItems}
        onSelect={handleCategorySelect}
        disabled={disabled}
        position="bottom-left"
        {...props}
      />
    )
  }
)
CategoryDropdown.displayName = "CategoryDropdown"

export { CategoryDropdown, getCategoryLabel, getCategoryIcon }