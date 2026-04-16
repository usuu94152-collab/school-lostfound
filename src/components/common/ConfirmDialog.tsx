import { Modal } from './Modal'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      description={description}
      maxWidthClassName="max-w-lg"
      onClose={onCancel}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-ink-900/12 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:bg-paper-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-coral-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-coral-500"
          >
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div className="soft-card space-y-3 p-5">
        <p className="text-sm text-ink-700/85">
          삭제 후에는 현재 목록에서 바로 사라집니다. 실수 방지를 위해 한 번 더
          확인해 주세요.
        </p>
      </div>
    </Modal>
  )
}
