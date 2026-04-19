import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NextMCQ — Practice Smarter, Score Higher",
  description: "MCQ practice app for Class 10, 11 & 12 students. Battle friends, climb leaderboards, and earn rewards.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  openGraph: {
    title: "NextMCQ",
    description: "Free MCQ practice app for Class 10, 11 & 12.",
    url: "https://nextmcq.vercel.app",
    siteName: "NextMCQ",
    images: [{ url: "https://nextmcq.vercel.app/nextmcq-logo.png", width: 512, height: 512, alt: "NextMCQ" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NextMCQ",
    description: "Free MCQ practice app for Class 10, 11 & 12.",
    images: ["https://nextmcq.vercel.app/nextmcq-logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
