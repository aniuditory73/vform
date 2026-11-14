"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { contacts } from "@/config/contacts";
import { deliveries, garments, printSizes, quantityDiscounts } from "@/config/pricing";
import { studio } from "@/config/text";

const rubles = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

type PriceOption = { id: string; label: string; price: number | null; minimum?: boolean };

function PriceSelect({ label, options, value, onChange }: {
  label: string;
  options: PriceOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="calculator-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(({ id, label, price, minimum }) => (
          <option key={id} value={id}>
            {label} · {price === null ? "уточняется" : price === 0 ? "бесплатно" : `${minimum ? "от " : ""}${rubles.format(price)}`}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Pricing() {
  const [quantityInput, setQuantityInput] = useState("1");
  const [garmentId, setGarmentId] = useState(garments[0].id);
  const [printId, setPrintId] = useState(printSizes[0].id);
  const [deliveryId, setDeliveryId] = useState(deliveries[0].id);

  const quantity = Number(quantityInput);
  const valid = /^[0-9]+$/.test(quantityInput) && Number.isSafeInteger(quantity) && quantity >= 1;
  const garment = garments.find(({ id }) => id === garmentId) ?? garments[0];
  const print = printSizes.find(({ id }) => id === printId) ?? printSizes[0];
  const delivery = deliveries.find(({ id }) => id === deliveryId) ?? deliveries[0];
  const discount = quantityDiscounts.find(({ minimum }) => quantity >= minimum)?.percent ?? 0;
  const deliveryPending = delivery.price === null;
  const unit = (garment.price + print.price) * (100 - discount) / 100;
  const total = unit * quantity + (delivery.price ?? 0);
  const prefix = print.minimum ? "от " : "";

  return (
    <section id="pricing" className="pricing shell" aria-labelledby="pricing-title">
      <h2 id="pricing-title" className="calculator-title" data-reveal>{studio.calculate}</h2>
      <div className="calculator-fields">
        <label className="calculator-field">
          <span>Количество</span>
          <input type="number" inputMode="numeric" min={1} step={1} required
            value={quantityInput} onChange={(event) => setQuantityInput(event.target.value)}
            aria-invalid={!valid} aria-describedby="quantity-discount" />
          <small id="quantity-discount">
            {!valid ? "Введите целое число от 1." : discount ? `Скидка на тираж ${discount}%` : "Без скидки"}
          </small>
        </label>
        <PriceSelect label="Изделие" options={garments} value={garmentId} onChange={setGarmentId} />
        <PriceSelect label="Общий размер принтов на изделии" options={printSizes} value={printId} onChange={setPrintId} />
        <PriceSelect label="Доставка" options={deliveries} value={deliveryId} onChange={setDeliveryId} />
      </div>
      <div className="calculator-result" aria-live="polite" aria-atomic="true">
        <div>
          <span>{deliveryPending ? "Стоимость без доставки" : "Общая стоимость"}</span>
          <strong>{valid ? prefix + rubles.format(total) : "—"}</strong>
        </div>
        <div>
          <span>Примерно за штуку</span>
          <strong>{valid ? prefix + rubles.format(total / quantity) : "—"}</strong>
        </div>
        {deliveryPending && <p>Стоимость Авито Доставки уточняется отдельно.</p>}
      </div>
      <a className="arrow-link inline-order" href={contacts.primaryHref ?? "#contact"} data-magnetic>
        {studio.order}<ArrowUpRight aria-hidden="true" />
      </a>
    </section>
  );
}
