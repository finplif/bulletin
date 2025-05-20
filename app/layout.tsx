import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DM_Sans } from 'next/font/google';
import Header from './components/Header';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Bulletin',
  description: 'Chicago cultural events',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} bg-[#F9F6F8] text-[#1F1F1F]`}>
        <Header />
        <main className="px-6 py-2">{children}</main>
      </body>
    </html>
  );
}
