import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { Logout } from "./Logout";
import { LoginProvider } from "@/context/LoginProvider";

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
