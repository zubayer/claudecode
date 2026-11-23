import { useMemo, useState } from "react"
import { useProgress, rankFor } from "@/lib/store"
import { LEVELS, CORE_LEVELS, EXAM_POOL } from "@/data/curriculum"
import { GRILL } from "@/data/grill"
import { GLOSSARY } from "@/data/library"
import { PathView } from "@/components/PathView"
import { LessonPlayer } from "@/components/LessonPlayer"
import { GrillView } from "@/components/GrillView"
import { ReviewView, type Card } from "@/components/ReviewView"
import { LibraryView } from "@/components/LibraryView"
import { LabsView } from "@/components/LabsView"
import { ExamView, EXAM_PASS, EXAM_SIZE } from "@/components/ExamView"
import { Onboarding } from "@/components/Onboarding"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Tab = "path" | "grill" | "review" | "labs" | "library"

const BADGES: Record<string, { icon: string; name: string; desc: string }> = {
  first: { icon: "🌱", name: "First step", desc: "Completed your first lesson" },
  perfect: { icon: "🎯", name: "Sharpshooter", desc: "Perfect score on a quiz" },
  streak3: { icon: "🔥", name: "On a roll", desc: "3-day streak" },
  streak7: { icon: "🌋", name: "Habit formed", desc: "7-day streak" },
  grill: { icon: "🥩", name: "Well done", desc: "Scored 8+ in a Grill Me round" },
  level: { icon: "🏔️", name: "Summit", desc: "Completed a full level" },
  pro: { icon: "🎓", name: "Professional", desc: "Completed every core lesson" },
  exam: { icon: "📜", name: "Certified", desc: `Passed the final exam` },
  builder: { icon: "🧪", name: "Builder", desc: "Used all four Lab tools" },
}

