import dayjs from 'dayjs'
import 'dayjs/locale/ko'

dayjs.locale('ko')

export function formatDisplayDate(date: string) {
  return dayjs(date).format('YYYY.MM.DD')
}

export function formatDateInput(date: string) {
  return dayjs(date).format('YYYY-MM-DD')
}

export function getTodayInputValue() {
  return dayjs().format('YYYY-MM-DD')
}

export function getLostItemExpiryDate(foundDate: string) {
  return dayjs(foundDate).add(6, 'month').format('YYYY-MM-DD')
}

export function isExpiredLostItem(foundDate: string) {
  return dayjs().isAfter(dayjs(getLostItemExpiryDate(foundDate)), 'day')
}

export function getLostItemExpiryLabel(foundDate: string) {
  if (isExpiredLostItem(foundDate)) {
    return '폐기 대상'
  }

  const days = dayjs(getLostItemExpiryDate(foundDate)).diff(dayjs(), 'day')

  if (days <= 14) {
    return '폐기 임박'
  }

  return '보관 중'
}

export function getRelativeFreshnessLabel(date: string) {
  const days = Math.max(dayjs().diff(dayjs(date), 'day'), 0)

  if (days <= 7) {
    return '최근 등록'
  }

  if (days <= 30) {
    return '이달 등록'
  }

  return '보관 중'
}
