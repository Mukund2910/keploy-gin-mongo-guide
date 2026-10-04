"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion, useInView, useSlidingIndicator, WindowDots } from "./client";

/* Animated, simplified sessions showing an AI coding agent installing Keploy and running record/test.
   Each agent's transcript is styled after its own CLI, but none of them is a literal capture. */

type Line =
  | { t: "shell"; text: string } // user's own shell command
  | { t: "out"; text: string } // plain output
  | { t: "banner" } // agent's startup banner
  | { t: "prompt"; text: string } // what the user types to the agent (typed out)
  | { t: "think"; text: string } // agent narration
  | { t: "tool"; text: string } // agent runs a command
  | { t: "result"; text: string; tone?: "rec" | "pass" } // command result
  | { t: "ask"; text: string } // permission prompt
  | { t: "done"; text: string }; // agent's final message

type Agent = {
  id: string;
  name: string;
  install: string;
  launch: string;
  color: string; // accent used inside the terminal
  banner: React.ReactNode;
  toolPrefix: string;
  toolSuffix?: string;
  resultPrefix: string;
  promptPrefix: string;
  approve: string;
};

const AGENTS: Agent[] = [
  {
    id: "claude",
    name: "Claude Code",
    install: "npm install -g @anthropic-ai/claude-code",
    launch: "claude",
    color: "#e8875f",
    banner: (
      <div className="my-1 inline-block rounded-md border border-[#e8875f]/60 px-3 py-1">
        <span className="text-[#e8875f]">✻</span> Welcome to <b>Claude Code</b>
        <div className="text-white/45">cwd: ~/samples-go/gin-mongo</div>
      </div>
    ),
    toolPrefix: "● Bash(",
    toolSuffix: ")",
    resultPrefix: "  ⎿ ",
    promptPrefix: "> ",
    approve: "Do you want to proceed?  ❯ 1. Yes",
  },
  {
    id: "codex",
    name: "Codex CLI",
    install: "npm install -g @openai/codex",
    launch: "codex",
    color: "#9fb4ff",
    banner: (
      <div className="my-1 inline-block rounded-md border border-white/25 px-3 py-1">
        <span className="text-[#9fb4ff]">&gt;_</span> <b>OpenAI Codex</b>
        <div className="text-white/45">directory: ~/samples-go/gin-mongo</div>
      </div>
    ),
    toolPrefix: "• Ran",
    resultPrefix: "  └ ",
    promptPrefix: "› ",
    approve: "Allow command?  › Yes, run it",
  },
  {
    id: "opencode",
    name: "OpenCode",
    install: "curl -fsSL https://opencode.ai/install | bash",
    launch: "opencode",
    color: "#f5c46b",
    banner: (
      <div className="my-1 inline-block border-l-2 border-[#f5c46b] px-3 py-1">
        <b className="tracking-wide">opencode</b>
        <div className="text-white/45">build agent · ~/samples-go/gin-mongo</div>
      </div>
    ),
    toolPrefix: "$ bash",
    resultPrefix: "  │ ",
    promptPrefix: "┃ ",
    approve: "Permission required: bash  → Allow once",
  },
];

const PROMPT =
  "Install Keploy, record API tests for this Gin + Mongo app with docker compose, then replay them and tell me the result.";

const script = (a: Agent): Line[] => [
  { t: "shell", text: a.install },
  { t: "out", text: `installed ${a.name}` },
  { t: "shell", text: `cd samples-go/gin-mongo && ${a.launch}` },
  { t: "banner" },
  { t: "prompt", text: PROMPT },
  { t: "think", text: "I'll install the Keploy CLI first, then record with docker compose." },
  { t: "tool", text: "curl --silent -O -L https://keploy.io/install.sh && source install.sh" },
  { t: "ask", text: a.approve },
  { t: "result", text: "keploy installed" },
  { t: "tool", text: "docker network create keploy-network" },
  { t: "think", text: "Starting the recorder in the background so I can send it traffic." },
  { t: "tool", text: 'keploy record -c "docker compose up" --container-name ginMongoApp' },
  { t: "result", text: "recording on :8080", tone: "rec" },
  { t: "tool", text: "curl -X POST localhost:8080/url -d '{\"url\":\"https://google.com\"}'" },
  { t: "result", text: "captured test-1  POST /url  200", tone: "rec" },
  { t: "tool", text: "curl localhost:8080/Lhr4BWAi" },
  { t: "result", text: "captured test-2  GET /Lhr4BWAi  303", tone: "rec" },
  { t: "tool", text: 'keploy test -c "docker compose up" --container-name ginMongoApp --delay 10' },
  { t: "result", text: "2 passed, 0 failed", tone: "pass" },
  {
    t: "done",
    text: "Done. Keploy recorded 2 tests in keploy/test-set-0/ and both pass on replay with Mongo served from mocks.yaml. Commit the keploy/ folder to keep them.",
  },
];

const delayFor = (l: Line) => (l.t === "prompt" ? l.text.length * 22 + 500 : l.t === "ask" ? 1300 : l.t === "done" ? 400 : 750);

