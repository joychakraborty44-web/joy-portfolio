import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { projects, type Project } from "../content";
import { lockScroll } from "../lib/store";
import { ease, useMediaQuery } from "../lib/hooks";
import { SectionHeading, useTilt, Glare } from "../components/motion";
import { ProjectVisual, TiltContext } from "../visuals/ProjectVisuals";

function ProjectCard({ p, i, onOpen, wide }: { p: Project; i: number; onOpen: (p: Project) => void; wide: boolean }) {
  const t = useTilt(7);
  return (
    <div style={{ perspective: 1400 }} className={wide ? "w-[min(70vw,calc((100svh-410px)*1.6))] shrink-0" : "w-full"}>
      <motion.button
        type="button"
        ref={t.ref as never}
        layoutId={`card-${p.id}`}
        onClick={() => onOpen(p)}
        onPointerMove={t.onMove}
        onPointerLeave={t.onLeave}
        data-cursor="view"
        data-cursor-label="Open"
        aria-label={`Open case study: ${p.client} — ${p.title}`}
        style={{ rotateX: t.rotateX, rotateY: t.rotateY, transformStyle: "preserve-3d" }}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-ink/[0.09] bg-white text-left transition-[border-color,box-shadow] duration-500 hover:border-ink/15 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_50px_-30px_rgba(16,24,40,0.25)] hover:shadow-[0_40px_90px_-40px_rgba(88,80,236,0.35)]"
      >
        <TiltContext.Provider value={{ sx: t.sx, sy: t.sy }}>
          <motion.div layoutId={`visual-${p.id}`} className="relative aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-[1.02]">
            <ProjectVisual project={p} />
          </motion.div>
        </TiltContext.Provider>
        <div className="relative z-10 grid gap-3 border-t border-ink/[0.09] bg-white/95 p-5 md:grid-cols-[1fr_auto] md:items-end md:px-7 md:py-5">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
              <span style={{ color: p.accent }}>{String(i + 1).padStart(2, "0")}</span>{p.category}
            </p>
            <h3 className="mt-2 text-[clamp(1.35rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.025em]">{p.client}</h3>
            <p className="mt-1 text-[15px] text-mist">{p.title}</p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {(p.metrics ?? []).slice(0, 2).map(m => (
              <span key={m.label} className="rounded-xl border border-ink/[0.09] bg-ink/[0.025] px-3 py-2 text-right">
                <span className="block text-[15px] font-semibold tracking-tight">{m.value}</span>
                <span className="block text-[10.5px] text-dim">{m.label}</span>
              </span>
            ))}
            {!p.metrics && <span className="chip">{p.tools.slice(0, 2).join(" · ")}</span>}
          </div>
        </div>
        <Glare x={t.glareX} y={t.glareY} />
      </motion.button>
    </div>
  );
}

