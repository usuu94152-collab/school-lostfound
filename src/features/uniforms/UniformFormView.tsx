import { useState } from 'react'
import {
  uniformConditions,
  uniformGenders,
  uniformTypes,
} from '../../constants/options'
import type { CreateUniformItemInput } from '../../types/models'
import { getTodayInputValue } from '../../utils/date'
import { FieldShell, controlClassName } from '../../components/common/FieldShell'
import { ImageUploadField } from '../../components/common/ImageUploadField'
import { SectionCard } from '../../components/common/SectionCard'

type UniformFormViewProps = {
  onSubmit: (input: CreateUniformItemInput) => Promise<void>
  onNavigateToSearch: () => void
}

const initialFormState = (): CreateUniformItemInput => ({
  uniformType: '동복 자켓',
  gender: '공용',
  size: '',
  color: '',
  condition: '좋음',
  quantity: 1,
  imageUrl: undefined,
  storageLocation: '교복창고',
  registeredDate: getTodayInputValue(),
  note: '',
})

export function UniformFormView({
  onSubmit,
  onNavigateToSearch,
}: UniformFormViewProps) {
  const [form, setForm] = useState<CreateUniformItemInput>(initialFormState)
  const [error, setError] = useState<string | null>(null)
  const [successLabel, setSuccessLabel] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.size.trim()) {
      setError('사이즈를 입력해 주세요.')
      return
    }

    if (form.quantity < 1) {
      setError('수량은 1 이상이어야 합니다.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit({
        ...form,
        size: form.size.trim(),
      })
      setSuccessLabel(`${form.uniformType} ${form.size.trim()}`)
      setForm(initialFormState())
    } catch {
      setError('교복 등록 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="교복 등록"
        description="교복 정보를 입력해 주세요."
      >
        <div className="rounded-[24px] bg-paper-100/85 p-4 text-sm text-ink-700/85">
          보관 위치는 자동으로 교복창고로 저장됩니다.
        </div>
      </SectionCard>

      <SectionCard
        title="등록 정보 입력"
        description="사이즈와 수량을 정확하게 입력해 주세요."
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-[26px] border border-sky-200 bg-sky-100/70 p-4">
            <p className="text-sm font-semibold text-ink-950">보관 위치</p>
            <p className="mt-1 text-lg font-semibold text-ink-950">교복창고</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <FieldShell label="교복 종류" htmlFor="uniform-type" required>
              <select
                id="uniform-type"
                className={controlClassName}
                value={form.uniformType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    uniformType: event.target.value as CreateUniformItemInput['uniformType'],
                  }))
                }
              >
                {uniformTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell label="성별 구분" htmlFor="uniform-gender" required>
              <select
                id="uniform-gender"
                className={controlClassName}
                value={form.gender}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    gender: event.target.value as CreateUniformItemInput['gender'],
                  }))
                }
              >
                {uniformGenders.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell
              label="사이즈"
              htmlFor="uniform-size"
              hint="예: 95, 100, 허리 78"
              required
            >
              <input
                id="uniform-size"
                className={`${controlClassName} border-sky-200 bg-sky-100/40 text-lg font-semibold`}
                placeholder="사이즈를 입력해 주세요"
                value={form.size}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    size: event.target.value,
                  }))
                }
              />
            </FieldShell>

            <FieldShell label="상태" htmlFor="uniform-condition" required>
              <select
                id="uniform-condition"
                className={controlClassName}
                value={form.condition}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    condition: event.target.value as CreateUniformItemInput['condition'],
                  }))
                }
              >
                {uniformConditions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell label="수량" htmlFor="uniform-quantity" required>
              <input
                id="uniform-quantity"
                type="number"
                min={1}
                className={controlClassName}
                value={form.quantity}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    quantity: Number(event.target.value),
                  }))
                }
              />
            </FieldShell>

            <FieldShell label="등록일" htmlFor="uniform-date" required>
              <input
                id="uniform-date"
                type="date"
                className={controlClassName}
                value={form.registeredDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    registeredDate: event.target.value,
                  }))
                }
              />
            </FieldShell>

            <FieldShell label="색상 또는 세부 특징" htmlFor="uniform-color">
              <input
                id="uniform-color"
                className={controlClassName}
                placeholder="예: 남색, 단추 상태 양호"
                value={form.color}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    color: event.target.value,
                  }))
                }
              />
            </FieldShell>

            <FieldShell label="비고" htmlFor="uniform-note">
              <input
                id="uniform-note"
                className={controlClassName}
                placeholder="예: 여벌용, 소매 수선 없음"
                value={form.note}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    note: event.target.value,
                  }))
                }
              />
            </FieldShell>
          </div>

          <ImageUploadField
            label="교복 사진 업로드"
            kind="uniform"
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

          {successLabel ? (
            <div className="rounded-[22px] border border-sky-200 bg-sky-100/80 p-4">
              <p className="font-semibold text-ink-900">
                `{successLabel}` 항목이 등록되었습니다.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onNavigateToSearch}
                  className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-700"
                >
                  교복 검색 보기
                </button>
                <button
                  type="button"
                  onClick={() => setSuccessLabel(null)}
                  className="rounded-full border border-ink-900/12 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-white"
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
              교복 검색으로 이동
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-700 disabled:cursor-wait disabled:bg-ink-700/60"
            >
              {isSubmitting ? '등록 중...' : '교복 등록'}
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}
