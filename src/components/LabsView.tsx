import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const TOOLS = [
  { k: "prompt", label: "Prompt clinic", sub: "Score a prompt, get a better one" },
  { k: "claudemd", label: "CLAUDE.md builder", sub: "Lean memory file in 2 minutes" },
  { k: "skill", label: "Skill builder", sub: "Write a SKILL.md that triggers" },
  { k: "settings", label: "Settings builder", sub: "Permissions, hooks, sandbox" },
] as const
type ToolKey = (typeof TOOLS)[number]["k"]

export function LabsView({ onUse }: { onUse: (xp: number, label: string) => void }) {
  const [tool, setTool] = useState<ToolKey>("prompt")
  return (
    <div className="pb-24">
      <div className="text-[11px] font-mono text-primary uppercase">Labs</div>
      <h1 className="font-display text-3xl leading-tight mt-1">Build the real files</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Tools that produce things you paste straight into Claude Code. Everything stays in your browser.
      </p>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {TOOLS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTool(t.k)}
            className={cn("rounded-md border p-2.5 text-left bg-card", tool === t.k && "border-primary ring-1 ring-primary")}
          >
            <div className="text-sm font-semibold leading-tight">{t.label}</div>
            <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">{t.sub}</div>
          </button>
        ))}
      </div>
      <div className="mt-5">
        {tool === "prompt" && <PromptClinic onUse={onUse} />}
        {tool === "claudemd" && <ClaudeMdBuilder onUse={onUse} />}
        {tool === "skill" && <SkillBuilder onUse={onUse} />}
        {tool === "settings" && <SettingsBuilder onUse={onUse} />}
      </div>
    </div>
  )
}

/* ---------- shared ---------- */

function CopyBlock({ text, file, onCopied }: { text: string; file?: string; onCopied?: () => void }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle")
  return (
    <div className="rounded-md border overflow-hidden mt-3">
      <div className="term flex items-center justify-between px-3 py-1.5 border-b border-white/10">
        <span className="font-mono text-[11px] opacity-70 truncate">{file || "output"}</span>
        <button
          className="text-[12px] px-2.5 py-1 rounded bg-[#e07a4f] text-black font-medium shrink-0"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text)
              setState("ok")
              onCopied?.()
            } catch {
              setState("fail")
            }
            window.setTimeout(() => setState("idle"), 2200)
          }}
        >
          {state === "ok" ? "Copied ✓" : state === "fail" ? "Select & copy" : "Copy"}
        </button>
      </div>
      <pre className="term p-3 text-[12px] overflow-x-auto whitespace-pre leading-relaxed max-h-[420px] overflow-y-auto select-all">{text}</pre>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block mt-3">
      <span className="text-xs font-mono text-muted-foreground uppercase">{label}</span>
      {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  )
}
const inputCls = "w-full rounded border bg-card px-3 py-2 text-[16px] sm:text-sm"

/* ---------- 1. Prompt clinic ---------- */

