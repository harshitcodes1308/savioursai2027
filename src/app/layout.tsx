import type { Metadata } from "next";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/client";

export const metadata: Metadata = {
  title: "ICSE Saviours – AI Student OS",
  description: "Your AI-powered academic OS for ICSE success",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-gray-950 text-white">
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
