import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { Toaster } from "react-hot-toast";

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
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text)',
            borderRadius: '16px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
          }
        }} />
      </body>
    </html>
  );
}
