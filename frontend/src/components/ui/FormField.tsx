import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'

export interface FormFieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactElement
}

export function FormField({
  id,
  label,
  hint,
  error,
  required = false,
  children,
}: FormFieldProps) {
  const descriptionId = hint || error ? `${id}-description` : undefined
  const child = isValidElement(children)
    ? cloneElement(children, {
        'aria-describedby': descriptionId,
        'aria-invalid': error ? true : undefined,
      } as Record<string, unknown>)
    : children

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-stone-800"
      >
        {label}
        {required && (
          <span className="ml-1 text-orange-700" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {child as ReactNode}
      {(error || hint) && (
        <p
          id={descriptionId}
          className={`mt-1.5 text-xs ${error ? 'text-red-700' : 'text-stone-500'}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
