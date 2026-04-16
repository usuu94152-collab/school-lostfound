# Google Sheets 연동 가이드

## 현재 구조

현재 앱은 아래 흐름으로 동작합니다.

1. 화면 컴포넌트가 서비스 함수 호출
2. 서비스 함수가 브라우저 저장소(localStorage) 사용
3. mock 데이터가 없으면 샘플 데이터로 초기화

즉, 실제 백엔드로 바꿀 때는 화면이 아니라 서비스 레이어만 바꾸면 됩니다.

## 교체 대상 파일

- [lostItemsService.ts](C:/Users/User/Desktop/codex/분실물/app-temp/src/services/lostItemsService.ts)
- [uniformItemsService.ts](C:/Users/User/Desktop/codex/분실물/app-temp/src/services/uniformItemsService.ts)

## 권장 연동 방식

1. Google Apps Script를 웹앱으로 배포
2. React 앱에서 `fetch`로 Apps Script endpoint 호출
3. Apps Script가 Google Sheets에 행 추가 / 목록 조회 / 삭제 처리
4. 이미지는 Google Drive, Cloudinary, Firebase Storage 등 외부 저장소에 업로드하고 Sheets에는 `imageUrl`만 저장

## 권장 시트 컬럼

### 분실물 시트

- id
- itemName
- category
- foundDate
- foundLocation
- description
- imageUrl
- storageLocation
- reporterType
- createdAt

### 교복 시트

- id
- uniformType
- gender
- size
- color
- condition
- quantity
- imageUrl
- storageLocation
- registeredDate
- note
- createdAt

## 프론트엔드 교체 예시

현재:

```ts
const items = await lostItemsService.getLostItems()
```

교체 후에도 화면 코드는 그대로 두고, 서비스 내부만 아래처럼 바꾸면 됩니다.

```ts
export async function getLostItems() {
  const response = await fetch(`${GAS_URL}?sheet=lost-items`)
  return response.json()
}
```

## 삭제 정책

현재는 실제 목록에서 제거하는 방식입니다.

운영 단계에서는 아래 확장도 고려할 수 있습니다.

- `deletedAt`
- `deletedReason`
- `deletedBy`

이렇게 하면 soft delete 기반 운영도 가능합니다.
