import { lazy, Suspense, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { frame, setScroller, setUi } from "./lib/store";
import { hasWebGL, useIsMobile, useReducedMotionPref } from "./lib/hooks";
import { Cursor, Loader, Nav, ScrollProgress } from "./components/Chrome";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Skills } from "./sections/Skills";
import { Projects } from "./sections/Projects";
import { AIAgents } from "./sections/AIAgents";
import { WebBuilds } from "./sections/WebBuilds";
import { Experience as ExperienceSection } from "./sections/Experience";
import { Process } from "./sections/Process";
import { Contact } from "./sections/Contact";

// three.js lives in its own chunk so the page can paint first
const Scene = lazy(() => import("./three/Experience"));

const SECTIONS = ["hero", "about", "skills", "agents", "work", "web", "experience", "process", "contact"];

export default function App() {
  const reduced = useReducedMotionPref();
  const mobile = useIsMobile();
  const [webgl] = useState(() => hasWebGL());
  frame.reduced = reduced;
  frame.mobile = mobile;

  // inertia scrolling (off for reduced motion)
  useEffect(() => {
    if (reduced) { setScroller(null); return; }
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.1 });
    setScroller(lenis);
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); setScroller(null); };
  }, [reduced]);

  // active section for the nav indicator
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setUi({ activeSection: e.target.id }); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => { if (!webgl) setUi({ sceneReady: true }); }, [webgl]);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-void">Skip to content</a>
      <Loader />
      <ScrollProgress />
      <Cursor />
      <Nav />

      {webgl ? (
        <Suspense fallback={null}><Scene /></Suspense>
      ) : (
        <div aria-hidden className="fixed inset-0 z-0 bg-[radial-gradient(60%_50%_at_75%_30%,rgba(129,140,248,0.22),transparent_70%),radial-gradient(50%_40%_at_10%_80%,rgba(94,234,212,0.14),transparent_70%)]" />
      )}
      <div aria-hidden className="grain" />
      <div aria-hidden className="vignette" />

      <main id="main" className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <AIAgents />
        <Projects />
        <WebBuilds />
        <ExperienceSection />
        <Process />
        <Contact />
      </main>
    </MotionConfig>
  );
}
