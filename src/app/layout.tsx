import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Logout } from "./Logout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yuri Chat",
  description: "A chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-background relative flex min-h-screen flex-col overflow-hidden text-gray-800">
          {/* Header */}
          <nav className="bg-[#FFD1DC] p-6 shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <h1 className="text-4xl font-extrabold tracking-wide text-[#EC407A]">
                <Link href="/">Yuri-Chat</Link>
              </h1>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 italic">
                  Socket Programming Project
                </span>
                <Logout />
              </div>
            </div>
          </nav>

          {children}

          {/* Footer */}
          <footer className="bg-[#FFD1DC] p-4 text-center text-sm text-gray-700">
            <p>Made with ❤️ by Group 15 「百合愛好家」</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
