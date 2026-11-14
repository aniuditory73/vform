import { ArrowUp } from "lucide-react";
import { studio } from "@/config/text";

export function Footer() {
  return (
    <footer className="site-footer shell">
      <a className="wordmark" href="#top" aria-label="vform — на главную">{studio.name}</a>
      <span className="technical">{studio.service.join(" ")}</span>
      <a className="arrow-link back-to-top" href="#top">Наверх<ArrowUp aria-hidden="true" /></a>
    </footer>
  );
}
