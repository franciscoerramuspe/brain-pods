import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";
import "./globals.css";

const adversecase = localFont({
  src: "./fonts/AdvercaseFont-Demo-Bold.otf",
  variable: "--font-adversecase",
});

const adversecaseRegular = localFont({
  src: "./fonts/AdvercaseFont-Demo-Regular.otf",
  variable: "--font-adversecase-regular",
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${adversecase.variable} ${adversecaseRegular.variable} ${geistSans.variable} font-sans antialiased bg-[#323232] text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
