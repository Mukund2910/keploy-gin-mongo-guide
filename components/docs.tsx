/* Server components used inside the MDX tutorial. */

const callouts = {
  info: {
    box: "border-sky-200 bg-sky-50 dark:border-sky-900/60 dark:bg-sky-950/40",
    icon: "text-sky-600 dark:text-sky-400",
    title: "Note",
    path: "M12 16v-4M12 8h.01",
  },
  tip: {
    box: "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40",
    icon: "text-emerald-600 dark:text-emerald-400",
    title: "Tip",
    path: "M9 12l2 2 4-4",
  },
  warning: {
    box: "border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/40",
    icon: "text-amber-600 dark:text-amber-400",
    title: "Watch out",
    path: "M12 8v4M12 16h.01",
  },
  aha: {
    box: "border-violet-200 bg-violet-50 dark:border-violet-900/60 dark:bg-violet-950/40",
    icon: "text-violet-600 dark:text-violet-400",
    title: "Why this matters",
    path: "M12 7v5l3 2",
  },
} as const;

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof callouts;
  title?: string;
  children: React.ReactNode;
}) {
  const c = callouts[type];
  return (
    <aside
      className={`group my-8! flex gap-3 rounded-xl border p-4 text-[1.02rem] leading-relaxed transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 ${c.box}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`mt-1 size-5 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] ${c.icon}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d={c.path} />
      </svg>
      <div className="min-w-0 text-zinc-700 dark:text-zinc-300 [&_a]:text-accent [&_a]:underline [&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.84em] dark:[&_code]:bg-white/10 [&_p+p]:mt-2">
        <p className="mb-1 font-sans text-[0.92rem] font-semibold text-zinc-900 dark:text-zinc-100">{title ?? c.title}</p>
        {children}
      </div>
    </aside>
  );
}

