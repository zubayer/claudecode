import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Hero } from "./Art"
import { Quiz } from "./Quiz"
import { PLACEMENT } from "@/data/curriculum"

const PROFILES = [
  { label: "I've never coded", sub: "Start from the very beginning", level: 0 },
  { label: "I can use a terminal and git a bit", sub: "Skip nothing, but move fast", level: 0 },
  { label: "I'm a developer, new to Claude Code", sub: "Start at Level 1", level: 1 },
  { label: "I use Claude Code daily", sub: "Jump to Level 3 power features", level: 3 },
]
const GOALS = [5, 15, 30, 60]

export function Onboarding({
  onDone,
}: {
  onDone: (name: string, startLevel: number, goal: number) => void
}) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [prof, setProf] = useState(0)
  const [goal, setGoal] = useState(15)
  const [placed, setPlaced] = useState<number | null>(null)
  const [testing, setTesting] = useState(false)

  return (
    <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
      <Hero />
      <div className="flex gap-1 mt-5">
        {[0, 1, 2].map((s) => (
          <div key={s} className={cn("h-1 flex-1 rounded", s <= step ? "bg-primary" : "bg-muted")} />
        ))}
      </div>

      {step === 0 && (
        <div className="mt-6 animate-pop">
          <h1 className="font-display text-3xl leading-tight">Learn Claude Code, from zero to professional.</h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            7 levels. Every lesson moves from the big idea, to an analogy, to how it really works, to a worked example,
            then a hands-on simulation and a quick check. Grill Me mode and spaced-repetition review make it stick.
          </p>
          <label className="block text-xs font-mono text-muted-foreground mt-6 mb-1">WHAT SHOULD WE CALL YOU?</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full rounded border bg-card px-3 py-2.5"
          />
          <Button size="lg" className="w-full mt-4" onClick={() => setStep(1)}>
            Get started
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 animate-pop">
          <h2 className="font-display text-2xl">Where are you starting from?</h2>
          <p className="text-sm text-muted-foreground mt-1">We'll place you on the path. You can open any lesson anytime.</p>
          <div className="mt-4 space-y-2">
            {PROFILES.map((pr, i) => (
              <button
                key={i}
                onClick={() => {
                  setProf(i)
                  setPlaced(null)
                }}
                className={cn("w-full text-left rounded-md border p-3", prof === i && "border-primary bg-secondary")}
              >
                <div className="font-medium">{pr.label}</div>
                <div className="text-xs text-muted-foreground">{pr.sub}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setTesting(true)}
            className="w-full mt-3 rounded-md border-2 border-dashed p-3 text-left"
          >
            <div className="font-medium">Not sure? Take the 2-minute placement test</div>
            <div className="text-xs text-muted-foreground">{PLACEMENT.length} questions, one per level, getting harder</div>
          </button>
          {placed !== null && (
            <div className="mt-2 text-sm rounded bg-accent text-accent-foreground p-2.5">
              Placed at <strong>Level {placed}</strong>. Your path starts there.
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button className="flex-1" onClick={() => setStep(2)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 1 && testing && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
          <div className="max-w-md mx-auto px-4 py-6">
            <div className="text-[11px] font-mono text-primary uppercase">Placement test</div>
            <h2 className="font-display text-2xl mb-4">Answer what you can. Guessing is fine.</h2>
            <Quiz
              mode="test"
              questions={PLACEMENT}
              onFinish={(score) => {
                setPlaced(Math.min(score, 6))
                setProf(-1)
              }}
            />
            <Button className="w-full mt-4" variant={placed === null ? "outline" : "default"} onClick={() => setTesting(false)}>
              {placed === null ? "Cancel" : `Continue at Level ${placed} →`}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 animate-pop">
          <h2 className="font-display text-2xl">Pick your daily pace</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Small and steady beats cramming. Most lessons take 6 to 10 minutes.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {GOALS.map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={cn("rounded-md border p-3 text-left", goal === g && "border-primary bg-secondary")}
              >
                <div className="font-display text-2xl">{g} min</div>
                <div className="text-xs text-muted-foreground">
                  {g === 5 ? "Casual" : g === 15 ? "Steady" : g === 30 ? "Serious" : "Intense"} ·{" "}
                  {g === 5 ? "~10 weeks" : g === 15 ? "~4 weeks" : g === 30 ? "~2 weeks" : "~1 week"}
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1" onClick={() => onDone(name.trim(), placed ?? PROFILES[Math.max(0, prof)].level, goal)}>
              Start learning →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
