export const HYPE: { claim: string; verdict: "Supported" | "Partly true" | "Hype"; reality: string }[] = [
  {
    claim: "You're using Claude Code wrong if you don't give it a way to check its work.",
    verdict: "Supported",
    reality:
      "The best-supported tip in the whole genre. Anthropic's docs, Claude Code's creator Boris Cherny, the Claude Code team's Nov 2026 verification post and the power-user guide all rank it first. Support comes from expert consensus, not a controlled study; Cherny's “2-3× quality” is his own estimate.",
  },
  {
    claim: "Claude Code will make you 10× more productive.",
    verdict: "Hype",
    reality:
      "No measurement comes close. METR's 2025 randomized trial: experienced devs **19% slower** while believing they were 20% faster. METR's 2026 update: 4–18% speedups with intervals crossing zero, “very weak evidence.” Anthropic's internal +50% productivity is self-reported, with biases it flags itself.",
  },
  {
    claim: "You're only using 20% of Claude Code.",
    verdict: "Hype",
    reality:
      "Headlines like this come with no usage data. The features they list are real (plan mode, CLAUDE.md, subagents, hooks, worktrees) and mostly come from Anthropic's best-practices page, but the percentage is invented.",
  },
  {
    claim: "Custom agents (subagents) are the most overlooked feature.",
    verdict: "Partly true",
    reality:
      "Anthropic's own support article says custom agents “often get overlooked.” That's first-party support, but there's no measurement of their impact. Anthropic also lists “subagents just to save context” as a habit you can stop.",
  },
  {
    claim: "Install these 40 subagents / 50 MCP servers to supercharge Claude Code.",
    verdict: "Hype",
    reality:
      "The opposite of expert practice. Cherny runs a mostly vanilla setup: a ~2.5k-token CLAUDE.md, a few commands, one formatter hook. Every enabled skill, agent and plugin adds context cost, and plugins can run code with your privileges.",
  },
  {
    claim: "Use plan mode for everything.",
    verdict: "Partly true",
    reality:
      "Plan first for anything non-trivial, but the docs' skip rule is: if you could describe the diff in one sentence, skip the plan.",
  },
  {
    claim: "Write a huge, detailed CLAUDE.md with IMPORTANT rules in caps.",
    verdict: "Hype",
    reality:
      "Current docs list ALL-CAPS/IMPORTANT and architecture tours under “what you can stop doing.” Keep it under 200 lines, only what Claude can't infer.",
  },
  {
    claim: "Run multiple Claude sessions in parallel to multiply output.",
    verdict: "Partly true",
    reality:
      "Real and recommended (3 to 5 worktree sessions), but it multiplies review load and token use. Agent teams use ~7× more tokens; November's top complaint was parallel agents burning limits in minutes.",
  },
  {
    claim: "You don't need to know how to code.",
    verdict: "Supported",
    reality:
      "The official terminal guide says exactly this. To use it well you still need to specify, verify and review, and git literacy is your safety net.",
  },
]

export const TITLES = [
  {
    pattern: "“FULL COURSE (4 / 10+ hours)”",
    example: "CLAUDE CODE FULL COURSE 4 HOURS: Build & Sell (2026), ~2.4M views",
    inside: "Long beginner walkthroughs: install, first project, then a build-and-ship demo. The biggest view counts in the genre.",
    watchIf: "you like long-form, follow-along learning. Check the date: anything before late 2026 has outdated commands.",
  },
  {
    pattern: "“Build $10,000 websites / a $400K/mo app”",
    example: "How I Vibe Coded a $400K/mo App with Claude Code",
    inside: "Money framing. Mostly demos of building fast; the revenue claims are not verifiable.",
    watchIf: "you want inspiration for what's possible, not engineering technique.",
  },
  {
    pattern: "“No coding needed / for non-technical beginners”",
    example: "Claude Code Tutorial for Non-Technical Beginners",
    inside: "Desktop/web-first onboarding, plain-English prompting, small projects.",
    watchIf: "you're at Level 0 and the terminal feels scary.",
  },
  {
    pattern: "“I spent 800 / 1,000+ hours with Claude Code”",
    example: "800+ hours of Learning Claude Code in 8 minutes",
    inside: "Compressed tips lists: CLAUDE.md, plan mode, context hygiene, custom commands. Usually a remix of official best practices.",
    watchIf: "you want a quick tour, then read the official best-practices page to confirm each tip.",
  },
  {
    pattern: "“You're using Claude Code wrong”",
    example: "You're Using Claude Code Wrong (And Wasting Hours Every Day)",
    inside: "Correction lists. The genuinely solid ones focus on verification, plan mode and /clear.",
    watchIf: "you're at Level 2–3. Use the Hype vs reality tab to filter claims.",
  },
  {
    pattern: "“How the creator of Claude Code uses it”",
    example: "Boris Cherny shares these 22 tips (you're probably using it wrong)",
    inside: "Retellings of Cherny's Jan 2026 thread: verification first, plan then auto-accept, parallel sessions, shared CLAUDE.md, a formatter hook. Often with an added “10×” hook he didn't claim.",
    watchIf: "you want the closest thing to an expert's real setup (read the InfoQ summary instead for accuracy).",
  },
  {
    pattern: "“Second brain / run my life with Obsidian + Claude Code”",
    example: "How I Use Obsidian + Claude Code to Run My Life",
    inside: "Non-coding uses: notes, planning, writing, personal automation. Shows Claude Code as a general agent.",
    watchIf: "you want to use it beyond programming.",
  },
  {
    pattern: "“Claude Code vs Codex vs Cursor (cost / speed)”",
    example: "Claude Code vs Cline vs Codex: Why the Same Task Costs So Much More",
    inside: "Tool and pricing comparisons. Useful context, but prices and plans change monthly (Max 20x became Ultra on Nov 1, 2026).",
    watchIf: "you're choosing tools or plans; re-check prices on the official page.",
  },
]

