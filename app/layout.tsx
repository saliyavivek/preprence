import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer, SiteHeader } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Preprence — Real interview experiences",
  description: "Explore real interview experiences, rounds, questions, and advice shared by candidates.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full bg-background antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
