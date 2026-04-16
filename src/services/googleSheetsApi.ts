import type { LostItem, UniformItem } from '../types/models'

type SheetKind = 'lost-items' | 'uniform-items'

type CreatePayload =
  | { action: 'create'; sheet: SheetKind; item: LostItem | UniformItem }
  | { action: 'delete'; sheet: SheetKind; id: string }

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL?.trim() ?? ''
const GOOGLE_SCRIPT_TOKEN =
  import.meta.env.VITE_GOOGLE_SCRIPT_TOKEN?.trim() ?? ''

export function isGoogleSheetsConfigured() {
  return GOOGLE_SCRIPT_URL.length > 0
}

function buildUrl(sheet: SheetKind) {
  const url = new URL(GOOGLE_SCRIPT_URL)
  url.searchParams.set('sheet', sheet)

  if (GOOGLE_SCRIPT_TOKEN) {
    url.searchParams.set('token', GOOGLE_SCRIPT_TOKEN)
  }

  return url.toString()
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(`Google Sheets 요청 실패: ${response.status}`)
  }

  if (data?.error) {
    throw new Error(String(data.error))
  }

  return data as T
}

async function getRows<T>(sheet: SheetKind) {
  const response = await fetch(buildUrl(sheet))
  return parseJsonResponse<T[]>(response)
}

async function postToSheet(payload: CreatePayload) {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: {
      // text/plain keeps the request simple and avoids a CORS preflight in Apps Script.
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({
      ...payload,
      token: GOOGLE_SCRIPT_TOKEN || undefined,
    }),
  })

  return parseJsonResponse<{ ok: true }>(response)
}

export const googleSheetsApi = {
  getLostItems: () => getRows<LostItem>('lost-items'),
  getUniformItems: () => getRows<UniformItem>('uniform-items'),
  createLostItem: (item: LostItem) =>
    postToSheet({ action: 'create', sheet: 'lost-items', item }),
  createUniformItem: (item: UniformItem) =>
    postToSheet({ action: 'create', sheet: 'uniform-items', item }),
  deleteLostItem: (id: string) =>
    postToSheet({ action: 'delete', sheet: 'lost-items', id }),
  deleteUniformItem: (id: string) =>
    postToSheet({ action: 'delete', sheet: 'uniform-items', id }),
}
