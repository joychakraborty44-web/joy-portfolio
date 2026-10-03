import { useRef, type ReactNode, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ease } from "../lib/hooks";

/* ---------------- text reveal (words or characters) ---------------- */

type SplitProps = {
  text: string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3";
  className?: string;
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
  once?: boolean;
  /** animate immediately instead of when scrolled into view */
  animate?: boolean;
};

export function SplitText({ text, as: Tag = "span", className, by = "word", delay = 0, stagger, once = true, animate }: SplitProps) {
  const reduced = useReducedMotion();
  const parts = by === "char" ? Array.from(text) : text.split(" ");
  const step = stagger ?? (by === "char" ? 0.028 : 0.06);
  // background-clip:text can't reach transformed children, so each piece carries
  // its own slice of a single gradient (sized to the whole run, offset by index)
  const gradient = !!className?.includes("text-gradient");
  const outerClass = gradient ? className!.replace("text-gradient", "") : className;
  const n = parts.length;
  const trigger = animate === undefined ? { whileInView: "show", viewport: { once, amount: 0.6 } } : { animate: animate ? "show" : "hide" };
  return (
    <Tag className={outerClass}>
      <span className="sr-only">{text}</span>
      <motion.span initial="hide" {...trigger} aria-hidden="true" style={{ display: "inline" }}>
        {parts.map((p, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block will-change-transform ${gradient ? "text-gradient" : ""}`}
              style={gradient ? { backgroundSize: `${n * 100}% 100%`, backgroundPosition: `${n > 1 ? (i / (n - 1)) * 100 : 0}% 0` } : undefined}
              variants={{
                hide: reduced ? { opacity: 0 } : { y: "110%", rotate: by === "char" ? 6 : 3, opacity: 0 },
                show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: reduced ? 0.2 : 0.9, ease, delay: delay + i * step } },
              }}
            >
              {p === " " ? " " : p}
            </motion.span>
            {by === "word" && i < parts.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* ---------------- fade/lift into view with blur ---------------- */

export function Reveal({ children, delay = 0, y = 32, className, as = "div" }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "li" | "section" | "article" }) {
  const reduced = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduced ? 0.2 : 1, ease, delay }}
    >
      {children}
    </M>
  );
}

/* ---------------- magnetic button / link ---------------- */

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  onClick?: (e: ReactMouseEvent) => void;
  type?: "button" | "submit";
  ariaLabel?: string;
  disabled?: boolean;
};

export function Magnetic({ children, className, strength = 0.35, href, onClick, type = "button", ariaLabel, disabled }: MagneticProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });
  const ix = useTransform(x, v => v * 0.45), iy = useTransform(y, v => v * 0.45);
  const move = (e: ReactMouseEvent) => {
    if (reduced || !ref.current || e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };
  const inner = <motion.span className="relative inline-flex items-center gap-2" style={{ x: ix, y: iy }}>{children}</motion.span>;
  const common = { ref: ref as never, onMouseMove: move, onMouseLeave: leave, style: { x, y }, className, "data-cursor": "hover", "aria-label": ariaLabel };
  return href ? (
    <motion.a href={href} onClick={onClick} {...common}>{inner}</motion.a>
  ) : (
    <motion.button type={type} onClick={onClick} disabled={disabled} {...common}>{inner}</motion.button>
  );
}

/* ---------------- 3D tilt with glare and depth layers ---------------- */

export function useTilt(max = 10) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5), py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 20 }), sy = useSpring(py, { stiffness: 160, damping: 20 });
  const rotateY = useTransform(sx, v => (reduced ? 0 : (v - 0.5) * max * 2));
  const rotateX = useTransform(sy, v => (reduced ? 0 : (0.5 - v) * max * 2));
  const glareX = useTransform(sx, v => `${v * 100}%`);
  const glareY = useTransform(sy, v => `${v * 100}%`);
  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { px.set(0.5); py.set(0.5); };
  return { ref, rotateX, rotateY, glareX, glareY, sx, sy, onMove, onLeave };
}

export function TiltCard({ children, className, max = 10, style, glare = true }: { children: ReactNode; className?: string; max?: number; style?: CSSProperties; glare?: boolean }) {
  const t = useTilt(max);
  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        ref={t.ref}
        onPointerMove={t.onMove}
        onPointerLeave={t.onLeave}
        style={{ rotateX: t.rotateX, rotateY: t.rotateY, transformStyle: "preserve-3d", ...style }}
        className={`relative h-full ${className ?? ""}`}
      >
        {children}
        {glare && <Glare x={t.glareX} y={t.glareY} />}
      </motion.div>
    </div>
  );
}

export function Glare({ x, y }: { x: MotionValue<string>; y: MotionValue<string> }) {
  const bg = useTransform([x, y] as MotionValue<string>[], ([gx, gy]) => `radial-gradient(420px circle at ${gx} ${gy}, rgba(255,255,255,0.10), transparent 55%)`);
  return <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: bg }} />;
}

/* ---------------- section heading ---------------- */

export function SectionHeading({ index, kicker, title, accent, sub, align = "left", compact = false }: { index: string; kicker: string; title: string; accent?: string; sub?: string; align?: "left" | "center"; compact?: boolean }) {
  return (
    <header className={`relative z-10 ${compact ? "max-w-none" : "max-w-3xl"} ${align === "center" ? "mx-auto text-center" : ""}`}>
      <Reveal>
        <p className={`eyebrow flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
          <span className="text-cyan">{index}</span>
          <span className="h-px w-8 bg-white/20" />
          {kicker}
        </p>
      </Reveal>
      <h2 className={`${compact ? "mt-3 text-[clamp(2rem,3.6vw,3.3rem)]" : "mt-5 text-[clamp(2.3rem,5.6vw,4.6rem)]"} font-semibold leading-[0.98] tracking-[-0.035em]`}>
        <SplitText text={title} />
        {accent && (
          <>
            {" "}
            <SplitText text={accent} className="font-serif font-normal italic tracking-[-0.01em] text-gradient" delay={0.15} />
          </>
        )}
      </h2>
      {sub && (
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-mist">{sub}</p>
        </Reveal>
      )}
    </header>
  );
}
