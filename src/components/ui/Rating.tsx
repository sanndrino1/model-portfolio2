'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface RatingProps {
  value: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  showText?: boolean
  className?: string
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ 
    value, 
    onChange, 
    readonly = false, 
    size = 'md', 
    showValue = false,
    showText = false,
    className,
    ...props 
  }, ref) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)
    const [isHovering, setIsHovering] = React.useState(false)

    const sizes = {
      sm: 'w-4 h-4 text-sm',
      md: 'w-5 h-5 text-base',
      lg: 'w-6 h-6 text-lg'
    }

    const getRatingText = (rating: number): string => {
      if (rating >= 4.5) return 'Отличен'
      if (rating >= 4.0) return 'Много добър'
      if (rating >= 3.5) return 'Добър'
      if (rating >= 3.0) return 'Среден'
      if (rating >= 2.0) return 'Слаб'
      return 'Много слаб'
    }

    const getRatingColor = (rating: number): string => {
      if (rating >= 4.5) return 'text-green-500'
      if (rating >= 4.0) return 'text-green-400'
      if (rating >= 3.5) return 'text-yellow-400'
      if (rating >= 3.0) return 'text-yellow-500'
      if (rating >= 2.0) return 'text-orange-400'
      return 'text-red-400'
    }

    const handleClick = (rating: number) => {
      if (!readonly && onChange) {
        onChange(rating)
      }
    }

    const handleMouseEnter = (rating: number) => {
      if (!readonly) {
        setHoverValue(rating)
        setIsHovering(true)
      }
    }

    const handleMouseLeave = () => {
      if (!readonly) {
        setHoverValue(null)
        setIsHovering(false)
      }
    }

    const displayValue = isHovering && hoverValue !== null ? hoverValue : value
    const currentRating = Math.round(displayValue)

    return (
      <div 
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {/* Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= currentRating
            const isHalfFilled = !isFilled && star === Math.ceil(displayValue) && displayValue % 1 >= 0.5

            return (
              <button
                key={star}
                type="button"
                className={cn(
                  "transition-all duration-200 focus:outline-none",
                  sizes[size],
                  readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
                  isFilled || isHalfFilled 
                    ? "text-yellow-400 drop-shadow-sm" 
                    : "text-gray-300 hover:text-yellow-300"
                )}
                onClick={() => handleClick(star)}
                onMouseEnter={() => handleMouseEnter(star)}
                onMouseLeave={handleMouseLeave}
                disabled={readonly}
                aria-label={`Оцени с ${star} звезди`}
              >
                {isFilled ? (
                  <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : isHalfFilled ? (
                  <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
                    <defs>
                      <linearGradient id={`half-${star}`}>
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    <path fill={`url(#half-${star})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : (
                  <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
                    <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292zM10 4.576L9.17 7.178a3 3 0 01-2.85 2.07H3.857l2.242 1.628a3 3 0 011.093 3.354L6.02 16.848 8.82 15.22a3 3 0 013.36 0l2.8 1.628-1.172-3.618a3 3 0 011.093-3.354L16.143 9.248H13.68a3 3 0 01-2.85-2.07L10 4.576z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>

        {/* Rating Value */}
        {showValue && (
          <span className={cn(
            "font-medium text-sm",
            getRatingColor(displayValue)
          )}>
            {displayValue.toFixed(1)}
          </span>
        )}

        {/* Rating Text */}
        {showText && (
          <span className={cn(
            "text-sm text-muted-foreground",
            getRatingColor(displayValue)
          )}>
            {getRatingText(displayValue)}
          </span>
        )}
      </div>
    )
  }
)

Rating.displayName = "Rating"

// Компонент за показване само на рейтинг статистики
export interface RatingDisplayProps {
  rating: number
  count: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  showValue?: boolean
  showText?: boolean
  className?: string
}

export const RatingDisplay = React.forwardRef<HTMLDivElement, RatingDisplayProps>(
  ({ 
    rating, 
    count, 
    size = 'md', 
    showCount = true,
    showValue = true,
    showText = false,
    className,
    ...props 
  }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        <Rating 
          value={rating} 
          readonly 
          size={size}
          showValue={showValue}
          showText={showText}
        />
        {showCount && (
          <span className="text-sm text-muted-foreground">
            ({count} {count === 1 ? 'оценка' : 'оценки'})
          </span>
        )}
      </div>
    )
  }
)

RatingDisplay.displayName = "RatingDisplay"

export { Rating }