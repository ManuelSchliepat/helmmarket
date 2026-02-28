import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { MobileNav } from "@/components/layout/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Helm Market - AI Agent Skills Marketplace",
  description: "Discover, install and monetize AI Agent Skills for the Helm framework.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_ZXF1YWwtZ251LTIxLmNsZXJrLmFjY291bnRzLmRldiQ"

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-gray-100 min-h-screen flex flex-col pb-16 md:pb-0`}>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <MobileNav />
          <CookieBanner />
        </body>
      </html>
    </ClerkProvider>
  );
}
