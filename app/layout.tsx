import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TippyTip - Tip creators instantly with every like',
  description: 'A Solana miniapp that allows users to automatically or manually tip creators in SOL or SPL tokens when they like content.',
  keywords: ['solana', 'tipping', 'creators', 'miniapp', 'base'],
  openGraph: {
    title: 'TippyTip - Tip creators instantly with every like',
    description: 'Tip creators instantly with every like on Solana.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
