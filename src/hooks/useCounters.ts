import { useEffect, useState } from 'react'
import type { Counter } from '../types'

const KEY = 'kayu-count-v2'
const OLD_KEY = 'kayu-count'

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

const newCounter = (n: number, count = 0): Counter => ({
  id: uid(),
  name: `カウンター ${n}`,
  count,
})

const load = (): Counter[] => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const arr: unknown = JSON.parse(raw)
      if (Array.isArray(arr) && arr.length) return arr as Counter[]
    }
    // 旧バージョン（カウンター1つ）の値を引き継ぐ
    const old = parseInt(localStorage.getItem(OLD_KEY) ?? '', 10)
    if (!Number.isNaN(old)) return [newCounter(1, old)]
  } catch {
    // ストレージが使えない環境では初期状態で動かす
  }
  return [newCounter(1)]
}

export const useCounters = () => {
  const [counters, setCounters] = useState<Counter[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(counters))
    } catch {
      // 保存できなくても動作は続ける
    }
  }, [counters])

  const update = (id: string, patch: Partial<Counter> | ((c: Counter) => Partial<Counter>)) =>
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...(typeof patch === 'function' ? patch(c) : patch) } : c)),
    )

  return {
    counters,
    increment: (id: string) => update(id, (c) => ({ count: c.count + 1 })),
    decrement: (id: string) => update(id, (c) => ({ count: c.count - 1 })),
    setCount: (id: string, count: number) => update(id, { count }),
    rename: (id: string, name: string) => update(id, { name }),
    add: () => setCounters((prev) => [...prev, newCounter(prev.length + 1)]),
    remove: (id: string) =>
      setCounters((prev) => {
        const next = prev.filter((c) => c.id !== id)
        return next.length ? next : [newCounter(1)]
      }),
  }
}
