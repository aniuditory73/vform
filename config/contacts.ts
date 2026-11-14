export interface ContactChannel {
  label: string;
  value: string;
  href: string;
}

const managerHref = "https://t.me/vform_mngr";

export const contacts: { channels: ContactChannel[]; primaryHref?: string } = {
  channels: [
    { label: "Telegram-канал", value: "@vformrussia", href: "https://t.me/vformrussia" },
    { label: "Телефон", value: "+7 927 831-51-66", href: "tel:+79278315166" },
    { label: "Менеджер для заказа", value: "@vform_mngr", href: managerHref },
  ],
  primaryHref: managerHref,
};
