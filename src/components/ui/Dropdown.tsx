'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface DropdownItem {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  divider?: boolean
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  onSelect?: (value: string) => void
  placeholder?: string
  className?: string
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  disabled?: boolean
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ 
    trigger, 
    items, 
    onSelect, 
    className, 
    position = 'bottom-left',
    disabled = false,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [focusedIndex, setFocusedIndex] = React.useState(-1)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setFocusedIndex(-1)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
            setFocusedIndex(0)
          } else if (focusedIndex >= 0) {
            const item = items[focusedIndex]
            if (!item.disabled && onSelect) {
              onSelect(item.value)
              setIsOpen(false)
              setFocusedIndex(-1)
            }
          }
          break
        case 'Escape':
          setIsOpen(false)
          setFocusedIndex(-1)
          break
        case 'ArrowDown':
          event.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
            setFocusedIndex(0)
          } else {
            setFocusedIndex(prev => 
              prev < items.length - 1 ? prev + 1 : 0
            )
          }
          break
        case 'ArrowUp':
          event.preventDefault()
          if (isOpen) {
            setFocusedIndex(prev => 
              prev > 0 ? prev - 1 : items.length - 1
            )
          }
          break
      }
    }

    const handleItemClick = (item: DropdownItem) => {
      if (!item.disabled && onSelect) {
        onSelect(item.value)
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    const positionClasses = {
      'bottom-left': 'top-full left-0 mt-1',
      'bottom-right': 'top-full right-0 mt-1',
      'top-left': 'bottom-full left-0 mb-1',
      'top-right': 'bottom-full right-0 mb-1',
    }

    return (
      <div
        ref={dropdownRef}
        className={cn("relative inline-block", className)}
        {...props}
      >
        {/* Trigger */}
        <div
          className={cn(
            "cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          {trigger}
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={cn(
              'absolute z-50 min-w-48 bg-background border border-border rounded-lg shadow-lg py-1',
              'animate-in fade-in-0 zoom-in-95 duration-200',
              positionClasses[position]
            )}
            role="menu"
          >
            {items.map((item, index) => (
              <React.Fragment key={item.value}>
                {item.divider ? (
                  <div className="h-px bg-border my-1" />
                ) : (
                  <div
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors',
                      'hover:bg-muted focus:bg-muted',
                      item.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                      focusedIndex === index && 'bg-muted'
                    )}
                    onClick={() => handleItemClick(item)}
                    role="menuitem"
                    aria-disabled={item.disabled}
                  >
                    {item.icon && (
                      <span className="w-4 h-4 flex-shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    )
  }
)
Dropdown.displayName = "Dropdown"

export { Dropdown }