import type { Metadata } from 'next';
import './globals.css';

/** 검색 결과와 브라우저에서 서비스 설명을 일관되게 제공한다. */
export const metadata: Metadata = {
  title: 'graduate me | 문맥으로 배우는 언어',
  description: '읽고, 듣고, 질문하며 나의 언어로 만들어 가세요.',
};

/** 페이지 전환에도 공통 화면 틀과 기본 스타일을 유지한다. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body>{children}</body>
    </html>
  );
}
