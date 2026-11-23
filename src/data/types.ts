export type QuizQ = {
  q: string
  options: string[]
  answer: number
  why: string
}

export type TermStep = {
  /** what the learner should type (shown as a hint chip) */
  cmd: string
  /** alternative accepted inputs (lowercased, trimmed) */
  accept?: string[]
  /** simulated output lines */
  out: string[]
  /** short explanation shown after the step succeeds */
  note?: string
}

export type Example = {
  title: string
  setup?: string
  steps: { label: string; code?: string; text?: string }[]
  result?: string
}

export type Lesson = {
  id: string
  title: string
  minutes: number
  /** 1. Intuition: the plain-language idea */
  intuition: string
  /** 2. Analogy: everyday comparison */
  analogy: string
  /** 3. Formal detail: how it really works (light markdown: **bold**, `code`, - lists) */
  formal: string
  /** 4. Worked example */
  example: Example
  /** 5. Optional terminal simulation */
  terminal?: { intro: string; steps: TermStep[] }
  /** Caveman TL;DR */
  caveman: string
  pitfall?: string
  proTip?: string
  quiz: QuizQ[]
  sources?: { label: string; url: string }[]
}

export type Level = {
  id: string
  num: number
  title: string
  rank: string
  tagline: string
  goal: string
  lessons: Lesson[]
  project: { title: string; brief: string; checklist: string[] }
}

export type GrillQ = {
  id: string
  level: number
  topic: string
  q: string
  recommended: string
  keywords: string[]
}
