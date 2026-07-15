import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Matter — Ideas into intelligent experiences",
  description:
    "A bilingual publishing studio for AI, data, process maps, and future machine-learning experiences.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
