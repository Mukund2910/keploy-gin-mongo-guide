# Your First Keploy Tests in Go: Gin + MongoDB

A single-page, beginner-friendly tutorial that walks through Keploy's
[Gin + MongoDB quickstart](https://keploy.io/docs/quickstart/samples-gin/): record real API traffic,
inspect the generated YAML tests and mocks, replay them without a database, and catch a regression.

Built with **Next.js 16 (App Router) + MDX** and **Tailwind CSS v4**. Type is IBM Plex Sans / Plex Mono for UI and code,
with Source Serif 4 for the long-form body. Colour is semantic: red marks recording, green marks replay.

## Features

- An animated record-then-replay terminal session in the hero (respects `prefers-reduced-motion`)
- Tutorial content lives in [`app/page.mdx`](app/page.mdx), with Markdown and React components mixed together
- Syntax highlighting via `rehype-pretty-code` (Shiki) with dual light/dark themes, file titles and line highlights
- Custom MDX components: `<Callout>` (info / tip / warning / a-ha), `<Steps>`, `<Tabs>`, `<FileTree>`,
  and a record-vs-replay diagram
- Copy-to-clipboard on every code block
- Dark/light mode toggle (`next-themes`, follows the system by default)
- A contents rail that tracks how far through the tutorial you are, plus a reading progress bar
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
  docs.tsx        # server components used in MDX (Callout, Steps, FileTree, diagram)
  client.tsx      # interactive pieces (session demo, Tabs, copy button, contents rail, progress)
  theme.tsx       # theme provider + toggle
mdx-components.tsx  # global MDX element overrides
next.config.ts      # @next/mdx + remark/rehype plugins
```
