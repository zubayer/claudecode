import { useEffect, useRef, useState } from "react"
import type { TermStep } from "@/data/types"
import { cn } from "@/lib/utils"

type Line = { kind: "in" | "out" | "note" | "err"; text: string }

const norm = (s: string) => {
  const base = s.trim().toLowerCase()
  const stripped = base.replace(/[,:;?'"“”.]+(?=\s|$)/g, "").replace(/\s+/g, " ").trim()
  return stripped || base
}

export function Terminal({
  intro,
  steps,
  onDone,
}: {
  intro: string
  steps: TermStep[]
  onDone?: () => void
}) {
  const [idx, setIdx] = useState(0)
  const [lines, setLines] = useState<Line[]>([{ kind: "note", text: intro }])
  const [val, setVal] = useState("")
  const [typing, setTyping] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const done = idx >= steps.length

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" })
  }, [lines])

  function run(input: string) {
    if (done || typing) return
    const step = steps[idx]
    const ok = [step.cmd, ...(step.accept || [])].map(norm).includes(norm(input))
    if (!ok) {
      setLines((l) => [
        ...l,
        { kind: "in", text: input },
        { kind: "err", text: `Not quite. Hint: try  ${step.cmd}` },
      ])
      setVal("")
      return
    }
    setLines((l) => [...l, { kind: "in", text: input }])
    setVal("")
    setTyping(true)
    let k = 0
    const timer = setInterval(() => {
      if (k < step.out.length) {
        const t = step.out[k++]
        setLines((l) => [...l, { kind: "out", text: t }])
      } else {
        clearInterval(timer)
        if (step.note) setLines((l) => [...l, { kind: "note", text: "💡 " + step.note }])
        setTyping(false)
        const n = idx + 1
        setIdx(n)
        if (n >= steps.length) onDone?.()
      }
    }, 180)
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="term flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#e06c5a]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#e8b04b]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#8fb996]" />
        <span className="ml-2 text-[11px] opacity-60 font-mono">~/my-project — claude (simulated)</span>
        <span className="ml-auto text-[11px] opacity-60 font-mono">
          {Math.min(idx, steps.length)}/{steps.length}
        </span>
      </div>
      <div ref={box} className="term font-mono text-[12.5px] leading-relaxed p-3 h-64 overflow-y-auto">
        {lines.map((l, i) => (
          <div
            key={i}
            className={cn(
              "whitespace-pre-wrap break-words",
              l.kind === "in" && "text-[#e8b04b]",
              l.kind === "note" && "text-[#8fb996] italic",
              l.kind === "err" && "text-[#e06c5a]",
            )}
          >
            {l.kind === "in" ? "› " + l.text : l.text}
          </div>
        ))}
        {!done && !typing && <div className="caret opacity-70">› </div>}
        {done && <div className="text-[#8fb996] mt-2">✓ Simulation complete</div>}
      </div>
      {!done && (
        <div className="term border-t border-white/10 p-2 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (val.trim()) run(val)
            }}
            className="flex gap-2"
          >
            <input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="type a command or prompt…"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="flex-1 bg-transparent border border-white/15 rounded px-2 py-1.5 font-mono text-[13px] outline-none focus:border-[#e8b04b]"
            />
            <button className="px-3 rounded bg-[#e07a4f] text-black text-sm font-medium">Run</button>
          </form>
          <button
            onClick={() => run(steps[idx].cmd)}
            disabled={typing}
            className="w-full text-left font-mono text-[12px] px-2 py-1.5 rounded border border-dashed border-white/20 hover:border-[#e8b04b] disabled:opacity-40"
          >
            tap to run: <span className="text-[#e8b04b]">{steps[idx].cmd}</span>
          </button>
        </div>
      )}
    </div>
  )
}
