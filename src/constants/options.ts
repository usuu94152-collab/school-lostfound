import type {
  FoundLocation,
  LostItemCategory,
  ReporterType,
  StorageLocation,
  UniformCondition,
  UniformGender,
  UniformType,
} from '../types/models'

export const lostItemCategories: LostItemCategory[] = [
  '의류',
  '신발',
  '필기구',
  '전자기기',
  '가방',
  '기타',
]

export const foundLocations: FoundLocation[] = [
  '교실',
  '운동장',
  '체육관',
  '급식실',
  '복도',
  '기타',
]

export const storageLocations: StorageLocation[] = [
  '학생부실',
  '분실물함 A',
  '분실물함 B',
]

export const reporterTypes: ReporterType[] = ['학생', '교사']

export const uniformTypes: UniformType[] = [
  '동복 자켓',
  '동복 바지',
  '동복 치마',
  '동복 조끼',
  '와이셔츠',
  '생활복',
  '체육복 상의',
  '체육복 하의',
  '기타',
]

export const uniformGenders: UniformGender[] = ['남', '여', '공용']
export const uniformConditions: UniformCondition[] = [
  '매우 좋음',
  '좋음',
  '사용감 있음',
]
