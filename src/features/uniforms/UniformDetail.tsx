import type { UniformItem } from '../../types/models'
import { formatDisplayDate } from '../../utils/date'
import { ItemImage } from '../../components/common/ItemImage'
import { StatusBadge } from '../../components/common/StatusBadge'

type UniformDetailProps = {
  item: UniformItem
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

export function UniformDetail({
  item,
  isAdmin,
  onRequestDelete,
}: UniformDetailProps) {
  const statusTone =
    item.condition === '매우 좋음'
      ? 'success'
      : item.condition === '좋음'
        ? 'info'
        : 'warn'

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <ItemImage
          src={item.imageUrl}
          alt={`${item.uniformType} ${item.size}`}
          label={`${item.uniformType} ${item.size}`}
          kind="uniform"
          className="aspect-[4/3] min-h-72"
        />

        <div className="soft-card space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={statusTone}>{item.condition}</StatusBadge>
            <StatusBadge tone="info">{item.gender}</StatusBadge>
            <StatusBadge tone="neutral">사이즈 {item.size}</StatusBadge>
          </div>
          <div>
            <h4 className="text-2xl font-semibold text-ink-950">{item.uniformType}</h4>
            <p className="mt-2 text-sm text-ink-700/80">
              {item.note?.trim() || '비고가 없는 항목입니다.'}
            </p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <DetailRow label="성별 구분" value={item.gender} />
            <DetailRow label="사이즈" value={item.size} />
            <DetailRow label="상태" value={item.condition} />
            <DetailRow label="수량" value={`${item.quantity}벌`} />
            <DetailRow label="색상/특징" value={item.color?.trim() || '미입력'} />
            <DetailRow label="보관 위치" value={item.storageLocation} />
            <DetailRow label="등록일" value={formatDisplayDate(item.registeredDate)} />
            <DetailRow label="생성일" value={formatDisplayDate(item.createdAt)} />
          </dl>

          {isAdmin ? (
            <button
              type="button"
              onClick={onRequestDelete}
              className="w-full rounded-full bg-coral-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-coral-500"
            >
              학생이 수령해서 삭제하기
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
