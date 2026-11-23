import { useMemo, useState } from "react"
import type { Progress } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Card = { id: string; front: string; back: string; tag: string }
const INTERVALS = [0, 1, 3, 7, 14, 30] // days per Leitner box

export function ReviewView({
  cards,
  p,
  grade,
}: {
  cards: Card[]
  p: Progress
  grade: (id: string, box: number, due: number, correct: boolean) => void
}) {
  const now = Date.now()
  const due = useMemo(
    () => cards.filter((c) => !p.cards[c.id] || p.cards[c.id].due <= now),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cards],
  )
  const [queue, setQueue] = useState<Card[]>(() => due.slice(0, 15))
  const [flip, setFlip] = useState(false)
  const boxes = [1, 2, 3, 4, 5].map((b) => cards.filter((c) => (p.cards[c.id]?.box ?? 0) === b).length)
  const fresh = cards.filter((c) => !p.cards[c.id]).length
  const c = queue[0]

  return (
    <div className="pb-24">
      <div className="text-[11px] font-mono text-primary uppercase">Spaced repetition</div>
      <h1 className="font-display text-3xl leading-tight mt-1">Review</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Flashcards from finished lessons and the glossary. Cards you know come back later; cards you miss come back
        sooner.
      </p>
      <div className="grid grid-cols-6 gap-1 mt-4 text-center">
        <Box label="new" n={fresh} />
        {boxes.map((n, i) => (
          <Box key={i} label={`box ${i + 1}`} n={n} />
        ))}
      </div>

      {!c ? (
        <div className="mt-8 text-center rounded-md border p-6">
          <div className="text-4xl">🌿</div>
          <div className="font-display text-xl mt-2">All caught up</div>
          <p className="text-sm text-muted-foreground mt-1">
            {cards.length === 0 ? "Finish a lesson to unlock its cards." : "Come back tomorrow for due cards."}
          </p>
          {cards.length > 0 && (
            <Button variant="outline" className="mt-4" onClick={() => setQueue([...cards].sort(() => Math.random() - 0.5).slice(0, 10))}>
              Cram 10 anyway
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-5">
          <div className="text-xs font-mono text-muted-foreground mb-1">
            {queue.length} left · {c.tag}
          </div>
          <button
            onClick={() => setFlip(!flip)}
            className={cn(
              "w-full min-h-[220px] rounded-md border-2 p-5 text-left transition-colors",
              flip ? "bg-accent/40 border-sage" : "bg-card",
            )}
          >
            <div className="text-[11px] font-mono uppercase opacity-60 mb-2">{flip ? "answer" : "question · tap to flip"}</div>
            <div className={cn("leading-relaxed", flip ? "text-[15px]" : "text-[18px] font-medium")}>{flip ? c.back : c.front}</div>
          </button>
          {flip && (
            <div className="grid grid-cols-2 gap-2 mt-3 animate-pop">
              <Button
                variant="outline"
                onClick={() => {
                  grade(c.id, 1, Date.now() + INTERVALS[0], false)
                  setQueue((q) => [...q.slice(1), c])
                  setFlip(false)
                }}
              >
                Again
              </Button>
              <Button
                onClick={() => {
                  const box = Math.min(5, (p.cards[c.id]?.box ?? 0) + 1)
                  grade(c.id, box, Date.now() + INTERVALS[box] * 86400000, true)
                  setQueue((q) => q.slice(1))
                  setFlip(false)
                }}
              >
                Got it
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Box({ label, n }: { label: string; n: number }) {
  return (
    <div className="rounded border bg-card py-1.5">
      <div className="font-semibold text-sm">{n}</div>
      <div className="text-[9px] font-mono text-muted-foreground">{label}</div>
    </div>
  )
}
