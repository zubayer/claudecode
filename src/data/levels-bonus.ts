import type { Level } from "./types"

const L = (...lines: string[]) => lines.join("\n")
const D = "https://code.claude.com/docs/en/"

export const LEVEL_BONUS: Level = {
  id: "l7",
  num: 7,
  title: "Beyond code (bonus)",
  rank: "Polymath",
  tagline: "Data analysis, research writing and everyday automation with the same agent.",
  goal: "Use Claude Code for one real non-coding job, with the same verification discipline you use for code.",
  project: {
    title: "A trustworthy analysis",
    brief: "Take a real CSV from your work or studies. Have Claude write a script that cleans it, computes three numbers and draws one chart, then check one number by a second method.",
    checklist: [
      "Raw data folder protected with a deny rule",
      "Claude wrote analysis.py (or .R) and ran it; outputs saved to files",
      "You recomputed one number a different way and it matched",
      "Saved the workflow as a skill or a `claude -p` script for next time",
    ],
  },
  lessons: [
    {
      id: "l7-general",
      title: "A general agent wearing a coder's badge",
      minutes: 6,
      intuition: L(
        "Claude Code works on **anything you can do from a command line**. Files, spreadsheets, PDFs, notes, scripts and data are all in reach.",
        "So the same tool that fixes bugs can clean a dataset, reorganize a folder of notes, or draft and check a report.",
      ),
      analogy: L(
        "A Swiss Army knife marketed as a bottle opener. Most people only use the opener because that's what's on the box. The blade, the scissors and the screwdriver were there all along.",
      ),
      formal: L(
        "- The official docs describe it as handling “anything you can do from the command line.”",
        "- Writer Simon Willison calls it a general agent disguised as a developer tool.",
        "- Anthropic reports its own non-engineering teams (such as marketing, legal, data science and design) using Claude Code.",
        "- Creator videos on “second brain” setups (Obsidian + Claude Code) show the same idea for personal knowledge work.",
        "**What carries over from coding:**",
        "- Work in a folder under git, so every change is reversible.",
        "- Describe the outcome, the files, the constraints and the proof.",
        "- Prefer outputs you can check (a script, a file, a table) over answers you have to trust.",
      ),
      example: {
        title: "Three non-coding jobs",
        steps: [
          { label: "Folder cleanup", code: "› rename every PDF in papers/ to Author_Year_ShortTitle.pdf using\n  each file's first page. Show me the mapping before renaming." },
          { label: "Notes", code: "› merge my meeting notes in notes/2026-11/ into one summary with\n  decisions and owners. Link each point to its source file." },
          { label: "Spreadsheet", code: "› in budget.csv, flag rows where the category is missing and\n  write the cleaned file to budget_clean.csv. Don't touch the original." },
        ],
        result: "Each job asks for a preview, a source trail, or a separate output file, so you can check before trusting.",
      },
      caveman: "Claude Code not only code. Any command-line job: file, data, note, report. Same rule: git, clear ask, proof.",
      quiz: [
        { q: "Which best describes Claude Code's scope?", options: ["Only Python and JavaScript", "Anything you can do from a command line", "Only GitHub repos", "Only web apps"], answer: 1, why: "The docs say it handles anything you can do from the command line." },
        { q: "Why ask Claude to show a renaming map before renaming files?", options: ["It's faster", "So you can check before an action that's hard to undo", "Required by macOS", "To use more tokens"], answer: 1, why: "Preview first, especially for bulk changes." },
        { q: "What carries over from coding to non-coding work?", options: ["Nothing", "Git, precise requests and checkable outputs", "Only plan mode", "Only hooks"], answer: 1, why: "The same discipline applies." },
      ],
      sources: [{ label: "How Claude Code works", url: D + "how-claude-code-works" }],
    },
    {
      id: "l7-data",
      title: "Data analysis you can trust",
      minutes: 9,
      intuition: L(
        "Never ask Claude for a number. Ask it for **a script that produces the number**, run it, and keep it.",
        "A script can be re-run, read, checked and reused. A number typed in a chat reply can't.",
      ),
      analogy: L(
        "A lab notebook vs a colleague shouting a result across the room. Both may be right, but only the notebook lets you, a reviewer, or future-you see exactly how it was obtained.",
      ),
      formal: L(
        "**The trustworthy-analysis loop:**",
        "1. **Protect raw data.** Keep originals read-only, e.g. a deny rule `Edit(./data/raw/**)`, and write outputs elsewhere.",
        "2. **Explore first.** “Describe the columns, types, missing values and row count of data/raw/sales.csv.”",
        "3. **Script, don't chat.** “Write analysis.py that computes X, Y, Z and saves a chart to out/fig1.png. Run it.”",
        "4. **Sanity checks.** Row counts before and after cleaning, units, ranges, duplicates.",
        "5. **Cross-check one number** by a different method (a pivot table, a second library, a hand calculation on a subset).",
        "6. **Save it.** Commit the script; turn the routine into a skill or a `claude -p` call.",
        "Use plan mode for multi-step analyses, and ask for evidence: the command it ran and the printed output.",
      ),
      example: {
        title: "Average order value, checked twice",
        setup: "orders.csv has 1,200 rows; 48 have a missing amount.",
        steps: [
          { label: "Ask for a script", code: "› write aov.py: drop rows with missing amount, report rows kept,\n  total revenue and average order value. Run it." },
          { label: "Claude's output", code: "rows kept: 1152\ntotal revenue: 86,400.00\naverage order value: 75.00" },
          { label: "Check the arithmetic", text: "1,200 − 48 = **1,152** rows ✓. 86,400 ÷ 1,152 = **75.00** ✓." },
          { label: "Cross-check by another method", code: "› compute the same average with a pivot in DuckDB SQL and compare" },
        ],
        result: "Two methods agree and the row count adds up, so you can report 75.00 with confidence, and re-run it next month.",
      },
      terminal: {
        intro: "Simulated session in ~/thesis-data (git repo).",
        steps: [
          { cmd: "describe data/raw/orders.csv: columns, types, missing values, row count", out: ["⏺ Bash(python -c \"import pandas as pd; df=pd.read_csv('data/raw/orders.csv'); print(df.info())\")", "1200 rows · order_id int · date str · amount float (48 missing) · region str"] },
          { cmd: "write aov.py that drops missing amounts and prints rows kept, revenue and average. run it", accept: ["write aov.py that drops missing amounts and prints rows kept revenue and average run it"], out: ["⏺ Write(aov.py)", "⏺ Bash(python aov.py)", "rows kept: 1152", "total revenue: 86400.00", "average order value: 75.00"], note: "1,200 − 48 = 1,152 and 86,400 ÷ 1,152 = 75. Checks out." },
          { cmd: "save a bar chart of revenue by region to out/fig1.png", out: ["⏺ Edit(aov.py) · Bash(python aov.py)", "Saved out/fig1.png (4 regions)"] },
        ],
      },
      caveman: "No ask number. Ask script that make number. Run. Raw data no touch. Check one number other way.",
      pitfall: "Accepting a statistic Claude states in prose without a script behind it. If it can't be re-run, it can't be trusted or reproduced.",
      proTip: "Ask Claude to print row counts after every cleaning step. Most data bugs show up as a surprising count.",
      quiz: [
        { q: "What should you ask Claude for in an analysis?", options: ["The final number in chat", "A script that computes it, which you run and keep", "A guess", "A screenshot of Excel"], answer: 1, why: "Scripts are reproducible and checkable." },
        { q: "1,200 rows, 48 missing amounts dropped. Rows kept?", options: ["1,248", "1,152", "1,200", "48"], answer: 1, why: "1,200 − 48 = 1,152." },
        { q: "How do you protect raw data from accidental edits?", options: ["Ask nicely in chat", "A deny permission rule on the raw folder", "Rename it", "Use bypass mode"], answer: 1, why: "Permissions enforce; chat requests only advise." },
      ],
      sources: [{ label: "Permissions", url: D + "permissions" }],
    },
    {
      id: "l7-writing",
      title: "Research writing without invented facts",
      minutes: 8,
      intuition: L(
        "Claude Code can draft, restructure and check long documents in Markdown or LaTeX. The risk is fluent text that states things nobody checked.",
        "The fix is the same as for code: tie every claim to a source file Claude can open, and review in a fresh context.",
      ),
      analogy: L(
        "A good research assistant brings you photocopies with the quoted lines highlighted, not just a confident summary. Ask Claude for the photocopies.",
      ),
      formal: L(
        "- **Ground it:** put sources in a folder (e.g. `refs/` with PDFs or notes) and say “only cite files in refs/; if something isn't supported there, mark it TODO.”",
        "- **Structure first:** use plan mode to agree on the outline and the argument before drafting.",
        "- **Draft in sections**, one session or `/clear` per major section, to keep context focused.",
        "- **Fresh-context review:** a second session or a reviewer subagent checks each claim against `refs/` and lists unsupported ones.",
        "- **Mechanical checks:** have it build the document (e.g. compile LaTeX) and report warnings, broken references and missing citations.",
        "- **Keep your voice:** ask for edits as diffs you accept, not wholesale rewrites, and read `/diff` before committing.",
      ),
      example: {
        title: "A literature-review section",
        steps: [
          { label: "Plan", code: "/plan outline a 1,500-word related-work section from the papers in refs/" },
          { label: "Draft with grounding", code: "› draft section 2.1 from the outline. Cite only files in refs/ as\n  (Author Year). Mark any claim you can't support as TODO." },
          { label: "Review fresh", code: "(new session) › check every citation in chapter2.tex against refs/.\n  List claims that the cited paper doesn't support." },
          { label: "Build", code: "› compile the thesis and list LaTeX warnings and undefined references" },
        ],
        result: "A draft where every claim points at a real source, with gaps flagged as TODO instead of filled with plausible fiction.",
      },
      caveman: "Draft OK. Every claim point to real file in refs/. No source? Write TODO. New session check claims. Read diff.",
      pitfall: "Letting Claude cite papers from memory. It can produce plausible but wrong references. Restrict citations to files you provided.",
      quiz: [
        { q: "How do you reduce invented citations?", options: ["Ask for more citations", "Only allow citations to files in a sources folder, mark gaps TODO", "Use a bigger model", "Turn on bypass mode"], answer: 1, why: "Ground claims in files Claude can open." },
        { q: "Why review claims in a fresh session?", options: ["It's cheaper", "It isn't biased toward text it just wrote", "Required for LaTeX", "To reset limits"], answer: 1, why: "Same writer/reviewer logic as code." },
        { q: "Best way to keep your own writing voice?", options: ["Accept full rewrites", "Ask for targeted edits and read the diff", "Never use Claude", "Use ALL CAPS"], answer: 1, why: "Review changes as diffs." },
      ],
      sources: [{ label: "Best practices", url: D + "best-practices" }],
    },
    {
      id: "l7-automate",
      title: "Automate your weekly routine",
      minutes: 7,
      intuition: L(
        "Anything you do every week the same way can become a skill (when you trigger it) or a scheduled `claude -p` run (when it should just happen).",
      ),
      analogy: L(
        "Writing down your morning coffee routine so anyone can make it exactly the same way, then buying a machine with a timer.",
      ),
      formal: L(
        "- **Skill** when you want to trigger it: `.claude/skills/weekly-report/SKILL.md`, invoked as `/weekly-report` or by a matching request.",
        "- **Headless** when it should run unattended: `claude -p \"…\" --output-format json --max-budget-usd 0.50` from cron, CI or a cloud scheduled task.",
        "- **Hooks** for guarantees, e.g. always regenerate a chart after data changes.",
        "- **Guardrails for unattended runs:** cap budget and turns, restrict tools with `--allowedTools`, use `--bare` in untrusted folders, write outputs to files, and keep originals untouched.",
        "- **Review the first few runs** before trusting it unattended.",
      ),
      example: {
        title: "Monday summary of last week's data",
        steps: [
          {
            label: "weekly.sh",
            code: "#!/bin/sh\ncd ~/lab-data\nclaude -p \"run report.py on data/raw/week.csv, then write a 5-bullet summary\n  of changes vs last week to out/summary.md. Don't edit data/raw.\" \\\n  --allowedTools \"Bash(python report.py *)\" \"Read\" \"Write\" \\\n  --max-budget-usd 0.50 --output-format json > out/run.json",
          },
          { label: "Schedule", code: "# crontab -e\n0 8 * * 1  ~/lab-data/weekly.sh" },
        ],
        result: "Every Monday at 08:00 a capped, tool-restricted run leaves a summary file and a JSON log you can audit.",
      },
      caveman: "Do same thing every week? Make skill (you start) or claude -p + cron (auto). Cap money. Few tools. Check first runs.",
      quiz: [
        { q: "A task should run every Monday without you. Best fit?", options: ["A skill", "claude -p from a scheduler", "CLAUDE.md line", "Plan mode"], answer: 1, why: "Headless runs are for unattended jobs." },
        { q: "Which guardrail limits cost of an unattended run?", options: ["--max-budget-usd", "--verbose", "/clear", "ultrathink"], answer: 0, why: "Caps spend per run." },
        { q: "Why restrict --allowedTools in automation?", options: ["Style", "Nobody is watching, so limit what it can do", "It's required", "To speed up git"], answer: 1, why: "Least privilege for unattended agents." },
      ],
      sources: [{ label: "Run Claude Code programmatically", url: D + "headless" }],
    },
  ],
}
