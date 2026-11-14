import Image from "next/image";
import { studio } from "@/config/text";

export function TechnologyText() {
  return (
    <>
      <section className="technology" id="studio" aria-labelledby="technology-title">
        <span className="technology-watermark" aria-hidden="true">DTF</span>
        <h2 id="technology-title" className="technology-copy">
          <span>{studio.technology[0]}</span>
          <span>{studio.technology[1]}</span>
          <span>С <em>{studio.technology[2]}</em></span>
        </h2>
      </section>
      <section className="cloth-details" aria-label="Фактура ткани и принта">
        <div className="cloth-photo" data-parallax>
          <Image src="/media/fabric-macro.webp" alt="Макросъёмка чёрного трикотажа с принтом vform"
            fill sizes="100vw" />
        </div>
        <ol className="cloth-labels shell">
          {studio.details.map((detail, index) => (
            <li key={detail[0]}><span>[0{index + 1}]</span> {detail.join(" ")}</li>
          ))}
        </ol>
      </section>
    </>
  );
}