export const NEWS = [
  { tag: "security · ~1.6k HN points", title: "Account email appeared in User-Agent headers", body: "The email sat in model context and sometimes ended up in outgoing requests. v2.1.317 now asks before a web or shell call sends it." },
  { tag: "security · ~1k HN points", title: "Backdoored “Claude Code for VS Code” extension on Open VSX (Oct 30)", body: "A fake extension appeared on the Cursor/Open VSX marketplace. Install only from official publishers." },
  { tag: "security · 629 HN points", title: "“Don't ask again” saved secrets into settings.local.json", body: "Apiiro found such files committed in ~1,100 public repos. Add `.claude/*.local.*` to every repo's .gitignore." },
  { tag: "feature · v2.1.323", title: "Experimental Code Mode", body: "Claude writes JavaScript that calls its tools and returns only filtered output. Enable with `CLAUDE_CODE_EXPERIMENTAL_CODE_MODE=1` in user settings. Doesn't work with `-p`, the SDK, VS Code, Desktop or cloud sessions." },
  { tag: "models · Nov 9", title: "Fable 5.2 released; default model unclear", body: "A release log says v2.1.321 made Fable 5.2 the default; the official model docs still name Opus 5.5. Check `/status` and pin with `/model`." },
  { tag: "feature · Nov 14", title: "Desktop Projects redesigned", body: "A coordinator hands work to parallel cloud threads (gradual rollout). Users report it can burn limits fast." },
  { tag: "plans · Nov 1", title: "Max 20x renamed Ultra", body: "Ultra ($200/mo) is listed at 10x Pro weekly usage with no five-hour limit for verified accounts." },
  { tag: "tips · Nov 16", title: "How the Claude Code team thinks about verification", body: "A `verify` skill, hook or /goal gates, end-to-end and property tests, and a human after three failed rounds. The month's most-shared how-to." },
  { tag: "complaints", title: "Limits, “nerfed model” threads and a Nov 13 outage", body: "Recurring “Opus 5.5 got dumber” threads weren't backed by benchmark trackers. `subagentStatusLine` was removed without warning." },
]

export const RETIRED: { old: string; now: string }[] = [
  { old: "Docs at docs.anthropic.com/…/claude-code", now: "Redirects to code.claude.com/docs" },
  { old: "Install Node 18, then npm install -g", now: "Native installer; npm needs Node 22+, never sudo" },
  { old: "Max 5x / Max 20x", now: "Max ($100) / Ultra ($200, 10x Pro weekly)" },
  { old: "Sessions start in default mode; 3 modes", now: "Start in **auto** (v2.1.283+); 6 modes incl. dontAsk" },
  { old: "`think` < `think hard` < `think harder`", now: "`/effort low…max`; only `ultrathink` remains" },
  { old: "`#` to add a memory", now: "Ask Claude or use `/memory`" },
  { old: "Custom commands in .claude/commands/", now: "Skills in .claude/skills/<name>/SKILL.md (old path still works)" },
  { old: "`/agents` wizard", now: "Edit .claude/agents/ or ask Claude" },
  { old: "`/cost`, `/stats`", now: "Aliases of `/usage`" },
  { old: "`/vim`, `/pr-comments`, `/ultraplan`", now: "Removed: /config → Editor mode; ask Claude; plan mode" },
  { old: "`--transport sse`", now: "`--transport http`" },
  { old: "“Every MCP server eats your context”", now: "Tool search on by default; only names load" },
  { old: "Claude Code SDK, ClaudeCodeOptions", now: "Claude Agent SDK, ClaudeAgentOptions; no default system prompt" },
  { old: "claude-code-action@beta, direct_prompt", now: "@v1, prompt, claude_args" },
  { old: "`Bash(ls:*)`", now: "`Bash(ls *)` preferred" },
  { old: "“Enterprise” CLAUDE.md", now: "“Managed policy”" },
  { old: "Manage context aggressively; ALL-CAPS rules", now: "Listed under “what you can stop doing”" },
  { old: "Vertex AI", now: "Google Cloud's Agent Platform" },
]

