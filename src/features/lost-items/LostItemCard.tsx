import type { LostItem } from '../../types/models'
import {
  formatDisplayDate,
  getLostItemExpiryLabel,
  isExpiredLostItem,
} from '../../utils/date'
import { ItemImage } from '../../components/common/ItemImage'
import { StatusBadge } from '../../components/common/StatusBadge'

type LostItemCardProps = {
  item: LostItem
  isAdmin: boolean
  onOpen: () => void
  onDelete: () => void
}

export function LostItemCard({
  item,
  isAdmin,
  onOpen,
  onDelete,
}: LostItemCardProps) {
  const expired = isExpiredLostItem(item.foundDate)

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
        alt={item.itemName}
        label={item.itemName}
        kind="lost"
        className="aspect-[16/11] h-full md:aspect-[4/3]"
      />
      <div className="space-y-3 px-1 pb-1 pt-3 md:space-y-4 md:pb-2 md:pt-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone={expired ? 'warn' : 'info'}>
            {getLostItemExpiryLabel(item.foundDate)}
          </StatusBadge>
          <StatusBadge tone="neutral">{item.category}</StatusBadge>
        </div>

        <div>
          <h3 className="text-base font-semibold text-ink-950 md:text-lg">{item.itemName}</h3>
          <p className="mt-1 text-sm text-ink-700/80">
            {item.foundLocation} · {formatDisplayDate(item.foundDate)}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-2 rounded-[18px] bg-paper-100/80 p-3 text-sm md:gap-3 md:rounded-[20px]">
          <div>
            <dt className="text-xs text-ink-700/65">보관 위치</dt>
            <dd className="mt-1 font-semibold text-ink-900">{item.storageLocation}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-700/65">등록자</dt>
            <dd className="mt-1 font-semibold text-ink-900">{item.reporterType}</dd>
          </div>
        </dl>

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
