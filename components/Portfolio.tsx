"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { publicAsset } from "@/config/assets";
import { useState, type KeyboardEvent } from "react";
import { portfolio } from "@/config/portfolio";

export function Portfolio() {
  const [current, setCurrent] = useState(0);
  const total = portfolio.length;
  const work = portfolio[current];

  if (!work) return null;

  function step(direction: -1 | 1) {
    setCurrent((index) => (index + direction + total) % total);
  }

  function handleKeys(event: KeyboardEvent) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    step(event.key === "ArrowLeft" ? -1 : 1);
  }

  return (
    <section id="work" className="portfolio shell" aria-labelledby="work-title">
      <div className="portfolio-heading">
        <h2 className="wordmark" id="work-title" aria-label="Портфолио vform">vform</h2>
        <p className="technical portfolio-count" aria-hidden="true">
          [{String(current + 1).padStart(2, "0")}]
        </p>
      </div>
      <div className="portfolio-stage">
        <p className="technical portfolio-kind">Портфолио <span aria-hidden="true">/\</span><br />Футболка</p>
        <p className="technical portfolio-service">DTF-печать<br />на одежде</p>
        <div className="portfolio-orbit" aria-hidden="true"><span className="orbit-cross" /></div>
        <div id="portfolio-slide" className="portfolio-photo" data-crop={work.crop}>
          <div className="portfolio-image">
            <Image key={work.src} src={publicAsset(work.src)} alt={work.alt} fill
              sizes="(max-width: 700px) 91vw, (max-width: 1120px) 67vw, 900px"
              loading="eager" />
          </div>
        </div>
        <p className="technical portfolio-caption"><span>[Принт]</span><br />{work.title}</p>
        <p className="technical portfolio-process"><span>[Технология]</span><br />DTF-печать</p>
      </div>
      <div className="portfolio-controls" role="group" aria-label="Переключение футболок" onKeyDown={handleKeys}>
        <button className="portfolio-arrow" type="button" aria-label="Предыдущая футболка"
          aria-controls="portfolio-slide" onClick={() => step(-1)} disabled={total < 2}>
          <ArrowLeft aria-hidden="true" />
        </button>
        <div className="portfolio-indicators">
          {portfolio.map((item, index) => (
            <button key={item.src} className="portfolio-indicator" type="button"
              aria-label={item.title} aria-current={index === current ? "true" : undefined}
              aria-controls="portfolio-slide" onClick={() => setCurrent(index)} />
          ))}
        </div>
        <button className="portfolio-arrow" type="button" aria-label="Следующая футболка"
          aria-controls="portfolio-slide" onClick={() => step(1)} disabled={total < 2}>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
      <span className="sr-only" role="status">{work.title}. {current + 1} из {total}.</span>
      <div className="portfolio-watermark" aria-hidden="true">VFORM</div>
    </section>
  );
}
