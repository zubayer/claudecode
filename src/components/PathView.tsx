import { useState } from "react"
import type { Level } from "@/data/types"
import type { Progress } from "@/lib/store"
import { rankFor, RANKS } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Hero } from "./Art"

export function PathView({
  levels,
  p,
  openLesson,
  nextUp,
  toggleProject,
  onExam,
  examLine,
  coreDone,
}: {
  levels: Level[]
  p: Progress
  openLesson: (levelId: string, lessonId: string) => void
  nextUp: { level: Level; lessonId: string } | null
  toggleProject: (key: string) => void
  onExam: () => void
  examLine: string
  coreDone: boolean
}) {
  const { rank, next } = rankFor(p.xp)
  const pctRank = next ? ((p.xp - rank.xp) / (next.xp - rank.xp)) * 100 : 100
  const goalPct = Math.min(100, (p.todayMinutes / p.dailyGoal) * 100)
  const totalLessons = levels.reduce((a, l) => a + l.lessons.length, 0)
  const doneLessons = Object.keys(p.completed).length
  const [open, setOpen] = useState<string | null>(nextUp?.level.id ?? levels[0].id)

  return (
    <div className="pb-24">
      <Hero />
      <div className="mt-4">
        <div className="text-xs font-mono text-muted-foreground">
          {p.name ? `Welcome back, ${p.name}` : "Welcome"} · rank
        </div>
        <div className="font-display text-3xl leading-none mt-1">{rank.name}</div>
        <div className="mt-3 h-2 bg-muted rounded overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${pctRank}%` }} />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-muted-foreground mt-1">
          <span>{p.xp} XP</span>
          <span>{next ? `${next.xp - p.xp} XP to ${next.name}` : "Max rank"}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <Stat label="streak" value={`${p.streak}🔥`} />
        <Stat label="lessons" value={`${doneLessons}/${totalLessons}`} />
        <div className="rounded-md border bg-card p-2.5 flex items-center gap-2">
          <Ring pct={goalPct} />
          <div>
            <div className="text-sm font-semibold leading-none">
              {p.todayMinutes}/{p.dailyGoal}m
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mt-1">today</div>
          </div>
        </div>
      </div>

      {nextUp && (
        <button
          onClick={() => openLesson(nextUp.level.id, nextUp.lessonId)}
          className="mt-4 w-full text-left rounded-md bg-primary text-primary-foreground p-4 hover:opacity-95"
        >
          <div className="text-[11px] font-mono uppercase opacity-80">Continue · Level {nextUp.level.num}</div>
          <div className="font-display text-xl leading-tight mt-0.5">
            {nextUp.level.lessons.find((l) => l.id === nextUp.lessonId)?.title}
          </div>
          <div className="text-xs opacity-80 mt-1">
            ~{nextUp.level.lessons.find((l) => l.id === nextUp.lessonId)?.minutes} min · tap to start →
          </div>
        </button>
      )}

      <h2 className="font-display text-xl mt-7 mb-3">Your path: zero → professional</h2>
      <ol className="relative border-l-2 border-dashed ml-3 space-y-4">
        {levels.map((lv) => {
          const done = lv.lessons.filter((l) => p.completed[l.id]).length
          const all = done === lv.lessons.length
          const isOpen = open === lv.id
          return (
            <li key={lv.id} className="ml-5">
              <span
                className={cn(
                  "absolute -left-[11px] w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-mono bg-background",
                  all ? "bg-sage border-sage text-black" : done ? "border-primary" : "",
                )}
              >
                {all ? "✓" : lv.num}
              </span>
              <button onClick={() => setOpen(isOpen ? null : lv.id)} className="w-full text-left">
                <div className="text-[11px] font-mono text-muted-foreground uppercase">
                  Level {lv.num} · {lv.rank}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-display text-lg leading-tight">{lv.title}</div>
                  <div className="text-xs font-mono text-muted-foreground shrink-0">
                    {done}/{lv.lessons.length}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{lv.tagline}</div>
              </button>
              {isOpen && (
                <div className="mt-3 animate-pop">
                  <div className="text-xs bg-secondary rounded p-2 mb-2">
                    <span className="font-mono">GOAL ·</span> {lv.goal}
                  </div>
                  <ul className="space-y-1.5">
                    {lv.lessons.map((ls, i) => {
                      const c = p.completed[ls.id]
                      return (
                        <li key={ls.id}>
                          <button
                            onClick={() => openLesson(lv.id, ls.id)}
                            className={cn(
                              "w-full text-left rounded border px-3 py-2.5 flex items-center gap-3 hover:border-primary bg-card",
                              c && "opacity-80",
                            )}
                          >
                            <span
                              className={cn(
                                "w-6 h-6 rounded-full text-[11px] font-mono flex items-center justify-center shrink-0",
                                c ? "bg-sage text-black" : "bg-secondary",
                              )}
                            >
                              {c ? "✓" : i + 1}
                            </span>
                            <span className="flex-1 text-sm leading-snug">{ls.title}</span>
                            <span className="text-[11px] font-mono text-muted-foreground">{ls.minutes}m</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                  <ProjectCard lv={lv} p={p} toggle={toggleProject} />
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <button onClick={onExam} className="mt-8 w-full text-left rounded-md border-2 border-primary p-4 bg-card">
        <div className="text-[11px] font-mono text-primary uppercase">Certification</div>
        <div className="font-display text-xl leading-tight">Final exam →</div>
        <div className="text-sm text-muted-foreground mt-1">
          20 random questions from Levels 0–6. {examLine}.{" "}
          {coreDone ? "All core lessons done: pass it to unlock your certificate." : "Take it anytime; the certificate also needs every core lesson."}
        </div>
      </button>

      <div className="mt-4 rounded-md border p-3 text-xs text-muted-foreground">
        <div className="font-mono mb-1">RANK LADDER</div>
        <div className="flex flex-wrap gap-1.5">
          {RANKS.map((r) => (
            <span key={r.name} className={cn("px-2 py-0.5 rounded border", p.xp >= r.xp && "bg-accent text-accent-foreground")}>
              {r.name} · {r.xp}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ lv, p, toggle }: { lv: Level; p: Progress; toggle: (k: string) => void }) {
  const keys = lv.project.checklist.map((_, i) => `proj-${lv.id}-${i}`)
  const done = keys.filter((k) => p.badges.includes(k)).length
  return (
    <div className="mt-3 rounded-md border-2 border-dashed p-3">
      <div className="text-[11px] font-mono text-amber uppercase">Level project · real-world practice</div>
      <div className="font-semibold mt-0.5">{lv.project.title}</div>
      <p className="text-sm text-muted-foreground mt-1">{lv.project.brief}</p>
      <ul className="mt-2 space-y-1">
        {lv.project.checklist.map((c, i) => (
          <li key={i}>
            <label className="flex gap-2 text-sm items-start cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 accent-[hsl(var(--primary))]"
                checked={p.badges.includes(keys[i])}
                onChange={() => toggle(keys[i])}
              />
              <span>{c}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="text-[11px] font-mono text-muted-foreground mt-2">
        {done}/{keys.length} done · +15 XP each
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card p-2.5">
      <div className="text-lg font-semibold leading-none">{value}</div>
      <div className="text-[10px] font-mono text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

export function Ring({ pct, size = 30 }: { pct: number; size?: number }) {
  const r = size / 2 - 3
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="hsl(var(--sage))"
        strokeWidth="4"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        strokeLinecap="round"
      />
    </svg>
  )
}
