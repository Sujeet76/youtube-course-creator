import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico, Rubik_Gemstones } from "next/font/google";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";
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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
