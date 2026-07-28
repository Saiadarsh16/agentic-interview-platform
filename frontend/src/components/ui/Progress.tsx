export interface ProgressProps {
  value: number
  label?: string
}

export function Progress({ value, label = 'Progress' }: ProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value))

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-stone-700">{label}</span>
        <span className="tabular-nums text-stone-500">{safeValue}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-stone-200"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
      >
        <div
          className="h-full rounded-full bg-orange-700 transition-[width] duration-300"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  )
}
