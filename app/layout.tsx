import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Green Claims Validator - EU Compliance Tool",
  description: "Validate your marketing claims against EU Green Claims Directive regulations. Prevent greenwashing penalties with our compliance scanner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
