import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import { agentWork, type AgentWork } from "../content";
import { ease } from "../lib/hooks";
import { SectionHeading, TiltCard } from "../components/motion";

const STATUS: Record<AgentWork["status"], string> = {
  Shipped: "border-[#34d399]/40 bg-[#34d399]/10 text-[#6ee7b7]",
  "In use": "border-cyan/40 bg-cyan/10 text-cyan",
  Built: "border-amber/40 bg-amber/10 text-amber",
  Exploring: "border-iris/40 bg-iris/10 text-iris",
};

/* Orchestration diagram: stages connected by a line a pulse travels along.
   A "parallel" stage fans out into lanes, one per agent. */
function Flow({ work }: { work: AgentWork }) {
  const reduced = useReducedMotion();
  const n = work.flow.length;
  return (
    <div className="relative">
      <ol className="relative grid gap-3 sm:gap-0" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        <span aria-hidden className="absolute left-[8%] right-[8%] top-[22px] hidden h-px bg-white/10 sm:block" />
        {!reduced && (
          <motion.span
            aria-hidden
            key={work.id}
            className="absolute top-[19px] hidden size-[7px] rounded-full bg-cyan shadow-[0_0_14px_rgba(94,234,212,0.9)] sm:block"
            initial={{ left: "8%" }}
            animate={{ left: ["8%", "92%"] }}
            transition={{ duration: n * 0.55, repeat: Infinity, ease: "linear", repeatDelay: 0.4 }}
          />
        )}
        {work.flow.map((stage, i) => {
          const parallel = /parallel/i.test(stage);
          const lanes = parallel ? parseInt(stage, 10) || 4 : 0;
          return (
            <motion.li
              key={stage}
              className="relative flex flex-col items-center text-center max-sm:flex-row max-sm:gap-3 max-sm:text-left"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: i * 0.07 }}
            >
              <span className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-2xl border font-mono text-[11px] ${parallel ? "border-cyan/50 bg-cyan/10 text-cyan" : "border-white/12 bg-[#0d0f18] text-mist"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-2.5 px-1 text-[12px] leading-tight text-ink/85 max-sm:mt-0">{stage}</span>
              {parallel && (
                <span aria-hidden className="mt-2 flex gap-[3px] max-sm:ml-auto max-sm:mt-0">
                  {Array.from({ length: lanes }).map((_, k) => (
                    <motion.span
                      key={k}
                      className="h-5 w-[5px] rounded-full bg-gradient-to-t from-iris/30 to-cyan"
                      animate={reduced ? {} : { scaleY: [0.35, 1, 0.5, 0.9, 0.35] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: k * 0.12, ease: "easeInOut" }}
                      style={{ originY: 1 }}
                    />
                  ))}
                </span>
              )}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const num = /^\d+$/.test(value) ? parseInt(value, 10) : null;
  const [shown, setShown] = useState(num === null || reduced ? value : "0");
  useEffect(() => {
    if (num === null || reduced || !inView) { setShown(value); return; }
    const c = animate(0, num, { duration: 1.1, ease: [0.16, 1, 0.3, 1], onUpdate: v => setShown(String(Math.round(v))) });
    return () => c.stop();
  }, [num, value, reduced, inView]);
  return <span ref={ref}>{shown}</span>;
}

function Terminal({ work }: { work: AgentWork }) {
  const reduced = useReducedMotion();
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/45 font-mono text-[12px] leading-relaxed">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="size-2 rounded-full bg-[#f87171]/70" /><span className="size-2 rounded-full bg-amber/70" /><span className="size-2 rounded-full bg-[#34d399]/70" />
        <span className="ml-2 text-[11px] text-dim">claude-code · {work.type.toLowerCase()}</span>
      </div>
      <div className="space-y-1 p-4">
        {work.log.map((line, i) => (
          <motion.p
            key={line}
            className={line.startsWith(">") ? "text-cyan" : line.startsWith("✗") ? "text-orchid" : line.startsWith("✓") || /Submitted|pushed/.test(line) ? "text-[#6ee7b7]" : "text-mist"}
            initial={reduced ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: reduced ? 0 : 0.25 + i * 0.32 }}
          >
            {line}
          </motion.p>
        ))}
        {!reduced && <motion.span className="inline-block h-3.5 w-1.5 bg-cyan align-middle" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />}
      </div>
    </div>
  );
}

export function AIAgents() {
  const [activeId, setActiveId] = useState(agentWork[0].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = agentWork.findIndex(a => a.id === activeId);
  const work = agentWork[idx];

  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key as string];
    let next = step ? (idx + step + agentWork.length) % agentWork.length : e.key === "Home" ? 0 : e.key === "End" ? agentWork.length - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    setActiveId(agentWork[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <section id="agents" className="section-pad relative overflow-hidden py-32 outline-none md:py-44" aria-labelledby="agents-title">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 size-[60vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div id="agents-title">
          <SectionHeading index="03" kicker="AI agents & automation" title="Agents that build, test" accent="and troubleshoot." sub="How I use Claude Code day to day — real agent workflows, each with an honest status." />
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.6fr)]">
          <div role="tablist" aria-label="Agent work" aria-orientation="vertical" className="grid content-start gap-2 sm:grid-cols-2 lg:grid-cols-1" onKeyDown={onKey}>
            {agentWork.map((a, i) => {
              const on = a.id === activeId;
              return (
                <button
                  key={a.id}
                  ref={el => { tabs.current[i] = el; }}
                  role="tab"
                  id={`agent-tab-${a.id}`}
                  aria-selected={on}
                  aria-controls="agent-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActiveId(a.id)}
                  data-cursor="hover"
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-colors duration-300 ${on ? "border-cyan/40" : "border-white/[0.08] hover:border-white/20"}`}
                >
                  {on && <motion.span layoutId="agent-bg" className="absolute inset-0 bg-gradient-to-br from-cyan/[0.11] via-iris/[0.06] to-transparent" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                  <span className="relative flex items-start justify-between gap-3">
                    <span>
                      <span className="block font-mono text-[10.5px] uppercase tracking-[0.16em] text-dim">{a.type}</span>
                      <span className={`mt-1 block text-[15.5px] font-medium ${on ? "text-white" : "text-mist group-hover:text-white"}`}>{a.title}</span>
                    </span>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] ${STATUS[a.status]}`}>{a.status}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div id="agent-panel" role="tabpanel" aria-labelledby={`agent-tab-${activeId}`}>
            <TiltCard max={4} className="glass-strong overflow-hidden rounded-[28px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={work.id}
                  className="grid gap-7 p-6 sm:p-8"
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.3, ease }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-xl">
                      <h3 className="text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-tight tracking-[-0.025em]">{work.title}</h3>
                      <p className="mt-3 text-[15.5px] leading-relaxed text-mist">{work.summary}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-[12px] ${STATUS[work.status]}`}>{work.status}</span>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-black/25 p-5">
                    <p className="eyebrow mb-5">Workflow</p>
                    <Flow work={work} />
                  </div>

                  <div className="grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className="grid content-start gap-3">
                      <div className="grid grid-cols-3 gap-3">
                        {work.facts.map(f => (
                          <div key={f.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                            <p className="text-[clamp(1.2rem,2vw,1.7rem)] font-semibold tracking-tight"><CountUp value={f.value} /></p>
                            <p className="mt-1 text-[11.5px] leading-snug text-dim">{f.label}</p>
                          </div>
                        ))}
                      </div>
                      <ul className="flex flex-wrap gap-2">{work.tools.map(t => <li key={t} className="chip">{t}</li>)}</ul>
                    </div>
                    <Terminal work={work} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
