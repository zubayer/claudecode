import { useEffect, useMemo, useState } from "react"
import type { Lesson, Level } from "@/data/types"
import { Md } from "./Md"
import { Terminal } from "./Terminal"
import { Quiz } from "./Quiz"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Progress } from "@/lib/store"

type Stage = { key: string; label: string; icon: string }

export function LessonPlayer({
  level,
  lesson,
  p,
  onComplete,
  onBack,
  onNext,
  saveNote,
}: {
  level: Level
  lesson: Lesson
  p: Progress
  onComplete: (score: number, total: number) => void
  onBack: () => void
  onNext: (() => void) | null
  saveNote: (t: string) => void
}) {
  const stages: Stage[] = useMemo(() => {
    const s: Stage[] = [
      { key: "intuition", label: "Intuition", icon: "💡" },
      { key: "analogy", label: "Analogy", icon: "🧭" },
      { key: "formal", label: "How it works", icon: "⚙️" },
      { key: "example", label: "Worked example", icon: "🧪" },
    ]
    if (lesson.terminal) s.push({ key: "terminal", label: "Try it", icon: "⌨️" })
    s.push({ key: "quiz", label: "Check", icon: "✅" })
    return s
  }, [lesson])
  const [si, setSi] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const stage = stages[si]
  const completed = !!p.completed[lesson.id]

  useEffect(() => {
    setSi(0)
    setQuizDone(false)
    window.scrollTo({ top: 0 })
  }, [lesson.id])

  return (
    <div className="pb-28">
      <button onClick={onBack} className="text-sm text-muted-foreground mb-3 hover:text-foreground">
        ← Level {level.num}: {level.title}
      </button>
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-display text-[26px] leading-tight">{lesson.title}</h1>
        {completed && <span className="text-xs px-2 py-1 rounded bg-accent text-accent-foreground shrink-0">done</span>}
      </div>
      <div className="text-xs text-muted-foreground font-mono mt-1">
        ~{lesson.minutes} min · {lesson.quiz.length} questions
      </div>

      {p.caveman && (
        <div className="mt-4 rounded-md border-2 border-amber p-3 animate-pop">
          <div className="text-xs font-mono text-amber mb-1">🪨 CAVEMAN TL;DR</div>
          <div className="text-[15px] leading-snug">{lesson.caveman}</div>
        </div>
      )}

      {/* stage rail */}
      <div className="mt-5 flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {stages.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setSi(i)}
            className={cn(
              "shrink-0 text-xs px-2.5 py-1.5 rounded border whitespace-nowrap",
              i === si ? "bg-primary text-primary-foreground border-primary" : i < si ? "bg-secondary" : "",
            )}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>
      <div className="h-1 bg-muted rounded mt-2 overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${((si + 1) / stages.length) * 100}%` }} />
      </div>

      <section className="mt-5 animate-pop" key={stage.key}>
        {stage.key === "intuition" && (
          <>
            <Kicker>Step 1 · The big idea</Kicker>
            <Md text={lesson.intuition} className="text-[16px]" />
          </>
        )}
        {stage.key === "analogy" && (
          <>
            <Kicker>Step 2 · Think of it like…</Kicker>
            <div className="border-l-4 border-sage pl-4 py-1">
              <Md text={lesson.analogy} className="text-[16px]" />
            </div>
          </>
        )}
        {stage.key === "formal" && (
          <>
            <Kicker>Step 3 · How it actually works</Kicker>
            <Md text={lesson.formal} className="text-[15px]" />
            {lesson.pitfall && (
              <Callout tone="warn" title="Common pitfall">
                {lesson.pitfall}
              </Callout>
            )}
            {lesson.proTip && (
              <Callout tone="tip" title="Pro tip">
                {lesson.proTip}
              </Callout>
            )}
          </>
        )}
        {stage.key === "example" && (
          <>
            <Kicker>Step 4 · Worked example</Kicker>
            <div className="font-semibold mb-1">{lesson.example.title}</div>
            {lesson.example.setup && <p className="text-sm text-muted-foreground mb-3">{lesson.example.setup}</p>}
            <ol className="space-y-3">
              {lesson.example.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-xs w-6 h-6 shrink-0 rounded-full bg-secondary flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{s.label}</div>
                    {s.text && <Md text={s.text} className="text-sm text-muted-foreground mt-0.5" />}
                    {s.code && (
                      <pre className="term rounded p-2.5 mt-1.5 text-[12px] overflow-x-auto whitespace-pre">{s.code}</pre>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            {lesson.example.result && (
              <Callout tone="ok" title="Result">
                {lesson.example.result}
              </Callout>
            )}
          </>
        )}
        {stage.key === "terminal" && lesson.terminal && (
          <>
            <Kicker>Step 5 · Hands-on simulation</Kicker>
            <p className="text-sm text-muted-foreground mb-3">
              A safe, simulated Claude Code session. Type each command, or tap the hint to run it.
            </p>
            <Terminal intro={lesson.terminal.intro} steps={lesson.terminal.steps} />
          </>
        )}
        {stage.key === "quiz" && (
          <>
            <Kicker>Final step · Check your understanding</Kicker>
            <Quiz
              questions={lesson.quiz}
              onFinish={(score) => {
                setQuizDone(true)
                onComplete(score, lesson.quiz.length)
              }}
            />
            {(quizDone || completed) && (
              <div className="mt-5">
                <label className="text-xs font-mono text-muted-foreground">MY NOTES (saved on this device)</label>
                <textarea
                  defaultValue={p.notes[lesson.id] || ""}
                  onBlur={(e) => saveNote(e.target.value)}
                  placeholder="One thing I'll try in my next session…"
                  className="w-full mt-1 min-h-[80px] rounded border bg-card p-2 text-sm"
                />
              </div>
            )}
            {lesson.sources && lesson.sources.length > 0 && (
              <div className="mt-5 text-xs text-muted-foreground">
                <div className="font-mono mb-1">GO DEEPER</div>
                <ul className="space-y-1">
                  {lesson.sources.map((s) => (
                    <li key={s.url}>
                      <a className="underline underline-offset-2" href={s.url} target="_blank" rel="noreferrer">
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>

      {/* sticky footer nav */}
      <div className="fixed bottom-[60px] left-0 right-0 z-20 bg-background/95 backdrop-blur border-t">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex gap-2">
          <Button variant="outline" disabled={si === 0} onClick={() => setSi(si - 1)} className="flex-1">
            Back
          </Button>
          {si < stages.length - 1 ? (
            <Button onClick={() => setSi(si + 1)} className="flex-[2]">
              Continue → {stages[si + 1].label}
            </Button>
          ) : onNext ? (
            <Button onClick={onNext} className="flex-[2]" disabled={!quizDone && !completed}>
              Next lesson →
            </Button>
          ) : (
            <Button onClick={onBack} className="flex-[2]">
              Back to level
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-mono uppercase tracking-wider text-primary mb-2">{children}</div>
}

export function Callout({
  tone,
  title,
  children,
}: {
  tone: "warn" | "tip" | "ok"
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-md border-l-4 p-3 my-3 text-sm bg-card border",
        tone === "warn" && "border-l-destructive",
        tone === "tip" && "border-l-amber",
        tone === "ok" && "border-l-sage",
      )}
    >
      <div className="text-xs font-mono uppercase mb-1 opacity-80">
        {tone === "warn" ? "⚠ " : tone === "tip" ? "★ " : "✓ "}
        {title}
      </div>
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}
