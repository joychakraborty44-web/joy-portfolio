/* ============================================================
   All site content lives here. Edit this file to update the site.

   Accuracy rule: every fact below comes from Joy's own brief.
   Nothing is invented — where a detail wasn't provided (dates,
   screenshots, contact links) it is a clearly marked placeholder.
   ============================================================ */

export const profile = {
  name: "Joy Chakraborty",
  firstName: "Joy",
  lastName: "Chakraborty",
  title: "Automation & CRM Specialist",
  role: "Media Buyer & Automation Engineer",
  company: "LofiStack",
  companyNote: "US-based digital marketing agency",
  location: "Bangladesh",
  experience: "3+ years",
  statement: "I build systems that connect marketing, automation, AI and technology.",
  intro:
    "Paid ads, CRM, attribution and automation — built as one connected system, then tested until every lead lands where it should.",
  identities: [
    "GoHighLevel Specialist",
    "Marketing Automation",
    "Funnel Builder",
    "Paid Ads Specialist",
    "CRM & Attribution",
    "AI-assisted Marketing",
  ],
  traits: ["Technical", "Detail-oriented", "Curious", "Practical", "Results-oriented", "Always learning"],
};

/* The end-to-end system Joy works across — drives the hero 3D loop. */
export const systemFlow = [
  "Traffic",
  "Lead",
  "CRM",
  "Attribution",
  "Automation",
  "Appointment",
  "Follow-up",
  "Reporting",
] as const;

/* Placeholder contact details — replace before publishing. */
export const contact = {
  email: "you@example.com", // PLACEHOLDER
  links: [
    { label: "LinkedIn", href: "#", placeholder: true }, // PLACEHOLDER
    { label: "GitHub", href: "#", placeholder: true }, // PLACEHOLDER
    { label: "Upwork", href: "#", placeholder: true }, // PLACEHOLDER
  ],
};

export const tools = [
  "GoHighLevel",
  "Meta Ads Manager",
  "Google Ads",
  "Google Tag Manager",
  "Google Analytics 4",
  "CallRail",
  "Google Business Profile",
  "Claude",
  "Claude Code",
  "GitHub",
  "Vercel",
  "HTML / CSS",
  "React",
  "TypeScript",
  "Tailwind CSS",
];

export type SkillId = "ai" | "ghl" | "meta" | "google" | "seo" | "funnels" | "crm" | "web";

export type Skill = {
  id: SkillId;
  name: string;
  short: string;
  summary: string;
  items: string[];
  tools: string[];
};

export const skills: Skill[] = [
  {
    id: "ai",
    name: "AI & Automation",
    short: "AI",
    summary: "AI-assisted workflows and development — prompting, Claude Code and MCP-based tooling.",
    items: ["Claude / Claude Code", "AI-assisted development", "AI prompting", "MCP-based workflows", "Exploring Meta MCP & Google Ads MCP", "AI workflow research"],
    tools: ["Claude", "Claude Code"],
  },
  {
    id: "ghl",
    name: "GoHighLevel",
    short: "GHL",
    summary: "CRM builds inside GoHighLevel — pipelines, workflows, forms and appointment flows.",
    items: ["CRM setup", "Workflow automation", "Pipeline management", "Appointment automation", "Tags & custom fields", "Form automation", "Follow-up workflows", "Custom values"],
    tools: ["GoHighLevel"],
  },
  {
    id: "meta",
    name: "Meta Ads",
    short: "Meta",
    summary: "Paid lead generation on Meta, from lead-form campaigns to Pixel and Conversion API.",
    items: ["Paid lead generation", "Lead form campaigns", "Campaign management", "Campaign analysis", "Meta Pixel", "Conversion API"],
    tools: ["Meta Ads Manager"],
  },
  {
    id: "google",
    name: "Google Ads",
    short: "Google",
    summary: "Conversion-focused Google Ads campaigns, tracked through to the CRM.",
    items: ["Campaign management", "Conversion-focused marketing", "Google Ads attribution", "Spend & CPL analysis", "Campaign documentation"],
    tools: ["Google Ads", "Google Tag Manager", "Google Analytics 4"],
  },
  {
    id: "seo",
    name: "SEO",
    short: "SEO",
    summary: "On-page and local SEO implementation, with Google Business Profile and reporting.",
    items: ["On-page SEO", "Local SEO", "Google Business Profile", "SEO implementation", "SEO reporting", "Technical SEO fundamentals"],
    tools: ["Google Business Profile", "Google Analytics 4"],
  },
  {
    id: "funnels",
    name: "Funnels",
    short: "Funnels",
    summary: "Landing pages and funnels that hand every lead straight to the CRM.",
    items: ["Landing pages", "Thank-you pages", "Embedded forms", "Funnel implementation", "Responsive implementation", "Lead flow testing"],
    tools: ["GoHighLevel", "HTML / CSS"],
  },
  {
    id: "crm",
    name: "CRM & Attribution",
    short: "Attribution",
    summary: "Knowing where every lead came from — tags, tracking and first-touch attribution.",
    items: ["Lead source attribution", "First-touch attribution", "Lead channel tracking", "Lead routing", "Call tracking (CallRail)", "GTM · GA4 · Pixel · CAPI"],
    tools: ["GoHighLevel", "CallRail", "Google Tag Manager", "Google Analytics 4"],
  },
  {
    id: "web",
    name: "Web Development",
    short: "Web",
    summary: "Landing pages and components — HTML, CSS and JavaScript, growing into React and TypeScript.",
    items: ["HTML & CSS", "JavaScript fundamentals", "React / TypeScript (growing)", "Tailwind CSS", "Responsive web design", "GitHub & Vercel deployment"],
    tools: ["GitHub", "Vercel", "React", "TypeScript", "Tailwind CSS"],
  },
];

