import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JARVIS AI — Next.js Engineering Workspace",
  description: "Next.js 14 App Router Intelligence Workspace uniting 9 connected UI components.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" class="dark">
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} bg-[#121210] text-[#eaeae2] antialiased selection:bg-[#da7756]/30 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
