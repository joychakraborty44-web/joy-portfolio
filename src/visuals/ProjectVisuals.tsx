import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { motion, motionValue, useTransform, type MotionValue } from "framer-motion";
import type { Project } from "../content";

/* Each project preview is built from layers. A layer's `depth` decides how far
   it shifts as the card tilts, so the preview reads as a stack of real 3D
   planes without relying on preserve-3d (which overflow:hidden would flatten). */

type Tilt = { sx: MotionValue<number>; sy: MotionValue<number> };
const still = { sx: motionValue(0.5), sy: motionValue(0.5) };
export const TiltContext = createContext<Tilt>(still);

function Layer({ depth, className, style, children }: { depth: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const { sx, sy } = useContext(TiltContext);
  const x = useTransform(sx, v => (v - 0.5) * -depth);
  const y = useTransform(sy, v => (v - 0.5) * -depth);
  return <motion.div className={`absolute ${className ?? ""}`} style={{ x, y, ...style }}>{children}</motion.div>;
}

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-ink/[0.09] bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.16)] backdrop-blur-md ${className ?? ""}`}>{children}</div>;
}

function Bar({ w, className }: { w: string; className?: string }) {
  return <div className={`h-1.5 rounded-full bg-ink/[0.09] ${className ?? ""}`} style={{ width: w }} />;
}

/* ---------- Pristine Epoxy: attribution system ---------- */
const SOURCES = ["Google Ads", "Meta Ads", "Organic", "GBP", "Referral", "Direct", "Email", "Website form", "Incoming call", "Unknown"];

function Attribution() {
  return (
    <>
      <Layer depth={14} className="inset-[7%_auto_7%_5%] flex w-[30%] flex-col items-start justify-between">
        {SOURCES.map((s, i) => (
          <div key={s} className="flex items-center gap-2 rounded-full border border-ink/[0.09] bg-ink/[0.025] px-2.5 py-1 text-[clamp(8px,1vw,11px)] text-mist">
            <span className="size-1.5 rounded-full" style={{ background: i === 9 ? "#9ca3af" : "#0284c7" }} />{s}
          </div>
        ))}
      </Layer>
      <Layer depth={6} className="inset-[6%_32%_6%_33%]">
        <svg viewBox="0 0 100 200" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
          {SOURCES.map((_, i) => {
            const y = 8 + i * 20.5;
            return <path key={i} d={`M0 ${y} C 50 ${y}, 50 100, 100 100`} fill="none" stroke="url(#ag)" strokeWidth="1" className="pv-flow" style={{ animationDelay: `${i * 0.25}s` }} />;
          })}
          <defs><linearGradient id="ag" x1="0" x2="1"><stop offset="0" stopColor="#0284c7" stopOpacity="0.25" /><stop offset="1" stopColor="#0d9488" stopOpacity="0.95" /></linearGradient></defs>
        </svg>
      </Layer>
      <Layer depth={30} className="right-[5%] top-1/2 w-[34%] -translate-y-1/2">
        <Frame className="p-[6%]">
          <p className="font-mono text-[clamp(7px,0.85vw,10px)] uppercase tracking-[0.16em] text-sky">Contact · attribution</p>
          {[["Lead Channel", "Google Ads"], ["Booking Method", "Website form"], ["First Attribution Source", "Google Ads"]].map(([k, v]) => (
            <div key={k} className="mt-[7%] border-t border-ink/[0.09] pt-[6%]">
              <p className="text-[clamp(7px,0.8vw,10px)] text-dim">{k}</p>
              <p className="text-[clamp(9px,1.05vw,13px)] font-medium text-ink">{v}</p>
            </div>
          ))}
          <p className="mt-[8%] inline-flex rounded-full bg-sky/15 px-2 py-0.5 text-[clamp(7px,0.8vw,10px)] text-sky">source tag ✓</p>
        </Frame>
        <p className="mt-2 text-center font-mono text-[clamp(6px,0.7vw,9px)] text-dim">example contact</p>
      </Layer>
    </>
  );
}

/* ---------- HVAC Snapshot: pipelines + funnel ---------- */
const LEAD = ["New Lead", "Responded", "Booked A Call", "Missed Appointment", "Attended", "Sent Contract", "Close", "Ghosted"];
const CLIENT = ["New Client", "Project Running", "Project Completed", "Ask For Review"];

function Hvac() {
  return (
    <>
      <Layer depth={10} className="inset-[8%_6%_auto_6%]">
        <Frame className="p-[3%]">
          <p className="mb-[2%] font-mono text-[clamp(7px,0.8vw,10px)] uppercase tracking-[0.16em] text-iris">Lead pipeline</p>
          <div className="grid grid-cols-8 gap-[1.2%]">
            {LEAD.map((s, i) => (
              <div key={s} className="rounded-md bg-ink/[0.025] p-[6%]">
                <p className="truncate text-[clamp(6px,0.72vw,9px)] text-mist" title={s}>{s}</p>
                {Array.from({ length: [3, 2, 2, 1, 2, 1, 1, 1][i] }).map((_, k) => (
                  <div key={k} className="mt-[10%] h-[clamp(8px,1.6vw,18px)] rounded bg-ink/[0.045]" style={{ borderLeft: `2px solid ${i === 6 ? "#059669" : i === 7 || i === 3 ? "#e11d48" : "#7c3aed"}` }} />
                ))}
              </div>
            ))}
          </div>
        </Frame>
      </Layer>
      <Layer depth={20} className="inset-[auto_40%_8%_6%]">
        <Frame className="p-[5%]">
          <p className="mb-[4%] font-mono text-[clamp(7px,0.8vw,10px)] uppercase tracking-[0.16em] text-cyan">Client pipeline</p>
          <div className="flex flex-col gap-[6px]">
            {CLIENT.map((s, i) => (
              <div key={s} className="flex items-center gap-2 text-[clamp(7px,0.85vw,11px)] text-ink">
                <span className="grid size-4 place-items-center rounded-full border border-cyan/40 text-[8px] text-cyan">{i + 1}</span>{s}
              </div>
            ))}
          </div>
        </Frame>
      </Layer>
      <Layer depth={34} className="bottom-[6%] right-[6%] w-[30%]">
        <Frame className="overflow-hidden">
          <div className="flex gap-1 border-b border-ink/[0.09] p-[5%]"><span className="size-1.5 rounded-full bg-ink/[0.12]" /><span className="size-1.5 rounded-full bg-ink/[0.12]" /></div>
          <div className="space-y-[6%] p-[8%]">
            <Bar w="70%" className="bg-iris/60" /><Bar w="90%" /><Bar w="60%" />
            <div className="rounded-md border border-ink/[0.09] p-[6%]"><Bar w="100%" /><Bar w="100%" className="mt-[8%]" /><div className="mt-[10%] h-3 rounded bg-iris" /></div>
          </div>
          <p className="pb-[6%] text-center font-mono text-[clamp(6px,0.7vw,9px)] text-dim">landing page · embedded form</p>
        </Frame>
      </Layer>
    </>
  );
}

/* ---------- MassMarket & Goldberg: campaign data ---------- */
function rand(seed: number) { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }

function CampaignData({ project, count, color }: { project: Project; count: number; color: string }) {
  const metrics = project.metrics ?? [];
  return (
    <>
      <Layer depth={8} className="inset-[auto_5%_10%_5%] flex h-[44%] flex-col">
        <p className="mb-1.5 font-mono text-[clamp(7px,0.75vw,10px)] text-mist">{count} non-zero campaigns · bar heights illustrative</p>
        <div className="flex min-h-0 flex-1 items-end gap-[2px]">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${12 + rand(i + count) * 88}%`, background: `linear-gradient(to top, ${color}22, ${color})`, opacity: 0.85 }} />
          ))}
        </div>
      </Layer>
      <Layer depth={28} className="inset-[8%_5%_auto_5%] grid gap-[3%]" style={{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0,1fr))` }}>
        {metrics.map(m => (
          <Frame key={m.label} className="p-[8%]">
            <p className="text-[clamp(7px,0.8vw,10px)] uppercase tracking-[0.14em] text-dim">{m.label}</p>
            <p className="mt-1 text-[clamp(13px,2vw,26px)] font-semibold tracking-tight text-ink">{m.value}</p>
          </Frame>
        ))}
      </Layer>
    </>
  );
}

/* ---------- Lofi Care: landing page recreation ---------- */
function LofiCare() {
  return (
    <>
      <Layer depth={10} className="inset-[7%_22%_7%_5%]">
        <Frame className="h-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/[0.09] px-[4%] py-[2.5%]">
            <div className="flex items-center gap-1.5"><span className="grid size-3.5 place-items-center rounded bg-cyan/80 text-[8px] font-bold text-void">+</span><Bar w="3.5rem" /></div>
            <div className="flex gap-2"><Bar w="2rem" /><Bar w="2rem" /><span className="h-3 w-10 rounded-full bg-cyan/70" /></div>
          </div>
          <div className="grid grid-cols-[1.1fr_1fr] gap-[5%] p-[5%]">
            <div className="space-y-[5%]">
              <div className="h-2.5 w-[88%] rounded bg-ink/35" /><div className="h-2.5 w-[64%] rounded bg-ink/35" />
              <Bar w="92%" /><Bar w="78%" />
              <div className="flex gap-2 pt-[3%]"><span className="h-4 w-16 rounded-full bg-cyan" /><span className="h-4 w-14 rounded-full border border-ink/15" /></div>
            </div>
            <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-cyan/40 via-sky/20 to-iris/30">
              <div className="absolute inset-[18%] rounded-full border border-ink/15" />
              <div className="absolute inset-[34%] rounded-full bg-ink/[0.12] backdrop-blur" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[3%] px-[5%]">
            {[0, 1, 2].map(i => <div key={i} className="rounded-lg border border-ink/[0.09] bg-ink/[0.025] p-[8%]"><span className="mb-2 block size-3 rounded bg-cyan/50" /><Bar w="80%" /><Bar w="60%" className="mt-1.5" /></div>)}
          </div>
        </Frame>
      </Layer>
      <Layer depth={32} className="bottom-[9%] right-[6%] w-[22%]">
        <div className="rounded-[18px] border border-ink/[0.12] bg-white p-[6%] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.16)]">
          <div className="mx-auto mb-[8%] h-1 w-1/3 rounded-full bg-ink/[0.12]" />
          <div className="aspect-[4/5] rounded-xl bg-gradient-to-b from-cyan/35 to-iris/20" />
          <div className="mt-[10%] space-y-[8%]"><Bar w="85%" className="bg-ink/25" /><Bar w="65%" /><div className="h-3 rounded-full bg-cyan" /></div>
        </div>
      </Layer>
      <Layer depth={44} className="right-[4%] top-[10%]">
        <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-1 font-mono text-[clamp(7px,0.8vw,10px)] text-cyan">parallax · 3D tilt · scroll</span>
      </Layer>
    </>
  );
}

/* ---------- Component Gallery: real screenshots ---------- */
function Gallery({ project }: { project: Project }) {
  const imgs = project.images ?? [];
  const pos = ["left-[4%] top-[14%] w-[54%]", "left-[24%] top-[8%] w-[52%]", "right-[4%] top-[20%] w-[52%]"];
  return (
    <>
      {imgs.slice(0, 3).map((im, i) => (
        <Layer key={im.src} depth={10 + i * 14} className={pos[i]}>
          <img src={im.src} alt={im.alt} loading="lazy" decoding="async" className="w-full rounded-lg border border-ink/[0.09] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.16)]" style={{ transform: `rotate(${[-4, 1, 5][i]}deg)` }} />
        </Layer>
      ))}
    </>
  );
}

/* ---------- GHL Troubleshooting Agent ---------- */
const AGENT = ["1. Issue Summary", "2. Likely Root Causes (ranked)", "3. Troubleshooting Steps", "4. Recommended Fix", "5. Testing & QA Checklist", "6. Final Summary"];

function GhlAgent() {
  return (
    <>
      <Layer depth={12} className="inset-[9%_18%_9%_6%]">
        <Frame className="h-full overflow-hidden font-mono">
          <div className="flex items-center gap-1.5 border-b border-ink/[0.09] px-[4%] py-[3%]">
            <span className="size-2 rounded-full bg-[#f87171]/70" /><span className="size-2 rounded-full bg-amber/70" /><span className="size-2 rounded-full bg-[#34d399]/70" />
            <span className="ml-2 text-[clamp(7px,0.8vw,10px)] text-dim">claude — /ghl-troubleshooter</span>
          </div>
          <div className="space-y-[2.5%] p-[5%] text-[clamp(7.5px,0.95vw,12px)]">
            <p className="text-cyan">&gt; Form submissions aren't triggering the workflow</p>
            <p className="text-dim">Collecting missing details in one message…</p>
            {AGENT.map((s, i) => <p key={s} className="text-ink/85" style={{ opacity: 1 - i * 0.08 }}>{s}</p>)}
          </div>
        </Frame>
      </Layer>
      <Layer depth={30} className="bottom-[12%] right-[5%] w-[34%]">
        <Frame className="p-[7%]">
          <p className="text-[clamp(7px,0.8vw,10px)] uppercase tracking-[0.14em] text-dim">Test result</p>
          <p className="mt-1 text-[clamp(10px,1.2vw,14px)] font-medium text-amber">Not tested yet</p>
          <p className="mt-2 text-[clamp(7px,0.8vw,10px)] text-mist">Never marked "fixed" without a real test.</p>
        </Frame>
      </Layer>
    </>
  );
}

export function ProjectVisual({ project }: { project: Project }) {
  const body = (() => {
    switch (project.visual) {
      case "attribution": return <Attribution />;
      case "hvac": return <Hvac />;
      case "massmarket": return <CampaignData project={project} count={46} color={project.accent} />;
      case "goldberg": return <CampaignData project={project} count={79} color={project.accent} />;
      case "lofi-care": return <LofiCare />;
      case "gallery": return <Gallery project={project} />;
      case "ghl-agent": return <GhlAgent />;
    }
  })();
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: `radial-gradient(80% 70% at 70% 20%, ${project.accent}26, transparent 60%), radial-gradient(60% 60% at 10% 100%, ${project.accent}14, transparent 60%)` }} />
      <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "radial-gradient(80% 80% at 50% 50%, #000 40%, transparent 100%)" }} />
      {body}
    </div>
  );
}
