import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const adversecase = localFont({
  src: "./fonts/AdvercaseFont-Demo-Bold.otf",
  variable: "--font-adversecase",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Brain Pods",
  description: "Your AI-powered study rooms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${adversecase.variable} ${geistSans.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
