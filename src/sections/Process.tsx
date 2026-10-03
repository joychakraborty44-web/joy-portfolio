import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { process } from "../content";
import { ease, useMediaQuery } from "../lib/hooks";
import { scrollToY } from "../lib/store";
import { Reveal, SectionHeading } from "../components/motion";

/* Desktop: a pinned 3D stage. Scrolling walks through the five steps; the active
   platform rises out of the board and the connector draws up to it. */
function Stage({ active, setActive, progress }: { active: number; setActive: (i: number) => void; progress: ReturnType<typeof useSpring> }) {
  const draw = useTransform(progress, [0, 1], [0, 1]);
  return (
    <div className="relative mx-auto aspect-[16/9] w-full max-w-5xl [perspective:1400px]">
      <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d", rotateX: 56, rotateZ: -8 }}>
        <div className="absolute inset-[6%] rounded-[40px] border border-white/[0.07] bg-[radial-gradient(circle_at_50%_50%,rgba(129,140,248,0.10),transparent_70%)]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <svg viewBox="0 0 1000 560" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M120 400 C 240 400, 260 170, 330 170 S 470 390, 500 390 S 640 170, 670 170 S 800 400, 880 400" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <motion.path d="M120 400 C 240 400, 260 170, 330 170 S 470 390, 500 390 S 640 170, 670 170 S 800 400, 880 400" fill="none" stroke="url(#pg)" strokeWidth="3" style={{ pathLength: draw }} />
          <defs><linearGradient id="pg" x1="0" x2="1"><stop offset="0" stopColor="#5eead4" /><stop offset=".5" stopColor="#818cf8" /><stop offset="1" stopColor="#e879f9" /></linearGradient></defs>
        </svg>
        {process.map((s, i) => {
          const pos = [[12, 71], [33, 30], [50, 70], [67, 30], [88, 71]][i];
          const on = i === active, done = i < active;
          return (
            <motion.button
              key={s.n}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Step ${s.n}: ${s.title}`}
              aria-current={on ? "step" : undefined}
              data-cursor="hover"
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos[0]}%`, top: `${pos[1]}%`, transformStyle: "preserve-3d" }}
              animate={{ z: on ? 70 : done ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
            >
              <span className={`grid size-24 place-items-center rounded-3xl border text-center transition-all duration-500 ${on ? "border-cyan/60 bg-cyan/15 shadow-[0_0_60px_rgba(94,234,212,0.45)]" : done ? "border-iris/40 bg-iris/10" : "border-white/10 bg-white/[0.04]"}`} style={{ transform: "rotateZ(8deg) rotateX(-56deg)", transformOrigin: "bottom center" }}>
                <span>
                  <span className="block font-mono text-[11px] text-cyan">{s.n}</span>
                  <span className="mt-1 block text-[14px] font-semibold">{s.title}</span>
                </span>
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

export function Process() {
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const pinned = wide && !reduced;
  const ref = useRef<HTMLElement>(null);
  const [active, setActiveState] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28 });
  useMotionValueEvent(scrollYProgress, "change", v => { if (pinned) setActiveState(Math.min(process.length - 1, Math.floor(v * process.length * 0.999))); });

  // clicking a platform scrolls to its slice of the pinned range
  const setActive = (i: number) => {
    if (!pinned || !ref.current) { setActiveState(i); return; }
    const top = ref.current.offsetTop, span = ref.current.offsetHeight - window.innerHeight;
    scrollToY(top + span * ((i + 0.5) / process.length));
  };
  const s = process[active];

  if (!pinned) {
    return (
      <section id="process" ref={ref} className="section-pad relative py-32 outline-none" aria-labelledby="process-title">
        <div className="mx-auto max-w-3xl">
          <div id="process-title"><SectionHeading index="07" kicker="Process" title="How I build" accent="a system." /></div>
          <ol className="relative mt-14 space-y-4 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:w-px before:bg-gradient-to-b before:from-cyan before:via-iris before:to-orchid">
            {process.map((p, i) => (
              <Reveal as="li" key={p.n} delay={i * 0.05} className="relative flex gap-5">
                <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-void font-mono text-sm text-cyan">{p.n}</span>
                <div className="glass flex-1 rounded-2xl p-5">
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mist">{p.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">{p.outputs.map(o => <li key={o} className="chip">{o}</li>)}</ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id="process" ref={ref} className="relative h-[360vh] outline-none" aria-labelledby="process-title">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden section-pad">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.8fr_1.4fr]">
          <div>
            <div id="process-title"><SectionHeading index="07" kicker="Process" title="How I build" accent="a system." /></div>
            <div className="relative mt-10 min-h-[230px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div key={s.n} initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={{ duration: 0.5, ease }}>
                  <p className="font-mono text-sm text-cyan">{s.n} / 05</p>
                  <h3 className="mt-2 text-4xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-4 max-w-md text-[16.5px] leading-relaxed text-mist">{s.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">{s.outputs.map(o => <li key={o} className="chip">{o}</li>)}</ul>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-6 flex gap-2" aria-hidden>
              {process.map((p, i) => <span key={p.n} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-10 bg-cyan" : i < active ? "w-4 bg-iris/60" : "w-4 bg-white/15"}`} />)}
            </div>
          </div>
          <Stage active={active} setActive={setActive} progress={progress} />
        </div>
      </div>
    </section>
  );
}
