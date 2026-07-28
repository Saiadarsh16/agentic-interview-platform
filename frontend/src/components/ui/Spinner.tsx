import { cx } from './utils'

export interface SpinnerProps {
  size?: 'small' | 'medium'
  className?: string
}

export function Spinner({ size = 'medium', className }: SpinnerProps) {
  return (
    <span
      className={cx(
        'inline-block animate-spin rounded-full border-2 border-current border-r-transparent',
        size === 'small' ? 'size-4' : 'size-5',
        className,
      )}
      aria-hidden="true"
    />
  )
}
