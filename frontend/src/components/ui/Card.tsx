import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  compact?: boolean
  children: ReactNode
}

export function Card({
  title,
  description,
  compact = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <section
      className={cx(
        'rounded-2xl border border-stone-200 bg-white shadow-sm',
        compact ? 'p-5' : 'p-5 sm:p-7',
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <header className="mb-6">
          {title && (
            <h2 className="text-lg font-semibold tracking-tight text-stone-950">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm leading-6 text-stone-500">
              {description}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  )
}
