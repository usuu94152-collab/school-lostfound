import { useDeferredValue, useState } from 'react'
import { foundLocations, lostItemCategories } from '../../constants/options'
import { EmptyState } from '../../components/common/EmptyState'
import { FieldShell, controlClassName } from '../../components/common/FieldShell'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import type { LostItem } from '../../types/models'
import { isExpiredLostItem } from '../../utils/date'
import { LostItemCard } from './LostItemCard'

type LostItemsSearchViewProps = {
  items: LostItem[]
  isAdmin: boolean
  onOpenDetail: (item: LostItem) => void
  onRequestDelete: (item: LostItem) => void
}

export function LostItemsSearchView({
  items,
  isAdmin,
  onOpenDetail,
  onRequestDelete,
}: LostItemsSearchViewProps) {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('전체')
  const [locationFilter, setLocationFilter] = useState('전체')
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest')
  const deferredQuery = useDeferredValue(query)

  const visibleItems = items
    .filter((item) => {
      const keyword = deferredQuery.trim().toLowerCase()
      const matchesKeyword =
        !keyword ||
        item.itemName.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.storageLocation.toLowerCase().includes(keyword)

      const matchesCategory =
        categoryFilter === '전체' || item.category === categoryFilter
      const matchesLocation =
        locationFilter === '전체' || item.foundLocation === locationFilter

      return matchesKeyword && matchesCategory && matchesLocation
    })
    .sort((left, right) => {
      const leftValue = new Date(left.foundDate).valueOf()
      const rightValue = new Date(right.foundDate).valueOf()
      return sortOrder === 'latest' ? rightValue - leftValue : leftValue - rightValue
    })

  const expiredCount = visibleItems.filter((item) => isExpiredLostItem(item.foundDate)).length

  return (
    <div className="space-y-6">
      <SectionCard
        title="분실물 검색"
        description="이름, 종류, 장소로 분실물을 찾을 수 있습니다."
        aside={
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={expiredCount > 0 ? 'warn' : 'success'}>
              폐기 대상 {expiredCount}건
            </StatusBadge>
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_0.85fr_0.8fr]">
          <FieldShell label="키워드 검색" htmlFor="lost-search-query">
            <input
              id="lost-search-query"
              className={controlClassName}
              placeholder="물품명, 설명, 보관 위치 검색"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </FieldShell>

          <FieldShell label="물품 종류" htmlFor="lost-search-category">
            <select
              id="lost-search-category"
              className={controlClassName}
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="전체">전체</option>
              {lostItemCategories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell label="발견 장소" htmlFor="lost-search-location">
            <select
              id="lost-search-location"
              className={controlClassName}
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
            >
              <option value="전체">전체</option>
              {foundLocations.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell label="날짜 정렬" htmlFor="lost-search-sort">
            <select
              id="lost-search-sort"
              className={controlClassName}
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as 'latest' | 'oldest')
              }
            >
              <option value="latest">최신 발견일 순</option>
              <option value="oldest">오래된 발견일 순</option>
            </select>
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard
        title="검색 결과"
        aside={<StatusBadge tone="neutral">총 {visibleItems.length}건</StatusBadge>}
      >
        {visibleItems.length === 0 ? (
          <EmptyState
            title="조건에 맞는 분실물이 없습니다."
            description="검색어를 줄이거나 필터를 바꿔 다시 확인해 보세요."
          />
        ) : (
          <div className="shelf-grid">
            {visibleItems.map((item) => (
              <LostItemCard
                key={item.id}
                item={item}
                isAdmin={isAdmin}
                onOpen={() => onOpenDetail(item)}
                onDelete={() => onRequestDelete(item)}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
