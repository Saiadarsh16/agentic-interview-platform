import { forwardRef, type InputHTMLAttributes } from 'react'
import { cx } from './utils'

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cx(
      'min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-xs',
      'placeholder:text-stone-400 hover:border-stone-400',
      'focus:border-orange-700 focus:outline-none focus:ring-3 focus:ring-orange-100',
      'disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500',
      'aria-invalid:border-red-600 aria-invalid:ring-red-100',
      className,
    )}
    {...props}
  />
))

Input.displayName = 'Input'
