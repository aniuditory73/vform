import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/zalando-sans-expanded/wght-italic.css";
import "@fontsource/old-standard-tt/cyrillic-400-italic.css";
import "@fontsource/old-standard-tt/latin-400-italic.css";
import "@fontsource/ibm-plex-mono/cyrillic-400.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "vform — DTF-печать на одежде",
  description: "Студия vform. Печатаем идеи на одежде и текстиле методом DTF.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
