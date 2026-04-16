import type { LostItem } from '../../types/models'
import {
  formatDisplayDate,
  getLostItemExpiryDate,
  getLostItemExpiryLabel,
} from '../../utils/date'
import { ItemImage } from '../../components/common/ItemImage'
import { StatusBadge } from '../../components/common/StatusBadge'

type LostItemDetailProps = {
  item: LostItem
  isAdmin: boolean
  onRequestDelete: () => void
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-paper-100/80 p-4">
      <dt className="text-xs font-semibold tracking-[0.16em] text-ink-700/55 uppercase">
        {label}
      </dt>
      <dd className="mt-2 text-sm text-ink-900">{value}</dd>
    </div>
  )
}

export function LostItemDetail({
  item,
  isAdmin,
  onRequestDelete,
}: LostItemDetailProps) {
  const expiryLabel = getLostItemExpiryLabel(item.foundDate)

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <ItemImage
          src={item.imageUrl}
          alt={item.itemName}
          label={item.itemName}
          kind="lost"
          className="aspect-[4/3] min-h-72"
        />

        <div className="soft-card space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={expiryLabel === '폐기 대상' ? 'warn' : 'info'}>
              {expiryLabel}
            </StatusBadge>
            <StatusBadge tone="neutral">{item.category}</StatusBadge>
            <StatusBadge tone="success">{item.storageLocation}</StatusBadge>
          </div>
          <div>
            <h4 className="text-2xl font-semibold text-ink-950">{item.itemName}</h4>
            <p className="mt-2 text-sm text-ink-700/80">{item.description}</p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <DetailRow label="발견 날짜" value={formatDisplayDate(item.foundDate)} />
            <DetailRow label="발견 장소" value={item.foundLocation} />
            <DetailRow label="보관 위치" value={item.storageLocation} />
            <DetailRow label="등록자 구분" value={item.reporterType} />
            <DetailRow label="등록일" value={formatDisplayDate(item.createdAt)} />
            <DetailRow
              label="폐기 기준 날짜"
              value={formatDisplayDate(getLostItemExpiryDate(item.foundDate))}
            />
          </dl>

          {isAdmin ? (
            <button
              type="button"
              onClick={onRequestDelete}
              className="w-full rounded-full bg-coral-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-coral-500"
            >
              학생이 찾아가서 삭제하기
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
