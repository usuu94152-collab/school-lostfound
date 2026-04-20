const SPREADSHEET_ID = '1k8P4pzrkI1626ax0YiNmyBZ0Jmsf-CT_j3hM5Swhl3s'
const API_TOKEN = ''

// 비워두면 Apps Script가 아래 이름의 Drive 폴더를 자동으로 찾아서 사용하고,
// 없으면 새로 만듭니다. 특정 폴더를 쓰려면 Google Drive 폴더 ID를 넣으세요.
const IMAGE_FOLDER_ID = ''
const IMAGE_FOLDER_NAME = '학교 분실물 교복 사진'

const LOST_SHEET_NAME = '분실물'
const UNIFORM_SHEET_NAME = '교복'

const LOST_HEADERS = [
  'id',
  'itemName',
  'category',
  'foundDate',
  'foundLocation',
  'description',
  'imageUrl',
  'storageLocation',
  'reporterType',
  'createdAt',
]

const UNIFORM_HEADERS = [
  'id',
  'uniformType',
  'gender',
  'size',
  'color',
  'condition',
  'quantity',
  'imageUrl',
  'storageLocation',
  'registeredDate',
  'note',
  'createdAt',
]

function doGet(e) {
  const authError = getAuthError(e.parameter.token)

  if (authError) {
    return createJsonResponse({ error: authError })
  }

  const sheetType = e.parameter.sheet

  if (sheetType === 'lost-items') {
    return createJsonResponse(getRowsAsObjects(LOST_SHEET_NAME, LOST_HEADERS))
  }

  if (sheetType === 'uniform-items') {
    return createJsonResponse(
      getRowsAsObjects(UNIFORM_SHEET_NAME, UNIFORM_HEADERS),
    )
  }

  return createJsonResponse({ error: 'Invalid sheet parameter' })
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}')
  const authError = getAuthError(payload.token)

  if (authError) {
    return createJsonResponse({ error: authError })
  }

  const { action, sheet, item, id } = payload

  if (action === 'create' && sheet === 'lost-items') {
    const nextItem = uploadItemImageIfNeeded(item, 'lost-items')
    appendRow(LOST_SHEET_NAME, LOST_HEADERS, nextItem)
    return createJsonResponse({ ok: true, item: nextItem })
  }

  if (action === 'create' && sheet === 'uniform-items') {
    const nextItem = uploadItemImageIfNeeded(item, 'uniform-items')
    appendRow(UNIFORM_SHEET_NAME, UNIFORM_HEADERS, nextItem)
    return createJsonResponse({ ok: true, item: nextItem })
  }

  if (action === 'delete' && sheet === 'lost-items') {
    deleteRowById(LOST_SHEET_NAME, LOST_HEADERS, id)
    return createJsonResponse({ ok: true })
  }

  if (action === 'delete' && sheet === 'uniform-items') {
    deleteRowById(UNIFORM_SHEET_NAME, UNIFORM_HEADERS, id)
    return createJsonResponse({ ok: true })
  }

  return createJsonResponse({ error: 'Invalid action' })
}

function setupSpreadsheet() {
  ensureSheet(LOST_SHEET_NAME, LOST_HEADERS)
  ensureSheet(UNIFORM_SHEET_NAME, UNIFORM_HEADERS)
  getImageFolder()
  removeBlankDefaultSheets()
}

// 기존 시트에 data:image/...;base64 형태로 저장된 사진이 있다면
// 이 함수를 한 번 실행해서 Drive URL로 변환할 수 있습니다.
function migrateInlineImagesToDrive() {
  migrateSheetImages(LOST_SHEET_NAME, LOST_HEADERS, 'lost-items')
  migrateSheetImages(UNIFORM_SHEET_NAME, UNIFORM_HEADERS, 'uniform-items')
}

function migrateSheetImages(sheetName, headers, sheetKind) {
  const sheet = getSheet(sheetName)
  const values = sheet.getDataRange().getValues()
  const imageColumn = headers.indexOf('imageUrl')

  if (imageColumn < 0 || values.length < 2) {
    return
  }

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const imageUrl = values[rowIndex][imageColumn]

    if (!isBase64ImageDataUrl(imageUrl)) {
      continue
    }

    const item = rowToObject(headers, values[rowIndex])
    const nextItem = uploadItemImageIfNeeded(item, sheetKind)
    sheet.getRange(rowIndex + 1, imageColumn + 1).setValue(nextItem.imageUrl)
  }
}

function ensureSheet(sheetName, headers) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  const sheet =
    spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName)

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold')
  sheet.getRange(1, 1, 1, headers.length).setBackground('#edf2f7')
  sheet.setFrozenRows(1)
  sheet.autoResizeColumns(1, headers.length)
}