/* A tutorial section: big numbered badge (or icon), title and a time estimate. Keeps each step visually separate. */
export function Section({
  n,
  icon,
  id,
  title,
  time,
  children,
}: {
  n?: number;
  icon?: string;
  id?: string;
  title: string;
  time?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="my-20! scroll-mt-24 first:mt-0!">
      <div className="mb-6 flex items-center gap-4">
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-2xl font-sans text-xl font-semibold transition-transform duration-300 hover:-rotate-6 hover:scale-105 ${
            n
              ? "bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/25"
              : "border border-rule bg-sunk text-2xl"
          }`}
          aria-hidden
        >
          {n ?? icon}
        </span>
        <div>
          <h2 className="text-[1.6rem]! leading-tight">{title}</h2>
          {time && <p className="mt-0.5 font-sans text-sm text-muted">{time}</p>}
        </div>
      </div>
      <div className="space-y-5 sm:pl-16 [&>figure]:my-5!">{children}</div>
    </section>
  );
}

/* Collapsible "go deeper" panel, so the main path stays short. */
export function Details({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-rule bg-panel transition-colors open:border-accent/40 hover:border-accent/40">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 font-sans text-[0.95rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
        <span className="grid size-5 place-items-center rounded-full bg-accent/10 text-xs text-accent transition-transform duration-300 group-open:rotate-90">
          ▶
        </span>
        {title}
      </summary>
      <div className="details-body space-y-4 border-t border-rule px-4 pb-4 pt-3 text-[1.02rem] [&_figure]:my-3!">{children}</div>
    </details>
  );
}

export function Pills({ items }: { items: string[] }) {
  return (
    <ul className="flex! list-none! flex-wrap gap-2 pl-0! font-sans text-sm">
      {items.map((item) => (
        <li
          key={item}
          className="mt-0! rounded-full border border-rule bg-panel px-3 py-1 text-ink transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/* The whole tutorial at a glance: one card per command. */
export function Glance({ steps }: { steps: { label: string; cmd: string }[] }) {
  return (
    <div className="my-12! rounded-2xl border border-rule bg-sunk/50 p-5 sm:p-6">
      <p className="mb-4 font-sans text-[0.95rem] font-semibold text-ink">The whole tutorial in {steps.length} commands</p>
      <ol className="grid! list-none! gap-3 pl-0! sm:grid-cols-2">
        {steps.map((s, i) => (
          <li
            key={s.cmd}
            className="group mt-0! flex gap-3 rounded-xl border border-rule bg-panel p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-orange-500/5"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent/10 font-sans text-sm font-semibold text-accent transition-colors group-hover:bg-accent group-hover:text-white">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="font-sans text-sm text-muted">{s.label}</p>
              <code className="mt-1 block truncate font-mono text-[0.8rem] text-ink" title={s.cmd}>
                {s.cmd}
              </code>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* End-of-tutorial checklist cards. */
export function Wins({ items }: { items: string[] }) {
  return (
    <ul className="grid! list-none! gap-3 pl-0! font-sans sm:grid-cols-3">
      {items.map((item) => (
        <li
          key={item}
          className="mt-0! rounded-xl border border-pass/30 bg-pass/5 p-4 text-[0.95rem] leading-snug text-ink transition-transform hover:-translate-y-1"
        >
          <span className="mb-2 grid size-7 place-items-center rounded-full bg-pass text-sm text-white">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function FileTree({ children }: { children: string }) {
  return (
    <pre className="my-6! overflow-x-auto rounded-xl border border-rule bg-sunk/60 px-5 py-4 font-mono text-[0.84rem] leading-6 text-ink transition-colors hover:border-accent/50">
      {children.trim()}
    </pre>
  );
}

/* Where Keploy sits in each mode. Red = recording, green = replay; the dashed box is the dependency you no longer need. */
export function RecordReplayDiagram() {
  return (
    <figure className="my-10! font-sans text-[0.85rem]">
      <div className="grid gap-4 sm:grid-cols-2">
        <Lane
          tone="rec"
          heading="keploy record"
          rows={[
            ["curl or a real client", "plain"],
            ["sends an HTTP request", "edge"],
            ["Keploy saves request + response as test-N.yaml", "keploy"],
            ["Gin app handles it", "plain"],
            ["queries the database", "edge"],
            ["Keploy saves query + reply in mocks.yaml", "keploy"],
            ["MongoDB", "plain"],
          ]}
        />
        <Lane
          tone="pass"
          heading="keploy test"
          rows={[
            ["Keploy reads test-N.yaml", "keploy"],
            ["sends the same request", "edge"],
            ["Gin app, running your new code", "plain"],
            ["queries the database", "edge"],
            ["Keploy answers from mocks.yaml", "keploy"],
            ["MongoDB is not needed", "gone"],
          ]}
        />
      </div>
      <figcaption className="mt-3 text-center font-serif text-[0.95rem] italic text-muted">
        Record once against the real database, then replay as often as you like without it.
      </figcaption>
    </figure>
  );
}

function Lane({
  tone,
  heading,
  rows,
}: {
  tone: "rec" | "pass";
  heading: string;
  rows: [string, "plain" | "edge" | "keploy" | "gone"][];
}) {
  const t =
    tone === "rec"
      ? { text: "text-rec", bar: "border-rec", bg: "bg-rec/8", dot: "bg-rec" }
      : { text: "text-pass", bar: "border-pass", bg: "bg-pass/8", dot: "bg-pass" };
  return (
    <div className="rounded-xl border border-rule bg-panel p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
      <p className={`mb-4 flex items-center gap-2 font-mono text-[0.85rem] font-medium ${t.text}`}>
        <span className={`size-2 rounded-full ${t.dot} ${tone === "rec" ? "rec-dot" : ""}`} />$ {heading}
      </p>
      <ol className="list-none! space-y-1.5 pl-0!">
        {rows.map(([text, kind], i) =>
          kind === "edge" ? (
            <li key={text} className="flex items-center gap-3 pl-4 text-muted">
              {/* A dot travels down the edge to show the direction of traffic */}
              <span className="relative h-5 w-px bg-rule">
                <span
                  className={`flow-dot absolute -left-[2.5px] top-0 size-1.5 rounded-full ${t.dot}`}
                  style={{ animationDelay: `${i * 0.25}s` }}
                />
              </span>
              {text}
            </li>
          ) : (
            <li
              key={text}
              className={
                kind === "keploy"
                  ? `rounded-r-md border-l-2 py-1 pl-3 font-medium ${t.bar} ${t.bg} ${t.text}`
                  : kind === "gone"
                    ? "rounded-md border border-dashed border-rule px-3 py-1 text-muted line-through"
                    : "rounded-md border border-rule px-3 py-1 text-ink"
              }
            >
              {text}
            </li>
          ),
        )}
      </ol>
    </div>
  );
}
