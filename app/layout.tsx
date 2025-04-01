import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardLayout } from "../components/dashboard-layout";
import { AuthProvider } from "../lib/auth";
import { ProtectedRoute } from "../components/protected-route";
import { Providers } from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daf Manager",
  description: "Created with Endaoment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            <ProtectedRoute>
              <DashboardLayout>{children}</DashboardLayout>
            </ProtectedRoute>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
