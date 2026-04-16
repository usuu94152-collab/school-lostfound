type ToastProps = {
  message: string
}

export function Toast({ message }: ToastProps) {
  return (
    <div className="fixed right-4 top-4 z-50 rounded-2xl bg-ink-950 px-4 py-3 text-sm font-medium text-white shadow-[var(--shadow-soft)]">
      {message}
    </div>
  )
}
