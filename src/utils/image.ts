const MAX_IMAGE_SIZE = 2 * 1024 * 1024

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (file.size > MAX_IMAGE_SIZE) {
      reject(new Error('이미지 용량은 2MB 이하로 업로드해 주세요.'))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('이미지를 불러오지 못했습니다.'))
    }

    reader.onerror = () => reject(new Error('이미지를 읽는 중 오류가 발생했습니다.'))
    reader.readAsDataURL(file)
  })
}

export function makePlaceholderDataUrl(
  label: string,
  colors: { background: string; accent: string; text: string },
) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors.background}" />
          <stop offset="100%" stop-color="${colors.accent}" />
        </linearGradient>
      </defs>
      <rect width="640" height="480" rx="40" fill="url(#g)" />
      <circle cx="110" cy="96" r="42" fill="rgba(255,255,255,0.18)" />
      <circle cx="548" cy="104" r="58" fill="rgba(255,255,255,0.12)" />
      <rect x="82" y="316" width="476" height="70" rx="20" fill="rgba(255,255,255,0.18)" />
      <text x="320" y="240" text-anchor="middle" font-size="42" font-weight="700" fill="${colors.text}" font-family="Pretendard, Noto Sans KR, sans-serif">${label}</text>
      <text x="320" y="360" text-anchor="middle" font-size="22" fill="${colors.text}" opacity="0.88" font-family="Pretendard, Noto Sans KR, sans-serif">등록 이미지</text>
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
