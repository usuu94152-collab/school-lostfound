import type { ReactNode } from 'react'

type SectionCardProps = {
  title: string
  description?: string
  aside?: ReactNode
  children: ReactNode
}

export function SectionCard({
  title,
  description,
  aside,
  children,
}: SectionCardProps) {
  return (
    <section className="surface-card p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-3 border-b border-ink-900/8 pb-3 md:mb-5 md:flex-row md:items-end md:justify-between md:pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-ink-950 md:text-[1.75rem]">
            {title}
          </h2>
          {description ? (
            <p className="max-w-3xl text-[13px] leading-5 text-ink-700/80 md:text-[15px]">
              {description}
            </p>
          ) : null}
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}