export function AgentDemo() {
  const [active, setActive] = useState(0);
  const [refs, box] = useSlidingIndicator(active);
  const [ref, inView] = useInView<HTMLDivElement>();
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState(0);
  const [run, setRun] = useState(0);

  const agent = AGENTS[active];
  const lines = script(agent);
  const done = shown >= lines.length;

  // Play the script once the demo is on screen; restart on tab change or replay.
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- show the finished transcript
      setShown(lines.length);
      setTyped(PROMPT.length);
      return;
    }
    setShown(0);
    setTyped(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let at = 400;
    lines.forEach((l, i) => {
      timers.push(setTimeout(() => setShown(i + 1), at));
      if (l.t === "prompt") {
        for (let c = 1; c <= l.text.length; c++) timers.push(setTimeout(() => setTyped(c), at + c * 22));
      }
      at += delayFor(l);
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- lines derive from `active`
  }, [inView, active, run]);

  return (
    <div ref={ref} className="my-10!">
      <div role="tablist" aria-label="AI coding agent" className="relative flex gap-6 border-b border-rule font-sans text-[0.95rem]">
        {AGENTS.map((a, i) => (
          <button
            key={a.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`flex items-center gap-2 pb-2 transition-colors ${active === i ? "font-medium text-ink" : "text-muted hover:text-ink"}`}
          >
            <span className="size-2 rounded-full transition-transform" style={{ background: a.color, transform: active === i ? "scale(1.3)" : undefined }} />
            {a.name}
          </button>
        ))}
        <span
          aria-hidden
          className="absolute -bottom-px h-0.5 rounded-full transition-all duration-300 ease-out"
          style={{ left: box.left, width: box.width, background: agent.color }}
        />
      </div>

      <figure
        key={agent.id}
        className="panel-in mt-5 overflow-hidden rounded-xl border border-white/10 bg-term font-mono text-[0.8rem] leading-6 text-term-ink shadow-2xl shadow-orange-950/10 dark:shadow-black/40"
      >
        <div className="flex items-center gap-4 border-b border-white/10 px-4 py-2.5 font-sans text-[0.8rem] text-white/60">
          <WindowDots />
          <span>
            {agent.name} <span className="text-white/35">· installing and running Keploy</span>
          </span>
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            disabled={!done}
            className="ml-auto rounded-md border border-white/15 px-2.5 py-0.5 text-white/70 transition hover:text-white disabled:invisible"
            style={{ borderColor: done ? agent.color : undefined }}
          >
            ↻ Play again
          </button>
        </div>

        <div className="h-[26rem] overflow-y-auto px-4 py-3 [scrollbar-width:thin]" aria-live="polite">
          {lines.slice(0, shown).map((l, i) => (
            <TranscriptLine key={`${run}-${i}`} line={l} agent={agent} typed={typed} />
          ))}
          {!done && <span className="caret inline-block h-4 w-2 translate-y-0.5" style={{ background: agent.color }} />}
          <AutoScroll dep={shown + typed} />
        </div>

        <figcaption className="border-t border-white/10 px-4 py-2 font-sans text-[0.78rem] text-white/50">
          Simplified for illustration. Real sessions show more output and ask before each command, depending on your
          permission settings.
        </figcaption>
      </figure>
    </div>
  );
}

function TranscriptLine({ line: l, agent, typed }: { line: Line; agent: Agent; typed: number }) {
  const base = "line-in -indent-4 whitespace-pre-wrap break-words pl-4";
  switch (l.t) {
    case "shell":
      return (
        <div className={base}>
          <span className="text-orange-400">$ </span>
          {l.text}
        </div>
      );
    case "out":
      return <div className={`${base} text-white/45`}>{l.text}</div>;
    case "banner":
      return <div className="line-in">{agent.banner}</div>;
    case "prompt":
      return (
        <div className="line-in my-2 rounded-md border border-white/15 bg-white/[0.03] px-3 py-1.5">
          <span style={{ color: agent.color }}>{agent.promptPrefix}</span>
          {l.text.slice(0, typed)}
          {typed < l.text.length && <span className="caret ml-px inline-block h-4 w-1.5 translate-y-0.5 bg-white/70" />}
        </div>
      );
    case "think":
      return <div className={`${base} italic text-white/60`}>{l.text}</div>;
    case "tool":
      return (
        <div className={`${base} mt-1.5`}>
          <span style={{ color: agent.color }}>{agent.toolPrefix}</span>
          {agent.toolSuffix ? "" : " "}
          <span className="text-white/90">{l.text}</span>
          <span style={{ color: agent.color }}>{agent.toolSuffix}</span>
        </div>
      );
    case "result":
      return (
        <div
          className={`${base} ${l.tone === "rec" ? "text-term-rec" : l.tone === "pass" ? "text-term-pass" : "text-white/55"}`}
        >
          {agent.resultPrefix}
          {l.text}
        </div>
      );
    case "ask":
      return (
        <div className="line-in my-1.5 rounded-md px-3 py-1 text-white/85" style={{ border: `1px dashed ${agent.color}` }}>
          {l.text}
        </div>
      );
    case "done":
      return (
        <div className="line-in mt-3 border-l-2 pl-3 font-sans text-[0.85rem] text-white/90" style={{ borderColor: agent.color }}>
          {l.text}
        </div>
      );
  }
}

/* Keeps the newest transcript line in view inside the fixed-height terminal. */
function AutoScroll({ dep }: { dep: number }) {
  const [el, setEl] = useState<HTMLSpanElement | null>(null);
  useEffect(() => {
    const box = el?.parentElement;
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }, [el, dep]);
  return <span ref={setEl} />;
}
