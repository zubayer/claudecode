import type { Level } from "./types"

const L = (...lines: string[]) => lines.join("\n")
const D = "https://code.claude.com/docs/en/"

export const LEVELS_B: Level[] = [
  {
    id: "l3",
    num: 3,
    title: "Verification & git",
    rank: "Operator",
    tagline: "Turn “looks done” into “proven done”, and run work in parallel safely.",
    goal: "Give Claude checks it can run, review in a fresh context, and run 2 to 3 parallel sessions with worktrees.",
    project: {
      title: "Bug hunt with proof",
      brief: "Pick a real bug or open issue. Reproduce it with a failing test, have Claude fix it, review the fix in a fresh session, and open a PR.",
      checklist: [
        "Claude wrote a failing test that reproduces the bug",
        "The fix made the test pass and Claude showed the output",
        "A fresh session reviewed the diff and reported only real gaps",
        "Opened a PR with `gh pr create` (or asked Claude to)",
        "Ran a second task in parallel with `claude --worktree`",
      ],
    },
    lessons: [
      {
        id: "l3-verify",
        title: "The #1 habit: give Claude a check it can run",
        minutes: 8,
        intuition: L(
          "Without a check, “looks done” is the only signal, and **you** become the test suite.",
          "With a check (tests, a build, a linter, a screenshot), Claude can loop on its own until the check passes and show you proof. This is the most agreed-upon advice in the whole Claude Code world.",
        ),
        analogy: L(
          "A pilot with instruments vs a pilot flying by feel in fog. Both may feel confident. Only one has a reading that says the plane is level. Tests are Claude's instruments.",
        ),
        formal: L(
          "- Docs: “Give Claude a check it can run: tests, a build, a screenshot to compare.”",
          "- Named failure: the **trust-then-verify gap**, plausible code that misses edge cases. The rule: “If you can't verify it, don't ship it.”",
          "- Boris Cherny (Claude Code's creator) calls verification his most important tip and estimates it improves final quality **2 to 3×**. That's his estimate, not a measured result.",
          "- The Claude Code team's verification post (Nov 2026): put a `verify` skill in `.claude/skills/` that boots the app and runs smoke tests; favor end-to-end, property and differential tests; enforce build/test/lint with a hook or `/goal`; never let an agent skip or blindly retry a flaky test; hand off to a human after three failed rounds.",
          "- Bundled skills: `/verify`, `/simplify`, `/code-review`.",
          "- Ask for **evidence**: the command it ran and what it returned.",
        ),
        example: {
          title: "From “done!” to proof",
          steps: [
            { label: "Weak", code: "› add input validation to the signup form" },
            { label: "Strong", code: "› add input validation to the signup form. Write tests for:\n  empty email, malformed email, 7-char password. Run them\n  and paste the output. Then run the build." },
            { label: "What you check", text: "The pasted test output and build result, not Claude's summary sentence." },
          ],
          result: "Claude can iterate against a real signal, and you review evidence in seconds.",
        },
        terminal: {
          intro: "Simulated session. Demand proof.",
          steps: [
            { cmd: "add email validation to signup and prove it works with tests", out: ["⏺ Edit(src/signup.ts)", "⏺ Write(src/signup.test.ts)", "⏺ Bash(npm test -- signup)", "  ✓ rejects empty email", "  ✓ rejects malformed email", "  ✕ rejects short password  (expected error, got none)", "One test fails; fixing the length check…", "⏺ Edit(src/signup.ts)", "⏺ Bash(npm test -- signup)  ✓ 3 passed"], note: "Claude caught its own bug because it had a check to run." },
            { cmd: "/verify", out: ["Running verify skill: build ✓ · lint ✓ · smoke test (boot app, POST /signup) ✓"] },
          ],
        },
        caveman: "No check = you become test. Give test, build, screenshot. Claude loop till green. Ask proof, not promise.",
        pitfall: "Accepting “I've fixed it and it should work now.” Always ask: what did you run, and what did it return?",
        quiz: [
          { q: "What is the “trust-then-verify gap”?", options: ["A networking error", "Plausible-looking code that misses edge cases", "A billing delay", "A git conflict"], answer: 1, why: "It's Anthropic's name for over-trusting unverified output." },
          { q: "Cherny's “2-3× quality” figure for verification is…", options: ["A randomized trial result", "His practitioner estimate", "An Anthropic benchmark", "A METR finding"], answer: 1, why: "It's his estimate, not a measurement." },
          { q: "After three failed verification rounds, the team's advice is to…", options: ["Disable the tests", "Retry forever", "Hand off to a human", "Switch to bypass mode"], answer: 2, why: "Don't let agents grind; bring in a person." },
        ],
        sources: [
          { label: "Best practices", url: D + "best-practices" },
          { label: "How the Claude Code team thinks about verification", url: "https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification/" },
        ],
      },
      {
        id: "l3-tdd",
        title: "TDD and screenshot loops",
        minutes: 7,
        intuition: L(
          "Two loops make verification automatic. For **bugs and logic**: write a failing test first, then fix. For **UI**: show the target design, build, screenshot, compare, fix the differences.",
        ),
        analogy: L(
          "TDD is drawing the target on the wall before throwing darts. The screenshot loop is a painter stepping back from the canvas to compare with the reference photo, again and again.",
        ),
        formal: L(
          "**Test-driven loop:**",
          "1. “Write a failing test that reproduces the bug. Don't fix yet.”",
          "2. Confirm it fails for the right reason.",
          "3. “Now make it pass without changing the test.”",
          "4. Run the full suite.",
          "**Screenshot loop:**",
          "1. Paste the design (`Ctrl+V`, or `Alt+V` on Windows/WSL).",
          "2. Implement.",
          "3. Screenshot the result (a browser tool, MCP server or skill can do this).",
          "4. Ask Claude to list differences and fix them; repeat.",
          "Saying “don't change the test” matters: otherwise an agent may “fix” the test instead of the code.",
        ),
        example: {
          title: "Bug: totals off by one cent",
          steps: [
            { label: "Reproduce", code: "› write a failing test: a 3-item cart with 10% discount\n  should total 26.97. Don't fix anything yet." },
            { label: "Confirm", text: "Claude runs it: expected 26.97, got 26.96. Good, it fails for the right reason." },
            { label: "Fix", code: "› make it pass without modifying the test, then run all tests" },
          ],
          result: "The bug can never silently return: the test now guards it forever.",
        },
        caveman: "Bug? Test first, fail first, then fix, test no touch. UI? Show picture, build, screenshot, compare, fix. Repeat.",
        quiz: [
          { q: "Why say “don't modify the test”?", options: ["Tests are read-only files", "An agent may otherwise change the test to pass", "It's faster", "It's a CLI flag"], answer: 1, why: "You want the code fixed, not the target moved." },
          { q: "How do you paste a design image into Claude Code?", options: ["You can't", "Ctrl+V (Alt+V on Windows/WSL)", "Email it", "/image only"], answer: 1, why: "Paste images directly into the prompt." },
          { q: "In TDD, before fixing, you should confirm the test…", options: ["Passes", "Fails for the right reason", "Is deleted", "Is skipped"], answer: 1, why: "A failing test proves you reproduced the bug." },
        ],
        sources: [{ label: "Best practices", url: D + "best-practices" }],
      },
      {
        id: "l3-git",
        title: "Git, PRs and fresh-context review",
        minutes: 8,
        intuition: L(
          "Let Claude handle git in plain English, and let a **separate, fresh session** review its work. A fresh reviewer isn't biased toward code it just wrote.",
        ),
        analogy: L(
          "Writers don't proofread their own drafts well, because they read what they meant, not what they wrote. Newspapers use a separate copy editor. Your second session is the copy editor.",
        ),
        formal: L(
          "- Install and log in to the GitHub CLI (`gh`). The docs call CLI tools the most context-efficient way to reach external services.",
          "- “create a pr for my changes” → Claude uses `gh pr create`, and the session is linked to the PR. Reopen later with `claude --from-pr 1234`.",
          "- Review commands: `/diff`, `/review 1234` (alias of `/code-review`), `/security-review` (branch diff vs default branch), `/install-github-app`.",
          "- **Writer/reviewer pattern:** a second session reviews; tell it to report only correctness bugs and requirement gaps, because reviewers over-report and that leads to over-engineering.",
          "- Auto mode allows pushing to branches of the current repo but blocks force push and `git reset --hard`.",
          "- Attribution trailers are added to commits and PRs by default; control with the `attribution` setting.",
        ),
        example: {
          title: "Two-session review",
          steps: [
            { label: "Session A (writer)", code: "› implement @SPEC.md, run tests, commit on branch feat/reports" },
            { label: "Session B (reviewer), fresh", code: "› review the diff of feat/reports against main. Report ONLY\n  correctness bugs or unmet requirements from @SPEC.md." },
            { label: "Back in A", code: "› address these two review findings: … then create a pr" },
          ],
          result: "Real bugs caught, no gold-plating, and a linked PR.",
        },
        caveman: "Git by talk. gh do PR. New session review old session code. Reviewer say only real bug, no nitpick.",
        quiz: [
          { q: "Why review in a fresh session?", options: ["It's cheaper", "It isn't biased toward code it just wrote", "Old sessions can't read git", "Required by GitHub"], answer: 1, why: "Fresh context = unbiased reviewer." },
          { q: "Which command reviews your branch for security issues?", options: ["/security-review", "/secure", "/audit-all", "/vim"], answer: 0, why: "It diffs your branch against the default branch." },
          { q: "What does auto mode block by default?", options: ["All git", "Force push and git reset --hard", "Reading files", "Running tests"], answer: 1, why: "Destructive git actions are blocked." },
        ],
        sources: [{ label: "Common workflows", url: D + "common-workflows" }],
      },
      {
        id: "l3-worktrees",
        title: "Parallel sessions with worktrees",
        minutes: 8,
        intuition: L(
          "Want Claude working on two things at once? Give each session its own **worktree**: a separate checkout of the repo on its own branch, so they never trip over each other's files.",
        ),
        analogy: L(
          "Two chefs, one kitchen, one cutting board: chaos. Two chefs, two stations, same pantry: fine. Worktrees are separate stations sharing one repository pantry.",
        ),
        formal: L(
          "```",
          "claude --worktree feature-auth   # or -w; creates .claude/worktrees/feature-auth/",
          "claude --worktree \"#1234\"        # branch from a PR",
          "# manual equivalent",
          "git worktree add ../project-feature-a -b feature-a && cd ../project-feature-a && claude",
          "git worktree list && git worktree remove ../project-feature-a",
          "```",
          "- The repo needs at least one commit.",
          "- Add `.claude/worktrees/` to `.gitignore`.",
          "- List gitignored files a worktree needs (`.env`, `config/secrets.json`) in a root `.worktreeinclude` file.",
          "- `/batch <task>` splits a big job into 5 to 30 units, each with its own worktree and PR.",
          "- Anthropic's power-user article recommends **3 to 5** worktree sessions. Cherny runs about five local plus 5 to 10 on the web, and **abandons 10 to 20%** of them: dropping a bad run is cheaper than rescuing it.",
        ),
        example: {
          title: "Morning with three sessions",
          steps: [
            { label: "Terminal 1", code: "claude -w fix-billing\n› fix issue #412, test first" },
            { label: "Terminal 2", code: "claude -w docs-refresh\n› update README install steps to the native installer" },
            { label: "Terminal 3", code: "claude -w spike-cache\n› prototype a Redis cache for /search; it's a spike, no PR" },
          ],
          result: "Three independent branches progress while you review whichever finishes first. The spike turned out wrong? Delete it without guilt.",
        },
        terminal: {
          intro: "Simulated shell in a repo with commits.",
          steps: [
            { cmd: "claude --worktree fix-billing", accept: ["claude -w fix-billing"], out: ["Created worktree .claude/worktrees/fix-billing on branch worktree-fix-billing", "Claude Code · ~/shop/.claude/worktrees/fix-billing"] },
            { cmd: "git worktree list", out: ["~/shop                               a1b2c3 [main]", "~/shop/.claude/worktrees/fix-billing d4e5f6 [worktree-fix-billing]"], note: "Each session edits its own checkout." },
          ],
        },
        caveman: "Two job same time? Each get own worktree. claude -w name. 3 to 5 good. Bad run? Throw away. Cheap.",
        pitfall: "Running two sessions in the same folder. They'll overwrite each other's edits.",
        quiz: [
          { q: "What does `claude --worktree feature-auth` create?", options: ["A new repo on GitHub", "A separate checkout under .claude/worktrees/ on its own branch", "A backup zip", "A new user account"], answer: 1, why: "Built-in worktree support." },
          { q: "How many parallel worktree sessions does Anthropic's power-user guide suggest?", options: ["1", "3 to 5", "50", "As many as possible"], answer: 1, why: "3 to 5 is the suggested range." },
          { q: "A worktree needs your gitignored .env. Where do you list it?", options: [".worktreeinclude", "CLAUDE.md", ".mcp.json", "package.json"], answer: 0, why: ".worktreeinclude copies listed files into worktrees." },
        ],
        sources: [{ label: "Worktrees", url: D + "worktrees" }],
      },
    ],
  },

  {
    id: "l4",
    num: 4,
    title: "Extending Claude Code",
    rank: "Orchestrator",
    tagline: "Skills, subagents, hooks, MCP and plugins: what each is for, and what each costs.",
    goal: "Build one skill, one subagent and one hook; connect one MCP server; know when not to.",
    project: {
      title: "Your personal toolkit",
      brief: "Package a workflow you repeat weekly into a skill, add a reviewer subagent and a formatter hook, and commit them to .claude/.",
      checklist: [
        "Wrote a SKILL.md with a clear `description` and invoked it",
        "Created `.claude/agents/code-reviewer.md` with a restricted tool list",
        "Added a PostToolUse hook that formats files after edits",
        "Connected one MCP server (or chose a CLI like `gh` instead, on purpose)",
        "Checked `/skills` token cost and removed one thing you don't use",
      ],
    },
    lessons: [
      {
        id: "l4-model",
        title: "The five extension types in one picture",
        minutes: 6,
        intuition: L(
          "Five ways to extend Claude Code, each answering a different need:",
          "- **CLAUDE.md**: always-on memory.",
          "- **Skill**: an on-demand procedure.",
          "- **Subagent**: a separate context window (a helper with its own desk).",
          "- **Hook**: a guarantee that always runs.",
          "- **MCP**: a bridge to outside systems.",
          "**Plugins** package all of these for sharing.",
        ),
        analogy: L(
          "A restaurant: the house rules on the wall (CLAUDE.md), recipe cards pulled out when a dish is ordered (skills), a sous-chef working at their own station (subagent), the fire alarm that triggers no matter what anyone thinks (hook), and the delivery door to suppliers (MCP). A franchise kit bundles it all (plugin).",
        ),
        formal: L(
          "**Choose by question:**",
          "- “Should Claude always know this?” → CLAUDE.md (keep short).",
          "- “Is this a repeatable procedure I invoke sometimes?” → skill.",
          "- “Will this flood context with search results or logs?” → subagent; only its summary returns.",
          "- “Must this happen every time, no exceptions?” → hook (or permission rule).",
          "- “Does Claude need a system it can't reach from the shell?” → MCP. If a CLI exists (`gh`, `aws`, `gcloud`), prefer it.",
          "**Every extension costs something:** skill and agent descriptions sit in context every turn; plugins can run code with your privileges. Professionals add an extension only when a repeated problem justifies it.",
        ),
        example: {
          title: "Routing four real needs",
          steps: [
            { label: "“Always use pnpm, not npm”", text: "One line in CLAUDE.md." },
            { label: "“Our release checklist, every other Friday”", text: "A `/release` skill." },
            { label: "“Search 2,000 files for every place we call the payments API”", text: "An Explore subagent, so the search noise stays out of your main context." },
            { label: "“Never let anything edit migrations/”", text: "A deny permission rule (and optionally a PreToolUse hook)." },
          ],
          result: "Right tool, smallest footprint.",
        },
        caveman: "CLAUDE.md always know. Skill = recipe when need. Subagent = helper own desk. Hook = always happen. MCP = door to outside. Plugin = box of all. Each cost context.",
        quiz: [
          { q: "Something must happen every single time Claude edits a file. Use a…", options: ["CLAUDE.md line", "Hook", "Skill", "MCP server"], answer: 1, why: "Hooks are deterministic; CLAUDE.md is advisory." },
          { q: "A big codebase search would flood context. Use a…", options: ["Subagent", "Hook", "Longer CLAUDE.md", "Bypass mode"], answer: 0, why: "Subagents work in their own window and return a summary." },
          { q: "Claude needs GitHub data and `gh` is installed. Best choice?", options: ["Always install the GitHub MCP server", "Use the `gh` CLI", "Paste data manually", "Disable git"], answer: 1, why: "Docs: CLI tools are more context-efficient than MCP servers." },
        ],
        sources: [{ label: "Skills", url: D + "skills" }],
      },
      {
        id: "l4-skills",
        title: "Skills (and the end of custom commands)",
        minutes: 9,
        intuition: L(
          "A skill is a folder with a `SKILL.md` file: a name, a description, and instructions. Claude sees only the short description until the skill is needed, then loads the full instructions.",
          "Custom slash commands are now part of skills: one concept instead of two.",
        ),
        analogy: L(
          "A recipe box. Claude reads the labels on the index cards (descriptions) all the time, but only pulls out the full card when someone orders that dish. A thousand recipes cost almost nothing until used.",
        ),
        formal: L(
          "- `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy`. Old command files still work; the skill wins on a name clash; skills are recommended.",
          "- **Locations:** personal `~/.claude/skills/<name>/`, project `.claude/skills/<name>/`; plugin skills are namespaced `/plugin:skill`.",
          "- **The `description` matters most:** Claude auto-loads a skill when a request matches it, unless `disable-model-invocation: true`.",
          "- **Arguments:** `$ARGUMENTS`, `$0`, `$1`, or named `$name`.",
          "- **Inline shell:** `!` followed by a backticked command runs before the skill is sent and inlines its output.",
          "- `allowed-tools` scopes what the skill may run; `context: fork` runs it in a subagent.",
          "- **Progressive disclosure:** only names and descriptions sit in context; keep SKILL.md under 500 lines and put long references in extra files.",
          "- `/skills` lists installed skills (press `t` to sort by token cost); `/reload-skills` re-scans.",
          "- Agent Skills became an **open standard** on Dec 18, 2025, so skills work across many agents.",
        ),
        example: {
          title: "The official example skill",
          steps: [
            {
              label: "~/.claude/skills/summarize-changes/SKILL.md",
              code: `---
name: summarize-changes
description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.
allowed-tools: Bash(git diff *)
---
## Current changes
!\`git diff HEAD\`
## Instructions
Summarize the changes above in two or three bullet points, then list any risks you notice.`,
            },
            { label: "Use it", code: "/summarize-changes\n# or just: “what did I change?” (description match)" },
          ],
          result: "A repeatable procedure in 10 lines, auto-triggered by natural requests.",
        },
        terminal: {
          intro: "Simulated session. Use and inspect skills.",
          steps: [
            { cmd: "what did I change?", accept: ["what did i change"], out: ["⏺ Skill(summarize-changes)", "⏺ Bash(git diff HEAD)", "• Added email validation to signup", "• New tests in signup.test.ts", "Risks: password rule changed, existing users with 7-char passwords unaffected but can't reset to one."], note: "The description matched your request, so the skill loaded itself." },
            { cmd: "/skills", out: ["summarize-changes (personal) · 96 tokens", "verify (project) · 140 tokens", "frontend-design (plugin) · 210 tokens", "Press t to sort by token cost"] },
          ],
        },
        caveman: "Skill = folder + SKILL.md. Description = label Claude read always. Body load only when need. Commands now skills. Write description good.",
        pitfall: "A vague description like “helps with stuff”. Claude can't tell when to use it. Say what it does and when to use it.",
        proTip: "Turn any prompt you've typed three times into a skill.",
        quiz: [
          { q: "What does Claude keep in context for an unused skill?", options: ["The whole SKILL.md", "Only name and description", "Nothing at all", "All referenced files"], answer: 1, why: "Progressive disclosure: descriptions only until invoked." },
          { q: "`.claude/commands/x.md` and `.claude/skills/x/SKILL.md` both exist. Which runs for /x?", options: ["The command", "The skill", "Both", "Neither, error"], answer: 1, why: "The skill wins on a name clash." },
          { q: "Which frontmatter field most affects auto-triggering?", options: ["name", "description", "version", "author"], answer: 1, why: "Claude matches requests against the description." },
        ],
        sources: [
          { label: "Skills", url: D + "skills" },
          { label: "Equipping agents with Agent Skills", url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills" },
        ],
      },
      {
        id: "l4-subagents",
        title: "Subagents: helpers with their own desk",
        minutes: 8,
        intuition: L(
          "A subagent is a separate Claude with its own context window, tools and model. It does a focused job and hands back **only a summary**, so your main session stays clean.",
          "Anthropic's own power-user guide calls custom agents “a powerful primitive that often gets overlooked.”",
        ),
        analogy: L(
          "Sending a research assistant to the library. They read 40 books; you get a one-page brief. Your desk doesn't fill up with 40 books.",
        ),
        formal: L(
          "- A subagent is a Markdown file in `.claude/agents/` (project) or `~/.claude/agents/` (personal). Only `name` and `description` are required; the body becomes its system prompt.",
          "- Useful fields: `tools` (allowlist), `model` (`haiku` for cheap tasks, `sonnet`, `inherit`), `isolation: worktree`, `skills`.",
          "- **Built-ins:** Explore (read-only), Plan, general-purpose.",
          "- **Invoke:** in plain language, with `@\"code-reviewer (agent)\"`, or for a whole session with `claude --agent code-reviewer`.",
          "- Defaults: nest up to 3 deep, 20 running at once.",
          "- **Changed:** `/agents` no longer opens a wizard (removed after v2.1.197). Ask Claude to create the agent or edit the file; changes hot-reload.",
          "- Anthropic now lists “subagents just to save context” under things you can stop doing; use them for **focus, isolation and parallel work**, not as a reflex.",
        ),
        example: {
          title: "A read-only reviewer",
          steps: [
            {
              label: ".claude/agents/code-reviewer.md",
              code: `---
name: code-reviewer
description: Reviews code for quality and best practices. Use proactively after code changes.
tools: Read, Glob, Grep
model: sonnet
---
You are a code reviewer. Report only correctness bugs and requirement gaps.`,
            },
            { label: "Call it", code: "› use the code-reviewer agent on my last commit" },
          ],
          result: "A reviewer that physically can't edit files, runs on a cheaper model, and returns a focused list.",
        },
        caveman: "Subagent = helper own desk, own brain. Do job, bring back short note. File in .claude/agents/. Give few tools. Cheap model for easy job.",
        quiz: [
          { q: "What does a subagent return to the main session?", options: ["Its full transcript", "Only a summary", "Nothing", "All files it read"], answer: 1, why: "That's how it keeps your main context clean." },
          { q: "How do you create a subagent in Nov 2026?", options: ["/agents wizard", "Write .claude/agents/<name>.md or ask Claude to", "Email Anthropic", "Only via plugins"], answer: 1, why: "The /agents wizard was removed after v2.1.197." },
          { q: "Which built-in subagent is read-only?", options: ["Explore", "general-purpose", "Bypass", "Writer"], answer: 0, why: "Explore is the read-only built-in." },
        ],
        sources: [
          { label: "Subagents", url: D + "sub-agents" },
          { label: "Claude Code power-user tips", url: "https://support.claude.com/en/articles/14554000-claude-code-power-user-" },
        ],
      },
      {
        id: "l4-hooks",
        title: "Hooks: rules that always run",
        minutes: 9,
        intuition: L(
          "CLAUDE.md *asks* Claude to do something. A hook *makes* it happen. Hooks are your own scripts that run at specific moments: before a tool runs, after an edit, when Claude stops, when a session starts.",
        ),
        analogy: L(
          "A sign saying “please wipe your feet” vs an automatic door mat that cleans shoes whether you notice it or not. Hooks are the mat.",
        ),
        formal: L(
          "- Configured under `\"hooks\"` in any settings file. Events include `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `SessionStart`, `PreCompact`, `ConfigChange` and more.",
          "- Each hook receives event **JSON on stdin**.",
          "- **Exit-code trap: exit 2 blocks; exit 1 does NOT block.** Use exit 2 for policy enforcement.",
          "- For finer control, exit 0 and print JSON with `hookSpecificOutput` → `permissionDecision: \"deny\"` and a reason.",
          "- **Matchers:** exact names or lists like `Edit|Write`; otherwise unanchored regex, so `Edit.*` also matches `NotebookEdit`.",
          "- `/hooks` is a read-only browser of what's configured.",
          "- Hard allow/deny decisions still belong in permissions; a hook's `if` filter is best-effort.",
          "- Cherny's whole setup has **one** hook: a PostToolUse formatter after edits.",
        ),
        example: {
          title: "Auto-format after every edit, block rm in Bash",
          steps: [
            {
              label: ".claude/settings.json (excerpt)",
              code: `{"hooks": {
  "PostToolUse": [{"matcher": "Edit|Write", "hooks": [
    {"type": "command", "command": "npx prettier --write \\"$(jq -r .tool_input.file_path)\\""}]}],
  "PreToolUse": [{"matcher": "Bash", "hooks": [
    {"type": "command", "if": "Bash(rm *)",
     "command": "\${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh", "timeout": 30}]}]
}}`,
            },
            { label: ".claude/hooks/block-rm.sh", code: "#!/bin/sh\necho \"rm is blocked in this repo; ask the user\" >&2\nexit 2   # 2 = block. 1 would NOT block." },
          ],
          result: "Every edited file is formatted, and rm commands are stopped with a reason Claude can read.",
        },
        caveman: "CLAUDE.md ask. Hook force. Script run on event. exit 2 = block. exit 1 = NOT block. Careful.",
        pitfall: "Writing `exit 1` in a blocking hook and assuming it blocks. Only exit 2 blocks.",
        quiz: [
          { q: "Which exit code blocks the action?", options: ["0", "1", "2", "Any non-zero"], answer: 2, why: "Exit 2 blocks; exit 1 does not." },
          { q: "How does a hook receive event details?", options: ["Environment variable only", "JSON on stdin", "A file on Desktop", "It doesn't"], answer: 1, why: "Hooks read event JSON from stdin." },
          { q: "A matcher `Edit.*` will also match…", options: ["Nothing else", "NotebookEdit", "Bash", "Read"], answer: 1, why: "Non-exact matchers are unanchored regex." },
        ],
        sources: [{ label: "Hooks", url: D + "hooks" }],
      },
      {
        id: "l4-mcp",
        title: "MCP servers and plugins",
        minutes: 9,
        intuition: L(
          "**MCP** (Model Context Protocol) connects Claude to outside tools: issue trackers, error monitoring, docs, databases, design files.",
          "**Plugins** bundle skills, agents, hooks and MCP servers into one installable package.",
        ),
        analogy: L(
          "MCP is a universal power adapter: one standard plug, many countries' sockets. Plugins are a travel kit with the adapter, charger and cables in one pouch. Handy, but only buy kits from shops you trust.",
        ),
        formal: L(
          "```",
          "claude mcp add --transport http notion https://mcp.notion.com/mcp",
          "claude mcp add --transport http sentry https://mcp.sentry.dev/mcp   # OAuth via /mcp",
          "claude mcp add --env AIRTABLE_API_KEY=KEY --transport stdio airtable -- npx -y airtable-mcp-server",
          "claude mcp list   |   claude mcp get <name>   |   claude mcp remove <name>",
          "```",
          "- Options go **before** the server name; `--` separates them from a stdio command.",
          "- **SSE is deprecated**; use `http` (it falls back automatically since v2.1.265).",
          "- **Scopes:** local (default, private, in `~/.claude.json`), project (`.mcp.json` at repo root, committed, with `${VAR}` expansion), user.",
          "- Since v2.1.327, `claude mcp add-json <name> -` reads config from stdin so tokens stay out of shell history.",
          "- **Context cost changed:** in 2025 the GitHub MCP server alone measured ~55k tokens. Now **tool search is on by default**, so only tool names load at startup. Still: prefer CLIs like `gh` when they exist.",
          "**Plugins:** browse with `/plugin` → Discover; install by name (e.g. `commit-commands@claude-plugins-official`); add catalogs with `/plugin marketplace add <owner/repo>`. Listings show a context-cost estimate. A plugin can run code with your user privileges, so install only from publishers you trust.",
        ),
        example: {
          title: "Connect error monitoring, then use it",
          steps: [
            { label: "Add the server", code: "claude mcp add --transport http sentry https://mcp.sentry.dev/mcp" },
            { label: "Authenticate", code: "/mcp   → choose sentry → log in via browser" },
            { label: "Use it", code: "› what are the top 3 new errors in production this week,\n  and which files do they point to?" },
          ],
          result: "Claude pulls live error data, opens the matching files, and can propose fixes with tests.",
        },
        terminal: {
          intro: "Simulated shell. Add and inspect an MCP server.",
          steps: [
            { cmd: "claude mcp add --transport http notion https://mcp.notion.com/mcp", out: ["Added HTTP MCP server notion (scope: local)"] },
            { cmd: "claude mcp list", out: ["notion   http   https://mcp.notion.com/mcp   ⚠ needs auth (/mcp)"], note: "Authenticate inside a session with /mcp." },
            { cmd: "/plugin", out: ["Plugins › Discover · Installed · Marketplaces", "claude-plugins-official: commit-commands · frontend-design · superpowers …", "Each listing shows Context cost"] },
          ],
        },
        caveman: "MCP = plug to outside tool. claude mcp add --transport http. SSE old. CLI exist? Use CLI. Plugin = box of skill+agent+hook+MCP. Only trust shop.",
        pitfall: "Installing extensions from unofficial marketplaces. On Oct 30, 2026, a backdoored “Claude Code for VS Code” extension appeared on the Open VSX marketplace.",
        quiz: [
          { q: "Which MCP transport is deprecated?", options: ["http", "stdio", "sse", "none"], answer: 2, why: "Use http; it falls back to SSE automatically." },
          { q: "Which scope commits an MCP server for the whole team?", options: ["local", "project (.mcp.json)", "user", "global"], answer: 1, why: ".mcp.json at the repo root is shared." },
          { q: "Why be careful with plugins?", options: ["They're slow", "They can run code with your user privileges", "They delete CLAUDE.md", "They cost $50 each"], answer: 1, why: "Install only from trusted publishers." },
        ],
        sources: [
          { label: "MCP", url: D + "mcp" },
          { label: "Plugins", url: D + "plugins" },
        ],
      },
    ],
  },
]