function CaseStudy({ p, origin, onClose, onStep }: { p: Project; origin: string; onClose: () => void; onStep: (dir: 1 | -1) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const index = projects.findIndex(x => x.id === p.id);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("button, a[href]");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);
  useEffect(() => { panel.current?.scrollTo({ top: 0 }); }, [p.id]);

  const block = (label: string, body: string, delay: number) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay }}>
      <p className="eyebrow">{label}</p>
      <p className="mt-3 text-[16.5px] leading-relaxed text-ink/90">{body}</p>
    </motion.div>
  );

  return (
    <motion.div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="case-title" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
      <motion.div className="absolute inset-0 bg-void/80 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }} onClick={onClose} />
      <motion.div
        ref={panel}
        layoutId={`card-${origin}`}
        transition={{ type: "spring", stiffness: 260, damping: 34, mass: 0.8 }}
        className="absolute inset-2 overflow-y-auto overscroll-contain rounded-[28px] border border-ink/[0.09] bg-white sm:inset-4 lg:inset-6"
        data-lenis-prevent
      >
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ink/[0.09] bg-white/85 px-5 py-3 backdrop-blur-xl sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim"><span style={{ color: p.accent }}>{String(index + 1).padStart(2, "0")}</span> / {String(projects.length).padStart(2, "0")} · {p.category}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onStep(-1)} className="grid size-10 place-items-center rounded-full border border-ink/[0.09] text-mist transition-colors hover:text-ink" aria-label="Previous project">←</button>
            <button type="button" onClick={() => onStep(1)} className="grid size-10 place-items-center rounded-full border border-ink/[0.09] text-mist transition-colors hover:text-ink" aria-label="Next project">→</button>
            <button ref={closeRef} type="button" onClick={onClose} className="ml-1 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-void" aria-label="Close case study">Close</button>
          </div>
        </div>

        <motion.div layoutId={p.id === origin ? `visual-${p.id}` : undefined} className="relative aspect-[16/9] max-h-[68vh] w-full md:aspect-[21/9]">
          <ProjectVisual project={p} />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent" />
        </motion.div>

        <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <motion.p className="font-mono text-[11px] text-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{p.visualNote}</motion.p>
          <motion.h2 id="case-title" className="mt-6 text-[clamp(2.2rem,6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.045em]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.15 }}>
            {p.client}
          </motion.h2>
          <motion.p className="mt-3 font-serif text-[clamp(1.4rem,3vw,2.2rem)] italic text-gradient" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.22 }}>{p.title}</motion.p>

          {p.metrics && (
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {p.metrics.map((m, i) => (
                <motion.div key={m.label} className="glass rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.08 }}>
                  <p className="text-[clamp(1.6rem,3vw,2.3rem)] font-semibold tracking-tight">{m.value}</p>
                  <p className="mt-1 text-[13px] text-mist">{m.label}</p>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {block("Problem", p.problem, 0.3)}
            {block("Solution", p.solution, 0.38)}
          </div>

          <motion.div className="mt-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.45 }}>
            <p className="eyebrow">What I implemented</p>
            <ul className="mt-4 flex flex-wrap gap-2">{p.work.map(w => <li key={w} className="chip">{w}</li>)}</ul>
          </motion.div>

          <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.4fr]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.5 }}>
              <p className="eyebrow">Tools</p>
              <ul className="mt-4 flex flex-wrap gap-2">{p.tools.map(t => <li key={t} className="chip">{t}</li>)}</ul>
            </motion.div>
            <motion.div className="rounded-2xl border p-6" style={{ borderColor: `${p.accent}55`, background: `${p.accent}0f` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.55 }}>
              <p className="eyebrow" style={{ color: p.accent }}>Result</p>
              <p className="mt-3 text-[18px] leading-relaxed">{p.result}</p>
            </motion.div>
          </div>

          {p.images && p.images.length > 0 && (
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {p.images.map((im, i) => (
                <motion.figure key={im.src} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease, delay: i * 0.08 }} className="overflow-hidden rounded-2xl border border-ink/[0.09]">
                  <img src={im.src} alt={im.alt} loading="lazy" decoding="async" className="w-full transition-transform duration-700 hover:scale-[1.04]" />
                  <figcaption className="border-t border-ink/[0.09] px-4 py-2.5 text-[12.5px] text-mist">{im.alt}</figcaption>
                </motion.figure>
              ))}
            </div>
          )}

          {p.links && (
            <div className="mt-10 flex flex-wrap gap-3">
              {p.links.map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ink/[0.12] px-5 py-3 text-[14px] transition-colors hover:border-ink/25">
                  {l.label} <span aria-hidden>↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const reduced = useReducedMotion();
  // the pinned horizontal track needs room; short or narrow screens get the grid
  const wide = useMediaQuery("(min-width: 1024px) and (min-height: 760px)");
  const horizontal = wide && !reduced;
  const [open, setOpenState] = useState<Project | null>(null);
  const [origin, setOrigin] = useState("");
  const setOpen = (p: Project | null) => { if (p) setOrigin(p.id); setOpenState(p); };
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    if (!horizontal) return;
    const measure = () => { if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth)); };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [horizontal]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0.04, 0.96], [0, -distance]);
  const x = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0.04, 0.96], [0, 1]);

  useEffect(() => { lockScroll(!!open); }, [open]);
  const step = (dir: 1 | -1) => setOpenState(cur => {
    if (!cur) return cur;
    const i = projects.findIndex(p => p.id === cur.id);
    return projects[(i + dir + projects.length) % projects.length];
  });

  const heading = horizontal ? (
    <div className="flex items-end justify-between gap-10">
      <SectionHeading index="04" kicker="Selected work" title="Proof of work," accent="not promises." compact />
      <p className="hidden max-w-xs shrink-0 pb-1 text-[15px] leading-relaxed text-mist xl:block">Real projects — attribution systems, CRM pipelines, campaign analysis and builds. Every number comes from the actual work. Scroll to explore →</p>
    </div>
  ) : (
    <SectionHeading index="04" kicker="Selected work" title="Proof of work," accent="not promises." sub="Real projects — attribution systems, CRM pipelines, campaign analysis and builds. Every number comes from the actual work." />
  );

  return (
    <section id="work" ref={section} className="relative outline-none" aria-labelledby="work-title" style={horizontal ? { height: `calc(100vh + ${distance}px)` } : undefined}>
      {horizontal ? (
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          <div className="section-pad mx-auto w-full max-w-7xl pt-20" id="work-title">{heading}</div>
          <motion.div ref={track} style={{ x }} className="flex min-h-0 flex-1 items-center gap-8 py-6 pl-[max(5vw,calc((100vw-80rem)/2+72px))] pr-[8vw]">
            {projects.map((p, i) => <ProjectCard key={p.id} p={p} i={i} onOpen={setOpen} wide />)}
          </motion.div>
          <div className="section-pad mx-auto mb-6 flex w-full max-w-7xl items-center gap-4" aria-hidden>
            <span className="font-mono text-[11px] text-dim">01</span>
            <div className="relative h-px flex-1 bg-ink/[0.07]"><motion.div className="absolute inset-0 origin-left bg-gradient-to-r from-cyan via-iris to-orchid" style={{ scaleX: bar }} /></div>
            <span className="font-mono text-[11px] text-dim">{String(projects.length).padStart(2, "0")}</span>
          </div>
        </div>
      ) : (
        <div className="section-pad mx-auto max-w-7xl py-32">
          <div id="work-title">{heading}</div>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {projects.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, ease, delay: (i % 2) * 0.08 }}>
                <ProjectCard p={p} i={i} onOpen={setOpen} wide={false} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {open && <CaseStudy key="case" p={open} origin={origin} onClose={() => setOpen(null)} onStep={step} />}
      </AnimatePresence>
    </section>
  );
}
