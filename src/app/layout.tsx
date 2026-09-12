import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Bukhari Spice Calculator – Scale Your Rice Recipe",
  description:
    "A simple, modern tool for cooks to scale a traditional rice bukhari recipe based on the amount of lamb. Perfect for home cooks and professional chefs preparing Gulf-style rice dishes.",
  keywords: [
    "bukhari",
    "rice recipe",
    "spice calculator",
    "lamb recipe",
    "Gulf cuisine",
    "Middle Eastern cooking",
    "recipe scaler",
  ],
  openGraph: {
    title: "Bukhari Spice Calculator",
    description:
      "Scale your traditional rice bukhari recipe effortlessly by lamb weight.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bukhari Spice Calculator",
    description:
      "Scale your traditional rice bukhari recipe effortlessly by lamb weight.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
