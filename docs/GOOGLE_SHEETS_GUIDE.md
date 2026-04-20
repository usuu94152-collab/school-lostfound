# Google Sheets 연동 가이드

이 앱은 기본값으로 `mock + localStorage`를 사용합니다.  
`VITE_GOOGLE_SCRIPT_URL`을 설정하면 같은 화면에서 Google Sheets 기반 목록 조회, 등록, 삭제로 전환됩니다.

## 1. Google 스프레드시트 만들기

1. Google Drive에서 새 스프레드시트를 만듭니다.
2. 파일 이름을 `학교 분실물 · 교복 물려주기 관리`처럼 정합니다.
3. 주소에서 스프레드시트 ID를 복사합니다.

예:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

## 2. Apps Script 붙여넣기

1. 스프레드시트에서 `확장 프로그램 > Apps Script`를 엽니다.
2. [google-apps-script-example.js](C:/Users/User/Desktop/codex/분실물/app-temp/docs/google-apps-script-example.js) 내용을 붙여넣습니다.
3. `SPREADSHEET_ID` 값을 실제 스프레드시트 ID로 바꿉니다.
4. 원하면 `API_TOKEN`에 간단한 토큰 값을 넣습니다.
5. 특정 Google Drive 폴더에 사진을 저장하려면 `IMAGE_FOLDER_ID`에 폴더 ID를 넣습니다.
6. `setupSpreadsheet` 함수를 한 번 실행합니다.

`setupSpreadsheet`를 실행하면 아래 탭과 헤더가 자동 생성되고, 사진 저장용 Google Drive 폴더도 준비됩니다.

## 3. 시트 구조

### 분실물 탭

탭 이름: `분실물`

```text
id
itemName
category
foundDate
foundLocation
description
imageUrl
storageLocation
reporterType
createdAt
```

### 교복 탭

탭 이름: `교복`

```text
id
uniformType
gender
size
color
condition
quantity
imageUrl
storageLocation
registeredDate
note
createdAt
```

## 4. Apps Script 웹앱 배포

1. Apps Script 우측 상단의 `배포 > 새 배포`를 누릅니다.
2. 유형은 `웹 앱`을 선택합니다.
3. 실행 사용자는 `나`로 선택합니다.
4. 액세스 권한은 상황에 맞게 선택합니다.
5. 배포 후 생성되는 웹앱 URL을 복사합니다.

학교 Google Workspace 안에서만 쓸 수 있다면 액세스 권한을 조직 내부로 제한하는 편이 더 안전합니다.  
GitHub Pages에서 공개 앱으로 접근해야 한다면 `모든 사용자` 접근이 필요할 수 있습니다.

## 5. 로컬 개발 환경 연결

프로젝트 루트에 `.env.local`을 만들고 아래처럼 입력합니다.

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/배포_ID/exec
VITE_GOOGLE_SCRIPT_TOKEN=선택_토큰
```

그 다음 개발 서버를 다시 실행합니다.

```bash
npm run dev
```

`VITE_GOOGLE_SCRIPT_URL`이 비어 있으면 앱은 자동으로 localStorage mock 모드로 돌아갑니다.

## 6. GitHub Pages 연결

GitHub 저장소에서 아래 값을 설정합니다.

경로:

```text
Settings > Secrets and variables > Actions > Variables
```

추가할 변수:

```text
VITE_GOOGLE_SCRIPT_URL
VITE_GOOGLE_SCRIPT_TOKEN
```

변수를 저장한 뒤 `Actions`에서 Pages 배포를 다시 실행하거나 `main` 브랜치에 새 커밋을 push하면 됩니다.

## 7. 사진 관리

시트의 `imageUrl`에는 이미지 파일 자체가 아니라 Google Drive 이미지 URL만 저장합니다.

앱에서 사진을 첨부해 등록하면 아래 흐름으로 처리됩니다.

1. 브라우저가 사진을 Apps Script로 전송합니다.
2. Apps Script가 사진을 Google Drive 폴더에 파일로 저장합니다.
3. Drive 파일을 링크가 있는 사용자에게 공개합니다.
4. 시트의 `imageUrl` 컬럼에는 Drive 이미지 URL만 저장합니다.

사진 저장 폴더 설정:

```js
const IMAGE_FOLDER_ID = ''
const IMAGE_FOLDER_NAME = '학교 분실물 교복 사진'
```

`IMAGE_FOLDER_ID`를 비워두면 Apps Script가 `IMAGE_FOLDER_NAME` 이름의 폴더를 찾아 사용하고, 없으면 새로 만듭니다.  
이미 만들어둔 폴더를 쓰고 싶다면 Drive 폴더 주소에서 ID를 복사해 `IMAGE_FOLDER_ID`에 넣으면 됩니다.

기존 시트에 `data:image/...;base64` 형태의 긴 이미지 문자열이 이미 저장되어 있다면 Apps Script에서 아래 함수를 한 번 실행하세요.

```js
migrateInlineImagesToDrive
```

이 함수는 기존 base64 이미지를 Drive 파일로 옮기고, 시트의 `imageUrl` 값을 Drive 이미지 URL로 바꿉니다.

## 8. 삭제 정책

현재 삭제는 시트 행을 실제로 삭제합니다.  
Apps Script로 등록된 Drive 이미지 URL이 있으면 삭제 시 해당 Drive 이미지 파일도 휴지통으로 이동합니다.

운영 단계에서 기록을 남기고 싶다면 아래 컬럼을 추가해 soft delete 방식으로 확장할 수 있습니다.

```text
deletedAt
deletedReason
deletedBy
```
