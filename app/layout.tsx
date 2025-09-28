import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | ELLA Legal',
    default: 'ELLA Legal Documents',
  },
  description: 'Legal documents for ELLA',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
