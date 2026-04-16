import dayjs from 'dayjs'
import { createLostItemSamples } from '../data/sampleData'
import type { CreateLostItemInput, LostItem } from '../types/models'
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

export async function getLostItems() {
  return sortLostItems(readCollection(LOST_ITEMS_KEY, createLostItemSamples))
}

export async function createLostItem(input: CreateLostItemInput) {
  const items = readCollection<LostItem>(LOST_ITEMS_KEY, createLostItemSamples)
  const nextItem: LostItem = {
    ...input,
    description: input.description.trim(),
    itemName: input.itemName.trim(),
    id: generateId('lost'),
    createdAt: new Date().toISOString(),
  }

  writeCollection(LOST_ITEMS_KEY, sortLostItems([nextItem, ...items]))
  return nextItem
}

export async function deleteLostItem(id: string) {
  const items = readCollection<LostItem>(LOST_ITEMS_KEY, createLostItemSamples)
  const nextItems = items.filter((item) => item.id !== id)
  writeCollection(LOST_ITEMS_KEY, nextItems)
}

export const lostItemsService = {
  getLostItems,
  createLostItem,
  deleteLostItem,
}
