const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'
const LOST_SHEET_NAME = 'lost_items'
const UNIFORM_SHEET_NAME = 'uniform_items'

function doGet(e) {
  const sheetType = e.parameter.sheet

  if (sheetType === 'lost-items') {
    return createJsonResponse(getRowsAsObjects(LOST_SHEET_NAME))
  }

  if (sheetType === 'uniform-items') {
    return createJsonResponse(getRowsAsObjects(UNIFORM_SHEET_NAME))
  }

  return createJsonResponse({ error: 'Invalid sheet parameter' }, 400)
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents)
  const { action, sheet, item, id } = payload

  if (action === 'create' && sheet === 'lost-items') {
    appendRow(LOST_SHEET_NAME, item)
    return createJsonResponse({ ok: true })
  }

  if (action === 'create' && sheet === 'uniform-items') {
    appendRow(UNIFORM_SHEET_NAME, item)
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

  return createJsonResponse({ error: 'Invalid action' }, 400)
}

function getSheet(sheetName) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName)
}

function getRowsAsObjects(sheetName) {
  const sheet = getSheet(sheetName)
  const values = sheet.getDataRange().getValues()

  if (values.length < 2) {
    return []
  }

  const headers = values[0]
  const rows = values.slice(1)

  return rows
    .filter((row) => row[0])
    .map((row) => {
      const item = {}

      headers.forEach((header, index) => {
        item[header] = row[index]
      })

      return item
    })
}

function appendRow(sheetName, item) {
  const sheet = getSheet(sheetName)
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
  const row = headers.map((header) => item[header] ?? '')
  sheet.appendRow(row)
}

function deleteRowById(sheetName, targetId) {
  const sheet = getSheet(sheetName)
  const values = sheet.getDataRange().getValues()

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
