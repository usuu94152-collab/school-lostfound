import type { ReactNode } from 'react'

type FieldShellProps = {
  label: string
  hint?: string
  htmlFor?: string
  required?: boolean
  children: ReactNode
}

export const controlClassName =
  'field-control min-h-12 text-left placeholder:text-ink-700/40'

export function FieldShell({
  label,
  hint,
  htmlFor,
  required,
  children,
}: FieldShellProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-2 text-sm font-semibold text-ink-900"
      >
        <span>{label}</span>
        {required ? (
          <span className="rounded-full bg-coral-100 px-2 py-0.5 text-[11px] font-bold text-coral-700">
            필수
          </span>
        ) : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-700/80">{hint}</p> : null}
    </div>
  )
}
