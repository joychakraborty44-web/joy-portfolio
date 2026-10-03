import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { nav, profile } from "../content";
import { lockScroll, scrollToId, setUi, useUi } from "../lib/store";
import { ease, useFinePointer } from "../lib/hooks";
import { Magnetic } from "./motion";

/* ---------------- cinematic intro ---------------- */

export function Loader() {
  const reduced = useReducedMotion();
  const sceneReady = useUi(s => s.sceneReady);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const sceneRef = useRef(sceneReady);
  sceneRef.current = sceneReady;

  useEffect(() => {
    if (reduced) { setDone(true); setUi({ ready: true }); return; }
    lockScroll(true);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      // ease toward 100, but hold at 90 until the 3D scene has mounted (max 4s)
      const t = Math.min(1, (now - start) / 1600);
      const cap = sceneRef.current || now - start > 4000 ? 100 : 90;
      const v = Math.min(cap, Math.round((1 - Math.pow(1 - t, 3)) * 100));
      setCount(v);
      if (v >= 100) { setTimeout(() => setDone(true), 250); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // failsafes on timers: animation frames pause in background tabs, so never let
    // the intro hold the page hostage
    const t1 = setTimeout(() => setDone(true), 6500);
    const t2 = setTimeout(() => { lockScroll(false); setUi({ ready: true }); }, 8000);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
  }, [reduced]);

  return (
    <AnimatePresence onExitComplete={() => { lockScroll(false); setUi({ ready: true }); }}>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] grid place-items-center bg-void"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading portfolio"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="overflow-hidden">
              <motion.p
                className="text-[clamp(2.2rem,7vw,5rem)] font-semibold tracking-[-0.04em]"
                initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1, ease }}
              >
                {profile.firstName}<span className="font-serif font-normal italic text-gradient"> {profile.lastName}</span>
              </motion.p>
            </div>
            <div className="flex w-56 items-center gap-4">
              <div className="relative h-px flex-1 overflow-hidden bg-white/10">
                <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan via-iris to-orchid" style={{ width: `${count}%` }} />
              </div>
              <span className="w-10 text-right font-mono text-xs tabular-nums text-mist">{String(count).padStart(3, "0")}</span>
            </div>
            <p className="eyebrow">{profile.title}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- navigation ---------------- */

export function Nav() {
  const active = useUi(s => s.activeSection);
  const open = useUi(s => s.menuOpen);
  const ready = useUi(s => s.ready);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const last = useRef(0);
  useMotionValueEvent(scrollY, "change", v => {
    setScrolled(v > 40);
    setHidden(v > last.current && v > 600 && !open);
    last.current = v;
  });

  useEffect(() => { lockScroll(open); }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setUi({ menuOpen: false }); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => { setUi({ menuOpen: false }); setTimeout(() => scrollToId(id), open ? 350 : 0); };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: ready && !hidden ? 0 : -90, opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <nav
          aria-label="Main"
          className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-3 py-2.5 transition-all duration-500 sm:px-4 ${scrolled || open ? "glass-strong" : "border border-transparent"}`}
        >
          <a href="#hero" onClick={e => { e.preventDefault(); go("hero"); }} className="group flex items-center gap-3 rounded-xl px-1" data-cursor="hover">
            <span className="relative grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 font-mono text-[12px] font-semibold tracking-wider">
              <span className="text-gradient">JC</span>
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan/20 to-orchid/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
            <span className="hidden text-[14px] font-medium tracking-tight sm:block">{profile.name}</span>
          </a>

          <ul className="hidden items-center gap-0.5 xl:flex">
            {nav.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={e => { e.preventDefault(); go(item.id); }}
                  aria-current={active === item.id ? "true" : undefined}
                  className={`relative block rounded-full px-3.5 py-2 text-[13.5px] transition-colors ${active === item.id ? "text-white" : "text-mist hover:text-white"}`}
                  data-cursor="hover"
                >
                  {active === item.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.07]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Magnetic
              href="#contact"
              onClick={e => { e.preventDefault(); go("contact"); }}
              className="hidden rounded-full bg-white px-5 py-2.5 text-[13.5px] font-medium text-void transition-shadow hover:shadow-[0_0_30px_rgba(129,140,248,0.55)] sm:inline-flex"
            >
              Let's talk
            </Magnetic>
            <button
              type="button"
              onClick={() => setUi({ menuOpen: !open })}
              className="relative grid size-11 place-items-center rounded-xl border border-white/10 bg-white/5 xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <motion.span className="absolute h-px w-5 bg-white" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} transition={{ duration: 0.4, ease }} />
              <motion.span className="absolute h-px w-5 bg-white" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} transition={{ duration: 0.4, ease }} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-void/92 px-6 pb-10 pt-28 backdrop-blur-2xl xl:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col gap-1">
              {nav.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={e => { e.preventDefault(); go(item.id); }}
                    className="flex items-baseline gap-4 py-1.5 text-[clamp(2rem,9vw,3.2rem)] font-semibold tracking-[-0.03em]"
                    initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }}
                    transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.05 }}
                  >
                    <span className="font-mono text-xs text-cyan">{String(i + 1).padStart(2, "0")}</span>
                    <span className={active === item.id ? "text-gradient" : ""}>{item.label}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }} exit={{ opacity: 0 }}>
              {profile.title} · {profile.location}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- scroll progress + custom cursor ---------------- */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-cyan via-iris to-orchid" style={{ scaleX }} />;
}

export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 }), ry = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });
  const [mode, setMode] = useState<"idle" | "hover" | "view">("idle");
  const [label, setLabel] = useState("");
  useEffect(() => {
    if (!fine || reduced) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      const t = (e.target as HTMLElement).closest?.("[data-cursor]") as HTMLElement | null;
      const m = (t?.dataset.cursor as "hover" | "view") ?? "idle";
      setMode(m); setLabel(t?.dataset.cursorLabel ?? "");
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, reduced, x, y]);
  if (!fine || reduced) return null;
  const size = mode === "view" ? 92 : mode === "hover" ? 46 : 28;
  return (
    <>
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference" style={{ x, y }} />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 text-[11px] font-medium uppercase tracking-[0.14em] text-void"
        style={{ x: rx, y: ry }}
        animate={{ width: size, height: size, backgroundColor: mode === "view" ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0)", borderColor: mode === "idle" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.7)" }}
        transition={{ duration: 0.35, ease }}
      >
        {mode === "view" && label}
      </motion.div>
    </>
  );
}
