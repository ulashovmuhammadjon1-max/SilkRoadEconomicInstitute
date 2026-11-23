"use client";

import { useEffect, useRef, useState } from "react";
import { MapSvg } from "../map/MapSvg";

type Step = { title: string; text: string };

/**
 * Desktop scroll-scrubbed map. GSAP + ScrollTrigger are imported only when the
 * section is within one viewport. Under reduced motion, or before GSAP loads,
 * the composed final map is shown with all captions.
 */
export function MapScrub({ steps, caption }: { steps: Step[]; caption: string }) {
  const section = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(steps.length - 1);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    if (!window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        setEnhanced(true);
        setActive(0);
        ctx = gsap.context(() => {
          const q = gsap.utils.selector(el);
          gsap.set(q(".m-focus path"), { strokeDasharray: 1, strokeDashoffset: 1, fillOpacity: 0 });
          gsap.set(q(".m-city"), { opacity: 0, scale: 0.3, transformOrigin: "center", transformBox: "fill-box" });
          gsap.set([...q(".m-out"), ...q(".m-back")], { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(q(".m-dest"), { opacity: 0 });
          gsap.set(q(".m-ctx"), { opacity: 0.35 });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=300%",
              scrub: 0.6,
              pin: q(".scene-pin")[0],
              onUpdate: (self) => setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999))),
            },
          });
          tl.to(q(".m-ctx"), { opacity: 1, duration: 0.5 }, 0)
            .to(q(".m-focus path"), { strokeDashoffset: 0, duration: 1, stagger: 0.08 }, 0)
            .to(q(".m-focus path"), { fillOpacity: 1, duration: 0.4 }, 0.9)
            .to(q(".m-city"), { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08 }, 1.2)
            .to(q(".m-out"), { strokeDashoffset: 0, duration: 1, stagger: 0.15 }, 2.1)
            .to(q(".m-dest"), { opacity: 1, duration: 0.3, stagger: 0.15 }, 2.6)
            .to(q(".m-back"), { strokeDashoffset: 0, duration: 1, stagger: 0.15 }, 3.2)
            .to({}, { duration: 0.4 });
        }, el);
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      ctx?.revert();
    };
  }, [steps.length]);

  return (
    <div ref={section} className="relative">
      <div className="scene-pin flex min-h-screen items-center bg-cream py-16">
        <div className="page grid-12 w-full items-center">
          <div className="col-span-4 self-stretch">
            <div className="flex h-full flex-col justify-center">
              <p className="label">§ 02 · The corridors</p>
              <ol className="relative mt-8 space-y-6">
                {steps.map((s, i) => {
                  const on = !enhanced || i === active;
                  return (
                    <li
                      key={s.title}
                      aria-current={enhanced && i === active ? "step" : undefined}
                      className="border-l pl-5 transition-[opacity,border-color] duration-500"
                      style={{ opacity: on ? 1 : 0.3, borderColor: on ? "#B8964F" : "#DDD0B5" }}
                    >
                      <span className="section-no text-sm">0{i + 1}</span>
                      <span className="mt-1 block font-serif text-h3 text-navy">{s.title}</span>
                      <span className="mt-2 block max-w-sm text-ink-soft">{s.text}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          <figure className="col-span-8">
            <MapSvg className="h-auto w-full" />
            <figcaption className="dateline mt-4 text-right">{caption}</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
