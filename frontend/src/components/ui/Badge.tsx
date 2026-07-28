import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './utils'

type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger'

const variants: Record<BadgeVariant, string> = {
  neutral: 'bg-stone-100 text-stone-700 ring-stone-200',
  accent: 'bg-orange-50 text-orange-800 ring-orange-200',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-red-50 text-red-800 ring-red-200',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: ReactNode
}

export function Badge({
  variant = 'neutral',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
