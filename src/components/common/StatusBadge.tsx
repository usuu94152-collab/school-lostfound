import type { ReactNode } from 'react'

type StatusBadgeProps = {
  children: ReactNode
  tone?: 'info' | 'warn' | 'success' | 'neutral'
}

const toneClassName = {
  info: 'bg-sky-100 text-ink-900',
  warn: 'bg-coral-100 text-coral-700',
  success: 'bg-mint-100 text-mint-700',
  neutral: 'bg-paper-200 text-ink-700',
}

export function StatusBadge({
  children,
  tone = 'neutral',
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClassName[tone]}`}
    >
      {children}
    </span>
  )
}