export default function App() {
  const { p, update, activity, reset } = useProgress()
  const [tab, setTab] = useState<Tab>("path")
  const [open, setOpen] = useState<{ levelId: string; lessonId: string } | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [settings, setSettings] = useState(false)
  const [exam, setExam] = useState(false)

  const flash = (t: string) => {
    setToast(t)
    window.setTimeout(() => setToast(null), 2600)
  }
  const award = (id: string) => {
    if (!p.badges.includes(id)) {
      update((x) => (x.badges.includes(id) ? x : { ...x, badges: [...x.badges, id] }))
      if (BADGES[id]) flash(`${BADGES[id].icon} Badge: ${BADGES[id].name}`)
    }
  }

  const allLessons = useMemo(() => LEVELS.flatMap((l) => l.lessons.map((ls) => ({ level: l, lesson: ls }))), [])

  const nextUp = useMemo(() => {
    const start = allLessons.findIndex((x) => x.level.num >= p.startLevel)
    const order = [...allLessons.slice(Math.max(0, start)), ...allLessons.slice(0, Math.max(0, start))]
    const n = order.find((x) => !p.completed[x.lesson.id])
    return n ? { level: n.level, lessonId: n.lesson.id } : null
  }, [allLessons, p.completed, p.startLevel])

  const cards: Card[] = useMemo(() => {
    const c: Card[] = GLOSSARY.map((g) => ({ id: "g-" + g.term, front: `What is ${g.term}?`, back: g.def, tag: "glossary" }))
    for (const { level, lesson } of allLessons) {
      if (!p.completed[lesson.id]) continue
      lesson.quiz.forEach((q, i) =>
        c.push({
          id: `${lesson.id}-q${i}`,
          front: q.q,
          back: `${q.options[q.answer]}. ${q.why}`,
          tag: `L${level.num} · ${lesson.title}`,
        }),
      )
    }
    return c
  }, [allLessons, p.completed])

  if (!p.onboarded) {
    return (
      <div className={p.dark ? "dark" : ""}>
        <div className="bg-background text-foreground min-h-screen">
          <Onboarding
            onDone={(name, startLevel, dailyGoal) => update((x) => ({ ...x, name, startLevel, dailyGoal, onboarded: true }))}
          />
        </div>
      </div>
    )
  }

  const current = open
    ? (() => {
        const level = LEVELS.find((l) => l.id === open.levelId)!
        const idx = level.lessons.findIndex((l) => l.id === open.lessonId)
        return { level, lesson: level.lessons[idx], idx }
      })()
    : null

  const { rank } = rankFor(p.xp)
  const totalLessons = allLessons.length
  const coreIds = CORE_LEVELS.flatMap((l) => l.lessons.map((x) => x.id))
  const coreDone = coreIds.every((id) => p.completed[id])
  const allDone = coreDone && p.examBest >= EXAM_PASS

  return (
    <div className={p.dark ? "dark" : ""}>
      <div className="bg-background text-foreground min-h-screen">
        {/* header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
          <div className="max-w-2xl mx-auto px-4 h-12 flex items-center gap-2">
            <button
              onClick={() => {
                setOpen(null)
                setExam(false)
                setTab("path")
              }}
              className="font-display text-[17px] leading-none mr-auto"
            >
              cc<span className="text-primary">/</span>academy
            </button>
            <span className="text-xs font-mono px-2 py-1 rounded bg-secondary">{p.streak}🔥</span>
            <span className="text-xs font-mono px-2 py-1 rounded bg-secondary">{p.xp} XP</span>
            <button
              title="Caveman mode: ultra-short TL;DR on every lesson"
              onClick={() => {
                update((x) => ({ ...x, caveman: !x.caveman }))
                flash(p.caveman ? "Caveman mode off" : "🪨 Caveman mode on. Short words. Big idea.")
              }}
              className={cn("text-sm w-8 h-8 rounded border", p.caveman && "bg-amber/25 border-amber")}
            >
              🪨
            </button>
            <button onClick={() => setSettings(true)} className="text-sm w-8 h-8 rounded border" title="Profile & settings">
              ☰
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 pt-4">
          {current ? (
            <LessonPlayer
              level={current.level}
              lesson={current.lesson}
              p={p}
              onBack={() => setOpen(null)}
              onNext={
                current.idx + 1 < current.level.lessons.length
                  ? () => setOpen({ levelId: current.level.id, lessonId: current.level.lessons[current.idx + 1].id })
                  : null
              }
              saveNote={(t) => update((x) => ({ ...x, notes: { ...x.notes, [current.lesson.id]: t } }))}
              onComplete={(score, total) => {
                const pct = score / total
                const prevBest = p.quizBest[current.lesson.id] ?? 0
                update((x) => ({ ...x, quizBest: { ...x.quizBest, [current.lesson.id]: Math.max(prevBest, score) } }))
                if (pct < 0.6) return
                const first = !p.completed[current.lesson.id]
                const xp = first ? 20 + score * 5 + (pct === 1 ? 10 : 0) : score > prevBest ? (score - prevBest) * 5 : 0
                activity(first ? current.lesson.minutes : 2, xp)
                if (first) {
                  update((x) => ({ ...x, completed: { ...x.completed, [current.lesson.id]: { at: Date.now(), score } } }))
                  flash(`+${xp} XP · lesson complete`)
                  if (Object.keys(p.completed).length === 0) award("first")
                  const lvDone = current.level.lessons.every((l) => l.id === current.lesson.id || p.completed[l.id])
                  if (lvDone) window.setTimeout(() => award("level"), 900)
                  if (coreIds.every((id) => id === current.lesson.id || p.completed[id])) window.setTimeout(() => award("pro"), 1800)
                }
                if (pct === 1) window.setTimeout(() => award("perfect"), 400)
                if (p.streak + 1 >= 3) award("streak3")
                if (p.streak + 1 >= 7) award("streak7")
              }}
            />
          ) : exam ? (
            <ExamView
              pool={EXAM_POOL}
              best={p.examBest}
              onBack={() => setExam(false)}
              onFinish={(score) => {
                const prev = p.examBest
                update((x) => ({ ...x, examBest: Math.max(x.examBest, score) }))
                activity(10, score > prev ? (score - prev) * 5 : 5)
                if (score >= EXAM_PASS) window.setTimeout(() => award("exam"), 600)
              }}
            />
          ) : tab === "path" ? (
            <>
              <PathView
                levels={LEVELS}
                p={p}
                nextUp={nextUp}
                openLesson={(levelId, lessonId) => setOpen({ levelId, lessonId })}
                onExam={() => {
                  setExam(true)
                  window.scrollTo({ top: 0 })
                }}
                examLine={`Best ${p.examBest}/${EXAM_SIZE} · pass at ${EXAM_PASS}`}
                coreDone={coreDone}
                toggleProject={(k) => {
                  const had = p.badges.includes(k)
                  update((x) => ({ ...x, badges: had ? x.badges.filter((b) => b !== k) : [...x.badges, k] }))
                  if (!had) {
                    activity(5, 15)
                    flash("+15 XP · project step")
                  }
                }}
              />
              {allDone && <Certificate name={p.name} rank={rank.name} xp={p.xp} />}
            </>
          ) : tab === "grill" ? (
            <GrillView
              pool={GRILL}
              p={p}
              rate={(id, r) => update((x) => ({ ...x, grill: { ...x.grill, [id]: Math.max(x.grill[id] ?? -1, r) } }))}
              onRoundDone={(pts) => {
                activity(5, pts * 3)
                flash(`+${pts * 3} XP · grill round`)
                if (pts >= 8) award("grill")
              }}
            />
          ) : tab === "review" ? (
            <ReviewView
              key={cards.length}
              cards={cards}
              p={p}
              grade={(id, box, due, correct) => {
                update((x) => ({ ...x, cards: { ...x.cards, [id]: { box, due } } }))
                if (correct) activity(0.5, 2)
              }}
            />
          ) : tab === "labs" ? (
            <LabsView
              onUse={(xp, label) => {
                const key = "lab-" + label
                if (p.badges.includes(key)) return
                update((x) => ({ ...x, badges: [...x.badges, key] }))
                activity(2, xp)
                flash(`+${xp} XP · ${label}`)
                const labs = ["lab-prompt checked", "lab-CLAUDE.md copied", "lab-skill copied", "lab-settings copied"]
                if (labs.every((l) => l === key || p.badges.includes(l))) window.setTimeout(() => award("builder"), 900)
              }}
            />
          ) : (
            <LibraryView />
          )}
        </main>

        {/* bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t">
          <div className="max-w-2xl mx-auto grid grid-cols-5 h-[60px]">
            {(
              [
                ["path", "🧭", "Path"],
                ["grill", "🔥", "Grill Me"],
                ["review", "🃏", "Review"],
                ["labs", "🧪", "Labs"],
                ["library", "📚", "Library"],
              ] as [Tab, string, string][]
            ).map(([k, icon, label]) => (
              <button
                key={k}
                onClick={() => {
                  setOpen(null)
                  setExam(false)
                  setTab(k)
                  window.scrollTo({ top: 0 })
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 text-[11px]",
                  tab === k && !open && !exam ? "text-primary font-semibold" : "text-muted-foreground",
                )}
              >
                <span className="text-lg leading-none">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </nav>

        {toast && (
          <div className="fixed bottom-[132px] left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
            <div className="animate-pop rounded-md bg-foreground text-background px-4 py-2 text-sm shadow-lg">{toast}</div>
          </div>
        )}

        {settings && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSettings(false)}>
            <div
              className="absolute right-0 top-0 bottom-0 w-[86%] max-w-sm bg-background border-l p-5 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <div className="font-display text-2xl">{p.name || "Your profile"}</div>
                <button onClick={() => setSettings(false)} className="text-xl">
                  ×
                </button>
              </div>
              <div className="text-sm text-muted-foreground">
                {rank.name} · {p.xp} XP · {Object.keys(p.completed).length}/{totalLessons} lessons · exam best {p.examBest}/{EXAM_SIZE}
              </div>

              <h3 className="text-xs font-mono uppercase text-muted-foreground mt-6 mb-2">Badges</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(BADGES).map(([id, b]) => (
                  <div key={id} className={cn("rounded border p-2 text-xs", !p.badges.includes(id) && "opacity-40 grayscale")}>
                    <div className="text-xl">{b.icon}</div>
                    <div className="font-semibold">{b.name}</div>
                    <div className="text-muted-foreground">{b.desc}</div>
                  </div>
                ))}
              </div>

              <h3 className="text-xs font-mono uppercase text-muted-foreground mt-6 mb-2">Last 14 days</h3>
              <Heat history={p.history} goal={p.dailyGoal} />

              <h3 className="text-xs font-mono uppercase text-muted-foreground mt-6 mb-2">Daily goal</h3>
              <div className="flex gap-1.5">
                {[5, 15, 30, 60].map((g) => (
                  <button
                    key={g}
                    onClick={() => update((x) => ({ ...x, dailyGoal: g }))}
                    className={cn("flex-1 rounded border py-2 text-sm", p.dailyGoal === g && "bg-primary text-primary-foreground border-primary")}
                  >
                    {g}m
                  </button>
                ))}
              </div>

              <h3 className="text-xs font-mono uppercase text-muted-foreground mt-6 mb-2">Display</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => update((x) => ({ ...x, dark: !x.dark }))}>
                  {p.dark ? "☀ Light" : "☾ Dark"}
                </Button>
                <Button variant="outline" onClick={() => update((x) => ({ ...x, caveman: !x.caveman }))}>
                  🪨 Caveman {p.caveman ? "on" : "off"}
                </Button>
              </div>

              <h3 className="text-xs font-mono uppercase text-muted-foreground mt-6 mb-2">Progress</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Progress is stored in this browser only. It may be cleared if you clear site data.
              </p>
              <ResetButton
                onReset={() => {
                  reset()
                  setSettings(false)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Heat({ history, goal }: { history: Record<string, number>; goal: number }) {
  const days = [...Array(14)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    return { k, m: history[k] || 0, label: d.toLocaleDateString(undefined, { weekday: "narrow" }) }
  })
  return (
    <div className="grid grid-cols-14 gap-1" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
      {days.map((d) => (
        <div key={d.k} className="text-center">
          <div
            className="aspect-square rounded-sm border"
            title={`${d.k}: ${Math.round(d.m)} min`}
            style={{
              background: d.m ? `hsl(var(--sage) / ${Math.min(1, 0.25 + d.m / goal)})` : "transparent",
            }}
          />
          <div className="text-[8px] font-mono text-muted-foreground mt-0.5">{d.label}</div>
        </div>
      ))}
    </div>
  )
}

function Certificate({ name, rank, xp }: { name: string; rank: string; xp: number }) {
  return (
    <div className="mb-28 rounded-md border-4 border-double border-primary p-6 text-center bg-card">
      <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Certificate of completion</div>
      <div className="font-display text-3xl mt-3">{name || "Claude Code learner"}</div>
      <p className="text-sm text-muted-foreground mt-2">
        completed all seven core levels of Claude Code Academy and passed the final exam, from first session to professional practice.
      </p>
      <div className="mt-3 font-mono text-xs">
        Rank: {rank} · {xp} XP · {new Date().toLocaleDateString()}
      </div>
      <p className="text-xs text-muted-foreground mt-4">Take a screenshot to share it.</p>
    </div>
  )
}

function ResetButton({ onReset }: { onReset: () => void }) {
  const [armed, setArmed] = useState(false)
  return armed ? (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" onClick={() => setArmed(false)}>
        Cancel
      </Button>
      <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={onReset}>
        Yes, erase all
      </Button>
    </div>
  ) : (
    <Button variant="outline" className="w-full text-destructive" onClick={() => setArmed(true)}>
      Reset progress
    </Button>
  )
}
