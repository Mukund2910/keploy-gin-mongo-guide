"use client";

import { Children, isValidElement, useEffect, useLayoutEffect, useRef, useState } from "react";

/* ---------- Shared terminal chrome ---------- */

export function WindowDots() {
  return (
    <span aria-hidden className="flex gap-1.5">
      <span className="size-2.5 rounded-full bg-[#ff5f57]" />
      <span className="size-2.5 rounded-full bg-[#febc2e]" />
      <span className="size-2.5 rounded-full bg-[#28c840]" />
    </span>
  );
}

/* True once the element has scrolled into view. */
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    if (prefersReducedMotion()) {
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
  const done = shown === SESSION.length;

  return (
    <figure
      className="my-10! overflow-hidden rounded-xl border border-white/10 bg-term font-mono text-[0.8rem] leading-6 text-term-ink shadow-2xl shadow-orange-950/10 dark:shadow-black/40"
      style={{ animation: "rise 0.8s 0.35s cubic-bezier(0.2,0.7,0.2,1) both" }}
    >
      <div className="flex items-center gap-4 border-b border-white/10 px-4 py-2.5 font-sans text-[0.8rem]">
        <WindowDots />
        <span key={mode} className="panel-in">
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
        </span>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          disabled={!done}
          className="ml-auto rounded-md border border-white/15 px-2.5 py-0.5 text-white/70 transition hover:border-orange-400 hover:text-orange-300 disabled:invisible"
        >
          ↻ Play again
        </button>
      </div>

      <div className="grid md:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="min-h-[19rem] px-4 py-3" aria-live="polite">
          {visible.map((e, i) => (
            <div key={`${run}-${i}`} className="line-in -indent-4 whitespace-pre-wrap break-words pl-4">
              {e.kind === "cmd" && (
                <>
                  <span className="text-orange-400">$ </span>
                  {e.text}
                </>
              )}
              {e.kind === "out" && <span className="text-white/55">{e.text}</span>}
              {e.kind === "rec" && <span className="text-term-rec">{e.text}</span>}
              {e.kind === "pass" && <span className="text-term-pass">{e.text}</span>}
            </div>
          ))}
          {!done && <span className="caret inline-block h-4 w-2 translate-y-0.5 bg-orange-400" />}
        </div>

        <div className="border-t border-white/10 px-4 py-3 md:border-l md:border-t-0">
          <p className="mb-1 font-sans text-white/50">Files Keploy wrote</p>
          <div className={files.length ? "" : "text-white/30"}>keploy/test-set-0/</div>
          {files.length > 0 && (
            <>
              <div className="pl-3 text-white/70">tests/</div>
              {files.map((f) => (
                <div
                  key={`${run}-${f}`}
                  className={`line-in pl-6 transition-colors duration-500 ${mode === "replay" ? "text-term-pass" : "text-term-rec"}`}
                >
                  {f}
                </div>
              ))}
              <div className={`line-in pl-3 transition-colors duration-500 ${mode === "replay" ? "text-term-pass" : "text-white/70"}`}>
                mocks.yaml{" "}
                <span className="text-white/40">
                  ({files.length} {files.length === 1 ? "call" : "calls"})
                </span>
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
        className={`absolute right-2 top-2 translate-y-1 rounded-md border px-2 py-0.5 font-sans text-xs opacity-0 transition-all duration-200 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 ${
          copied ? "border-pass bg-pass text-white" : "border-rule bg-panel text-muted hover:border-accent hover:text-accent"
        }`}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

/* ---------- Tabs with a sliding indicator ---------- */

export function useSlidingIndicator(active: number) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [box, setBox] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const el = refs.current[active];
    if (el) setBox({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);
  return [refs, box] as const;
}

export function Tabs({ labels, children }: { labels: string[]; children: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const panels = Children.toArray(children).filter(isValidElement);
  const [refs, box] = useSlidingIndicator(active);

  return (
    <div className="my-8!">
      <div role="tablist" className="relative flex gap-6 border-b border-rule font-sans text-[0.95rem]">
        {labels.map((label, i) => (
          <button
            key={label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`pb-2 transition-colors ${active === i ? "font-medium text-ink" : "text-muted hover:text-ink"}`}
          >
            {label}
          </button>
        ))}
        <span
          aria-hidden
          className="absolute -bottom-px h-0.5 rounded-full bg-accent transition-all duration-300 ease-out"
          style={{ left: box.left, width: box.width }}
        />
      </div>
      <div key={active} role="tabpanel" className="panel-in space-y-5 pt-5">
        {panels[active]}
      </div>
    </div>
  );
}

export function Tab({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
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
      className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-gradient-to-r from-orange-500 to-amber-400"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}

/* ---------- Scroll reveal for every block in the article ---------- */

export function Reveal() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Skip whatever is already on screen so nothing flashes on load.
    const els = Array.from(document.querySelectorAll<HTMLElement>("article.doc > *")).filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight,
    );
    els.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
