type ItemImageProps = {
  src?: string
  alt: string
  label: string
  kind: 'lost' | 'uniform'
  className?: string
}

export function ItemImage({
  src,
  alt,
  label,
  kind,
  className = '',
}: ItemImageProps) {
  const tone =
    kind === 'lost'
      ? 'from-ink-900 via-ink-700 to-sky-500'
      : 'from-mint-700 via-ink-700 to-sky-500'

  if (src) {
    return (
      <div className={`overflow-hidden rounded-[22px] bg-paper-100 ${className}`}>
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[22px] bg-gradient-to-br ${tone} ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_28%)]" />
      <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/16 p-3 text-white backdrop-blur-sm">
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-1 text-xs text-white/80">사진이 등록되지 않았습니다</p>
      </div>
    </div>
  )
}
