import { useState } from 'react'
import {
  foundLocations,
  lostItemCategories,
  reporterTypes,
  storageLocations,
} from '../../constants/options'
import type { CreateLostItemInput } from '../../types/models'
import { getTodayInputValue } from '../../utils/date'
import { FieldShell, controlClassName } from '../../components/common/FieldShell'
import { ImageUploadField } from '../../components/common/ImageUploadField'
import { SectionCard } from '../../components/common/SectionCard'

type LostItemFormViewProps = {
  onSubmit: (input: CreateLostItemInput) => Promise<void>
  onNavigateToSearch: () => void
}

const initialFormState = (): CreateLostItemInput => ({
  itemName: '',
  category: '의류',
  foundDate: getTodayInputValue(),
  foundLocation: '교실',
  description: '',
  imageUrl: undefined,
  storageLocation: '학생부실',
  reporterType: '학생',
})

export function LostItemFormView({
  onSubmit,
  onNavigateToSearch,
}: LostItemFormViewProps) {
  const [form, setForm] = useState<CreateLostItemInput>(initialFormState)
  const [error, setError] = useState<string | null>(null)
  const [successName, setSuccessName] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.itemName.trim()) {
      setError('물품명을 입력해 주세요.')
      return
    }

    if (!form.description.trim()) {
      setError('상세 설명을 입력해 주세요.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit({
        ...form,
        itemName: form.itemName.trim(),
        description: form.description.trim(),
      })
      setSuccessName(form.itemName.trim())
      setForm(initialFormState())
    } catch {
      setError('분실물 등록 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="분실물 등록"
        description="발견한 분실물 정보를 입력해 주세요."
      >
        <div className="rounded-[24px] bg-paper-100/85 p-4 text-sm text-ink-700/85">
          사진, 발견 장소, 보관 위치를 함께 입력하면 학생이 더 쉽게 찾을 수 있습니다.
        </div>
      </SectionCard>

      <SectionCard
        title="등록 정보 입력"
        description="필수 항목을 입력한 뒤 등록해 주세요."
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-2">
            <FieldShell label="물품명" htmlFor="lost-item-name" required>
              <input
                id="lost-item-name"
                className={controlClassName}
                placeholder="예: 블루투스 이어폰"
                value={form.itemName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    itemName: event.target.value,
                  }))
                }
              />
            </FieldShell>

            <FieldShell label="물품 종류" htmlFor="lost-item-category" required>
              <select
                id="lost-item-category"
                className={controlClassName}
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value as CreateLostItemInput['category'],
                  }))
                }
              >
                {lostItemCategories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell label="발견 날짜" htmlFor="lost-item-date" required>
              <input
                id="lost-item-date"
                type="date"
                className={controlClassName}
                value={form.foundDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    foundDate: event.target.value,
                  }))
                }
              />
            </FieldShell>

            <FieldShell label="발견 장소" htmlFor="lost-item-location" required>
              <select
                id="lost-item-location"
                className={controlClassName}
                value={form.foundLocation}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    foundLocation: event.target.value as CreateLostItemInput['foundLocation'],
                  }))
                }
              >
                {foundLocations.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell label="보관 위치" htmlFor="lost-item-storage" required>
              <select
                id="lost-item-storage"
                className={controlClassName}
                value={form.storageLocation}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    storageLocation: event.target.value as CreateLostItemInput['storageLocation'],
                  }))
                }
              >
                {storageLocations.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell label="등록자 구분" htmlFor="lost-item-reporter" required>
              <select
                id="lost-item-reporter"
                className={controlClassName}
                value={form.reporterType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    reporterType: event.target.value as CreateLostItemInput['reporterType'],
                  }))
                }
              >
                {reporterTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FieldShell>
          </div>

          <FieldShell
            label="상세 설명"
            htmlFor="lost-item-description"
            hint="브랜드, 색상, 특징, 이름표 여부 등을 적어 주세요."
            required
          >
            <textarea
              id="lost-item-description"
              rows={5}
              className={controlClassName}
              placeholder="예: 검정 케이스에 들어 있는 무선 이어폰, 오른쪽 이어버드에 작은 흠집이 있음"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </FieldShell>

          <ImageUploadField
            label="사진 업로드"
            kind="lost"
            value={form.imageUrl}
            onChange={(imageUrl) =>
              setForm((current) => ({
                ...current,
                imageUrl,
              }))
            }
          />

          {error ? (
            <div className="rounded-[22px] border border-coral-500/20 bg-coral-100/80 px-4 py-3 text-sm text-coral-700">
              {error}
            </div>
          ) : null}

          {successName ? (
            <div className="rounded-[22px] border border-mint-500/20 bg-mint-100/80 p-4">
              <p className="font-semibold text-mint-700">
                `{successName}` 항목이 등록되었습니다.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onNavigateToSearch}
                  className="rounded-full bg-mint-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-mint-500"
                >
                  분실물 검색 보기
                </button>
                <button
                  type="button"
                  onClick={() => setSuccessName(null)}
                  className="rounded-full border border-mint-700/20 px-4 py-2 text-sm font-semibold text-mint-700 transition hover:bg-white"
                >
                  계속 등록하기
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onNavigateToSearch}
              className="rounded-full border border-ink-900/12 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:bg-paper-100"
            >
              분실물 검색으로 이동
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-700 disabled:cursor-wait disabled:bg-ink-700/60"
            >
              {isSubmitting ? '등록 중...' : '분실물 등록'}
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}
