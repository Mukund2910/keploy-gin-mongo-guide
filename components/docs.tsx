/* Server components used inside the MDX tutorial. */

const callouts = {
  info: { bar: "border-go", label: "text-go", title: "Note" },
  tip: { bar: "border-pass", label: "text-pass", title: "Tip" },
  warning: { bar: "border-warn", label: "text-warn", title: "Watch out" },
  aha: { bar: "border-ink", label: "text-ink", title: "Why this matters" },
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
      className={`my-8! border-l-[3px] bg-sunk/60 py-3.5 pl-5 pr-5 text-[1.02rem] leading-relaxed ${c.bar} [&_code]:font-mono [&_code]:text-[0.84em] [&_p+p]:mt-2`}
    >
      <p className={`mb-1 font-sans text-[0.9rem] font-semibold ${c.label}`}>{title ?? c.title}</p>
      <div className="[&_a]:text-go [&_a]:underline">{children}</div>
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
    <pre className="my-6! overflow-x-auto rounded-md border border-rule bg-panel px-5 py-4 font-mono text-[0.84rem] leading-6 text-ink">
      {children.trim()}
    </pre>
  );
}

/* Where Keploy sits in each mode. Red = recording, green = replay; the dashed box is the dependency you no longer need. */
export function RecordReplayDiagram() {
  return (
    <figure className="my-10! font-sans text-[0.85rem]">
      <div className="grid gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-2">
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
      <figcaption className="mt-3 font-serif text-[0.95rem] italic text-muted">
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
  const accent = tone === "rec" ? "border-rec text-rec" : "border-pass text-pass";
  return (
    <div className="bg-panel p-5">
      <p className={`mb-4 font-mono text-[0.85rem] font-medium ${accent.split(" ")[1]}`}>$ {heading}</p>
      <ol className="list-none! space-y-1.5 pl-0!">
        {rows.map(([text, kind]) => (
          <li
            key={text}
            className={
              kind === "edge"
                ? "pl-4 text-muted before:mr-2 before:content-['↓']"
                : kind === "keploy"
                  ? `border-l-2 py-1 pl-3 font-medium ${accent}`
                  : kind === "gone"
                    ? "rounded border border-dashed border-rule px-3 py-1 text-muted line-through"
                    : "rounded border border-rule px-3 py-1 text-ink"
            }
          >
            {text}
          </li>
        ))}
      </ol>
    </div>
  );
}
