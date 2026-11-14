'use client';
import type { ReactNode } from 'react';
import NextLink from 'next/link';
import { Theme } from '@astryxdesign/core/theme';
import { LinkProvider } from '@astryxdesign/core/Link';
import { InternationalizationProvider } from '@astryxdesign/core/i18n';
import koKR from '@astryxdesign/core/locales/ko-KR.generated.js';
import { pgmTheme } from '@/lib/styles/pgm';

/** 화면과 포털에 같은 Astryx 테마, 한국어 안내와 Next.js 탐색을 제공한다. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <InternationalizationProvider
      locale='ko-KR'
      messages={{ 'ko-KR': koKR }}>
      <Theme
        theme={pgmTheme}
        mode='light'>
        <LinkProvider component={NextLink}>{children}</LinkProvider>
      </Theme>
    </InternationalizationProvider>
  );
}
