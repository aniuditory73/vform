import Image from "next/image";
import { studio } from "@/config/text";

export function HeroTypography() {
  return (
    <>
      <div className="hoodie-photo">
        <Image src="/media/hoodie-hero.webp" alt="Чёрное худи vform с серо-оранжевым принтом на спине"
          fill sizes="(max-width: 700px) 86vw, (max-width: 1320px) 69vw, 911px" preload />
      </div>
      <div className="hero-content">
        <div className="hero-meta shell">
          <span>{studio.service.join("\n")}</span>
          <span className="hero-coordinates">{studio.coordinates.join("\n")}</span>
        </div>
        <h1 className="hero-title" aria-label={`${studio.hero.join(" ")}.`}>
          <span className="hero-line hero-line-main" aria-hidden="true">
            <span data-intro>{studio.hero[0]}</span>
          </span>
          <span className="hero-line hero-line-accent" aria-hidden="true">
            <span data-intro>{studio.hero[1]}<i>.</i></span>
          </span>
        </h1>
        <p className="hero-tagline">{studio.tagline.join("\n")}</p>
        <ol className="hero-notes" aria-label="Особенности печати">
          {studio.details.map((detail, index) => (
            <li key={detail[0]} className={`hero-note hero-note-${index + 1}`}>
              <span>[0{index + 1}]</span>{detail.join("\n")}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
