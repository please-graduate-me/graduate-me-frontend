import { NextResponse, type NextRequest } from 'next/server';

/** 로그인 후 학습 위치로 돌아가도록 서버가 확인한 상대 경로를 전달한다. */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);

  headers.set(
    'x-graduate-return-path',
    request.nextUrl.pathname + request.nextUrl.search
  );

  return NextResponse.next({ request: { headers } });
}

/** 정적 자원과 API 전송에는 학습 화면의 복귀 경로를 주입하지 않는다. */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|fonts/|favicon.ico).*)'],
};
