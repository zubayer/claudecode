import { useState } from "react"
import { cn } from "@/lib/utils"
import { HYPE, TITLES, SKILLS_TO_TRY, GLOSSARY, NEWS, RETIRED } from "@/data/library"
import { Md } from "./Md"
import { CheatsView } from "./CheatsView"

const TABS = [
  { k: "cheats", label: "Cheat sheet" },
  { k: "hype", label: "Hype vs reality" },
  { k: "titles", label: "Video titles decoded" },
  { k: "news", label: "This month" },
  { k: "retired", label: "Old tutorial traps" },
  { k: "skills", label: "Skills to install" },
  { k: "glossary", label: "Glossary" },
] as const

export function LibraryView({ initial = "cheats" }: { initial?: (typeof TABS)[number]["k"] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["k"]>(initial)
  const [q, setQ] = useState("")
  return (
    <div className="pb-24">
      <div className="text-[11px] font-mono text-primary uppercase">Library</div>
      <h1 className="font-display text-3xl leading-tight mt-1">Beyond the lessons</h1>
      <div className="flex gap-1.5 overflow-x-auto mt-4 pb-1 -mx-1 px-1">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={cn(
              "shrink-0 text-xs px-2.5 py-1.5 rounded border whitespace-nowrap",
              tab === t.k && "bg-primary text-primary-foreground border-primary",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "cheats" && (
        <div className="-mt-2">
          <CheatsView embedded />
        </div>
      )}

      {tab === "hype" && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Creators often say you're only using a fraction of Claude Code. Here is each common claim, checked against
            evidence.
          </p>
          {HYPE.map((h, i) => (
            <div key={i} className="rounded-md border bg-card p-3">
              <div className="text-[11px] font-mono text-muted-foreground uppercase">claim</div>
              <div className="font-medium leading-snug">“{h.claim}”</div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={cn(
                    "text-[11px] font-mono px-1.5 py-0.5 rounded",
                    h.verdict === "Supported" && "bg-accent text-accent-foreground",
                    h.verdict === "Partly true" && "bg-amber/20 text-amber",
                    h.verdict === "Hype" && "bg-destructive/15 text-destructive",
                  )}
                >
                  {h.verdict}
                </span>
              </div>
              <Md text={h.reality} className="text-sm text-muted-foreground mt-2" />
            </div>
          ))}
        </div>
      )}

      {tab === "titles" && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            The title patterns that dominate Claude Code videos, and what is really inside them.
          </p>
          {TITLES.map((t, i) => (
            <div key={i} className="rounded-md border bg-card p-3">
              <div className="font-display text-lg leading-tight">{t.pattern}</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">e.g. {t.example}</div>
              <Md text={t.inside} className="text-sm mt-2" />
              <div className="text-xs mt-1">
                <span className="font-mono text-sage">WATCH IF · </span>
                {t.watchIf}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "news" && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">What the community talked about in the last 30 days.</p>
          {NEWS.map((n, i) => (
            <div key={i} className="rounded-md border bg-card p-3">
              <div className="text-[11px] font-mono text-muted-foreground uppercase">{n.tag}</div>
              <div className="font-medium leading-snug">{n.title}</div>
              <Md text={n.body} className="text-sm text-muted-foreground mt-1" />
            </div>
          ))}
        </div>
      )}

      {tab === "retired" && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-3">
            Many popular tutorials are a year old. These things changed. If a video shows the left column, use the right.
          </p>
          <div className="rounded-md border overflow-hidden">
            {RETIRED.map((r, i) => (
              <div key={i} className={cn("grid grid-cols-2 text-sm", i % 2 ? "bg-card" : "bg-background")}>
                <div className="p-2.5 border-r line-through decoration-destructive/60 opacity-75">
                  <Md text={r.old} />
                </div>
                <div className="p-2.5">
                  <Md text={r.now} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "skills" && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Popular, reputable skills and plugins to try once you reach Level 4. Always read a skill's SKILL.md before
            installing it; skills can run scripts.
          </p>
          {SKILLS_TO_TRY.map((s, i) => (
            <div key={i} className="rounded-md border bg-card p-3">
              <div className="flex justify-between gap-2">
                <div className="font-medium">{s.name}</div>
                <div className="text-[11px] font-mono text-muted-foreground shrink-0">{s.source}</div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{s.what}</p>
              <pre className="term rounded p-2 mt-2 text-[11.5px] overflow-x-auto">{s.install}</pre>
            </div>
          ))}
        </div>
      )}

      {tab === "glossary" && (
        <div className="mt-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms…"
            className="w-full rounded border bg-card px-3 py-2 text-sm"
          />
          <dl className="mt-3 divide-y border rounded-md bg-card">
            {GLOSSARY.filter((g) => (g.term + g.def).toLowerCase().includes(q.toLowerCase())).map((g) => (
              <div key={g.term} className="p-3">
                <dt className="font-mono text-sm text-primary">{g.term}</dt>
                <dd className="text-sm mt-0.5">{g.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}
