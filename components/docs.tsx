/* Server components used inside the MDX tutorial. */

const calloutStyles = {
  info: {
    box: "border-sky-200 bg-sky-50 dark:border-sky-900/60 dark:bg-sky-950/40",
    icon: "text-sky-600 dark:text-sky-400",
    title: "Info",
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
    title: "Heads up",
    path: "M12 8v4M12 16h.01",
  },
  aha: {
    box: "border-violet-200 bg-violet-50 dark:border-violet-900/60 dark:bg-violet-950/40",
    icon: "text-violet-600 dark:text-violet-400",
    title: "A-ha moment",
    path: "M12 7v5l3 2",
  },
} as const;

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof calloutStyles;
  title?: string;
  children: React.ReactNode;
}) {
  const s = calloutStyles[type];
  return (
    <aside className={`not-prose my-6 flex gap-3 rounded-xl border p-4 ${s.box}`}>
      <svg viewBox="0 0 24 24" className={`mt-0.5 size-5 shrink-0 ${s.icon}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d={s.path} />
      </svg>
      <div className="min-w-0 text-[0.94rem] leading-relaxed text-zinc-700 dark:text-zinc-300 [&_a]:font-medium [&_a]:underline [&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] dark:[&_code]:bg-white/10 [&_p+p]:mt-2">
        <p className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">{title ?? s.title}</p>
        {children}
      </div>
    </aside>
  );
}

/* Numbered vertical steps. Numbering comes from a CSS counter (see globals.css). */
export function Steps({ children }: { children: React.ReactNode }) {
  return <div className="steps my-6 ml-4 border-l border-zinc-200 pl-8 dark:border-zinc-800">{children}</div>;
}

export function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="step relative pb-2">
      <h3 className="mt-0!">{title}</h3>
      {children}
    </div>
  );
}

export function FileTree({ children }: { children: string }) {
  return (
    <pre className="not-prose my-6 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
      {children.trim()}
    </pre>
  );
}

export function Cards({ children }: { children: React.ReactNode }) {
  return <div className="not-prose my-6 grid gap-4 sm:grid-cols-3">{children}</div>;
}

export function Card({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4 transition hover:border-orange-300 hover:shadow-sm dark:border-zinc-800 dark:hover:border-orange-800">
      <div className="mb-2 text-2xl" aria-hidden>
        {icon}
      </div>
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{children}</p>
    </div>
  );
}

/* Record vs. replay diagram: what Keploy sits between in each mode. */
export function RecordReplayDiagram() {
  const box = "rounded-lg border px-3 py-2 text-center text-sm font-medium";
  const neutral = `${box} border-zinc-300 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200`;
  const keploy = `${box} border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-300`;
  const faded = `${box} border-dashed border-zinc-300 text-zinc-400 line-through dark:border-zinc-700 dark:text-zinc-600`;
  const arrow = "text-zinc-400 dark:text-zinc-600";

  return (
    <figure className="not-prose my-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">1 · keploy record</p>
        <div className="flex flex-col items-stretch gap-2">
          <div className={neutral}>curl / Postman</div>
          <div className={`text-center ${arrow}`}>↓ HTTP request</div>
          <div className={keploy}>Keploy captures request → test-N.yaml</div>
          <div className={`text-center ${arrow}`}>↓</div>
          <div className={neutral}>Gin app</div>
          <div className={`text-center ${arrow}`}>↓ Mongo query</div>
          <div className={keploy}>Keploy captures query + reply → mocks.yaml</div>
          <div className={`text-center ${arrow}`}>↓</div>
          <div className={neutral}>Real MongoDB</div>
        </div>
      </div>
      <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">2 · keploy test</p>
        <div className="flex flex-col items-stretch gap-2">
          <div className={keploy}>Keploy replays test-N.yaml</div>
          <div className={`text-center ${arrow}`}>↓ same HTTP request</div>
          <div className={neutral}>Gin app (your new code)</div>
          <div className={`text-center ${arrow}`}>↓ Mongo query</div>
          <div className={keploy}>Keploy answers from mocks.yaml</div>
          <div className={`text-center ${arrow}`}>↓</div>
          <div className={faded}>Real MongoDB (not needed)</div>
        </div>
      </div>
      <figcaption className="text-center text-sm text-zinc-500 md:col-span-2 dark:text-zinc-400">
        Record once against real dependencies, then replay as often as you like without them.
      </figcaption>
    </figure>
  );
}
