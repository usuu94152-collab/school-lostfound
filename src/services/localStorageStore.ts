function cloneItems<T>(items: T[]) {
  return JSON.parse(JSON.stringify(items)) as T[]
}

export function readCollection<T>(storageKey: string, seedFactory: () => T[]) {
  if (typeof window === 'undefined') {
    return cloneItems(seedFactory())
  }

  const stored = window.localStorage.getItem(storageKey)

  if (!stored) {
    const initialItems = cloneItems(seedFactory())
    window.localStorage.setItem(storageKey, JSON.stringify(initialItems))
    return initialItems
  }

  try {
    return JSON.parse(stored) as T[]
  } catch {
    const initialItems = cloneItems(seedFactory())
    window.localStorage.setItem(storageKey, JSON.stringify(initialItems))
    return initialItems
  }
}

export function writeCollection<T>(storageKey: string, items: T[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify(items))
}
