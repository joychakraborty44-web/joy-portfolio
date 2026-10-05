import * as THREE from "three";
import { PANEL_META } from "./panels";

/* Canvas-drawn "screens" for the hero panels. Each one shows a real slice of
   Joy's work: paid ads, a GoHighLevel pipeline, attribution and an AI prompt.
   Drawn once at startup, so they cost nothing per frame. */

const W = 640, H = 420;

function base(title: string, tag: string, accent: string) {
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  // panel body
  const grd = g.createLinearGradient(0, 0, W, H);
  grd.addColorStop(0, "#ffffff");
  grd.addColorStop(1, "#f4f5f9");
  g.save();
  g.shadowColor = "rgba(16,24,40,0.16)"; g.shadowBlur = 30; g.shadowOffsetY = 12;
  g.fillStyle = grd;
  roundRect(g, 18, 12, W - 36, H - 40, 30); g.fill();
  g.restore();
  g.strokeStyle = "rgba(20,22,27,0.09)"; g.lineWidth = 2;
  roundRect(g, 18, 12, W - 36, H - 40, 30); g.stroke();
  // header
  g.fillStyle = accent;
  g.beginPath(); g.arc(44, 46, 7, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#14161b"; g.font = "600 26px 'Inter Tight Variable', system-ui, sans-serif";
  g.fillText(title, 64, 55);
  g.font = "500 16px 'JetBrains Mono Variable', monospace"; g.fillStyle = "rgba(20,22,27,0.45)";
  const tw = g.measureText(tag).width;
  g.fillText(tag, W - 40 - tw, 54);
  g.fillStyle = "rgba(20,22,27,0.07)"; g.fillRect(36, 80, W - 72, 2);
  return { c, g };
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function texture(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function ads() {
  const { c, g } = base("Paid lead generation", "META · GOOGLE", "#db2777");
  // two stat tiles
  const tiles = [["Campaigns", "46"], ["Lead-form CPL", "$22.16"]];
  tiles.forEach(([k, v], i) => {
    const x = 36 + i * 290;
    g.fillStyle = "rgba(20,22,27,0.035)"; roundRect(g, x, 104, 272, 96, 18); g.fill();
    g.fillStyle = "rgba(20,22,27,0.5)"; g.font = "500 15px 'JetBrains Mono Variable', monospace"; g.fillText(k.toUpperCase(), x + 20, 136);
    g.fillStyle = "#14161b"; g.font = "600 40px 'Inter Tight Variable', sans-serif"; g.fillText(v, x + 20, 182);
  });
  // illustrative bars
  const hs = [70, 110, 90, 150, 120, 175, 140, 190, 160];
  hs.forEach((h, i) => {
    const x = 44 + i * 63, y = 380 - h;
    const gr = g.createLinearGradient(0, y, 0, 380);
    gr.addColorStop(0, "#db2777"); gr.addColorStop(1, "rgba(88,80,236,0.18)");
    g.fillStyle = gr; roundRect(g, x, y, 40, h, 8); g.fill();
  });
  return texture(c);
}

function pipeline() {
  const { c, g } = base("Lead pipeline", "GOHIGHLEVEL", "#7c3aed");
  const cols = ["New Lead", "Responded", "Booked", "Attended"];
  cols.forEach((name, i) => {
    const x = 36 + i * 146;
    g.fillStyle = "rgba(20,22,27,0.55)"; g.font = "600 15px 'Inter Tight Variable', sans-serif"; g.fillText(name, x + 4, 116);
    const n = [3, 2, 2, 1][i];
    for (let k = 0; k < n; k++) {
      const y = 132 + k * 82;
      g.fillStyle = "rgba(20,22,27,0.045)"; roundRect(g, x, y, 132, 70, 14); g.fill();
      g.fillStyle = ["#7c3aed", "#0284c7", "#0d9488", "#059669"][i]; roundRect(g, x + 12, y + 14, 44, 8, 4); g.fill();
      g.fillStyle = "rgba(20,22,27,0.12)"; roundRect(g, x + 12, y + 32, 96, 7, 3.5); g.fill();
      roundRect(g, x + 12, y + 47, 70, 7, 3.5); g.fill();
    }
  });
  return texture(c);
}

function attribution() {
  const { c, g } = base("First attribution source", "CRM", "#0284c7");
  const sources = ["Google Ads", "Meta Ads", "Organic", "GBP", "Referral", "Call"];
  sources.forEach((s, i) => {
    const y = 112 + i * 47;
    g.fillStyle = "rgba(20,22,27,0.045)"; roundRect(g, 36, y, 210, 36, 18); g.fill();
    g.fillStyle = "#14161b"; g.font = "500 17px 'Inter Tight Variable', sans-serif"; g.fillText(s, 56, y + 24);
    // connector
    g.strokeStyle = "rgba(2,132,199,0.5)"; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(246, y + 18); g.bezierCurveTo(330, y + 18, 340, 252, 410, 252); g.stroke();
  });
  g.fillStyle = "rgba(2,132,199,0.08)"; roundRect(g, 410, 200, 196, 104, 22); g.fill();
  g.strokeStyle = "rgba(2,132,199,0.5)"; g.lineWidth = 2; roundRect(g, 410, 200, 196, 104, 22); g.stroke();
  g.fillStyle = "#14161b"; g.font = "600 20px 'Inter Tight Variable', sans-serif"; g.fillText("Lead Channel", 432, 240);
  g.fillStyle = "rgba(20,22,27,0.55)"; g.font = "500 15px 'JetBrains Mono Variable', monospace"; g.fillText("source tag ✓", 432, 274);
  return texture(c);
}

function prompt() {
  const { c, g } = base("Claude Code", "AI WORKFLOW", "#0d9488");
  const lines: [string, string][] = [
    ["#0d9488", "> troubleshoot GHL workflow"],
    ["rgba(20,22,27,0.72)", "1. Understand the issue"],
    ["rgba(20,22,27,0.72)", "2. Rank likely root causes"],
    ["rgba(20,22,27,0.72)", "3. Step-by-step checks"],
    ["rgba(20,22,27,0.72)", "4. Safe fix + side effects"],
    ["rgba(20,22,27,0.72)", "5. QA checklist"],
    ["#b45309", "Test result: not tested yet"],
  ];
  g.font = "500 19px 'JetBrains Mono Variable', monospace";
  lines.forEach(([col, t], i) => {
    g.fillStyle = "rgba(20,22,27,0.28)"; g.fillText(String(i + 1).padStart(2, "0"), 40, 124 + i * 40);
    g.fillStyle = col; g.fillText(t, 84, 124 + i * 40);
  });
  return texture(c);
}

const MAKERS = { ads, pipeline, attribution, ai: prompt } as const;
export const PANELS = PANEL_META.map(m => ({ ...m, make: MAKERS[m.id] }));

/** Soft round sprite for glow points. */
export function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.25, "rgba(255,255,255,0.55)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
