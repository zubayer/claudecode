# Claude Code Academy: zero to pro

An interactive, mobile-first learning platform for Claude Code, from first install to professional team practice.

**Try it:** open `docs/index.html` in a browser (a single self-contained file). If GitHub Pages is enabled for the `docs/` folder, it is served from there.

## What's inside

- **8 levels, 33 lessons** (Levels 0 to 6 core, plus a bonus "Beyond code" level). Each lesson moves from intuition → analogy → how it works → worked example → simulated terminal → quiz.
- **Grill Me:** 40 open questions with recommended answers and key-idea matching; weak spots come back more often.
- **Review:** spaced-repetition flashcards (Leitner boxes) from finished lessons and the glossary.
- **Labs:** Prompt clinic, CLAUDE.md builder, Skill builder and Settings builder that output files you can paste into Claude Code.
- **Placement test, final exam and certificate**, plus XP, ranks, streaks, daily goal and badges.
- **Library:** cheat sheet, hype vs reality, video titles decoded, this month's news, old tutorial traps, skills to install, glossary.
- **Caveman mode** 🪨: an ultra-short TL;DR on every lesson.

Progress is stored in the browser's localStorage only.

Content reflects Claude Code as of November 2026. See `docs/research-report.md` for the sourced research behind it. Commands and plans change often, so check the official docs at https://code.claude.com/docs.

## Develop

Stack: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui. Node 18+ and pnpm.

```bash
pnpm install
pnpm dev            # local dev server
pnpm build          # production build to dist/
```

To rebuild the single-file version in `docs/index.html`, bundle with Parcel and inline assets (for example with `parcel build index.html --no-source-maps` followed by `html-inline`).

Lesson content lives in `src/data/` (`levels-a.ts`, `levels-b.ts`, `levels-c.ts`, `levels-bonus.ts`, `grill.ts`, `library.ts`).
