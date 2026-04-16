type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="soft-card flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
      <h3 className="text-xl font-semibold text-ink-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-ink-700/80">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-950"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
