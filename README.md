# Your First Keploy Tests in Go: Gin + MongoDB

A single-page, beginner-friendly tutorial that walks through Keploy's
[Gin + MongoDB quickstart](https://keploy.io/docs/quickstart/samples-gin/): record real API traffic,
inspect the generated YAML tests and mocks, replay them without a database, and catch a regression.

Built with **Next.js 16 (App Router) + MDX**, styled with **Tailwind CSS v4** and `@tailwindcss/typography`.

## Features

- Tutorial content lives in [`app/page.mdx`](app/page.mdx), with Markdown and React components mixed together
- Syntax highlighting via `rehype-pretty-code` (Shiki) with dual light/dark themes, file titles and line highlights
- Custom MDX components: `<Callout>` (info / tip / warning / a-ha), `<Steps>`, `<Tabs>`, `<FileTree>`,
  `<Cards>` and a record-vs-replay diagram
- Copy-to-clipboard on every code block
- Dark/light mode toggle (`next-themes`, follows the system by default)
- Sticky table of contents with scroll-spy, and a reading progress bar
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
  docs.tsx        # server components used in MDX (Callout, Steps, Cards, diagram...)
  client.tsx      # interactive pieces (Tabs, copy button, TOC, progress bar)
  theme.tsx       # theme provider + toggle
mdx-components.tsx  # global MDX element overrides
next.config.ts      # @next/mdx + remark/rehype plugins
```
