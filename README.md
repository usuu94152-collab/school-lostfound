# 학교 분실물 · 교복 물려주기 관리 시스템

학교에서 사용하는 `분실물 관리 + 교복 물려주기 관리` 통합 웹앱입니다.  
React + TypeScript + Tailwind CSS 기반이며, 현재는 `mock + localStorage`로 동작하고 이후 Google Sheets / Google Apps Script Web App API로 쉽게 교체할 수 있도록 서비스 레이어를 분리했습니다.

## 주요 기능

- 홈 대시보드
- 분실물 등록 / 검색
- 교복 등록 / 검색
- 카드형 갤러리 UI
- 상세보기 모달
- 관리자 모드 삭제 기능
- 삭제 확인 모달
- 분실물 6개월 보관 만료 계산
- 이미지 업로드 및 미리보기
- 새로고침 후에도 유지되는 localStorage 기반 mock 데이터

## 관리자 비밀번호

- 기본 비밀번호는 `school1234`입니다.
- 변경 위치: [admin.ts](C:/Users/User/Desktop/codex/분실물/app-temp/src/constants/admin.ts)
- 운영 시에는 `VITE_ADMIN_PASSWORD` 환경 변수 또는 상수 값을 꼭 변경하세요.

## 실행 방법

```bash
npm install
npm run dev
```

프로덕션 빌드:

```bash
npm run build
```

린트 검사:

```bash
npm run lint
```

## GitHub Pages 배포

- 배포 주소: https://usuu94152-collab.github.io/school-lostfound/
- `main` 브랜치에 push하면 `.github/workflows/deploy-pages.yml`이 자동으로 빌드하고 배포합니다.
- GitHub 저장소의 `Settings > Pages`에서 `Build and deployment`의 `Source`가 `GitHub Actions`로 선택되어 있어야 합니다.

## 폴더 구조

```text
src
├─ components/common
├─ constants
├─ data
├─ features
│  ├─ dashboard
│  ├─ lost-items
│  └─ uniforms
├─ services
├─ types
└─ utils
```

## 서비스 레이어

- [lostItemsService.ts](C:/Users/User/Desktop/codex/분실물/app-temp/src/services/lostItemsService.ts)
- [uniformItemsService.ts](C:/Users/User/Desktop/codex/분실물/app-temp/src/services/uniformItemsService.ts)

현재는 브라우저 `localStorage`를 사용하지만, 화면 컴포넌트는 서비스 함수만 호출하도록 분리했습니다.

## Google Sheets 연동 문서

- [Google Sheets 연동 가이드](C:/Users/User/Desktop/codex/분실물/app-temp/docs/GOOGLE_SHEETS_GUIDE.md)
- [Google Apps Script 예시 코드](C:/Users/User/Desktop/codex/분실물/app-temp/docs/google-apps-script-example.js)

## 데이터 모델

- [models.ts](C:/Users/User/Desktop/codex/분실물/app-temp/src/types/models.ts)

## 참고

- 분실물 만료 계산 유틸: [date.ts](C:/Users/User/Desktop/codex/분실물/app-temp/src/utils/date.ts)
- 샘플 데이터: [sampleData.ts](C:/Users/User/Desktop/codex/분실물/app-temp/src/data/sampleData.ts)
