import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'
import { cx } from './utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  children: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-orange-700 bg-orange-700 text-white shadow-sm hover:border-orange-800 hover:bg-orange-800',
  secondary:
    'border-stone-900 bg-stone-900 text-white shadow-sm hover:border-stone-700 hover:bg-stone-700',
  outline:
    'border-stone-300 bg-white text-stone-800 shadow-sm hover:border-stone-400 hover:bg-stone-50',
  ghost:
    'border-transparent bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-950',
  danger:
    'border-red-700 bg-red-700 text-white shadow-sm hover:border-red-800 hover:bg-red-800',
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading && <Spinner size="small" />}
      {children}
    </button>
  )
}
