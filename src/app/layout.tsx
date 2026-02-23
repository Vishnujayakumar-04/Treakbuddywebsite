import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "TrekBuddy - Your Ultimate Guide to Puducherry Tourism",
    template: "%s | TrekBuddy Puducherry"
  },
  description: "Discover the best of Puducherry with TrekBuddy. AI-powered itineraries, real-time bus routes, heritage guides, and local food recommendations. Plan your perfect trip today.",
  keywords: ["Puducherry tourism", "Pondicherry travel guide", "Puducherry itinerary", "AI trip planner", "best places in Pondicherry", "TrekBuddy"],
  authors: [{ name: "TrekBuddy Team" }],
  creator: "TrekBuddy",
  publisher: "TrekBuddy",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://trekbuddy.app",
    title: "TrekBuddy - Explore Puducherry Like Never Before",
    description: "AI-powered travel companion for Puducherry. Discover hidden gems, plan trips, and navigate with ease.",
    siteName: "TrekBuddy",
    images: [
      {
        url: "/assets/beaches/promenade beach.jpg",
        width: 1200,
        height: 630,
        alt: "TrekBuddy Puducherry Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrekBuddy - Puducherry Travel Guide",
    description: "Plan your Pondicherry trip with AI. Routes, food, and culture.",
    images: ["/assets/beaches/promenade beach.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { Navbar } from "@/components/layout/Navbar";
import { AIWidget } from "@/components/layout/AIWidget";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLoader } from "@/components/layout/AppLoader";
import { MobileAppBanner } from "@/components/layout/MobileAppBanner";

// JSON-LD structured data for the site
const SITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "TrekBuddy",
  "description": "AI-powered travel guide and itinerary planner for Puducherry, India.",
  "url": "https://trekbuddy.app",
  "logo": "https://trekbuddy.app/favicon.ico",
  "areaServed": {
    "@type": "State",
    "name": "Puducherry",
    "addressCountry": "IN"
  },
  "sameAs": []
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_SCHEMA) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppLoader>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <AIWidget />
              <MobileAppBanner />
            </AppLoader>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
