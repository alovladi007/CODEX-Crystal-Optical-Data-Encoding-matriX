import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CODEX Crystal Archive - Ultra-Durable 5D Optical Data Storage',
  description: 'Revolutionary data preservation system using 5D optical crystal storage. Preserve your data for millennia with advanced error correction and self-describing archives.',
  keywords: 'data storage, crystal storage, 5D optical, data preservation, archival, error correction, long-term storage',
  authors: [{ name: 'CODEX Crystal Archive Team' }],
  creator: 'CODEX Crystal Archive',
  publisher: 'CODEX Crystal Archive',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://codex-crystal-archive.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CODEX Crystal Archive - Ultra-Durable 5D Optical Data Storage',
    description: 'Revolutionary data preservation system using 5D optical crystal storage. Preserve your data for millennia.',
    url: 'https://codex-crystal-archive.com',
    siteName: 'CODEX Crystal Archive',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CODEX Crystal Archive - 5D Optical Data Storage',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CODEX Crystal Archive - Ultra-Durable 5D Optical Data Storage',
    description: 'Revolutionary data preservation system using 5D optical crystal storage.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
            <Navbar />
            <main className="relative">
              {children}
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#f1f5f9',
                  border: '1px solid #334155',
                },
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
