import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import ChatSupport from "../components/chat-support";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multion Demo - Github Issue Tracker",
  description: "by Multion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body className={inter.className}>
        
        {children}
      </body>
    </html>
  );
}