const CHECKS = [
  {
    k: "outcome",
    label: "Outcome",
    tip: "Say what should be true when done, not just the action (“users can export names with accents”).",
    test: (s: string) => s.split(/\s+/).filter(Boolean).length >= 8 && /\b(so that|should|users?|when|where|returns?|shows?|can|must|expected|instead of)\b/i.test(s),
  },
  {
    k: "where",
    label: "Location",
    tip: "Point at files or patterns: @src/file.ts, “follow how X does it”.",
    test: (s: string) => /@\S+|\b[\w-]+\/[\w./-]+|\.\w{1,5}\b|\bfollow (how|the)\b|\blike\b.*\bdoes\b/i.test(s),
  },
  {
    k: "constraint",
    label: "Constraints",
    tip: "Say what not to touch or what to use: “don't change the API”, “use zod”.",
    test: (s: string) => /\b(don'?t|do not|only|without|never|must not|avoid|keep|use )\b/i.test(s),
  },
  {
    k: "proof",
    label: "Proof",
    tip: "Ask for evidence: “add a test, run it and show the output”, “screenshot the page”.",
    test: (s: string) => /\b(test|tests|run|show me|output|screenshot|verify|prove|build|lint|typecheck)\b/i.test(s),
  },
]

const SAMPLES = [
  "fix the bug",
  "make the dashboard faster",
  "The CSV export in @src/export/csv.ts drops names with accents (e.g. “Zoë”). Users should get UTF-8 output. Follow how @src/export/json.ts handles encoding, don't change the public API, add a test with an accented name, run it and show me the output.",
]

function PromptClinic({ onUse }: { onUse: (xp: number, l: string) => void }) {
  const [text, setText] = useState("")
  const [checked, setChecked] = useState(false)
  const results = CHECKS.map((c) => ({ ...c, ok: c.test(text) }))
  const score = results.filter((r) => r.ok).length
  const improved = useMemo(() => {
    const t = text.trim() || "<what you want>"
    const parts = [t.replace(/[.\s]+$/, "") + "."]
    if (!results[1].ok) parts.push("The relevant code is in @<path/to/file> (follow the pattern in @<similar/file>).")
    if (!results[0].ok) parts.push("Done means: <what a user or test should observe>.")
    if (!results[2].ok) parts.push("Don't change <what must stay the same>.")
    if (!results[3].ok) parts.push("Add or update a test that proves it, run it, and show me the command and its output.")
    return parts.join("\n")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, score])

  return (
    <div>
      <h2 className="font-display text-xl">Prompt clinic</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Good prompts read like good tickets. Paste one you'd send Claude Code and get it checked for the four ingredients:
        outcome, location, constraints, proof.
      </p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {SAMPLES.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setText(s)
              setChecked(false)
            }}
            className="text-[11px] px-2 py-1 rounded border bg-card"
          >
            {i === 0 ? "Try: vague" : i === 1 ? "Try: medium" : "Try: strong"}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setChecked(false)
        }}
        placeholder="e.g. fix the login bug…"
        className="w-full mt-2 min-h-[120px] rounded border bg-card p-3 text-[16px] sm:text-sm"
      />
      <Button
        className="w-full mt-2"
        disabled={!text.trim()}
        onClick={() => {
          setChecked(true)
          onUse(5, "prompt checked")
        }}
      >
        Check my prompt
      </Button>

      {checked && (
        <div className="mt-4 animate-pop">
          <div className="flex items-baseline gap-3">
            <div className="font-display text-4xl">{score}/4</div>
            <div className="text-sm text-muted-foreground">
              {score === 4 ? "Ready to send." : score >= 2 ? "Close. Add what's missing." : "Too vague: Claude will have to guess."}
            </div>
          </div>
          <div className="grid gap-2 mt-3">
            {results.map((r) => (
              <div key={r.k} className={cn("rounded border p-2.5 text-sm bg-card", r.ok ? "border-sage" : "border-destructive/60")}>
                <span className={cn("font-semibold", r.ok ? "text-sage" : "text-destructive")}>
                  {r.ok ? "✓" : "✕"} {r.label}
                </span>
                {!r.ok && <div className="text-muted-foreground text-[13px] mt-0.5">{r.tip}</div>}
              </div>
            ))}
          </div>
          {score < 4 && (
            <>
              <div className="text-xs font-mono text-muted-foreground mt-4">IMPROVED TEMPLATE · fill the &lt;blanks&gt;</div>
              <CopyBlock text={improved} file="prompt.txt" />
            </>
          )}
          <p className="text-[11px] text-muted-foreground mt-2">
            The checker uses simple keyword rules, so treat it as a nudge, not a grade.
          </p>
        </div>
      )}
    </div>
  )
}

/* ---------- 2. CLAUDE.md builder ---------- */

