import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { frame, scrollToId, setUi, useUi } from "../lib/store";
import { skills, systemFlow } from "../content";
import { PANELS, glowTexture } from "./textures";

/* ------------------------------------------------------------
   One persistent WebGL scene behind the whole page.
   The Director reads where each section sits in the viewport and
   writes blend weights into `phase`; every object reads them, so
   the scene morphs with the scroll instead of cutting between
   separate canvases.
   ------------------------------------------------------------ */

/** 1 = full quality; lowered automatically when the device can't keep up. */
export const quality = { level: 2 };

const phase = {
  hero: 0, // 0 → 1 while the hero scrolls away
  field: 1,
  sphere: 0, // skills
  ring: 0, // contact
  dim: 0, // content-heavy sections fade the particles back
  skillsQuat: new THREE.Quaternion(),
  skillsCenter: new THREE.Vector3(2.4, 0, 0),
  skillsScale: 1,
  ringCenter: new THREE.Vector3(0, 0.2, -2.5),
};

const smooth = (x: number) => x * x * (3 - 2 * x);

/* Skill labels are plain DOM buttons outside the canvas; the scene writes
   their screen position each frame (cheaper and cleaner than a React root per label). */
const labelEls: (HTMLButtonElement | null)[] = [];
function presence(el: HTMLElement | null, vh: number) {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const center = r.top + r.height / 2;
  const reach = vh * 0.55 + r.height / 2;
  return smooth(Math.max(0, Math.min(1, 1 - Math.abs(center - vh / 2) / reach)) ** 0.7);
}

function Director() {
  const els = useRef<Record<string, HTMLElement | null>>({});
  const invalidate = useThree(s => s.invalidate);
  const setDpr = useThree(s => s.setDpr);
  const perf = useRef({ t: 0, frames: 0, slow: 0 });
  useEffect(() => {
    ["hero", "skills", "agents", "work", "web", "experience", "process", "contact"].forEach(id => { els.current[id] = document.getElementById(id); });
    const onScroll = () => invalidate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [invalidate]);

  useFrame((_, dt) => {
    // adaptive quality: sample ~2s windows; two slow windows in a row step quality down
    if (!frame.reduced && quality.level > 0 && document.visibilityState === "visible") {
      const p = perf.current;
      p.t += dt; p.frames++;
      if (p.t > 2) {
        const fps = p.frames / p.t;
        p.slow = fps < 40 ? p.slow + 1 : 0;
        if (p.slow >= 2) { quality.level--; p.slow = 0; setDpr(quality.level === 1 ? 1 : 0.75); }
        p.t = 0; p.frames = 0;
      }
    }
    const vh = window.innerHeight, e = els.current;
    const hero = e.hero;
    phase.hero = hero ? Math.max(0, Math.min(1, window.scrollY / Math.max(1, hero.offsetHeight * 0.9))) : 0;
    const s = presence(e.skills, vh), r = presence(e.contact, vh);
    const total = Math.max(1, s + r);
    phase.sphere = s / total * Math.min(1, s + r);
    phase.ring = r / total * Math.min(1, s + r);
    phase.field = 1 - phase.sphere - phase.ring;
    phase.dim = Math.max(presence(e.agents, vh) * 0.75, presence(e.work, vh), presence(e.web, vh) * 0.9, presence(e.experience, vh) * 0.8, presence(e.process, vh) * 0.7);
    if (frame.mobile) { phase.skillsCenter.set(0, 1.5, -1.5); phase.skillsScale = 0.72; phase.ringCenter.set(0, 0.6, -3); }
    else { phase.skillsCenter.set(2.55, -0.1, 0); phase.skillsScale = 0.8; phase.ringCenter.set(2.4, -0.1, -3); }
  }, -2);
  return null;
}

function CameraRig() {
  const { camera } = useThree();
  const sp = useRef({ x: 0, y: 0 });
  useFrame((_, dt) => {
    const k = frame.reduced ? 1 : 1 - Math.exp(-dt * 3);
    const tx = frame.reduced || frame.mobile ? 0 : frame.pointer.x;
    const ty = frame.reduced || frame.mobile ? 0 : frame.pointer.y;
    sp.current.x += (tx - sp.current.x) * k;
    sp.current.y += (ty - sp.current.y) * k;
    camera.position.set(sp.current.x * 0.55, sp.current.y * 0.35, 8);
    camera.lookAt(0, 0, 0);
  }, -1);
  return null;
}

/* ---------------- particles ---------------- */

const particleVert = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float depth = -mv.z;
    gl_Position = projectionMatrix * mv;
    // depth of field: points far from the focus plane grow and soften
    float blur = clamp(abs(depth - 8.0) / 6.5, 0.0, 1.0);
    float s = uSize * (0.55 + fract(aSeed * 7.13) * 0.9);
    gl_PointSize = s * uPixelRatio * (1.0 + blur * 2.4) * (10.0 / max(depth, 0.5));
    vAlpha = mix(0.95, 0.16, blur) * (0.6 + 0.4 * sin(uTime * 1.2 + aSeed * 40.0));
    vSeed = aSeed;
  }
