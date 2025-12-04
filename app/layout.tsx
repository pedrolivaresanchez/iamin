import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: "iamin - Event Management Made Simple",
  description: "Create events in seconds, share a link, and see who's in. Free RSVP tracking, payment collection, and guest management. No app download needed.",
  keywords: ["event management", "RSVP", "party planning", "event registration", "guest list"],
  authors: [{ name: "iamin" }],
  creator: "iamin",
  metadataBase: new URL("https://www.iamin.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.iamin.io",
    siteName: "iamin",
    title: "iamin - Event Management Made Simple",
    description: "Create events in seconds, share a link, and see who's in. Free RSVP tracking, payment collection, and guest management.",
  },
  twitter: {
    card: "summary_large_image",
    title: "iamin - Event Management Made Simple",
    description: "Create events in seconds, share a link, and see who's in. Free RSVP tracking and guest management.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
