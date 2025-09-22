import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";
import SessionTimeoutWarning from "./components/SessionTimeoutWarning";

export const metadata: Metadata = {
  title: {
    default: "Portfolio Project Oracle - AI-Powered Project Ideas",
    template: "%s | Portfolio Project Oracle",
  },
  description:
    "Transform your coding journey with AI-powered portfolio project ideas tailored to your skills and career goals. Generate personalized projects, track milestones, and get market insights to build an impressive developer portfolio.",
  keywords: [
    "portfolio projects",
    "AI project generator",
    "developer portfolio",
    "coding projects",
    "career development",
    "project ideas",
    "software development",
    "programming portfolio",
    "tech career",
    "project management",
    "milestone tracking",
    "market insights",
    "developer tools",
  ],
  authors: [{ name: "Mojisola Alegbe" }],
  creator: "Mojisola Alegbe",
  publisher: "Portfolio Project Oracle",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Portfolio Project Oracle - AI-Powered Project Ideas",
    description:
      "Transform your coding journey with AI-powered portfolio project ideas tailored to your skills and career goals.",
    siteName: "Portfolio Project Oracle",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Portfolio Project Oracle - AI-Powered Project Ideas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Project Oracle - AI-Powered Project Ideas",
    description:
      "Transform your coding journey with AI-powered portfolio project ideas tailored to your skills and career goals.",
    images: ["/og-image.png"],
    creator: "@portfoliooracle",
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
  verification: {
    google: "your-google-verification-code", 
  },
  category: "technology",
  classification: "Developer Tools",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Portfolio Oracle",
    "application-name": "Portfolio Project Oracle",
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen bg-black font-sans antialiased">
        <Providers>
          <AuthProvider>
            {children}
            <SessionTimeoutWarning />
          </AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1f2937",
                color: "#fff",
                border: "1px solid #374151",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
