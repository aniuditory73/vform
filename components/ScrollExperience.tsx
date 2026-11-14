"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef, type ReactNode } from "react";

export function ScrollExperience({ hero, technology }: { hero: ReactNode; technology: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const composition = root.current;
    if (!composition) return;
    gsap.registerPlugin(ScrollTrigger);
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const scroller = new Lenis({ anchors: { offset: -14 }, smoothWheel: true });
      const tick = (seconds: number) => scroller.raf(seconds * 1000);
      scroller.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.from("[data-intro]", { yPercent: 60, opacity: 0, stagger: .09, duration: .78, ease: "power3.out" });
      gsap.fromTo(".hero-note", { y: 9 }, { y: -15, stagger: .09, ease: "none",
        scrollTrigger: { trigger: composition, start: "top top", end: "30% top", scrub: true } });
      gsap.fromTo(".technology-watermark", { yPercent: 9 }, { yPercent: -10, ease: "none",
        scrollTrigger: { trigger: ".technology", start: "top 97%", end: "bottom top", scrub: true } });
      gsap.fromTo("[data-parallax]", { yPercent: 3, scale: 1.03 }, { yPercent: -5, scale: 1.10, ease: "none",
        scrollTrigger: { trigger: ".cloth-details", start: "top bottom", end: "bottom top", scrub: true } });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, { y: 26, opacity: .35, duration: .75, ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 93%", once: true } });
      });
      return () => {
        gsap.ticker.remove(tick);
        scroller.destroy();
      };
    });
    motion.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
      const cleanups = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"), (element) => {
        const xTo = gsap.quickTo(element, "x", { duration: .36, ease: "power3.out" });
        const yTo = gsap.quickTo(element, "y", { duration: .36, ease: "power3.out" });
        const move = (event: globalThis.PointerEvent) => {
          const box = element.getBoundingClientRect();
          xTo((event.clientX - box.left - box.width / 2) * .14);
          yTo((event.clientY - box.top - box.height / 2) * .23);
        };
        const reset = () => { xTo(0); yTo(0); };
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", reset);
        return () => {
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", reset);
          gsap.set(element, { clearProps: "transform" });
        };
      });
      return () => cleanups.forEach((cleanup) => cleanup());
    });
    return () => motion.revert();
  }, []);

  return (
    <div ref={root} className="scroll-experience" id="top">
      <section className="intro" aria-label="Студия vform">
        {hero}
        <div className="orbit-space" aria-hidden="true"><div className="hero-orbit" /><span className="orbit-cross" /></div>
        <a className="scroll-cue" href="#studio">Листай вниз<span /></a>
      </section>
      {technology}
    </div>
  );
}
