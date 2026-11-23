import { useMemo, useState } from "react"
import type { QuizQ } from "@/data/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Quiz({
  questions,
  onFinish,
  mode = "lesson",
}: {
  questions: QuizQ[]
  onFinish: (score: number) => void
  mode?: "lesson" | "test"
}) {
  const [i, setI] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  // shuffle answer order so the correct option isn't always in the same slot
  const shuffled = useMemo(
    () =>
      questions.map((qq) => {
        const order = qq.options.map((_, k) => k).sort(() => Math.random() - 0.5)
        return { ...qq, options: order.map((k) => qq.options[k]), answer: order.indexOf(qq.answer) }
      }),
    [questions],
  )
  const q = shuffled[i]

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="animate-pop rounded-md border p-5 text-center">
        <div className="text-4xl mb-2">{pct === 100 ? "🏆" : pct >= 60 ? "✅" : "🔁"}</div>
        <div className="font-display text-2xl">
          {score}/{questions.length} correct
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "test"
            ? `${pct}% correct`
            : pct === 100
              ? "Perfect. Bonus XP earned."
              : pct >= 60
                ? "Passed. Lesson complete."
                : "Review the lesson and retry for full credit."}
        </p>
        {mode === "lesson" && (
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setI(0)
            setPick(null)
            setScore(0)
            setFinished(false)
          }}
        >
          Retry quiz
        </Button>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-md border p-4">
      <div className="flex justify-between text-xs text-muted-foreground mb-2 font-mono">
        <span>
          Q{i + 1} of {questions.length}
        </span>
        <span>score {score}</span>
      </div>
      <div className="font-medium mb-3 leading-snug">{q.q}</div>
      <div className="space-y-2">
        {q.options.map((o, j) => {
          const state = pick === null ? "idle" : j === q.answer ? "right" : j === pick ? "wrong" : "idle"
          return (
            <button
              key={j}
              disabled={pick !== null}
              onClick={() => {
                setPick(j)
                if (j === q.answer) setScore((s) => s + 1)
              }}
              className={cn(
                "w-full text-left text-sm px-3 py-2.5 rounded border transition-colors",
                state === "idle" && "hover:border-primary",
                state === "right" && "border-sage bg-accent",
                state === "wrong" && "border-destructive bg-destructive/10",
              )}
            >
              <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + j)}</span>
              {o}
            </button>
          )
        })}
      </div>
      {pick !== null && (
        <div className="mt-3 animate-pop">
          <div className={cn("text-sm font-semibold", pick === q.answer ? "text-sage" : "text-destructive")}>
            {pick === q.answer ? "Correct." : "Not quite."}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{q.why}</p>
          <Button
            className="mt-3 w-full"
            onClick={() => {
              if (i + 1 >= questions.length) {
                setFinished(true)
                onFinish(score)
              } else {
                setI(i + 1)
                setPick(null)
              }
            }}
          >
            {i + 1 >= questions.length ? "See result" : "Next question"}
          </Button>
        </div>
      )}
    </div>
  )
}
