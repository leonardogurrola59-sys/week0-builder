import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Week 0 Builder Setup",
  description: "A minimal setup guide for Week 0 builders.",
};

{children}
So the full file becomes (only showing modified part):

export default function RootLayout({...}) {
  return (
    <html
      lang="en"
      className={${geistSans.variable} ${geistMono.variable} h-full antialiased}
    >
      
        
        {children}
      
    
  );
}
