import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

const baseUrl = new URL(
  process.env.NEXT_PUBLIC_APP_URL || "https://project-camp-six.vercel.app"
);

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: "Project Camp — Tactile Project Management",
    template: "%s | Project Camp",
  },
  description:
    "A collaborative project management application built with Node.js, Express.js, and MongoDB. Manage projects, tasks, team members, and workflows.",
  openGraph: {
    title: "Project Camp | Project Management",
    description:
      "Explore Project Camp, a collaborative project management application with task tracking, team roles, and secure backend APIs.",
    url: "https://project-camp-six.vercel.app/",
    siteName: "Project Camp",
    images: [
      {
        url: "/images/project-camp.png",
        width: 1200,
        height: 630,
        alt: "Project Camp — Project Management Application",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Camp | Project Management",
    description:
      "A collaborative project management application built with Node.js, Express.js, and MongoDB.",
    images: ["/images/image.png"],
  },
  keywords: [
    "project management",
    "kanban board",
    "sprint roadmap",
    "team productivity",
    "task manager",
    "Node.js",
    "Express.js",
    "MongoDB",
  ],
  creator: "Harsh",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-[#FBF9F5] text-[#1E2229] flex flex-col font-sans selection:bg-[#E2D4BC] selection:text-[#1E2229]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
