import { useDeferredValue, useState } from 'react'
import {
  uniformConditions,
  uniformGenders,
  uniformTypes,
} from '../../constants/options'
import { EmptyState } from '../../components/common/EmptyState'
import { FieldShell, controlClassName } from '../../components/common/FieldShell'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import type { UniformItem } from '../../types/models'
import { UniformCard } from './UniformCard'

type UniformSearchViewProps = {
  items: UniformItem[]
  isAdmin: boolean
  onOpenDetail: (item: UniformItem) => void
  onRequestDelete: (item: UniformItem) => void
}

export function UniformSearchView({
  items,
  isAdmin,
  onOpenDetail,
  onRequestDelete,
}: UniformSearchViewProps) {
  const [sizeQuery, setSizeQuery] = useState('')
  const [keywordQuery, setKeywordQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('전체')
  const [genderFilter, setGenderFilter] = useState('전체')
  const [conditionFilter, setConditionFilter] = useState('전체')
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest')
  const deferredSizeQuery = useDeferredValue(sizeQuery)
  const deferredKeywordQuery = useDeferredValue(keywordQuery)

  const visibleItems = items
    .filter((item) => {
      const sizeKeyword = deferredSizeQuery.trim().toLowerCase()
      const keyword = deferredKeywordQuery.trim().toLowerCase()

      const matchesSize = !sizeKeyword || item.size.toLowerCase().includes(sizeKeyword)
      const matchesKeyword =
        !keyword ||
        item.uniformType.toLowerCase().includes(keyword) ||
        item.color?.toLowerCase().includes(keyword) ||
        item.note?.toLowerCase().includes(keyword)
      const matchesType = typeFilter === '전체' || item.uniformType === typeFilter
      const matchesGender = genderFilter === '전체' || item.gender === genderFilter
      const matchesCondition =
        conditionFilter === '전체' || item.condition === conditionFilter

      return (
        matchesSize &&
        matchesKeyword &&
        matchesType &&
        matchesGender &&
        matchesCondition
      )
    })
    .sort((left, right) => {
      const leftValue = new Date(left.registeredDate).valueOf()
      const rightValue = new Date(right.registeredDate).valueOf()
      return sortOrder === 'latest' ? rightValue - leftValue : leftValue - rightValue
    })

  return (
    <div className="space-y-6">
      <SectionCard
        title="교복 검색"
        description="종류, 성별, 사이즈로 교복을 찾을 수 있습니다."
        aside={<StatusBadge tone="neutral">총 {visibleItems.length}건</StatusBadge>}
      >
        <div className="grid gap-3 xl:grid-cols-[1.2fr_1fr] xl:gap-4">
          <div className="rounded-[22px] border border-sky-200 bg-sky-100/75 p-4 md:rounded-[28px] md:p-5">
            <FieldShell
              label="사이즈 검색"
              htmlFor="uniform-search-size"
              hint="예: 95, 100, 허리 78"
            >
              <input
                id="uniform-search-size"
                className={`${controlClassName} border-sky-200 bg-white text-lg font-semibold`}
                placeholder="필요한 사이즈를 입력해 보세요"
                value={sizeQuery}
                onChange={(event) => setSizeQuery(event.target.value)}
              />
            </FieldShell>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
            <FieldShell label="키워드" htmlFor="uniform-search-keyword">
              <input
                id="uniform-search-keyword"
                className={controlClassName}
                placeholder="종류, 색상, 특징 검색"
                value={keywordQuery}
                onChange={(event) => setKeywordQuery(event.target.value)}
              />
            </FieldShell>

            <FieldShell label="종류" htmlFor="uniform-search-type">
              <select
                id="uniform-search-type"
                className={controlClassName}
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
              >
                <option value="전체">전체</option>
                {uniformTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell label="성별" htmlFor="uniform-search-gender">
              <select
                id="uniform-search-gender"
                className={controlClassName}
                value={genderFilter}
                onChange={(event) => setGenderFilter(event.target.value)}
              >
                <option value="전체">전체</option>
                {uniformGenders.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell label="상태" htmlFor="uniform-search-condition">
              <select
                id="uniform-search-condition"
                className={controlClassName}
                value={conditionFilter}
                onChange={(event) => setConditionFilter(event.target.value)}
              >
                <option value="전체">전체</option>
                {uniformConditions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FieldShell>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <div className="w-full md:w-64">
            <FieldShell label="날짜 정렬" htmlFor="uniform-search-sort">
              <select
                id="uniform-search-sort"
                className={controlClassName}
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as 'latest' | 'oldest')
                }
              >
                <option value="latest">최신 등록일 순</option>
                <option value="oldest">오래된 등록일 순</option>
              </select>
            </FieldShell>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="검색 결과">
        {visibleItems.length === 0 ? (
          <EmptyState
            title="조건에 맞는 교복이 없습니다."
            description="사이즈나 필터를 바꿔 다시 확인해 보세요."
          />
        ) : (
          <div className="shelf-grid">
            {visibleItems.map((item) => (
              <UniformCard
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
