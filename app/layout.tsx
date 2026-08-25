import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { unstable_cache } from "next/cache";

import { Footer, SiteHeader } from "@/components/layout";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
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
  title: "Preprence - Real interview experiences",
  description: "Explore real interview experiences, rounds, questions, and advice shared by students from your college.",
};

async function getCurrentUserHeaderData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isLoggedIn: false, userName: null, userEmail: null };
  }

  const getProfile = unstable_cache(
    async () =>
      prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true, email: true },
      }),
    ["header-profile", user.id],
    { revalidate: 300 },
  );

  const profile = await getProfile();

  return {
    isLoggedIn: true,
    userName: profile?.name?.trim() || null,
    userEmail: profile?.email || user.email || null,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { isLoggedIn, userName, userEmail } = await getCurrentUserHeaderData();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-background antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <SiteHeader
          isLoggedIn={isLoggedIn}
          userName={userName}
          userEmail={userEmail}
        />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
