"use client";

import { Children, isValidElement, useEffect, useRef, useState } from "react";

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
        aria-label="Copy code"
        className="absolute right-2 top-2 rounded-md border border-zinc-200 bg-white/90 px-2 py-1 text-xs font-medium text-zinc-600 opacity-0 transition group-hover:opacity-100 focus:opacity-100 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

/* ---------- Tabs ---------- */

export function Tabs({ labels, children }: { labels: string[]; children: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const panels = Children.toArray(children).filter(isValidElement);

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div role="tablist" className="flex gap-1 border-b border-zinc-200 bg-zinc-50 px-2 dark:border-zinc-800 dark:bg-zinc-900/60">
        {labels.map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition ${
              active === i
                ? "border-orange-500 text-orange-600 dark:text-orange-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="prose prose-zinc max-w-none px-5 py-3 dark:prose-invert">
        {panels[active]}
      </div>
    </div>
  );
}

export function Tab({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/* ---------- Table of contents with scroll-spy ---------- */

export function Toc() {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>("article h2[id]"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- headings only exist after render
    setItems(headings.map((h) => ({ id: h.id, text: h.textContent ?? "" })));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-semibold text-zinc-900 dark:text-zinc-100">On this page</p>
      <ul className="space-y-1 border-l border-zinc-200 dark:border-zinc-800">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`-ml-px block border-l-2 py-1 pl-3 transition ${
                active === item.id
                  ? "border-orange-500 font-medium text-orange-600 dark:text-orange-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- Reading progress bar ---------- */

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
      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-orange-500 to-amber-400"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
