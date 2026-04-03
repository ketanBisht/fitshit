import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Fitshit — Gym Management Platform",
  description: "The modern gym management platform for serious gym owners.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body style={{ minHeight: '100vh' }} suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
