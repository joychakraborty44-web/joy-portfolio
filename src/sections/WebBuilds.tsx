import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { webProjects, type WebProject } from "../content";
import { ease } from "../lib/hooks";
import { Reveal, SectionHeading, TiltCard } from "../components/motion";

/* Browser frame whose full-page screenshot scrolls on hover / focus / toggle,
   so visitors can preview the whole live page without leaving the portfolio. */
function SitePreview({ p }: { p: WebProject }) {
  const reduced = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const measure = (img: HTMLImageElement) => {
    const f = frame.current; if (!f) return;
    const h = img.getBoundingClientRect().height;
    setOffset(Math.max(0, h - f.clientHeight));
  };
  const duration = Math.max(4, offset / 220);

  return (
    <TiltCard max={6} className="group rounded-[22px]">
      <div className="overflow-hidden rounded-[22px] border border-ink/[0.09] bg-white shadow-[0_50px_100px_-40px_rgba(15,23,42,0.16)]" style={{ boxShadow: `0 50px 120px -50px ${p.accent}55` }}>
        <div className="flex items-center gap-3 border-b border-ink/[0.09] px-4 py-3">
          <span className="flex gap-1.5"><span className="size-2.5 rounded-full bg-ink/[0.09]" /><span className="size-2.5 rounded-full bg-ink/[0.09]" /><span className="size-2.5 rounded-full bg-ink/[0.09]" /></span>
          <span className="flex-1 truncate rounded-lg bg-ink/[0.045] px-3 py-1 text-center font-mono text-[11px] text-dim">{p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
          <button
            type="button"
            onClick={() => setScrolling(s => !s)}
            aria-pressed={scrolling}
            className="rounded-full border border-ink/[0.09] px-2.5 py-1 text-[11px] text-mist transition-colors hover:text-ink"
          >
            {scrolling ? "Stop" : "Scroll page"}
          </button>
        </div>
        <div
          ref={frame}
          className="relative aspect-[16/10] overflow-hidden"
          onMouseEnter={() => !reduced && setScrolling(true)}
          onMouseLeave={() => setScrolling(false)}
          data-cursor="view"
          data-cursor-label="Scroll"
        >
          <img
            src={p.full}
            alt={`Full-page screenshot of ${p.name}`}
            loading="lazy"
            decoding="async"
            onLoad={e => measure(e.currentTarget)}
            className="absolute inset-x-0 top-0 w-full"
            style={{
              transform: `translateY(${scrolling ? -offset : 0}px)`,
              transition: reduced ? "none" : `transform ${scrolling ? duration : 0.9}s ${scrolling ? "linear" : "cubic-bezier(0.16,1,0.3,1)"}`,
            }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-0" />
        </div>
      </div>
    </TiltCard>
  );
}

function WebRow({ p, i }: { p: WebProject; i: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [80, -80]);
  const flip = i % 2 === 1;
  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
      <motion.div style={{ y }} className={flip ? "lg:order-2" : ""}>
        <motion.div initial={{ opacity: 0, scale: 0.94, rotateX: 12 }} whileInView={{ opacity: 1, scale: 1, rotateX: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.1, ease }} style={{ transformPerspective: 1200 }}>
          <SitePreview p={p} />
        </motion.div>
      </motion.div>
      <div className={flip ? "lg:order-1" : ""}>
        <Reveal>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: p.accent }}>0{i + 1}</span>
            <span className="rounded-full border border-ink/[0.09] px-2.5 py-0.5 text-[11px] text-mist">LofiStack team project</span>
          </div>
          <h3 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-none tracking-[-0.04em]">{p.name}</h3>
          <p className="mt-2 font-serif text-[1.3rem] italic text-mist">{p.industry}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="mt-7 space-y-5 text-[15px] leading-relaxed">
            <div><dt className="eyebrow">The brief</dt><dd className="mt-1.5 text-mist">{p.needed}</dd></div>
            <div><dt className="eyebrow">What the team built</dt><dd className="mt-1.5 text-ink/90">{p.built}</dd></div>
          </dl>
        </Reveal>
        <Reveal delay={0.18}>
          <ul className="mt-6 flex flex-wrap gap-2">{p.features.map(f => <li key={f} className="chip">{f}</li>)}</ul>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ink/[0.12] px-5 py-3 text-[14px] transition-colors hover:border-ink/25" data-cursor="hover">
              Visit live site <span aria-hidden>↗</span>
            </a>
            <span className="font-mono text-[11px] text-dim">Scope · {p.scope.join(" · ")}</span>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export function WebBuilds() {
  return (
    <section id="web" className="band section-pad relative overflow-hidden py-32 outline-none md:py-44" aria-labelledby="web-title">
      <div className="mx-auto max-w-7xl">
        <div id="web-title">
          <SectionHeading index="05" kicker="Web builds" title="Websites built" accent="with the LofiStack team." sub="Selected team projects for AI and automation companies. Hover a browser to scroll the full live page — screenshots captured from the live sites." />
        </div>
        <div className="mt-20 space-y-32 md:space-y-40">
          {webProjects.map((p, i) => <WebRow key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}