`;
const particleFrag = /* glsl */ `
  uniform float uOpacity;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    vec3 c = mix(vec3(0.37, 0.92, 0.83), vec3(0.51, 0.55, 0.97), smoothstep(0.0, 0.8, vSeed));
    c = mix(c, vec3(0.91, 0.47, 0.98), step(0.88, vSeed));
    gl_FragColor = vec4(c, a * vAlpha * uOpacity);
  }
`;

function Particles({ count }: { count: number }) {
  const geo = useRef<THREE.BufferGeometry>(null);
  const { gl } = useThree();
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const field = new Float32Array(count * 3);
    const sphere = new Float32Array(count * 3);
    const ring = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      field[i3] = (Math.random() - 0.5) * 24;
      field[i3 + 1] = (Math.random() - 0.5) * 15;
      field[i3 + 2] = 3 - Math.random() * 15;
      const y = 1 - (i / (count - 1)) * 2, rr = Math.sqrt(1 - y * y), th = golden * i;
      const R = 2.15 + (Math.random() - 0.5) * 0.12;
      sphere[i3] = Math.cos(th) * rr * R;
      sphere[i3 + 1] = y * R;
      sphere[i3 + 2] = Math.sin(th) * rr * R;
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.05;
      const g = (Math.random() + Math.random() + Math.random() - 1.5) * 0.35;
      const RR = 3.1 + g;
      ring[i3] = Math.cos(a) * RR;
      ring[i3 + 1] = Math.sin(a) * RR;
      ring[i3 + 2] = (Math.random() - 0.5) * 0.6;
      pos[i3] = field[i3]; pos[i3 + 1] = field[i3 + 1]; pos[i3 + 2] = field[i3 + 2];
      seed[i] = Math.random();
    }
    return { pos, field, sphere, ring, seed };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
    uSize: { value: frame.mobile ? 2.6 : 3.1 },
    uOpacity: { value: 1 },
  }), [gl]);

  useFrame((state, dt) => {
    const g = geo.current; if (!g) return;
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = frame.reduced ? 0 : t;
    uniforms.uOpacity.value += ((1 - phase.dim * 0.6) - uniforms.uOpacity.value) * (frame.reduced ? 1 : 0.08);
    const k = frame.reduced ? 1 : 1 - Math.exp(-dt * 2.2);
    const { pos, field, sphere, ring } = data;
    const wf = phase.field, ws = phase.sphere, wr = phase.ring;
    const q = phase.skillsQuat, sc = phase.skillsCenter, ss = phase.skillsScale, rc = phase.ringCenter;
    // quaternion rotation, unrolled
    const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
    const ringRot = frame.reduced ? 0 : t * 0.05, cr = Math.cos(ringRot), sr = Math.sin(ringRot);
    const drift = frame.reduced ? 0 : 1;
    const heroLift = phase.hero * 3;
    for (let i = 0, n = pos.length; i < n; i += 3) {
      // field drifts upward with the hero scroll for a parallax feel
      const fx = field[i], fy = field[i + 1] + heroLift * (0.4 + (i % 7) * 0.08), fz = field[i + 2];
      // sphere point rotated by the skills quaternion
      const vx = sphere[i] * ss, vy = sphere[i + 1] * ss, vz = sphere[i + 2] * ss;
      const ix = qw * vx + qy * vz - qz * vy, iy = qw * vy + qz * vx - qx * vz, iz = qw * vz + qx * vy - qy * vx, iw = -qx * vx - qy * vy - qz * vz;
      const sx = ix * qw + iw * -qx + iy * -qz - iz * -qy + sc.x;
      const sy = iy * qw + iw * -qy + iz * -qx - ix * -qz + sc.y;
      const sz = iz * qw + iw * -qz + ix * -qy - iy * -qx + sc.z;
      // ring point
      const rx = ring[i] * cr - ring[i + 1] * sr + rc.x, ry = ring[i] * sr + ring[i + 1] * cr + rc.y, rz = ring[i + 2] + rc.z;
      const wob = drift * Math.sin(t * 0.6 + i) * 0.04;
      const tx = fx * wf + sx * ws + rx * wr + wob;
      const ty = fy * wf + sy * ws + ry * wr;
      const tz = fz * wf + sz * ws + rz * wr;
      pos[i] += (tx - pos[i]) * k;
      pos[i + 1] += (ty - pos[i + 1]) * k;
      pos[i + 2] += (tz - pos[i + 2]) * k;
    }
    (g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    const draw = quality.level === 0 ? Math.floor(count * 0.45) : count;
    if (g.drawRange.count !== draw) g.setDrawRange(0, draw);
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[data.seed, 1]} />
      </bufferGeometry>
      <shaderMaterial vertexShader={particleVert} fragmentShader={particleFrag} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ---------------- hero: the system core ---------------- */

const coreVert = /* glsl */ `
  varying vec3 vNormal; varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const coreFrag = /* glsl */ `
  uniform float uTime; uniform float uHover;
  varying vec3 vNormal; varying vec3 vView;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
    vec3 a = vec3(0.37, 0.92, 0.83), b = vec3(0.51, 0.55, 0.97), c = vec3(0.91, 0.47, 0.98);
    float band = 0.5 + 0.5 * sin(vNormal.y * 4.0 + uTime * 0.8);
    vec3 col = mix(mix(a, b, band), c, f * 0.6);
    float core = 0.10 + 0.06 * sin(uTime * 1.6);
    gl_FragColor = vec4(col * (f * (1.4 + uHover) + core), 0.92);
  }
`;

