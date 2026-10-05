import { useRef } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { timeline } from "../content";
import { ease } from "../lib/hooks";
import { SectionHeading, TiltCard } from "../components/motion";

export function Experience() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [reached, setReached] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", v => setReached(Math.floor(v * timeline.length - 0.1)));

  // perspective grid that drifts as you scroll — the "floor" the timeline stands on
  const sec = useRef<HTMLElement>(null);
  const { scrollYProgress: secP } = useScroll({ target: sec, offset: ["start end", "end start"] });
  const gridY = useTransform(secP, [0, 1], reduced ? [0, 0] : [0, -320]);
  const gridRot = useTransform(secP, [0, 1], reduced ? [64, 64] : [70, 58]);

  return (
    <section id="experience" ref={sec} className="section-pad relative overflow-hidden py-32 outline-none md:py-44" aria-labelledby="exp-title">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] [perspective:900px] [mask-image:linear-gradient(to_top,#000,transparent)]">
        <motion.div
          className="absolute inset-x-[-50%] bottom-[-30%] h-[160%] origin-bottom"
          style={{ rotateX: gridRot, y: gridY, backgroundImage: "linear-gradient(rgba(88,80,236,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(88,80,236,0.09) 1px, transparent 1px)", backgroundSize: "64px 64px" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div id="exp-title">
          <SectionHeading index="06" kicker="Experience" title="A path toward" accent="technical marketing." sub="From launching campaigns to engineering the systems behind them — and still climbing." align="center" />
        </div>

        <div ref={ref} className="relative mt-24">
          {/* spine */}
          <div aria-hidden className="absolute bottom-0 left-[19px] top-0 w-px bg-ink/[0.07] md:left-1/2 md:-translate-x-1/2">
            <motion.div className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-cyan via-iris to-orchid" style={{ scaleY: progress }} />
          </div>

          <ol className="space-y-16 md:space-y-24">
            {timeline.map((e, i) => {
              const left = i % 2 === 0;
              const on = i <= reached;
              return (
                <li key={e.title} className="relative grid md:grid-cols-2 md:gap-16">
                  <span aria-hidden className="absolute left-[19px] top-6 z-10 -translate-x-1/2 md:left-1/2">
                    <span className={`block rounded-full border transition-all duration-700 ${on ? "size-4 border-cyan bg-cyan shadow-[0_0_0_4px_rgba(8,126,136,0.14)]" : "size-3 border-ink/25 bg-void"} ${e.milestone && on ? "ring-4 ring-cyan/20" : ""}`} />
                  </span>
                  <motion.div
                    className={`pl-12 md:pl-0 ${left ? "md:col-start-1 md:pr-4 md:text-right" : "md:col-start-2 md:pl-4"}`}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, x: left ? -60 : 60, rotateY: left ? 12 : -12, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1, ease }}
                    style={{ transformPerspective: 1000 }}
                  >
                    <TiltCard max={6} className={`rounded-3xl p-7 transition-shadow duration-700 ${e.milestone ? "glass-strong" : "glass"} ${e.milestone && on ? "shadow-[0_30px_60px_-30px_rgba(8,126,136,0.35)]" : ""}`}>
                      <div className={`flex flex-wrap items-center gap-3 ${left ? "md:justify-end" : ""}`}>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">{e.when}</span>
                        {e.milestone && <span className="rounded-full border border-orchid/40 bg-orchid/10 px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.14em] text-orchid">Milestone</span>}
                      </div>
                      <h3 className="mt-3 text-[22px] font-semibold leading-tight tracking-tight">{e.title}</h3>
                      {e.org && <p className="mt-1 text-[14px] text-iris">{e.org}</p>}
                      <p className="mt-3 text-[15px] leading-relaxed text-mist">{e.body}</p>
                      <ul className={`mt-5 flex flex-wrap gap-2 ${left ? "md:justify-end" : ""}`}>
                        {e.tags.map(t => <li key={t} className="chip">{t}</li>)}
                      </ul>
                    </TiltCard>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
