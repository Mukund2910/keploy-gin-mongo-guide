"use client";

import { Children, isValidElement, useEffect, useRef, useState } from "react";

/* ---------- Hero: a simplified record-then-replay session ---------- */

type Event = {
  at: number;
  kind: "cmd" | "out" | "rec" | "pass";
  text: string;
  mode?: "rec" | "idle" | "replay";
  file?: string;
};

const SESSION: Event[] = [
  { at: 300, kind: "cmd", text: 'keploy record -c "docker compose up" --container-name ginMongoApp', mode: "rec" },
  { at: 1300, kind: "out", text: "recording, waiting for traffic on :8080" },
  { at: 2300, kind: "cmd", text: "curl -X POST localhost:8080/url -d '{\"url\":\"https://google.com\"}'" },
  { at: 3200, kind: "rec", text: "captured test-1   POST /url          200", file: "test-1.yaml" },
  { at: 4200, kind: "cmd", text: "curl localhost:8080/Lhr4BWAi" },
  { at: 5100, kind: "rec", text: "captured test-2   GET  /Lhr4BWAi     303", file: "test-2.yaml" },
  { at: 6100, kind: "out", text: "^C recording stopped", mode: "idle" },
  { at: 7200, kind: "cmd", text: 'keploy test -c "docker compose up" --delay 10', mode: "replay" },
  { at: 8300, kind: "pass", text: "✓ test-1   POST /url          200" },
  { at: 8900, kind: "pass", text: "✓ test-2   GET  /Lhr4BWAi     303" },
  { at: 9800, kind: "out", text: "2 passed, 0 failed. Mongo replies came from mocks.yaml", mode: "idle" },
];

export function SessionDemo() {
  const [shown, setShown] = useState(1);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- skip the animation entirely
      setShown(SESSION.length);
      return;
    }
    setShown(0);
    const timers = SESSION.map((e, i) => setTimeout(() => setShown(i + 1), e.at));
    return () => timers.forEach(clearTimeout);
  }, [run]);

  const visible = SESSION.slice(0, shown);
  const mode = visible.findLast((e) => e.mode)?.mode ?? "idle";
  const files = visible.flatMap((e) => (e.file ? [e.file] : []));
  const mongoCalls = files.length;
  const done = shown === SESSION.length;

  return (
    <figure className="my-10! overflow-hidden rounded-lg bg-term font-mono text-[0.8rem] leading-6 text-term-ink shadow-[0_1px_0_var(--rule)]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5 font-sans text-[0.8rem]">
        {mode === "rec" && (
          <span className="flex items-center gap-2 text-term-rec">
            <span className="rec-dot size-2 rounded-full bg-term-rec" /> Recording
          </span>
        )}
        {mode === "replay" && (
          <span className="flex items-center gap-2 text-term-pass">
            <span className="size-0 border-y-4 border-l-[7px] border-y-transparent border-l-term-pass" /> Replaying
          </span>
        )}
        {mode === "idle" && <span className="text-white/50">{done ? "Session finished" : "Idle"}</span>}
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          disabled={!done}
          className="ml-auto rounded px-2 py-0.5 text-white/60 transition-colors hover:text-white disabled:invisible"
        >
          Play again
        </button>
      </div>

      <div className="grid md:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="min-h-[19rem] px-4 py-3" aria-live="polite">
          {visible.map((e, i) => (
            <div key={`${run}-${i}`} className="line-in whitespace-pre-wrap break-words pl-4 -indent-4">
              {e.kind === "cmd" && (
                <>
                  <span className="text-white/40">$ </span>
                  {e.text}
                </>
              )}
              {e.kind === "out" && <span className="text-white/55">{e.text}</span>}
              {e.kind === "rec" && <span className="text-term-rec">{e.text}</span>}
              {e.kind === "pass" && <span className="text-term-pass">{e.text}</span>}
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 px-4 py-3 md:border-l md:border-t-0">
          <p className="mb-1 font-sans text-white/50">Files Keploy wrote</p>
          <div className={files.length ? "" : "text-white/30"}>keploy/test-set-0/</div>
          {files.length > 0 && (
            <>
              <div className="pl-3 text-white/70">tests/</div>
              {files.map((f) => (
                <div key={`${run}-${f}`} className={`line-in pl-6 ${mode === "replay" ? "text-term-pass" : "text-term-rec"}`}>
                  {f}
                </div>
              ))}
              <div className={`line-in pl-3 ${mode === "replay" ? "text-term-pass" : "text-white/70"}`}>
                mocks.yaml <span className="text-white/40">({mongoCalls} {mongoCalls === 1 ? "call" : "calls"})</span>
              </div>
            </>
          )}
        </div>
      </div>
      <figcaption className="border-t border-white/10 px-4 py-2 font-sans text-[0.78rem] text-white/50">
        A simplified session. Your real terminal output will be more verbose.
      </figcaption>
    </figure>
  );
}

/* ---------- Code block with copy button (replaces MDX <pre>) ---------- */

export function Pre(props: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(ref.current?.innerText.trimEnd() ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group relative">
      <pre ref={ref} {...props} />
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 rounded border border-rule bg-panel px-2 py-0.5 font-sans text-xs text-muted opacity-0 transition-opacity hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/* ---------- Tabs ---------- */

export function Tabs({ labels, children }: { labels: string[]; children: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const panels = Children.toArray(children).filter(isValidElement);

  return (
    <div className="my-8!">
      <div role="tablist" className="flex gap-6 border-b border-rule font-sans text-[0.95rem]">
        {labels.map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 pb-2 transition-colors ${
              active === i ? "border-go font-medium text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="space-y-5 pt-5">
        {panels[active]}
      </div>
    </div>
  );
}

export function Tab({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/* ---------- Contents rail with scroll-spy ---------- */

export function Toc() {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>("article h2[id]"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- headings only exist after render
    setItems(headings.map((h) => ({ id: h.id, text: h.textContent ?? "" })));

    // The active section is the last heading that has scrolled past the top third of the viewport.
    const onScroll = () => {
      const line = window.innerHeight / 3;
      let idx = -1;
      headings.forEach((h, i) => {
        if (h.getBoundingClientRect().top < line) idx = i;
      });
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav aria-label="Contents" className="text-[0.85rem] leading-snug">
      <p className="mb-4 font-medium text-ink">Contents</p>
      <ol className="relative space-y-3 before:absolute before:bottom-1.5 before:left-[4.5px] before:top-1.5 before:w-px before:bg-rule">
        {items.map((item, i) => {
          const state = i < active ? "done" : i === active ? "active" : "todo";
          return (
            <li key={item.id} className="relative pl-5">
              <span
                aria-hidden
                className={`absolute left-0 top-[0.3rem] size-2.5 rounded-full border-[1.5px] ${
                  state === "done" ? "border-muted bg-muted" : state === "active" ? "border-go bg-go" : "border-rule bg-paper"
                }`}
              />
              <a
                href={`#${item.id}`}
                aria-current={state === "active" ? "location" : undefined}
                className={`block transition-colors ${state === "active" ? "font-medium text-ink" : "text-muted hover:text-ink"}`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- Reading progress ---------- */

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-go"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