const FLOW_COLORS = ["#38bdf8", "#5eead4", "#a78bfa", "#38bdf8", "#818cf8", "#5eead4", "#e879f9", "#fbbf24"];

function HeroSystem() {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.LineSegments>(null);
  const loop = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Sprite>(null);
  const panelRefs = useRef<(THREE.Group | null)[]>([]);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const hover = useRef<string | null>(null);
  const lastStep = useRef(-1);
  const glow = useMemo(() => glowTexture(), []);
  const textures = useMemo(() => PANELS.map(p => p.make()), []);
  const shellGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.05, 1)), []);
  const coreUniforms = useMemo(() => ({ uTime: { value: 0 }, uHover: { value: 0 } }), []);
  const { camera } = useThree();

  const nodes = useMemo(() => systemFlow.map((_, i) => {
    const a = (i / systemFlow.length) * Math.PI * 2 - Math.PI / 2;
    return new THREE.Vector3(Math.cos(a) * 1.75, 0, Math.sin(a) * 1.75);
  }), []);
  const loopLine = useMemo(() => {
    const pts = Array.from({ length: 129 }, (_, i) => { const a = (i / 128) * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * 1.75, 0, Math.sin(a) * 1.75); });
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: "#5eead4", transparent: true, opacity: 0.22 }));
  }, []);

  useFrame((state, dt) => {
    const g = group.current; if (!g) return;
    const t = frame.reduced ? 0 : state.clock.elapsedTime;
    const h = phase.hero;
    const k = frame.reduced ? 1 : 1 - Math.exp(-dt * 4);
    const base = frame.mobile ? { x: 0, y: 1.55, z: -2.2, s: 0.62 } : { x: 2.55, y: 0.05, z: -0.4, s: 0.92 };
    g.visible = h < 0.99;
    if (!g.visible) return;
    g.position.set(base.x, base.y + h * 2.6, base.z - h * 1.6);
    g.scale.setScalar(base.s * (1 - h * 0.25));
    const px = frame.reduced ? 0 : frame.pointer.x, py = frame.reduced ? 0 : frame.pointer.y;
    g.rotation.y += ((px * 0.35 + h * 1.4) - g.rotation.y) * k;
    g.rotation.x += ((-py * 0.18 + h * 0.5) - g.rotation.x) * k;

    coreUniforms.uTime.value = t;
    coreUniforms.uHover.value += ((hover.current ? 0.8 : 0) - coreUniforms.uHover.value) * k;
    if (shell.current) { shell.current.rotation.y = t * 0.18; shell.current.rotation.z = t * 0.07; }

    // the system loop: a pulse travels Traffic → … → Reporting
    if (loop.current) loop.current.rotation.y = t * 0.06;
    const n = systemFlow.length;
    const prog = frame.reduced ? 0 : (t * 0.45) % n;
    const step = Math.floor(prog);
    if (step !== lastStep.current) { lastStep.current = step; setUi({ flowStep: step }); }
    const a = nodes[step], b = nodes[(step + 1) % n], f = smooth(prog - step);
    if (pulse.current) {
      pulse.current.position.lerpVectors(a, b, f);
      pulse.current.position.setLength(1.75);
    }
    nodeRefs.current.forEach((m, i) => {
      if (!m) return;
      const on = i === step ? 1 : 0;
      const target = 0.06 + on * 0.05;
      m.scale.setScalar(m.scale.x + (target - m.scale.x) * k);
    });

    // floating screens orbit at different depths and explode outward on scroll
    panelRefs.current.forEach((p, i) => {
      if (!p) return;
      const ang = (i / PANELS.length) * Math.PI * 2 + 0.6 + t * 0.07;
      // a depth ellipse: narrow in x so the screens stay clear of the hero copy
      const rx = (frame.mobile ? 2.2 : 1.55) + h * 2.6, rz = 2.5 + h * 1.5;
      const yOff = [1.05, -0.95, 0.4, -0.3][i];
      p.position.set(Math.cos(ang) * rx, yOff + Math.sin(t * 0.8 + i * 1.7) * 0.08 + h * (i % 2 ? -1.2 : 1.2), Math.sin(ang) * rz);
      // face the camera, with a slight lean toward the cursor
      p.quaternion.copy(camera.quaternion);
      p.rotateY(-px * 0.25 + Math.sin(ang) * 0.25);
      p.rotateX(py * 0.15);
      const isHover = hover.current === PANELS[i].id;
      const target = (isHover ? 1.14 : 1) * (1 - h * 0.35);
      p.scale.setScalar(p.scale.x + (target - p.scale.x) * k);
      const mat = (p.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - h * 1.6) * (hover.current && !isHover ? 0.55 : 1);
    });
  });

  const setHover = (id: string | null) => {
    hover.current = id;
    setUi({ hoverPanel: id });
    document.body.style.cursor = id ? "pointer" : "";
  };

  return (
    <group ref={group}>
      <sprite scale={[4.2, 4.2, 1]}>
        <spriteMaterial map={glow} color="#7c83f7" transparent opacity={0.32} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh>
        <icosahedronGeometry args={[0.72, 5]} />
        <shaderMaterial vertexShader={coreVert} fragmentShader={coreFrag} uniforms={coreUniforms} transparent />
      </mesh>
      <lineSegments ref={shell} geometry={shellGeo}>
        <lineBasicMaterial color="#9aa3ff" transparent opacity={0.28} />
      </lineSegments>

      <group ref={loop} rotation={[0.42, 0, 0.12]}>
        <primitive object={loopLine} />
        {nodes.map((p, i) => (
          <mesh key={i} position={p} scale={0.06} ref={el => { nodeRefs.current[i] = el; }}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={FLOW_COLORS[i]} toneMapped={false} />
          </mesh>
        ))}
        <sprite ref={pulse} scale={[0.55, 0.55, 1]}>
          <spriteMaterial map={glow} color="#ffffff" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      </group>

      {PANELS.map((panel, i) => (
        <group key={panel.id} ref={el => { panelRefs.current[i] = el; }}>
          <mesh
            onPointerOver={e => { if (frame.mobile) return; e.stopPropagation(); setHover(panel.id); }}
            onPointerOut={() => { if (hover.current === panel.id) setHover(null); }}
            onClick={e => { e.stopPropagation(); setHover(null); setUi({ activeSkill: panel.skill }); scrollToId("skills"); }}
          >
            <planeGeometry args={[1.55, 1.02]} />
            <meshBasicMaterial map={textures[i]} transparent toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------------- skills constellation ---------------- */

function SkillsSphere() {
  const group = useRef<THREE.Group>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const halo = useRef<THREE.Sprite>(null);
  const active = useUi(s => s.activeSkill);
  const [hover, setHover] = useState<string | null>(null);
  const glow = useMemo(() => glowTexture(), []);
  const front = useMemo(() => new THREE.Vector3(0, 0.12, 1).normalize(), []);
  const tmpQ = useMemo(() => new THREE.Quaternion(), []);
  const tilt = useMemo(() => new THREE.Quaternion(), []);
  const euler = useMemo(() => new THREE.Euler(), []);
  const world = useMemo(() => new THREE.Vector3(), []);
  const { camera, size } = useThree();

  const dirs = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    return skills.map((_, i) => {
      const y = 1 - (i / (skills.length - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
      return new THREE.Vector3(Math.cos(th) * r, y * 0.85, Math.sin(th) * r).normalize();
    });
  }, []);
  const lineGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    dirs.forEach((a, i) => {
      const near = dirs.map((b, j) => ({ j, d: a.distanceTo(b) })).filter(o => o.j !== i).sort((p, q) => p.d - q.d).slice(0, 2);
      near.forEach(o => { if (o.j > i) pts.push(a.clone().multiplyScalar(2.2), dirs[o.j].clone().multiplyScalar(2.2)); });
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [dirs]);

  useFrame((state, dt) => {
    const g = group.current; if (!g) return;
    const w = phase.sphere;
    g.visible = w > 0.01;
    g.position.copy(phase.skillsCenter);
    const k = frame.reduced ? 1 : 1 - Math.exp(-dt * 3.2);
    // bring the active skill to the front, then lean with the cursor
    const idx = skills.findIndex(s => s.id === active);
    tmpQ.setFromUnitVectors(dirs[idx], front);
    const t = frame.reduced ? 0 : state.clock.elapsedTime;
    euler.set(frame.reduced ? 0 : -frame.pointer.y * 0.25 + Math.sin(t * 0.4) * 0.04, frame.reduced ? 0 : frame.pointer.x * 0.35, 0);
    tilt.setFromEuler(euler);
    tmpQ.premultiply(tilt);
    g.quaternion.slerp(tmpQ, k);
    phase.skillsQuat.copy(g.quaternion);
    g.scale.setScalar(phase.skillsScale * (0.75 + 0.25 * w));
    if (lines.current) (lines.current.material as THREE.LineBasicMaterial).opacity = 0.32 * w;
    nodeRefs.current.forEach((m, i) => {
      if (!m) return;
      const on = skills[i].id === active, hv = skills[i].id === hover;
      const target = on ? 1.45 : hv ? 1.3 : 1;
      m.scale.setScalar(m.scale.x + (target - m.scale.x) * k);
      (m.material as THREE.MeshBasicMaterial).opacity = w;
    });
    if (halo.current) {
      halo.current.position.copy(dirs[idx]).multiplyScalar(2.2);
      (halo.current.material as THREE.SpriteMaterial).opacity = 0.9 * w;
      const s = 0.9 + Math.sin(t * 2.4) * 0.08;
      halo.current.scale.set(s, s, 1);
    }
    // project each node to the screen and move its DOM label there
    labelEls.forEach((el, i) => {
      if (!el) return;
      const m = nodeRefs.current[i];
      if (!m || w < 0.02) { el.style.opacity = "0"; el.style.pointerEvents = "none"; return; }
      m.getWorldPosition(world);
      const facing = world.z - g.position.z; // nodes on the far side of the sphere fade back
      world.project(camera);
      const x = (world.x * 0.5 + 0.5) * size.width, y = (-world.y * 0.5 + 0.5) * size.height - 24;
      const on = skills[i].id === active;
      const depthFade = 0.35 + 0.65 * Math.max(0, Math.min(1, (facing / 2.2 + 1) / 2));
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      el.style.opacity = String(w * (on ? 1 : 0.7 * depthFade));
      el.style.pointerEvents = w > 0.5 ? "auto" : "none";
    });
  });

  return (
    <group ref={group}>
      <lineSegments ref={lines} geometry={lineGeo}>
        <lineBasicMaterial color="#8b93ff" transparent opacity={0} />
      </lineSegments>
      <sprite ref={halo}>
        <spriteMaterial map={glow} color="#5eead4" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      {skills.map((s, i) => (
        <mesh
          key={s.id}
          position={dirs[i].clone().multiplyScalar(2.2)}
          ref={el => { nodeRefs.current[i] = el; }}
          onPointerOver={e => { e.stopPropagation(); setHover(s.id); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHover(null); document.body.style.cursor = ""; }}
          onClick={e => { e.stopPropagation(); setUi({ activeSkill: s.id }); }}
        >
          <sphereGeometry args={[0.06, 20, 20]} />
          <meshBasicMaterial color={s.id === active ? "#5eead4" : "#c7ccff"} transparent toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- contact portal ---------------- */

function Portal() {
  const group = useRef<THREE.Group>(null);
  const a = useRef<THREE.Mesh>(null), b = useRef<THREE.Mesh>(null);
  const glow = useMemo(() => glowTexture(), []);
  useFrame((state, dt) => {
    const g = group.current; if (!g) return;
    const w = phase.ring;
    g.visible = w > 0.01;
    if (!g.visible) return;
    const t = frame.reduced ? 0 : state.clock.elapsedTime;
    const k = frame.reduced ? 1 : 1 - Math.exp(-dt * 3);
    g.position.copy(phase.ringCenter);
    g.scale.setScalar(0.6 + 0.4 * w);
    g.rotation.x += ((frame.reduced ? 0 : frame.pointer.y * 0.3) - g.rotation.x) * k;
    g.rotation.y += ((frame.reduced ? 0 : frame.pointer.x * 0.4) - g.rotation.y) * k;
    if (a.current) { a.current.rotation.z = t * 0.2; (a.current.material as THREE.MeshBasicMaterial).opacity = 0.8 * w; }
    if (b.current) { b.current.rotation.z = -t * 0.13; b.current.rotation.x = 0.35 + Math.sin(t * 0.5) * 0.1; (b.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * w; }
  });
  return (
    <group ref={group}>
      <mesh ref={a}><torusGeometry args={[3.1, 0.014, 12, 240]} /><meshBasicMaterial color="#5eead4" transparent toneMapped={false} /></mesh>
      <mesh ref={b}><torusGeometry args={[2.55, 0.01, 12, 240]} /><meshBasicMaterial color="#e879f9" transparent toneMapped={false} /></mesh>
      <sprite scale={[7, 7, 1]}><spriteMaterial map={glow} color="#6d63f2" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
    </group>
  );
}

function SkillLabels() {
  const active = useUi(s => s.activeSkill);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {skills.map((s, i) => (
        <button
          key={s.id}
          ref={el => { labelEls[i] = el; }}
          type="button"
          tabIndex={-1}
          onClick={() => setUi({ activeSkill: s.id })}
          className={`absolute left-0 top-0 whitespace-nowrap rounded-full border px-3 py-1 text-[12.5px] font-medium backdrop-blur-md transition-colors duration-300 ${s.id === active ? "border-cyan/60 bg-cyan/15 text-white" : "border-white/10 bg-black/45 text-mist hover:text-white"}`}
          style={{ opacity: 0 }}
        >
          {s.short}
        </button>
      ))}
    </div>
  );
}

export default function Experience() {
  const reduced = frame.reduced, mobile = frame.mobile;
  return (
    <>
    <Canvas
      className="!fixed inset-0"
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      dpr={[1, mobile ? 1.5 : 1.75]}
      camera={{ position: [0, 0, 8], fov: 40, near: 0.1, far: 60 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      eventSource={document.getElementById("root")!}
      eventPrefix="client"
      onCreated={() => setUi({ sceneReady: true })}
      aria-hidden="true"
    >
      <Director />
      <CameraRig />
      <Particles count={mobile ? 1100 : 2600} />
      <HeroSystem />
      <SkillsSphere />
      <Portal />
    </Canvas>
    <SkillLabels />
    </>
  );
}

// keep the pointer in sync even before the scene mounts
if (typeof window !== "undefined") {
  window.addEventListener("pointermove", e => {
    frame.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    frame.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });
}
