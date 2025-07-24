import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import '../testAPI'; // Auto-test API on load
import '../test-backend'; // Auto-test backend connection
import '../direct-test'; // Direct API test

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trading Journal AI - Professional Trading Analytics',
  description: 'Track, analyze, and improve your trading performance with AI-powered insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent MetaMask auto-injection errors
              if (typeof window !== 'undefined' && window.ethereum) {
                window.addEventListener('error', function(e) {
                  if (e.message && e.message.includes('MetaMask')) {
                    e.preventDefault();
                    console.warn('MetaMask error prevented:', e.message);
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}