export type ProjectVisual = "attribution" | "hvac" | "massmarket" | "goldberg" | "lofi-care" | "gallery" | "ghl-agent";

export type Project = {
  id: string;
  client: string;
  title: string;
  category: string;
  year?: string;
  visual: ProjectVisual;
  accent: string;
  problem: string;
  solution: string;
  work: string[];
  tools: string[];
  result: string;
  metrics?: { label: string; value: string }[];
  /** Real screenshots (paths under /public). Add your own here. */
  images?: { src: string; alt: string }[];
  links?: { label: string; href: string }[];
  /** Shown on the case study so diagrams aren't mistaken for screenshots. */
  visualNote: string;
};

export const projects: Project[] = [
  {
    id: "pristine",
    client: "Pristine Epoxy Floor Coatings",
    title: "Lead attribution system in GoHighLevel",
    category: "CRM & Attribution",
    visual: "attribution",
    accent: "#0284c7",
    problem: "Leads arrive from many channels — ads, organic search, Google Business Profile, referrals, email, website forms and phone calls — and each one needs a trustworthy source inside the CRM.",
    solution: "An attribution system inside GoHighLevel built on Lead Channel, Booking Method and First Attribution Source, with source tags for every channel and explicit handling for unknown sources.",
    work: ["Lead Channel", "Booking Method", "First Attribution Source", "Source tags", "Google Ads & Meta Ads attribution", "Organic, GBP & referral attribution", "Direct & email attribution", "Unknown source handling", "Website form attribution", "Incoming call attribution", "Attribution workflow testing"],
    tools: ["GoHighLevel", "Workflows", "Custom fields", "Tags"],
    result: "The system was tested against different lead scenarios to verify attribution behaviour across channels.",
    visualNote: "Diagram recreated from the real attribution fields and sources.",
  },
  {
    id: "hvac",
    client: "HVAC Snapshot",
    title: "GoHighLevel funnel & CRM automation",
    category: "Funnels & Automation",
    visual: "hvac",
    accent: "#7c3aed",
    problem: "An HVAC business needs a complete lead-to-client system: pages that capture leads, pipelines that track them and automation that moves them forward.",
    solution: "A GoHighLevel snapshot with landing and thank-you pages, embedded forms, custom values, a lead pipeline, a client pipeline and an appointment flow.",
    work: ["Landing pages", "Thank-you pages", "Embedded forms", "Custom values", "Lead pipeline", "Client pipeline", "Appointment flow", "CRM automation", "Responsive implementation"],
    tools: ["GoHighLevel", "Funnels", "Pipelines", "Workflows"],
    result: "Delivered two connected pipelines covering the full journey — from New Lead to Ask For Review.",
    visualNote: "Pipeline stages are the real ones from the project; the layout is a recreation.",
  },
  {
    id: "massmarket",
    client: "MassMarket",
    title: "Paid advertising campaign analysis",
    category: "Paid Ads · Analysis",
    visual: "massmarket",
    accent: "#db2777",
    problem: "A large paid-ads account needed campaign-level clarity: what was spent, where leads came from and what each lead cost.",
    solution: "Campaign-level analysis of lead generation campaigns — spend, CPL and documentation of the results as a case study.",
    work: ["Campaign-level analysis", "Lead generation campaign analysis", "Spend analysis", "CPL analysis", "Campaign documentation"],
    tools: ["Paid ads data", "Campaign analysis", "Case-study documentation"],
    result: "One documented export covered 46 non-zero campaigns, about $175,769.21 in total spend, at a lead-form CPL of about $22.16.",
    metrics: [
      { label: "Non-zero campaigns", value: "46" },
      { label: "Total spend", value: "≈ $175,769.21" },
      { label: "Lead-form CPL", value: "≈ $22.16" },
    ],
    visualNote: "Figures from one documented export; the chart layout is illustrative.",
  },
  {
    id: "goldberg",
    client: "Goldberg Centre Vision",
    title: "Campaign performance & case study",
    category: "Paid Ads · Analysis",
    visual: "goldberg",
    accent: "#059669",
    problem: "Campaign performance spread across dozens of campaigns needed to be pulled together into one clear, documented picture.",
    solution: "Paid-advertising campaign analysis with a campaign-level breakdown of spend, leads and CPL, written up as case-study documentation.",
    work: ["Campaign performance", "Spend", "Leads", "CPL", "Campaign-level breakdown", "Case-study documentation"],
    tools: ["Paid ads data", "Campaign analysis", "Case-study documentation"],
    result: "One export covered 79 non-zero campaigns at a blended CPL of about CAD $15.53.",
    metrics: [
      { label: "Non-zero campaigns", value: "79" },
      { label: "Blended CPL", value: "≈ CAD $15.53" },
    ],
    visualNote: "Figures from one documented export; the chart layout is illustrative.",
  },
  {
    id: "lofi-care",
    client: "Lofi Care",
    title: "Healthcare landing page — static & interactive",
    category: "Web · Landing page",
    visual: "lofi-care",
    accent: "#0d9488",
    problem: "A healthcare platform needed a landing page that presents the product clearly, earns trust and guides visitors to the right call to action.",
    solution: "A component-based, responsive landing page plus an interactive version exploring scroll animation, parallax, 3D tilt and animated transitions.",
    work: ["Landing page design", "Responsive implementation", "Component-based sections", "Interactive version", "Animation", "UX improvements", "CTA restructuring", "Product presentation", "Healthcare-focused visual design"],
    tools: ["Landing page design", "Responsive build", "Interactive animation"],
    result: "Shipped a static and an interactive version, with restructured CTAs and a healthcare-focused visual system.",
    visualNote: "Layout recreation — add real screenshots in content.ts.",
  },
  {
    id: "gallery",
    client: "LofiStack 90-Day Build Challenge",
    title: "LofiStack Component Gallery",
    category: "Build challenge · Components",
    year: "2026",
    visual: "gallery",
    accent: "#4f46e5",
    problem: "Marketing and CRM teams keep rebuilding the same dashboards, cards and reports — there was no reusable, documented library for that kind of UI.",
    solution: "A public gallery of reusable web components — dashboards, pipelines, attribution, SEO and AI interfaces — each with its own page, live preview and editable data.",
    work: ["30 reusable components", "Custom elements with JSON data", "Light & dark themes", "Responsive & keyboard accessible", "Reduced-motion support", "GitHub + Vercel deployment"],
    tools: ["HTML / CSS / JS", "Claude Code", "GitHub", "Vercel"],
    result: "30 components live, built in public as part of the 90-day challenge.",
    metrics: [{ label: "Components", value: "30" }],
    images: [
      { src: "/projects/gallery/kpi-dashboard.jpg", alt: "KPI Metrics Dashboard component page" },
      { src: "/projects/gallery/workflow.jpg", alt: "Workflow Automation Card component page" },
      { src: "/projects/gallery/funnel.jpg", alt: "Lead Funnel Analytics component page" },
    ],
    links: [
      { label: "Live gallery", href: "https://lofistack-component-gallery-440dplb9c-joy-co-work.vercel.app/" },
      { label: "Source on GitHub", href: "https://github.com/joychakraborty44-web/lofistack-component-gallery" },
    ],
    visualNote: "Real screenshots of the live gallery.",
  },
  {
    id: "ghl-agent",
    client: "Internal tool",
    title: "GHL Troubleshooting Agent",
    category: "AI · Claude Code",
    year: "2026",
    visual: "ghl-agent",
    accent: "#d97706",
    problem: "GoHighLevel issues — triggers, forms, pipelines, attribution — were being debugged ad hoc, without a repeatable method.",
    solution: "A reusable Claude Code skill that walks a real GHL issue through intake, ranked root causes, troubleshooting steps, a safe fix, a QA checklist and a final summary.",
    work: ["Structured intake", "Root-cause ranking", "Step-by-step checks", "Side-effect warnings", "QA checklist", "Final summary"],
    tools: ["Claude Code", "GoHighLevel"],
    result: "Built and documented. Not yet tested on a real client issue.",
    visualNote: "Section names are the real ones from the skill.",
  },
];

