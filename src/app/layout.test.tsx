import { describe, expect, it, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

vi.mock('@ant-design/nextjs-registry', () => ({
  AntdRegistry: ({ children }: { children: React.ReactNode }) => children,
}));

import RootLayout, { metadata, viewport } from './layout';

describe('app/layout', () => {
  it('metadata に SITE_NAME と description が設定されている', () => {
    expect(metadata.title).toEqual({
      default: 'GitHub Repository Searcher',
      template: '%s | GitHub Repository Searcher',
    });
    expect(metadata.description).toMatch(/GitHub 上のリポジトリ/);
    expect(metadata.applicationName).toBe('GitHub Repository Searcher');
  });

  it('viewport に initialScale=1 と device-width が設定されている', () => {
    expect(viewport).toEqual({ width: 'device-width', initialScale: 1 });
  });

  it('RootLayout は html/body と children を含む要素を返す', () => {
    const element = RootLayout({ children: 'CHILD' as unknown as React.ReactNode });
    expect(element.type).toBe('html');
    expect(element.props.lang).toBe('ja');
    expect(element.props.className).toMatch(/--font-geist-sans/);
    expect(element.props.className).toMatch(/--font-geist-mono/);
    expect(element.props.children.type).toBe('body');
  });
});
