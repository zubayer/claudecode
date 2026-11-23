import type { Level } from "./types"

const L = (...lines: string[]) => lines.join("\n")
const D = "https://code.claude.com/docs/en/"

export const LEVELS_C: Level[] = [
  {
    id: "l5",
    num: 5,
    title: "Automation & scale",
    rank: "Architect",
    tagline: "Headless runs, CI, the Agent SDK, and spending wisely.",
    goal: "Run Claude Code from scripts and CI, build a tiny agent with the SDK, and control cost.",
    project: {
      title: "A robot teammate",
      brief: "Add Claude to a GitHub repo so `@claude` in a PR comment triggers a review, and write one shell script that pipes data into `claude -p`.",
      checklist: [
        "Ran `/install-github-app` and triggered `@claude` on a PR",
        "Wrote a script using `claude -p ... --output-format json`",
        "Capped a run with `--max-budget-usd` or `--max-turns`",
        "Reviewed a week of `/usage` and changed one habit to save cost",
      ],
    },
    lessons: [
      {
        id: "l5-headless",
        title: "Headless mode: claude -p",
        minutes: 8,
        intuition: L(
          "`claude -p \"…\"` runs one task and exits, with no chat window. That makes Claude Code a building block you can put in scripts, pipelines and cron jobs.",
        ),
        analogy: L(
          "The difference between calling a plumber to talk through a problem and installing a sensor that automatically shuts the valve when it detects a leak. Same expertise, now wired into the system.",
        ),
        formal: L(
          "```",
          "claude -p \"Find and fix the bug in auth.py\" --allowedTools \"Read,Edit,Bash\"",
          "cat build-error.txt | claude -p 'explain the root cause of this build error' > out.txt",
          "git log --oneline -20 | claude -p \"summarize these recent commits\"",
          "claude -p \"run the test suite\" --permission-mode dontAsk --allowedTools \"Bash(npm test)\" \"Read\"",
          "```",
          "- `--output-format text | json | stream-json`. JSON includes `result`, `session_id` and `total_cost_usd`. `--json-schema` returns `structured_output`.",
          "- `--max-budget-usd` caps spend; `--max-turns` caps steps.",
          "- **`--bare`** skips hooks, skills, plugins, MCP, memory and CLAUDE.md discovery, needs `ANTHROPIC_API_KEY`, and will become the default for `-p` in a future release.",
          "- Since v2.1.302, `-p` starts in **Manual** mode unless you set a mode.",
          "- **Security:** without `--bare`, a `-p` run executes a project's hooks and `.mcp.json` servers even in a folder you've never trusted. Don't run `-p` in untrusted repos without `--bare`.",
          "- The docs now describe `claude -p` as “the Agent SDK via the CLI.”",
        ),
        example: {
          title: "A nightly changelog script",
          steps: [
            { label: "changelog.sh", code: "#!/bin/sh\ngit log --since=yesterday --oneline \\\n | claude -p --bare \"write a friendly changelog entry\" \\\n   --output-format json --max-budget-usd 0.50 \\\n | jq -r .result >> CHANGELOG.md" },
            { label: "Schedule it", text: "Add it to cron, a CI schedule, or a cloud scheduled task." },
          ],
          result: "A cheap, capped, repeatable automation with machine-readable output.",
        },
        terminal: {
          intro: "Simulated shell. Pipe data into Claude.",
          steps: [
            { cmd: "git log --oneline -5 | claude -p \"summarize these recent commits\"", out: ["This week: added email validation, fixed a rounding bug in cart totals, and moved theme colors to CSS variables."] },
            { cmd: "claude -p \"count TODO comments in src\" --output-format json", out: ["{\"result\":\"There are 7 TODO comments in src/.\",\"session_id\":\"…\",\"total_cost_usd\":0.012}"], note: "JSON output is easy to parse with jq in scripts." },
          ],
        },
        caveman: "claude -p = one job, no chat, then exit. Pipe in, get out. json for script. Cap money. --bare in strange repo.",
        quiz: [
          { q: "Which flag caps spend for a headless run?", options: ["--cheap", "--max-budget-usd", "--limit", "--wallet"], answer: 1, why: "--max-budget-usd caps cost." },
          { q: "Why use --bare in an untrusted repo?", options: ["It's faster to type", "Without it, the repo's hooks and MCP servers run with no trust dialog", "It enables colors", "It uses a free model"], answer: 1, why: "--bare skips project auto-discovery." },
          { q: "What mode does -p start in since v2.1.302?", options: ["auto", "Manual (default)", "bypass", "plan"], answer: 1, why: "Headless runs start in Manual unless set otherwise." },
        ],
        sources: [{ label: "Run Claude Code programmatically", url: D + "headless" }],
      },
      {
        id: "l5-ci",
        title: "Claude in GitHub Actions",
        minutes: 7,
        intuition: L(
          "Put Claude in your repo's CI so teammates can type `@claude` in an issue or PR comment and get a review, a fix or an answer, without opening a terminal.",
        ),
        analogy: L(
          "Like adding a helpful colleague to the team chat who only speaks when someone @-mentions them, and who only takes requests from people with write access.",
        ),
        formal: L(
          "- Run `/install-github-app` (needs `gh` and repo admin). It installs the app and stores `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN` as a secret.",
          "- Without a `prompt` input, the action responds to `@claude` mentions. With a `prompt`, it runs on any event, including a cron schedule.",
          "- Only users with write access can trigger it.",
          "- **Upgrading from `@beta` to `@v1`:** remove `mode`, rename `direct_prompt` → `prompt`, move `max_turns` and `model` into `claude_args`, replace `custom_instructions` with `--append-system-prompt`.",
          "- Too broad? Use a custom GitHub App limited to Contents, Issues and Pull requests.",
        ),
        example: {
          title: "Minimal workflow",
          steps: [
            {
              label: ".github/workflows/claude.yml",
              code: `name: Claude Code
on:
  issue_comment: { types: [created] }
  pull_request_review_comment: { types: [created] }
jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    permissions: { contents: write, pull-requests: write, issues: write, id-token: write, actions: read }
    steps:
      - uses: actions/checkout@v6
        with: { fetch-depth: 1 }
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          claude_args: "--max-turns 5"`,
            },
            { label: "Use it", code: "(PR comment)  @claude review this for missing error handling" },
          ],
          result: "Reviews and small fixes happen right in GitHub, capped at 5 turns.",
        },
        caveman: "/install-github-app. Write @claude in PR. Claude answer. Only write-access people. Old @beta → @v1, direct_prompt → prompt.",
        quiz: [
          { q: "In `claude-code-action@v1`, `direct_prompt` became…", options: ["prompt", "ask", "query", "It's unchanged"], answer: 0, why: "One of four @beta → @v1 changes." },
          { q: "Who can trigger the action with @claude?", options: ["Anyone on the internet", "Users with write access", "Only admins", "Only bots"], answer: 1, why: "Write access is required." },
          { q: "Where do `max_turns` and `model` go in v1?", options: ["Top-level inputs", "Inside claude_args", "In CLAUDE.md", "They were removed"], answer: 1, why: "They moved into claude_args." },
        ],
        sources: [{ label: "GitHub Actions", url: D + "github-actions" }],
      },
      {
        id: "l5-sdk",
        title: "The Claude Agent SDK",
        minutes: 7,
        intuition: L(
          "The engine behind Claude Code is available as a library, so you can build your own agents in Python or TypeScript: a support bot that reads logs, a data agent, an internal tool.",
          "It used to be called the Claude Code SDK. It's now the **Claude Agent SDK**.",
        ),
        analogy: L(
          "Claude Code is a finished car. The Agent SDK is the same engine and gearbox sold separately, so you can build a truck, a boat or a go-kart around it.",
        ),
        formal: L(
          "- **Renamed:** TypeScript `@anthropic-ai/claude-agent-sdk`; Python `claude-agent-sdk` (import `claude_agent_sdk`); `ClaudeCodeOptions` → `ClaudeAgentOptions`.",
          "- The CLI itself still installs from `@anthropic-ai/claude-code`; only the SDK moved.",
          "- Since v0.1.0, the SDK **does not use Claude Code's system prompt by default**. Pass the `claude_code` preset for CLI-like behavior.",
          "- Omitting `settingSources` loads your settings and CLAUDE.md; `settingSources: []` isolates the run.",
          "- Products built on the SDK must use **API keys** (not claude.ai login) and must not be branded “Claude Code”.",
        ),
        example: {
          title: "Hello, agent (Python)",
          steps: [
            { label: "Install", code: "pip install claude-agent-sdk" },
            {
              label: "agent.py",
              code: `import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    opts = ClaudeAgentOptions(system_prompt={"type": "preset", "preset": "claude_code"})
    async for message in query(prompt="List the TODOs in this repo", options=opts):
        print(message)

asyncio.run(main())`,
            },
          ],
          result: "Twelve lines give you a scripted agent with Claude Code's tools and behavior.",
        },
        caveman: "SDK = Claude Code engine as library. New name: Claude Agent SDK. No default system prompt now, ask preset. Product need API key.",
        quiz: [
          { q: "What's the Python package name now?", options: ["claude-code-sdk", "claude-agent-sdk", "anthropic-code", "cc-sdk"], answer: 1, why: "Renamed from claude-code-sdk." },
          { q: "How do you get Claude Code's system prompt in the SDK?", options: ["It's always on", "Pass the claude_code preset", "Copy it from GitHub", "Impossible"], answer: 1, why: "No default system prompt since v0.1.0." },
          { q: "A product built on the SDK must authenticate with…", options: ["claude.ai login", "API keys", "GitHub tokens", "Nothing"], answer: 1, why: "SDK products must use API keys." },
        ],
        sources: [
          { label: "Agent SDK overview", url: D + "agent-sdk/overview" },
          { label: "Migration guide", url: D + "agent-sdk/migration-guide" },
        ],
      },
      {
        id: "l5-cost",
        title: "Cost, limits and model choice",
        minutes: 9,
        intuition: L(
          "Cost follows three dials: **which model**, **how much effort**, and **how much context** each turn re-sends. Turn the right dial and you can do more within the same plan.",
        ),
        analogy: L(
          "Driving costs: the car you pick (model), how hard you press the pedal (effort), and how much luggage you haul on every trip (context). Don't drive the truck, flooring it, with a full trailer to buy milk.",
        ),
        formal: L(
          "**Benchmark:** about **$13 per developer per active day**, $150 to $250 per month, with 90% of users under $30 per active day (enterprise deployments).",
          "**Worked example:** 15 active days × $13 ≈ **$195/month**. Let parallel agents push 4 of those days to $30: 11 × 13 + 4 × 30 = 143 + 120 = **$263**, already past the top of the band.",
          "**Levers, roughly by impact:**",
          "1. **Model:** “Sonnet handles most coding tasks well and costs less than Opus.” Use `model: haiku` for simple subagents.",
          "2. **Effort:** lower `/effort` for routine work; thinking is billed as output.",
          "3. **Context:** `/clear` between tasks (it costs nothing), lean CLAUDE.md, delegate noisy test runs to subagents.",
          "4. **Filter output:** a PreToolUse hook can pipe `npm test` through `grep … | head -100`.",
          "- **Tools:** `/usage` (cost, plan bars, attribution), `/insights` (HTML report), `/usage-credits` (buy overflow).",
          "- **Limits:** “session” and “weekly” limits apply across all models, so switching models won't help; after an “Opus limit”, switching families does.",
          "- Agent teams use about **7× more tokens**. November's top complaint: parallel agents and Projects threads burning limits in minutes.",
        ),
        example: {
          title: "Same feature, half the cost",
          steps: [
            { label: "Before", text: "Opus at max effort, one long session doing five tasks, full test logs in context." },
            { label: "After", text: "`/model sonnet` for implementation, `/effort medium`, `/clear` between tasks, a Haiku subagent runs tests and returns only failures." },
          ],
          result: "Same output, far fewer tokens per turn. Check the difference in `/usage` attribution.",
        },
        caveman: "Cost = model × effort × context. Sonnet most job. Haiku small helper. /clear free. Big agent team eat 7x token.",
        quiz: [
          { q: "Anthropic's average enterprise cost per developer per active day is about…", options: ["$1", "$13", "$130", "$1,300"], answer: 1, why: "~$13/active day, $150–250/month." },
          { q: "You hit a weekly limit. Will switching to Haiku help?", options: ["Yes", "No, session/weekly limits apply across all models", "Only on weekends", "Only in plan mode"], answer: 1, why: "Only model-specific limits (like an Opus limit) are helped by switching." },
          { q: "Which costs nothing and often saves the most?", options: ["/clear between tasks", "Max effort", "More MCP servers", "Longer CLAUDE.md"], answer: 0, why: "Stops old context being re-sent every turn." },
        ],
        sources: [{ label: "Costs", url: D + "costs" }],
      },
    ],
  },

  {
    id: "l6",
    num: 6,
    title: "Professional practice",
    rank: "Professional",
    tagline: "Security, team configuration, and the habits that separate pros from hype.",
    goal: "Run Claude Code safely on a team, with committed config, enforced policy, human review and honest measurement.",
    project: {
      title: "Team-ready repo",
      brief: "Make one repository team-ready: committed config, secrets protected, sandbox on, a review workflow, and a one-page README for teammates.",
      checklist: [
        "Committed .claude/settings.json, CLAUDE.md, .claude/skills/ and .claude/agents/",
        "Added `.claude/*.local.*` to .gitignore and a pre-commit secret scan",
        "Turned on `/sandbox` and tested a blocked network call",
        "Documented the writer/reviewer workflow for your team",
        "Measured one week of your own tasks: time with and without Claude",
      ],
    },
    lessons: [
      {
        id: "l6-security",
        title: "Security: the lessons already learned the hard way",
        minutes: 9,
        intuition: L(
          "An agent that can run any command you can run can also make any mistake you can make, faster. Professional use means deciding what Claude is **not** allowed to do, and assuming that prompts and repos can be hostile.",
        ),
        analogy: L(
          "Giving a very fast new employee keys to the building. You don't hand them the master key on day one; you give them the rooms they need and lock the server room, however trustworthy they seem.",
        ),
        formal: L(
          "**Sandbox (off by default):** `/sandbox` or `\"sandbox\": {\"enabled\": true}`. Seatbelt on macOS, bubblewrap on Linux/WSL2, nothing on native Windows. Writes are limited to the working directory, but **reads cover most of the machine** (including `~/.ssh`); network goes through an allowlist that starts empty. Set `failIfUnavailable: true` and `allowUnsandboxedCommands: false`.",
          "**Bypass:** `--dangerously-skip-permissions` checks nothing; only in a container, VM or the sandbox runtime.",
          "**Real incidents:**",
          "- Dec 2025: Claude Code ran `rm -rf tests/ patches/ plan/ ~/`; the trailing `~/` wiped a user's home directory.",
          "- Nov 2026: account email appearing in User-Agent headers; v2.1.317 now asks before a call sends it.",
          "- Nov 2026: clicking “Don't ask again” on a command containing a secret saved it into `.claude/settings.local.json`; such files were committed in about 1,100 public repos. Claude Code only adds that file to your **global** git excludes, so add `.claude/*.local.*` to each repo's `.gitignore` and scan for secrets before commit.",
          "- Oct 2026: a backdoored “Claude Code for VS Code” extension on Open VSX. Install only from official publishers.",
          "**Prompt injection:** content Claude reads (web pages, issues, files) can contain instructions. Keep risky actions behind permissions.",
        ),
        example: {
          title: "Hardening checklist in 5 minutes",
          steps: [
            { label: "Deny secrets", code: "\"deny\": [\"Read(./.env)\", \"Read(./.env.*)\", \"Read(~/.ssh/**)\"]" },
            { label: "Ignore local settings", code: "echo '.claude/*.local.*' >> .gitignore" },
            { label: "Sandbox on", code: "/sandbox" },
            { label: "Bypass only in a box", code: "docker run … claude --dangerously-skip-permissions" },
          ],
          result: "The most common real-world failures (wiped files, leaked secrets, malicious extensions) are now blocked or contained.",
        },
        caveman: "Agent fast. Mistake fast too. Sandbox on. Deny secret file. .local file in gitignore. Bypass only in box. Extension only official.",
        pitfall: "Assuming auto mode makes you safe. Anthropic says it reduces prompts but does not guarantee safety.",
        quiz: [
          { q: "Is the OS sandbox on by default?", options: ["Yes", "No, turn it on with /sandbox", "Only on Windows", "Only in CI"], answer: 1, why: "It's off by default." },
          { q: "Why add `.claude/*.local.*` to each repo's .gitignore?", options: ["Style", "Secrets saved via “Don't ask again” can land there and get committed", "It's required to start", "It speeds up git"], answer: 1, why: "~1,100 public repos leaked secrets that way." },
          { q: "What did the trailing `~/` in the Dec 2025 incident do?", options: ["Nothing", "Deleted the user's home directory", "Opened a browser", "Logged out"], answer: 1, why: "A one-character mistake with huge reach." },
        ],
        sources: [
          { label: "Sandboxing", url: D + "sandboxing" },
          { label: "Security", url: D + "security" },
        ],
      },
      {
        id: "l6-team",
        title: "Team configuration and managed policy",
        minutes: 8,
        intuition: L(
          "On a team, the repository **is** the configuration. Commit the settings, memory, skills, agents and MCP servers so everyone gets the same Claude. Above that, admins can enforce policy that individuals can't turn off.",
        ),
        analogy: L(
          "A shared kitchen: the recipe book and labeled shelves live in the kitchen (the repo), so every cook works the same way. The building's fire code (managed policy) applies no matter which cook is on shift.",
        ),
        formal: L(
          "**Commit:** `.claude/settings.json` (permissions, hooks), `CLAUDE.md` and `.claude/rules/` (guidance), `.claude/skills/` and `.claude/agents/` (procedures), `.mcp.json` (shared servers).",
          "**Onboarding detail:** committed `deny` and `ask` rules apply immediately; committed `allow` rules wait until each teammate trusts the folder.",
          "**Managed policy (admins):** `managed-settings.json` (or MDM / server-managed from the console), a managed CLAUDE.md via `claudeMd`, `permissions.disableBypassPermissionsMode` and `disableAutoMode` set to `\"disable\"`, `allowManagedHooksOnly`, `managedMcpServers`, and marketplace allowlists that can force-install plugins.",
          "Since v2.1.257, `bypassPermissions` can't be switched on from project or local settings, so a malicious repo can't enable it for you.",
          "**Also:** OpenTelemetry monitoring, periodic `/permissions` audits, `ConfigChange` hooks to audit settings changes, `/security-review`, dev containers.",
          "**Cherny's loop:** tag `@.claude` on PRs so lessons flow back into the shared CLAUDE.md.",
        ),
        example: {
          title: "What a team-ready repo contains",
          steps: [
            { label: "Tree", code: "CLAUDE.md\n.mcp.json\n.claude/\n  settings.json\n  rules/api.md\n  skills/verify/SKILL.md\n  skills/release/SKILL.md\n  agents/code-reviewer.md\n.gitignore   ← includes .claude/*.local.* and .claude/worktrees/" },
          ],
          result: "A new teammate clones, trusts the folder, and immediately works the same way as everyone else.",
        },
        caveman: "Team: put config in repo. Everyone same Claude. Boss rule (managed) beat all. Deny work now, allow wait for trust.",
        quiz: [
          { q: "When do committed `allow` rules take effect for a teammate?", options: ["Immediately", "After they trust the folder", "Never", "After a week"], answer: 1, why: "Deny/ask apply immediately; allow waits for trust." },
          { q: "Can a cloned repo enable bypassPermissions for you via project settings?", options: ["Yes", "No, ignored since v2.1.257", "Only on macOS", "Only with MCP"], answer: 1, why: "A safety change against malicious repos." },
          { q: "Which file shares MCP servers with the team?", options: [".mcp.json", "~/.claude.json", "CLAUDE.local.md", "package-lock.json"], answer: 0, why: "Project-scope MCP config lives in .mcp.json." },
        ],
        sources: [{ label: "Settings", url: D + "settings" }],
      },
      {
        id: "l6-workflow",
        title: "The professional workflow",
        minutes: 8,
        intuition: L(
          "Experienced users have converged on a calm, repeatable pattern: **design doc → plan → build in parallel worktrees → adversarial review → human approval.** Their setups are surprisingly plain.",
        ),
        analogy: L(
          "A film production: script (design doc), storyboard (plan), multiple crews shooting scenes at once (worktrees), an editor who wasn't on set (fresh review), and the director's final cut (you).",
        ),
        formal: L(
          "- **From November's biggest setup discussion (Hacker News):** Opus 5.5 at medium effort, several sessions each in its own worktree, subagents for review and large searches, and a design doc, then a plan, then adversarial review before code. Codex is often used as a second-opinion reviewer.",
          "- **Cherny's setup is mostly vanilla:** a ~2.5k-token shared CLAUDE.md, a few slash commands, one formatter hook, permission allowlists.",
          "- **Abandon freely:** dropping 10 to 20% of runs is normal.",
          "- **The supervision paradox:** Anthropic's own engineers worry about skills atrophying as they delegate more, while supervising Claude well needs exactly those skills. Keep humans in the review seat: read diffs, review in fresh contexts, take over after repeated failed rounds.",
          "- **Watch for:** “A year after the 100% AI mandate nobody understands our code” struck a nerve in November (though commenters suspected the post itself was AI-written bait).",
        ),
        example: {
          title: "One feature, the pro way",
          steps: [
            { label: "Design", code: "› interview me and write docs/design/export.md" },
            { label: "Plan", code: "/plan implement docs/design/export.md in 3 independent parts" },
            { label: "Build", code: "claude -w export-api · claude -w export-ui · claude -w export-tests" },
            { label: "Review", code: "(fresh session) › adversarially review the three branches against\n  the design doc. Only real gaps." },
            { label: "Human", text: "You read the diffs, run the app, merge." },
          ],
          result: "Fast, parallel, and still understood by a human.",
        },
        caveman: "Pro way: write design, make plan, many worktree, fresh reviewer, human say yes. Setup simple. Keep own brain sharp.",
        quiz: [
          { q: "Claude Code's creator's personal setup is…", options: ["40 custom subagents", "Mostly vanilla: short CLAUDE.md, few commands, one hook", "Dozens of MCP servers", "Bypass mode always"], answer: 1, why: "The experts creators cite run plain setups." },
          { q: "What is the “supervision paradox”?", options: ["Agents supervise each other", "Overseeing Claude needs the skills that over-delegation erodes", "A billing rule", "A git error"], answer: 1, why: "Named in Anthropic's internal research." },
          { q: "Abandoning 10–20% of runs is…", options: ["A sign you're bad at it", "Normal; cheaper than rescuing a bad run", "Against the rules", "Impossible"], answer: 1, why: "Cherny reports abandoning that share." },
        ],
        sources: [
          { label: "How AI is transforming work at Anthropic", url: "https://anthropic.com/research/how-ai-is-transforming-work-at-anthropic" },
          { label: "InfoQ: Claude Code creator's workflow", url: "https://www.infoq.com/news/2026/01/claude-code-creator-workflow" },
        ],
      },
      {
        id: "l6-evidence",
        title: "Hype vs evidence: measure yourself",
        minutes: 8,
        intuition: L(
          "“10× productivity” headlines have no data behind them. The best independent study found experienced developers were **19% slower** with early-2025 AI tools while **believing** they were 20% faster. Feelings are a poor instrument, so measure your own work.",
        ),
        analogy: L(
          "A new running shoe that “makes you 10× faster.” You'd time yourself on the same route before believing it. Do the same with your tools.",
        ),
        formal: L(
          "- **METR, July 2025 (randomized):** 16 experienced open-source developers, 246 real issues; AI-allowed tasks took **19% longer**; developers expected 24% faster and afterwards believed ~20% faster. Mostly Cursor with Claude 3.5/3.7; METR now marks it out of date.",
          "- **METR, Feb 2026 update:** 57 developers, 800+ tasks; speedups of 18% (returning) and 4% (new), confidence intervals crossing zero. METR calls it “very weak evidence.”",
          "- **Anthropic internal (self-reported):** ~+50% productivity, +67% merged PRs per engineer per day, 27% of work wouldn't otherwise have been done. Anthropic flags selection, social-desirability and recall bias.",
          "- **Fair reading:** modern agentic tooling probably gives positive but modest-to-moderate per-task speedups, plus real **scope expansion** that speed metrics miss.",
          "- **What's genuinely under-used:** verification setups and custom agents. Not “hidden features”.",
        ),
        example: {
          title: "A one-week personal experiment",
          steps: [
            { label: "Pick 10 similar tasks", text: "E.g. small bug fixes of similar size." },
            { label: "Alternate", text: "Do 5 with Claude Code, 5 without, alternating to avoid a learning effect." },
            { label: "Record", text: "Start/stop time, rework needed afterwards, bugs found in review." },
            { label: "Compute", text: "Say 5 tasks averaged 50 min without and 38 min with, plus 6 min rework: (50 − 44) / 50 = **12% faster**, not 10×. Now you know your real number." },
          ],
          result: "An honest, personal baseline that beats any headline, and tells you which task types benefit most.",
        },
        caveman: "10x claim no proof. Study: people feel faster, were slower. Measure self. Real gain from verify habit, not hidden trick.",
        quiz: [
          { q: "In METR's 2025 trial, AI-allowed tasks took…", options: ["10× less time", "19% longer", "Exactly the same", "50% less time"], answer: 1, why: "And developers believed they were ~20% faster." },
          { q: "Anthropic's +67% merged PRs figure is…", options: ["A randomized trial", "Internal and self-reported, with bias flagged by Anthropic", "From METR", "Made up by creators"], answer: 1, why: "Anthropic lists the biases itself." },
          { q: "Which “underused” claim has the best support?", options: ["Secret hidden commands", "Verification loops", "Installing 40 subagents", "Bypass mode"], answer: 1, why: "Broad expert consensus, even without a controlled study." },
        ],
        sources: [
          { label: "METR 2025 study", url: "https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/" },
          { label: "METR 2026 update", url: "https://metr.org/blog/2026-02-24-uplift-update/" },
        ],
      },
    ],
  },
]
