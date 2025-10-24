'use client'

import * as React from "react"
import { Dropdown, DropdownItem } from "./Dropdown"
import { cn } from "@/lib/utils"

export type UserRole = 'admin' | 'model' | 'photographer' | 'visitor'

export interface RoleDropdownProps {
  currentRole: UserRole
  onRoleChange: (role: UserRole) => void
  className?: string
  disabled?: boolean
}

const roleItems: DropdownItem[] = [
  {
    value: 'admin',
    label: 'Администратор',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
      </svg>
    )
  },
  {
    value: 'model',
    label: 'Модел',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    value: 'photographer',
    label: 'Фотограф',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  { divider: true, value: '', label: '' },
  {
    value: 'visitor',
    label: 'Посетител',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  }
]

const getRoleLabel = (role: UserRole): string => {
  const item = roleItems.find(item => item.value === role)
  return item?.label || 'Неизвестна роля'
}

const getRoleIcon = (role: UserRole): React.ReactNode => {
  const item = roleItems.find(item => item.value === role)
  return item?.icon
}

const RoleDropdown = React.forwardRef<HTMLDivElement, RoleDropdownProps>(
  ({ currentRole, onRoleChange, className, disabled = false, ...props }, ref) => {
    const handleRoleSelect = (value: string) => {
      if (value && value !== currentRole) {
        onRoleChange(value as UserRole)
      }
    }

    const trigger = (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background',
          'hover:bg-muted transition-colors cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-ring',
          disabled && 'opacity-50 cursor-not-allowed hover:bg-background',
          className
        )}
      >
        <span className="w-4 h-4 flex-shrink-0">
          {getRoleIcon(currentRole)}
        </span>
        <span className="flex-1 text-sm font-medium">
          {getRoleLabel(currentRole)}
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
        items={roleItems}
        onSelect={handleRoleSelect}
        disabled={disabled}
        {...props}
      />
    )
  }
)
RoleDropdown.displayName = "RoleDropdown"

export { RoleDropdown, getRoleLabel, getRoleIcon }