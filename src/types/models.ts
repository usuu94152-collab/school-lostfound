export type LostItemCategory =
  | '의류'
  | '신발'
  | '필기구'
  | '전자기기'
  | '가방'
  | '기타';

export type FoundLocation =
  | '교실'
  | '운동장'
  | '체육관'
  | '급식실'
  | '복도'
  | '기타';

export type StorageLocation = '학생부실' | '분실물함 A' | '분실물함 B';
export type ReporterType = '학생' | '교사';

export type LostItem = {
  id: string;
  itemName: string;
  category: LostItemCategory;
  foundDate: string;
  foundLocation: FoundLocation;
  description: string;
  imageUrl?: string;
  storageLocation: StorageLocation;
  reporterType: ReporterType;
  createdAt: string;
};

export type CreateLostItemInput = Omit<LostItem, 'id' | 'createdAt'>;

export type UniformType =
  | '동복 자켓'
  | '동복 바지'
  | '동복 치마'
  | '동복 조끼'
  | '와이셔츠'
  | '생활복'
  | '체육복 상의'
  | '체육복 하의'
  | '기타';

export type UniformGender = '남' | '여' | '공용';
export type UniformCondition = '매우 좋음' | '좋음' | '사용감 있음';

export type UniformItem = {
  id: string;
  uniformType: UniformType;
  gender: UniformGender;
  size: string;
  color?: string;
  condition: UniformCondition;
  quantity: number;
  imageUrl?: string;
  storageLocation: '교복창고';
  registeredDate: string;
  note?: string;
  createdAt: string;
};

export type CreateUniformItemInput = Omit<UniformItem, 'id' | 'createdAt'>;

export type AppView =
  | 'home'
  | 'lost-register'
  | 'lost-search'
  | 'uniform-register'
  | 'uniform-search';
