import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/components/ui/toast";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001");

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: "Project Camp — Tactile Project Management",
    template: "%s | Project Camp",
  },
  description: "Tactile Papercraft Project Management Workspace",
  keywords: [
    "project management",
    "kanban board",
    "sprint roadmap",
    "tactile design",
    "team productivity",
    "task manager",
  ],
  authors: [{ name: "Project Camp Team" }],
  creator: "Project Camp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#FBF9F5] text-[#1E2229] flex flex-col font-sans selection:bg-[#E2D4BC] selection:text-[#1E2229]">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
