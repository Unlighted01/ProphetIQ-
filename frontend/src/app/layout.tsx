import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
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
    <html lang="en" className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const t = localStorage.getItem('theme') || 'dark';
              document.documentElement.dataset.theme = t;
            } catch(e) {}
          `
        }} />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              backdropFilter: 'blur(12px)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-main), sans-serif',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  );
}
