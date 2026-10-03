import { useSyncExternalStore } from "react";
import type { SkillId } from "../content";

/* ------------------------------------------------------------
   Shared state between the DOM and the 3D scene.

   `ui` is reactive (React components subscribe to it).
   `frame` is a plain mutable object the 3D scene reads every
   frame — writing to it never triggers a React render.
   ------------------------------------------------------------ */

type UiState = {
  ready: boolean; // intro finished
  sceneReady: boolean; // 3D chunk mounted
  activeSkill: SkillId;
  hoverPanel: string | null; // hero 3D screen under the cursor
  flowStep: number; // which system-flow stage is pulsing
  activeSection: string;
  menuOpen: boolean;
};

let ui: UiState = {
  ready: false,
  sceneReady: false,
  activeSkill: "ghl",
  hoverPanel: null,
  flowStep: 0,
  activeSection: "hero",
  menuOpen: false,
};
const listeners = new Set<() => void>();

export function setUi(patch: Partial<UiState>) {
  let changed = false;
  for (const k in patch) {
    const key = k as keyof UiState;
    if (ui[key] !== patch[key]) { changed = true; break; }
  }
  if (!changed) return;
  ui = { ...ui, ...patch };
  listeners.forEach(l => l());
}
export const getUi = () => ui;

export function useUi<T>(select: (s: UiState) => T): T {
  return useSyncExternalStore(
    cb => { listeners.add(cb); return () => listeners.delete(cb); },
    () => select(ui),
    () => select(ui),
  );
}

/** Non-reactive values for the render loop. */
export const frame = {
  pointer: { x: 0, y: 0 }, // -1..1, smoothed in the scene
  scrollY: 0,
  reduced: false,
  mobile: false,
};

/* Lenis instance (set by App) so anchors can scroll smoothly. */
type Scroller = { scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number; duration?: number; immediate?: boolean }) => void; stop: () => void; start: () => void };
let scroller: Scroller | null = null;
export const setScroller = (s: Scroller | null) => { scroller = s; };

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (scroller && !frame.reduced) scroller.scrollTo(el, { offset: id === "hero" ? 0 : -8, duration: 1.4 });
  else el.scrollIntoView({ behavior: frame.reduced ? "auto" : "smooth", block: "start" });
  // move focus for keyboard and screen-reader users
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function scrollToY(y: number) {
  if (scroller && !frame.reduced) scroller.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: frame.reduced ? "auto" : "smooth" });
}

export const lockScroll = (locked: boolean) => {
  if (scroller) { if (locked) scroller.stop(); else scroller.start(); }
  document.documentElement.style.overflow = locked ? "hidden" : "";
};
