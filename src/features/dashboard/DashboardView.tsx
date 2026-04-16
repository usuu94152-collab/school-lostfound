import type { AppView } from '../../types/models'

type DashboardViewProps = {
  onNavigate: (view: AppView) => void
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  return (
    <section className="surface-card hero-glow mx-auto w-full max-w-[620px] overflow-hidden p-5 sm:p-7 md:p-8">
      <div className="mx-auto text-center">
        <h2 className="text-3xl font-semibold leading-tight text-ink-950 sm:text-4xl md:text-[2.6rem] md:leading-[1.12]">
          무엇을 찾고 있나요?
        </h2>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
        <button
          type="button"
          onClick={() => onNavigate('lost-search')}
          className="min-h-20 rounded-[28px] border border-ink-900/10 bg-white px-5 py-5 text-center text-lg font-semibold text-ink-950 shadow-[0_18px_42px_rgba(16,37,59,0.14)] transition hover:-translate-y-0.5 hover:bg-paper-50 hover:shadow-[0_22px_48px_rgba(16,37,59,0.18)] focus:outline-none focus:ring-4 focus:ring-ink-900/10"
        >
          분실물 찾기
        </button>

        <button
          type="button"
          onClick={() => onNavigate('uniform-search')}
          className="min-h-20 rounded-[28px] border border-ink-900/10 bg-white px-5 py-5 text-center text-lg font-semibold text-ink-950 shadow-[0_18px_42px_rgba(16,37,59,0.14)] transition hover:-translate-y-0.5 hover:bg-paper-50 hover:shadow-[0_22px_48px_rgba(16,37,59,0.18)] focus:outline-none focus:ring-4 focus:ring-ink-900/10"
        >
          교복 찾기
        </button>
      </div>
    </section>
  )
}
