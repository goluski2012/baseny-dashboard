import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pływalnie Poznań — Dostępność Torów",
  description: "Wyszukiwarka wolnych torów basenowych",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
