import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { profile, tools } from "../content";
import { Reveal, SectionHeading, TiltCard } from "../components/motion";

const WORDS = ["Marketing", "+", "Automation", "+", "CRM", "+", "AI", "+", "Technical", "implementation"];

function ScrollWord({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [14, 0]);
  const accent = word === "+";
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${accent ? "font-serif italic text-gradient" : ""}`}>
      {word}&nbsp;
    </motion.span>
  );
}

const JOURNEY = [
  { k: "Foundation", t: "Paid ads & lead generation", d: "Meta and Google campaigns built to generate leads." },
  { k: "Now", t: "CRM, attribution & automation", d: "The systems that catch, track and follow up every lead." },
  { k: "Next", t: "AI & technical marketing", d: "Claude Code, MCP workflows and API-based automation." },
];

export function About() {
  const reduced = useReducedMotion();
  const statement = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: statement, offset: ["start 85%", "end 45%"] });
  const cards = useRef<HTMLDivElement>(null);
  const { scrollYProgress: cardP } = useScroll({ target: cards, offset: ["start end", "end start"] });
  const d1 = useTransform(cardP, [0, 1], [reduced ? 0 : 60, reduced ? 0 : -60]);
  const d2 = useTransform(cardP, [0, 1], [reduced ? 0 : 120, reduced ? 0 : -120]);
  const d3 = useTransform(cardP, [0, 1], [reduced ? 0 : 30, reduced ? 0 : -30]);

  return (
    <section id="about" className="section-pad relative py-32 outline-none md:py-44" aria-labelledby="about-title">
      <div className="mx-auto max-w-7xl">
        <div id="about-title">
          <SectionHeading index="01" kicker="Profile" title="Not just ads. Not just pages." accent="The whole system." />
        </div>

        <div ref={statement} className="mt-16 max-w-5xl text-[clamp(2rem,5.2vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.04em]" aria-label="Marketing plus automation plus CRM plus AI plus technical implementation">
          <span aria-hidden>
            {WORDS.map((w, i) => (
              <ScrollWord key={i} word={w} progress={scrollYProgress} range={[i / WORDS.length, (i + 1) / WORDS.length]} />
            ))}
          </span>
        </div>

        {/* floating profile cards on three depth layers */}
        <div ref={cards} className="relative mt-24 grid gap-5 md:grid-cols-12">
          <motion.div style={{ y: d1 }} className="md:col-span-5">
            <TiltCard className="glass rounded-3xl p-8">
              <p className="eyebrow">Who I am</p>
              <p className="mt-5 text-[22px] font-medium leading-snug tracking-tight">
                {profile.role} at <span className="text-gradient">{profile.company}</span>, a {profile.companyNote}.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-mist">
                I work on execution and technical implementation — from launching campaigns to building the CRM, attribution and automation behind them.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {profile.traits.map(t => <span key={t} className="chip">{t}</span>)}
              </div>
            </TiltCard>
          </motion.div>

          <motion.div style={{ y: d2 }} className="grid gap-5 md:col-span-3">
            <TiltCard className="glass rounded-3xl p-8">
              <p className="eyebrow">Experience</p>
              <p className="mt-4 text-[clamp(3rem,6vw,4.6rem)] font-semibold leading-none tracking-[-0.05em] text-gradient">{profile.experience.replace(" years", "")}</p>
              <p className="mt-2 text-[15px] text-mist">years in digital marketing & implementation</p>
            </TiltCard>
            <TiltCard className="glass rounded-3xl p-8">
              <p className="eyebrow">Based in</p>
              <p className="mt-3 text-2xl font-medium tracking-tight">{profile.location}</p>
              <p className="mt-1 text-[14px] text-mist">Working with a US-based agency</p>
            </TiltCard>
          </motion.div>

          <motion.div style={{ y: d3 }} className="md:col-span-4">
            <TiltCard className="glass rounded-3xl p-8">
              <p className="eyebrow">Main expertise</p>
              <ul className="mt-5 space-y-3">
                {profile.identities.map((id, i) => (
                  <Reveal as="li" key={id} delay={i * 0.05} y={12}>
                    <span className="flex items-center justify-between border-b border-white/[0.07] pb-3 text-[15px]">
                      {id}<span className="font-mono text-[11px] text-dim">0{i + 1}</span>
                    </span>
                  </Reveal>
                ))}
              </ul>
            </TiltCard>
          </motion.div>
        </div>

        {/* journey */}
        <div className="mt-24 grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] md:grid-cols-3">
          {JOURNEY.map((j, i) => (
            <Reveal key={j.k} delay={i * 0.12} className="group relative bg-void/80 p-8 backdrop-blur-xl transition-colors duration-500 hover:bg-white/[0.03]">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">{j.k}</p>
              <p className="mt-4 text-xl font-medium tracking-tight">{j.t}</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-mist">{j.d}</p>
              <span aria-hidden className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-cyan to-orchid transition-transform duration-700 group-hover:scale-x-100" />
            </Reveal>
          ))}
        </div>
      </div>

      {/* tools marquee */}
      <div className="marquee-wrap relative mt-24 space-y-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]" aria-label="Tools I work with">
        {[0, 1].map(row => (
          <div key={row} className={`marquee flex w-max gap-3 ${row ? "marquee-reverse" : ""}`} style={{ ["--marquee-duration" as string]: row ? "52s" : "44s" }} aria-hidden={row === 1}>
            {[...tools, ...tools].map((t, i) => (
              <span key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-6 py-4 text-[17px] font-medium tracking-tight text-mist transition-colors hover:border-white/25 hover:text-white">{t}</span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
