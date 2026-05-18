import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "sonner";
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
  description:
    "Advanced AI-powered real estate intelligence for the Philippines. Predict property prices in ₱ with SHAP feature explanations and investment analytics.",
  keywords: [
    "Real Estate Philippines",
    "AI Price Prediction",
    "Pangasinan",
    "Metro Manila",
    "ProphetIQ",
    "XGBoost",
    "Property Investment",
  ],
  authors: [{ name: "ProphetIQ Team" }],
  openGraph: {
    title: "ProphetIQ | AI Real Estate Intelligence",
    description: "Predict Philippine property prices with AI + SHAP analysis.",
    type: "website",
  },
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
      <body>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(18, 18, 18, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
              color: '#ffffff',
              fontFamily: 'var(--font-outfit), sans-serif',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  );
}
