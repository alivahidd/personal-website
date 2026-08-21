import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mona Moradi — Filmmaker & Multidisciplinary Artist",
  description: "Portfolio of Mona Moradi, filmmaker and multidisciplinary artist.",
  metadataBase: new URL("https://mona-moradi-film.alivahid.chatgpt.site"),
  openGraph: { title: "Mona Moradi", description: "Filmmaker & multidisciplinary artist.", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Mona Moradi", description: "Filmmaker & multidisciplinary artist.", images: ["/og.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
