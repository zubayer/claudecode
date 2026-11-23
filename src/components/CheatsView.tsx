import { useState } from "react"
import { CHEATS } from "@/data/library"

export function CheatsView({ embedded = false }: { embedded?: boolean }) {
  const [q, setQ] = useState("")
  const f = q.toLowerCase()
  return (
    <div className={embedded ? "" : "pb-24"}>
      {!embedded && (
        <>
          <div className="text-[11px] font-mono text-primary uppercase">Quick reference</div>
          <h1 className="font-display text-3xl leading-tight mt-1">Cheat sheet</h1>
        </>
      )}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search commands, keys, files…"
        className="w-full rounded border bg-card px-3 py-2 text-sm mt-4"
        autoCapitalize="none"
      />
      {CHEATS.map((sec) => {
        const rows = sec.rows.filter((r) => (r[0] + r[1]).toLowerCase().includes(f))
        if (!rows.length) return null
        return (
          <section key={sec.title} className="mt-5">
            <h2 className="text-xs font-mono uppercase text-muted-foreground mb-1.5">{sec.title}</h2>
            <div className="rounded-md border divide-y bg-card">
              {rows.map(([k, v]) => (
                <div key={k} className="flex gap-3 p-2.5 text-sm">
                  <code className="font-mono text-[12.5px] text-primary shrink-0 max-w-[48%] break-all">{k}</code>
                  <span className="text-muted-foreground leading-snug">{v}</span>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
