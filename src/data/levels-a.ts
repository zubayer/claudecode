import type { Level } from "./types"

const L = (...lines: string[]) => lines.join("\n")
const D = "https://code.claude.com/docs/en/"

export const LEVELS_A: Level[] = [
  {
    id: "l0",
    num: 0,
    title: "Foundations",
    rank: "Curious",
    tagline: "What Claude Code is, what you need, and your very first session.",
    goal: "Install Claude Code, log in, and complete a first session that ends in a git commit.",
    project: {
      title: "Hello, agent",
      brief: "Create an empty folder, put it under git, and have Claude Code build a one-page site that says hello. Commit it.",
      checklist: [
        "Installed Claude Code and ran `claude --version`",
        "Ran `git init` in a new folder and launched `claude` there",
        "Asked Claude to build a hello-world web page and opened it",
        "Asked Claude to commit with a descriptive message",
      ],
    },
    lessons: [
      {
        id: "l0-what",
        title: "What Claude Code actually is",
        minutes: 7,
        intuition: L(
          "Chat with Claude gives you **text**. Claude Code gives you **actions**.",
          "It is an agentic coding tool: it reads your project, edits real files, runs terminal commands and works with git, all inside the folder you start it in.",
          "So the question changes from “how do I write this code?” to “how do I describe the job clearly, and how will we both know it is done?”",
        ),
        analogy: L(
          "Chat is like phoning an expert friend: they tell you what to do and you do the typing.",
          "Claude Code is like having that friend **sit at your computer**. They can open files, run things and fix what breaks, while you watch, approve and steer. You are now the manager, not the typist.",
        ),
        formal: L(
          "Anthropic describes every task as an **agentic loop**:",
          "1. **Gather context**: read files, search the codebase, check git state, load CLAUDE.md.",
          "2. **Take action**: edit files, run commands.",
          "3. **Verify results**: run tests, builds or checks, then repeat.",
          "The layer around the model that supplies the tools and manages context is called the **agentic harness**.",
          "Key facts:",
          "- It works on **anything you can do from a command line**, not only code (data, docs, automation).",
          "- The same engine runs in the terminal CLI, VS Code / Cursor, JetBrains, the Desktop app (Code tab), the web at claude.ai/code, the mobile apps, Slack and CI.",
          "- Each new session starts with a **fresh context window**. Sessions are saved under `~/.claude/projects/`.",
          "- On subscription plans, usage limits are **shared with Claude chat**.",
        ),
        example: {
          title: "Same request, two tools",
          setup: "You have a small Python project and a failing script.",
          steps: [
            { label: "In chat", text: "You paste the error. Claude explains a likely cause and shows a fix. You copy it into the file, run it again, and paste the next error back." },
            { label: "In Claude Code", code: "› the report script crashes on empty CSV files, fix it and prove it works" },
            { label: "What Claude Code does on its own", text: "Reads `report.py`, finds the empty-file case, edits it, creates a tiny empty CSV, runs the script, shows you the passing output and the diff." },
          ],
          result: "Same model, very different workflow: the loop of read → edit → run → check happens inside the tool, and you review evidence instead of copying code.",
        },
        caveman: "Chat talk. Claude Code do. It read file, change file, run command, check result. You boss, not typist.",
        pitfall: "Treating Claude Code like chat: asking for code snippets and copying them yourself. Let it edit and run things, then review the result.",
        proTip: "Start every session inside the project folder you want it to touch. That folder is its whole world.",
        quiz: [
          { q: "What most separates Claude Code from chatting with Claude?", options: ["It uses a different, secret model", "It can act on real files and run commands in a loop", "It only works for Python", "It never asks permission"], answer: 1, why: "Claude Code is an agentic harness: it gathers context, acts and verifies, on your real project." },
          { q: "What are the three phases of the agentic loop?", options: ["Plan, code, deploy", "Gather context, take action, verify results", "Read, write, delete", "Prompt, answer, rate"], answer: 1, why: "Gather context → take action → verify results, repeated until the task is done." },
          { q: "On a Pro or Max plan, how do Claude Code limits relate to chat?", options: ["Completely separate", "Shared with Claude chat", "Claude Code is unlimited", "Chat is disabled while coding"], answer: 1, why: "Subscription usage limits are shared between chat and Claude Code." },
        ],
        sources: [
          { label: "How Claude Code works", url: D + "how-claude-code-works" },
          { label: "Overview", url: D + "overview" },
        ],
      },
      {
        id: "l0-skills",
        title: "The skills you need (and the ones you don't)",
        minutes: 8,
        intuition: L(
          "To **start**, you need almost nothing. The official docs say plainly that you don't need to know how to code, and that you can use it even if you have never used a terminal.",
          "To be **efficient**, you need five habits: say exactly what you want, give Claude a way to check its work, keep each session focused, review evidence instead of trusting “done”, and use git as your real undo button.",
        ),
        analogy: L(
          "Think of hiring a fast, talented contractor to renovate a kitchen.",
          "You don't need to be a carpenter. But you do need to **describe the kitchen you want**, **inspect the work**, keep them on **one room at a time**, and keep **photos of how it was before** in case you need to restore it. Those management skills decide whether the result is great or a mess.",
        ),
        formal: L(
          "**Minimum to start → what makes you efficient**",
          "- **Terminal**: `cd` into a folder and paste one install command (or skip the terminal with the Desktop or web app) → fix your PATH, use `!` shell mode, pipe output into `claude -p`.",
          "- **Specifying**: describe the goal in plain English → scoped requests that point at files and existing patterns; a written `SPEC.md` for big features.",
          "- **Verifying**: open the page or run the script yourself → tests, builds, linters and screenshots Claude runs itself.",
          "- **Context**: know `/clear` exists → `/clear` between tasks, `/compact`, `/context`, subagents for big searches.",
          "- **Review**: approve or deny prompts, press `Esc` to stop → read diffs with `/diff`, ask for evidence, review in a fresh session.",
          "- **Git**: understand commits as save points → branches, PRs with `gh`, worktrees for parallel sessions.",
          "Anthropic publishes no formal prerequisite checklist; this split comes from its beginner terminal guide and its best-practices page.",
        ),
        example: {
          title: "Vague vs specific, the single biggest skill",
          steps: [
            { label: "Vague", code: "› fix the bug" },
            { label: "Specific (from Anthropic's own docs)", code: "› fix the login bug where users see a blank screen\n  after entering wrong credentials" },
            { label: "Specific + verifiable", code: "› fix the login bug where users see a blank screen after\n  entering wrong credentials. Add a test that reproduces it,\n  make it pass, and show me the test output." },
          ],
          result: "The third prompt names the symptom, the place, and the proof. Claude can now work, check itself, and show you evidence.",
        },
        caveman: "Start need little. Good use need five habit: say exact, give check, one task per session, look at proof, git save often.",
        pitfall: "Believing you must learn to program first. Start now, but learn git basics early: they are your safety net.",
        proTip: "Learn just four git ideas this week: repository, commit, branch, and `git diff`. That covers 90% of what you need with Claude Code.",
        quiz: [
          { q: "According to the official docs, do you need to know how to code to start?", options: ["Yes, at least one language", "No", "Only JavaScript", "Only if using the CLI"], answer: 1, why: "The terminal guide states you don't need to know how to code to use Claude Code." },
          { q: "Which habit does Anthropic call the difference between a session you watch and one you walk away from?", options: ["Using the biggest model", "Giving Claude a way to verify its work", "Typing fast", "Writing long prompts"], answer: 1, why: "Verification: tests, builds or screenshots Claude can run itself." },
          { q: "What is the real undo for changes Claude makes?", options: ["Ctrl+Z", "Closing the terminal", "Git", "Asking Claude to forget"], answer: 2, why: "Checkpoints help, but they don't track everything (e.g. shell commands). Git is the true safety net." },
        ],
        sources: [
          { label: "Terminal guide", url: D + "terminal-guide" },
          { label: "Best practices", url: D + "best-practices" },
        ],
      },
      {
        id: "l0-install",
        title: "Install, log in, and avoid the API-key trap",
        minutes: 7,
        intuition: L(
          "One command installs Claude Code. Then you run `claude`, a browser opens, and you log in with a paid Claude plan or an API account.",
          "The free plan does not include Claude Code.",
        ),
        analogy: L(
          "It's like installing a new app and signing in with your existing account. The one gotcha: if an old “API key” is sitting in your shell settings, Claude Code uses that key instead, a bit like a forgotten credit card on file that gets charged instead of your subscription.",
        ),
        formal: L(
          "**Install (recommended native installer, auto-updates):**",
          "```",
          "# macOS / Linux / WSL",
          "curl -fsSL https://claude.ai/install.sh | bash",
          "# Windows PowerShell",
          "irm https://claude.ai/install.ps1 | iex",
          "```",
          "Alternatives (no auto-update): `brew install --cask claude-code`, `winget install Anthropic.ClaudeCode`, or `npm install -g @anthropic-ai/claude-code` (Node.js 22+, never with sudo).",
          "**Check it:** `claude --version`, `claude doctor` (read-only diagnostics), `claude update`.",
          "**Requirements:** macOS 13+, Windows 10 1809+, Ubuntu 20.04+, Debian 10+ or Alpine 3.19+, 4 GB+ RAM, internet.",
          "**Plans (claude.com/pricing, Nov 2026):** Pro $20/mo, Max $100/mo, Ultra $200/mo (renamed from Max 20x on Nov 1), Team and Enterprise seats, or a Console (API) account.",
          "**Login:** run `claude` and follow the browser prompts. `/login` switches account, `/logout` signs out.",
          "**The trap:** if `ANTHROPIC_API_KEY` is set in your shell, Claude Code uses it instead of your subscription and bills at API rates.",
          "**“command not found”?** The native install puts the launcher in `~/.local/bin`. Add it to PATH, e.g. `echo 'export PATH=\"$HOME/.local/bin:$PATH\"' >> ~/.zshrc`.",
        ),
        example: {
          title: "A clean install on a Mac",
          steps: [
            { label: "Install", code: "curl -fsSL https://claude.ai/install.sh | bash" },
            { label: "Confirm", code: "claude --version\nclaude doctor" },
            { label: "Make sure no stray key is set", code: "echo $ANTHROPIC_API_KEY   # should print nothing" },
            { label: "Launch and log in", code: "cd ~/projects/my-site\nclaude" },
          ],
          result: "The startup banner shows the version, the current model and your working directory. You are ready.",
        },
        terminal: {
          intro: "Simulated shell. Let's install and check Claude Code.",
          steps: [
            { cmd: "curl -fsSL https://claude.ai/install.sh | bash", out: ["Downloading Claude Code…", "✔ Installed to ~/.local/bin/claude", "Auto-updates: on"], note: "The native installer is the recommended path in 2026." },
            { cmd: "claude --version", out: ["2.1.330 (Claude Code)"] },
            { cmd: "claude doctor", out: ["✔ Installation: native", "✔ PATH ok", "✔ Auth: not signed in yet (run `claude`)", "No ANTHROPIC_API_KEY found ✔"], note: "`claude doctor` is read-only, so it's safe to run anytime." },
          ],
        },
        caveman: "One curl line install. Run claude. Browser login. Free plan no work. Old API key in shell = surprise bill. Check with claude doctor.",
        pitfall: "Following a 2025 tutorial that says “install Node 18 first”. The native installer doesn't need Node, and npm installs now need Node 22+.",
        proTip: "Before buying a bigger plan, use `/usage` for a week to see what you really consume.",
        quiz: [
          { q: "Which is the recommended install method in 2026?", options: ["npm with sudo", "The native installer script", "Building from source", "Docker only"], answer: 1, why: "The native installer is recommended and auto-updates." },
          { q: "What happens if ANTHROPIC_API_KEY is set in your shell?", options: ["Nothing", "Claude Code uses the key and bills API rates instead of your subscription", "Claude Code refuses to start", "It doubles your limits"], answer: 1, why: "A leftover API key overrides your subscription login." },
          { q: "Which command runs read-only diagnostics without starting a session?", options: ["claude doctor", "claude fix", "/reset", "claude --repair"], answer: 0, why: "`claude doctor` checks the install and environment." },
        ],
        sources: [
          { label: "Advanced setup", url: D + "setup" },
          { label: "Using Claude Code with Pro or Max", url: "https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan" },
        ],
      },
      {
        id: "l0-first",
        title: "Your first session, start to commit",
        minutes: 9,
        intuition: L(
          "A good first session has four beats: **ask** about the project, make **one small change**, **approve** it, and **commit** it.",
          "Ask before you build. Claude reads files as needed, and you learn the codebase at the same time.",
        ),
        analogy: L(
          "It's a first day with a new teammate. You show them around (“what does this project do?”), give them a tiny task, check their work, and save it. You don't hand a new hire the whole roadmap on day one.",
        ),
        formal: L(
          "The official quickstart sequence:",
          "1. `cd /path/to/your/project`, then `claude`.",
          "2. Ask questions: `what does this project do?`, `explain the folder structure`.",
          "3. Make a small change: `add a hello world function to the main file`. Claude shows the edit and may ask permission.",
          "4. Use git in plain English: `what files have I changed?`, then `commit my changes with a descriptive message`.",
          "Useful beginner controls: `Esc` interrupts Claude (work so far is kept), `/help` lists commands, `exit` or `Ctrl+D` twice quits.",
          "**Default model:** the docs name Opus 5.5 as the default, while a release log reports Fable 5.2 became default on Nov 9 (v2.1.321). The sources disagree, so check the banner or `/status` and pin a model with `/model` if you care.",
          "**Permission prompts:** since v2.1.283, interactive sessions start in **auto mode**, where a safety classifier approves routine actions, so you may see fewer prompts than older videos show.",
        ),
        example: {
          title: "Non-programmer first win",
          setup: "An empty folder called hello-site, already under git.",
          steps: [
            { label: "Ask for something tiny and visible", code: "› make me a simple webpage that says hello world" },
            { label: "Open it", text: "Double-click the `index.html` Claude created. You see your page." },
            { label: "Iterate once", code: "› make the background warm beige and center the text" },
            { label: "Save the win", code: "› commit my changes with a descriptive message" },
          ],
          result: "You built, changed, and saved something real without writing code, and you have a commit to return to.",
        },
        terminal: {
          intro: "Simulated session inside ~/hello-site (a git repo). Follow the four beats.",
          steps: [
            { cmd: "claude", out: ["Claude Code v2.1.330 · model shown here · ~/hello-site", "Tip: ask a question about your project to get started"], note: "Check the model name in this banner." },
            { cmd: "what does this project do?", accept: ["what does this project do"], out: ["⏺ Read(README.md)", "This folder is almost empty: just a README describing a personal homepage."] },
            { cmd: "make me a simple webpage that says hello world", out: ["⏺ Write(index.html)", "  + <h1>Hello world</h1>", "Created index.html. Open it in your browser to see it."] },
            { cmd: "commit my changes with a descriptive message", out: ["⏺ Bash(git add index.html && git commit -m \"Add hello world homepage\")", "[main 1a2b3c4] Add hello world homepage", " 1 file changed, 12 insertions(+)"], note: "Commits are your real save points." },
          ],
        },
        caveman: "cd folder. claude. Ask first. Small change. Approve. Commit. Esc stop. /help help.",
        pitfall: "Starting in a folder that isn't under git. Run `git init` first so every step can be undone.",
        proTip: "End every session with a commit. Tomorrow-you will thank you.",
        quiz: [
          { q: "What's a good first thing to type in a new project?", options: ["rewrite everything in Rust", "what does this project do?", "/logout", "delete unused files"], answer: 1, why: "Ask questions first; Claude reads files and you both learn the codebase." },
          { q: "Which key interrupts Claude while keeping work done so far?", options: ["Ctrl+C three times", "Esc", "Tab", "F5"], answer: 1, why: "Esc interrupts; the work done so far is kept." },
          { q: "Why do you see fewer permission prompts than in older tutorials?", options: ["Prompts were removed", "Interactive sessions now start in auto mode with a safety classifier", "You're on the free plan", "Claude Code is offline"], answer: 1, why: "Since v2.1.283 interactive sessions start in auto mode." },
        ],
        sources: [{ label: "Quickstart", url: D + "quickstart" }],
      },
    ],
  },

  {
    id: "l1",
    num: 1,
    title: "Driving the session",
    rank: "First Prompt",
    tagline: "Keys, commands, permissions and context: the controls of every session.",
    goal: "Steer any session confidently: interrupt, rewind, switch modes, check usage, and keep context clean.",
    project: {
      title: "Tame a real repo",
      brief: "Clone a small open-source repo you like. Explore it with Claude, then make one safe improvement using the controls from this level.",
      checklist: [
        "Used `@` to point Claude at a specific file",
        "Ran a shell command with `!` and asked Claude about the output",
        "Used `Esc Esc` / `/rewind` to undo an experiment",
        "Ran `/context` and `/usage`, then `/clear` before a second task",
        "Added one allow rule and one deny rule with `/permissions`",
      ],
    },
    lessons: [
      {
        id: "l1-keys",
        title: "Three keys and five prefixes",
        minutes: 6,
        intuition: L(
          "Three keys run most sessions: **Esc** (stop), **Esc Esc** (rewind), **Shift+Tab** (change permission mode).",
          "Five prefixes change what your typing means: `/` commands, `!` shell, `@` files, `?` shortcut help, `:` emoji.",
        ),
        analogy: L(
          "Driving a car: Esc is the brake, Esc Esc is reverse, Shift+Tab is the gear stick. The prefixes are like the indicator, horn and wipers: small controls you reach for without looking once they're habit.",
        ),
        formal: L(
          "- `Esc`: interrupt Claude; keeps work done so far.",
          "- `Esc Esc` on an empty prompt: open the **rewind** menu.",
          "- `Shift+Tab`: cycle permission modes (`Alt+M` on some Windows setups).",
          "- `/`: commands and skills. `!`: shell mode, e.g. `! npm test` runs directly and adds the output to the session. `@`: file mention with autocomplete. `?` on an empty prompt: shortcut help.",
          "- `Ctrl+V` (`Alt+V` on Windows/WSL): paste an image or screenshot.",
          "- `Ctrl+G`: edit the prompt or plan in your editor. `Ctrl+R`: history search. `Ctrl+B`: background a task. `Ctrl+O`: transcript.",
          "- `\\` + `Enter`: newline anywhere (`/terminal-setup` binds Shift+Enter).",
          "**Changed:** the old `#` prefix for adding memories is no longer in the docs. Ask Claude to add it to CLAUDE.md, or use `/memory`.",
        ),
        example: {
          title: "Debug a failing test in 3 keystrokes of context",
          steps: [
            { label: "Run tests yourself, output lands in context", code: "! npm test" },
            { label: "Point at the exact file", code: "› @src/cart.ts why does the discount test fail? fix it" },
            { label: "Claude heads the wrong way? Brake.", text: "Press `Esc`, then redirect: “don't touch the API, the bug is in rounding”." },
          ],
          result: "You fed Claude real output and a precise file, and corrected course instantly instead of waiting.",
        },
        terminal: {
          intro: "Simulated session in a shop app. Practice the prefixes.",
          steps: [
            { cmd: "! npm test", out: ["FAIL src/cart.test.ts", "  ✕ applies 10% discount (expected 90, got 89.99)", "Tests: 1 failed, 23 passed"], note: "`!` runs the shell command and puts the output in Claude's context." },
            { cmd: "@src/cart.ts why does the discount test fail?", accept: ["@src/cart.ts why does the discount test fail"], out: ["⏺ Read(src/cart.ts)", "The discount is applied before rounding, so 100 × 0.9 floats to 89.99…", "Want me to round to cents after applying the discount?"] },
            { cmd: "?", out: ["Shortcuts: Esc interrupt · Esc Esc rewind · Shift+Tab mode · Ctrl+V paste image · Ctrl+G edit in $EDITOR · Ctrl+R history"] },
          ],
        },
        caveman: "Esc stop. Esc Esc go back. Shift+Tab change mode. ! run shell. @ point file. / command. # memory gone, use /memory.",
        pitfall: "Waiting silently while Claude goes the wrong way. Press Esc early; interrupting is normal and cheap.",
        quiz: [
          { q: "What does `! npm test` do?", options: ["Asks Claude to write tests", "Runs the command directly and adds output to context", "Deletes tests", "Opens npm docs"], answer: 1, why: "The `!` prefix is shell mode." },
          { q: "How do you open the rewind menu?", options: ["Esc Esc on an empty prompt", "Ctrl+Z", "/undo-all", "Shift+Tab"], answer: 0, why: "Double Esc on an empty prompt opens rewind (or use /rewind)." },
          { q: "The `#` memory shortcut from older tutorials is…", options: ["Still the main way", "No longer documented; use /memory or ask Claude", "Renamed to $", "Only on Windows"], answer: 1, why: "Current docs list `/ ! @ : ?` as prefixes; memory goes through /memory or CLAUDE.md." },
        ],
        sources: [{ label: "Interactive mode", url: D + "interactive-mode" }],
      },
      {
        id: "l1-commands",
        title: "The dozen slash commands that matter",
        minutes: 8,
        intuition: L(
          "There are many commands, but about twelve cover daily work: clearing and compacting context, checking usage, switching model and effort, resuming sessions, rewinding, and reviewing diffs.",
        ),
        analogy: L(
          "A new phone has hundreds of settings, but you use the same dozen every day: volume, brightness, Wi-Fi. Learn those first; look the rest up when you need them.",
        ),
        formal: L(
          "- `/clear [name]` (also `/reset`, `/new`): empty context; old conversation stays resumable.",
          "- `/compact [focus]`: summarize history, e.g. `/compact keep the API changes and the test commands`.",
          "- `/context`: colored grid of what fills the window.",
          "- `/usage` (aliases `/cost`, `/stats`): session cost, plan-limit bars.",
          "- `/model`, `/effort`: pick the model; set effort `low` → `max`.",
          "- `/resume`, `/rename`, `/branch`: manage sessions. From the shell: `claude -c` continues the latest, `claude -r` picks one.",
          "- `/rewind` (aliases `/checkpoint`, `/undo`): restore code, conversation, or both.",
          "- `/diff`: review working-tree changes.",
          "- `/permissions`: view and edit allow/ask/deny rules.",
          "- `/status`, `/config`, `/help`: version, model, account; settings UI; command list.",
          "- `/btw [question]`: a side question that stays out of context.",
          "**Removed since 2025:** `/vim` (use `/config` → Editor mode), `/pr-comments` (just ask Claude), `/ultraplan` (use plan mode).",
        ),
        example: {
          title: "Switching tasks the professional way",
          steps: [
            { label: "Finish task A and commit", code: "› commit these changes" },
            { label: "Check what you spent", code: "/usage" },
            { label: "Start task B clean", code: "/clear\n› the CSV export drops unicode names, investigate @src/export.py" },
          ],
          result: "Task B starts without task A's history being re-sent on every turn: cheaper, faster, and less confusing for Claude.",
        },
        terminal: {
          intro: "Simulated session. Use the daily commands.",
          steps: [
            { cmd: "/context", out: ["Context ▓▓▓▓░░░░░░░░░░░░░░ 18%", "  system 4% · memory 2% · tools 3% · messages 9%", "Suggestion: plenty of room."] },
            { cmd: "/usage", out: ["Session cost: $0.42", "5-hour limit ███░░░░░░░ 31%", "Weekly limit █░░░░░░░░░ 9%"], note: "/cost and /stats are now aliases of /usage." },
            { cmd: "/effort high", out: ["Effort set to high for this session."] },
            { cmd: "/clear", out: ["Context cleared. Previous conversation saved; use /resume to return."] },
          ],
        },
        caveman: "/clear new task. /compact shrink. /context see full. /usage see cost. /model /effort pick brain. /rewind undo. /diff look change.",
        quiz: [
          { q: "What happens to the old conversation after /clear?", options: ["Deleted forever", "It stays resumable", "Emailed to you", "Moved to CLAUDE.md"], answer: 1, why: "/clear empties context but the old session can be resumed." },
          { q: "Which command replaced /cost?", options: ["/money", "/usage (with /cost as an alias)", "/bill", "/stats only"], answer: 1, why: "/cost and /stats are aliases of /usage." },
          { q: "You want deeper reasoning on a hard bug. Which command?", options: ["/effort high", "/think harder", "/vim", "/pr-comments"], answer: 0, why: "Effort levels replaced the old think keywords." },
        ],
        sources: [{ label: "Commands reference", url: D + "commands" }],
      },
      {
        id: "l1-perms",
        title: "Permission modes and rules",
        minutes: 9,
        intuition: L(
          "Permissions decide **what Claude may do without asking**. Modes are the overall attitude (ask first, accept edits, plan only, auto). Rules are specific allow/ask/deny lines like “always allow running tests” or “never read .env”.",
        ),
        analogy: L(
          "A house-sitter: a mode is the general instruction (“call me before anything” vs “use your judgement”). Rules are the sticky notes: “feel free to water the plants”, “never open the safe”. A “never” note always wins over a “feel free” note.",
        ),
        formal: L(
          "**Six modes** (cycle with Shift+Tab):",
          "- `default`, shown as **Manual**: asks before edits and commands; reads run freely.",
          "- `acceptEdits`: auto-accepts file edits and simple file commands in the working directory.",
          "- `plan`: read-only exploration and a proposed plan.",
          "- `auto`: a background classifier reviews actions and blocks risky ones (e.g. `curl | bash`, force pushes, `git reset --hard`). **The interactive default since v2.1.283.** Anthropic says it reduces prompts but does not guarantee safety.",
          "- `dontAsk`: denies anything not pre-approved; meant for CI.",
          "- `bypassPermissions`: skips nearly all checks; **containers and VMs only**. Ignored in project/local settings since v2.1.257.",
          "**Rules** look like `Tool` or `Tool(specifier)` and are checked **deny → ask → allow**. The first match wins, so an allow can never punch a hole in a deny.",
          "Wildcard after the subcommand: `Bash(git log *)` allows only git log; `Bash(git *)` allows all git.",
          "**Where settings live:** `~/.claude/settings.json` (you, everywhere), `.claude/settings.json` (team, committed), `.claude/settings.local.json` (you, this project), plus managed settings. Precedence: managed > `--settings` > local > project > user.",
        ),
        example: {
          title: "A sensible project settings file",
          steps: [
            {
              label: ".claude/settings.json",
              code: `{
  "permissions": {
    "allow": ["Bash(npm run lint)", "Bash(npm run test *)", "Bash(git commit *)"],
    "deny":  ["Read(./.env)", "Read(./.env.*)", "Bash(git push *)"]
  }
}`,
            },
            { label: "Check it loaded", code: "/permissions" },
          ],
          result: "Tests and lint run without prompts, secrets are unreadable, and pushes always need you.",
        },
        terminal: {
          intro: "Simulated session. Cycle modes and inspect rules.",
          steps: [
            { cmd: "shift+tab", accept: ["shift tab", "shift-tab"], out: ["⏸ manual mode on"], note: "Each press moves to the next mode." },
            { cmd: "shift+tab", accept: ["shift tab", "shift-tab"], out: ["⏵⏵ accept edits on"] },
            { cmd: "/permissions", out: ["Allow: Bash(npm run lint) · Bash(npm run test *) · Bash(git commit *)   (.claude/settings.json)", "Deny:  Read(./.env) · Read(./.env.*) · Bash(git push *)", "Order: deny → ask → allow"] },
          ],
        },
        caveman: "Mode = attitude. Rule = sticky note. Deny beat allow always. Auto mode default now. Bypass only in box (container).",
        pitfall: "Settings files are strict JSON: one trailing comma silently breaks them.",
        proTip: "Pre-allow your safe, frequent commands (tests, lint, typecheck) instead of reaching for bypass mode. That's how Claude Code's creator works.",
        quiz: [
          { q: "In what order are permission rules evaluated?", options: ["allow → ask → deny", "deny → ask → allow", "Most specific first", "Random"], answer: 1, why: "Deny, then ask, then allow; first match wins." },
          { q: "Where should bypassPermissions be used?", options: ["Everywhere for speed", "Only inside containers or VMs", "Only on Fridays", "In committed project settings"], answer: 1, why: "It skips nearly all checks; it's ignored in project/local settings since v2.1.257." },
          { q: "What does `Bash(git log *)` allow?", options: ["All git commands", "Only git log commands", "All bash", "Nothing"], answer: 1, why: "Put the wildcard after the subcommand to scope it." },
        ],
        sources: [
          { label: "Permission modes", url: D + "permission-modes" },
          { label: "Permissions", url: D + "permissions" },
          { label: "Settings", url: D + "settings" },
        ],
      },
      {
        id: "l1-context",
        title: "Context, caching and checkpoints",
        minutes: 8,
        intuition: L(
          "Context is everything Claude currently “has in mind”: your messages, files it read, tool output. Every request sends the whole conversation, so a cluttered session is slower, costlier and more confused.",
          "Checkpoints let you rewind Claude's edits, but they are **not** a replacement for git.",
        ),
        analogy: L(
          "Context is a whiteboard in a meeting room. Each time you ask something, Claude re-reads the whole board. Three old projects scribbled on it make the fourth harder. `/clear` wipes the board; `/compact` rewrites it as neat bullet notes.",
        ),
        formal: L(
          "- Most current models have a **1M-token window**; auto-compaction triggers near the end of it. Anthropic now lists “manage context aggressively” under things you can **stop** doing.",
          "- Still recommended: **`/clear` between unrelated tasks**, because every turn re-sends the whole conversation.",
          "- **Prompt cache** lasts about **1 hour on a subscription, 5 minutes on an API key**, so the first message after a break costs more.",
          "- Instructions given only in chat are lost at compaction; CLAUDE.md is re-read from disk. Repeat corrections belong in CLAUDE.md.",
          "- **Checkpoints:** every prompt creates one; the last 100 are kept for about 30 days. They track only Claude's file-editing tools. Changes made via Bash, external processes and most subagent edits are **not** restored.",
          "- **Reset rule:** after two failed corrections, `/clear` and write a better prompt.",
        ),
        example: {
          title: "Rescuing a session that went sideways",
          steps: [
            { label: "Claude tried twice and is still wrong", text: "Don't pile on a third correction; the bad attempts are now polluting context." },
            { label: "Rewind the code", code: "Esc Esc → pick the checkpoint before the attempts → restore code" },
            { label: "Start fresh with what you learned", code: "/clear\n› the timeout is in src/net/retry.ts, NOT the API client.\n  Increase backoff to exponential with a max of 30s, add a test." },
          ],
          result: "A clean context plus a sharper prompt usually beats a long tangled thread.",
        },
        caveman: "Context = whiteboard. Every ask re-read whole board. /clear wipe. /compact shrink. Two fail? Clear, better prompt. Checkpoint not git.",
        pitfall: "Assuming /rewind undid a `rm` or `npm install` Claude ran. Shell commands aren't tracked by checkpoints.",
        quiz: [
          { q: "Why /clear between unrelated tasks?", options: ["It's required to save files", "Every request re-sends the whole conversation", "It resets your plan limits", "It speeds up your internet"], answer: 1, why: "Old tasks get re-read on every turn of the new one." },
          { q: "Which change would a checkpoint NOT restore?", options: ["An Edit Claude made", "A file deleted by a Bash `rm` command", "A file Claude wrote", "None, it restores all"], answer: 1, why: "Checkpoints track only Claude's file-editing tools." },
          { q: "After two failed corrections, the docs recommend…", options: ["Keep correcting", "Switch to a bigger plan", "/clear and write a better prompt", "Restart your computer"], answer: 2, why: "Accumulated failed attempts pollute context." },
        ],
        sources: [
          { label: "Context window", url: D + "context-window" },
          { label: "Checkpointing", url: D + "checkpointing" },
        ],
      },
    ],
  },

  {
    id: "l2",
    num: 2,
    title: "Memory & planning",
    rank: "Navigator",
    tagline: "Teach Claude your project once, and plan before you build.",
    goal: "Write a lean CLAUDE.md and use the explore → plan → implement → commit loop on a real feature.",
    project: {
      title: "Spec-driven feature",
      brief: "Pick a feature you want in one of your projects. Have Claude interview you, write SPEC.md, then implement it in a fresh session using plan mode.",
      checklist: [
        "Ran /init and trimmed CLAUDE.md to under 50 lines",
        "Had Claude interview you and write SPEC.md",
        "Opened a fresh session and implemented from SPEC.md in plan mode",
        "Added one correction you repeated twice to CLAUDE.md",
      ],
    },
    lessons: [
      {
        id: "l2-claudemd",
        title: "CLAUDE.md done right",
        minutes: 9,
        intuition: L(
          "CLAUDE.md is a file of standing instructions that loads into every session: how to run tests, which helpers to use, which traps to avoid.",
          "The secret is to write **less**: only what Claude can't figure out by reading the code.",
        ),
        analogy: L(
          "It's the sticky note on the fridge for the house-sitter, not the house's blueprint. “Dog eats at 6pm, the back door sticks, don't use the left burner.” They can see the rooms themselves.",
        ),
        formal: L(
          "**Scopes (concatenated, not overridden):** managed policy (org-wide) · `~/.claude/CLAUDE.md` (you) · `./CLAUDE.md` or `./.claude/CLAUDE.md` (project, commit it) · `./CLAUDE.local.md` (you, gitignore it).",
          "**Create:** `/init` drafts one, or suggests improvements if it exists. Edit later through `/memory` or by asking Claude.",
          "**Keep each file under 200 lines.** Include: exact test/typecheck/lint commands, places where the code misleads, decisions not recorded in the repo, and anything you've had to correct twice.",
          "**Stop doing:** ALL-CAPS / IMPORTANT shouting (it makes Claude over-apply rules) and architecture tours (Claude reads the repo itself).",
          "**Advisory, not enforced:** CLAUDE.md is context Claude tries to follow. For hard rules, use permissions and hooks.",
          "`/doctor prompt-audit` flags outdated instructions, broken references and contradictions.",
        ),
        example: {
          title: "The density Anthropic's own docs show",
          steps: [
            {
              label: "CLAUDE.md",
              code: `# Commands
- Install: pnpm install
- Run one test file: pnpm vitest run path/to/file.test.ts
- Typecheck: pnpm tsc --noEmit
# Conventions
- Use the error helpers in src/lib/errors.ts, never throw raw strings
- src/legacy/ is still live but don't copy its patterns into new code
# Gotchas
- Integration tests need DATABASE_URL set, see .env.example`,
            },
          ],
          result: "Nine lines that save Claude from guessing commands and copying legacy patterns. Claude Code's creator's team keeps theirs around 2.5k tokens and adds a line whenever Claude makes a mistake.",
        },
        terminal: {
          intro: "Simulated session in an existing repo with no CLAUDE.md.",
          steps: [
            { cmd: "/init", out: ["⏺ Read(package.json) · Read(README.md) · Glob(**/*.test.ts)", "⏺ Write(CLAUDE.md)  (64 lines)", "Created CLAUDE.md with build/test commands, conventions and gotchas."] },
            { cmd: "trim CLAUDE.md to only what you can't learn from the code", out: ["⏺ Edit(CLAUDE.md)  64 → 22 lines", "Removed folder tour and generic style advice; kept commands, the errors.ts convention and the DATABASE_URL gotcha."], note: "Less is more: every line costs context on every turn." },
            { cmd: "/memory", out: ["Memory files loaded:", "  ~/.claude/CLAUDE.md (user)", "  ./CLAUDE.md (project) · 22 lines", "  Auto memory: ~/.claude/projects/…/memory/MEMORY.md"] },
          ],
        },
        caveman: "CLAUDE.md = fridge note, not blueprint. Short. Commands, traps, things you fix twice. No SHOUTING. Hard rule? Use hook.",
        pitfall: "A 500-line CLAUDE.md copied from a viral template. It costs context every turn and buries the rules that matter.",
        proTip: "Every time you correct Claude for the second time on the same thing, add one line to CLAUDE.md.",
        quiz: [
          { q: "What belongs in CLAUDE.md?", options: ["A full tour of the architecture", "Exact test commands and gotchas Claude can't infer", "Your entire style guide in caps", "API keys"], answer: 1, why: "Only what Claude can't work out from the code." },
          { q: "How are multiple CLAUDE.md scopes combined?", options: ["Only the closest one loads", "They are concatenated", "The user file overrides all", "Random"], answer: 1, why: "Scopes are concatenated from root to working directory." },
          { q: "You need a rule that is guaranteed, not just advised. Use…", options: ["Bold text in CLAUDE.md", "Permissions or hooks", "A longer prompt", "/compact"], answer: 1, why: "CLAUDE.md is advisory; permissions and hooks enforce." },
        ],
        sources: [
          { label: "Memory", url: D + "memory" },
          { label: "Best practices", url: D + "best-practices" },
        ],
      },
      {
        id: "l2-rules",
        title: "Imports, path rules and auto memory",
        minutes: 7,
        intuition: L(
          "As a project grows, one CLAUDE.md gets crowded. Three tools keep it lean: **imports** (pull in another file), **path-scoped rules** (instructions that only load for certain folders), and **auto memory** (notes Claude writes for itself).",
        ),
        analogy: L(
          "A restaurant kitchen: the main board lists house rules (imports). The pastry station has its own card that only matters when you're making dessert (path rules). And the chef keeps a personal notebook of lessons learned (auto memory).",
        ),
        formal: L(
          "- **Imports:** `See @README for project overview`. Paths resolve relative to the importing file, nest up to 4 hops, load at launch.",
          "- **AGENTS.md repos:** create a CLAUDE.md that starts with `@AGENTS.md`, or symlink the two.",
          "- **Rules:** `.claude/rules/*.md`, optionally with `paths:` frontmatter such as `paths: [\"src/api/**/*.ts\"]`. They load only when Claude reads a matching file.",
          "- **Auto memory (v2.1.59+):** Claude writes its own notes to `~/.claude/projects/<project>/memory/MEMORY.md`; the first 200 lines or 25KB load each session.",
          "- Block-level HTML comments in CLAUDE.md are stripped and cost no tokens.",
        ),
        example: {
          title: "Scoping API conventions to the API folder",
          steps: [
            {
              label: ".claude/rules/api.md",
              code: `---
paths: ["src/api/**/*.ts"]
---
- Every handler validates input with zod schemas in src/api/schemas/
- Return errors via apiError(), never res.status().send()`,
            },
            { label: "Effect", text: "When Claude edits the frontend, these lines aren't loaded. When it opens `src/api/orders.ts`, they are." },
          ],
          result: "Specialized guidance appears exactly when relevant and costs nothing otherwise.",
        },
        caveman: "@file pull other file in. rules/ with paths load only for that folder. Claude keep own notebook: MEMORY.md.",
        quiz: [
          { q: "When does a rule with `paths:` frontmatter load?", options: ["Always", "Only when Claude reads a matching file", "Only on Mondays", "Never"], answer: 1, why: "Path-scoped rules load on demand." },
          { q: "How do you reuse an existing AGENTS.md?", options: ["Rename it", "Start CLAUDE.md with @AGENTS.md (or symlink)", "It can't be used", "Paste it in every prompt"], answer: 1, why: "Import it with @AGENTS.md." },
          { q: "Who writes auto memory (MEMORY.md)?", options: ["You, manually", "Claude, for itself", "Your admin", "GitHub"], answer: 1, why: "Auto memory holds notes Claude writes for itself." },
        ],
        sources: [{ label: "Memory", url: D + "memory" }],
      },
      {
        id: "l2-plan",
        title: "Plan mode: explore → plan → implement → commit",
        minutes: 8,
        intuition: L(
          "For anything bigger than a one-liner, separate **thinking** from **doing**. In plan mode Claude can only read and propose; you review the plan, then let it build.",
          "Skip rule: if you could describe the diff in one sentence, skip the plan.",
        ),
        analogy: L(
          "Measure twice, cut once. A carpenter sketches the cut list before touching the saw. Fixing a sketch costs a pencil eraser; fixing a cut board costs a new board.",
        ),
        formal: L(
          "**Enter plan mode:** `Shift+Tab` until “plan mode on”, `/plan fix the auth bug`, or `claude --permission-mode plan`.",
          "**Exit:** when the plan is ready choose “Yes, and use auto mode”, “Yes, manually approve edits”, or “No, keep planning”. `Ctrl+G` opens the plan in your editor first.",
          "**Project default:** `\"defaultMode\": \"plan\"` in settings.",
          "**The loop:** explore (read, ask questions) → plan → implement → commit.",
          "**Model trick:** the `opusplan` alias uses Opus while planning and Sonnet while executing.",
          "Claude Code's creator describes the rhythm: plan back and forth until it's right, then switch to auto-accept and Claude can usually do it in one shot.",
        ),
        example: {
          title: "Adding dark mode to an app",
          steps: [
            { label: "Explore", code: "/plan how is theming done today? list the files involved" },
            { label: "Plan", code: "› propose a plan to add a dark mode toggle that persists per user" },
            { label: "Review & edit", text: "Press `Ctrl+G`, delete the step that rewrites every component, keep the CSS-variables approach." },
            { label: "Implement", text: "Choose “Yes, manually approve edits”, then run the app and check." },
            { label: "Commit", code: "› commit with a message describing the dark mode feature" },
          ],
          result: "You caught an over-engineered step while it was still words, not code.",
        },
        terminal: {
          intro: "Simulated session. Plan before building.",
          steps: [
            { cmd: "/plan add a dark mode toggle that persists per user", out: ["⏸ plan mode on", "⏺ Read(src/theme.ts) · Grep(\"color\")", "Plan:", " 1. Move colors to CSS variables in theme.css", " 2. Add <ThemeToggle/> to the header", " 3. Persist choice in user settings API", " 4. Add a test for toggle persistence", "Proceed? [auto] [manual] [keep planning]"] },
            { cmd: "keep planning: skip the API, use localStorage", accept: ["keep planning skip the api use localstorage"], out: ["Updated plan: step 3 → persist in localStorage with try/catch fallback."], note: "Changing a plan is far cheaper than changing code." },
            { cmd: "manual", out: ["⏵ Editing with your approval…", "⏺ Edit(src/theme.css) · Write(src/ThemeToggle.tsx) · Edit(src/Header.tsx)", "✓ 1 test added, all tests pass"] },
          ],
        },
        caveman: "Big job? Plan first. Shift+Tab to plan. Read plan. Fix plan. Then build. Small job one sentence? Skip plan.",
        quiz: [
          { q: "When should you skip plan mode?", options: ["Never", "When you could describe the diff in one sentence", "Only for Python", "When tired"], answer: 1, why: "That's the docs' skip rule." },
          { q: "What can Claude do in plan mode?", options: ["Anything", "Read and propose, not edit", "Only edit", "Only push"], answer: 1, why: "Plan mode is read-only exploration plus a plan." },
          { q: "What does the `opusplan` alias do?", options: ["Opus for planning, Sonnet for executing", "Doubles your limit", "Uses Haiku only", "Disables planning"], answer: 0, why: "Expensive model where it matters, cheaper one for execution." },
        ],
        sources: [{ label: "Permission modes (plan)", url: D + "permission-modes" }],
      },
      {
        id: "l2-spec",
        title: "Prompting like a spec writer",
        minutes: 8,
        intuition: L(
          "Good prompts read like good tickets: the symptom, the location, the constraint, and the proof of done.",
          "For big features, flip it around: let Claude **interview you**, write a `SPEC.md`, and build it in a fresh session.",
        ),
        analogy: L(
          "A tailor asks questions and takes measurements before cutting fabric. A prompt without measurements gets you a suit in the wrong size, beautifully stitched.",
        ),
        formal: L(
          "**Prompt ingredients:**",
          "- What: the outcome, not just the action (“users can export to CSV with unicode names”).",
          "- Where: `@file` mentions and pointers to existing patterns (“follow how `@src/export/json.ts` does it”).",
          "- Constraints: what not to touch, libraries to use or avoid.",
          "- Proof: “add a test”, “show me the output”, “screenshot the page”.",
          "**Interview pattern:** ask Claude to interview you about the feature, write `SPEC.md`, then implement it in a **fresh session**. The docs note that time spent making the spec precise pays off more than time spent watching the implementation.",
          "**Effort, not magic words:** `think`, `think hard`, `think harder` are no longer keywords. Use `/effort low|medium|high|xhigh|max` or `claude --effort high`. The 5.5 models default to `medium`. `ultrathink` still deepens a single turn.",
          "**Evidence beats assertion:** ask for the command it ran and what it returned, not just “it works”.",
        ),
        example: {
          title: "Interview → spec → build",
          steps: [
            { label: "Start", code: "› I want users to schedule reports. Interview me one question\n  at a time until you can write SPEC.md. Don't write code yet." },
            { label: "Answer its questions", text: "Frequency? Time zones? Email or download? Failure handling?" },
            { label: "Fresh session", code: "/clear\n› implement @SPEC.md. Plan first. Add tests for each\n  acceptance criterion and show me them passing." },
          ],
          result: "The build session starts with a precise, written target instead of a long, messy chat.",
        },
        caveman: "Prompt = ticket: what, where, rule, proof. Big job: Claude ask you question, write SPEC.md, new session build. think keyword dead. Use /effort.",
        pitfall: "Typing “think harder” and expecting deeper reasoning. Those keywords were retired; use /effort or ultrathink.",
        quiz: [
          { q: "Which prompt is best?", options: ["make export better", "fix it", "Add unicode support to CSV export, follow @src/export/json.ts, add a test with a name like “Zoë”, show the passing output", "do the thing we discussed"], answer: 2, why: "Outcome, location, pattern and proof." },
          { q: "Why implement a SPEC.md in a fresh session?", options: ["It's required", "The build starts from a clean, precise target without interview clutter", "To use more tokens", "Fresh sessions are free"], answer: 1, why: "Precise spec + clean context." },
          { q: "How do you ask for deeper reasoning in Nov 2026?", options: ["think harder", "/effort high (or ultrathink for one turn)", "ALL CAPS", "/vim"], answer: 1, why: "Effort levels replaced the think ladder." },
        ],
        sources: [
          { label: "Best practices", url: D + "best-practices" },
          { label: "Model configuration", url: D + "model-config" },
        ],
      },
    ],
  },
]
