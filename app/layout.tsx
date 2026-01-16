import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Green Claim Check - EU Compliance Tool",
  description: "Validate your marketing claims against EU Green Claims Directive regulations. Prevent greenwashing penalties with our compliance scanner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            {children}
            <Toaster 
              position="bottom-right"
              richColors
              closeButton
              duration={3000}
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