export type TimelineEntry = {
  when: string;
  title: string;
  org?: string;
  body: string;
  tags: string[];
  milestone?: boolean;
};

export const timeline: TimelineEntry[] = [
  {
    when: "3+ years",
    title: "Digital marketing & implementation",
    body: "Hands-on work across paid ads, lead generation and the systems behind them.",
    tags: ["Paid ads", "Lead generation", "SEO"],
  },
  {
    when: "Current role",
    title: "Media Buyer & Automation Engineer",
    org: "LofiStack · US-based agency",
    body: "Execution and technical implementation across paid advertising, SEO, CRM and marketing automation, GoHighLevel, funnels, lead management, attribution and website implementation.",
    tags: ["Meta & Google Ads", "GoHighLevel", "Attribution", "Funnels"],
  },
  {
    when: "Key systems",
    title: "Attribution, pipelines & campaign analysis",
    body: "A first-touch attribution system for Pristine Epoxy, a full HVAC GoHighLevel snapshot, and campaign analysis for MassMarket and Goldberg Centre Vision.",
    tags: ["Attribution testing", "Pipelines", "CPL analysis"],
    milestone: true,
  },
  {
    when: "Sep 2026 →",
    title: "LofiStack 90-Day Build Challenge",
    body: "Building reusable web components in public with React, TypeScript, Tailwind and Claude Code — documented weekly.",
    tags: ["30 components", "GitHub", "Vercel", "Claude Code"],
    milestone: true,
  },
  {
    when: "Next",
    title: "Technical marketing automation",
    body: "Going deeper into advanced GoHighLevel automation, AI automation, MCP workflows (Meta MCP, Google Ads MCP), API integrations, advanced attribution and technical SEO.",
    tags: ["AI automation", "MCP", "APIs", "Marketing R&D"],
  },
];

