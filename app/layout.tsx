import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "J.A.R.V.I.S AI — Intelligence Assistant",
  description: "Next.js 14 AI Assistant Workspace powered by J.A.R.V.I.S AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth h-full">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#08080a] text-zinc-100 antialiased h-full overflow-hidden m-0 p-0`}
      >
        {children}
      </body>
    </html>
  );
}
