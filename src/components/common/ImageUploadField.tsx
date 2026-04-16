import { useId, useState } from 'react'
import { readFileAsDataUrl } from '../../utils/image'
import { FieldShell } from './FieldShell'
import { ItemImage } from './ItemImage'

type ImageUploadFieldProps = {
  label: string
  kind: 'lost' | 'uniform'
  value?: string
  hint?: string
  onChange: (value?: string) => void
}

export function ImageUploadField({
  label,
  kind,
  value,
  hint,
  onChange,
}: ImageUploadFieldProps) {
  const inputId = useId()
  const [feedback, setFeedback] = useState<string | null>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const dataUrl = await readFileAsDataUrl(file)
      onChange(dataUrl)
      setFeedback(`${file.name} 파일을 불러왔습니다.`)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '이미지를 불러오지 못했습니다.'
      setFeedback(message)
    }
  }

  return (
    <FieldShell
      label={label}
      htmlFor={inputId}
      hint={hint ?? '모바일 촬영 또는 앨범 사진을 바로 첨부할 수 있습니다.'}
    >
      <div className="space-y-3">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={handleFileChange}
        />
        <label
          htmlFor={inputId}
          className="group block cursor-pointer rounded-[26px] border border-dashed border-ink-900/18 bg-white p-4 transition hover:border-sky-500 hover:bg-sky-100/35"
        >
          <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <ItemImage
              src={value}
              alt={`${label} 미리보기`}
              label={label}
              kind={kind}
              className="aspect-[4/3] h-full"
            />
            <div className="space-y-3">
              <p className="text-sm font-semibold text-ink-950">
                물품 사진을 함께 등록해 주세요.
              </p>
              <p className="text-sm text-ink-700/80">
                사진이 있으면 찾는 학생이 물품을 더 쉽게 확인할 수 있습니다.
              </p>
              <div className="inline-flex rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-ink-700">
                사진 선택하기
              </div>
              <p className="text-xs text-ink-700/60">
                너무 큰 이미지는 업로드되지 않을 수 있습니다.
              </p>
            </div>
          </div>
        </label>
        <div className="flex flex-wrap items-center gap-3">
          {feedback ? <p className="text-xs text-ink-700/80">{feedback}</p> : null}
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange(undefined)
                setFeedback('등록된 사진을 제거했습니다.')
              }}
              className="rounded-full border border-ink-900/12 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-paper-100"
            >
              사진 제거
            </button>
          ) : null}
        </div>
      </div>
    </FieldShell>
  )
}