function ClaudeMdBuilder({ onUse }: { onUse: (xp: number, l: string) => void }) {
  const [install, setInstall] = useState("pnpm install")
  const [test, setTest] = useState("pnpm vitest run path/to/file.test.ts")
  const [typecheck, setTypecheck] = useState("pnpm tsc --noEmit")
  const [lint, setLint] = useState("pnpm lint")
  const [conv, setConv] = useState("Use the error helpers in src/lib/errors.ts, never throw raw strings\nsrc/legacy/ is still live but don't copy its patterns")
  const [gotchas, setGotchas] = useState("Integration tests need DATABASE_URL set, see .env.example")
  const [importAgents, setImportAgents] = useState(false)

  const out = useMemo(() => {
    const lines: string[] = []
    if (importAgents) lines.push("@AGENTS.md", "")
    const cmds = [
      ["Install", install],
      ["Run one test file", test],
      ["Typecheck", typecheck],
      ["Lint", lint],
    ].filter(([, v]) => v.trim())
    if (cmds.length) {
      lines.push("# Commands")
      cmds.forEach(([k, v]) => lines.push(`- ${k}: ${v.trim()}`))
    }
    const list = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean)
    if (list(conv).length) {
      lines.push("# Conventions")
      list(conv).forEach((c) => lines.push(`- ${c}`))
    }
    if (list(gotchas).length) {
      lines.push("# Gotchas")
      list(gotchas).forEach((c) => lines.push(`- ${c}`))
    }
    return lines.join("\n")
  }, [install, test, typecheck, lint, conv, gotchas, importAgents])

  const n = out.split("\n").length
  const shouting = /\b[A-Z]{5,}\b/.test(conv + gotchas) || /IMPORTANT/.test(conv + gotchas)
  const archTour = /\b(folder structure|architecture|directory layout|the app consists of)\b/i.test(conv + gotchas)

  return (
    <div>
      <h2 className="font-display text-xl">CLAUDE.md builder</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Only what Claude can't learn from reading the code: exact commands, conventions, traps. Save the result as
        <code className="mx-1 text-[12px]">./CLAUDE.md</code>at your project root and commit it.
      </p>
      <Field label="Install command">
        <input className={inputCls} value={install} onChange={(e) => setInstall(e.target.value)} />
      </Field>
      <Field label="Run one test file">
        <input className={inputCls} value={test} onChange={(e) => setTest(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Typecheck">
          <input className={inputCls} value={typecheck} onChange={(e) => setTypecheck(e.target.value)} />
        </Field>
        <Field label="Lint">
          <input className={inputCls} value={lint} onChange={(e) => setLint(e.target.value)} />
        </Field>
      </div>
      <Field label="Conventions" hint="One per line. Things you've corrected twice belong here.">
        <textarea className={cn(inputCls, "min-h-[80px]")} value={conv} onChange={(e) => setConv(e.target.value)} />
      </Field>
      <Field label="Gotchas" hint="One per line. Where the code misleads.">
        <textarea className={cn(inputCls, "min-h-[60px]")} value={gotchas} onChange={(e) => setGotchas(e.target.value)} />
      </Field>
      <label className="flex gap-2 items-center mt-3 text-sm">
        <input type="checkbox" checked={importAgents} onChange={(e) => setImportAgents(e.target.checked)} />
        Repo already has an AGENTS.md (import it)
      </label>

      <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] font-mono">
        <span className={cn("px-2 py-0.5 rounded border", n <= 200 ? "border-sage text-sage" : "border-destructive text-destructive")}>
          {n} lines {n <= 200 ? "✓ under 200" : "✕ over 200"}
        </span>
        {shouting && <span className="px-2 py-0.5 rounded border border-amber text-amber">ALL-CAPS found: it makes Claude over-apply rules</span>}
        {archTour && <span className="px-2 py-0.5 rounded border border-amber text-amber">Architecture tour? Claude reads the repo itself</span>}
      </div>
      <CopyBlock text={out} file="./CLAUDE.md" onCopied={() => onUse(10, "CLAUDE.md copied")} />
    </div>
  )
}

/* ---------- 3. Skill builder ---------- */

