import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { profile, systemFlow } from "../content";
import { scrollToId, useUi } from "../lib/store";
import { ease } from "../lib/hooks";
import { Magnetic, SplitText } from "../components/motion";
import { PANEL_META as PANELS } from "../three/panels";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const ready = useUi(s => s.ready);
  const step = useUi(s => s.flowStep);
  const hoverPanel = useUi(s => s.hoverPanel);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // text recedes into depth as the 3D core takes over the scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", reduced ? "blur(0px)" : "blur(10px)"]);

  return (
    <section id="hero" ref={ref} className="section-pad relative flex min-h-[100svh] flex-col justify-center pb-28 pt-[38svh] outline-none md:pt-32" aria-label="Introduction">
      <motion.div style={{ y, scale, opacity, filter: blur }} className="relative z-10 mx-auto w-full max-w-7xl origin-top-left">
        <motion.div
          className="flex flex-wrap items-center gap-2"
          initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          <span className="chip"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-60 motion-reduce:animate-none" /><span className="relative inline-flex size-2 rounded-full bg-cyan" /></span>{profile.role} · {profile.company}</span>
          <span className="chip">{profile.location}</span>
        </motion.div>

        <h1 className="mt-8 max-w-4xl text-[clamp(3.1rem,9.2vw,8.6rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
          <SplitText text={profile.firstName} by="char" animate={ready} delay={0.2} className="block" />
          <SplitText text={profile.lastName} by="char" animate={ready} delay={0.35} className="block font-serif font-normal italic tracking-[-0.02em] text-gradient" />
        </h1>

        <div className="mt-8 grid max-w-3xl gap-6 md:grid-cols-[auto_1fr] md:items-start md:gap-10">
          <motion.p
            className="text-[clamp(1.25rem,2.2vw,1.7rem)] font-medium leading-tight tracking-[-0.02em]"
            initial={{ opacity: 0, x: -20 }} animate={ready ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, ease, delay: 0.75 }}
          >
            {profile.title}
          </motion.p>
          <motion.p
            className="max-w-md text-[16px] leading-relaxed text-mist"
            initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease, delay: 0.85 }}
          >
            <span className="text-ink">{profile.statement}</span> {profile.intro}
          </motion.p>
        </div>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease, delay: 1 }}
        >
          <Magnetic
            href="#work"
            onClick={e => { e.preventDefault(); scrollToId("work"); }}
            className="group relative inline-flex items-center overflow-hidden rounded-full bg-ink px-7 py-4 text-[15px] font-medium text-void"
          >
            <span className="relative z-10">View my work</span>
            <svg className="relative z-10 size-4 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </Magnetic>
          <Magnetic
            href="#contact"
            onClick={e => { e.preventDefault(); scrollToId("contact"); }}
            className="inline-flex items-center rounded-full border border-ink/[0.12] bg-ink/[0.025] px-7 py-4 text-[15px] font-medium text-ink backdrop-blur transition-colors hover:border-ink/25"
          >
            Let's talk
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* the system loop, mirrored from the 3D pulse */}
      <motion.div className="relative z-10 mx-auto mt-16 w-full max-w-7xl" style={{ opacity }}>
      <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 1.2 }}>
        <p className="eyebrow mb-3">The system I build</p>
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2" aria-label="Marketing system stages">
          {systemFlow.map((s, i) => (
            <li key={s} className="flex items-center gap-1">
              <span className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-all duration-500 ${i === step ? "border-cyan/50 bg-cyan/10 text-ink shadow-[0_8px_20px_-8px_rgba(8,126,136,0.4)]" : "border-ink/[0.09] text-mist"}`}>{s}</span>
              {i < systemFlow.length - 1 && <span aria-hidden className={`h-px w-3 transition-colors duration-500 ${i === step ? "bg-cyan" : "bg-ink/[0.09]"}`} />}
            </li>
          ))}
        </ol>
        <div className="mt-6 hidden items-center gap-4 lg:flex" aria-hidden>
          <span className="eyebrow">Hover the screens →</span>
          {PANELS.map(p => (
            <span key={p.id} className={`text-[12.5px] transition-colors ${hoverPanel === p.id ? "text-ink" : "text-dim"}`}>{p.label}</span>
          ))}
        </div>
      </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollToId("about")}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-dim"
        style={{ opacity }}
        aria-label="Scroll to about"
        data-cursor="hover"
      >
        <span className="eyebrow">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-ink/[0.07]">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-cyan" animate={reduced ? {} : { y: ["-100%", "200%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
        </span>
      </motion.button>
    </section>
  );
}
