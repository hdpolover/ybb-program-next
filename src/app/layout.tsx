import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/assets/scss/app.scss";
import "@/styles/participant-dashboard.css";
import ReduxProvider from "@/providers/ReduxProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Istanbul Youth Summit 2026 - Collaboration in Diversity",
  description: "Join the premier international platform that empowers young leaders to address global challenges through innovation, collaboration, and transformative leadership in Istanbul, Turkey.",
  keywords: "youth summit, leadership, Istanbul, global challenges, innovation, collaboration, youth empowerment, international conference, young leaders",
  authors: [{ name: "YBB Foundation" }],
  openGraph: {
    title: "Istanbul Youth Summit 2026 - Collaboration in Diversity",
    description: "Join hundreds of young leaders from around the world in this transformative experience. Feb 9-12, 2026 in Istanbul, Turkey.",
    type: "website",
    images: [
      {
        url: "https://storage.ybbfoundation.com/programs/10/images/banner_1754397811.jpg",
        width: 1200,
        height: 630,
        alt: "Istanbul Youth Summit 2026"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Istanbul Youth Summit 2026 - Collaboration in Diversity", 
    description: "Join hundreds of young leaders from around the world in this transformative experience.",
    images: ["https://storage.ybbfoundation.com/programs/10/images/banner_1754397811.jpg"]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css" 
          rel="stylesheet"
        />
        <link 
          href="https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css" 
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable}>
        <ReduxProvider>
          {children}
          <Toaster position="top-right" />
        </ReduxProvider>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