export const SKILLS_TO_TRY = [
  { name: "Anthropic official skills", source: "anthropics/skills", what: "Reference skills for documents (pdf, docx, pptx, xlsx), frontend design, skill-creator and more. The best place to learn the SKILL.md format.", install: "/plugin marketplace add anthropics/skills\n/plugin install example-skills@anthropic-agent-skills" },
  { name: "superpowers", source: "obra/superpowers", what: "A popular workflow library: brainstorming, planning, TDD, debugging, parallel agents. In the official marketplace since Jan 2026.", install: "/plugin install superpowers@claude-plugins-official" },
  { name: "find-skills", source: "vercel-labs", what: "The most-installed skill in the ecosystem: helps you discover and install other skills.", install: "npx skills add vercel-labs/skills --skill find-skills" },
  { name: "grill-me", source: "mattpocock/skills", what: "Claude interviews you relentlessly about a plan until every decision is settled. Great before writing a SPEC.md.", install: "npx skills add mattpocock/skills --skill grill-me" },
  { name: "frontend-design", source: "anthropics/claude-code", what: "Pushes UI work toward distinctive, intentional design instead of generic defaults.", install: "/plugin   → Discover → search “frontend-design”" },
  { name: "Your own `verify` skill", source: "you", what: "The Claude Code team's own advice: a project skill that boots the app and runs smoke tests. Highest-value skill you can write.", install: "mkdir -p .claude/skills/verify && $EDITOR .claude/skills/verify/SKILL.md" },
]

export const GLOSSARY = [
  { term: "Agentic loop", def: "Claude Code's cycle of gather context → take action → verify results, repeated until a task is done." },
  { term: "Agentic harness", def: "The layer around the model that supplies tools and manages context. Claude Code is one." },
  { term: "Context window", def: "Everything Claude currently has in mind for a session. Most current models have ~1M tokens." },
  { term: "Compaction", def: "Summarizing history to free context; automatic near the limit, or manual with /compact." },
  { term: "CLAUDE.md", def: "Markdown file of standing instructions loaded each session. Advisory, not enforced." },
  { term: "Auto memory", def: "Notes Claude writes for itself in ~/.claude/projects/<project>/memory/MEMORY.md." },
  { term: "Plan mode", def: "Read-only mode where Claude explores and proposes a plan before editing." },
  { term: "Auto mode", def: "Permission mode where a classifier approves routine actions and blocks risky ones. The interactive default." },
  { term: "Checkpoint", def: "Automatic snapshot per prompt of Claude's file edits, restorable with /rewind. Not a git replacement." },
  { term: "Effort", def: "How much Claude reasons per turn: low, medium, high, xhigh, max. Replaced the think keywords." },
  { term: "Skill", def: "A folder with SKILL.md: an on-demand procedure Claude loads when its description matches." },
  { term: "Progressive disclosure", def: "Only skill names/descriptions stay in context until a skill is used." },
  { term: "Subagent", def: "A separate Claude with its own context, tools and model that returns a summary." },
  { term: "Hook", def: "Your script that runs on events like PreToolUse or PostToolUse. Exit 2 blocks." },
  { term: "MCP", def: "Model Context Protocol: a standard way to connect Claude to outside tools and data." },
  { term: "Plugin", def: "A package bundling skills, agents, hooks and MCP servers, installed via /plugin." },
  { term: "Worktree", def: "A separate git checkout on its own branch, so parallel sessions don't collide." },
  { term: "Headless mode", def: "Running claude -p for one non-interactive task, for scripts and CI." },
  { term: "Agent SDK", def: "The Claude Code engine as a Python/TypeScript library (formerly Claude Code SDK)." },
  { term: "Sandbox", def: "OS-level isolation limiting writes and network. Off by default; /sandbox to enable." },
  { term: "Trust-then-verify gap", def: "Anthropic's name for accepting plausible code that misses edge cases." },
  { term: "Supervision paradox", def: "Overseeing AI well needs the skills that over-delegating to it can erode." },
  { term: "Vibe coding", def: "Building by prompting without closely reading the code. Fine for prototypes, risky for production." },
]

