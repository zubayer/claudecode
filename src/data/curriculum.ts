import { LEVELS_A } from "./levels-a"
import { LEVELS_B } from "./levels-b"
import { LEVELS_C } from "./levels-c"
import { LEVEL_BONUS } from "./levels-bonus"
import type { QuizQ } from "./types"

export const LEVELS = [...LEVELS_A, ...LEVELS_B, ...LEVELS_C, LEVEL_BONUS]
export const CORE_LEVELS = LEVELS.filter((l) => l.num <= 6)

/** one question per core level, from each level's second lesson (increasing difficulty) */
export const PLACEMENT: QuizQ[] = CORE_LEVELS.map((l) => (l.lessons[1] ?? l.lessons[0]).quiz[0])

export const EXAM_POOL: QuizQ[] = CORE_LEVELS.flatMap((l) => l.lessons.flatMap((ls) => ls.quiz))
