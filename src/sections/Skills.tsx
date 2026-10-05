import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { skills, type SkillId } from "../content";
import { setUi, useUi } from "../lib/store";
import { ease } from "../lib/hooks";
import { SectionHeading } from "../components/motion";

/* A small animated diagram per skill — the "visual state" that changes with the selection. */
function SkillVisual({ id }: { id: SkillId }) {
  const reduced = useReducedMotion();
  const loop = (d = 2.4) => (reduced ? {} : { repeat: Infinity, duration: d, ease: "easeInOut" as const });
  switch (id) {
    case "ai":
      return (
        <div className="space-y-2 font-mono text-[12px]">
          <p className="text-cyan">&gt; claude code</p>
          {["Read the brief", "Plan the workflow", "Build + test", "Summarise honestly"].map((l, i) => (
            <motion.p key={l} className="text-mist" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.18, ease }}>
              <span className="text-dim">{String(i + 1).padStart(2, "0")}</span> {l}
            </motion.p>
          ))}
          <motion.span className="inline-block h-3.5 w-1.5 bg-cyan align-middle" animate={reduced ? {} : { opacity: [1, 0, 1] }} transition={loop(1)} />
        </div>
      );
    case "ghl":
      return (
        <div className="grid grid-cols-4 gap-2">
          {["New Lead", "Responded", "Booked", "Attended"].map((c, i) => (
            <div key={c} className="rounded-lg bg-ink/[0.025] p-2">
              <p className="truncate text-[10.5px] text-mist">{c}</p>
              {Array.from({ length: 3 - Math.min(i, 2) }).map((_, k) => <div key={k} className="mt-1.5 h-4 rounded bg-ink/[0.045]" />)}
              {i === 1 && <motion.div className="mt-1.5 h-4 rounded border border-iris/60 bg-iris/25" animate={reduced ? {} : { x: [0, 0, 70, 70], opacity: [1, 1, 0, 0] }} transition={loop(3)} />}
            </div>
          ))}
        </div>
      );
    case "meta":
      return (
        <div className="grid grid-cols-[1fr_auto] items-center gap-4">
          <div className="rounded-xl border border-ink/[0.09] bg-ink/[0.025] p-3">
            <p className="text-[11px] text-mist">Lead form</p>
            {["Name", "Phone", "Email"].map(f => <div key={f} className="mt-2 rounded-md border border-ink/[0.09] px-2 py-1 text-[10.5px] text-dim">{f}</div>)}
            <div className="mt-2 rounded-md bg-orchid/70 py-1 text-center text-[10.5px] text-void">Submit</div>
          </div>
          <div className="flex flex-col items-center gap-2 text-[10.5px] text-mist">
            {["Pixel", "CAPI"].map((s, i) => (
              <motion.span key={s} className="rounded-full border border-orchid/40 px-2.5 py-1" animate={reduced ? {} : { boxShadow: ["0 0 0 rgba(192,38,211,0)", "0 0 18px rgba(192,38,211,0.35)", "0 0 0 rgba(192,38,211,0)"] }} transition={{ ...loop(2), delay: i * 0.6 }}>{s}</motion.span>
            ))}
          </div>
        </div>
      );
    case "google":
      return (
        <div className="space-y-2.5">
          <div className="rounded-full border border-ink/[0.09] px-3 py-1.5 text-[11.5px] text-mist">epoxy floor coating near me</div>
          <div className="rounded-xl border border-sky/30 bg-sky/[0.06] p-3">
            <p className="text-[10px] font-semibold text-sky">Sponsored</p>
            <div className="mt-1.5 h-2 w-3/4 rounded bg-ink/35" /><div className="mt-1.5 h-1.5 w-full rounded bg-ink/[0.09]" />
          </div>
          {[0, 1].map(i => <div key={i} className="px-3"><div className="h-2 w-2/3 rounded bg-ink/[0.12]" /><div className="mt-1.5 h-1.5 w-full rounded bg-ink/[0.07]" /></div>)}
        </div>
      );
    case "seo":
      return (
        <div className="grid grid-cols-[1fr_1fr] gap-3">
          <div className="relative h-28 overflow-hidden rounded-xl bg-[linear-gradient(135deg,rgba(94,234,212,0.12),rgba(129,140,248,0.08))]">
            {[[30, 40], [62, 28], [48, 66]].map(([x, y], i) => (
              <motion.span key={i} className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan bg-void" style={{ left: `${x}%`, top: `${y}%` }} animate={reduced ? {} : { y: [0, -4, 0] }} transition={{ ...loop(1.8), delay: i * 0.3 }} />
            ))}
            <p className="absolute bottom-2 left-2 text-[10px] text-mist">Google Business Profile</p>
          </div>
          <div className="space-y-2 text-[11px] text-mist">
            {["On-page", "Local", "Technical", "Reporting"].map((l, i) => (
              <div key={l}><p>{l}</p><motion.div className="mt-1 h-1.5 rounded-full bg-gradient-to-r from-cyan to-iris" initial={{ width: 0 }} animate={{ width: `${55 + i * 10}%` }} transition={{ duration: 0.9, delay: i * 0.1, ease }} /></div>
            ))}
          </div>
        </div>
      );
    case "funnels":
      return (
        <div className="flex items-center gap-2">
          {["Landing", "Form", "Thank-you", "CRM"].map((p, i) => (
            <div key={p} className="flex flex-1 items-center gap-2">
              <motion.div className="flex-1 rounded-lg border border-ink/[0.09] bg-ink/[0.025] p-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, ease }}>
                <div className="h-1.5 w-2/3 rounded bg-ink/25" /><div className="mt-1.5 h-6 rounded bg-ink/[0.045]" />
                <p className="mt-1.5 truncate text-[10px] text-mist">{p}</p>
              </motion.div>
              {i < 3 && <span className="text-dim">→</span>}
            </div>
          ))}
        </div>
      );
    case "crm":
      return (
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 text-[11px]">
          <div className="space-y-1.5">{["Google Ads", "Meta Ads", "GBP", "Call"].map(s => <span key={s} className="block rounded-full border border-ink/[0.09] px-2.5 py-1 text-mist">{s}</span>)}</div>
          <div className="relative h-px bg-gradient-to-r from-sky/20 to-cyan">
            <motion.span className="absolute -top-1 size-2 rounded-full bg-cyan" animate={reduced ? {} : { left: ["0%", "100%"] }} transition={loop(1.6)} />
          </div>
          <div className="rounded-xl border border-cyan/30 bg-cyan/[0.06] p-3">
            <p className="text-[10px] text-dim">First Attribution Source</p>
            <p className="mt-0.5 font-medium text-ink">source tag ✓</p>
          </div>
        </div>
      );
    case "web":
      return (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5 rounded-xl bg-ink/[0.03] p-3 font-mono text-[10.5px]">
            <p><span className="text-orchid">&lt;section</span> <span className="text-sky">class</span>=<span className="text-cyan">"hero"</span><span className="text-orchid">&gt;</span></p>
            <p className="pl-3 text-mist">&lt;h1&gt;…&lt;/h1&gt;</p>
            <p className="pl-3 text-mist">&lt;Form /&gt;</p>
            <p className="text-orchid">&lt;/section&gt;</p>
          </div>
          <div className="rounded-xl border border-ink/[0.09] p-2">
            <div className="flex gap-1"><span className="size-1.5 rounded-full bg-ink/[0.12]" /><span className="size-1.5 rounded-full bg-ink/[0.12]" /></div>
            <motion.div className="mt-2 h-2 rounded bg-ink/25" initial={{ width: "20%" }} animate={{ width: "70%" }} transition={{ duration: 0.8, ease }} />
            <div className="mt-1.5 h-1.5 w-full rounded bg-ink/[0.09]" />
            <div className="mt-2 h-4 w-1/2 rounded bg-iris/60" />
          </div>
        </div>
      );
  }
}

