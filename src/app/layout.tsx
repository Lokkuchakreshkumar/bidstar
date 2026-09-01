import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { CinebidProvider } from '@/context/CinebidContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BidModal } from '@/components/BidModal';
import { HeroRequestModal } from '@/components/HeroRequestModal';
import { SearchModal } from '@/components/SearchModal';
import { ShareModal } from '@/components/ShareModal';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Cinebid — The Live Indian Cinema Fandom Leaderboard',
  description: 'Bid on the hero you love. Push them up the public leaderboard. Get outbid. Fight back.',
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
    <html lang="en" className={`${jakarta.variable} dark antialiased`}>
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[#ff5722] selection:text-white">
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
          </CinebidProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