export const process = [
  {
    n: "01",
    title: "Discover",
    body: "Map the current lead flow — traffic sources, forms, CRM, tracking and where leads get lost.",
    outputs: ["Lead-flow audit", "Tracking check", "CRM review"],
  },
  {
    n: "02",
    title: "Plan",
    body: "Design the system: pipeline stages, attribution fields, source tags, automations and reporting.",
    outputs: ["Pipeline map", "Attribution model", "Automation plan"],
  },
  {
    n: "03",
    title: "Build",
    body: "Build funnels, forms, pipelines and workflows, and wire up GTM, GA4, Pixel and Conversion API.",
    outputs: ["Funnels & forms", "Pipelines", "Pixel & CAPI"],
  },
  {
    n: "04",
    title: "Automate",
    body: "Lead routing, follow-ups, appointment flows and AI-assisted steps that run without manual work.",
    outputs: ["Lead routing", "Follow-ups", "Appointment flows"],
  },
  {
    n: "05",
    title: "Optimize",
    body: "Test real lead scenarios, analyse spend and CPL, and refine the system with the data.",
    outputs: ["Scenario testing", "CPL analysis", "Reporting"],
  },
];

/* ------------------------------------------------------------
   Web builds — LofiStack TEAM projects (source: LofiStack Website
   Development Case Study, Oct 2026). Joy contributed as part of the
   team; they are labelled as team work, never as solo builds.
   Screenshots: captured from the live sites.
   ------------------------------------------------------------ */
