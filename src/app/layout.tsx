import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
export const metadata: Metadata = { title: "TubeDict | 유튜브 받아쓰기", description: "한 구절씩 듣고, 직접 쓰고, 다시 들어보세요." };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body><header className="site-header"><Link href="/" className="brand">TubeDict</Link><span>유튜브로 하는 영어 받아쓰기</span></header><main>{children}</main><footer>한 구절씩, 내 속도로.</footer></body></html>;
}
