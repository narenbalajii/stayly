import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { auth } from '@/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stayly | Find your next place to stay',
  description: 'A modern Airbnb-style property discovery and booking platform.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-stone-900 antialiased`}>
        <Providers session={session}>
          <Navbar />
          <div className="pt-20">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