export type WebProject = {
  id: string;
  name: string;
  url: string;
  industry: string;
  needed: string;
  built: string;
  design: string;
  features: string[];
  scope: string[];
  accent: string;
  shot: string;
  full: string;
};

export const webProjects: WebProject[] = [
  {
    id: "lumega",
    name: "Lumega.ai",
    url: "https://www.lumega.ai/",
    industry: "AI sales automation & GoHighLevel software",
    needed: "Explain how a GoHighLevel-based platform converts leads on autopilot, present a long feature list and add-ons clearly, publish transparent pricing and drive trials, calls and affiliate sign-ups.",
    built: "A SaaS-style sales page: certified-admin hero with a Free Trial CTA, embedded video and integrations, five key benefits, a twelve-item feature grid, done-with-you / DIY / Starter pricing with add-ons, consultation booking and FAQ.",
    design: "High-contrast black and white with bold geometric headings and pill buttons; dark feature sections alternate with light, easy-to-compare pricing cards.",
    features: ["Client login & members area", "Affiliate sign-up", "12-item feature grid", "Tiered pricing + add-ons", "Consultation booking", "FAQ"],
    scope: ["Sales page", "Pricing", "Booking flow", "GoHighLevel offer"],
    accent: "#9333ea",
    shot: "/projects/web/lumega.jpg",
    full: "/projects/web/lumega-full.jpg",
  },
  {
    id: "echosetter",
    name: "Echosetter",
    url: "https://echosetter.ai/",
    industry: "AI automation systems for service businesses",
    needed: "Explain a technical AI lead-handling offer (voice, SMS text-back, webchat, CRM, reviews, follow-up) in plain language, show what is included and how the 5-day build works, and drive booked calls.",
    built: "A long-form sales page told as a guided story: sticky anchor navigation, a jump menu, revenue-leak → fix cards, eight package cards, a day-by-day 5-day build timeline, proof, a transparency list and a single-plan pricing card.",
    design: "Near-black editorial look with a condensed serif, cyan accents and narrow rounded cards, so a long page stays easy to skim.",
    features: ["Sticky anchor navigation", "Problem → fix cards", "5-day build timeline", "Transparency section", "Single-plan pricing", "Repeated Book a Call CTAs"],
    scope: ["Long-form sales page", "Offer structure", "Pricing", "Booking CTAs"],
    accent: "#0891b2",
    shot: "/projects/web/echosetter.jpg",
    full: "/projects/web/echosetter-full.jpg",
  },
  {
    id: "scalexcel",
    name: "ScalExcel",
    url: "https://scalexcel.com/",
    industry: "AI-powered CRM & automation software",
    needed: "Explain an all-in-one AI CRM and automation platform in plain language, present subscription pricing and done-for-you services, answer common questions and convert visitors into sign-ups or demo calls.",
    built: "A SaaS homepage: gradient hero with dual CTAs and a product video, a six-card features grid, solutions sections, a three-tier pricing table with a Monthly / Yearly toggle, a services grid, testimonials, FAQ and a chat widget.",
    design: "Modern SaaS look — navy-to-electric-blue gradients, glowing panel edges and a highlighted recommended plan.",
    features: ["Product video hero", "6-card features grid", "Monthly / Yearly pricing toggle", "Done-for-you services grid", "Testimonials & FAQ", "Website chat widget"],
    scope: ["SaaS homepage", "Pricing table", "Services", "Lead capture"],
    accent: "#2563eb",
    shot: "/projects/web/scalexcel.jpg",
    full: "/projects/web/scalexcel-full.jpg",
  },
];

/* ------------------------------------------------------------
   AI agents & automation — real agent work only.
   ------------------------------------------------------------ */
export type AgentWork = {
  id: string;
  type: string;
  title: string;
  status: "Shipped" | "Built" | "In use" | "Exploring";
  summary: string;
  flow: string[]; // left-to-right orchestration stages
  facts: { label: string; value: string }[];
  log: string[];
  tools: string[];
};

