import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Button } from './Button'
import { cx } from './utils'

export interface FileUploadProps {
  id: string
  label: string
  description?: string
  accept?: string
  file: File | null
  onFileChange: (file: File | null) => void
  disabled?: boolean
}

export function FileUpload({
  id,
  label,
  description,
  accept,
  file,
  onFileChange,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files?.[0] ?? null)
  }

  const dropFile = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (!disabled) onFileChange(event.dataTransfer.files?.[0] ?? null)
  }

  return (
    <div
      className={cx(
        'rounded-xl border border-dashed p-4 transition-colors',
        isDragging
          ? 'border-orange-600 bg-orange-50'
          : 'border-stone-300 bg-stone-50/70',
        disabled && 'cursor-not-allowed opacity-50',
      )}
      onDragEnter={(event) => {
        event.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setIsDragging(false)}
      onDrop={dropFile}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={selectFile}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <label htmlFor={id} className="text-sm font-semibold text-stone-800">
            {label}
          </label>
          <p className="mt-1 truncate text-xs text-stone-500">
            {file ? file.name : description}
          </p>
        </div>
        {file ? (
          <Button
            variant="ghost"
            className="min-h-8 shrink-0 px-2 py-1 text-xs"
            onClick={() => onFileChange(null)}
          >
            Remove
          </Button>
        ) : (
          <Button
            variant="outline"
            className="min-h-8 shrink-0 px-3 py-1 text-xs"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            Browse
          </Button>
        )}
      </div>
    </div>
  )
}
