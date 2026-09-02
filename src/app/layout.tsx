import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { CinebidProvider } from '@/context/CinebidContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BidModal } from '@/components/BidModal';
import { HeroRequestModal } from '@/components/HeroRequestModal';
import { SearchModal } from '@/components/SearchModal';
import { ShareModal } from '@/components/ShareModal';
import { FirstTimeVisitorModal } from '@/components/FirstTimeVisitorModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'bidstar: The Live Indian Cinema Fandom Leaderboard',
  description: 'bidstar is the live financial battleground for Indian cinema fandom. Back your favorite superstar, fight for #1 position, and outbid rival fandoms in real time.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[#e95325] selection:text-white font-sans">
        <ThemeProvider>
          <CinebidProvider>
            <Navbar />
            <main className="flex-1 w-full flex flex-col">
              {children}
            </main>
            <Footer />

            {/* Global Modals */}
            <BidModal />
            <HeroRequestModal />
            <SearchModal />
            <ShareModal />
            <FirstTimeVisitorModal />
          </CinebidProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
