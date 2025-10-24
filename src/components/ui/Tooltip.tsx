'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, position = 'top', delay = 300, className, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null)

    const showTooltip = () => {
      const id = setTimeout(() => {
        setIsVisible(true)
      }, delay)
      setTimeoutId(id)
    }

    const hideTooltip = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        setTimeoutId(null)
      }
      setIsVisible(false)
    }

    const positionClasses = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    }

    const arrowClasses = {
      top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
      left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
      right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900',
    }

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        {...props}
      >
        {children}
        {isVisible && (
          <div
            className={cn(
              'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap',
              'transition-all duration-200 ease-in-out',
              'tooltip-enter',
              positionClasses[position],
              className
            )}
          >
            {content}
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-0 h-0 border-4',
                arrowClasses[position]
              )}
            />
          </div>
        )}
      </div>
    )
  }
)
Tooltip.displayName = "Tooltip"

export { Tooltip }