export function Skills() {
  const active = useUi(s => s.activeSkill);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const skill = skills.find(s => s.id === active)!;
  const idx = skills.findIndex(s => s.id === active);

  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = -1;
    if (e.key in keys) next = (idx + keys[e.key] + skills.length) % skills.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = skills.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setUi({ activeSkill: skills[next].id });
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="skills" className="section-pad relative min-h-[100svh] py-32 outline-none md:py-40" aria-labelledby="skills-title">
      <div className="mx-auto max-w-7xl">
        <div id="skills-title">
          <SectionHeading index="02" kicker="Expertise" title="Eight disciplines," accent="one connected system." sub="Pick a skill — the constellation turns to it. Each node is a part of the system, wired to its neighbours." />
        </div>

        {/* on phones the 3D constellation sits above this block */}
        <div className="mt-14 grid gap-6 pt-[46vh] md:pt-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
          <div className="grid gap-6 lg:max-w-xl">
            <div role="tablist" aria-label="Skills" aria-orientation="vertical" className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2" onKeyDown={onKey}>
              {skills.map((s, i) => {
                const on = s.id === active;
                return (
                  <button
                    key={s.id}
                    ref={el => { tabRefs.current[i] = el; }}
                    role="tab"
                    id={`tab-${s.id}`}
                    aria-selected={on}
                    aria-controls="skill-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setUi({ activeSkill: s.id })}
                    data-cursor="hover"
                    className={`group relative overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-colors duration-300 ${on ? "border-cyan/40 text-ink" : "border-ink/[0.09] text-mist hover:border-ink/15 hover:text-ink"}`}
                  >
                    {on && <motion.span layoutId="skill-bg" className="absolute inset-0 bg-gradient-to-br from-cyan/[0.12] to-iris/[0.08]" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                    <span className="relative flex items-center justify-between gap-2">
                      <span className="text-[14.5px] font-medium">{s.name}</span>
                      <span className="font-mono text-[10px] text-dim">0{i + 1}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div id="skill-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="glass-strong relative min-h-[380px] overflow-hidden rounded-3xl p-7">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 18, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(6px)" }} transition={{ duration: 0.3, ease }}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-2xl font-semibold tracking-tight">{skill.name}</h3>
                    <span className="font-mono text-xs text-cyan">0{idx + 1} / 0{skills.length}</span>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-mist">{skill.summary}</p>
                  <div className="mt-6 rounded-2xl border border-ink/[0.09] bg-ink/[0.03] p-4"><SkillVisual id={skill.id} /></div>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {skill.items.map(it => <li key={it} className="chip">{it}</li>)}
                  </ul>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">Tools · <span className="text-mist">{skill.tools.join(" · ")}</span></p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div aria-hidden className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
