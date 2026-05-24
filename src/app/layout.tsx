import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import Header from '@/frontend/components/organisms/Header';
import { RepositoriesProvider } from '@/frontend/contexts/RepositoriesContext';
import './globals.scss';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_NAME = 'GitHub Repository Searcher';
const SITE_DESCRIPTION =
  'GitHub 上のリポジトリをキーワードから検索し、スター数や言語などの詳細情報を素早く確認できる Web アプリです。';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['GitHub', 'リポジトリ', '検索', 'OSS', 'Next.js'],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja' className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AntdRegistry>
          <Header />
          <RepositoriesProvider>{children}</RepositoriesProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
