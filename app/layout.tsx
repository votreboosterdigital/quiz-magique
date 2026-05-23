import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quiz Magique ✨ Harry Potter & Baby-Sitters Club',
  description: 'Quiz éducatif bilingue FR/EN pour les élèves de CE2 — Maths, Français, English, Harry Potter et Baby-Sitters Club !',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1A0A2E',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full min-h-dvh antialiased font-nunito">
        {children}
      </body>
    </html>
  );
}
