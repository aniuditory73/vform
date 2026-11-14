"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigation, studio } from "@/config/text";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => header.current?.toggleAttribute("data-compact", window.scrollY > 44);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header ref={header} className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="#top" aria-label="vform — на главную" onClick={() => setMenuOpen(false)}>
          {studio.name}
        </a>
        <button ref={toggle} className="menu-toggle" type="button" aria-expanded={menuOpen}
          aria-controls="primary-navigation" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav id="primary-navigation" className="primary-nav" aria-label="Основное меню" data-open={menuOpen}>
          {navigation.map(({ id, label }) => (
            <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <a className="mobile-order" href="#contact" onClick={() => setMenuOpen(false)}>
            {studio.order}<ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
        <a className="header-order arrow-link" href="#contact" data-magnetic>
          {studio.order}<ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