function SkillBuilder({ onUse }: { onUse: (xp: number, l: string) => void }) {
  const [name, setName] = useState("summarize-changes")
  const [desc, setDesc] = useState(
    "Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.",
  )
  const [scope, setScope] = useState<"project" | "personal">("project")
  const [tools, setTools] = useState("Bash(git diff *)")
  const [shell, setShell] = useState("git diff HEAD")
  const [body, setBody] = useState("Summarize the changes above in two or three bullet points, then list any risks you notice.")
  const [manualOnly, setManualOnly] = useState(false)
  const [fork, setFork] = useState(false)

  const slug = name.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || "my-skill"
  const path = scope === "project" ? `.claude/skills/${slug}/SKILL.md` : `~/.claude/skills/${slug}/SKILL.md`
  const tick = "`"
  const out = [
    "---",
    `name: ${slug}`,
    `description: ${desc.trim().replace(/\n+/g, " ")}`,
    ...(tools.trim() ? [`allowed-tools: ${tools.trim()}`] : []),
    ...(manualOnly ? ["disable-model-invocation: true"] : []),
    ...(fork ? ["context: fork"] : []),
    "---",
    ...(shell.trim() ? ["## Context", `!${tick}${shell.trim()}${tick}`, ""] : []),
    "## Instructions",
    body.trim() || "Describe the steps Claude should follow. Use $ARGUMENTS for input.",
  ].join("\n")

  const saysWhat = desc.trim().split(/\s+/).length >= 6
  const saysWhen = /\buse (when|for|if)\b|\bwhen the user\b/i.test(desc)
  const lines = out.split("\n").length

  return (
    <div>
      <h2 className="font-display text-xl">Skill builder</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Claude only sees the name and description until the skill is needed, so the description decides whether it ever
        triggers.
      </p>
      <Field label="Name" hint={`Becomes /${slug}`}>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Description" hint="Say what it does AND when to use it.">
        <textarea className={cn(inputCls, "min-h-[80px]")} value={desc} onChange={(e) => setDesc(e.target.value)} />
      </Field>
      <div className="flex gap-1.5 mt-2 text-[11px] font-mono flex-wrap">
        <span className={cn("px-2 py-0.5 rounded border", saysWhat ? "border-sage text-sage" : "border-destructive text-destructive")}>
          {saysWhat ? "✓" : "✕"} says what
        </span>
        <span className={cn("px-2 py-0.5 rounded border", saysWhen ? "border-sage text-sage" : "border-destructive text-destructive")}>
          {saysWhen ? "✓" : "✕"} says when (“Use when…”)
        </span>
      </div>
      <Field label="Where">
        <div className="grid grid-cols-2 gap-2">
          {(["project", "personal"] as const).map((s) => (
            <button
              key={s}
              onClick={(e) => {
                e.preventDefault()
                setScope(s)
              }}
              className={cn("rounded border py-2 text-sm", scope === s && "bg-primary text-primary-foreground border-primary")}
            >
              {s === "project" ? "Project (team)" : "Personal (me)"}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Allowed tools (optional)" hint="Scope what it may run, e.g. Bash(git diff *)">
        <input className={inputCls} value={tools} onChange={(e) => setTools(e.target.value)} />
      </Field>
      <Field label="Shell command to inline (optional)" hint="Runs before the skill is sent; its output is pasted in">
        <input className={inputCls} value={shell} onChange={(e) => setShell(e.target.value)} />
      </Field>
      <Field label="Instructions">
        <textarea className={cn(inputCls, "min-h-[90px]")} value={body} onChange={(e) => setBody(e.target.value)} />
      </Field>
      <div className="mt-3 space-y-1.5 text-sm">
        <label className="flex gap-2 items-center">
          <input type="checkbox" checked={manualOnly} onChange={(e) => setManualOnly(e.target.checked)} />
          Only run when I type /{slug} (no auto-trigger)
        </label>
        <label className="flex gap-2 items-center">
          <input type="checkbox" checked={fork} onChange={(e) => setFork(e.target.checked)} />
          Run in a subagent (context: fork)
        </label>
      </div>
      <div className="text-[11px] font-mono text-muted-foreground mt-3">
        {lines} lines · keep SKILL.md under 500; put long references in extra files
      </div>
      <CopyBlock text={out} file={path} onCopied={() => onUse(10, "skill copied")} />
    </div>
  )
}

/* ---------- 4. Settings builder ---------- */

const ALLOW = [
  ["Bash(npm run test *)", "Run tests"],
  ["Bash(npm run lint)", "Run lint"],
  ["Bash(npx tsc --noEmit)", "Typecheck"],
  ["Bash(git status)", "git status"],
  ["Bash(git log *)", "git log"],
  ["Bash(git diff *)", "git diff"],
  ["Bash(git commit *)", "git commit"],
] as const
const DENY = [
  ["Read(./.env)", "Read .env"],
  ["Read(./.env.*)", "Read .env.*"],
  ["Read(~/.ssh/**)", "Read ~/.ssh"],
  ["Bash(git push *)", "git push"],
  ["Bash(rm -rf *)", "rm -rf"],
  ["Bash(curl *)", "curl"],
] as const

function SettingsBuilder({ onUse }: { onUse: (xp: number, l: string) => void }) {
  const [allow, setAllow] = useState<string[]>(["Bash(npm run test *)", "Bash(npm run lint)", "Bash(git commit *)"])
  const [deny, setDeny] = useState<string[]>(["Read(./.env)", "Read(./.env.*)", "Bash(git push *)"])
  const [fmtHook, setFmtHook] = useState(true)
  const [sandbox, setSandbox] = useState(false)
  const [mode, setMode] = useState<"" | "plan" | "acceptEdits">("")
  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const json = useMemo(() => {
    const o: Record<string, unknown> = {
      $schema: "https://json.schemastore.org/claude-code-settings.json",
      permissions: {
        ...(allow.length ? { allow } : {}),
        ...(deny.length ? { deny } : {}),
        ...(mode ? { defaultMode: mode } : {}),
      },
    }
    if (fmtHook)
      o.hooks = {
        PostToolUse: [
          {
            matcher: "Edit|Write",
            hooks: [{ type: "command", command: 'jq -r .tool_input.file_path | xargs npx prettier --write' }],
          },
        ],
      }
    if (sandbox) o.sandbox = { enabled: true }
    return JSON.stringify(o, null, 2)
  }, [allow, deny, fmtHook, sandbox, mode])

  return (
    <div>
      <h2 className="font-display text-xl">Settings builder</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Builds <code className="text-[12px]">.claude/settings.json</code> (commit it for your team). Rules are checked
        deny → ask → allow, and deny always wins.
      </p>
      <div className="text-xs font-mono text-muted-foreground mt-4 mb-1.5">ALLOW WITHOUT ASKING</div>
      <div className="flex flex-wrap gap-1.5">
        {ALLOW.map(([v, l]) => (
          <Chip key={v} on={allow.includes(v)} onClick={() => toggle(allow, setAllow, v)} tone="ok">
            {l}
          </Chip>
        ))}
      </div>
      <div className="text-xs font-mono text-muted-foreground mt-4 mb-1.5">ALWAYS DENY</div>
      <div className="flex flex-wrap gap-1.5">
        {DENY.map(([v, l]) => (
          <Chip key={v} on={deny.includes(v)} onClick={() => toggle(deny, setDeny, v)} tone="bad">
            {l}
          </Chip>
        ))}
      </div>
      <div className="text-xs font-mono text-muted-foreground mt-4 mb-1.5">EXTRAS</div>
      <div className="space-y-1.5 text-sm">
        <label className="flex gap-2 items-start">
          <input type="checkbox" className="mt-1" checked={fmtHook} onChange={(e) => setFmtHook(e.target.checked)} />
          <span>
            Format files with Prettier after every edit <span className="text-muted-foreground">(PostToolUse hook; needs jq)</span>
          </span>
        </label>
        <label className="flex gap-2 items-start">
          <input type="checkbox" className="mt-1" checked={sandbox} onChange={(e) => setSandbox(e.target.checked)} />
          <span>
            Turn on the OS sandbox <span className="text-muted-foreground">(macOS, Linux, WSL2; not native Windows)</span>
          </span>
        </label>
      </div>
      <div className="text-xs font-mono text-muted-foreground mt-4 mb-1.5">DEFAULT MODE FOR THIS PROJECT</div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          ["", "Leave default"],
          ["plan", "Plan"],
          ["acceptEdits", "Accept edits"],
        ].map(([v, l]) => (
          <button
            key={l}
            onClick={() => setMode(v as typeof mode)}
            className={cn("rounded border py-2 text-xs", mode === v && "bg-primary text-primary-foreground border-primary")}
          >
            {l}
          </button>
        ))}
      </div>
      <CopyBlock text={json} file=".claude/settings.json" onCopied={() => onUse(10, "settings copied")} />
      <p className="text-[11px] text-muted-foreground mt-2">
        Settings files are strict JSON: one trailing comma breaks them. Check what loaded with <code>/permissions</code>.
      </p>
    </div>
  )
}

function Chip({
  on,
  onClick,
  tone,
  children,
}: {
  on: boolean
  onClick: () => void
  tone: "ok" | "bad"
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-[12px] px-2.5 py-1.5 rounded border",
        on && tone === "ok" && "bg-accent text-accent-foreground border-sage",
        on && tone === "bad" && "bg-destructive/15 text-destructive border-destructive/60",
      )}
    >
      {on ? (tone === "ok" ? "✓ " : "⛔ ") : ""}
      {children}
    </button>
  )
}
