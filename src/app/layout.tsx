import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Header from '@/frontend/components/organisms/Header';
import { RepositoriesProvider } from '@/frontend/contexts/RepositoriesContext';

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
    <html lang='js' className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body>
        <AntdRegistry>
          <Header />
          <RepositoriesProvider>{children}</RepositoriesProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
