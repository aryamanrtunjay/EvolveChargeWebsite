import { Geist, Geist_Mono } from "next/font/google";
import { Chakra_Petch } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  display: "swap",
})

export const metadata = {
  title: "EVolve Charge",
  description: "Revolutionizing EV Charging",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
      <body className={chakraPetch.className}>
        <Navbar/>
        {children}
        <Footer/>
        <Analytics/>
      </body>
    </html>
  );
}
