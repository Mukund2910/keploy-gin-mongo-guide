# Your First Keploy Tests in Go: Gin + MongoDB

A single-page, beginner-friendly tutorial that walks through Keploy's
[Gin + MongoDB quickstart](https://keploy.io/docs/quickstart/samples-gin/): record real API traffic,
inspect the generated YAML tests and mocks, replay them without a database, and catch a regression.

Built with **Next.js 16 (App Router) + MDX** and **Tailwind CSS v4**. Type is IBM Plex Sans / Plex Mono for UI and code,
with Source Serif 4 for the long-form body. Zinc + orange palette; inside diagrams and terminals, red marks recording and green marks replay.

## Features

- "Let an AI coding agent do it": animated Claude Code, Codex and OpenCode sessions that install Keploy and run record/test, plus install commands and an `AGENTS.md` template
- Motion throughout: scroll reveals, animated record/replay diagram, sliding tab indicators, circular theme-switch transition (View Transitions API); all disabled under `prefers-reduced-motion`
- An animated record-then-replay terminal session in the hero (respects `prefers-reduced-motion`)
- Tutorial content lives in [`app/page.mdx`](app/page.mdx), with Markdown and React components mixed together
- Syntax highlighting via `rehype-pretty-code` (Shiki) with dual light/dark themes, file titles and line highlights
- Custom MDX components: `<Callout>` (info / tip / warning / a-ha), `<Steps>`, `<Tabs>`, `<FileTree>`,
  and a record-vs-replay diagram
- Copy-to-clipboard on every code block
- Dark/light mode toggle (`next-themes`, follows the system by default)
- Skimmable layout: numbered step sections with time estimates, a 4-command summary, collapsible "go deeper" panels, plus a reading progress bar
- Fully static output (`○ /` prerendered)

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Project structure

```
app/
  page.mdx        # the tutorial
  layout.tsx      # header, theme toggle, TOC sidebar
  globals.css     # Tailwind + code block / steps styles
components/
  docs.tsx        # server components used in MDX (Callout, Section, Details, Glance, FileTree, diagram)
  agents.tsx      # animated AI-agent sessions (Claude Code, Codex, OpenCode)
  client.tsx      # interactive pieces (session demo, Tabs, copy button, scroll reveal, progress)
  theme.tsx       # theme provider + toggle
mdx-components.tsx  # global MDX element overrides
next.config.ts      # @next/mdx + remark/rehype plugins
```
