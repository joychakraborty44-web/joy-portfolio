# Joy Chakraborty — Portfolio

Interactive portfolio for **Joy Chakraborty, Automation & CRM Specialist** — *I build systems that connect marketing, automation, AI and technology.*

Built with React, TypeScript, Tailwind CSS, Framer Motion, Lenis and Three.js (React Three Fiber).

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

Deploys to Vercel or any static host as a standard Vite app (build command `npm run build`, output `dist`).

## Edit the content

All text, projects, skills, timeline and contact details live in **`src/content.ts`**.

- **Contact details are placeholders** (`you@example.com`, `#` links) — replace them before publishing.
- **Accuracy rule:** every fact comes from Joy's own brief. Web builds are labelled as LofiStack team projects. Add real CRM / campaign screenshots to a project's `images` array (files in `public/projects/`).
- The contact form has no backend: it opens the visitor's email app with the message filled in. Connect a form service if you want submissions stored.

## How it's built

- **One persistent 3D scene** (`src/three/Experience.tsx`) sits behind the page. A director reads each section's position every frame and blends the scene: the hero "system core" with floating screens, a skills constellation that turns to the selected skill, and a contact portal. Particles morph between these formations.
- **Performance:** three.js loads in a separate chunk after first paint; device pixel ratio is capped; quality steps down automatically (resolution, then particle count) if the frame rate drops; the scene falls back to a CSS backdrop without WebGL.
- **Accessibility:** keyboard-navigable tabs and dialogs, focus management, skip link, visible focus rings, and full `prefers-reduced-motion` support (no smooth-scroll inertia, no pinned scroll sections, static 3D).

## Structure

```
src/
  content.ts            all site content
  App.tsx               layout, smooth scroll, section tracking
  three/                3D scene + canvas-drawn panel textures
  sections/             Hero, About, Skills, AIAgents, Projects, WebBuilds, Experience, Process, Contact
  visuals/              layered project previews (attribution flow, pipelines, campaign data…)
  components/           motion primitives (text reveal, magnetic, tilt), nav, loader, cursor
public/projects/        real screenshots (component gallery, live team websites)
```
