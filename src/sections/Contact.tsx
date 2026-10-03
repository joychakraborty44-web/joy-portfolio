import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { contact, profile } from "../content";
import { scrollToId } from "../lib/store";
import { ease } from "../lib/hooks";
import { Magnetic, Reveal, SplitText } from "../components/motion";

const TYPES = ["CRM & automation", "Attribution & tracking", "Paid ads", "Funnel / landing page", "AI workflow", "Something else"];

export function Contact() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.6], reduced ? [1, 1] : [0.86, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.6], reduced ? [28, 28] : [56, 28]);
  const [type, setType] = useState(TYPES[0]);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim(), email = String(f.get("email") || "").trim(), msg = String(f.get("message") || "").trim();
    const errs: Record<string, string> = {};
    if (!name) errs.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please add a valid email.";
    if (msg.length < 10) errs.message = "A sentence or two about the project helps.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      (e.currentTarget.querySelector(`[name="${Object.keys(errs)[0]}"]`) as HTMLElement | null)?.focus();
      return;
    }
    // No backend yet: hand the message to the visitor's email app.
    const body = `${msg}\n\n— ${name} (${email})\nProject type: ${type}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`Project enquiry — ${type}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field = "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[15px] text-ink placeholder:text-dim outline-none transition-colors focus:border-cyan/60 focus:bg-white/[0.05]";

  return (
    <section id="contact" ref={ref} className="relative px-2 pb-2 pt-32 outline-none sm:px-4 sm:pb-4" aria-labelledby="contact-title">
      <motion.div style={{ scale, borderRadius: radius }} className="relative mx-auto max-w-[1600px] overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-transparent">
        <div className="section-pad relative mx-auto grid max-w-7xl gap-14 py-24 md:py-32 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <Reveal><p className="eyebrow flex items-center gap-3"><span className="text-cyan">08</span><span className="h-px w-8 bg-white/20" />Final stage</p></Reveal>
            <h2 id="contact-title" className="mt-6 text-[clamp(2.7rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
              <SplitText text="Let's build the" className="block" />
              <SplitText text="system behind" className="block" delay={0.1} />
              <SplitText text="your growth." className="block font-serif font-normal italic tracking-[-0.02em] text-gradient" delay={0.2} />
            </h2>
            <Reveal delay={0.25}><p className="mt-8 max-w-md text-[17px] leading-relaxed text-mist">Ads, CRM, attribution, automation or AI workflows — tell me where your leads get lost and I'll map the system to catch them.</p></Reveal>
            <Reveal delay={0.35}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Magnetic href={`mailto:${contact.email}`} className="rounded-full bg-white px-6 py-3.5 text-[15px] font-medium text-void">{contact.email}</Magnetic>
                {contact.links.map(l => (
                  <a key={l.label} href={l.href} className="rounded-full border border-white/15 px-5 py-3.5 text-[14px] text-mist transition-colors hover:border-white/40 hover:text-white" data-cursor="hover" {...(l.placeholder ? { title: "Placeholder link — add yours in content.ts" } : {})}>{l.label}</a>
                ))}
              </div>
              <p className="mt-4 font-mono text-[11px] text-dim">{profile.location} · working with US-based teams</p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="glass-strong relative rounded-[28px] p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }} className="py-10 text-center" role="status">
                    <div className="mx-auto grid size-16 place-items-center rounded-full border border-cyan/40 bg-cyan/10 text-2xl text-cyan">✓</div>
                    <h3 className="mt-6 text-2xl font-semibold">Your email app should be open.</h3>
                    <p className="mx-auto mt-3 max-w-sm text-[15px] text-mist">Your message is ready to send from there. Nothing opened? Email <span className="text-ink">{contact.email}</span> directly.</p>
                    <button type="button" onClick={() => setSent(false)} className="mt-8 rounded-full border border-white/15 px-5 py-2.5 text-[14px] text-mist hover:text-white">Write another</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-[13px] text-mist">Name
                        <input name="name" autoComplete="name" className={field} placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} />
                        {errors.name && <span id="err-name" className="text-[12.5px] text-orchid">{errors.name}</span>}
                      </label>
                      <label className="grid gap-2 text-[13px] text-mist">Email
                        <input name="email" type="email" autoComplete="email" className={field} placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} />
                        {errors.email && <span id="err-email" className="text-[12.5px] text-orchid">{errors.email}</span>}
                      </label>
                    </div>
                    <fieldset className="grid gap-2">
                      <legend className="mb-2 text-[13px] text-mist">What do you need?</legend>
                      <div className="flex flex-wrap gap-2">
                        {TYPES.map(t => (
                          <button key={t} type="button" onClick={() => setType(t)} aria-pressed={type === t} className={`rounded-full border px-3.5 py-2 text-[13px] transition-all duration-300 ${type === t ? "border-cyan/60 bg-cyan/10 text-white" : "border-white/10 text-mist hover:border-white/25 hover:text-white"}`}>{t}</button>
                        ))}
                      </div>
                    </fieldset>
                    <label className="grid gap-2 text-[13px] text-mist">Message
                      <textarea name="message" rows={4} className={`${field} resize-none`} placeholder="Where do your leads get lost today?" aria-invalid={!!errors.message} aria-describedby={errors.message ? "err-message" : undefined} />
                      {errors.message && <span id="err-message" className="text-[12.5px] text-orchid">{errors.message}</span>}
                    </label>
                    <Magnetic type="submit" strength={0.2} className="group mt-2 inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan via-iris to-orchid px-6 py-4 text-[15px] font-semibold text-void">
                      Send message <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </Magnetic>
                    <p className="text-center text-[12px] text-dim">Opens your email app with the message filled in.</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        <Footer />
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="section-pad relative mx-auto max-w-7xl pb-10">
      <div className="hairline" />
      <div className="overflow-hidden pt-10">
        <motion.p
          className="select-none whitespace-nowrap text-[clamp(3.2rem,13vw,12rem)] font-semibold leading-[0.85] tracking-[-0.06em] text-white/[0.06]"
          initial={{ y: "60%" }} whileInView={{ y: "0%" }} viewport={{ once: true }} transition={{ duration: 1.2, ease }}
          aria-hidden
        >
          {profile.name}
        </motion.p>
      </div>
      <div className="mt-8 flex flex-col gap-4 text-[13px] text-dim sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {profile.name} · {profile.title}</p>
        <p>Built with React, TypeScript, Three.js & Framer Motion</p>
        <button type="button" onClick={() => scrollToId("hero")} className="self-start rounded-full border border-white/10 px-4 py-2 text-mist transition-colors hover:text-white sm:self-auto" data-cursor="hover">Back to top ↑</button>
      </div>
    </footer>
  );
}
