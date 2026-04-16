import dayjs from 'dayjs'
import { createUniformItemSamples } from '../data/sampleData'
import type { CreateUniformItemInput, UniformItem } from '../types/models'
import { googleSheetsApi, isGoogleSheetsConfigured } from './googleSheetsApi'
import { readCollection, writeCollection } from './localStorageStore'

const UNIFORM_ITEMS_KEY = 'school-app:uniform-items'

function sortUniformItems(items: UniformItem[]) {
  return [...items].sort((left, right) => {
    const rightTime = dayjs(right.registeredDate).valueOf()
    const leftTime = dayjs(left.registeredDate).valueOf()

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

function normalizeUniformItem(item: UniformItem): UniformItem {
  return {
    ...item,
    color: item.color || undefined,
    imageUrl: item.imageUrl || undefined,
    note: item.note || undefined,
    quantity: Number(item.quantity) || 0,
    size: item.size ?? '',
  }
}

export async function getUniformItems() {
  if (isGoogleSheetsConfigured()) {
    const items = await googleSheetsApi.getUniformItems()
    return sortUniformItems(items.map(normalizeUniformItem))
  }

  return sortUniformItems(readCollection(UNIFORM_ITEMS_KEY, createUniformItemSamples))
}

export async function createUniformItem(input: CreateUniformItemInput) {
  const nextItem: UniformItem = {
    ...input,
    color: input.color?.trim(),
    note: input.note?.trim(),
    size: input.size.trim(),
    id: generateId('uniform'),
    createdAt: new Date().toISOString(),
  }

  if (isGoogleSheetsConfigured()) {
    await googleSheetsApi.createUniformItem(nextItem)
    return nextItem
  }

  const items = readCollection<UniformItem>(
    UNIFORM_ITEMS_KEY,
    createUniformItemSamples,
  )
  writeCollection(UNIFORM_ITEMS_KEY, sortUniformItems([nextItem, ...items]))
  return nextItem
}

export async function deleteUniformItem(id: string) {
  if (isGoogleSheetsConfigured()) {
    await googleSheetsApi.deleteUniformItem(id)
    return
  }

  const items = readCollection<UniformItem>(
    UNIFORM_ITEMS_KEY,
    createUniformItemSamples,
  )
  const nextItems = items.filter((item) => item.id !== id)
  writeCollection(UNIFORM_ITEMS_KEY, nextItems)
}

export const uniformItemsService = {
  getUniformItems,
  createUniformItem,
  deleteUniformItem,
}
