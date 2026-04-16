import dayjs from 'dayjs'
import { createLostItemSamples } from '../data/sampleData'
import type { CreateLostItemInput, LostItem } from '../types/models'
import { googleSheetsApi, isGoogleSheetsConfigured } from './googleSheetsApi'
import { readCollection, writeCollection } from './localStorageStore'

const LOST_ITEMS_KEY = 'school-app:lost-items'

function sortLostItems(items: LostItem[]) {
  return [...items].sort((left, right) => {
    const rightTime = dayjs(right.foundDate).valueOf()
    const leftTime = dayjs(left.foundDate).valueOf()

    if (rightTime !== leftTime) {
      return rightTime - leftTime
    }

    return dayjs(right.createdAt).valueOf() - dayjs(left.createdAt).valueOf()
  })
}

function generateId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}`
}

function normalizeLostItem(item: LostItem): LostItem {
  return {
    ...item,
    description: item.description ?? '',
    imageUrl: item.imageUrl || undefined,
    itemName: item.itemName ?? '',
  }
}

export async function getLostItems() {
  if (isGoogleSheetsConfigured()) {
    const items = await googleSheetsApi.getLostItems()
    return sortLostItems(items.map(normalizeLostItem))
  }

  return sortLostItems(readCollection(LOST_ITEMS_KEY, createLostItemSamples))
}

export async function createLostItem(input: CreateLostItemInput) {
  const nextItem: LostItem = {
    ...input,
    description: input.description.trim(),
    itemName: input.itemName.trim(),
    id: generateId('lost'),
    createdAt: new Date().toISOString(),
  }

  if (isGoogleSheetsConfigured()) {
    await googleSheetsApi.createLostItem(nextItem)
    return nextItem
  }

  const items = readCollection<LostItem>(LOST_ITEMS_KEY, createLostItemSamples)
  writeCollection(LOST_ITEMS_KEY, sortLostItems([nextItem, ...items]))
  return nextItem
}

export async function deleteLostItem(id: string) {
  if (isGoogleSheetsConfigured()) {
    await googleSheetsApi.deleteLostItem(id)
    return
  }

  const items = readCollection<LostItem>(LOST_ITEMS_KEY, createLostItemSamples)
  const nextItems = items.filter((item) => item.id !== id)
  writeCollection(LOST_ITEMS_KEY, nextItems)
}

export const lostItemsService = {
  getLostItems,
  createLostItem,
  deleteLostItem,
}
