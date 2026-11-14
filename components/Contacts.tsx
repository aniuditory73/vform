import { ArrowUpRight } from "lucide-react";
import { contacts } from "@/config/contacts";
import { studio } from "@/config/text";

export function Contacts() {
  const orderHref = contacts.primaryHref ?? contacts.channels[0]?.href;

  return (
    <section id="contact" className="contacts shell" aria-labelledby="contact-title">
      <h2 id="contact-title" className="contacts-title" data-reveal>
        <span className="display-type">{studio.contactHeadline[0]}</span>
        <em>{studio.contactHeadline[1]}</em>
      </h2>
      <div className="contact-actions">
        {contacts.channels.length > 0 && (
          <ul className="contact-list">
            {contacts.channels.map(({ label, value, href }) => (
              <li key={href}>
                <span className="technical">{label}</span>
                <a href={href} aria-label={`${label}: ${value}`}>{value}</a>
              </li>
            ))}
          </ul>
        )}
        {orderHref ? (
          <a className="arrow-link contact-order" href={orderHref} data-magnetic>
            {studio.order}<ArrowUpRight aria-hidden="true" />
          </a>
        ) : (
          <>
            <p id="contact-status" className="technical">Контакты для заказов скоро появятся.</p>
            <button className="arrow-link contact-order" type="button" disabled aria-describedby="contact-status">
              {studio.order}<ArrowUpRight aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
