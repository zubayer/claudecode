import { useCallback, useEffect, useState } from "react"

const KEY = "cc-academy-v1"

export type Progress = {
  name: string
  onboarded: boolean
  startLevel: number
  dailyGoal: number // minutes per day
  xp: number
  completed: Record<string, { at: number; score: number }>
  quizBest: Record<string, number>
  streak: number
  lastDay: string
  todayMinutes: number
  history: Record<string, number> // yyyy-mm-dd -> minutes
  cards: Record<string, { box: number; due: number }>
  grill: Record<string, number> // grill question id -> best self-rating 0..2
  caveman: boolean
  dark: boolean
  badges: string[]
  notes: Record<string, string>
  examBest: number
}

export const defaultProgress: Progress = {
  name: "",
  onboarded: false,
  startLevel: 0,
  dailyGoal: 15,
  xp: 0,
  completed: {},
  quizBest: {},
  streak: 0,
  lastDay: "",
  todayMinutes: 0,
  history: {},
  cards: {},
  grill: {},
  caveman: false,
  dark: true,
  badges: [],
  notes: {},
  examBest: 0,
}

let memory: Progress | null = null

function load(): Progress {
  if (memory) return memory
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) {
      memory = { ...defaultProgress, ...JSON.parse(raw) }
      return memory!
    }
  } catch {
    /* storage unavailable */
  }
  memory = { ...defaultProgress }
  return memory
}

function save(p: Progress) {
  memory = p
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}

export const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function dayDiff(a: string, b: string) {
  if (!a || !b) return 999
  const da = new Date(a + "T00:00:00").getTime()
  const db = new Date(b + "T00:00:00").getTime()
  return Math.round((db - da) / 86400000)
}

export function useProgress() {
  const [p, setP] = useState<Progress>(load)

  // roll the day over
  useEffect(() => {
    const t = today()
    if (p.lastDay !== t && p.lastDay) {
      const gap = dayDiff(p.lastDay, t)
      const next = { ...p, todayMinutes: 0, streak: gap > 1 ? 0 : p.streak }
      save(next)
      setP(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setP((prev) => {
      const next = fn(prev)
      save(next)
      return next
    })
  }, [])

  /** record learning activity: minutes + xp, keeps the streak */
  const activity = useCallback(
    (minutes: number, xp: number) => {
      update((prev) => {
        const t = today()
        let streak = prev.streak
        if (prev.lastDay !== t) {
          streak = dayDiff(prev.lastDay, t) === 1 ? prev.streak + 1 : 1
        }
        const todayMinutes = (prev.lastDay === t ? prev.todayMinutes : 0) + minutes
        return {
          ...prev,
          xp: prev.xp + xp,
          streak,
          lastDay: t,
          todayMinutes,
          history: { ...prev.history, [t]: (prev.history[t] || 0) + minutes },
        }
      })
    },
    [update],
  )

  const reset = useCallback(() => {
    const fresh = { ...defaultProgress }
    save(fresh)
    setP(fresh)
  }, [])

  return { p, update, activity, reset }
}

export const RANKS = [
  { xp: 0, name: "Curious" },
  { xp: 150, name: "First Prompt" },
  { xp: 400, name: "Navigator" },
  { xp: 800, name: "Operator" },
  { xp: 1300, name: "Orchestrator" },
  { xp: 1900, name: "Architect" },
  { xp: 2600, name: "Professional" },
]

export function rankFor(xp: number) {
  let r = RANKS[0]
  let next: (typeof RANKS)[number] | null = null
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].xp) {
      r = RANKS[i]
      next = RANKS[i + 1] || null
    }
  }
  return { rank: r, next }
}
