import type { Metadata } from "next";
import { cabinet, switzer, jetbrains } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harrow Mechanical",
  description:
    "Commercial mechanical services contractor. Concept project by Southshore Digital.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cabinet.variable} ${switzer.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}