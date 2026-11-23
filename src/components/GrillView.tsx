import { useMemo, useState } from "react"
import type { GrillQ } from "@/data/types"
import type { Progress } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ROUND = 5

export function GrillView({
  pool,
  p,
  rate,
  onRoundDone,
}: {
  pool: GrillQ[]
  p: Progress
  rate: (id: string, r: number) => void
  onRoundDone: (score: number) => void
}) {
  const [maxLevel, setMaxLevel] = useState(6)
  const [round, setRound] = useState<GrillQ[] | null>(null)
  const [i, setI] = useState(0)
  const [ans, setAns] = useState("")
  const [revealed, setRevealed] = useState(false)
  const [tally, setTally] = useState<number[]>([])

  const weak = useMemo(() => pool.filter((q) => (p.grill[q.id] ?? -1) < 2).length, [pool, p.grill])

  function start(focusWeak: boolean) {
    const eligible = pool.filter((q) => q.level <= maxLevel)
    const scored = eligible
      .map((q) => ({ q, w: (focusWeak ? 3 - ((p.grill[q.id] ?? -1) + 1) : 1) + Math.random() * 1.5 }))
      .sort((a, b) => b.w - a.w)
      .slice(0, ROUND)
      .map((x) => x.q)
    setRound(scored)
    setI(0)
    setAns("")
    setRevealed(false)
    setTally([])
  }

  if (!round) {
    return (
      <div className="pb-24">
        <div className="text-[11px] font-mono text-primary uppercase">Grill Me mode</div>
        <h1 className="font-display text-3xl leading-tight mt-1">Get interrogated until it sticks.</h1>
        <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
          Each round asks {ROUND} open questions. Answer in your own words first. Then reveal the recommended answer,
          see which key ideas you hit, and rate yourself honestly. Weak spots come back more often.
        </p>
        <div className="mt-5 rounded-md border p-3 bg-card">
          <div className="text-xs font-mono text-muted-foreground mb-2">QUESTIONS UP TO LEVEL</div>
          <div className="flex gap-1.5 flex-wrap">
            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => setMaxLevel(n)}
                className={cn(
                  "w-9 h-9 rounded border font-mono text-sm",
                  maxLevel === n && "bg-primary text-primary-foreground border-primary",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-3">
            {pool.length} questions in the bank · {weak} not yet nailed
          </div>
        </div>
        <div className="grid gap-2 mt-4">
          <Button size="lg" onClick={() => start(true)}>
            🔥 Grill my weak spots
          </Button>
          <Button size="lg" variant="outline" onClick={() => start(false)}>
            🎲 Random round
          </Button>
        </div>
      </div>
    )
  }

  if (i >= round.length) {
    const pts = tally.reduce((a, b) => a + b, 0)
    return (
      <div className="pb-24 animate-pop text-center pt-6">
        <div className="text-5xl">{pts >= 8 ? "🥩" : pts >= 5 ? "🔥" : "🧊"}</div>
        <div className="font-display text-3xl mt-2">Round over</div>
        <div className="text-muted-foreground mt-1">
          {pts}/{round.length * 2} points · {tally.filter((t) => t === 2).length} nailed
        </div>
        <div className="mt-6 grid gap-2">
          <Button onClick={() => start(true)}>Another round</Button>
          <Button variant="outline" onClick={() => setRound(null)}>
            Done
          </Button>
        </div>
      </div>
    )
  }

  const q = round[i]
  const lower = ans.toLowerCase()
  const hits = q.keywords.filter((k) => lower.includes(k.toLowerCase()))

  return (
    <div className="pb-24">
      <div className="flex justify-between text-xs font-mono text-muted-foreground">
        <span>
          Round · Q{i + 1}/{round.length}
        </span>
        <span>
          L{q.level} · {q.topic}
        </span>
      </div>
      <div className="flex gap-1 mt-2">
        {round.map((_, j) => (
          <div key={j} className={cn("h-1 flex-1 rounded", j < i ? "bg-primary" : j === i ? "bg-amber" : "bg-muted")} />
        ))}
      </div>

      <div className="mt-5 rounded-md border bg-card p-4" key={q.id}>
        <div className="text-sm font-mono text-amber">❓ Q{i + 1}</div>
        <div className="text-[17px] leading-snug mt-1 font-medium">{q.q}</div>
        <textarea
          value={ans}
          onChange={(e) => setAns(e.target.value)}
          disabled={revealed}
          placeholder="Answer in your own words before revealing…"
          className="w-full mt-3 min-h-[110px] rounded border bg-background p-2.5 text-sm"
        />
        {!revealed ? (
          <Button className="w-full mt-2" onClick={() => setRevealed(true)}>
            {ans.trim() ? "Lock in & reveal" : "I don't know, reveal"}
          </Button>
        ) : (
          <div className="mt-3 animate-pop">
            <div className="text-sm font-mono text-sage">➡️ Recommended answer</div>
            <p className="text-[15px] leading-relaxed mt-1">{q.recommended}</p>
            <div className="mt-3 text-xs">
              <span className="font-mono text-muted-foreground">KEY IDEAS · </span>
              {q.keywords.map((k) => (
                <span
                  key={k}
                  className={cn(
                    "inline-block mr-1 mb-1 px-1.5 py-0.5 rounded border",
                    hits.includes(k) ? "bg-accent text-accent-foreground border-sage" : "opacity-60",
                  )}
                >
                  {hits.includes(k) ? "✓ " : ""}
                  {k}
                </span>
              ))}
            </div>
            <div className="text-xs font-mono text-muted-foreground mt-3 mb-1.5">HOW DID YOU DO?</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["Missed", 0],
                ["Partly", 1],
                ["Nailed", 2],
              ].map(([label, r]) => (
                <Button
                  key={label}
                  variant={r === 2 ? "default" : "outline"}
                  onClick={() => {
                    rate(q.id, r as number)
                    const t = [...tally, r as number]
                    setTally(t)
                    setAns("")
                    setRevealed(false)
                    if (i + 1 >= round.length) onRoundDone(t.reduce((a, b) => a + b, 0))
                    setI(i + 1)
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
