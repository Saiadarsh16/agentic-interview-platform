import type { ReactNode } from 'react'

export interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center">
      <div
        className="mx-auto flex size-10 items-center justify-center rounded-full bg-orange-50 text-orange-700"
        aria-hidden="true"
      >
        <span className="text-lg">✦</span>
      </div>
      <h2 className="mt-4 text-sm font-semibold text-stone-900">{title}</h2>
      <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-stone-500">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
