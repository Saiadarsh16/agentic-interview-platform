import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cx } from './utils'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cx(
      'w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-xs',
      'placeholder:text-stone-400 hover:border-stone-400',
      'focus:border-orange-700 focus:outline-none focus:ring-3 focus:ring-orange-100',
      'disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500',
      'aria-invalid:border-red-600 aria-invalid:ring-red-100',
      className,
    )}
    {...props}
  />
))

Textarea.displayName = 'Textarea'
