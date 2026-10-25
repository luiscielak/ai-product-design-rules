import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Ops Cockpit",
  description:
    "Intake a brief, launch a design run, and approve or revise six pipeline stages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-mode="light"
      data-theme="light"
      data-palette="atelier"
      suppressHydrationWarning
    >
      <head>
        {/* Vendored Konstrukt v2.0.0 dist — linked, not bundled, so @import fonts stay valid. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/konstrukt/konstrukt.css" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/konstrukt/base.css" />
      </head>
      <body>
        <Script src="/konstrukt/theme.js" strategy="beforeInteractive" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
