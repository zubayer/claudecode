# Verification beats hidden tricks in Claude Code

Claude Code is Anthropic's agentic coding tool. It reads your codebase, edits files, runs terminal commands and works with git from the terminal, your IDE, a desktop app, the browser, your phone and CI ([Overview](https://code.claude.com/docs/en/overview)). Getting started takes very little: a paid Claude plan or API account, one install command, and plain-English requests. The official docs say outright that "you don't need to know how to code" ([Terminal guide](https://code.claude.com/docs/en/terminal-guide)). Using it *efficiently* is a different skill. It comes down to five habits: specifying tasks precisely, giving Claude a check it can run, keeping context focused, reviewing evidence and diffs instead of trusting "done", and using git as the real undo. YouTube and article titles fall into a handful of templates: full courses, "no coding needed", money ("$10,000 websites"), "I spent 1,000 hours", "you're using Claude Code wrong", and retellings of how creator Boris Cherny works. The biggest view counts go to beginner and money-framed videos. The common claim that people under-use Claude Code is half right. The habits creators push really are Anthropic's own recommendations, and verification loops are the best supported of them. But "10x" multipliers and "you're only using 20%" headlines come with no data. The only randomized evidence found measured experienced developers as **19% slower** with early-2025 AI tools while they *believed* they were 20% faster ([METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)), and a 2026 follow-up points to modest gains that METR itself calls "very weak evidence" ([METR update](https://metr.org/blog/2026-02-24-uplift-update/)). One more practical warning: many 2025 tutorials are now wrong on install steps, permission modes, thinking keywords, memory shortcuts, SDK names and plan names. The renames are collected in one table below. Two caveats apply to the whole report. The notes disagree on the default model, and the result is presented as unresolved in Level 0. The 30-day community scan reached only Hacker News and general web search; Reddit, YouTube and X were not reachable, so nothing here describes what those platforms said this month.

## Claude Code is an agent harness, so the skill shifts from writing code to specifying and checking it

The official definition is short: "an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools" ([Overview](https://code.claude.com/docs/en/overview)). The difference from claude.ai chat is that it *acts*. "Without tools, Claude can only respond with text. With tools, Claude can act: read your code, edit files, run commands, search the web, and interact with external services" ([How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)). Each task runs an **agentic loop of gather context, take action, verify results**, which can chain dozens of actions. Anthropic calls the layer around the model that supplies tools and manages context the **"agentic harness"** ([How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)). When you run `claude` in a folder, it can see your project files, run any command you could run, read git state, and load your CLAUDE.md, auto memory and extensions. That is why the docs contrast it with "inline code assistants that only see the current file." It is also not limited to code: it handles "anything you can do from the command line" ([How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)). Sessions are saved as JSONL under `~/.claude/projects/`. Each new session starts with a fresh context window, and usage limits are **shared with Claude chat** on subscription plans ([Support](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)).

Every surface runs the same engine, so CLAUDE.md, settings and MCP servers carry across all of them ([Overview](https://code.claude.com/docs/en/overview)).

| Surface | How to start | Notes |
|---|---|---|
| Terminal CLI | `claude` | The full-featured surface |
| VS Code / Cursor | Extensions → "Claude Code" → Command Palette → **Open in New Tab** | Inline diffs, @-mentions, plan review |
| JetBrains | JetBrains Marketplace plugin | Requires the CLI installed separately |
| Desktop app | Open Claude → **Code** tab | Bundles Claude Code; paid plan; Linux in beta |
| Web / mobile | claude.ai/code, iOS and Android apps | Cloud VMs, no local setup |
| Handoffs | `claude --teleport`, `/desktop`, `claude --cloud`, Remote Control, Dispatch | Move sessions between surfaces |
| Automation | GitHub Actions, GitLab CI/CD, Slack `@Claude`, Agent SDK | Covered in Level 5 |

The skills question has two answers, one for starting and one for being efficient. To *start*, the docs set the bar very low. "You can use Claude Code even if you've never used a terminal before." The beginner controls are arrow keys instead of clicking, `Esc` to interrupt, `exit` or `Ctrl+D` twice to quit, and `/help` for commands. On Windows, "you won't need to learn Git yourself" ([Terminal guide](https://code.claude.com/docs/en/terminal-guide)). To use it *well*, the best-practices page names a different set of skills. Context is "the most important resource to manage." Verification is "the difference between a session you watch and one you walk away from." Specificity matters: "fix the login bug where users see a blank screen after entering wrong credentials", not "fix the bug." Evidence beats assertion: ask for "the test output, the command it ran and what it returned." And you need to know when to reset: after two failed corrections, run `/clear` and write a better prompt ([Best practices](https://code.claude.com/docs/en/best-practices); [Quickstart](https://code.claude.com/docs/en/quickstart)). Checkpoints are explicitly "not a replacement for git," so basic git literacy is the real safety net ([Best practices](https://code.claude.com/docs/en/best-practices)). The table below summarizes the split. It is inferred from the beginner terminal guide and the practitioner best-practices page, because Anthropic publishes no formal prerequisites checklist.

| Skill | Minimum to start | What makes you efficient |
|---|---|---|
| Terminal | `cd` into a folder, paste the install command (or skip it with Desktop/web) | Fix PATH, use `!` shell mode, pipe output into `claude -p` |
| Specifying | Describe the goal in plain English | Scoped requests, pointers to files and existing patterns, a written SPEC.md for big features |
| Verifying | Open the page or run the script yourself | Tests, builds, linters and screenshots Claude runs itself; a `verify` skill; hooks as gates |
| Context | Know `/clear` exists | `/clear` between tasks, `/compact <focus>`, `/context`, subagents for big searches |
| Review | Approve or deny prompts; `Esc` to stop | Read diffs (`/diff`), ask for evidence, run reviews in a fresh context |
| Git | Understand commits as save points | Branches, PRs via `gh`, worktrees for parallel sessions |

## Level 0: one install command, a browser login and a git-backed folder

**Requirements and plans.** Claude Code runs on macOS 13.0+, Windows 10 1809+ or Server 2019+, Ubuntu 20.04+, Debian 10+, or Alpine 3.19+, with 4 GB+ RAM on x64 or ARM64. It needs an internet connection and a supported country ([Advanced setup](https://code.claude.com/docs/en/setup)). **The free plan does not include Claude Code**. You need Pro, Max, Ultra, Team, Enterprise, a Console (API) account, or a cloud provider ([Advanced setup](https://code.claude.com/docs/en/setup)). The pricing page fetched on 2026-11-23 listed Pro at **$20/month** ($17 billed annually), Max at **$100/month** ("5x Pro usage"), Ultra at **$200/month** with a weekly limit and no five-hour limit for verified accounts, Team Standard at $25/seat ($20 annual), Team Premium at $125/seat ($100 annual), and Enterprise at $20/seat plus usage at API rates ([Pricing](https://claude.com/pricing)). Ultra is the renamed Max 20x tier. Since the November 1 rename it is listed at **10x Pro weekly usage, not 20x** ([The Next Web](https://thenextweb.com/news/claude-ultra-max-plan-rename-five-hour-limit); [Pricing](https://claude.com/pricing)). The monthly API credits bundled with Max and Ultra **cannot be spent inside Claude Code** ([Support](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)).

**Install.** The native installer is now the recommended path, and it auto-updates ([Advanced setup](https://code.claude.com/docs/en/setup)):

```bash
# macOS / Linux / WSL
curl -fsSL https://claude.ai/install.sh | bash
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
# Windows CMD
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd

# Alternatives (no auto-update)
brew install --cask claude-code          # upgrade: brew upgrade claude-code
winget install Anthropic.ClaudeCode      # upgrade: winget upgrade Anthropic.ClaudeCode
sudo apt install claude-code             # after adding the downloads.claude.ai repo
npm install -g @anthropic-ai/claude-code # Node.js 22+; never sudo; upgrade with @latest, not npm update -g

# Verify, diagnose, update
claude --version      # e.g. "2.1.211 (Claude Code)"
claude doctor         # read-only diagnostics, no session
claude update
```

The npm package installs the same native binary and "does not itself invoke Node," so 2025 guides that tell beginners to "install Node 18 first" are out of date ([Advanced setup](https://code.claude.com/docs/en/setup)). Native installs put the launcher at `~/.local/bin/claude`. If the shell says "command not found," add that directory to PATH, for example `echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc` ([Terminal guide](https://code.claude.com/docs/en/terminal-guide)). On Windows, Git for Windows is optional but recommended because it provides Git Bash. Sandboxing works only under WSL 2. Release channels are set with `autoUpdatesChannel` (`"latest"` or `"stable"`) ([Advanced setup](https://code.claude.com/docs/en/setup)).

**Log in and avoid the API-key trap.** Run `claude` and finish the browser prompts. Use `/login` to switch accounts and `/logout` to sign out. If `ANTHROPIC_API_KEY` is set in your shell, Claude Code "will use this API key for authentication instead of your Claude subscription", which means a forgotten key in `.zshrc` quietly bills the API ([Support](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)). If the subscription option doesn't appear, run `/logout`, then `claude update`, restart the terminal, and log in again.

**First session.** The quickstart sequence is still the best on-ramp ([Quickstart](https://code.claude.com/docs/en/quickstart)). Run `cd /path/to/your/project` and then `claude`. The banner shows the version, the current model and the working directory. Start by asking questions such as `what does this project do?` or `explain the folder structure`; Claude reads files as needed. Then make a small change (`add a hello world function to the main file`) and approve the prompt. Finally, use git conversationally: `what files have I changed?`, then `commit my changes with a descriptive message`. Non-programmers can start with `make me a simple webpage that says hello world` and double-click the result ([Terminal guide](https://code.claude.com/docs/en/terminal-guide)). Do this in a folder under git from day one, because Level 1's checkpoints cannot undo everything.

**The default-model conflict.** The notes disagree, and the evidence cannot settle it. The official model-configuration page names **Opus 5.5** as the default on Pro, Max, Team, Enterprise and the Anthropic API. It also says the `fable` alias resolves to Fable 5.1 and that "neither Fable model is the default on any plan or provider" ([Model configuration](https://code.claude.com/docs/en/model-config)). A third-party release tracker, by contrast, reports that **v2.1.321 (Nov 9) made Fable 5.2 the default model** ([Havoptic release log](https://www.havoptic.com/releases/claude-code/2026/11)), on the same day Anthropic shipped Fable 5.2 and Mythos 5.2 ([9to5Mac](https://9to5mac.com/2026/11/09/anthropic-upgrades-claude-with-new-fable-5-2-model-details-here/)). Some evidence favors the tracker. The docs snapshot still names Fable *5.1*, and the versions it mentions stop around v2.1.311, while November's releases ran to v2.1.330. That suggests the docs lag. Other evidence favors the docs. The tracker is secondhand. The same community note records that Anthropic still recommends starting most coding on Opus 5.5. Max and Ultra carry a *separate* weekly Fable limit ([Support](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)), which fits awkwardly with Fable as the default. And experienced users in the month's largest setup thread report Opus 5.5 at medium effort as their default ([HN](https://news.ycombinator.com/item?id=50366117)). One untested hypothesis reconciles both: v2.1.321 may have made 5.2 the default *Fable* model, meaning what the `fable` and `best` aliases point to, rather than the session default. Until that is confirmed, check the model name in the startup banner or `/status`, and pin your choice with `/model opus`, `/model fable`, or a full ID such as `claude-opus-5-5`.

## Level 1: three keys and a dozen commands cover most of each session

Three keys carry most sessions. **`Esc`** interrupts Claude and keeps the work done so far. **`Esc Esc`** on an empty prompt opens the rewind menu. **`Shift+Tab`** cycles permission modes (`Alt+M` on some Windows setups) ([Interactive mode](https://code.claude.com/docs/en/interactive-mode)). The quick-input prefixes are `/` for commands and skills, `!` for shell mode (`! npm test` runs the command directly and adds its output to the session), `@` for file-path mentions with autocomplete, `:` for emoji, and `?` on an empty prompt for the shortcut help panel. **The old `#` memory prefix is gone from the current docs** ([Interactive mode](https://code.claude.com/docs/en/interactive-mode); [Memory](https://code.claude.com/docs/en/memory)). Other keys worth learning early are `Ctrl+G` to edit the prompt or plan in your editor, `Ctrl+O` for the transcript, `Ctrl+R` for history search, `Ctrl+B` to background a task, `Ctrl+V` (`Alt+V` on Windows/WSL) to paste an image, `Option/Alt+P` to switch model, and `\`+`Enter` for a newline anywhere (`/terminal-setup` binds Shift+Enter).

| Launch from the shell | Effect |
|---|---|
| `claude` / `claude "task"` | Interactive session, optionally with a first prompt |
| `claude -p "query"` | One-off run, then exit (Level 5) |
| `claude -c` / `claude --continue` | Continue the latest session in this directory |
| `claude -r` / `claude --resume [name]` | Pick or resume a named session |

| In-session command | What it does now |
|---|---|
| `/help`, `/status`, `/config` | Command list; version, model, account and setting sources; settings UI (`/config model=sonnet`) |
| `/clear [name]` (aliases `/reset`, `/new`) | Empty context; the old conversation stays resumable |
| `/compact [focus]` | Summarize history, e.g. `/compact keep the API changes and the test commands` |
| `/context` | Colored grid of what fills the window, with suggestions |
| `/usage` (aliases `/cost`, `/stats`) | Session cost, plan-limit bars, attribution |
| `/model`, `/effort` | Model picker (`s` = this session only); effort `low` to `max` |
| `/resume`, `/rename`, `/branch` | Session management |
| `/rewind` (aliases `/checkpoint`, `/undo`) | Restore code, conversation or both; summarize from a point |
| `/diff` | Review working-tree changes, including Claude's |
| `/permissions` | View and edit allow/ask/deny rules and their source files |
| `/btw [question]` | Side question that stays out of context |

These come from the [Commands reference](https://code.claude.com/docs/en/commands).

**Context.** Most current models run with a **1M-token window**, and auto-compaction triggers near 967K tokens ([Model configuration](https://code.claude.com/docs/en/model-config)). The docs have retired the old "manage context aggressively" warning because running out is now rare. They still say "`/clear` between tasks is still worth doing," because "every request sends the whole conversation," and a session holding three unrelated tasks re-reads all three on every turn of the fourth ([Best practices](https://code.claude.com/docs/en/best-practices); [Context window](https://code.claude.com/docs/en/context-window)). The prompt cache lasts about **1 hour on a subscription and 5 minutes on an API key**, so the first message after a break costs more ([Best practices](https://code.claude.com/docs/en/best-practices)).

**Permissions.** Six modes exist, and the starting mode changed. **Since v2.1.283, interactive terminal and VS Code sessions start in `auto` mode.** In auto mode a background classifier (Claude Sonnet 5 by default) reviews actions and blocks things like `curl | bash`, production deploys, force pushes, `git reset --hard` and `terraform destroy`. It pauses after 3 consecutive blocks or 20 total, and Anthropic warns it "reduces prompts but does not guarantee safety" ([Permission modes](https://code.claude.com/docs/en/permission-modes)). Since v2.1.328, auto mode is also the default on cloud platforms ([Havoptic](https://www.havoptic.com/releases/claude-code/2026/11)).

| Mode (status bar) | Behavior |
|---|---|
| `default`, labeled **Manual** (`⏸ manual mode on`) | Asks before edits and commands; reads run freely |
| `acceptEdits` (`⏵⏵ accept edits on`) | Auto-accepts edits and `mkdir`/`mv`/`cp`/`rm`/`sed` in the working directory |
| `plan` (`⏸ plan mode on`) | Read-only exploration and a proposed plan |
| `auto` (`⏵⏵ auto mode on`) | Classifier instead of prompts; the interactive default |
| `dontAsk` | Denies anything not pre-approved; meant for CI |
| `bypassPermissions` (`⏵⏵ bypass permissions on`) | Skips nearly all checks; containers and VMs only |

Rules are written as `Tool` or `Tool(specifier)` and evaluated **deny, then ask, then allow**. The first match wins regardless of specificity, so an allow rule can never carve an exception out of a deny rule ([Permissions](https://code.claude.com/docs/en/permissions)). Put the wildcard after the subcommand: `Bash(git log *)` allows only `git log`, while `Bash(git *)` allows every git command. The older `Bash(ls:*)` form still works. Settings live in `~/.claude/settings.json` (you, everywhere), `.claude/settings.json` (team, committed), `.claude/settings.local.json` (you, this project) and managed settings. Precedence runs managed > `--settings` > local > project > user, and list keys merge. The files are strict JSON, so a trailing comma breaks them ([Settings](https://code.claude.com/docs/en/settings)):

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": ["Bash(npm run lint)", "Bash(npm run test *)", "Bash(git commit *)"],
    "deny": ["Read(./.env)", "Read(./.env.*)", "Bash(git push *)"]
  }
}
```

**Checkpoints.** Every prompt creates a checkpoint. The last 100 are kept, for about 30 days ([Checkpointing](https://code.claude.com/docs/en/checkpointing)). They track only Claude's file-editing tools. Changes made through Bash, external processes and most subagent edits are not restored, which is why git remains the real undo. Checkpoints do make it "low-risk to try the bolder approach first and rewind if it doesn't work out" ([Best practices](https://code.claude.com/docs/en/best-practices)).

## Level 2: a short CLAUDE.md and plan mode do most of the steering

**Memory has two systems.** CLAUDE.md files hold instructions you write. Auto memory (v2.1.59+) holds notes Claude writes for itself at `~/.claude/projects/<project>/memory/MEMORY.md`, and only the first 200 lines or 25KB of it load each session. Both are "context Claude tries to follow, not enforced configuration"; for hard rules the docs point to hooks and permissions ([Memory](https://code.claude.com/docs/en/memory)). CLAUDE.md comes in four scopes, which are **concatenated rather than overridden**, from the filesystem root down to your working directory:

| Scope | Path |
|---|---|
| Managed policy (formerly "enterprise") | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS), `/etc/claude-code/CLAUDE.md` (Linux/WSL), `C:\Program Files\ClaudeCode\CLAUDE.md` |
| User | `~/.claude/CLAUDE.md` |
| Project (commit it) | `./CLAUDE.md` or `./.claude/CLAUDE.md` |
| Local (gitignore it) | `./CLAUDE.local.md` |
| Modular rules | `.claude/rules/*.md`, optionally path-scoped with `paths:` frontmatter |

Imports use `@path` syntax (`See @README for project overview`). They resolve relative to the importing file, nest up to four hops, and load at launch. For AGENTS.md repositories, create a CLAUDE.md that starts with `@AGENTS.md`, or symlink the two. Block-level HTML comments are stripped and cost no tokens ([Memory](https://code.claude.com/docs/en/memory)). Rules with `paths: ["src/api/**/*.ts"]` frontmatter load only when Claude reads a matching file, which keeps specialized guidance out of unrelated tasks.

**Write less than you think.** `/init` drafts a starting CLAUDE.md, and if one already exists it suggests improvements instead of overwriting. `CLAUDE_CODE_NEW_INIT=1` adds an interactive flow covering skills, hooks and personal memory, and `/init` offers to import existing Codex or Gemini CLI config ([Commands](https://code.claude.com/docs/en/commands)). To add memory now, ask Claude ("add this to CLAUDE.md") or edit through `/memory`. Current guidance is to keep each file **under 200 lines** and include only what Claude can't work out from the code: exact test, typecheck and lint commands, places where the code misleads, decisions not recorded in the repo, and "anything you've had to correct twice already" ([Best practices](https://code.claude.com/docs/en/best-practices)). Two old habits are now listed under "what you can stop doing." One is shouting with IMPORTANT or ALL CAPS, which "mostly makes Claude over-apply the rule." The other is describing your architecture, because "Claude reads the repo itself." `/doctor prompt-audit` flags instructions written for older models, broken references and contradictions ([Best practices](https://code.claude.com/docs/en/best-practices)). The docs' own model file shows the target density:

```markdown
# Commands
- Install: pnpm install
- Run one test file: pnpm vitest run path/to/file.test.ts
- Typecheck: pnpm tsc --noEmit
# Conventions
- Use the error helpers in src/lib/errors.ts, never throw raw strings
- src/legacy/ is still live but don't copy its patterns into new code
# Gotchas
- Integration tests need DATABASE_URL set, see .env.example
```

Instructions given only in conversation are lost at compaction, while the project-root CLAUDE.md is re-read from disk ([Memory](https://code.claude.com/docs/en/memory)). That is the practical reason to move any correction you have repeated into the file. Cherny's team works this way: a shared CLAUDE.md of about 2.5k tokens that gains an entry whenever Claude makes a mistake ([InfoQ](https://www.infoq.com/news/2026/01/claude-code-creator-workflow)).

**Plan before you build.** The recommended loop is **explore, plan, implement, commit** ([Best practices](https://code.claude.com/docs/en/best-practices)). There are three ways into plan mode: `Shift+Tab`, `/plan fix the auth bug`, or `claude --permission-mode plan`. When the plan is ready you choose "Yes, and use auto mode," "Yes, manually approve edits," or "No, keep planning." `Ctrl+G` opens the plan in your editor first, and `"defaultMode": "plan"` makes plan mode the project default ([Permission modes](https://code.claude.com/docs/en/permission-modes)). The skip rule is useful: "If you could describe the diff in one sentence, skip the plan." For large features, have Claude interview you, write a `SPEC.md`, and implement it in a *fresh* session, because "time spent making the spec precise pays off more than time spent watching the implementation" ([Best practices](https://code.claude.com/docs/en/best-practices)). Cherny describes the same rhythm: plan back and forth, then auto-accept, after which Claude "can usually 1-shot it" ([InfoQ](https://www.infoq.com/news/2026/01/claude-code-creator-workflow)).

**Effort replaced the thinking ladder.** `think`, `think hard` and `think more` "are not recognized as keywords" any more. Use `/effort low|medium|high|xhigh|max` or `claude --effort high`. Opus, Sonnet and Haiku 5.5 default to `medium` and always think. `ultrathink` still deepens reasoning for a single turn and can raise it to `xhigh` in the terminal on v2.1.311+ ([Model configuration](https://code.claude.com/docs/en/model-config)). The `opusplan` alias uses Opus while planning and Sonnet while executing, a cheap way to put the expensive model only where it matters.

## Level 3: a runnable check turns a watched session into a delegated one

Verification is the one habit where Anthropic's docs, Claude Code's creator, the Claude Code team's own blog and the community all agree. The docs say: "Give Claude a check it can run: tests, a build, a screenshot to compare." Without one, "'looks done' is the only signal available, and you become the verification loop" ([Best practices](https://code.claude.com/docs/en/best-practices)). The named failure pattern is the **"trust-then-verify gap"**, plausible code that misses edge cases, and the docs' fix is blunt: "If you can't verify it, don't ship it." Cherny calls it his most important tip and estimates a verification loop will "2-3x the quality of the final result." That is a practitioner's estimate, not a measurement ([InfoQ](https://www.infoq.com/news/2026/01/claude-code-creator-workflow)). The month's most-discussed how-to post, Addy Osmani's account of how the Claude Code team thinks about verification, makes it concrete ([Claude blog](https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification/); [HN](https://news.ycombinator.com/item?id=50529612)). Put a `verify` skill in `.claude/skills/` that boots the app and runs smoke tests. Favor end-to-end, property and differential tests. Enforce build, test and lint with a hook or `/goal`. Never let an agent skip, sleep through or blindly retry a flaky test. Hand the work to a human after three failed rounds.

The working patterns follow from this. For bugs, use **TDD**: have Claude write a failing test that reproduces the issue, then fix it. For UI, use a **screenshot loop**: paste the design, implement, screenshot, list differences, fix ([Best practices](https://code.claude.com/docs/en/best-practices)). For review, use a **fresh context**, because "Claude won't be biased toward code it just wrote." Tell the reviewer to report only correctness or requirement gaps, because reviewers over-report and that leads to over-engineering ([Best practices](https://code.claude.com/docs/en/best-practices)). Claude Code ships bundled `/verify`, `/simplify` and `/code-review` skills ([Skills](https://code.claude.com/docs/en/skills)).

**Git is conversational and runs through `gh`.** Ask "create a pr for my changes." When Claude uses `gh pr create` (or `glab mr create`), the session is linked to the PR and can be reopened with `claude --from-pr 1234` ([Common workflows](https://code.claude.com/docs/en/common-workflows)). So install and authenticate the GitHub CLI. The docs also call CLI tools "the most context-efficient way to interact with external services" ([Best practices](https://code.claude.com/docs/en/best-practices)). Related commands are `/diff`, `/review 1234` (alias of `/code-review`), `/security-review` (branch diff against the default branch) and `/install-github-app`. Commit and PR attribution trailers are added by default; control them with the `attribution` setting ([How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)). By default auto mode allows pushing to branches of the current repo but blocks force push and `git reset --hard` ([Permission modes](https://code.claude.com/docs/en/permission-modes)).

**Worktrees make parallel sessions safe.** Built-in worktree support replaces hand-rolled scripts ([Worktrees](https://code.claude.com/docs/en/worktrees)):

```bash
claude --worktree feature-auth    # or -w; creates .claude/worktrees/feature-auth/ on branch worktree-feature-auth
claude --worktree "#1234"         # branch from a PR
# second terminal, second task
claude --worktree fix-billing
# manual equivalent
git worktree add ../project-feature-a -b feature-a && cd ../project-feature-a && claude
git worktree list && git worktree remove ../project-feature-a
```

The repo needs at least one commit, or the command fails with `Failed to resolve base branch "HEAD"`. Add `.claude/worktrees/` to `.gitignore`. List gitignored files a worktree needs (`.env`, `config/secrets.json`) in a root `.worktreeinclude` file. `worktree.baseRef` chooses between `"fresh"` (remote default branch, the default) and `"head"` ([Worktrees](https://code.claude.com/docs/en/worktrees); [Common workflows](https://code.claude.com/docs/en/common-workflows)). At the extreme, `/batch <task>` splits a job into 5 to 30 units, each with its own worktree and PR. Anthropic's power-user article recommends **3 to 5 worktree sessions** ([Support](https://support.claude.com/en/articles/14554000-claude-code-power-user-)). Cherny runs about five local sessions plus 5 to 10 on the web and abandons 10 to 20% of them ([InfoQ](https://www.infoq.com/news/2026/01/claude-code-creator-workflow)). Read that abandonment rate as normal practice: it is cheaper to drop a bad run than to rescue it.

## Level 4: skills, subagents, hooks, MCP and plugins add reach, and each costs context

The five extension types answer different questions. A useful frame: **CLAUDE.md is always-on memory, a skill is an on-demand procedure, a subagent is a separate context window, a hook is a guarantee, and MCP is a bridge to outside systems**. Plugins package all of them for distribution ([Skills](https://code.claude.com/docs/en/skills); [Output styles](https://code.claude.com/docs/en/output-styles)).

**Skills (and the end of separate custom commands).** "Custom slash commands are now part of skills." `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy`. Old command files keep working, the skill wins on a name clash, and skills are recommended for new work ([Skills](https://code.claude.com/docs/en/skills)). A skill is a directory whose `SKILL.md` has YAML frontmatter. The most important field is `description`, because Claude auto-loads the skill when a request matches it, unless `disable-model-invocation: true` is set. Personal skills live in `~/.claude/skills/<name>/`, project skills in `.claude/skills/<name>/`, and plugin skills are namespaced as `/plugin:skill`. Arguments arrive as `$ARGUMENTS`, `$0`, `$1` or named `$name`. `` !`cmd` `` runs a shell command before the skill is sent and inlines its output. `context: fork` runs the skill in a subagent ([Skills](https://code.claude.com/docs/en/skills)). Only names and descriptions sit in context until a skill is invoked. This "progressive disclosure" means long reference material "costs almost nothing until you need it." Keep `SKILL.md` under 500 lines ([Skills](https://code.claude.com/docs/en/skills); [Anthropic Engineering](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)). Agent Skills became an open standard on December 18, 2025 ([Anthropic Engineering](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)). The official example:

```yaml
# ~/.claude/skills/summarize-changes/SKILL.md
---
name: summarize-changes
description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.
allowed-tools: Bash(git diff *)
---
## Current changes
!`git diff HEAD`
## Instructions
Summarize the changes above in two or three bullet points, then list any risks you notice.
```

`/skills` lists installed skills (press `t` to sort by token cost) and `/reload-skills` re-scans mid-session ([Commands](https://code.claude.com/docs/en/commands)).

**Subagents.** A subagent is a Markdown file in `.claude/agents/` or `~/.claude/agents/`. Only `name` and `description` are required, and the body becomes its system prompt. It gets its own context window, tools and model, and returns only a summary ([Subagents](https://code.claude.com/docs/en/sub-agents)). Useful fields include `tools` (an allowlist), `model` (`haiku` for cheap tasks, `inherit`, `fable`), `isolation: worktree` and `skills`. The built-ins are **Explore** (read-only), **Plan** and **general-purpose**. `/agents` no longer opens a wizard (it was removed after v2.1.197): ask Claude to create the agent or edit the files directly, and changes hot-reload. Invoke a subagent in plain language, with `@"code-reviewer (agent)"`, or with `claude --agent code-reviewer` for a whole session. By default subagents nest three deep and run 20 at a time ([Subagents](https://code.claude.com/docs/en/sub-agents)). Anthropic's power-user article singles out this feature: "Custom agents are a powerful primitive that often gets overlooked" ([Support](https://support.claude.com/en/articles/14554000-claude-code-power-user-)).

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices. Use proactively after code changes.
tools: Read, Glob, Grep
model: sonnet
---
You are a code reviewer. Report only correctness bugs and requirement gaps.
```

**Hooks.** Hooks are the deterministic layer: "Unlike CLAUDE.md instructions which are advisory, hooks are deterministic and guarantee the action happens" ([Anthropic best practices](https://www.anthropic.com/engineering/claude-code-best-practices)). They are configured under `"hooks"` in any settings file and fire on events such as `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `SessionStart`, `PreCompact`, `ConfigChange` and many newer ones. Each hook receives JSON on stdin ([Hooks](https://code.claude.com/docs/en/hooks)). The exit-code trap catches many people: **exit 2 blocks, but exit 1 does not**. "Exit 1 is not a block, so use `exit 2` for policy enforcement." For finer control, exit 0 and print JSON such as `{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"..."}}`. Matchers are exact names or lists (`Edit|Write`) and otherwise unanchored regex, so `Edit.*` also matches `NotebookEdit` ([Hooks](https://code.claude.com/docs/en/hooks)).

```json
{"hooks": {"PreToolUse": [{"matcher": "Bash", "hooks": [
  {"type": "command", "if": "Bash(rm *)",
   "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh", "timeout": 30}]}]}}
```

Cherny's single hook is a PostToolUse formatter after edits ([InfoQ](https://www.infoq.com/news/2026/01/claude-code-creator-workflow)). The docs still say hard allow and deny decisions belong in the permission system, because the hook `if` filter is best-effort. `/hooks` is a read-only browser ([Hooks](https://code.claude.com/docs/en/hooks)).

**MCP.** MCP servers connect Claude to outside tools ([MCP](https://code.claude.com/docs/en/mcp)):

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp          # OAuth via /mcp
claude mcp add --env AIRTABLE_API_KEY=KEY --transport stdio airtable -- npx -y airtable-mcp-server
claude mcp add-json example '{"command":"npx","args":["-y","@example/mcp-server"]}'
claude mcp list | get <name> | remove <name>
```

Options go before the server name, and `--` separates them from a stdio command. **SSE is deprecated.** HTTP is recommended and, since v2.1.265, falls back to SSE automatically. Scopes are local (the default, private, in `~/.claude.json`), project (`.mcp.json` at the repo root, committed, with `${VAR}` expansion) and user ([MCP](https://code.claude.com/docs/en/mcp)). Since v2.1.327, `claude mcp add-json <name> -` reads the config from stdin, so tokens stay out of shell history ([ClaudeKit](https://claudekit.io/en/updates/claude-code-2-1-327/)). The context-cost story has changed. In 2025, Geoffrey Huntley measured the GitHub MCP server at **93 tools and about 55,000 tokens** ([Simon Willison](https://simonwillison.net/2025/Aug/22/too-many-mcps/)). Today **tool search is on by default**: only tool names and server instructions load at startup ([MCP](https://code.claude.com/docs/en/mcp)). The residual advice still holds: "Prefer CLI tools when available: Tools like `gh`, `aws`, `gcloud`, and `sentry-cli` are still more context-efficient than MCP servers" ([Costs](https://code.claude.com/docs/en/costs)).

**Plugins.** A plugin is a directory with `.claude-plugin/plugin.json` that bundles skills, agents, hooks and MCP servers. With a JavaScript hooks module it is called a "mod" ([Plugins](https://code.claude.com/docs/en/plugins)). Browse with `/plugin` → **Discover**, install by name (`commit-commands@claude-plugins-official`), add catalogs with `/plugin marketplace add`, and load a local folder with `--plugin-dir`. Official listings show a **Context cost** estimate, because every model-invocable skill or agent in an enabled plugin adds its description to every turn. And "whatever the tier, a plugin you install can run code with your user privileges" ([Plugins](https://code.claude.com/docs/en/plugins)). That warning became concrete on October 30, when a backdoored "Claude Code for VS Code" extension turned up on the Cursor/Open VSX marketplace ([HN](https://news.ycombinator.com/item?id=50300683); [Phorion](https://phorion.io/blog/offical-claude-code-vsx-compromise/)).

**Experimental: Code Mode (v2.1.323+).** Claude writes JavaScript that calls its tools, and only filtered output comes back. Turn it on with `CLAUDE_CODE_EXPERIMENTAL_CODE_MODE=1`, in user settings only. One measurement cut a link check from 35s to 15s, with little gain on a single build step. It disables Remote Control, Chrome and computer use, and does not work with `-p`, the SDK, VS Code, Desktop or cloud sessions ([Flavio Copes](https://flaviocopes.com/claude-code-code-mode/)).

## Level 5: headless runs, CI and the Agent SDK take Claude out of your terminal and widen the attack surface

**Headless.** The headless page is now titled "Run Claude Code programmatically" and describes `claude -p` as "the Agent SDK via the CLI" ([Headless](https://code.claude.com/docs/en/headless)):

```bash
claude -p "Find and fix the bug in auth.py" --allowedTools "Read,Edit,Bash"
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
git log --oneline -20 | claude -p "summarize these recent commits"
gh pr diff "$1" | claude -p --append-system-prompt "You are a security engineer. Review for vulnerabilities." --output-format json
claude -p "run the test suite" --permission-mode dontAsk --allowedTools "Bash(npm test)" "Read"
```

`--output-format` accepts `text`, `json` (with `result`, `session_id` and `total_cost_usd`) and `stream-json` (with `--verbose --include-partial-messages`). `--json-schema` returns `structured_output`. `--max-budget-usd` caps spend. **`--bare`** skips auto-discovery of hooks, skills, plugins, MCP, memory and CLAUDE.md, requires `ANTHROPIC_API_KEY`, and "will become the default for `-p` in a future release." Since v2.1.302, `-p` starts in Manual mode unless something sets another mode ([Headless](https://code.claude.com/docs/en/headless)). The security caveat matters: without `--bare`, a `-p` run executes a project's `.claude/settings.json` hooks and `.mcp.json` servers "even in a folder you've never trusted," with no trust dialog.

**GitHub Actions.** Run `/install-github-app`, which needs `gh` and repo admin rights. It installs the app and stores `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN` as a secret ([GitHub Actions](https://code.claude.com/docs/en/github-actions)). Without a `prompt` input the action responds to `@claude` mentions. With a `prompt` it runs on any event, including cron. Only users with write access can trigger it.

```yaml
name: Claude Code
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
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          claude_args: "--max-turns 5"
```

Workflows written for `@beta` need four changes: remove `mode`, rename `direct_prompt` to `prompt`, move `max_turns` and `model` into `claude_args`, and replace `custom_instructions` with `--append-system-prompt` ([GitHub Actions](https://code.claude.com/docs/en/github-actions)).

**Agent SDK.** "The Claude Code SDK has been renamed to the Claude Agent SDK." The TypeScript package is now `@anthropic-ai/claude-agent-sdk`. In Python, `claude-code-sdk` became `claude-agent-sdk`, `claude_code_sdk` became `claude_agent_sdk`, and `ClaudeCodeOptions` became `ClaudeAgentOptions` ([Migration guide](https://code.claude.com/docs/en/agent-sdk/migration-guide)). The CLI itself still installs from `@anthropic-ai/claude-code` on npm; only the SDK moved. Since v0.1.0 the SDK no longer uses Claude Code's system prompt by default, so pass the preset to get CLI-like behavior. Omitting `settingSources` loads your settings and CLAUDE.md, and `settingSources: []` isolates the run:

```python
from claude_agent_sdk import query, ClaudeAgentOptions
async for message in query(prompt="Hello",
        options=ClaudeAgentOptions(system_prompt={"type": "preset", "preset": "claude_code"})):
    print(message)
```

Products built on the SDK must use API keys rather than claude.ai login and must not be branded "Claude Code" ([Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)).

**Cost.** Anthropic's enterprise benchmark is **about $13 per developer per active day and $150 to $250 per month, with 90% of users under $30 per active day** ([Costs](https://code.claude.com/docs/en/costs)). As a worked example, a developer active 15 days a month at the $13 average spends about $195, the middle of that band. A developer who lets parallel agent fan-out push a few days toward $30 can drift past $250 quickly. The levers, in rough order of impact, start with model choice. "Sonnet handles most coding tasks well and costs less than Opus. Reserve Opus for complex architectural decisions," and use `model: haiku` for simple subagents. Next come lower `/effort` (thinking is billed as output and cannot be turned off on the 5.5 or Fable models), `/clear` between tasks (it "costs nothing"), a lean CLAUDE.md, and delegating verbose work like test runs to subagents so only a summary returns ([Costs](https://code.claude.com/docs/en/costs)). The docs show a PreToolUse hook that rewrites `npm test` to pipe through `grep -A 5 -E '(FAIL|ERROR|error:)' | head -100`, which shrinks what reaches context. `/usage` shows cost and plan bars with attribution to skills, subagents, plugins and MCP. `/insights` writes `~/.claude/usage-data/report.html`. `/usage-credits` buys overflow at API rates ([Costs](https://code.claude.com/docs/en/costs)). Two limit facts change behavior. "Session limit" and "weekly limit" messages apply across all models, so switching models does not help, but after an "Opus limit" switching families does ([Costs](https://code.claude.com/docs/en/costs)). And experimental agent teams use "approximately 7x more tokens" than standard sessions ([Costs](https://code.claude.com/docs/en/costs)). Limits dominated November's community complaints. One user reported a single Projects question spawning seven subagents and draining an allowance in about ten minutes, and several heavy users run two $100 accounts because the $200 tier still hits weekly caps ([HN](https://news.ycombinator.com/item?id=50366117)).

**Security.** The OS sandbox (Seatbelt on macOS, bubblewrap on Linux/WSL2, nothing on native Windows) is **off by default**. Turn it on with `/sandbox` or `"sandbox": {"enabled": true}`. Its default boundary limits writes to the working directory, but reads cover "most of the machine," including `~/.ssh`, and network access goes through an allowlist that starts empty. Set `failIfUnavailable: true` and `allowUnsandboxedCommands: false` to close the escape hatches ([Sandboxing](https://code.claude.com/docs/en/sandboxing)). `--dangerously-skip-permissions` checks "Nothing," and belongs only inside a container, a VM or the sandbox runtime. Cherny almost never uses it outside a sandbox and pre-allows safe commands instead ([Sandboxing](https://code.claude.com/docs/en/sandboxing); [InfoQ](https://www.infoq.com/news/2026/01/claude-code-creator-workflow)). The cautionary case is the December 2025 report of Claude Code running `rm -rf tests/ patches/ plan/ ~/`, where the trailing `~/` wiped a user's home directory ([Simon Willison](https://simonwillison.net/2025/Dec/9/claude/); [Docker](https://www.docker.com/blog/coding-agent-horror-stories-the-rm-rf-incident/)). November added three newer lessons. First, the account email sat in model context and sometimes ended up in User-Agent headers; v2.1.317 now asks before a web or shell call sends it ([HN](https://news.ycombinator.com/item?id=50385272); [GitHub #107757](https://github.com/anthropics/claude-code/issues/107757)). Second, clicking "Don't ask again" on a command that contains a secret saves the secret into `.claude/settings.local.json`, and such files were committed in about 1,100 public repos ([HN](https://news.ycombinator.com/item?id=50407882)). Claude Code adds that file only to your *global* git excludes ([Settings](https://code.claude.com/docs/en/settings)), so add `.claude/*.local.*` to each repo's own `.gitignore` and run pre-commit secret scanning. Third, install extensions only from official publishers.

## Level 6: teams win by committing config, enforcing with permissions and reviewing in fresh contexts

At team scale, the repository *is* the configuration. Commit `.claude/settings.json` for permissions and hooks, `CLAUDE.md` and `.claude/rules/` for guidance, `.claude/skills/` and `.claude/agents/` for procedures, and `.mcp.json` for shared servers. One detail matters for onboarding. Committed `deny` and `ask` rules apply immediately, but committed `allow` rules wait until each teammate trusts the folder ([Settings](https://code.claude.com/docs/en/settings)). Above the repo sits managed policy: `managed-settings.json` (or MDM, or server-managed from the claude.ai console), a managed CLAUDE.md through the `claudeMd` key, `permissions.disableBypassPermissionsMode` and `disableAutoMode` set to `"disable"`, `allowManagedHooksOnly`, `managedMcpServers`, and marketplace allowlists that can force-install plugins ([Memory](https://code.claude.com/docs/en/memory); [Permission modes](https://code.claude.com/docs/en/permission-modes); [Hooks](https://code.claude.com/docs/en/hooks); [Plugins](https://code.claude.com/docs/en/plugins)). Since v2.1.257, `bypassPermissions` no longer takes effect from project or local settings, so a malicious repo cannot switch it on for you ([Settings](https://code.claude.com/docs/en/settings)). The security docs add OpenTelemetry monitoring, periodic `/permissions` audits, `ConfigChange` hooks to audit or block settings changes mid-session, `/security-review`, and dev containers ([Security](https://code.claude.com/docs/en/security)). For CI, use a custom GitHub App limited to Contents, Issues and Pull requests if the default app's broad permissions are too much ([GitHub Actions](https://code.claude.com/docs/en/github-actions)).

The professional workflow pattern has converged. In November's largest setup thread, experienced users described Opus 5.5 at medium effort, several sessions each in its own worktree, subagents for review and large searches, and **a design doc, then a plan, then adversarial review before any code**. Codex was often used as a second-opinion reviewer ([HN](https://news.ycombinator.com/item?id=50366117)). That mirrors Anthropic's writer/reviewer pattern ([Best practices](https://code.claude.com/docs/en/best-practices)) and Cherny's habit of tagging `@.claude` on PRs so lessons flow back into the shared CLAUDE.md ([InfoQ](https://www.infoq.com/news/2026/01/claude-code-creator-workflow)). Anthropic's per-user TPM guidance falls from 200k to 300k for 1 to 5 users down to 10k to 15k for 500+ users ([Costs](https://code.claude.com/docs/en/costs)). Team seats draw from a per-seat allowance that resets on five-hour and weekly windows shared with chat and Cowork ([Costs](https://code.claude.com/docs/en/costs)). Off-machine work keeps growing: cloud sessions at claude.ai/code run in isolated Anthropic-managed VMs whose proxy rejects branch deletions and tag pushes ([Security](https://code.claude.com/docs/en/security)), and Desktop Projects now use a coordinator that hands work to parallel cloud threads (Nov 14, gradual rollout) ([Anthropic](https://claude.com/blog/projects-redesigned)).

The human risk is the one config cannot fix. Anthropic's own engineers report worry about "skills atrophying as [they] delegate more," a **supervision paradox** in which overseeing Claude well takes the very skills that over-delegation erodes ([Anthropic research](https://anthropic.com/research/how-ai-is-transforming-work-at-anthropic)). A widely shared November post, "A year after the 100% AI mandate nobody understands our code," hit the same nerve, though commenters suspected it was itself AI-written engagement bait ([HN](https://news.ycombinator.com/item?id=50433079)). Professional practice therefore keeps humans in the review seat: fresh-context reviews, reading diffs, and handing work to a person after repeated failed rounds.

## More than twenty renames and removals make 2025 tutorials unreliable

| Older tutorial says | Current (Nov 2026) reality | Source |
|---|---|---|
| Docs at docs.anthropic.com/en/docs/claude-code | 302-redirects to code.claude.com/docs/en | [Overview](https://code.claude.com/docs/en/overview) |
| Install Node 18+, then `npm install -g` | Native installer recommended; npm still works but needs Node 22+ and never `sudo` | [Advanced setup](https://code.claude.com/docs/en/setup) |
| Max 5x / Max 20x | Max ($100) / **Ultra** ($200, 10x Pro weekly, no five-hour limit if verified), renamed Nov 1 | [The Next Web](https://thenextweb.com/news/claude-ultra-max-plan-rename-five-hour-limit) |
| "Extra usage" | "Usage credits", `/usage-credits` | [Costs](https://code.claude.com/docs/en/costs) |
| Vertex AI | Docs now say "Google Cloud's Agent Platform" | [Advanced setup](https://code.claude.com/docs/en/setup) |
| Sessions start in default mode; Shift+Tab cycles 3 modes | Start in **auto** (v2.1.283+; cloud platforms v2.1.328); `default` is labeled "Manual"; 5-step cycle; `dontAsk` added | [Permission modes](https://code.claude.com/docs/en/permission-modes) |
| `bypassPermissions` from any settings file | Ignored in project/local settings since v2.1.257 | [Settings](https://code.claude.com/docs/en/settings) |
| `think` < `think hard` < `think harder` < `ultrathink` | Only `ultrathink` remains; use `/effort` (`low` to `max`) | [Model configuration](https://code.claude.com/docs/en/model-config) |
| `#` prefix to add a memory | Absent from docs; ask Claude or use `/memory` | [Interactive mode](https://code.claude.com/docs/en/interactive-mode) |
| "Enterprise" CLAUDE.md | "Managed policy" | [Memory](https://code.claude.com/docs/en/memory) |
| Custom commands in `.claude/commands/` | Merged into skills (`.claude/skills/<name>/SKILL.md`); old path still works | [Skills](https://code.claude.com/docs/en/skills) |
| `/agents` wizard | Removed after v2.1.197; edit `.claude/agents/` or ask Claude | [Subagents](https://code.claude.com/docs/en/sub-agents) |
| `/cost`, `/stats` | Aliases of `/usage` | [Commands](https://code.claude.com/docs/en/commands) |
| `/vim` | Removed v2.1.92; `/config` → Editor mode | [Commands](https://code.claude.com/docs/en/commands) |
| `/pr-comments` | Removed v2.1.91; ask Claude directly | [Commands](https://code.claude.com/docs/en/commands) |
| `/ultraplan` | Removed; use plan mode | [Commands](https://code.claude.com/docs/en/commands) |
| `/output-style` deprecated | Reinstated v2.1.269 (Default, Proactive, Concise, Explanatory, Learning) | [Output styles](https://code.claude.com/docs/en/output-styles) |
| `/doctor` as a diagnostic | `claude doctor` (shell, read-only) plus `/doctor` skill (alias `/checkup`) | [Commands](https://code.claude.com/docs/en/commands) |
| `--transport sse` | Deprecated; use `http` (auto-falls back since v2.1.265) | [MCP](https://code.claude.com/docs/en/mcp) |
| "Every MCP server eats your context" | Tool search on by default; only names load | [MCP](https://code.claude.com/docs/en/mcp) |
| Claude Code SDK (`claude-code-sdk`, `ClaudeCodeOptions`) | Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`, `claude-agent-sdk`, `ClaudeAgentOptions`); no default system prompt | [Migration guide](https://code.claude.com/docs/en/agent-sdk/migration-guide) |
| `claude-code-action@beta` with `direct_prompt` | `@v1` with `prompt` and `claude_args` | [GitHub Actions](https://code.claude.com/docs/en/github-actions) |
| "Routines" | Cloud scheduled tasks | [Overview](https://code.claude.com/docs/en/overview) |
| Permission wildcard `Bash(ls:*)` | `Bash(ls *)` preferred; colon form is legacy | [Permissions](https://code.claude.com/docs/en/permissions) |
| "Manage context aggressively", IMPORTANT/ALL CAPS rules, architecture tours in CLAUDE.md | Listed under "what you can stop doing" | [Best practices](https://code.claude.com/docs/en/best-practices) |
| `subagentStatusLine` setting | Removed in November with no replacement | [HN](https://news.ycombinator.com/item?id=50477704) |
| Default model Opus (any version) | Opus 5.5 per docs, **or** Fable 5.2 per a third-party release log (v2.1.321); unresolved, check `/status` | [Model configuration](https://code.claude.com/docs/en/model-config); [Havoptic](https://www.havoptic.com/releases/claude-code/2026/11) |

## Creator titles chase beginners and money, not engineering depth

Titles cluster into recognizable templates, and the view counts show who creators think the audience is. **Full courses** lead: Nick Saraev's "CLAUDE CODE FULL COURSE 4 HOURS: Build & Sell (2026)" at about 2.37M views, Nate Herk's "Build & Sell with Claude Code (10+ Hour Course)" at about 967K, Tech With Tim's "FULL Claude Code Tutorial for Beginners in 2026!" at about 388K, and freeCodeCamp's 4.5-hour beginner course at about 248K ([DeveloperEducators](https://developereducators.com/roadmap/claude-code/)). **Money framing** is next: "Build $10,000 Websites using Claude Code" at about 1.1M, "Claude Code + HeyGen = Content Creation CHEAT CODE!" at about 1.6M, "How I Vibe Coded a $400K/mo App with Claude Code" at about 348K, and Mosh's "Build Apps 10x Faster with AI" at about 437K ([DeveloperEducators](https://developereducators.com/best/claude-code/)). **No-code** titles target non-technical beginners, such as Futurepedia's tutorial for "Non-Technical Beginners" at about 194K. **Hours-spent distillations** promise compressed experience, such as "800+ hours of Learning Claude Code in 8 minutes" at about 953K and "I Have Spent 1000+ Hours With Claude Code" at about 306K ([DeveloperEducators](https://developereducators.com/best/claude-code/)). **Correction titles** run "You're using Claude Code wrong… Here's how to get the most out of it" ([Recapio](https://recapio.com/digest/youre-using-claude-code-wrong-heres-how-to-get-the-most-out-of-it-by-alex-finn)), "You're Using Claude Code Wrong (And Wasting Hours Every Day)" ([DiamantAI](https://diamantai.substack.com/p/youre-using-claude-code-wrong-and)) and "Everyone Is Using Claude Code Wrong" ([DEV](https://dev.to/alvarito1983/everyone-is-using-claude-code-wrong-1i26)). **Creator-thread retellings** repackage Boris Cherny's January 2026 X thread, often with an added "10x" hook, as in "Boris Cherny (Claude Code Creator) Shares These 22 Tips (You're Probably Using It Wrong)" ([Medium](https://medium.com/@joe.njenga/boris-cherny-claude-code-creator-shares-these-22-tips-youre-probably-using-it-wrong-1b570aedefbe)). Smaller lanes cover second brains ("How I Use Obsidian + Claude Code to Run My Life," about 444K) and cost comparisons ("Claude Code vs Cline vs Codex: Why the Same Task Costs So Much More," about 449K) ([DeveloperEducators](https://developereducators.com/roadmap/claude-code/)).

These figures come from a single aggregator snapshot and could not be checked on YouTube itself. The 30-day community scan could not reach YouTube, Reddit or X at all, so the only first-hand view of *this month's* titles is Hacker News. There, the top Claude Code stories were about trust rather than technique: the email-in-User-Agent report (about 1.6k points), the backdoored extension (about 1k), and Apiiro's "Don't Ask Again" secrets finding (629) ([HN](https://news.ycombinator.com/item?id=50385272); [HN](https://news.ycombinator.com/item?id=50300683); [HN](https://news.ycombinator.com/item?id=50407882)). Next came "Goldman Sachs is pulling Claude Code from its bankers and traders" (905 points, from a source commenters distrusted) and one YouTube video that broke through, "Claude Code and Codex reverse engineered my 1994 Jeep's ECU over a $3 Arduino" ([HN](https://news.ycombinator.com/item?id=50415628); [YouTube](https://www.youtube.com/watch?v=WPj3aQ-xxpI)). The Show HN long tail was dominated by tools for juggling many agents and by "Claude Code + Codex" pairings. The gap between the two audiences is the story: video creators sell entry and income, while practitioner forums argue about security, limits and orchestration.

## Underuse claims hold for verification, but the "10x" framing has no data

The under-use genre is everywhere: "You're Only Using 20% of Claude Code" ([Substack](https://aifordevelopers.substack.com/p/youre-only-using-20-of-claude-code)), "Claude Code has 15 power features, I was using 3" ([DEV](https://dev.to/thestack_ai/claude-code-has-15-power-features-i-was-using-3-ici)), and "9 hidden Claude Code features you're probably missing" ([Tom's Guide](https://www.tomsguide.com/ai/i-test-ai-coding-tools-all-day-here-are-9-hidden-claude-code-features-youre-probably-missing)). **None of them offers usage data** for the percentages in their headlines. Almost every feature they promote traces back to Anthropic's best-practices page and Cherny's thread: verification, plan mode, a lean CLAUDE.md, `/clear`, subagents, skills, hooks, allowlists, worktrees, headless mode and screenshots ([Anthropic best practices](https://www.anthropic.com/engineering/claude-code-best-practices); [InfoQ](https://www.infoq.com/news/2026/01/claude-code-creator-workflow)). In that narrow sense the claims are "supported": the vendor really does recommend these habits. Support for *feature X makes you N times better* is a different matter, and no controlled study measures the effect of any single feature.

The claims fall into three tiers by strength of support. **Verification loops are well supported**, by consensus rather than experiment. The docs, Cherny ("2-3x the quality," his own estimate), the Claude Code team's verification post and Anthropic's power-user article all rank verification first ([Support](https://support.claude.com/en/articles/14554000-claude-code-power-user-); [Claude blog](https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification/)). It is also the only claim that fits the strongest independent finding. **Custom agents and skill-plus-`/loop` are the only features Anthropic itself calls overlooked**, which gives them first-party support but still no measurement ([Support](https://support.claude.com/en/articles/14554000-claude-code-power-user-)). **Elaborate setups are contradicted by the experts the creators cite.** Cherny runs a mostly vanilla configuration: a small shared CLAUDE.md, a few slash commands, one formatter hook ([InfoQ](https://www.infoq.com/news/2026/01/claude-code-creator-workflow)). Experienced users in November said a short instruction file beats piles of custom skills, and one reviewer simply asks Claude to review a PR, with "no hidden commands or anything special" ([HN](https://news.ycombinator.com/item?id=50366117)). Content like "40 Claude subagents just leaked" ([The Vibe Marketer](https://thevibemarketer.beehiiv.com/p/40-claude-subagents-just-leaked-and-4-other-game-changers)) points the opposite way from expert practice, and the documented context cost of every enabled skill, agent and plugin explains why.

The productivity multipliers in titles find no support in the measured evidence. METR's randomized trial of 16 experienced open-source developers on 246 real issues found AI-allowed tasks took **19% longer**, while the developers forecast a 24% speedup and afterward believed they had been about 20% faster ([METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)). Those were mostly Cursor users on Claude 3.5/3.7, and METR now marks the result out of date. The February 2026 follow-up (57 developers, 800+ tasks) found speedups of 18% for returning developers (CI −38% to +9%) and 4% for new ones (CI −15% to +9%). METR calls this "very weak evidence," confounded by developers who refused to work without AI and by multi-agent workflows that break time tracking ([METR update](https://metr.org/blog/2026-02-24-uplift-update/)). Anthropic's internal data is far rosier but self-reported: about **+50% productivity**, a **67% rise in merged PRs per engineer per day**, and 27% of Claude-assisted work that "would not otherwise have been done." Anthropic itself flags selection, social-desirability and recall bias ([Anthropic research](https://anthropic.com/research/how-ai-is-transforming-work-at-anthropic)). The defensible reading is that late-2025 and 2026 agentic tooling probably delivers positive but modest-to-moderate speedups per task, plus a real expansion of scope that speed metrics miss. "10x" sits far outside every measurement, and METR's perception gap is a specific reason to discount creators' self-reports. The Ask HN thread "Opus 5.5 suddenly dumb as rocks?" showed the same gap in reverse: a benchmark tracker found no decline ([HN](https://news.ycombinator.com/item?id=50296367); [HN](https://news.ycombinator.com/item?id=50419019)). Felt quality, up or down, is a poor instrument.

## Conclusion

The path from zero to professional is not a climb through ever more features. It is a steady move of trust out of Claude's assertions and into checks you control: git before checkpoints, tests before "done," permission rules and hooks before CLAUDE.md pleas, and fresh-context review before merge. Each level above adds reach, and each one also adds a context cost or an attack surface. Professionals look restrained because they add an extension only when a repeated failure justifies it. The creator economy sells the opposite, a hidden 80% to unlock, and the measured evidence plus the experts they quote both suggest the real gap is verification discipline, not feature awareness.

Two practical implications follow for anyone learning now. First, date-check every tutorial against the renames table: auto mode as default, effort instead of think keywords, skills instead of commands, and the Agent SDK name alone break most 2025 walkthroughs. Second, treat the November trust incidents (leaked emails, committed secrets, a fake extension) as part of the curriculum, not as news. As Claude Code moves toward parallel agents and unattended runs, the decisive skill is configuring what it is *not* allowed to do. The default-model question should be settled empirically on your own machine with `/status`, because the available documentation and release tracking disagree.