function removeBlankDefaultSheets() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  const sheets = spreadsheet.getSheets()

  sheets.forEach((sheet) => {
    const isDefaultName =
      sheet.getName() === 'Sheet1' || sheet.getName() === '시트1'
    const isBlank = sheet.getLastRow() === 0 || sheet.getDataRange().isBlank()

    if (isDefaultName && isBlank && spreadsheet.getSheets().length > 1) {
      spreadsheet.deleteSheet(sheet)
    }
  })
}

function uploadItemImageIfNeeded(item, sheetKind) {
  if (!item || !isBase64ImageDataUrl(item.imageUrl)) {
    return item
  }

  const nextItem = { ...item }
  const fileName = buildImageFileName(nextItem, sheetKind)
  nextItem.imageUrl = uploadDataUrlToDrive(nextItem.imageUrl, fileName)
  return nextItem
}

function isBase64ImageDataUrl(value) {
  return (
    typeof value === 'string' &&
    /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value)
  )
}

function uploadDataUrlToDrive(dataUrl, fileName) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)

  if (!match) {
    throw new Error('지원하지 않는 이미지 형식입니다.')
  }

  const contentType = match[1]
  const base64Data = match[2]
  const extension = getImageExtension(contentType)
  const safeName = `${fileName}.${extension}`
  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64Data),
    contentType,
    safeName,
  )
  const file = getImageFolder().createFile(blob)

  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  } catch (error) {
    console.warn('Drive 파일 공유 설정을 변경하지 못했습니다.', error)
  }

  return `https://drive.google.com/thumbnail?id=${file.getId()}&sz=w1200`
}

function getImageFolder() {
  if (IMAGE_FOLDER_ID) {
    return DriveApp.getFolderById(IMAGE_FOLDER_ID)
  }

  const folders = DriveApp.getFoldersByName(IMAGE_FOLDER_NAME)

  if (folders.hasNext()) {
    return folders.next()
  }

  return DriveApp.createFolder(IMAGE_FOLDER_NAME)
}

function buildImageFileName(item, sheetKind) {
  const label =
    sheetKind === 'lost-items'
      ? item.itemName || 'lost-item'
      : `${item.uniformType || 'uniform'}-${item.size || 'size'}`
  const id = item.id || new Date().getTime()

  return sanitizeFileName(`${sheetKind}-${id}-${label}`).slice(0, 120)
}

function sanitizeFileName(value) {
  return String(value)
    .replace(/[\\/:*?"<>|#%{}[\]^~`]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function getImageExtension(contentType) {
  const extensionMap = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/heic': 'heic',
    'image/heif': 'heif',
  }

  return extensionMap[contentType] || 'png'
}

function getAuthError(token) {
  if (!API_TOKEN) {
    return ''
  }

  return String(token || '') === API_TOKEN ? '' : 'Unauthorized'
}

function getSheet(sheetName) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName)

  if (!sheet) {
    throw new Error(`${sheetName} 시트를 찾을 수 없습니다.`)
  }

  return sheet
}

function getRowsAsObjects(sheetName, headers) {
  const sheet = getSheet(sheetName)
  const values = sheet.getDataRange().getDisplayValues()

  if (values.length < 2) {
    return []
  }

  return values
    .slice(1)
    .filter((row) => row[0])
    .map((row) => rowToObject(headers, row))
}

function rowToObject(headers, row) {
  const item = {}

  headers.forEach((header, index) => {
    item[header] = row[index] || ''
  })

  return item
}

function appendRow(sheetName, headers, item) {
  const sheet = getSheet(sheetName)
  const row = headers.map((header) => item[header] ?? '')
  sheet.appendRow(row)
}

function deleteRowById(sheetName, headers, targetId) {
  const sheet = getSheet(sheetName)
  const values = sheet.getDataRange().getDisplayValues()
  const imageColumn = headers.indexOf('imageUrl')

  for (let rowIndex = values.length - 1; rowIndex >= 1; rowIndex -= 1) {
    if (String(values[rowIndex][0]) === String(targetId)) {
      if (imageColumn >= 0) {
        trashDriveImageFromUrl(values[rowIndex][imageColumn])
      }

      sheet.deleteRow(rowIndex + 1)
      return
    }
  }
}

function trashDriveImageFromUrl(imageUrl) {
  const fileId = extractDriveFileId(imageUrl)

  if (!fileId) {
    return
  }

  try {
    DriveApp.getFileById(fileId).setTrashed(true)
  } catch (error) {
    console.warn('Drive 이미지 파일을 휴지통으로 이동하지 못했습니다.', error)
  }
}

function extractDriveFileId(url) {
  if (!url || typeof url !== 'string') {
    return ''
  }

  const queryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)

  if (queryMatch) {
    return queryMatch[1]
  }

  const pathMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  return pathMatch ? pathMatch[1] : ''
}

function createJsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
  output.setMimeType(ContentService.MimeType.JSON)
  return output
}
