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

/* Numbered sub-steps. Numbers come from a CSS counter (see globals.css). */
export function Steps({ children }: { children: React.ReactNode }) {
  return <div className="steps my-8! ml-3.5 border-l border-rule pl-8">{children}</div>;
}

export function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="step relative pb-6 last:pb-0 [&>*+*]:mt-4">
      <h3 className="mt-0! text-[1.0625rem]!">{title}</h3>
      {children}
    </div>
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