export const CHEATS: { title: string; rows: [string, string][] }[] = [
  {
    title: "Install & launch",
    rows: [
      ["curl -fsSL https://claude.ai/install.sh | bash", "Install (macOS/Linux/WSL), auto-updates"],
      ["irm https://claude.ai/install.ps1 | iex", "Install (Windows PowerShell)"],
      ["claude --version · claude doctor · claude update", "Check, diagnose, update"],
      ["claude", "Start an interactive session in this folder"],
      ["claude \"task\"", "Start with a first prompt"],
      ["claude -c / --continue", "Continue latest session here"],
      ["claude -r / --resume", "Pick a session to resume"],
      ["claude -w name / --worktree name", "Session in its own worktree"],
      ["claude --permission-mode plan", "Start in plan mode"],
      ["claude --from-pr 1234", "Reopen the session linked to a PR"],
    ],
  },
  {
    title: "Keys & prefixes",
    rows: [
      ["Esc", "Interrupt (keeps work so far)"],
      ["Esc Esc", "Rewind menu (empty prompt)"],
      ["Shift+Tab", "Cycle permission modes (Alt+M on some Windows)"],
      ["! cmd", "Shell mode; output goes into context"],
      ["@path", "Mention a file"],
      ["/", "Commands and skills"],
      ["?", "Shortcut help (empty prompt)"],
      ["Ctrl+V (Alt+V Win/WSL)", "Paste image"],
      ["Ctrl+G", "Edit prompt or plan in your editor"],
      ["Ctrl+R · Ctrl+B · Ctrl+O", "History search · background task · transcript"],
      ["\\ + Enter", "Newline"],
    ],
  },
  {
    title: "Slash commands",
    rows: [
      ["/clear", "Empty context (old session stays resumable)"],
      ["/compact [focus]", "Summarize history, keeping the focus"],
      ["/context", "What's filling the window"],
      ["/usage (/cost, /stats)", "Cost and plan-limit bars"],
      ["/model · /effort", "Pick model · reasoning effort low→max"],
      ["/plan [task]", "Enter plan mode"],
      ["/rewind (/checkpoint, /undo)", "Restore code and/or conversation"],
      ["/diff", "Review working-tree changes"],
      ["/permissions", "View/edit allow, ask, deny rules"],
      ["/memory · /init", "Edit memory files · draft CLAUDE.md"],
      ["/skills · /reload-skills", "List (t = sort by tokens) · rescan"],
      ["/mcp · /plugin · /hooks", "MCP auth · plugins · view hooks"],
      ["/review · /security-review", "Review a PR · security review of branch"],
      ["/sandbox", "Enable OS sandbox"],
      ["/status · /config · /help", "Version/model/account · settings · help"],
      ["/btw question", "Side question that stays out of context"],
    ],
  },
  {
    title: "Files & locations",
    rows: [
      ["~/.claude/CLAUDE.md", "Your personal memory, all projects"],
      ["./CLAUDE.md · ./CLAUDE.local.md", "Project memory (commit) · local (gitignore)"],
      [".claude/rules/*.md", "Modular rules; `paths:` scopes them"],
      ["~/.claude/settings.json", "Your settings everywhere"],
      [".claude/settings.json", "Team settings (commit)"],
      [".claude/settings.local.json", "Your project settings (gitignore!)"],
      [".claude/skills/<name>/SKILL.md", "Project skill"],
      [".claude/agents/<name>.md", "Project subagent"],
      [".mcp.json", "Team MCP servers"],
      [".worktreeinclude", "Gitignored files to copy into worktrees"],
    ],
  },
  {
    title: "Permission modes",
    rows: [
      ["default (Manual)", "Asks before edits and commands"],
      ["acceptEdits", "Auto-accepts edits in the working dir"],
      ["plan", "Read-only, proposes a plan"],
      ["auto", "Classifier reviews actions (interactive default)"],
      ["dontAsk", "Denies anything not pre-approved (CI)"],
      ["bypassPermissions", "Skips checks: containers/VMs only"],
    ],
  },
  {
    title: "Headless & MCP",
    rows: [
      ["claude -p \"query\"", "One-off run, then exit"],
      ["--output-format json|stream-json", "Machine-readable output"],
      ["--max-budget-usd 0.50 · --max-turns 5", "Cap cost / steps"],
      ["--bare", "Skip hooks/skills/MCP/memory discovery"],
      ["--allowedTools \"Read,Edit\"", "Restrict tools"],
      ["claude mcp add --transport http name URL", "Add HTTP MCP server"],
      ["claude mcp list · get · remove", "Manage MCP servers"],
    ],
  },
]