export const agentWork: AgentWork[] = [
  {
    id: "build",
    type: "Build agents",
    title: "Multi-agent component build",
    status: "Shipped",
    summary: "Directed Claude Code to build 26 gallery components in parallel: a written spec and a design brief per component, seven agents working at once, then one integration and QA pass.",
    flow: ["Brief", "Spec + briefs", "7 parallel agents", "Integrate", "QA", "Ship"],
    facts: [
      { label: "Parallel agents", value: "7" },
      { label: "Components built", value: "26" },
      { label: "Gallery total", value: "30" },
    ],
    log: [
      "> spawn 7 agents · SPEC.md + BRIEFS.md",
      "agent ✓ ad creatives · appointments · seo audit",
      "agent ✓ client overview · lead sources · budget · ai usage",
      "integrate → nav, footers, homepage cards",
      "qa → 30 pages · desktop / tablet / 375px",
      "commit 84efd32 · pushed to main",
    ],
    tools: ["Claude Code", "Subagents", "Node", "GitHub"],
  },
  {
    id: "qa",
    type: "QA agents",
    title: "Automated browser QA",
    status: "In use",
    summary: "Headless-browser test runs that load every page at three screen sizes, click every button and check console errors, overflow, broken assets and reduced-motion behaviour — then report what needs fixing.",
    flow: ["Page list", "Headless Chrome", "3 viewports", "Click every button", "Report", "Fix"],
    facts: [
      { label: "Pages tested", value: "32" },
      { label: "Viewports", value: "3" },
      { label: "Checks per page", value: "10" },
    ],
    log: [
      "> qa-browser.js · 30 components",
      "✓ kpi-metrics-dashboard  clicks 10/10",
      "✓ workflow-automation    clicks 16/16",
      "✗ 2 older components · reduced-motion pulse",
      "→ flagged for review, not auto-changed",
      "home: 30 cards · 30 previews · 0 errors",
    ],
    tools: ["Claude Code", "Chrome DevTools Protocol", "Node"],
  },
  {
    id: "troubleshoot",
    type: "Troubleshooting agent",
    title: "GHL Troubleshooting Agent",
    status: "Built",
    summary: "A reusable Claude Code skill that takes a real GoHighLevel issue from intake to ranked root causes, a safe fix, a QA checklist and a final summary — and never calls anything fixed without a test.",
    flow: ["Issue", "Intake", "Rank causes", "Checks", "Safe fix", "QA"],
    facts: [
      { label: "Output sections", value: "6" },
      { label: "Issue types covered", value: "11" },
      { label: "Real-issue tests", value: "Not yet" },
    ],
    log: [
      "> /ghl-troubleshooter form not firing workflow",
      "asking for missing details in one message…",
      "likely causes ranked: trigger filter · re-entry · draft",
      "fix proposed · side effects listed",
      "Test result: not tested yet",
    ],
    tools: ["Claude Code", "GoHighLevel"],
  },
  {
    id: "docs",
    type: "Documentation agent",
    title: "Agent Log workflow",
    status: "In use",
    summary: "A CLAUDE.md-driven system that turns real agent work into weekly LofiStack logs: capture the four required fields, check task-type repeats, keep drafts until approved.",
    flow: ["Real task", "Capture fields", "Type check", "Draft", "Approve", "Submit"],
    facts: [
      { label: "Weeks submitted", value: "2" },
      { label: "Required fields", value: "4" },
      { label: "Challenge length", value: "90 days" },
    ],
    log: [
      "> Log this task for LofiStack week 02",
      "fields: task · agent · prompt · result",
      "type check: no repeat with Week 01",
      "Select entry 1 → Approve week 02",
      "status: Submitted",
    ],
    tools: ["Claude Code", "Markdown"],
  },
  {
    id: "research",
    type: "Research",
    title: "MCP workflows — exploring",
    status: "Exploring",
    summary: "Researching how MCP servers can connect Claude to ad platforms — Meta MCP and Google Ads MCP — for campaign analysis and reporting workflows.",
    flow: ["Question", "MCP server", "Ad platform data", "Claude", "Insight"],
    facts: [
      { label: "Platforms", value: "Meta · Google Ads" },
      { label: "Status", value: "Research" },
    ],
    log: [
      "> exploring Meta MCP · Google Ads MCP",
      "goal: campaign analysis from live data",
      "status: research — no production use yet",
    ],
    tools: ["Claude", "MCP", "Meta Ads", "Google Ads"],
  },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "agents", label: "AI Agents" },
  { id: "work", label: "Work" },
  { id: "web", label: "Web" },
  { id: "experience", label: "Experience" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];
