import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Pacifico, Rubik_Gemstones } from "next/font/google";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";
import { clientEnv } from "@/env/client";
import QueryClientProvider from "@/providers/query-client-provider";
import { ThemeProvider } from "@/providers/theme.provider";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rubikGemStone = Rubik_Gemstones({
  variable: "--font-rubik-gemstone",
  subsets: ["latin"],
  weight: ["400"],
});

const sourGummy = Pacifico({
  variable: "--font-sour-gummy",
  subsets: ["latin"],
  weight: ["400"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL),
  title: {
    default:
      "PlaylistsGenius - Transform YouTube Content into Structured Courses",
    template: "%s | PlaylistsGenius",
  },
  description:
    "Transform YouTube playlists into structured online courses. Create, organize, and share educational content from YouTube videos. The ultimate platform for YouTube content creators and educators.",
  keywords: [
    "YouTube course creator",
    "YouTube playlist organizer",
    "YouTube learning platform",
    "online course creation",
    "YouTube education",
    "video courses",
    "YouTube content transformation",
    "educational playlists",
    "PlaylistsGenius",
    "YouTube teaching platform",
  ],
  authors: [
    { name: "PlaylistsGenius", url: clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL },
  ],
  creator: "PlaylistsGenius",
  publisher: "PlaylistsGenius",
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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL,
    title: "PlaylistsGenius - YouTube Content to Structured Courses",
    description:
      "Transform YouTube content into engaging structured courses. The smart way to create and share educational content from YouTube videos.",
    siteName: "PlaylistsGenius",
    images: [
      {
        url: "/images/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "PlaylistsGenius - YouTube Course Creation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlaylistsGenius - YouTube Content to Structured Courses",
    description:
      "Transform YouTube content into engaging structured courses. The smart way to create and share educational content.",
    images: ["/images/thumbnail.png"],
    creator: "@PlaylistsGenius",
    site: "@PlaylistsGenius",
  },
  alternates: {
    canonical: clientEnv.NEXT_PUBLIC_BETTER_AUTH_URL,
  },
  category: "Education Technology",
  applicationName: "PlaylistsGenius",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubikGemStone.variable} ${sourGummy.variable} antialiased`}
      >
        <QueryClientProvider>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </NuqsAdapter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Toaster
          richColors
          closeButton
          className="pointer-events-auto isolate z-[1000]"
          position="top-center"
        />
      </body>
    </html>
  );
}
