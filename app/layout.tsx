import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import React from "react";

const MontserratFont = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Mon App",
    description: "Application sportive",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="FR" suppressHydrationWarning>
        <body className={`${MontserratFont.variable} font-montserrat antialiased bg-[#F7F7F7]`}>
        {children}
        </body>
        </html>
    );
}