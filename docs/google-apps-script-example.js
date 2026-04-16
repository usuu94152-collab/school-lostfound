const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'
const API_TOKEN = ''

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
    appendRow(LOST_SHEET_NAME, LOST_HEADERS, item)
    return createJsonResponse({ ok: true })
  }

  if (action === 'create' && sheet === 'uniform-items') {
    appendRow(UNIFORM_SHEET_NAME, UNIFORM_HEADERS, item)
    return createJsonResponse({ ok: true })
  }

  if (action === 'delete' && sheet === 'lost-items') {
    deleteRowById(LOST_SHEET_NAME, id)
    return createJsonResponse({ ok: true })
  }

  if (action === 'delete' && sheet === 'uniform-items') {
    deleteRowById(UNIFORM_SHEET_NAME, id)
    return createJsonResponse({ ok: true })
  }

  return createJsonResponse({ error: 'Invalid action' })
}

function setupSpreadsheet() {
  ensureSheet(LOST_SHEET_NAME, LOST_HEADERS)
  ensureSheet(UNIFORM_SHEET_NAME, UNIFORM_HEADERS)
  removeBlankDefaultSheets()
}

function ensureSheet(sheetName, headers) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName)

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
    const isDefaultName = sheet.getName() === 'Sheet1' || sheet.getName() === '시트1'
    const isBlank = sheet.getLastRow() === 0 || sheet.getDataRange().isBlank()

    if (isDefaultName && isBlank && spreadsheet.getSheets().length > 1) {
      spreadsheet.deleteSheet(sheet)
    }
  })
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
    .map((row) => {
      const item = {}

      headers.forEach((header, index) => {
        item[header] = row[index] || ''
      })

      return item
    })
}

function appendRow(sheetName, headers, item) {
  const sheet = getSheet(sheetName)
  const row = headers.map((header) => item[header] ?? '')
  sheet.appendRow(row)
}

function deleteRowById(sheetName, targetId) {
  const sheet = getSheet(sheetName)
  const values = sheet.getDataRange().getDisplayValues()

  for (let rowIndex = values.length - 1; rowIndex >= 1; rowIndex -= 1) {
    if (String(values[rowIndex][0]) === String(targetId)) {
      sheet.deleteRow(rowIndex + 1)
      return
    }
  }
}

function createJsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
  output.setMimeType(ContentService.MimeType.JSON)
  return output
}
