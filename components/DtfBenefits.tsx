import Image from "next/image";
import { publicAsset } from "@/config/assets";
import { studio } from "@/config/text";

export function DtfBenefits() {
  const { title, description, images, exampleCaption } = studio.dtfBenefits;

  return (
    <section className="dtf-benefits shell" aria-labelledby="dtf-benefits-title">
      <div className="dtf-benefits-intro" data-reveal>
        <h2 className="calculator-title" id="dtf-benefits-title">{title}</h2>
        <p>{description}</p>
      </div>
      <figure className="dtf-benefits-figure">
        <div className="dtf-benefits-images">
          {images.map(({ src, alt }, index) => (
            <div className="dtf-benefits-photo" key={src}>
              <Image src={publicAsset(src)} alt={alt} fill sizes={index === 0
                ? "(max-width: 700px) 90vw, (max-width: 1410px) 51vw, 720px"
                : "(max-width: 700px) 82vw, (max-width: 1410px) 36vw, 510px"} />
            </div>
          ))}
        </div>
        <figcaption className="technical">{exampleCaption}</figcaption>
      </figure>
    </section>
  );
}
