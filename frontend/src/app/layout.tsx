import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "ProphetIQ | Philippines AI Real Estate Intelligence",
  description: "Advanced AI-powered real estate intelligence for the Philippines. Predict property prices in ₱ with SHAP feature explanations and market analysis.",
  keywords: ["Real Estate Philippines", "AI", "Price Prediction", "Baguio", "Metro Manila", "ProphetIQ"],
  authors: [{ name: "ProphetIQ Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
