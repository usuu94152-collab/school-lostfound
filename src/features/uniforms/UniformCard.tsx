import type { UniformItem } from '../../types/models'
import { formatDisplayDate } from '../../utils/date'
import { ItemImage } from '../../components/common/ItemImage'
import { StatusBadge } from '../../components/common/StatusBadge'

type UniformCardProps = {
  item: UniformItem
  isAdmin: boolean
  onOpen: () => void
  onDelete: () => void
}

export function UniformCard({
  item,
  isAdmin,
  onOpen,
  onDelete,
}: UniformCardProps) {
  const statusTone =
    item.condition === '매우 좋음'
      ? 'success'
      : item.condition === '좋음'
        ? 'info'
        : 'warn'

  return (
    <article
      className="group soft-card fade-rise overflow-hidden p-2 transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)] md:p-3"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <ItemImage
        src={item.imageUrl}
        alt={`${item.uniformType} ${item.size}`}
        label={`${item.uniformType} ${item.size}`}
        kind="uniform"
        className="aspect-[16/11] h-full md:aspect-[4/3]"
      />
      <div className="space-y-3 px-1 pb-1 pt-3 md:space-y-4 md:pb-2 md:pt-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone={statusTone}>{item.condition}</StatusBadge>
          <StatusBadge tone="info">{item.gender}</StatusBadge>
          <StatusBadge tone="neutral">수량 {item.quantity}</StatusBadge>
        </div>

        <div>
          <h3 className="text-base font-semibold text-ink-950 md:text-lg">{item.uniformType}</h3>
          <p className="mt-1 text-sm text-ink-700/80">
            사이즈 {item.size} · 등록일 {formatDisplayDate(item.registeredDate)}
          </p>
        </div>

        <div className="rounded-[18px] bg-paper-100/80 p-3 md:rounded-[20px] md:p-4">
          <p className="text-xs text-ink-700/65">보관 위치</p>
          <p className="mt-1 text-base font-semibold text-ink-950">
            {item.storageLocation}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onOpen()
            }}
            className="min-h-11 flex-1 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-700 md:py-3"
          >
            상세보기
          </button>
          {isAdmin ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onDelete()
              }}
              className="min-h-11 rounded-full border border-coral-500/40 px-4 py-2.5 text-sm font-semibold text-coral-700 transition hover:bg-coral-100 md:py-3"
            >
              삭제
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
