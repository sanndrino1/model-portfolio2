import React, { HTMLAttributes, forwardRef, memo } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip } from './Tooltip';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'photo' | 'elegant' | 'glass' | 'interactive' | 'luxury';
  children: React.ReactNode;
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  hover?: boolean;
  clickable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    children, 
    tooltip, 
    tooltipPosition = 'top',
    hover = false,
    clickable = false,
    ...props 
  }, ref) => {
    const variants = {
      default: 'rounded-xl border border-border bg-background shadow-soft',
      photo: 'relative overflow-hidden rounded-xl shadow-photo transition-all duration-300 hover:shadow-elegant hover:scale-105',
      elegant: 'rounded-2xl border border-border/50 bg-background shadow-elegant backdrop-blur-sm',
      glass: 'rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-soft',
      interactive: 'rounded-xl border border-border bg-background shadow-soft transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary-300',
      luxury: 'rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-background to-primary-50 shadow-luxury transition-all duration-300 hover:shadow-glow hover:border-primary-300',
    };

    const cardClasses = cn(
      variants[variant],
      {
        'cursor-pointer': clickable,
        'transform transition-transform duration-300 hover:scale-[1.02]': hover,
      },
      className
    );

    const CardComponent = (
      <div
        ref={ref}
        className={cardClasses}
        {...props}
      >
        {children}
      </div>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip} position={tooltipPosition}>
          {CardComponent}
        </Tooltip>
      );
    }

    return CardComponent;
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

// Portfolio Card with built-in tooltip functionality
export interface PortfolioCardProps extends HTMLAttributes<HTMLDivElement> {
  image: string;
  title: string;
  description: string;
  category: string;
  date?: string;
  onClick?: () => void;
}

const PortfolioCard = forwardRef<HTMLDivElement, PortfolioCardProps>(
  ({ className, image, title, description, category, date, onClick, ...props }, ref) => {
    return (
      <Tooltip 
        content={`${category} - ${description}${date ? ` (${date})` : ''}`}
        position="top"
      >
        <div
          ref={ref}
          className={cn(
            'group relative overflow-hidden rounded-xl bg-background shadow-photo transition-all duration-300',
            'hover:shadow-elegant hover:scale-105 cursor-pointer',
            className
          )}
          onClick={onClick}
          {...props}
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-200">{category}</p>
            </div>
          </div>
        </div>
      </Tooltip>
    );
  }
);
PortfolioCard.displayName = 'PortfolioCard';

// Stats Card with tooltip
export interface StatsCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  description?: string;
}

const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, change, icon, description, ...props }, ref) => {
    const tooltipContent = description || `${title}: ${value}${change ? ` (${change})` : ''}`;
    
    return (
      <Tooltip content={tooltipContent} position="top">
        <div
          ref={ref}
          className={cn(
            'rounded-xl border border-border bg-background p-6 shadow-soft transition-all duration-300',
            'hover:shadow-md hover:-translate-y-1 hover:border-primary-300',
            className
          )}
          {...props}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {change && (
                <p className="text-sm text-green-600">{change}</p>
              )}
            </div>
            {icon && (
              <div className="h-8 w-8 text-muted-foreground">
                {icon}
              </div>
            )}
          </div>
        </div>
      </Tooltip>
    );
  }
);
StatsCard.displayName = 'StatsCard';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, PortfolioCard, StatsCard };