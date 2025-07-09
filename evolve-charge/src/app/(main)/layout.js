import { Geist, Geist_Mono } from "next/font/google";
import { Chakra_Petch } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

import "../globals.css";

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
  title: "Ampereon Hands-Free EV Charger | Smart Automatic Charging",
  description:
    "Ampereon turns any Level-2 outlet into an AI-powered, hands-free EV charger that auto-docks your cable, schedules off-peak charging, and cuts energy costs.",
  keywords: [
    "Ampereon",
    "hands-free EV charging",
    "automatic EV charger",
    "smart charging accessory",
    "Level-2 charger upgrade",
    "AI-powered charging"
  ],
  alternates: {
    canonical: "https://www.ampereonenergy.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','q1blv');
          `,
        }}
      />
      </head>
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
