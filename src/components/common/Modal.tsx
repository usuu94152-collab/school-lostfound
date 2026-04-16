import { useEffect } from 'react'
import type { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  title: string
  description?: string
  maxWidthClassName?: string
  footer?: ReactNode
  onClose: () => void
  children: ReactNode
}

export function Modal({
  open,
  title,
  description,
  maxWidthClassName = 'max-w-4xl',
  footer,
  onClose,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/45 p-2 backdrop-blur-sm sm:items-center sm:p-6">
      <div
        className={`surface-card fade-rise flex max-h-[94dvh] w-full flex-col overflow-hidden sm:max-h-[92vh] ${maxWidthClassName}`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-ink-900/8 px-4 py-3 md:gap-4 md:px-6 md:py-4">
          <div>
            <h3 className="text-xl font-semibold text-ink-950">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-ink-700/75">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-ink-900/10 bg-white px-3 py-2 text-xs font-semibold text-ink-700 transition hover:border-ink-900/20 hover:bg-paper-100"
          >
            닫기
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-4 md:px-6 md:py-5">{children}</div>
        {footer ? (
          <div className="border-t border-ink-900/8 px-4 py-3 md:px-6 md:py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  )
}
